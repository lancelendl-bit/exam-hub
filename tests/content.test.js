import { describe, it, expect } from "vitest";
import { shuffleQ, remap, pts, maxPts, answered, scoreOf } from "../src/engine/core.js";
import e1 from "../src/content/exam1.js";
import e2 from "../src/content/exam2.js";
import e3 from "../src/content/exam3.js";
import e4 from "../src/content/exam4.js";

const EXAMS = { e1, e2, e3, e4 };
const TYPES = ["single", "multi", "hot", "build", "match", "yesno", "series"];
const clone = (q) => JSON.parse(JSON.stringify(q));

/** The text of the correct answer(s), independent of option order. */
function correctText(q) {
  switch (q.t) {
    case "single": return q.opts[q.a];
    case "multi": return q.a.map((i) => q.opts[i]).sort();
    case "hot": return q.a.map((v, k) => q.sel[k][v]);
    case "build": case "match": return q.a.map((i) => q.pool[i]);
    default: return q.a;
  }
}

for (const [id, build] of Object.entries(EXAMS)) {
  describe(`exam ${id}`, () => {
    const { Q, SECTIONS, CASES } = build();

    it("has questions and sections", () => {
      expect(Q.length).toBeGreaterThan(20);
      expect(SECTIONS.length).toBeGreaterThan(0);
      expect(Array.isArray(CASES)).toBe(true);
    });

    it("every item is well formed", () => {
      Q.forEach((q, i) => {
        const where = `${id} item ${i}`;
        expect(TYPES, where).toContain(q.t);
        expect(q.s, where).toBeGreaterThanOrEqual(0);
        expect(q.s, where).toBeLessThan(SECTIONS.length);
        if (q.t === "single") expect(q.opts[q.a], where).toBeDefined();
        if (q.t === "multi") {
          expect(q.a.length, where).toBe(q.n);
          q.a.forEach((v) => expect(q.opts[v], where).toBeDefined());
        }
        if (q.t === "hot") q.a.forEach((v, k) => expect(q.sel[k][v], where).toBeDefined());
        if (q.t === "build" || q.t === "match") q.a.forEach((v) => expect(q.pool[v], where).toBeDefined());
        if (q.t === "match") expect(q.a.length, where).toBe(q.targets.length);
        if (q.t === "yesno") expect(q.a.length, where).toBe(q.rows.length);
        expect(maxPts(q), where).toBeGreaterThan(0);
      });
    });

    it("shuffling keeps the same correct answers", () => {
      Q.forEach((q, i) => {
        const before = correctText(q);
        const after = correctText(shuffleQ(clone(q), `${id}#${i}`));
        expect(after, `${id} item ${i}`).toEqual(before);
      });
    });

    it("a perfect answer sheet scores 1000", () => {
      const shuffled = Q.map((q, i) => shuffleQ(clone(q), `${id}#${i}`));
      const ans = Object.fromEntries(shuffled.map((q, i) => [i, clone(q).a]));
      shuffled.forEach((q, i) => expect(answered(q, ans[i]), `${id} item ${i}`).toBe(true));
      expect(scoreOf({ ans }, shuffled).scaled).toBe(1000);
    });

    it("old-order answers remap to the shuffled order", () => {
      Q.forEach((q, i) => {
        const s = shuffleQ(clone(q), `${id}#${i}`);
        expect(pts(s, remap(s, clone(q).a)), `${id} item ${i}`).toBe(maxPts(s));
      });
    });
  });
}

describe("answer positions", () => {
  it("correct single-choice answers are spread across positions", () => {
    const counts = [0, 0, 0, 0];
    for (const [id, build] of Object.entries(EXAMS))
      build().Q.forEach((q, i) => { if (q.t === "single" && q.opts.length === 4) counts[shuffleQ(clone(q), `${id}#${i}`).a]++; });
    const total = counts.reduce((a, b) => a + b, 0);
    counts.forEach((c) => expect(c / total).toBeLessThan(0.4));
  });
});
