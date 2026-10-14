/* Stem decoder page: renders any cert's decoder data as a searchable reference. HTML strings, like the rest of the app. */
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const hl = (s, q) => {
  const e = esc(s);
  if (!q) return e;
  const i = String(s).toLowerCase().indexOf(q);
  if (i < 0) return e;
  return esc(s.slice(0, i)) + "<mark>" + esc(s.slice(i, i + q.length)) + "</mark>" + esc(s.slice(i + q.length));
};
const matches = (row, q) => !q || row.join(" ").toLowerCase().includes(q);

export function countPhrases(d) {
  return d.tables.reduce((n, t) => n + t.rows.length, 0) + (d.traps || []).reduce((n, g) => n + g.items.length, 0);
}

/** Tables and trap lists, filtered by the search text. Returns {html, shown}. */
export function bodyHTML(d, query) {
  const q = (query || "").trim().toLowerCase();
  let shown = 0;
  const tables = d.tables.map((t) => {
    const rows = t.rows.filter((r) => matches(r, q));
    shown += rows.length;
    const head = t.cols.map((c, i) => `<th class="${i === 2 ? "hidesm" : ""}">${esc(c)}</th>`).join("");
    const body = rows.length
      ? rows.map((r) => `<tr>${r.map((c, i) => `<td class="${i === 0 ? "first" : ""}${i === 2 ? " wrongpick hidesm" : ""}">${hl(c, q)}</td>`).join("")}</tr>`).join("")
      : `<tr><td colspan="${t.cols.length}" class="prog">No matches in this section.</td></tr>`;
    return `<section id="dec-${esc(t.id)}" class="stack" style="gap:8px"><div><h2>${esc(t.h)}</h2><p class="prog">${esc(t.sub || "")}</p></div>
      <div class="card tblwrap" style="padding:0"><table class="tbl"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div></section>`;
  }).join("");
  const traps = (d.traps || []).map((g) => {
    const items = g.items.filter((x) => matches(x, q));
    shown += items.length;
    return items.length ? `<p><b>${esc(g.h)}</b></p><ul style="margin:6px 0 14px;padding-left:20px">${items.map((x) => `<li><b>${hl(x[0], q)}</b>: ${hl(x[1], q)}</li>`).join("")}</ul>` : "";
  }).join("");
  const trapBlock = `<section id="dec-traps" class="stack" style="gap:8px"><div><h2>Trap words and distractor patterns</h2><p class="prog">Small words in the stem flip the answer. Wrong options are usually real features used in the wrong place.</p></div>
    <div class="card">${traps || `<p class="prog">No matches.</p>`}</div></section>`;
  return { html: tables + trapBlock, shown };
}

export function decoderHTML(cert, d) {
  const how = (d.how || []).map((h) => `<li><b>${esc(h[0])}</b> ${esc(h[1])}</li>`).join("");
  const chips = [["how", "Reading"], ...d.tables.map((t) => [t.id, t.h.split(" ")[0]]), ["traps", "Traps"]]
    .map(([id, l]) => `<button class="chip" data-jump="dec-${esc(id)}">${esc(l)}</button>`).join("");
  return `<div class="stack decoder"><div class="stack" style="gap:8px"><span class="tag">${esc(cert.code)} · stem decoder</span><h1>Stem decoder</h1><p class="lede">${esc(d.intro || "")}</p></div>
    <div class="card stack" style="gap:10px"><input type="search" id="decQ" placeholder="Filter phrases" aria-label="Filter phrases"><div class="row"><span class="prog" id="decCount"></span></div><div class="filters">${chips}</div></div>
    ${how ? `<section id="dec-how" class="stack" style="gap:8px"><h2>How to read a stem</h2><div class="card"><ol style="margin:0;padding-left:22px;display:flex;flex-direction:column;gap:6px">${how}</ol></div></section>` : ""}
    <div id="decBody" class="stack"></div>
    <div class="row"><button class="btn primary" id="decQuiz">Quiz yourself on these phrases</button></div></div>`;
}

export function bindDecoder(root, d, { onQuiz }) {
  const total = countPhrases(d);
  const body = root.querySelector("#decBody"), count = root.querySelector("#decCount"), input = root.querySelector("#decQ");
  const draw = () => {
    const { html, shown } = bodyHTML(d, input.value);
    body.innerHTML = html;
    count.textContent = input.value.trim() ? `${shown} of ${total} phrases` : `${total} phrases`;
  };
  input.oninput = draw;
  draw();
  root.querySelectorAll("[data-jump]").forEach((b) => (b.onclick = () => {
    const el = root.querySelector(`#${b.dataset.jump}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }));
  root.querySelector("#decQuiz").onclick = onQuiz;
}
