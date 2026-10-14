/* Service map data helpers: lookups, neighbours, flows, search, glossary and validation. Pure, unit-tested.

   A map is data, one file per cert in src/content/maps/<certId>.js:
   { title, intro, src:[urls], groups:{id:label}, columns:[heading,...],
     nodes:[{id, g, col, name, sub, what, feat:[], lingo:[[term,def]], traps:[]}],
     edges:[[fromId, toId, label]], flows:[{name, desc, steps:[[nodeId, text]]}] }
   Nodes keep the order they are listed in within their column. */

export const PALETTE = 8;
export const LIMITS = { name: 24, sub: 44, what: 160, feat: 140, lingo: 160, trap: 140, label: 18, step: 160 };

export function indexMap(map) {
  const byId = Object.fromEntries(map.nodes.map((n) => [n.id, n]));
  const groupIndex = Object.fromEntries(Object.keys(map.groups).map((g, i) => [g, i % PALETTE]));
  return { byId, groupIndex };
}

/** The node itself, the nodes it links to or from, and which edges those are. */
export function neighbors(map, id) {
  const ids = new Set([id]);
  const edges = new Set();
  map.edges.forEach((e, i) => {
    if (e[0] === id || e[1] === id) { ids.add(e[0]); ids.add(e[1]); edges.add(i); }
  });
  return { ids, edges };
}

/** Links out of a node and into it, as {id, label} lists. */
export function links(map, id) {
  const out = [], inn = [];
  map.edges.forEach((e) => {
    if (e[0] === id) out.push({ id: e[1], label: e[2] || "" });
    if (e[1] === id) inn.push({ id: e[0], label: e[2] || "" });
  });
  return { out, inn };
}

/** The nodes of a flow in order, and the edges that join consecutive steps (in either direction). */
export function flowPath(map, flow) {
  const ids = flow.steps.map((s) => s[0]);
  const edges = new Set();
  for (let k = 0; k < ids.length - 1; k++) {
    map.edges.forEach((e, i) => { if ((e[0] === ids[k] && e[1] === ids[k + 1]) || (e[1] === ids[k] && e[0] === ids[k + 1])) edges.add(i); });
  }
  return { ids, edges };
}

/** Ids of nodes that match a search: name, sub, description, features, traps and glossary terms. */
export function searchNodes(map, q) {
  const needle = (q || "").trim().toLowerCase();
  const hit = new Set();
  if (!needle) return hit;
  map.nodes.forEach((n) => {
    const hay = [n.name, n.sub, n.what, ...(n.feat || []), ...(n.traps || []), ...(n.lingo || []).flat()].join(" ").toLowerCase();
    if (needle.split(/\s+/).every((w) => hay.includes(w))) hit.add(n.id);
  });
  return hit;
}

export function glossary(map) {
  return map.nodes.flatMap((n) => (n.lingo || []).map(([term, def]) => ({ term, def, id: n.id })))
    .sort((a, b) => a.term.localeCompare(b.term));
}

/** Problems with a map's data, as readable strings. Empty means it is sound. */
export function validateMap(map) {
  const errs = [];
  const add = (m) => errs.push(m);
  if (!map.title) add("missing title");
  if (!map.intro) add("missing intro");
  if (!Array.isArray(map.src) || !map.src.length) add("missing src list");
  const groups = Object.keys(map.groups || {});
  if (!groups.length || groups.length > PALETTE) add(`needs 1 to ${PALETTE} groups`);
  const cols = (map.columns || []).length;
  if (cols < 3 || cols > 7) add("needs 3 to 7 columns");
  const ids = new Set();
  const perCol = new Array(cols).fill(0);
  map.nodes.forEach((n) => {
    const w = `node ${n.id}`;
    if (!/^[a-z0-9_]+$/.test(n.id || "")) add(`${w}: id must be lowercase letters, digits and underscore`);
    if (ids.has(n.id)) add(`${w}: duplicate id`);
    ids.add(n.id);
    if (!groups.includes(n.g)) add(`${w}: unknown group ${n.g}`);
    if (!Number.isInteger(n.col) || n.col < 0 || n.col >= cols) add(`${w}: col out of range`);
    else perCol[n.col]++;
    if (!n.name || n.name.length > LIMITS.name) add(`${w}: name must be 1 to ${LIMITS.name} characters`);
    if (!n.sub || n.sub.length > LIMITS.sub) add(`${w}: sub must be 1 to ${LIMITS.sub} characters`);
    if (!n.what || n.what.length > LIMITS.what) add(`${w}: what must be 1 to ${LIMITS.what} characters`);
    if (!n.feat || n.feat.length < 1 || n.feat.length > 6) add(`${w}: needs 1 to 6 feat items`);
    (n.feat || []).forEach((f) => { if (!f || f.length > LIMITS.feat) add(`${w}: feat item over ${LIMITS.feat} characters`); });
    (n.lingo || []).forEach((l) => { if (l.length !== 2 || !l[0] || !l[1] || l[1].length > LIMITS.lingo) add(`${w}: bad lingo entry ${l[0]}`); });
    (n.traps || []).forEach((t) => { if (!t || t.length > LIMITS.trap) add(`${w}: trap over ${LIMITS.trap} characters`); });
  });
  perCol.forEach((c, i) => { if (c > 8) add(`column ${i} has ${c} nodes, at most 8`); if (c === 0) add(`column ${i} is empty`); });
  const seen = new Set();
  map.edges.forEach((e, i) => {
    if (e.length < 2 || e.length > 3) add(`edge ${i}: needs [from, to, label]`);
    if (!ids.has(e[0]) || !ids.has(e[1])) add(`edge ${i}: ${e[0]} -> ${e[1]} uses an unknown node`);
    if (e[0] === e[1]) add(`edge ${i}: links a node to itself`);
    if ((e[2] || "").length > LIMITS.label) add(`edge ${i}: label over ${LIMITS.label} characters`);
    const k = `${e[0]}>${e[1]}`;
    if (seen.has(k)) add(`edge ${i}: repeats ${k}`);
    seen.add(k);
  });
  (map.flows || []).forEach((f) => {
    if (!f.name || !f.desc) add("a flow needs a name and desc");
    if (f.steps.length < 3 || f.steps.length > 6) add(`flow ${f.name}: needs 3 to 6 steps`);
    f.steps.forEach((s) => {
      if (!ids.has(s[0])) add(`flow ${f.name}: unknown node ${s[0]}`);
      if (!s[1] || s[1].length > LIMITS.step) add(`flow ${f.name}: step text must be 1 to ${LIMITS.step} characters`);
    });
  });
  return errs;
}
