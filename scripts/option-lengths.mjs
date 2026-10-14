// Reports how often the correct option is the longest, per exam.
// Usage: npm run lengths                 (every exam)
//        npm run lengths -- e2           (one exam, with the items to fix listed)
import { EXAMS } from "../src/exams.js";
import { lengthBias, offenders } from "../src/optionBias.js";

const only = process.argv[2];
const pct = (x) => `${Math.round(100 * x)}%`;
for (const e of EXAMS.filter((x) => !only || x.id === only)) {
  const { Q } = e.build();
  const b = lengthBias(Q);
  console.log(`${e.id.padEnd(12)} singles ${String(b.singles).padStart(3)}  correct longest ${String(b.longest).padStart(3)} (${pct(b.share).padStart(4)})  avg correct/wrong ${b.ratio.toFixed(2)}  multi correct longer ${b.multi ? `${Math.round(b.multiShare * b.multi)}/${b.multi}` : "-"}`);
  if (only) offenders(Q).forEach((o) => console.log(`   item ${String(o.index).padStart(3)}: correct ${o.correct} vs longest wrong ${o.longestWrong} (x${o.ratio})  ${o.ref}`));
}
console.log("Targets: correct longest at most 30% of singles, average ratio at most 1.12, multi correct longer in at most 60% of items.");
