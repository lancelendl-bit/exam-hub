import { describe, it, expect } from "vitest";
import {
  loadUserDecoder, saveUserDecoder, addPhrase, updatePhrase, removePhrase, removeTable, addBulk, parseBulk,
  checkPhrase, stemsInUse, ensureTable, toText, phraseCount, signature, userQuiz, asDecoder, dkey, LIMITS,
} from "../src/userDecoders.js";
import { DECODERS } from "../src/decoders.js";
import { shuffleQ, scoreOf } from "../src/engine/core.js";
import { lengthBias } from "../src/optionBias.js";
import { tooSimilar } from "../src/decoderQuiz.js";
import { bodyHTML, countPhrases } from "../src/decoderView.js";

const mem = () => {
  const m = new Map();
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, String(v)), raw: m };
};
const domains = { 1: "One", 2: "Two", 3: "Three" };
const builtin = DECODERS.dp600;
const fresh = () => ({ v: 1, updatedAt: 0, tables: [] });
const NEW = { name: "Mine", d: 2 };

describe("adding phrases", () => {
  it("creates a table on the first phrase and trims text", () => {
    const doc = addPhrase(fresh(), builtin, NEW, { stem: "  my   own phrase ", answer: " an answer ", wrong: "" }, domains);
    expect(doc.tables).toHaveLength(1);
    expect(doc.tables[0]).toMatchObject({ h: "Mine", d: 2, rows: [["my own phrase", "an answer", ""]] });
  });
  it("adds to an existing table by id", () => {
    const doc = fresh();
    addPhrase(doc, builtin, NEW, { stem: "first phrase", answer: "a1" }, domains);
    addPhrase(doc, builtin, doc.tables[0].id, { stem: "second phrase", answer: "a2", wrong: "w2" }, domains);
    expect(doc.tables[0].rows).toHaveLength(2);
  });
  it("rejects bad input with readable messages", () => {
    const taken = new Set();
    expect(() => checkPhrase({ stem: "ab", answer: "x" }, taken)).toThrow("at least");
    expect(() => checkPhrase({ stem: "x".repeat(LIMITS.stem + 1), answer: "x" }, taken)).toThrow("under");
    expect(() => checkPhrase({ stem: "fine phrase", answer: "" }, taken)).toThrow("points to");
    expect(() => checkPhrase({ stem: "fine phrase", answer: "x".repeat(LIMITS.answer + 1) }, taken)).toThrow("quiz option");
    expect(() => checkPhrase({ stem: "fine phrase", answer: "Same", wrong: "same" }, taken)).toThrow("same as the answer");
  });
  it("won't repeat a phrase from the built-in decoder or from your own", () => {
    const builtinStem = builtin.tables[0].rows[0][0];
    expect(() => addPhrase(fresh(), builtin, NEW, { stem: builtinStem.toUpperCase(), answer: "x" }, domains)).toThrow("already in the decoder");
    const doc = addPhrase(fresh(), builtin, NEW, { stem: "a unique phrase", answer: "x" }, domains);
    expect(() => addPhrase(doc, builtin, doc.tables[0].id, { stem: "A unique phrase.", answer: "y" }, domains)).toThrow("already");
  });
  it("needs a name for a new table and refuses a duplicate name", () => {
    expect(() => ensureTable(fresh(), { name: "  ", d: 1 }, domains)).toThrow("name");
    const doc = fresh(); ensureTable(doc, NEW, domains);
    expect(() => ensureTable(doc, { name: "mine", d: 1 }, domains)).toThrow("already have");
    expect(() => ensureTable(doc, "nope", domains)).toThrow("no longer exists");
  });
  it("falls back to a valid skill area", () => {
    const doc = fresh();
    expect(ensureTable(doc, { name: "T", d: 99 }, domains).d).toBe(1);
  });
  it("works for a cert with no built-in decoder", () => {
    const doc = addPhrase(fresh(), null, NEW, { stem: "no builtin here", answer: "fine" }, domains);
    expect(phraseCount(doc)).toBe(1);
  });
});

