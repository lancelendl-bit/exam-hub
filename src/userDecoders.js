/* Phrases you add to a cert's stem decoder inside the app. Pure functions plus load/save helpers, unit-tested.

   A user decoder is saved per cert under dp700-hub-decoder-<certId>, so it syncs like the rest of your progress:
   {v:1, updatedAt, tables:[{id, h, d, rows:[[stem, answer, wrongPick]]}]}
   `d` is the skill area number the table mostly tests (a key of the cert's domains). wrongPick may be "".
   Rows are validated against the built-in decoder too, so a phrase never appears twice. */
import { decoderItems, sample } from "./decoderQuiz.js";

export const LIMITS = { stemMin: 3, stem: 160, answer: 140, wrong: 140, table: 60, minPool: 4 };
export const dkey = (certId) => `dp700-hub-decoder-${certId}`;

export function loadUserDecoder(certId, store = localStorage) {
  try {
    const o = JSON.parse(store.getItem(dkey(certId)));
    if (o && Array.isArray(o.tables)) return { v: 1, updatedAt: o.updatedAt || 0, tables: o.tables.filter((t) => t && Array.isArray(t.rows)) };
  } catch (e) { /* none yet */ }
  return { v: 1, updatedAt: 0, tables: [] };
}
export function saveUserDecoder(certId, doc, store = localStorage) {
  doc.updatedAt = Date.now();
  store.setItem(dkey(certId), JSON.stringify(doc));
}

const clean = (s) => String(s == null ? "" : s).replace(/\s+/g, " ").trim();
const key = (s) => clean(s).toLowerCase().replace(/[.\s]+$/, "");

/** Every stem phrase already in use: the built-in decoder's plus the user's. `except` skips one user row (when editing it). */
export function stemsInUse(builtin, doc, except) {
  const set = new Set();
  if (builtin) builtin.tables.forEach((t) => t.rows.forEach((r) => set.add(key(r[0]))));
  doc.tables.forEach((t) => t.rows.forEach((r, i) => {
    if (except && except.tableId === t.id && except.index === i) return;
    set.add(key(r[0]));
  }));
  return set;
}

/** Checks one phrase. Returns the cleaned row, or throws a readable message. */
export function checkPhrase({ stem, answer, wrong }, taken) {
  const s = clean(stem), a = clean(answer), w = clean(wrong);
  if (s.length < LIMITS.stemMin) throw new Error(`The phrase needs at least ${LIMITS.stemMin} characters.`);
  if (s.length > LIMITS.stem) throw new Error(`Keep the phrase under ${LIMITS.stem} characters.`);
  if (!a) throw new Error("Say what the phrase points to.");
  if (a.length > LIMITS.answer) throw new Error(`Keep "points to" under ${LIMITS.answer} characters, because it becomes a quiz option.`);
  if (w.length > LIMITS.wrong) throw new Error(`Keep the wrong pick under ${LIMITS.wrong} characters.`);
  if (w && key(w) === key(a)) throw new Error("The wrong pick can't be the same as the answer.");
  if (taken.has(key(s))) throw new Error(`"${s}" is already in the decoder.`);
  return [s, a, w];
}

const newId = (doc) => {
  let n = doc.tables.length + 1;
  while (doc.tables.some((t) => t.id === `mine-${n}`)) n++;
  return `mine-${n}`;
};

/** Finds a table by id, or creates one. `target` is an existing id, or {name, d} for a new table. */
export function ensureTable(doc, target, domains = { 1: "" }) {
  if (typeof target === "string") {
    const t = doc.tables.find((x) => x.id === target);
    if (!t) throw new Error("That table no longer exists.");
    return t;
  }
  const name = clean(target && target.name);
  if (!name) throw new Error("Give the new table a name.");
  if (name.length > LIMITS.table) throw new Error(`Keep the table name under ${LIMITS.table} characters.`);
  if (doc.tables.some((t) => key(t.h) === key(name))) throw new Error(`You already have a table called "${name}".`);
  const d = Number(target.d);
  const t = { id: newId(doc), h: name, d: Object.keys(domains).map(Number).includes(d) ? d : Number(Object.keys(domains)[0]) || 1, rows: [] };
  doc.tables.push(t);
  return t;
}

export function addPhrase(doc, builtin, target, fields, domains) {
  const row = checkPhrase(fields, stemsInUse(builtin, doc));
  const t = ensureTable(doc, target, domains);
  t.rows.push(row);
  return doc;
}

