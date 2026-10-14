/* Generates a stem decoder quiz from a decoder's data. Pure, deterministic, unit-tested.
   Decoder shape: {intro, how, tables:[{id,h,sub,cols,d,rows}], traps:[{h,items:[[a,b],...]}]}.
   - A table row [stem, pointsTo, typicalWrongPick?] becomes "this phrase appears in a question, what does it point to?".
     The row's typical wrong pick, when it has one, is used as a distractor: it is the trap the decoder warns about.
   - A trap item [word, meaning] becomes "what does this word tell you?".
   - A "distractor patterns" item [pattern, example] becomes "which pattern is this example?".
   Options are authored with the correct one first; the app shuffles them at runtime like any other item. */
import { rng, permute } from "./engine/core.js";

const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
/* Wraps a phrase in curly quotes unless it already starts with one, and drops a trailing full stop. */
const q = (s) => { const t = String(s).trim().replace(/\.+$/, ""); return t.startsWith("“") ? esc(t) : "“" + esc(t) + "”"; };
const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
const words = (s) => new Set(norm(s).split(" ").filter((w) => w.length > 2));

/** True when two answers are the same or share most of their words, so one could pass for the other. */
export function tooSimilar(a, b, limit = 0.6) {
  const x = norm(a), y = norm(b);
  if (x === y) return true;
  const wa = words(a), wb = words(b);
  if (!wa.size || !wb.size) return false;
  let shared = 0;
  wa.forEach((w) => { if (wb.has(w)) shared++; });
  return shared / Math.min(wa.size, wb.size) > limit;
}

function pickDistractors(answer, preferred, pools, r, count = 3) {
  const out = [];
  const ok = (c) => c && !tooSimilar(c, answer) && !out.some((o) => tooSimilar(o, c));
  // A wrong pick the decoder names on purpose is the trap worth testing, so it only has to differ clearly from the answer.
  const clear = (c) => c && !tooSimilar(c, answer, 0.85) && !out.some((o) => tooSimilar(o, c, 0.85));
  preferred.forEach((c) => { if (out.length < count && clear(c)) out.push(c); });
  for (const pool of pools) {
    const order = permute(pool.length, r);
    for (const i of order) { if (out.length >= count) break; if (ok(pool[i])) out.push(pool[i]); }
    if (out.length >= count) break;
  }
  return out;
}

/** Builds the items. Returns {Q, sections:[{name,desc}]}; Q items carry the section index in `s`. */
export function decoderItems(decoder, seed = "decoder") {
  const Q = [];
  const sections = [];
  const tableAnswers = decoder.tables.map((t) => t.rows.map((r) => r[1]));
  const allAnswers = tableAnswers.flat();

  decoder.tables.forEach((t, ti) => {
    sections.push({ name: t.h, desc: t.sub || "" });
    const threeCol = t.cols.length > 2;
    t.rows.forEach((row, ri) => {
      const [stem, answer, wrong] = row;
      const r = rng(`${seed}:${t.id}:${ri}`);
      const same = tableAnswers[ti].filter((_, i) => i !== ri);
      const other = allAnswers.filter((a) => !same.includes(a) && a !== answer);
      const distractors = pickDistractors(answer, threeCol && wrong ? [wrong] : [], [same, other], r);
      if (distractors.length < 3) return;
      const lead = threeCol
        ? `A question ends with this requirement: <b>${q(stem)}</b>. Which kind of answer does it point to?`
        : `A question stem contains this clue: <b>${q(stem)}</b>. What does it point to?`;
      const trap = threeCol && wrong ? ` A typical wrong pick is ${esc(wrong)}, which can also work but loses on that requirement.` : "";
      Q.push({
        s: ti, d: t.d || 1, t: "single", ref: `${stem} ${answer}`, stem: lead,
        opts: [answer, ...distractors], a: 0,
        ex: `<b>${q(stem)}</b> points to <b>${esc(answer)}</b>.${trap}`,
      });
    });
  });

  const trapSection = sections.length;
  const hadTraps = [];
  (decoder.traps || []).forEach((g, gi) => {
    const items = g.items.filter((x) => x && x[0] && x[1]);
    const reverse = /distractor/i.test(g.h);
    items.forEach((it, ii) => {
      const [a, b] = it;
      if (reverse && b.length > 160) return;
      const r = rng(`${seed}:trap:${gi}:${ii}`);
      const answer = reverse ? a : b;
      const group = items.filter((_, i) => i !== ii).map((x) => (reverse ? x[0] : x[1]));
      const distractors = pickDistractors(answer, [], [group], r);
      if (distractors.length < 3) return;
      hadTraps.push(1);
      Q.push({
        s: trapSection, d: (decoder.tables[0] && decoder.tables[0].d) || 1, t: "single", ref: `${a} ${b}`,
        stem: reverse
          ? `An answer option reads: <b>${q(b)}</b>. Which common distractor pattern is that?`
          : `In an exam stem, what does <b>${q(a)}</b> tell you?`,
        opts: [answer, ...distractors], a: 0,
        ex: reverse ? `That is the pattern <b>${esc(a)}</b>: ${esc(b)}` : `<b>${q(a)}</b>: ${esc(b)}`,
      });
    });
  });
  if (hadTraps.length) sections.push({ name: "Trap words and distractors", desc: "Small words that flip an answer, and the usual shapes of wrong options." });
  return { Q, sections };
}

/** Picks at most `max` items, spread across sections in proportion to their size, in a fixed order. */
export function sample(Q, sectionCount, max, seed = "sample") {
  if (Q.length <= max) return Q;
  const bySection = Array.from({ length: sectionCount }, () => []);
  Q.forEach((q) => bySection[q.s].push(q));
  const total = Q.length;
  const chosen = [];
  bySection.forEach((items, s) => {
    if (!items.length) return;
    const take = Math.max(1, Math.round((max * items.length) / total));
    const order = permute(items.length, rng(`${seed}:${s}`)).slice(0, take).sort((a, b) => a - b);
    order.forEach((i) => chosen.push(items[i]));
  });
  return chosen.slice(0, max);
}

/** The exam module a cert's decoder quiz returns: {CASES, Q, SECTIONS}. */
export function buildDecoderQuiz(decoder, { certId = "cert", maxItems = 60 } = {}) {
  const { Q, sections } = decoderItems(decoder, certId);
  const picked = sample(Q, sections.length, maxItems, certId);
  // Keep sections in order and renumber them so empty ones disappear.
  const used = [...new Set(picked.map((q) => q.s))].sort((a, b) => a - b);
  const remap = new Map(used.map((s, i) => [s, i]));
  const ordered = picked.slice().sort((a, b) => a.s - b.s).map((q) => ({ ...q, s: remap.get(q.s) }));
  const SECTIONS = used.map((s) => ({
    name: sections[s].name,
    desc: `${ordered.filter((q) => q.s === remap.get(s)).length} items. ${sections[s].desc} You can review and change answers until you leave the section.`.trim(),
    review: true,
  }));
  return { CASES: [], Q: ordered, SECTIONS };
}