describe("editing and removing", () => {
  const seeded = () => {
    const doc = fresh();
    addPhrase(doc, builtin, NEW, { stem: "alpha phrase", answer: "a" }, domains);
    addPhrase(doc, builtin, doc.tables[0].id, { stem: "beta phrase", answer: "b" }, domains);
    return doc;
  };
  it("edits a row and still blocks duplicates of other rows", () => {
    const doc = seeded();
    const id = doc.tables[0].id;
    updatePhrase(doc, builtin, id, 0, { stem: "alpha phrase", answer: "changed", wrong: "w" }); // same stem is fine for itself
    expect(doc.tables[0].rows[0]).toEqual(["alpha phrase", "changed", "w"]);
    expect(() => updatePhrase(doc, builtin, id, 0, { stem: "beta phrase", answer: "x" })).toThrow("already");
    expect(() => updatePhrase(doc, builtin, id, 9, { stem: "zzz phrase", answer: "x" })).toThrow("no longer exists");
  });
  it("removes a row and an emptied table disappears", () => {
    const doc = seeded();
    const id = doc.tables[0].id;
    removePhrase(doc, id, 0);
    expect(doc.tables[0].rows).toHaveLength(1);
    removePhrase(doc, id, 0);
    expect(doc.tables).toEqual([]);
  });
  it("deletes a table", () => {
    const doc = seeded();
    removeTable(doc, doc.tables[0].id);
    expect(doc.tables).toEqual([]);
  });
});

describe("pasting many phrases", () => {
  it("parses pipes and tabs, skips headers and blank lines", () => {
    const { rows, skipped } = parseBulk("Stem says | Points to | Typical wrong pick\n\nfirst | one | wrong one\nsecond\tdos\nbroken line only");
    expect(rows).toEqual([
      { stem: "first", answer: "one", wrong: "wrong one" },
      { stem: "second", answer: "dos", wrong: "" },
    ]);
    expect(skipped).toHaveLength(1);
    expect(skipped[0].line).toBe("broken line only");
  });
  it("adds the good lines and reports the rest", () => {
    const doc = fresh();
    const dup = builtin.tables[0].rows[0][0];
    const text = `new one | answer one\nnew two | answer two | wrong two\n${dup} | already there\nnew one | repeated in paste\nab | too short`;
    const r = addBulk(doc, builtin, NEW, text, domains);
    expect(r.added).toBe(2);
    expect(r.skipped.map((s) => s.line)).toEqual(expect.arrayContaining([dup, "new one", "ab"]));
    expect(phraseCount(doc)).toBe(2);
  });
  it("adds nothing and creates no table when every line is bad", () => {
    const doc = fresh();
    const r = addBulk(doc, builtin, NEW, "x | y", domains);
    expect(r.added).toBe(0);
    expect(doc.tables).toEqual([]);
  });
  it("round-trips through copy-as-text", () => {
    const doc = fresh();
    addBulk(doc, builtin, NEW, "p one | a one | w one\np two | a two", domains);
    const copy = toText(doc);
    expect(copy).toContain("# Mine");
    const again = addBulk(fresh(), null, NEW, copy, domains);
    expect(again.added).toBe(2);
  });
});

describe("storage", () => {
  it("saves under a per-cert key and loads it back", () => {
    const s = mem();
    const doc = addPhrase(fresh(), builtin, NEW, { stem: "stored phrase", answer: "x" }, domains);
    saveUserDecoder("dp600", doc, s);
    expect(s.raw.has(dkey("dp600"))).toBe(true);
    expect(loadUserDecoder("dp600", s).tables[0].rows[0][0]).toBe("stored phrase");
    expect(loadUserDecoder("dp600", s).updatedAt).toBeGreaterThan(0);
    expect(loadUserDecoder("dp700", s).tables).toEqual([]);
  });
  it("survives garbage", () => {
    const s = mem(); s.setItem(dkey("dp600"), "{nope");
    expect(loadUserDecoder("dp600", s).tables).toEqual([]);
  });
  it("is under the synced prefix", () => {
    expect(dkey("dp600").startsWith("dp700-hub-")).toBe(true);
  });
});

