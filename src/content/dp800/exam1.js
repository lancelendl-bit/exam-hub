// DP-800 Mock Exam I. Assembles the three skill-area files into one exam. Returns {CASES, Q, SECTIONS}.
// Each part file exports `items` (all s:0). Item shapes are listed in README.md.
import { rng, permute } from "../../engine/core.js";
import { items as design } from "./design.js";
import { items as secure } from "./secure.js";
import { items as ai } from "./ai.js";

export default function dp800Exam1() {
  const all = [...design, ...secure, ...ai];
  // Interleave the skill areas the way the real exam does, in a fixed order.
  const order = permute(all.length, rng("dp800-e1-order"));
  const Q = order.map((i) => all[i]);
  const SECTIONS = [
    {
      name: "Questions",
      desc: `${Q.length} items: single and multiple answer, across the three skill areas of the study guide. You can review and change answers until you leave the section.`,
      review: true,
    },
  ];
  return { CASES: [], Q, SECTIONS };
}