export function updatePhrase(doc, builtin, tableId, index, fields) {
  const t = doc.tables.find((x) => x.id === tableId);
  if (!t || !t.rows[index]) throw new Error("That phrase no longer exists.");
  t.rows[index] = checkPhrase(fields, stemsInUse(builtin, doc, { tableId, index }));
  return doc;
}

export function removePhrase(doc, tableId, index) {
  const t = doc.tables.find((x) => x.id === tableId);
  if (t) t.rows.splice(index, 1);
  doc.tables = doc.tables.filter((x) => x.rows.length || x.id !== tableId); // an empty table disappears
  return doc;
}

export function removeTable(doc, tableId) {
  doc.tables = doc.tables.filter((t) => t.id !== tableId);
  return doc;
}

/** Splits pasted text into phrases. Each line is `phrase | points to | wrong pick`, with tabs also accepted
    (so a spreadsheet or another tool's table can be pasted). A header line is skipped. */
export function parseBulk(text) {
  const rows = [], skipped = [];
  String(text || "").split(/\r?\n/).forEach((line, i) => {
    if (!clean(line)) return;
    const parts = (line.includes("\t") ? line.split("\t") : line.split("|")).map(clean).filter((p, k, a) => !(p === "" && k === a.length - 1 && a.length > 2));
    if (i === 0 && /^(stem says|phrase)$/i.test(parts[0])) return;
    if (parts.length < 2) { skipped.push({ line: clean(line), reason: "Needs a phrase and what it points to, separated by |" }); return; }
    rows.push({ stem: parts[0], answer: parts[1], wrong: parts[2] || "" });
  });
  return { rows, skipped };
}

/** Adds many phrases to one table. Bad or duplicate lines are skipped and reported, the rest are added. */
export function addBulk(doc, builtin, target, text, domains) {
  const { rows, skipped } = parseBulk(text);
  if (!rows.length) return { added: 0, skipped };
  const taken = stemsInUse(builtin, doc);
  const good = [];
  rows.forEach((r) => {
    try { const row = checkPhrase(r, taken); taken.add(key(row[0])); good.push(row); }
    catch (e) { skipped.push({ line: r.stem, reason: e.message }); }
  });
  if (good.length) { const t = ensureTable(doc, target, domains); good.forEach((r) => t.rows.push(r)); }
  return { added: good.length, skipped };
}

/** Your phrases as pasteable lines, one table after another. */
export function toText(doc) {
  return doc.tables.map((t) => `# ${t.h}\n${t.rows.map((r) => (r[2] ? r.join(" | ") : `${r[0]} | ${r[1]}`)).join("\n")}`).join("\n\n");
}

export const phraseCount = (doc) => doc.tables.reduce((n, t) => n + t.rows.length, 0);

/** A short fingerprint of the rows. It changes when any phrase changes, which tells saved quiz progress that its items moved. */
export function signature(doc) {
  const s = JSON.stringify(doc.tables.map((t) => [t.id, t.d, t.rows]));
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36) + ":" + phraseCount(doc);
}

/** The decoder-shaped object for the user's tables, so the page and quiz can treat it like a built-in one. */
export function asDecoder(doc) {
  return { tables: doc.tables.map((t) => ({ id: t.id, h: t.h, sub: "Phrases you added.", cols: ["Stem says", "Points to", "Typical wrong pick (optional)"], d: t.d, rows: t.rows })), traps: [] };
}

/** The quiz module {CASES, Q, SECTIONS} for your phrases, or null when there are too few to build one.
    Distractors can come from the built-in decoder, so a few phrases are enough when the cert has one. */
export function userQuiz(doc, builtin, certId, maxItems = 60) {
  if (!phraseCount(doc)) return null;
  const extra = builtin ? builtin.tables.flatMap((t) => t.rows.map((r) => r[1])) : [];
  const decoder = asDecoder(doc);
  const { Q, sections } = decoderItems(decoder, `${certId}-mine`, { extra });
  if (!Q.length) return null;
  const skipped = phraseCount(doc) - Q.length; // phrases whose answers were too alike to make clearly different options
  const picked = sample(Q, sections.length, maxItems, `${certId}-mine`);
  const used = [...new Set(picked.map((q) => q.s))].sort((a, b) => a - b);
  const remap = new Map(used.map((s, i) => [s, i]));
  const ordered = picked.slice().sort((a, b) => a.s - b.s).map((q) => ({ ...q, s: remap.get(q.s) }));
  const SECTIONS = used.map((s) => ({
    name: sections[s].name,
    desc: `${ordered.filter((q) => q.s === remap.get(s)).length} items from the phrases you added. You can review and change answers until you leave the section.`,
    review: true,
  }));
  return { CASES: [], Q: ordered, SECTIONS, skipped };
}
