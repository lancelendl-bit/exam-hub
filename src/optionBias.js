/* Measures whether the correct option gives itself away by length. Pure, unit-tested.
   For four-option single-answer items, a correct option that is the strict longest about a quarter of the time is
   what chance gives. Much more than that lets a test-taker score by picking the longest answer. */
const len = (s) => String(s).length;
const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;

export function lengthBias(Q) {
  let singles = 0, longest = 0, ties = 0, ratioSum = 0, multi = 0, multiLonger = 0;
  Q.forEach((q) => {
    if (q.t === "single" && q.opts.length === 4) {
      singles++;
      const L = q.opts.map(len), c = L[q.a], mx = Math.max(...L);
      if (c === mx) { if (L.filter((x) => x === mx).length > 1) ties++; else longest++; }
      ratioSum += c / mean(L.filter((_, i) => i !== q.a));
    } else if (q.t === "multi") {
      multi++;
      const L = q.opts.map(len);
      if (mean(q.a.map((i) => L[i])) > mean(L.filter((_, i) => !q.a.includes(i)))) multiLonger++;
    }
  });
  return {
    singles, longest, ties,
    share: singles ? longest / singles : 0,
    ratio: singles ? ratioSum / singles : 1,
    multi, multiShare: multi ? multiLonger / multi : 0,
  };
}

/** Single-answer items whose correct option is the strict longest, longest margin first. */
export function offenders(Q) {
  const out = [];
  Q.forEach((q, i) => {
    if (q.t !== "single" || q.opts.length !== 4) return;
    const L = q.opts.map(len), c = L[q.a], others = L.filter((_, k) => k !== q.a);
    if (c > Math.max(...others)) out.push({ index: i, correct: c, longestWrong: Math.max(...others), ratio: +(c / mean(others)).toFixed(2), ref: q.ref });
  });
  return out.sort((a, b) => b.ratio - a.ratio);
}
