/* Logic behind the "Find a cert" page: the shortlist, the certifications you have really passed,
   suggestions, and filtering. Pure functions plus load/save helpers, no DOM access, so it is unit-tested. */
import { CERTS } from "./certs.js";
import { summarize, domainStats, forCert, PASS } from "./history.js";

export const SHORTLIST_KEY = "dp700-hub-shortlist";
export const EARNED_KEY = "dp700-hub-earned";
export const LEVELS = ["Fundamentals", "Associate", "Professional", "Expert", "Specialty"];
export const TOPICS = ["Data engineering", "Analytics and BI", "Databases and SQL", "AI and ML", "Cloud fundamentals", "Cloud administration"];

const read = (store, key) => {
  try { const o = JSON.parse(store.getItem(key)); if (o && typeof o === "object") return o; } catch (e) { /* none yet */ }
  return null;
};

/* ---------- shortlist: ids of certifications you want to pursue ---------- */
export function loadShortlist(store = localStorage) {
  const o = read(store, SHORTLIST_KEY);
  return { v: 1, ids: Array.isArray(o && o.ids) ? o.ids : [], updatedAt: (o && o.updatedAt) || 0 };
}
export function saveShortlist(sl, store = localStorage) {
  sl.updatedAt = Date.now();
  store.setItem(SHORTLIST_KEY, JSON.stringify(sl));
}
export function toggleShortlist(sl, id) {
  const i = sl.ids.indexOf(id);
  if (i >= 0) sl.ids.splice(i, 1); else sl.ids.push(id);
  return sl;
}

/* ---------- earned: certifications you have really passed ----------
   An item is {id, passedOn} for a catalog or in-app cert, or {id:"custom:<slug>", code, title, passedOn} for one
   that is not listed. passedOn is "YYYY-MM-DD" or "". */
export function loadEarned(store = localStorage) {
  const o = read(store, EARNED_KEY);
  return { v: 1, items: Array.isArray(o && o.items) ? o.items : [], updatedAt: (o && o.updatedAt) || 0 };
}
export function saveEarned(e, store = localStorage) {
  e.updatedAt = Date.now();
  store.setItem(EARNED_KEY, JSON.stringify(e));
}

export function validDate(d, now = Date.now()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d || "")) return false;
  const t = Date.parse(d);
  return !Number.isNaN(t) && t <= now + 86400000;
}
const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Adds a passed certification. Throws a readable message when the input is not usable. */
export function addEarned(e, { id, code, title, passedOn }, now = Date.now()) {
  const date = passedOn || "";
  if (date && !validDate(date, now)) throw new Error("Enter the date as YYYY-MM-DD, and not in the future.");
  if (id) {
    if (e.items.some((x) => x.id === id)) throw new Error("That one is already in your list.");
    e.items.push({ id, passedOn: date });
    return e;
  }
  const c = String(code || "").trim(), t = String(title || "").trim();
  if (!c || !t) throw new Error("Enter both a code and a title.");
  const cid = `custom:${slug(c)}`;
  if (e.items.some((x) => x.id === cid)) throw new Error("That one is already in your list.");
  e.items.push({ id: cid, code: c, title: t, passedOn: date });
  return e;
}
export function removeEarned(e, id) { e.items = e.items.filter((x) => x.id !== id); return e; }
export function setEarnedDate(e, id, date, now = Date.now()) {
  if (date && !validDate(date, now)) throw new Error("Enter the date as YYYY-MM-DD, and not in the future.");
  const it = e.items.find((x) => x.id === id);
  if (it) it.passedOn = date || "";
  return e;
}

/* ---------- practice progress for the certs that are in the app ---------- */
export function practiceStatus(history) {
  return CERTS.map((cert) => {
    const attempts = forCert(history, cert.id);
    const summary = summarize(attempts);
    const weakest = domainStats(attempts, cert.id).sort((a, b) => a.pct - b.pct)[0] || null;
    return { cert, summary, weakest, started: summary.count > 0, atPass: summary.avg3 != null && summary.avg3 >= PASS };
  });
}

/* ---------- suggestions ---------- */
const LEVEL_RANK = Object.fromEntries(LEVELS.map((l, i) => [l, i]));

/** Scores one catalog entry against what you have passed and practiced. `catalog` is every known entry, in-app ones included. */
export function fitFor(entry, { earnedIds, practice, catalog }) {
  const byId = Object.fromEntries(catalog.map((c) => [c.id, c]));
  const name = (id) => (byId[id] ? byId[id].code : id);
  const started = new Set(practice.filter((p) => p.started).map((p) => p.cert.id));
  const atPass = new Map(practice.filter((p) => p.atPass).map((p) => [p.cert.id, p.summary.avg3]));
  const reasons = [];
  let score = 0;

  const passed = entry.buildsOn.filter((id) => earnedIds.has(id));
  const strong = entry.buildsOn.filter((id) => !earnedIds.has(id) && atPass.has(id));
  const begun = entry.buildsOn.filter((id) => !earnedIds.has(id) && !atPass.has(id) && started.has(id));
  if (passed.length) { score += 4; reasons.push(`A natural next step after ${passed.map(name).join(", ")}, which you have passed.`); }
  else if (strong.length) { score += 3; reasons.push(`A natural next step after ${strong.map((id) => `${name(id)} (you average ${atPass.get(id)} in practice)`).join(", ")}.`); }
  else if (begun.length) { score += 2; reasons.push(`A natural next step after ${begun.map(name).join(", ")}, which you have started practicing.`); }

  // Same area as something you have passed or are practicing.
  const known = [...earnedIds, ...started].map((id) => byId[id]).filter(Boolean);
  const shared = known.find((k) => k.id !== entry.id && k.topics.some((t) => entry.topics.includes(t)));
  if (shared && !passed.length && !strong.length && !begun.length) { score += 1; reasons.push(`Same area as ${shared.code}.`); }

  // A fundamentals exam is usually below your level once you hold or practice at associate level.
  const top = Math.max(-1, ...known.filter((k) => earnedIds.has(k.id) || atPass.has(k.id)).map((k) => LEVEL_RANK[k.level] ?? -1));
  if (entry.level === "Fundamentals" && top >= LEVEL_RANK.Associate) { score -= 3; reasons.push("Probably below your current level."); }
  return { score, reasons };
}

/* ---------- filtering ---------- */
export function filterCatalog(entries, { q = "", level = "", topic = "", platform = "", onlyShort = false, shortlist = [] } = {}) {
  const needle = q.trim().toLowerCase();
  return entries.filter((e) => {
    if (level && e.level !== level) return false;
    if (topic && !e.topics.includes(topic)) return false;
    if (platform && !e.platforms.includes(platform)) return false;
    if (onlyShort && !shortlist.includes(e.id)) return false;
    if (!needle) return true;
    const hay = [e.code, e.title, e.vendor, e.audience, ...e.skills.map((s) => s.name), ...e.platforms].join(" ").toLowerCase();
    return needle.split(/\s+/).every((w) => hay.includes(w));
  });
}

export const platformsOf = (entries) => [...new Set(entries.flatMap((e) => e.platforms))].sort();
