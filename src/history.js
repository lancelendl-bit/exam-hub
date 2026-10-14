/* Attempt history and the analytics behind the History page. Pure functions plus load/save helpers,
   no DOM access, so it is unit-tested.

   An attempt is recorded each time an exam or drill is finished:
   { id, cert, exam, at, got, tot, scaled, answered, dom:{"1":[got,max],...},
     items:[[examId, itemIndex, points|null, max, domain, topicId], ...] }
   points is null for an item left blank. Blank items score zero but are left out of topic accuracy. */
import { certOf, topicOf } from "./certs.js";
import { maxPts, pts, answered } from "./engine/core.js";

export const HKEY = "dp700-hub-history";
export const PASS = 700;

export const emptyHistory = () => ({ v: 1, attempts: [], removed: [] });

export function loadHistory(store = localStorage) {
  try {
    const h = JSON.parse(store.getItem(HKEY));
    if (h && Array.isArray(h.attempts)) return { v: 1, removed: [], ...h };
  } catch (e) { /* fall through */ }
  return emptyHistory();
}

export function saveHistory(h, store = localStorage) {
  h.updatedAt = Date.now();
  store.setItem(HKEY, JSON.stringify(h));
}

/** Builds an attempt record. `ids(j)` maps an item index to [examId, index] (the drill mixes exams). */
export function makeAttempt({ cert, exam, at, Q, ans, ids }) {
  const c = certOf(cert);
  const dom = Object.fromEntries(Object.keys(c.domains).map((k) => [k, [0, 0]]));
  let got = 0, tot = 0, done = 0;
  const items = Q.map((q, j) => {
    const m = maxPts(q);
    const a = ans ? ans[j] : null;
    const blank = !answered(q, a);
    const scored = pts(q, a); // a partly filled item keeps its partial points, as on the results page
    got += scored; tot += m; if (!blank) done++;
    if (dom[q.d]) { dom[q.d][0] += scored; dom[q.d][1] += m; }
    const [e, i] = ids ? ids(j) : [exam, j];
    return [e, i, blank ? null : scored, m, q.d, topicOf(c, q)];
  });
  return { id: `${exam}:${at}`, cert, exam, at, got, tot, scaled: tot ? Math.round((1000 * got) / tot) : 0, answered: done, dom, items };
}

/** Adds an attempt unless it is already there or was deleted. Returns true if it was added. */
export function addAttempt(h, a) {
  if (h.removed.includes(a.id) || h.attempts.some((x) => x.id === a.id)) return false;
  h.attempts.push(a);
  h.attempts.sort((x, y) => x.at - y.at);
  return true;
}

export function removeAttempt(h, id) {
  h.attempts = h.attempts.filter((a) => a.id !== id);
  if (!h.removed.includes(id)) h.removed.push(id);
}

/** Removes every attempt of one exam (optionally only for one cert). Returns how many were removed. */
export function removeExamAttempts(h, examId, certId) {
  const ids = h.attempts.filter((a) => a.exam === examId && (!certId || a.cert === certId)).map((a) => a.id);
  ids.forEach((id) => removeAttempt(h, id));
  return ids.length;
}

/** Union of two histories. Used when syncing devices. */
export function mergeHistory(a, b) {
  const removed = [...new Set([...(a.removed || []), ...(b.removed || [])])];
  const out = { v: 1, attempts: [], removed };
  [...a.attempts, ...b.attempts].forEach((x) => addAttempt(out, x));
  out.updatedAt = Math.max(a.updatedAt || 0, b.updatedAt || 0);
  return out;
}

/** Records finished results saved before history existed. Safe to call repeatedly. */
export function seedFromStates(h, entries) {
  let n = 0;
  entries.forEach(({ cert, exam, st, Q }) => {
    if (!st || st.phase !== "results" || !st.lastScore || !st.lastScore.at) return;
    if (addAttempt(h, makeAttempt({ cert, exam, at: st.lastScore.at, Q, ans: st.ans || {} }))) n++;
  });
  return n;
}

export const forCert = (h, certId) => h.attempts.filter((a) => a.cert === certId);

const avg = (xs) => (xs.length ? Math.round(xs.reduce((s, x) => s + x, 0) / xs.length) : null);

export function summarize(attempts) {
  const s = attempts.slice().sort((a, b) => a.at - b.at);
  const last3 = s.slice(-3).map((a) => a.scaled);
  return {
    count: s.length,
    best: s.length ? Math.max(...s.map((a) => a.scaled)) : null,
    latest: s.length ? s[s.length - 1].scaled : null,
    first: s.length ? s[0].scaled : null,
    avg3: avg(last3),
    passRate: s.length ? Math.round((100 * s.filter((a) => a.scaled >= PASS).length) / s.length) : null,
    days: new Set(s.map((a) => new Date(a.at).toDateString())).size,
  };
}

/** Skill-area accuracy: your last three attempts, and the change against everything before them. */
export function domainStats(attempts, certId) {
  const c = certOf(certId);
  const s = attempts.slice().sort((a, b) => a.at - b.at);
  const recent = s.slice(-3), prior = s.slice(0, -3);
  const pct = (list, k) => {
    let g = 0, m = 0;
    list.forEach((a) => { const d = a.dom && a.dom[k]; if (d) { g += d[0]; m += d[1]; } });
    return m ? Math.round((100 * g) / m) : null;
  };
  return Object.keys(c.domains).map((k) => {
    const now = pct(recent, k), before = pct(prior, k);
    return { d: Number(k), name: c.domains[k], pct: now, delta: now != null && before != null ? now - before : null };
  }).filter((x) => x.pct != null);
}

/** Accuracy per topic over every answered item, weakest first. Topics with fewer than minN answers are left out. */
export function topicStats(attempts, certId, minN = 3) {
  const c = certOf(certId);
  const acc = {};
  attempts.forEach((a) => a.items.forEach(([, , p, m, , t]) => {
    if (p == null) return;
    const o = (acc[t] ||= { right: 0, max: 0, n: 0 });
    o.right += p; o.max += m; o.n++;
  }));
  return (c.topics || []).filter((t) => acc[t.id] && acc[t.id].n >= minN)
    .map((t) => ({ id: t.id, name: t.name, n: acc[t.id].n, pct: Math.round((100 * acc[t.id].right) / acc[t.id].max) }))
    .sort((x, y) => x.pct - y.pct);
}

/** Items missed at least twice, most-missed first. `stillMissed` means the latest answer was also wrong. */
export function repeatMisses(attempts, minMisses = 2) {
  const seen = {};
  attempts.slice().sort((a, b) => a.at - b.at).forEach((a) => a.items.forEach(([e, i, p, m]) => {
    if (p == null) return;
    const o = (seen[`${e}:${i}`] ||= { exam: e, i, seen: 0, misses: 0, stillMissed: false });
    o.seen++;
    if (p < m) o.misses++;
    o.stillMissed = p < m;
  }));
  return Object.values(seen).filter((o) => o.misses >= minMisses).sort((x, y) => y.misses - x.misses || y.seen - x.seen);
}

export function toCsv(attempts, titleOf = (id) => id) {
  const rows = [["date", "exam", "score_1000", "points", "out_of", "passed", "answered"]];
  attempts.slice().sort((a, b) => a.at - b.at).forEach((a) =>
    rows.push([new Date(a.at).toISOString(), titleOf(a.exam), a.scaled, a.got, a.tot, a.scaled >= PASS ? "yes" : "no", a.answered]));
  return rows.map((r) => r.map((v) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : v)).join(",")).join("\n");
}
