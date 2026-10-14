import { describe, it, expect } from "vitest";
import {
  loadShortlist, saveShortlist, toggleShortlist, loadEarned, saveEarned, addEarned, removeEarned, setEarnedDate,
  validDate, practiceStatus, fitFor, filterCatalog, platformsOf, LEVELS, TOPICS, SHORTLIST_KEY, EARNED_KEY,
} from "../src/discover.js";
import { ALL, CANDIDATES } from "../src/catalog/index.js";
import { CERTS } from "../src/certs.js";
import { emptyHistory, addAttempt, makeAttempt } from "../src/history.js";

const mem = () => {
  const m = new Map();
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, String(v)) };
};
const NOW = Date.parse("2026-10-14T12:00:00Z");

describe("catalog data", () => {
  it("has unique ids and every field the page needs", () => {
    const ids = ALL.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    ALL.forEach((e) => {
      const w = e.id;
      expect(LEVELS, w).toContain(e.level);
      expect(e.topics.length, w).toBeGreaterThan(0);
      e.topics.forEach((t) => expect(TOPICS, w).toContain(t));
      expect(e.platforms.length, w).toBeGreaterThan(0);
      expect(e.audience.length, w).toBeGreaterThan(20);
      expect(e.skills.length, w).toBeGreaterThan(0);
      e.skills.forEach((s) => { expect(s.name, w).toBeTruthy(); expect(s.weight, w).toMatch(/^\d+(–\d+)?%$/); });
      expect(e.url, w).toMatch(/^https:\/\//);
      expect(e.src.length, w).toBeGreaterThan(0);
      e.src.forEach((u) => expect(u, w).toMatch(/^https:\/\//));
      expect(e.asOf, w).toMatch(/^\d{4}-\d{2}$/);
    });
  });
  it("only points buildsOn at certs that exist", () => {
    const ids = new Set(ALL.map((e) => e.id));
    ALL.forEach((e) => e.buildsOn.forEach((b) => expect(ids.has(b), `${e.id} -> ${b}`).toBe(true)));
  });
  it("describes every cert that has exams, under the same id", () => {
    CERTS.forEach((c) => expect(ALL.find((e) => e.id === c.id && e.inApp), c.id).toBeTruthy());
  });
  it("keeps the candidates Azure related", () => {
    CANDIDATES.forEach((e) => expect(e.vendor, e.id).toBe("Microsoft"));
  });
});

describe("shortlist", () => {
  it("toggles and persists", () => {
    const s = mem();
    const sl = loadShortlist(s);
    toggleShortlist(sl, "dp750"); toggleShortlist(sl, "az104"); toggleShortlist(sl, "dp750");
    saveShortlist(sl, s);
    expect(loadShortlist(s).ids).toEqual(["az104"]);
    expect(loadShortlist(s).updatedAt).toBeGreaterThan(0);
  });
  it("survives garbage in storage", () => {
    const s = mem(); s.setItem(SHORTLIST_KEY, "nope");
    expect(loadShortlist(s).ids).toEqual([]);
  });
});

describe("certifications passed", () => {
  it("adds a listed cert once, with an optional date", () => {
    const e = loadEarned(mem());
    addEarned(e, { id: "dp700", passedOn: "2026-09-01" }, NOW);
    expect(e.items).toEqual([{ id: "dp700", passedOn: "2026-09-01" }]);
    expect(() => addEarned(e, { id: "dp700" }, NOW)).toThrow("already");
    addEarned(e, { id: "az900" }, NOW);
    expect(e.items[1].passedOn).toBe("");
  });
  it("rejects bad or future dates", () => {
    const e = loadEarned(mem());
    expect(() => addEarned(e, { id: "dp700", passedOn: "01/02/2026" }, NOW)).toThrow("YYYY-MM-DD");
    expect(() => addEarned(e, { id: "dp700", passedOn: "2027-01-01" }, NOW)).toThrow("future");
    expect(validDate("2026-10-14", NOW)).toBe(true);
    expect(validDate("2026-13-40", NOW)).toBe(false);
    expect(e.items).toEqual([]);
  });
  it("accepts a cert that is not listed, and needs a code and a title", () => {
    const e = loadEarned(mem());
    expect(() => addEarned(e, { code: "AZ-204" }, NOW)).toThrow("both");
    addEarned(e, { code: "AZ-204", title: "Azure Developer Associate", passedOn: "2025-05-05" }, NOW);
    expect(e.items[0]).toEqual({ id: "custom:az-204", code: "AZ-204", title: "Azure Developer Associate", passedOn: "2025-05-05" });
    expect(() => addEarned(e, { code: "az-204", title: "again" }, NOW)).toThrow("already");
  });
  it("edits dates, removes, and round-trips through storage", () => {
    const s = mem();
    const e = loadEarned(s);
    addEarned(e, { id: "dp700" }, NOW);
    setEarnedDate(e, "dp700", "2026-08-30", NOW);
    saveEarned(e, s);
    expect(loadEarned(s).items[0].passedOn).toBe("2026-08-30");
    removeEarned(e, "dp700");
    expect(e.items).toEqual([]);
    s.setItem(EARNED_KEY, "{broken");
    expect(loadEarned(s).items).toEqual([]);
  });
});

describe("practice status and suggestions", () => {
  const Q = [{ t: "single", a: 0, d: 1, ref: "x", opts: ["a", "b"] }];
  const attempt = (cert, at, right) => makeAttempt({ cert, exam: `${cert}-1`, at, Q, ans: { 0: right ? 0 : 1 } });
  const withAttempts = (cert, n, right) => {
    const h = emptyHistory();
    for (let i = 0; i < n; i++) addAttempt(h, attempt(cert, i + 1, right));
    return h;
  };

  it("reports attempts and whether you are at pass level", () => {
    const rows = practiceStatus(withAttempts("dp700", 3, true));
    const dp700 = rows.find((r) => r.cert.id === "dp700");
    expect(dp700.summary.count).toBe(3);
    expect(dp700.atPass).toBe(true);
    expect(rows.find((r) => r.cert.id === "dp600").started).toBe(false);
  });

  const ctx = (earned, history) => ({ earnedIds: new Set(earned), practice: practiceStatus(history), catalog: ALL });
  const entry = (id) => ALL.find((e) => e.id === id);

  it("ranks a cert higher when you have passed what it builds on", () => {
    const none = fitFor(entry("az104"), ctx([], emptyHistory()));
    const passed = fitFor(entry("az104"), ctx(["az900"], emptyHistory()));
    expect(passed.score).toBeGreaterThan(none.score);
    expect(passed.reasons.join(" ")).toContain("AZ-900");
  });
  it("uses practice results when you have not passed the exam yet", () => {
    const fit = fitFor(entry("dp750"), ctx([], withAttempts("dbxde", 3, true)));
    expect(fit.score).toBeGreaterThan(0);
    expect(fit.reasons.join(" ")).toMatch(/average \d+ in practice/);
  });
  it("marks a fundamentals exam as below your level once you are at associate level", () => {
    const fit = fitFor(entry("az900"), ctx(["dp700"], emptyHistory()));
    expect(fit.score).toBeLessThan(0);
    expect(fit.reasons.join(" ")).toContain("below your current level");
  });
});

describe("filtering", () => {
  it("narrows by level, topic, platform, text and shortlist", () => {
    expect(filterCatalog(CANDIDATES, { level: "Fundamentals" }).every((e) => e.level === "Fundamentals")).toBe(true);
    expect(filterCatalog(CANDIDATES, { topic: "AI and ML" }).every((e) => e.topics.includes("AI and ML"))).toBe(true);
    expect(filterCatalog(CANDIDATES, { platform: "Databricks" }).map((e) => e.id)).toContain("dp750");
    expect(filterCatalog(CANDIDATES, { q: "unity catalog" }).map((e) => e.id)).toContain("dp750");
    expect(filterCatalog(CANDIDATES, { onlyShort: true, shortlist: ["az305"] }).map((e) => e.id)).toEqual(["az305"]);
    expect(filterCatalog(CANDIDATES, { q: "zzzz nothing" })).toEqual([]);
  });
  it("lists platforms for the filter chips", () => {
    expect(platformsOf(CANDIDATES)).toContain("Azure");
  });
});