describe("the quiz from your phrases", () => {
  const ANSWERS = ["alpha engine", "bravo cluster", "charlie lakehouse", "delta pipeline", "echo warehouse", "foxtrot notebook", "golf gateway", "hotel capacity", "india workspace", "juliet shortcut", "kilo mirroring", "lima eventhouse", "mike dataflow", "november trigger", "oscar semantic", "papa deployment", "quebec variable", "romeo endpoint", "sierra fabric", "tango catalog", "uniform lineage", "victor schedule", "whiskey sensitivity", "xray endorsement", "yankee gateway rule", "zulu spark pool", "amber query plan", "birch retention", "cedar snapshot", "dune clone"];
  const withPhrases = (n) => {
    const doc = fresh();
    for (let i = 0; i < n; i++) addPhrase(doc, builtin, i ? doc.tables[0].id : NEW, { stem: `custom stem number ${i} zebra`, answer: ANSWERS[i], wrong: i % 2 ? `a decoy ${ANSWERS[(i + 7) % 30]} choice` : "" }, domains);
    return doc;
  };
  it("is null with no phrases", () => {
    expect(userQuiz(fresh(), builtin, "dp600")).toBeNull();
  });
  it("borrows distractors from the built-in decoder, so a few phrases are enough", () => {
    const quiz = userQuiz(withPhrases(2), builtin, "dp600");
    expect(quiz.Q).toHaveLength(2);
    quiz.Q.forEach((q) => {
      expect(q.opts).toHaveLength(4);
      expect(q.a).toBe(0);
      for (let x = 0; x < 4; x++) for (let y = x + 1; y < 4; y++) expect(tooSimilar(q.opts[x], q.opts[y], 0.85)).toBe(false);
    });
    expect(quiz.SECTIONS).toHaveLength(1);
  });
  it("needs a larger pool when the cert has no built-in decoder", () => {
    expect(userQuiz(withPhrases(2), null, "x")).toBeNull();
    expect(userQuiz(withPhrases(6), null, "x").Q.length).toBeGreaterThan(0);
  });
  it("counts phrases it could not turn into questions", () => {
    const doc = fresh();
    ["use shared setting alpha", "use shared setting beta", "use shared setting gamma", "use shared setting delta"].forEach((a, i) => addPhrase(doc, null, i ? doc.tables[0].id : NEW, { stem: `lookalike phrase ${i}`, answer: a }, domains));
    expect(userQuiz(doc, null, "x")).toBeNull();
    const mixed = withPhrases(4);
    addPhrase(mixed, builtin, mixed.tables[0].id, { stem: "lookalike phrase", answer: "alpha engine two" }, domains);
    expect(userQuiz(mixed, builtin, "dp600").skipped).toBeGreaterThanOrEqual(0);
  });
  it("passes the same shuffle and scoring checks as every other exam", () => {
    const quiz = userQuiz(withPhrases(8), builtin, "dp600");
    const shuffled = quiz.Q.map((q, i) => shuffleQ(JSON.parse(JSON.stringify(q)), `dp600-mine#${i}`));
    const ans = Object.fromEntries(shuffled.map((q, i) => [i, q.a]));
    expect(scoreOf({ ans }, shuffled).scaled).toBe(1000);
  });
  it("is deterministic, and its signature changes with the phrases", () => {
    const a = withPhrases(5), b = withPhrases(5);
    expect(userQuiz(a, builtin, "dp600")).toEqual(userQuiz(b, builtin, "dp600"));
    expect(signature(a)).toBe(signature(b));
    addPhrase(b, builtin, b.tables[0].id, { stem: "one more distinct phrase", answer: "x answer" }, domains);
    expect(signature(b)).not.toBe(signature(a));
    updatePhrase(a, builtin, a.tables[0].id, 0, { stem: "custom stem number 0 zebra", answer: "edited answer" });
    expect(signature(a)).not.toBe(signature(withPhrases(5)));
  });
  it("does not let the correct option's length give it away", () => {
    const quiz = userQuiz(withPhrases(30), builtin, "dp600");
    const b = lengthBias(quiz.Q);
    expect(b.share).toBeLessThanOrEqual(0.4);
  });
  it("is shaped like a decoder, so the page can render it", () => {
    const d = asDecoder(withPhrases(3));
    expect(d.tables[0].cols).toHaveLength(3);
    expect(d.tables[0].rows).toHaveLength(3);
  });
});

describe("the decoder page with your phrases", () => {
  it("shows built-in and your rows, filters both, and counts them", () => {
    const doc = addPhrase(fresh(), builtin, NEW, { stem: "zebra crossing clue", answer: "stripes" }, domains);
    const all = bodyHTML(builtin, "", doc);
    expect(all.html).toContain("zebra crossing clue");
    expect(all.html).toContain("Yours");
    expect(all.html).toContain("data-uedit");
    const hit = bodyHTML(builtin, "zebra", doc);
    expect(hit.shown).toBe(1);
    expect(countPhrases(builtin, doc)).toBe(countPhrases(builtin) + 1);
  });
  it("renders with no built-in decoder at all", () => {
    const empty = bodyHTML(null, "", fresh());
    expect(empty.html).toContain("Nothing here yet");
    const one = bodyHTML(null, "", addPhrase(fresh(), null, NEW, { stem: "lonely phrase", answer: "ok" }, domains));
    expect(one.shown).toBe(1);
  });
  it("escapes what you typed", () => {
    const doc = addPhrase(fresh(), null, NEW, { stem: "<img src=x onerror=alert(1)>", answer: "<b>bold</b>" }, domains);
    const html = bodyHTML(null, "", doc).html;
    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;img");
  });
  it("uses the in-use set to protect built-in stems", () => {
    expect(stemsInUse(builtin, fresh()).has(builtin.tables[0].rows[0][0].toLowerCase())).toBe(true);
  });
});
