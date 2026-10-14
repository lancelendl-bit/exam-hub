import { describe, it, expect } from "vitest";
import { DECODERS, HAND_QUIZ, quizIdFor } from "../src/decoders.js";
import { decoderItems, buildDecoderQuiz, tooSimilar, sample } from "../src/decoderQuiz.js";
import { bodyHTML, countPhrases } from "../src/decoderView.js";
import { CERTS, certOf } from "../src/certs.js";
import { EXAMS } from "../src/exams.js";
import { emptyHistory, addAttempt, makeAttempt, removeExamAttempts, loadHistory, saveHistory } from "../src/history.js";

describe("decoder data", () => {
  Object.entries(DECODERS).forEach(([certId, d]) => {
    describe(certId, () => {
      it("belongs to a real cert and has the expected shape", () => {
        expect(CERTS.map((c) => c.id)).toContain(certId);
        expect(d.intro.length).toBeGreaterThan(20);
        expect(d.tables.length).toBeGreaterThanOrEqual(4);
        expect(countPhrases(d)).toBeGreaterThanOrEqual(60);
        const domains = Object.keys(certOf(certId).domains).map(Number);
        d.tables.forEach((t) => {
          expect(domains, `${t.id} d`).toContain(t.d);
          expect([2, 3], `${t.id} cols`).toContain(t.cols.length);
          t.rows.forEach((r) => {
            expect(r.length, `${t.id}: ${r[0]}`).toBe(t.cols.length);
            r.forEach((c) => expect(typeof c === "string" && c.trim().length > 0, `${t.id}: ${r[0]}`).toBe(true));
            expect(r[1].length, `${t.id}: ${r[0]} answer`).toBeLessThanOrEqual(140);
          });
        });
      });
      it("never repeats a stem phrase", () => {
        const stems = d.tables.flatMap((t) => t.rows.map((r) => r[0].toLowerCase()));
        expect(new Set(stems).size).toBe(stems.length);
      });
      it("has trap words and distractor patterns", () => {
        expect(d.traps.length).toBeGreaterThanOrEqual(2);
        d.traps.forEach((g) => g.items.forEach((x) => expect(x.length).toBe(2)));
      });
    });
  });
});

describe("decoder quiz generation", () => {
  const dp700 = DECODERS.dp700;
  const quiz = buildDecoderQuiz(dp700, { certId: "dp700", maxItems: 60 });

  it("builds well formed single-answer items", () => {
    expect(quiz.Q.length).toBeGreaterThan(20);
    expect(quiz.Q.length).toBeLessThanOrEqual(60);
    quiz.Q.forEach((q, i) => {
      expect(q.t).toBe("single");
      expect(q.opts, `item ${i}`).toHaveLength(4);
      expect(q.a).toBe(0);
      expect(q.s).toBeGreaterThanOrEqual(0);
      expect(q.s).toBeLessThan(quiz.SECTIONS.length);
      for (let x = 0; x < 4; x++) for (let y = x + 1; y < 4; y++) expect(tooSimilar(q.opts[x], q.opts[y], 0.85), `item ${i}: ${q.opts[x]} / ${q.opts[y]}`).toBe(false);
    });
  });
  it("shows the phrase it asks about, in the stem and in the explanation", () => {
    const { Q } = decoderItems(dp700, "dp700");
    const row = dp700.tables[1].rows[0];
    const item = Q.find((q) => q.ref.startsWith(row[0]));
    const text = (h) => h.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&");
    expect(text(item.stem)).toContain(row[0].replace(/\.+$/, ""));
    expect(text(item.ex)).toContain(row[0].replace(/\.+$/, ""));
    Q.forEach((q, i) => expect(text(q.stem).replace(/[“”]/g, "").length, `item ${i}`).toBeGreaterThan(40));
  });
  it("is deterministic", () => {
    expect(buildDecoderQuiz(dp700, { certId: "dp700" })).toEqual(quiz);
  });
  it("covers every section with items and names them", () => {
    quiz.SECTIONS.forEach((s, k) => { expect(s.name).toBeTruthy(); expect(quiz.Q.some((q) => q.s === k), s.name).toBe(true); });
  });
  it("uses the typical wrong pick as a distractor", () => {
    const { Q } = decoderItems(dp700, "dp700");
    const row = dp700.tables[0].rows[0];
    const item = Q.find((q) => q.ref.startsWith(row[0]));
    expect(item.opts[0]).toBe(row[1]);
    expect(item.opts).toContain(row[2]);
    expect(item.ex).toContain(row[1].split(" ")[0]);
  });
  it("turns trap words and distractor patterns into items", () => {
    const { Q, sections } = decoderItems(dp700, "dp700");
    const trap = Q.filter((q) => q.s === sections.length - 1);
    expect(trap.length).toBeGreaterThan(5);
    expect(trap.some((q) => q.stem.includes("distractor pattern"))).toBe(true);
    expect(trap.some((q) => q.stem.includes("tell you"))).toBe(true);
  });
  it("respects a cap and keeps every section represented", () => {
    const { Q, sections } = decoderItems(dp700, "dp700");
    const small = sample(Q, sections.length, 20);
    expect(small.length).toBeLessThanOrEqual(20);
    expect(new Set(small.map((q) => q.s)).size).toBe(new Set(Q.map((q) => q.s)).size);
  });
  it("judges similar answers", () => {
    expect(tooSimilar("Mirroring", "mirroring.")).toBe(true);
    expect(tooSimilar("Copy job with incremental copy", "Copy job")).toBe(true);
    expect(tooSimilar("Mirroring", "Eventstream")).toBe(false);
  });
});

