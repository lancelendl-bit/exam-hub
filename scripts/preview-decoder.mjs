// Prints a sample of the Stem Decoder Quiz generated for a cert, to check quality before committing a decoder.
// Usage: npm run decoder:preview -- dp600 [count]
import { DECODERS } from "../src/decoders.js";
import { buildDecoderQuiz } from "../src/decoderQuiz.js";

const [certId, countArg] = process.argv.slice(2);
if (!certId || !DECODERS[certId]) {
  console.error(`Usage: npm run decoder:preview -- <certId> [count]\nCerts with a decoder: ${Object.keys(DECODERS).join(", ")}`);
  process.exit(1);
}
const quiz = buildDecoderQuiz(DECODERS[certId], { certId });
const count = Math.min(Number(countArg) || 8, quiz.Q.length);
const strip = (t) => t.replace(/<[^>]+>/g, "");
console.log(`${certId}: ${quiz.Q.length} generated items in ${quiz.SECTIONS.length} sections: ${quiz.SECTIONS.map((s) => s.name).join(" | ")}`);
const step = Math.max(1, Math.floor(quiz.Q.length / count));
for (let i = 0, shown = 0; i < quiz.Q.length && shown < count; i += step, shown++) {
  const q = quiz.Q[i];
  console.log(`\n[${quiz.SECTIONS[q.s].name}] ${strip(q.stem)}`);
  q.opts.forEach((o, k) => console.log(`  ${k === q.a ? "*" : " "} ${o}`));
  console.log(`  ${strip(q.ex)}`);
}
