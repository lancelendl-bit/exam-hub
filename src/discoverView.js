/* "Find a cert" page: where you stand, certifications you have passed, a shortlist, and a filterable list of
   certifications you could pursue next. Renders HTML strings like the rest of the app. */
import { LEVELS, TOPICS, platformsOf, filterCatalog, fitFor } from "./discover.js";
import { PASS } from "./history.js";

const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const today = () => new Date().toISOString().slice(0, 10);

/* ---------- where you stand ---------- */
function standingHTML({ practice, earnedCount }) {
  const rows = practice.map((p) => {
    const s = p.summary;
    const state = !p.started ? `<span class="tag muted">Not started</span>`
      : p.atPass ? `<span class="tag good">▲ At pass level</span>`
      : `<span class="tag warn">${PASS - s.avg3} below pass</span>`;
    return `<tr><td><b>${esc(p.cert.code)}</b><br><span class="prog">${esc(p.cert.short)}</span></td>
      <td>${s.count}</td><td>${s.best ?? "–"}</td><td>${s.avg3 ?? "–"}</td><td>${state}</td>
      <td>${p.weakest ? esc(p.weakest.name) + ` <span class="prog">${p.weakest.pct}%</span>` : "–"}</td>
      <td><button class="btn small" data-practice="${p.cert.id}">Practice</button></td></tr>`;
  }).join("");
  const attempts = practice.reduce((n, p) => n + p.summary.count, 0);
  const started = practice.filter((p) => p.started).length;
  const atPass = practice.filter((p) => p.atPass).length;
  const tile = (v, l) => `<div class="card stat"><b>${v}</b><span>${l}</span></div>`;
  return `<div class="card stack"><h3>Where you stand</h3>
    <div class="kpis">${tile(earnedCount, earnedCount === 1 ? "Certification passed" : "Certifications passed")}${tile(started, "Certs in practice")}${tile(atPass, "At pass level in practice")}${tile(attempts, "Practice attempts")}</div>
    <div class="tblwrap"><table class="tbl"><thead><tr><th>Certification</th><th>Attempts</th><th>Best</th><th>Avg, last 3</th><th>Status</th><th>Weakest area</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>
    <p class="prog">Practice scores are a linear estimate against ${PASS} of 1000. See the History page for charts and the items you keep missing.</p></div>`;
}

/* ---------- certifications you have passed ---------- */
function earnedHTML({ earned, nameOf, all, error }) {
  const taken = new Set(earned.items.map((x) => x.id));
  const options = all.filter((c) => !taken.has(c.id))
    .map((c) => `<option value="${esc(c.id)}">${esc(c.vendor)} ${esc(c.code)}: ${esc(c.title)}</option>`).join("");
  const rows = earned.items.map((x) => `<tr><td><b>${esc(nameOf(x).code)}</b></td><td>${esc(nameOf(x).title)}</td>
    <td><input type="date" data-edate="${esc(x.id)}" value="${esc(x.passedOn || "")}" max="${today()}" aria-label="Date passed for ${esc(nameOf(x).code)}"></td>
    <td><button class="btn small ghost" data-erm="${esc(x.id)}">Remove</button></td></tr>`).join("");
  return `<div class="card stack"><h3>Certifications you have passed</h3>
    ${rows ? `<div class="tblwrap"><table class="tbl"><thead><tr><th>Code</th><th>Certification</th><th>Date passed</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>` : `<p class="prog">None entered yet. Add the real certifications you hold. They shape the suggestions below.</p>`}
    <div class="stack" style="gap:8px">
      <div class="row"><select id="eSel" aria-label="Certification you passed"><option value="">Choose a certification…</option>${options}</select>
        <input type="date" id="eDate" max="${today()}" aria-label="Date passed"><button class="btn primary" id="eAdd">Add</button></div>
      <details><summary class="prog">Not listed? Add your own</summary>
        <div class="row" style="margin-top:8px"><input type="text" id="eCode" placeholder="Code, for example AZ-104" aria-label="Certification code"><input type="text" id="eTitle" placeholder="Title" aria-label="Certification title"><input type="date" id="eCDate" max="${today()}" aria-label="Date passed"><button class="btn" id="eCAdd">Add</button></div></details>
      <p class="prog" id="eMsg" role="status">${error ? esc(error) : ""}</p></div></div>`;
}