describe("registration", () => {
  it("adds a generated quiz for every cert with a decoder and no hand-written one", () => {
    Object.keys(DECODERS).forEach((id) => {
      const exam = EXAMS.find((e) => e.id === quizIdFor(id));
      if (HAND_QUIZ[id]) expect(exam, id).toBeTruthy();
      else { expect(exam, id).toBeTruthy(); expect(exam.cert).toBe(id); }
    });
  });
  it("gives only DP-700 the service and monitoring maps", () => {
    expect(CERTS.filter((c) => (c.maps || []).length).map((c) => c.id)).toEqual(["dp700"]);
    expect(certOf("dp700").maps).toEqual(["svc", "mon"]);
  });
});

describe("decoder page", () => {
  it("filters rows by the search text", () => {
    const d = DECODERS.dp700;
    const all = bodyHTML(d, "");
    const some = bodyHTML(d, "mirroring");
    expect(some.shown).toBeGreaterThan(0);
    expect(some.shown).toBeLessThan(all.shown);
    expect(some.html).toContain("<mark>");
    expect(bodyHTML(d, "zzzzzz").shown).toBe(0);
  });
});

describe("removing an exam's data", () => {
  const Q = [{ t: "single", a: 0, d: 1, ref: "x", opts: ["a", "b"] }];
  const att = (cert, exam, at) => makeAttempt({ cert, exam, at, Q, ans: { 0: 0 } });
  it("removes only that exam's attempts, for that cert, and remembers them", () => {
    const h = emptyHistory();
    addAttempt(h, att("dp700", "e1", 1)); addAttempt(h, att("dp700", "e1", 2)); addAttempt(h, att("dp700", "e2", 3));
    addAttempt(h, att("dp600", "e1", 4));
    expect(removeExamAttempts(h, "e1", "dp700")).toBe(2);
    expect(h.attempts.map((a) => a.id).sort()).toEqual(["e1:4", "e2:3"]);
    expect(h.removed).toEqual(expect.arrayContaining(["e1:1", "e1:2"]));
    expect(addAttempt(h, att("dp700", "e1", 1))).toBe(false); // can't come back from a sync or a re-seed
  });
  it("does nothing when there is nothing to remove", () => {
    expect(removeExamAttempts(emptyHistory(), "e9", "dp700")).toBe(0);
  });
  it("persists through storage", () => {
    const m = new Map();
    const store = { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, String(v)) };
    const h = emptyHistory(); addAttempt(h, att("dp700", "e1", 1));
    removeExamAttempts(h, "e1");
    saveHistory(h, store);
    expect(loadHistory(store).attempts).toEqual([]);
  });
});
