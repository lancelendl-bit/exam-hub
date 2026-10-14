/* Stem decoder page: renders a cert's built-in decoder plus the phrases you added, as a searchable reference,
   with a form to add, edit and delete your own. HTML strings, like the rest of the app. */
import { LIMITS } from "./userDecoders.js";

const esc = (t) => String(t == null ? "" : t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const hl = (s, q) => {
  const e = esc(s);
  if (!q) return e;
  const i = String(s).toLowerCase().indexOf(q);
  if (i < 0) return e;
  return esc(s.slice(0, i)) + "<mark>" + esc(s.slice(i, i + q.length)) + "</mark>" + esc(s.slice(i + q.length));
};
const matches = (row, q) => !q || row.join(" ").toLowerCase().includes(q);

export function countPhrases(d, user) {
  const own = user ? user.tables.reduce((n, t) => n + t.rows.length, 0) : 0;
  const built = d ? d.tables.reduce((n, t) => n + t.rows.length, 0) + (d.traps || []).reduce((n, g) => n + g.items.length, 0) : 0;
  return built + own;
}

function builtinTables(d, q) {
  let shown = 0;
  const html = d.tables.map((t) => {
    const rows = t.rows.filter((r) => matches(r, q));
    shown += rows.length;
    const head = t.cols.map((c, i) => `<th class="${i === 2 ? "hidesm" : ""}">${esc(c)}</th>`).join("");
    const body = rows.length
      ? rows.map((r) => `<tr>${r.map((c, i) => `<td class="${i === 0 ? "first" : ""}${i === 2 ? " wrongpick hidesm" : ""}">${hl(c, q)}</td>`).join("")}</tr>`).join("")
      : `<tr><td colspan="${t.cols.length}" class="prog">No matches in this section.</td></tr>`;
    return `<section id="dec-${esc(t.id)}" class="stack" style="gap:8px"><div><h2>${esc(t.h)}</h2><p class="prog">${esc(t.sub || "")}</p></div>
      <div class="card tblwrap" style="padding:0"><table class="tbl"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div></section>`;
  }).join("");
  return { html, shown };
}

function userTables(user, q, armed) {
  let shown = 0;
  const html = user.tables.map((t) => {
    const rows = t.rows.map((r, i) => ({ r, i })).filter(({ r }) => matches(r, q));
    shown += rows.length;
    const body = rows.length
      ? rows.map(({ r, i }) => `<tr><td class="first">${hl(r[0], q)}</td><td>${hl(r[1], q)}</td><td class="wrongpick hidesm">${hl(r[2] || "", q)}</td>
          <td class="uact"><button class="btn small ghost" data-uedit="${esc(t.id)}:${i}" aria-label="Edit ${esc(r[0])}">Edit</button><button class="btn small ghost" data-udel="${esc(t.id)}:${i}" aria-label="Delete ${esc(r[0])}">✕</button></td></tr>`).join("")
      : `<tr><td colspan="4" class="prog">No matches in this table.</td></tr>`;
    return `<section id="dec-${esc(t.id)}" class="stack" style="gap:8px"><div class="row" style="justify-content:space-between"><div><h2>${esc(t.h)} <span class="tag">Yours</span></h2><p class="prog">${t.rows.length} phrase${t.rows.length === 1 ? "" : "s"} you added.</p></div>
      <button class="btn small ${armed === t.id ? "danger" : "ghost"}" data-utdel="${esc(t.id)}">${armed === t.id ? "Confirm: delete table" : "Delete table"}</button></div>
      <div class="card tblwrap" style="padding:0"><table class="tbl"><thead><tr><th>Stem says</th><th>Points to</th><th class="hidesm">Typical wrong pick</th><th></th></tr></thead><tbody>${body}</tbody></table></div></section>`;
  }).join("");
  return { html, shown };
}

/** Everything under the search box, filtered by the search text. Returns {html, shown}. */
export function bodyHTML(d, query, user = { tables: [] }, armed = null) {
  const q = (query || "").trim().toLowerCase();
  const own = userTables(user, q, armed);
  let shown = own.shown, html = own.html;
  if (d) {
    const b = builtinTables(d, q);
    shown += b.shown;
    html = b.html + html;
    const traps = (d.traps || []).map((g) => {
      const items = g.items.filter((x) => matches(x, q));
      shown += items.length;
      return items.length ? `<p><b>${esc(g.h)}</b></p><ul style="margin:6px 0 14px;padding-left:20px">${items.map((x) => `<li><b>${hl(x[0], q)}</b>: ${hl(x[1], q)}</li>`).join("")}</ul>` : "";
    }).join("");
    html += `<section id="dec-traps" class="stack" style="gap:8px"><div><h2>Trap words and distractor patterns</h2><p class="prog">Small words in the stem flip the answer. Wrong options are usually real features used in the wrong place.</p></div>
      <div class="card">${traps || `<p class="prog">No matches.</p>`}</div></section>`;
  }
  if (!html) html = `<div class="card"><p class="prog">Nothing here yet. Add your first phrase above.</p></div>`;
  return { html, shown };
}

function formHTML(user, ctx) {
  const e = ctx.editing;
  const row = e ? (user.tables.find((t) => t.id === e.tableId) || { rows: [] }).rows[e.index] : null;
  // After a rejected phrase, keep what was typed so it can be fixed instead of retyped.
  const base = row || (ctx.draft ? [ctx.draft.stem, ctx.draft.answer, ctx.draft.wrong] : null);
  const tableOpts = user.tables.map((t) => `<option value="${esc(t.id)}" ${e && e.tableId === t.id ? "selected" : ""}>${esc(t.h)}</option>`).join("");
  const domains = Object.entries(ctx.domains || {}).map(([k, v]) => `<option value="${esc(k)}">${esc(k)}. ${esc(v)}</option>`).join("");
  const open = ctx.open || e || ctx.err || !ctx.hasBuiltin ? "open" : "";
  return `<details class="card stack" id="decAdd" ${open}><summary><b>${e ? "Edit a phrase" : "Add your own phrases"}</b> <span class="prog">They show on this page and feed a quiz made from your phrases.</span></summary>
    <div class="stack" style="gap:10px;margin-top:10px">
      <label class="prog" for="uStem">Stem says (a phrase from a question)</label>
      <input type="text" id="uStem" maxlength="${LIMITS.stem}" value="${esc(base ? base[0] : "")}" placeholder="for example: minimize administrative effort">
      <label class="prog" for="uAns">Points to (a short answer, it becomes a quiz option)</label>
      <input type="text" id="uAns" maxlength="${LIMITS.answer}" value="${esc(base ? base[1] : "")}" placeholder="for example: one central setting">
      <label class="prog" for="uWrong">Typical wrong pick (optional: something that also works but loses on that phrase)</label>
      <input type="text" id="uWrong" maxlength="${LIMITS.wrong}" value="${esc(base ? base[2] : "")}" placeholder="for example: configuring every item one by one">
      <div class="row">
        <label class="prog" for="uTable">Table</label>
        <select id="uTable" ${e ? "disabled" : ""}>${tableOpts}<option value="__new" ${!user.tables.length ? "selected" : ""}>New table…</option></select>
        <span id="uNew" class="row" ${user.tables.length ? "hidden" : ""}><input type="text" id="uName" maxlength="${LIMITS.table}" placeholder="New table name" aria-label="New table name"><select id="uD" aria-label="Skill area">${domains}</select></span>
      </div>
      <div class="row"><button class="btn primary" id="uAdd">${e ? "Save changes" : "Add phrase"}</button>${e ? `<button class="btn ghost" id="uCancel">Cancel</button>` : ""}</div>
      ${e ? "" : `<details><summary class="prog">Paste many at once</summary>
        <div class="stack" style="gap:8px;margin-top:8px"><p class="prog">One phrase per line: <code>phrase | points to | wrong pick (optional)</code>. Tabs work too, so you can paste rows from a spreadsheet. Duplicates and bad lines are skipped and listed.</p>
        <textarea id="uBulk" rows="6" placeholder="minimize administrative effort | one central setting | configuring every item one by one">${esc(ctx.bulk || "")}</textarea>
        <div class="row"><button class="btn" id="uBulkAdd">Add all</button>${user.tables.length ? `<button class="btn ghost" id="uCopy">Copy my phrases</button>` : ""}</div></div></details>`}
      <p class="prog" id="uMsg" role="status">${ctx.err ? `<span style="color:var(--bad)">${esc(ctx.err)}</span>` : esc(ctx.msg || "")}</p>
      ${ctx.skipped && ctx.skipped.length ? `<ul class="prog" style="margin:0;padding-left:18px">${ctx.skipped.slice(0, 8).map((s) => `<li>${esc(s.line)}: ${esc(s.reason)}</li>`).join("")}${ctx.skipped.length > 8 ? `<li>and ${ctx.skipped.length - 8} more skipped</li>` : ""}</ul>` : ""}
    </div></details>`;
}

export function decoderHTML(cert, d, ctx) {
  const user = ctx.user;
  const how = d ? (d.how || []).map((h) => `<li><b>${esc(h[0])}</b> ${esc(h[1])}</li>`).join("") : "";
  const chips = [...(how ? [["how", "Reading"]] : []), ...(d ? d.tables.map((t) => [t.id, t.h.split(" ")[0]]) : []), ...user.tables.map((t) => [t.id, t.h]), ...(d ? [["traps", "Traps"]] : [])]
    .map(([id, l]) => `<button class="chip" data-jump="dec-${esc(id)}">${esc(l)}</button>`).join("");
  const intro = d ? d.intro : `There is no built-in decoder for ${cert.code} yet. Build your own below: the last sentence of a question names the constraint that decides the answer, so collect the phrases you notice and what they point to.`;
  return `<div class="stack decoder"><div class="stack" style="gap:8px"><span class="tag">${esc(cert.code)} · stem decoder</span><h1>Stem decoder</h1><p class="lede">${esc(intro || "")}</p></div>
    ${formHTML(user, { ...ctx, hasBuiltin: !!d })}
    <div class="card stack" style="gap:10px"><input type="search" id="decQ" placeholder="Filter phrases" aria-label="Filter phrases"><div class="row"><span class="prog" id="decCount"></span></div><div class="filters">${chips}</div></div>
    ${how ? `<section id="dec-how" class="stack" style="gap:8px"><h2>How to read a stem</h2><div class="card"><ol style="margin:0;padding-left:22px;display:flex;flex-direction:column;gap:6px">${how}</ol></div></section>` : ""}
    <div id="decBody" class="stack"></div>
    <div class="row"><button class="btn primary" id="decQuiz">Go to the quizzes</button><span class="prog">${d ? "A quiz from the built-in phrases is on the exam list. " : ""}${ctx.userQuizOk ? "So is one made from your phrases." : "Add a few phrases and a quiz from them appears there too."}</span></div>
    ${ctx.quizSkipped > 0 ? `<p class="prog">${ctx.quizSkipped} of your phrases ${ctx.quizSkipped === 1 ? "is" : "are"} not in the quiz, because the answers are too alike to make clearly different options. Make those answers more distinct.</p>` : ""}</div>`;
}

export function bindDecoder(root, d, ctx, act) {
  const user = ctx.user;
  const body = root.querySelector("#decBody"), count = root.querySelector("#decCount"), input = root.querySelector("#decQ");
  const $ = (s) => root.querySelector(s);
  let armed = null;
  const total = () => countPhrases(d, user);
  const draw = () => {
    const { html, shown } = bodyHTML(d, input.value, user, armed);
    body.innerHTML = html;
    count.textContent = input.value.trim() ? `${shown} of ${total()} phrases` : `${total()} phrases`;
  };
  input.oninput = draw;
  draw();

  root.querySelectorAll("[data-jump]").forEach((b) => (b.onclick = () => {
    const el = root.querySelector(`#${b.dataset.jump}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }));
  $("#decQuiz").onclick = act.onQuiz;

  // Row and table actions work through one delegated handler, because the body is redrawn as you search.
  body.onclick = (e) => {
    const t = e.target.closest("button");
    if (!t) return;
    const split = (v) => { const k = v.lastIndexOf(":"); return [v.slice(0, k), Number(v.slice(k + 1))]; };
    if (t.dataset.uedit) { const [tableId, index] = split(t.dataset.uedit); act.onEdit(tableId, index); }
    else if (t.dataset.udel) { const [tableId, index] = split(t.dataset.udel); act.onDelete(tableId, index); }
    else if (t.dataset.utdel) {
      if (armed === t.dataset.utdel) act.onDeleteTable(t.dataset.utdel);
      else { armed = t.dataset.utdel; draw(); }
    }
  };

  // The form.
  const sel = $("#uTable");
  const newBox = $("#uNew");
  const target = () => (sel.value === "__new" ? { name: $("#uName").value, d: $("#uD").value } : sel.value);
  sel.onchange = () => { newBox.hidden = sel.value !== "__new"; };
  const fields = () => ({ stem: $("#uStem").value, answer: $("#uAns").value, wrong: $("#uWrong").value });
  $("#uAdd").onclick = () => (ctx.editing ? act.onSave(ctx.editing, fields()) : act.onAdd(target(), fields()));
  const submitOnEnter = (e) => { if (e.key === "Enter") { e.preventDefault(); $("#uAdd").click(); } };
  ["#uStem", "#uAns", "#uWrong", "#uName"].forEach((s) => { const el = $(s); if (el) el.onkeydown = submitOnEnter; });
  const cancel = $("#uCancel");
  if (cancel) cancel.onclick = act.onCancel;
  const bulk = $("#uBulkAdd");
  if (bulk) bulk.onclick = () => act.onBulk(target(), $("#uBulk").value);
  const copy = $("#uCopy");
  if (copy) copy.onclick = act.onCopy;
}