/* ---------- the list of certifications to pursue ---------- */
function cardHTML(e, { shortlist, earnedIds, fit, nameOf, requested }) {
  const on = shortlist.includes(e.id), got = earnedIds.has(e.id);
  const builds = e.buildsOn.map((id) => nameOf({ id }).code);
  return `<article class="card examcard"><span class="num">${esc(e.vendor)} · ${esc(e.code)}</span><h2>${esc(e.title)}</h2>
    <div class="status"><span class="tag">${esc(e.level)}</span>${e.topics.map((t) => `<span class="tag muted">${esc(t)}</span>`).join("")}${got ? `<span class="tag good">✓ Passed</span>` : ""}${requested && requested.has(e.id) ? `<span class="tag warn">In the queue</span>` : ""}</div>
    <p class="meta">${esc(e.audience)}</p>
    ${fit.reasons.length ? `<p class="meta fit">${fit.reasons.map(esc).join(" ")}</p>` : ""}
    ${builds.length ? `<p class="meta"><b>Usually follows:</b> ${builds.map(esc).join(", ")}</p>` : ""}
    ${e.prerequisites ? `<p class="meta"><b>Prerequisites:</b> ${esc(e.prerequisites)}</p>` : ""}
    ${e.format ? `<p class="meta"><b>Exam:</b> ${esc(e.format)}</p>` : ""}
    <details><summary class="prog">Skills measured (${e.skills.length}) · outline as of ${esc(e.asOf)}</summary>
      <ul class="skills">${e.skills.map((s) => `<li>${esc(s.name)} <span class="prog">${esc(s.weight)}</span></li>`).join("")}</ul></details>
    <div class="btns"><button class="btn ${on ? "primary" : ""}" data-short="${esc(e.id)}" aria-pressed="${on}">${on ? "★ Shortlisted" : "☆ Shortlist"}</button>
      ${got ? "" : `<button class="btn" data-pass="${esc(e.id)}">I passed this</button>`}
      <a class="btn ghost" href="${esc(e.url)}" target="_blank" rel="noopener">Official page ↗</a></div></article>`;
}

function listHTML(ctx) {
  const { filters, catalog, shortlist, earnedIds } = ctx;
  const shown = filterCatalog(catalog, { ...filters, shortlist });
  const scored = shown.map((e) => ({ e, fit: ctx.fits[e.id] }))
    .sort((a, b) => (earnedIds.has(a.e.id) - earnedIds.has(b.e.id)) || b.fit.score - a.fit.score || a.e.code.localeCompare(b.e.code));
  if (!scored.length) return `<p class="prog">Nothing matches those filters.</p>`;
  return `<div class="examgrid">${scored.map(({ e, fit }) => cardHTML(e, { shortlist, earnedIds, fit, nameOf: ctx.nameOf, requested: ctx.requested })).join("")}</div>`;
}

function chip(label, key, value, current) {
  return `<button class="chip" aria-pressed="${current === value}" data-f="${key}" data-v="${esc(value)}">${esc(label)}</button>`;
}

export function findHTML(ctx) {
  const { filters, catalog, shortlist } = ctx;
  const platforms = platformsOf(catalog);
  const shortItems = catalog.filter((e) => shortlist.includes(e.id));
  const inAppIds = ctx.inAppIds || new Set();
  const pending = shortItems.filter((e) => !inAppIds.has(e.id));
  const shortBox = shortItems.length
    ? `<div class="card stack"><div class="row" style="justify-content:space-between"><h3>Your shortlist (${shortItems.length})</h3>
        <div class="row"><button class="btn primary" id="shAdd" ${pending.length ? "" : "disabled"}>Add to Exams</button><button class="btn small" id="shCopy">Copy as text</button></div></div>
        <p>${shortItems.map((e) => `<b>${esc(e.code)}</b> ${esc(e.title)}`).join(" · ")}</p>
        <p class="prog" id="shMsg" role="status">${esc(ctx.msg || "Add to Exams queues these and copies an instruction. Paste it into Claude Code and it builds each one: the cert, a mock exam, a stem decoder and quiz, and a service map. The app can't build them by itself.")}</p></div>` : "";
  const reqItems = (ctx.requests ? ctx.requests.items : []);
  const reqBox = reqItems.length
    ? `<div class="card stack"><div class="row" style="justify-content:space-between"><h3>Added to Exams queue</h3><button class="btn small" id="reqCopy">Copy the instruction again</button></div>
        <div class="tblwrap"><table class="tbl"><thead><tr><th>Certification</th><th>Status</th><th></th></tr></thead><tbody>${reqItems.map((x) => {
          const e = ctx.all.find((c) => c.id === x.id) || { code: x.id, title: "" };
          const done = inAppIds.has(x.id);
          return `<tr><td><b>${esc(e.code)}</b> ${esc(e.title)}<br><span class="prog">Requested ${esc(new Date(x.at).toLocaleDateString())}</span></td>
            <td><span class="tag ${done ? "good" : "warn"}">${done ? "✓ Added" : "Waiting to be built"}</span></td>
            <td><button class="btn small ghost" data-unreq="${esc(x.id)}">${done ? "Clear" : "Cancel"}</button></td></tr>`;
        }).join("")}</tbody></table></div>
        <p class="prog" role="status">${!shortItems.length && ctx.msg ? esc(ctx.msg) : "A cert shows Added once it has exams in the app."}</p></div>` : "";
  return `<div class="stack finder"><div class="stack" style="gap:8px"><span class="tag">Find a certification</span><h1>What to pursue next</h1>
    <p class="lede">Azure-related certifications you could add next, with their official skill areas. Record what you have passed, and the suggestions adapt. Shortlist the ones you want, then ask for them to be added to the app. The suggested order is a judgment, not a Microsoft requirement.</p></div>
    ${standingHTML(ctx)}${earnedHTML(ctx)}${shortBox}${reqBox}
    <div class="card stack"><h3>Certifications to consider</h3>
      <input type="search" id="fQ" placeholder="Search by name, code or skill" value="${esc(filters.q)}" aria-label="Search certifications">
      <div class="filters" role="group" aria-label="Level">${LEVELS.map((l) => chip(l, "level", l, filters.level)).join("")}</div>
      <div class="filters" role="group" aria-label="Topic">${TOPICS.map((t) => chip(t, "topic", t, filters.topic)).join("")}</div>
      <div class="filters" role="group" aria-label="Platform">${platforms.map((p) => chip(p, "platform", p, filters.platform)).join("")}
        <button class="chip" aria-pressed="${filters.onlyShort}" data-f="onlyShort" data-v="1">Shortlist only</button></div></div>
    <div id="findList">${listHTML(ctx)}</div></div>`;
}

