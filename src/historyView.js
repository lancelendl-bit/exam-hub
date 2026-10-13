/* History page: renders analytics from src/history.js into HTML strings. No framework, like the rest of the app.
   Charts are hand-built SVG that use the app's CSS tokens, so light and dark themes both work. */
import { summarize, domainStats, topicStats, repeatMisses, forCert, toCsv, PASS } from "./history.js";

const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const fmtDate = (at, long) => new Date(at).toLocaleDateString(undefined, long ? { year: "numeric", month: "short", day: "numeric" } : { month: "short", day: "numeric" });
const strip = (t) => String(t || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

/* ---------- Score trend ---------- */
let W = 680, H = 280;
const M = { l: 44, r: 16, t: 16, b: 34 };
const px = (i, n) => (n === 1 ? M.l + (W - M.l - M.r) / 2 : M.l + (i * (W - M.l - M.r)) / (n - 1));
const py = (v) => M.t + (H - M.t - M.b) * (1 - v / 1000);

function trendChart(attempts, titleOf) {
  const n = attempts.length;
  // Size the drawing to the screen so text stays readable on a phone.
  W = Math.max(300, Math.min(680, (typeof window === "undefined" ? 720 : window.innerWidth) - 92));
  H = Math.round(Math.max(220, W * 0.4));
  const grid = [0, 250, 500, 750, 1000].map((v) => `<line x1="${M.l}" x2="${W - M.r}" y1="${py(v)}" y2="${py(v)}" class="gl"/><text x="${M.l - 8}" y="${py(v) + 4}" text-anchor="end" class="ax">${v}</text>`).join("");
  const pass = `<line x1="${M.l}" x2="${W - M.r}" y1="${py(PASS)}" y2="${py(PASS)}" class="passline"/><text x="${W - M.r}" y="${py(PASS) - 6}" text-anchor="end" class="ax strong">Pass ${PASS}</text>`;
  const every = Math.max(1, Math.ceil(n / 6));
  const xl = attempts.map((a, i) => (i % every === 0 || i === n - 1 ? `<text x="${px(i, n)}" y="${H - 10}" text-anchor="middle" class="ax">${fmtDate(a.at)}</text>` : "")).join("");
  const path = n > 1 ? `<path d="${attempts.map((a, i) => `${i ? "L" : "M"}${px(i, n).toFixed(1)} ${py(a.scaled).toFixed(1)}`).join(" ")}" class="ln"/>` : "";
  const marks = attempts.map((a, i) => {
    const x = px(i, n), y = py(a.scaled), ok = a.scaled >= PASS;
    return ok ? `<circle cx="${x}" cy="${y}" r="5" class="pt ok"/>` : `<path d="M${x} ${y - 6.5} L${x + 6.5} ${y} L${x} ${y + 6.5} L${x - 6.5} ${y} Z" class="pt no"/>`;
  }).join("");
  const hits = attempts.map((a, i) => {
    const label = `${titleOf(a.exam)}, ${fmtDate(a.at, true)}: ${a.scaled} of 1000, ${a.scaled >= PASS ? "passing" : "below passing"}`;
    return `<circle cx="${px(i, n)}" cy="${py(a.scaled)}" r="16" class="hit" tabindex="0" data-i="${i}" role="img" aria-label="${esc(label)}"/>`;
  }).join("");
  return `<div class="chartwrap"><svg viewBox="0 0 ${W} ${H}" class="trend" role="group" aria-label="Score for each attempt, oldest to newest">${grid}${pass}${xl}${path}${marks}${hits}</svg><div class="tip" hidden></div></div>
  <div class="legend"><span><svg width="14" height="14" viewBox="-7 -7 14 14" aria-hidden="true"><circle r="5" class="pt ok"/></svg> ${PASS} or above</span><span><svg width="14" height="14" viewBox="-7 -7 14 14" aria-hidden="true"><path d="M0 -6.5 L6.5 0 L0 6.5 L-6.5 0 Z" class="pt no"/></svg> Below ${PASS}</span><span>Dashed line: pass mark</span></div>`;
}

/* ---------- Bars ---------- */
const delta = (d) => (d == null || d === 0 ? "" : d > 0 ? `<small class="delta up">▲ ${d} pt${d === 1 ? "" : "s"}</small>` : `<small class="delta down">▼ ${-d} pt${d === -1 ? "" : "s"}</small>`);
const bar = (name, pct, extra = "") => `<div class="dbar"><span>${esc(name)} ${extra}</span><div class="track" title="Line marks 70%"><i style="width:${pct}%;background:${pct >= 70 ? "var(--accent)" : "var(--warn)"}"></i></div><span class="pct">${pct}%</span></div>`;

/* ---------- Page ---------- */
export function historyHTML({ h, certId, certs, titleOf, itemInfo, armed }) {
  const cert = certs.find((c) => c.id === certId) || certs[0];
  const attempts = forCert(h, cert.id);
  const switcher = certs.length > 1
    ? `<div class="certs" role="group" aria-label="Certification">${certs.map((c) => `<button class="pill" aria-pressed="${c.id === cert.id}" data-hcert="${c.id}">${esc(c.code)}<small style="margin-left:6px;font-weight:500">${esc(c.short)}</small></button>`).join("")}</div>`
    : "";
  const head = `${switcher}<div class="stack" style="gap:8px"><span class="tag">${esc(cert.code)} · history</span><h1>Your progress</h1>
    <p class="lede">Every finished exam and drill is recorded here, so you can see whether the score is moving and where it is stuck.</p></div>`;
  if (!attempts.length) {
    return `<div class="stack">${head}<div class="card stack"><h2>Nothing finished yet</h2><p class="meta">Finish an exam or a drill and it will show up here with your score, skill areas and the items you keep missing.</p></div></div>`;
  }

  const s = summarize(attempts);
  const areas = domainStats(attempts, cert.id);
  const topics = topicStats(attempts, cert.id);
  const misses = repeatMisses(attempts).filter((o) => o.stillMissed).slice(0, 10);
  const weakest = areas.slice().sort((a, b) => a.pct - b.pct)[0];
  const tile = (v, l) => `<div class="card stat"><b>${v}</b><span>${l}</span></div>`;
  const trend = s.count > 1 ? s.latest - s.first : null;

  const readiness = s.avg3 == null ? "" : s.avg3 >= PASS
    ? `Your last ${Math.min(3, s.count)} attempt${s.count > 1 ? "s" : ""} averaged <b>${s.avg3}</b>, above the ${PASS} pass mark.`
    : `Your last ${Math.min(3, s.count)} attempt${s.count > 1 ? "s" : ""} averaged <b>${s.avg3}</b>, ${PASS - s.avg3} short of the ${PASS} pass mark.${weakest ? ` Weakest area: <b>${esc(weakest.name)}</b>.` : ""}`;

  const rows = attempts.slice().reverse().map((a) => {
    const missed = a.items.filter(([, , p, m]) => p != null && p < m).length;
    const ok = a.scaled >= PASS;
    return `<tr><td>${fmtDate(a.at, true)}</td><td>${esc(titleOf(a.exam))}</td><td><b>${a.scaled}</b> <span class="prog">${a.got}/${a.tot}</span></td>
      <td><span class="tag ${ok ? "good" : "bad"}">${ok ? "▲ Pass" : "▼ Below"}</span></td><td>${missed}</td>
      <td><button class="btn small ghost" data-rm="${esc(a.id)}">${armed === a.id ? "Confirm remove" : "Remove"}</button></td></tr>`;
  }).join("");

  return `<div class="stack">${head}
  <div class="kpis">${tile(s.count, "Attempts")}${tile(s.best, "Best score")}${tile(s.latest, trend == null ? "Latest" : `Latest (${trend >= 0 ? "+" : ""}${trend} since first)`)}${tile(s.avg3, "Average, last 3")}${tile(`${s.passRate}%`, "Attempts passed")}${tile(s.days, s.days === 1 ? "Day practised" : "Days practised")}</div>
  ${readiness ? `<p class="lede">${readiness} <span class="prog">Scores here are a linear estimate. Microsoft scales the real exam non-linearly.</span></p>` : ""}
  <div class="card stack"><h3>Score by attempt</h3>${trendChart(attempts, titleOf)}</div>
  <div class="card stack"><h3>Skill areas</h3><p class="prog">Your last three attempts. The arrow compares them with everything before.</p>
    ${areas.map((a) => bar(a.name, a.pct, delta(a.delta))).join("") || `<p class="prog">Not enough data yet.</p>`}</div>
  <div class="card stack"><h3>Topics, weakest first</h3><p class="prog">Items are grouped into topics by keyword, so treat this as a guide. Blank items are left out. Topics need at least 3 answers.</p>
    ${topics.map((t) => bar(t.name, t.pct, `<small class="prog">· ${t.n} answers</small>`)).join("") || `<p class="prog">Not enough answers yet.</p>`}</div>
  <div class="card stack"><h3>Still missing</h3><p class="prog">Items you have got wrong at least twice, including your latest try.</p>
    ${misses.length ? misses.map((o) => { const info = itemInfo(o.exam, o.i); return `<div class="miss"><div class="row"><span class="tag bad">Missed ${o.misses} of ${o.seen}</span><span class="prog">${esc(titleOf(o.exam))} · item ${o.i + 1}</span></div>
      ${info ? `<p>${esc(strip(info.stem).slice(0, 180))}${strip(info.stem).length > 180 ? "…" : ""}</p>${info.ref ? `<a href="https://learn.microsoft.com/en-us/search/?terms=${encodeURIComponent(info.ref)}" target="_blank" rel="noopener">Look this up on Microsoft Learn ↗</a>` : ""}` : ""}</div>`; }).join("") : `<p class="prog">Nothing is being missed repeatedly. Keep retaking to see this fill in.</p>`}</div>
  <div class="card stack"><div class="row" style="justify-content:space-between"><h3>All attempts</h3><button class="btn small" id="hCsv">Export CSV</button></div>
    <div class="tblwrap"><table class="tbl"><thead><tr><th>Date</th><th>Exam</th><th>Score</th><th>Result</th><th>Missed</th><th></th></tr></thead><tbody>${rows}</tbody></table></div></div>
  </div>`;
}

export function bindHistory(root, { h, certId, certs, titleOf, onCert, onRemove, onArm }) {
  root.querySelectorAll("[data-hcert]").forEach((b) => (b.onclick = () => onCert(b.dataset.hcert)));
  root.querySelectorAll("[data-rm]").forEach((b) => (b.onclick = () => (b.textContent === "Remove" ? onArm(b.dataset.rm) : onRemove(b.dataset.rm))));
  const csv = root.querySelector("#hCsv");
  if (csv) csv.onclick = () => {
    const blob = new Blob([toCsv(forCert(h, certId), titleOf)], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `fabric-history-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  const wrap = root.querySelector(".chartwrap");
  if (!wrap) return;
  const tip = wrap.querySelector(".tip");
  const attempts = forCert(h, certId);
  const show = (el) => {
    const a = attempts[+el.dataset.i];
    const r = wrap.getBoundingClientRect(), b = el.getBoundingClientRect();
    tip.hidden = false;
    tip.innerHTML = `<b>${a.scaled}</b> / 1000 · ${a.scaled >= PASS ? "▲ pass" : "▼ below"}<br><span>${esc(titleOf(a.exam))}<br>${fmtDate(a.at, true)} · ${a.got} of ${a.tot} points</span>`;
    const x = b.left + b.width / 2 - r.left, half = tip.offsetWidth / 2;
    tip.style.left = `${Math.min(Math.max(x, half), r.width - half)}px`;
    tip.style.top = `${b.top + b.height / 2 - r.top - 18}px`;
  };
  wrap.querySelectorAll(".hit").forEach((el) => {
    el.onpointerenter = el.onfocus = () => show(el);
    el.onpointerleave = el.onblur = () => (tip.hidden = true);
  });
}
