import { describe, it, expect } from "vitest";
import { lengthBias, offenders } from "../src/optionBias.js";
import { EXAMS } from "../src/exams.js";

describe("measuring answer length bias", () => {
  const item = (opts, a, t = "single") => ({ t, opts, a });
  it("counts how often the correct option is the strict longest", () => {
    const Q = [
      item(["a very long correct answer", "b", "c", "d"], 0),
      item(["a", "the long correct", "c", "d"], 1),
      item(["short", "bb", "cc", "dd"], 0), // longest wrong is 2, correct is 5: longest
      item(["tie", "xyz", "c", "d"], 0), // tie for longest
      item(["x", "yyyy", "zz", "w"], 0), // shortest
    ];
    const b = lengthBias(Q);
    expect(b.singles).toBe(5);
    expect(b.longest).toBe(3);
    expect(b.ties).toBe(1);
    expect(b.share).toBeCloseTo(0.6);
  });
  it("lists offenders worst first, and ignores items that are not four-option singles", () => {
    const Q = [item(["aaaa", "b", "c", "d"], 0), item(["aaaaaaaa", "b", "c", "d"], 0), item(["a", "b", "c"], 0), { t: "yesno" }];
    expect(offenders(Q).map((o) => o.index)).toEqual([1, 0]);
  });
  it("judges multi-answer items by the average of the correct options", () => {
    const Q = [{ t: "multi", n: 2, opts: ["long correct one", "long correct two", "w", "x", "y"], a: [0, 1] }, { t: "multi", n: 2, opts: ["a", "b", "long wrong one", "long wrong two", "z"], a: [0, 1] }];
    const b = lengthBias(Q);
    expect(b.multi).toBe(2);
    expect(b.multiShare).toBe(0.5);
  });
});

describe("answer length bias in every exam", () => {
  EXAMS.forEach((e) => {
    it(`${e.id}: the longest option is not the giveaway`, () => {
      const b = lengthBias(e.build().Q);
      if (b.singles >= 20) {
        // About a quarter is what chance gives. Far above it lets someone pass by picking the longest option, and far
        // below it is a tell the other way (the longest option is always wrong).
        expect(b.share, `${e.id} correct is longest in ${Math.round(b.share * 100)}%`).toBeLessThanOrEqual(0.35);
        expect(b.share, `${e.id} correct is longest in ${Math.round(b.share * 100)}%`).toBeGreaterThanOrEqual(0.08);
        expect(b.ratio, `${e.id} avg length ratio`).toBeLessThanOrEqual(1.2);
        expect(b.ratio, `${e.id} avg length ratio`).toBeGreaterThanOrEqual(0.85);
      }
      if (b.multi >= 4) expect(b.multiShare, `${e.id} multi`).toBeLessThanOrEqual(0.7);
    });
  });
});