export function bindFind(root, ctx, act) {
  const $ = (s) => root.querySelector(s);
  const rebindList = () => {
    root.querySelectorAll("[data-short]").forEach((b) => (b.onclick = () => act.onShort(b.dataset.short)));
    root.querySelectorAll("[data-pass]").forEach((b) => (b.onclick = () => act.onEarn({ id: b.dataset.pass })));
  };
  rebindList();
  root.querySelectorAll("[data-practice]").forEach((b) => (b.onclick = () => act.onPractice(b.dataset.practice)));
  root.querySelectorAll("[data-erm]").forEach((b) => (b.onclick = () => act.onRemove(b.dataset.erm)));
  root.querySelectorAll("[data-edate]").forEach((i) => (i.onchange = () => act.onDate(i.dataset.edate, i.value)));
  $("#eAdd").onclick = () => { const id = $("#eSel").value; if (!id) return act.onError("Choose a certification first."); act.onEarn({ id, passedOn: $("#eDate").value }); };
  $("#eCAdd").onclick = () => act.onEarn({ code: $("#eCode").value, title: $("#eTitle").value, passedOn: $("#eCDate").value });
  const add = $("#shAdd");
  if (add) add.onclick = act.onRequest;
  root.querySelectorAll("[data-unreq]").forEach((b) => (b.onclick = () => act.onUnrequest(b.dataset.unreq)));
  const reqCopy = $("#reqCopy");
  if (reqCopy) reqCopy.onclick = act.onCopyRequest;
  const copy = $("#shCopy");
  if (copy) copy.onclick = async () => {
    const items = ctx.catalog.filter((e) => ctx.shortlist.includes(e.id));
    const text = `Add these certifications to Exam Hub as exams and diagrams: ${items.map((e) => `${e.code} (${e.title})`).join("; ")}`;
    try { await navigator.clipboard.writeText(text); $("#shMsg").textContent = "Copied."; } catch (e) { $("#shMsg").textContent = text; }
  };

  // Filters change only the list, so the search box keeps focus while you type.
  const refresh = () => { $("#findList").innerHTML = listHTML(ctx); rebindList(); };
  $("#fQ").oninput = (e) => { ctx.filters.q = e.target.value; refresh(); };
  root.querySelectorAll("[data-f]").forEach((b) => (b.onclick = () => {
    const k = b.dataset.f;
    if (k === "onlyShort") ctx.filters.onlyShort = !ctx.filters.onlyShort;
    else ctx.filters[k] = ctx.filters[k] === b.dataset.v ? "" : b.dataset.v;
    root.querySelectorAll(`[data-f="${k}"]`).forEach((x) => x.setAttribute("aria-pressed", k === "onlyShort" ? String(ctx.filters.onlyShort) : String(ctx.filters[k] === x.dataset.v)));
    refresh();
  }));
}

export { fitFor };
