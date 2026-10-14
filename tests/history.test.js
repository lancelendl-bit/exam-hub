import { describe, it, expect } from "vitest";
import {
  makeAttempt, addAttempt, removeAttempt, mergeHistory, seedFromStates, emptyHistory,
  summarize, domainStats, topicStats, repeatMisses, toCsv, loadHistory, saveHistory, HKEY,
} from "../src/history.js";
import { topicOf, certOf } from "../src/certs.js";
import { EXAMS } from "../src/exams.js";

const Q = [
  { t: "single", a: 1, d: 1, ref: "workspace roles", opts: ["a", "b"] },
  { t: "single", a: 0, d: 2, ref: "Eventstream window", opts: ["a", "b"] },
  { t: "multi", n: 2, a: [0, 1], d: 2, ref: "Fabric Git integration", opts: ["a", "b", "c"] },
  { t: "single", a: 0, d: 3, ref: "capacity metrics app", opts: ["a", "b"] },
];
const attempt = (ans, at, exam = "e1") => makeAttempt({ cert: "dp700", exam, at, Q, ans });
const mem = () => {
  const m = new Map();
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, String(v)) };
};

describe("makeAttempt", () => {
  it("scores like the results page and keeps per-area totals", () => {
    const a = attempt({ 0: 1, 1: 1, 2: [0, 2], 3: 0 }, 1000);
    expect(a.got).toBe(3); // 1 + 0 + 1 + 1
    expect(a.tot).toBe(5);
    expect(a.scaled).toBe(600);
    expect(a.dom).toEqual({ 1: [1, 1], 2: [1, 3], 3: [1, 1] });
    expect(a.id).toBe("e1:1000");
  });
  it("marks blank items null and leaves them out of the answered count", () => {
    const a = attempt({ 0: 1 }, 1000);
    expect(a.answered).toBe(1);
    expect(a.items[1][2]).toBeNull();
    expect(a.items[0][2]).toBe(1);
  });
  it("tags each item with a topic", () => {
    const topics = attempt({}, 1).items.map((i) => i[5]);
    expect(topics).toEqual(["sec", "rt", "alm", "mon"]);
  });
  it("uses ids() so a drill can point at items of other exams", () => {
    const a = makeAttempt({ cert: "dp700", exam: "drill", at: 5, Q, ans: {}, ids: (j) => ["e2", j + 10] });
    expect(a.items[0].slice(0, 2)).toEqual(["e2", 10]);
  });
});

describe("history store", () => {
  it("adds once, sorts by time, and respects deletions", () => {
    const h = emptyHistory();
    expect(addAttempt(h, attempt({}, 2000))).toBe(true);
    expect(addAttempt(h, attempt({}, 1000))).toBe(true);
    expect(addAttempt(h, attempt({}, 1000))).toBe(false);
    expect(h.attempts.map((a) => a.at)).toEqual([1000, 2000]);
    removeAttempt(h, "e1:1000");
    expect(h.attempts).toHaveLength(1);
    expect(addAttempt(h, attempt({}, 1000))).toBe(false);
  });
  it("merges two devices without duplicates and keeps deletions", () => {
    const a = emptyHistory(), b = emptyHistory();
    addAttempt(a, attempt({}, 1)); addAttempt(a, attempt({}, 2));
    addAttempt(b, attempt({}, 2)); addAttempt(b, attempt({}, 3));
    removeAttempt(b, "e1:1");
    const m = mergeHistory(a, b);
    expect(m.attempts.map((x) => x.at)).toEqual([2, 3]);
    expect(m.removed).toContain("e1:1");
  });
  it("round-trips through storage and survives garbage", () => {
    const s = mem();
    const h = emptyHistory(); addAttempt(h, attempt({ 0: 1 }, 7));
    saveHistory(h, s);
    expect(loadHistory(s).attempts).toHaveLength(1);
    s.setItem(HKEY, "not json");
    expect(loadHistory(s).attempts).toEqual([]);
  });
  it("seeds finished results once", () => {
    const h = emptyHistory();
    const entries = [
      { cert: "dp700", exam: "e1", Q, st: { phase: "results", ans: { 0: 1 }, lastScore: { at: 50 } } },
      { cert: "dp700", exam: "e2", Q, st: { phase: "q", ans: {} } },
      { cert: "dp700", exam: "e3", Q, st: null },
    ];
    expect(seedFromStates(h, entries)).toBe(1);
    expect(seedFromStates(h, entries)).toBe(0);
    expect(h.attempts[0].id).toBe("e1:50");
  });
});

