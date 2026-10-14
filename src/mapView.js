/* Service map page: renders a cert's map data (src/content/maps/<certId>.js) as lanes of boxes with link lines,
   a detail panel, walk-through flows and a glossary. HTML strings plus an SVG overlay for the links. */
import { indexMap, neighbors, links, flowPath, searchNodes, glossary } from "./mapModel.js";
import { docsUrl } from "./certs.js";

const esc = (t) => String(t == null ? "" : t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

export function mapHTML(cert, map) {
  const { groupIndex } = indexMap(map);
  const lanes = map.columns.map((heading, ci) => `<div class="lane"><h4>${esc(heading)}</h4>${map.nodes.filter((n) => n.col === ci).map((n) =>
    `<button class="mnode" data-id="${esc(n.id)}" style="--c:var(--mg${groupIndex[n.g]})" aria-label="${esc(n.name)}: ${esc(n.sub)}"><span class="mname">${esc(n.name)}</span><span class="msub">${esc(n.sub)}</span><span class="mbadge" hidden></span></button>`).join("")}</div>`).join("");
  const chips = Object.entries(map.groups).map(([g, label]) => `<button class="chip" data-g="${esc(g)}" aria-pressed="false" style="--c:var(--mg${groupIndex[g]})"><i class="mdot"></i>${esc(label)}</button>`).join("");
  return `<div class="stack mapview"><div class="stack" style="gap:8px"><span class="tag">${esc(cert.code)} · service map</span><h1>${esc(map.title)}</h1><p class="lede">${esc(map.intro)}</p></div>
    <div class="card stack" style="gap:10px"><input type="search" id="mvQ" placeholder="Search services or terms" aria-label="Search services or terms" autocomplete="off">
      <div class="filters" id="mvGroups">${chips}</div><div class="row"><button class="btn small" id="mvClear">Clear</button><span class="prog" id="mvHint"></span></div></div>
    <div class="mapgrid ${map.columns.length > 4 ? "stacked" : ""}"><div class="card canvas"><div class="lanes" id="mvLanes" style="grid-template-columns:repeat(${map.columns.length},minmax(0,1fr));min-width:${map.columns.length * 150}px">${lanes}<svg class="links" id="mvLinks" aria-hidden="true"></svg></div></div>
    <aside class="card stack mpanel" id="mvPanel" aria-live="polite"></aside></div></div>`;
}

export function bindMap(root, cert, map) {
  const { byId, groupIndex } = indexMap(map);
  const $ = (s) => root.querySelector(s);
  const lanes = $("#mvLanes"), svg = $("#mvLinks"), panel = $("#mvPanel"), hint = $("#mvHint");
  const nodeEls = Object.fromEntries([...lanes.querySelectorAll(".mnode")].map((el) => [el.dataset.id, el]));
  const st = { sel: null, flow: null, tab: "detail", q: "", group: null, gq: "" };
  const color = (id) => `var(--mg${groupIndex[byId[id].g]})`;
  const chip = (id, label) => `<button class="mlink" data-go="${esc(id)}" style="--c:${color(id)}"><i class="mdot"></i>${esc(byId[id].name)}${label ? ` <span class="prog">${esc(label)}</span>` : ""}</button>`;

  /* ----- links drawn between the boxes (only when the lanes sit side by side) ----- */
  function geometry(id) {
    const r = nodeEls[id].getBoundingClientRect(), b = lanes.getBoundingClientRect();
    return { x: r.left - b.left, y: r.top - b.top, w: r.width, h: r.height };
  }
  function drawLinks() {
    if (getComputedStyle(svg).display === "none") return;
    const b = lanes.getBoundingClientRect();
    svg.setAttribute("viewBox", `0 0 ${b.width} ${b.height}`);
    svg.setAttribute("width", b.width);
    svg.setAttribute("height", b.height);
    const g = Object.fromEntries(Object.keys(nodeEls).map((id) => [id, geometry(id)]));
    let s = `<defs><marker id="mvArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>`;
    map.edges.forEach((e, i) => {
      const a = g[e[0]], c = g[e[1]], ca = byId[e[0]].col, cb = byId[e[1]].col;
      let x1, x2, d;
      const y1 = a.y + a.h / 2, y2 = c.y + c.h / 2;
      if (ca === cb) { x1 = a.x + a.w; x2 = c.x + c.w; d = `M${x1} ${y1} C${x1 + 36} ${y1} ${x2 + 36} ${y2} ${x2} ${y2}`; }
      else {
        x1 = cb > ca ? a.x + a.w : a.x; x2 = cb > ca ? c.x : c.x + c.w;
        const dx = Math.min(120, Math.max(30, Math.abs(x2 - x1) / 2)) * (cb > ca ? 1 : -1);
        d = `M${x1} ${y1} C${x1 + dx} ${y1} ${x2 - dx} ${y2} ${x2} ${y2}`;
      }
      s += `<path class="medge" data-i="${i}" d="${d}" marker-end="url(#mvArrow)"/>`;
      if (e[2]) s += `<text class="mlabel" data-i="${i}" x="${(x1 + x2) / 2}" y="${(y1 + y2) / 2 - 4}" text-anchor="middle">${esc(e[2])}</text>`;
    });
    svg.innerHTML = s;
    apply();
  }

  /* ----- which boxes and links are lit ----- */
  function state() {
    if (st.flow != null) { const p = flowPath(map, map.flows[st.flow]); return { ids: new Set(p.ids), edges: p.edges, order: p.ids }; }
    if (st.sel) { const n = neighbors(map, st.sel); return { ids: n.ids, edges: n.edges }; }
    const hits = searchNodes(map, st.q);
    if (st.q.trim()) return { ids: hits, edges: new Set(), search: true };
    if (st.group) return { ids: new Set(map.nodes.filter((n) => n.g === st.group).map((n) => n.id)), edges: new Set() };
    return null;
  }
  function apply() {
    const s = state();
    Object.entries(nodeEls).forEach(([id, el]) => {
      el.classList.toggle("dim", !!s && !s.ids.has(id));
      el.classList.toggle("sel", st.sel === id && st.flow == null);
      const badge = el.querySelector(".mbadge");
      const k = s && s.order ? s.order.indexOf(id) : -1;
      badge.hidden = k < 0;
      badge.textContent = k < 0 ? "" : String(k + 1);
    });
    svg.querySelectorAll(".medge").forEach((p) => { const on = !!s && s.edges.has(Number(p.dataset.i)); p.classList.toggle("on", on); p.classList.toggle("dim", !!s && !on); });
    svg.querySelectorAll(".mlabel").forEach((t) => t.classList.toggle("on", !!s && s.edges.has(Number(t.dataset.i))));
    hint.textContent = s && s.search ? `${s.ids.size} match${s.ids.size === 1 ? "" : "es"}` : "";
    root.querySelectorAll("#mvGroups .chip").forEach((c) => c.setAttribute("aria-pressed", String(st.group === c.dataset.g)));
  }

  /* ----- the panel ----- */
  const tabs = () => ["detail", "flows", "glossary"].map((t) => `<button class="pill" role="tab" aria-selected="${st.tab === t}" data-tab="${t}">${{ detail: "Detail", flows: "Flows", glossary: "Glossary" }[t]}</button>`).join("");
  function detail() {
    if (!st.sel) return `<p class="prog">Select a box to see what it does, what it connects to, its terms and the exam traps. Use Flows to follow a scenario from start to finish.</p>`;
    const n = byId[st.sel], l = links(map, st.sel);
    return `<div><span class="kicker" style="--c:${color(n.id)}"><i class="mdot"></i>${esc(map.groups[n.g])}</span><h2 style="margin-top:4px">${esc(n.name)}</h2><p class="prog">${esc(n.sub)}</p></div>
      <p>${esc(n.what)}</p><ul class="mfeat">${n.feat.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>
      ${l.out.length ? `<div><h3>Sends to</h3><div class="mlinks">${l.out.map((x) => chip(x.id, x.label)).join("")}</div></div>` : ""}
      ${l.inn.length ? `<div><h3>Receives from</h3><div class="mlinks">${l.inn.map((x) => chip(x.id, x.label)).join("")}</div></div>` : ""}
      ${(n.lingo || []).length ? `<div><h3>Lingo</h3><dl class="mdl">${n.lingo.map(([t, d]) => `<dt>${esc(t)}</dt><dd>${esc(d)}</dd>`).join("")}</dl></div>` : ""}
      ${(n.traps || []).length ? `<div class="mtraps"><h3>Exam traps</h3><ul>${n.traps.map((t) => `<li>${esc(t)}</li>`).join("")}</ul></div>` : ""}
      <a href="${esc(docsUrl(cert, n.name))}" target="_blank" rel="noopener">Look this up ↗</a>`;
  }
  function flows() {
    const list = map.flows.map((f, i) => `<button class="mflow" data-flow="${i}" aria-pressed="${st.flow === i}"><b>${esc(f.name)}</b><span class="prog">${esc(f.desc)}</span></button>`).join("");
    if (st.flow == null) return `<p class="prog">Pick a flow to light up its path on the map.</p><div class="stack" style="gap:8px">${list}</div>`;
    const f = map.flows[st.flow];
    return `<div class="stack" style="gap:8px">${list}</div><ol class="msteps">${f.steps.map(([id, t]) => `<li>${chip(id)}<p>${esc(t)}</p></li>`).join("")}</ol>`;
  }
  function gloss() {
    const q = st.gq.trim().toLowerCase();
    const rows = glossary(map).filter((r) => !q || `${r.term} ${r.def}`.toLowerCase().includes(q));
    return `<input type="search" id="mvGq" placeholder="Filter ${glossary(map).length} terms" value="${esc(st.gq)}" aria-label="Filter terms">
      <dl class="mdl">${rows.map((r) => `<dt>${esc(r.term)} ${chip(r.id)}</dt><dd>${esc(r.def)}</dd>`).join("") || `<p class="prog">No matches.</p>`}</dl>`;
  }
  function drawPanel() {
    panel.innerHTML = `<div class="row" role="tablist">${tabs()}</div>${st.tab === "detail" ? detail() : st.tab === "flows" ? flows() : gloss()}`;
    panel.querySelectorAll("[data-tab]").forEach((b) => (b.onclick = () => { st.tab = b.dataset.tab; if (st.tab !== "flows") st.flow = null; drawPanel(); apply(); }));
    panel.querySelectorAll("[data-go]").forEach((b) => (b.onclick = () => select(b.dataset.go)));
    panel.querySelectorAll("[data-flow]").forEach((b) => (b.onclick = () => { const i = Number(b.dataset.flow); st.flow = st.flow === i ? null : i; st.sel = null; drawPanel(); apply(); }));
    const gq = panel.querySelector("#mvGq");
    if (gq) gq.oninput = (e) => { st.gq = e.target.value; const pos = e.target.selectionStart; drawPanel(); const again = panel.querySelector("#mvGq"); again.focus(); again.setSelectionRange(pos, pos); };
  }
  function select(id) {
    st.flow = null; st.sel = st.sel === id && st.tab === "detail" ? null : id; st.tab = "detail";
    drawPanel(); apply();
    if (st.sel && nodeEls[id]) nodeEls[id].scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  Object.entries(nodeEls).forEach(([id, el]) => (el.onclick = () => select(id)));
  $("#mvQ").oninput = (e) => { st.q = e.target.value; if (st.q.trim()) { st.sel = null; st.flow = null; } apply(); };
  root.querySelectorAll("#mvGroups .chip").forEach((c) => (c.onclick = () => { st.group = st.group === c.dataset.g ? null : c.dataset.g; st.sel = null; st.flow = null; apply(); }));
  $("#mvClear").onclick = () => { st.sel = null; st.flow = null; st.q = ""; st.group = null; $("#mvQ").value = ""; drawPanel(); apply(); };

  drawPanel();
  drawLinks();
  let timer = null;
  const onResize = () => { clearTimeout(timer); timer = setTimeout(() => { if (document.body.contains(lanes)) drawLinks(); else window.removeEventListener("resize", onResize); }, 80); };
  window.addEventListener("resize", onResize);
}
