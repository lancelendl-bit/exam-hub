import { describe, it, expect } from "vitest";
import { pts, maxPts, answered, missedFrom, scoreOf, permute, inverse, rng } from "../src/engine/core.js";
import { collect, restore } from "../src/backup.js";

describe("scoring", () => {
  const multi = { t: "multi", n: 2, a: [0, 2], opts: ["a", "b", "c", "d"] };
  const hot = { t: "hot", sel: [["x", "y"], ["x", "y"]], a: [1, 0] };
  it("gives partial credit", () => {
    expect(pts(multi, [0, 1])).toBe(1);
    expect(pts(hot, [1, 1])).toBe(1);
    expect(maxPts(hot)).toBe(2);
  });
  it("ignores wrong-type answers", () => expect(pts(multi, 3)).toBe(0));
  it("requires every part before counting as answered", () => {
    expect(answered(multi, [0])).toBe(false);
    expect(answered(hot, [1, -1])).toBe(false);
  });
  it("lists missed and partly missed items", () => {
    const Q = [{ t: "single", a: 1 }, multi, { t: "single", a: 0 }];
    expect(missedFrom({ ans: { 0: 1, 1: [0, 1] } }, Q)).toEqual([1]);
    expect(scoreOf({ ans: { 0: 1, 1: [0, 2], 2: 0 } }, Q).scaled).toBe(1000);
  });
});

describe("seeded shuffle", () => {
  it("is deterministic and invertible", () => {
    const p = permute(6, rng("seed"));
    expect(permute(6, rng("seed"))).toEqual(p);
    const inv = inverse(p);
    p.forEach((old, nw) => expect(inv[old]).toBe(nw));
  });
});

describe("progress backup", () => {
  const mem = () => {
    const m = new Map();
    return { get length() { return m.size; }, key: (i) => [...m.keys()][i], getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, String(v)) };
  };
  it("round-trips only DP-700 keys", () => {
    const a = mem(); a.setItem("dp700-hub-e1", JSON.stringify({ v: 2, ans: { 0: 1 } })); a.setItem("other", "x");
    const data = collect(a);
    expect(Object.keys(data)).toEqual(["dp700-hub-e1"]);
    const b = mem(); expect(restore(data, b)).toBe(1);
    expect(JSON.parse(b.getItem("dp700-hub-e1")).ans[0]).toBe(1);
  });
  it("rejects unrelated JSON", () => expect(() => restore({ foo: 1 }, mem())).toThrow());
});