describe("analytics", () => {
  const perfect = { 0: 1, 1: 0, 2: [0, 1], 3: 0 };
  const attempts = [
    attempt({ 0: 0, 1: 1, 2: [2, 2], 3: 1 }, 1000), // 0
    attempt({ 0: 1, 1: 1, 2: [0, 2], 3: 0 }, 2000),
    attempt(perfect, 3000),
    attempt(perfect, 4000),
  ];
  it("summarises scores", () => {
    const s = summarize(attempts);
    expect(s.count).toBe(4);
    expect(s.best).toBe(1000);
    expect(s.latest).toBe(1000);
    expect(s.first).toBe(0);
    expect(s.avg3).toBe(Math.round((600 + 1000 + 1000) / 3));
    expect(s.passRate).toBe(50);
    expect(summarize([]).count).toBe(0);
  });
  it("compares the last three attempts with earlier ones", () => {
    const d = domainStats(attempts, "dp700");
    const area1 = d.find((x) => x.d === 1);
    expect(area1.pct).toBe(100);
    expect(area1.delta).toBe(100); // 0% before, 100% in the last three
  });
  it("ranks topics weakest first and hides thin samples", () => {
    const t = topicStats(attempts, "dp700", 3);
    expect(t[0].pct).toBeLessThanOrEqual(t[t.length - 1].pct);
    expect(topicStats(attempts, "dp700", 99)).toEqual([]);
  });
  it("finds items missed twice", () => {
    const r = repeatMisses([attempt({ 0: 0, 3: 1 }, 1), attempt({ 0: 0, 3: 1 }, 2)]);
    expect(r.map((x) => x.i)).toEqual([0, 3]);
    expect(r.find((x) => x.i === 3).stillMissed).toBe(true);
    expect(repeatMisses([attempt({ 0: 0 }, 1)])).toEqual([]);
  });
  it("exports CSV with quoted titles", () => {
    const csv = toCsv([attempt(perfect, 4000)], () => 'Mock "I", full');
    expect(csv.split("\n")[1]).toContain('"Mock ""I"", full"');
  });
});

describe("topic rules on the real banks", () => {
  it("classify nearly every DP-700 item", () => {
    const cert = certOf("dp700");
    let total = 0, other = 0;
    EXAMS.filter((e) => e.cert === "dp700").forEach((e) => e.build().Q.forEach((q) => {
      total++; if (topicOf(cert, q) === "other") other++;
    }));
    expect(other / total).toBeLessThan(0.1);
  });
});

describe("progress import", () => {
  it("merges history instead of replacing it", async () => {
    const { restore } = await import("../src/backup.js");
    const m = new Map();
    const store = { get length() { return m.size; }, key: (i) => [...m.keys()][i], getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, String(v)) };
    const mine = emptyHistory(); addAttempt(mine, attempt({}, 1)); addAttempt(mine, attempt({}, 2));
    saveHistory(mine, store);
    const theirs = emptyHistory(); addAttempt(theirs, attempt({}, 2)); addAttempt(theirs, attempt({}, 3));
    restore({ [HKEY]: theirs }, store);
    expect(loadHistory(store).attempts.map((a) => a.at)).toEqual([1, 2, 3]);
  });
});

describe("topic rules for DP-600", () => {
  it("classify nearly every item and use every topic", () => {
    const cert = certOf("dp600");
    const counts = {};
    let total = 0;
    EXAMS.filter((e) => e.cert === "dp600").forEach((e) => e.build().Q.forEach((q) => {
      total++;
      const t = topicOf(cert, q);
      counts[t] = (counts[t] || 0) + 1;
    }));
    expect(total).toBeGreaterThanOrEqual(60);
    expect((counts.other || 0) / total).toBeLessThan(0.1);
    cert.topics.filter((t) => t.id !== "other").forEach((t) => expect(counts[t.id], t.id).toBeGreaterThan(0));
  });
});

describe("topic rules for Databricks", () => {
  it("classify every item and use every topic", () => {
    const cert = certOf("dbxde");
    const counts = {};
    let total = 0;
    EXAMS.filter((e) => e.cert === "dbxde").forEach((e) => e.build().Q.forEach((q) => {
      total++;
      const t = topicOf(cert, q);
      counts[t] = (counts[t] || 0) + 1;
    }));
    expect(total).toBeGreaterThanOrEqual(60);
    expect((counts.other || 0) / total).toBeLessThan(0.05);
    cert.topics.filter((t) => t.id !== "other").forEach((t) => expect(counts[t.id], t.id).toBeGreaterThan(0));
  });
});

describe("docs links", () => {
  it("point each cert at its own documentation", async () => {
    const { docsUrl } = await import("../src/certs.js");
    expect(docsUrl(certOf("dp600"), "star schema")).toContain("learn.microsoft.com");
    expect(docsUrl(certOf("dbxde"), "Auto Loader")).toContain("docs.databricks.com");
    expect(docsUrl(certOf("dbxde"), "a b")).toContain("a%20b");
  });
});
