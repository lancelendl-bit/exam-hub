// DP-900 Mock Exam I. Assembles the four skill-area files into one exam. Returns {CASES, Q, SECTIONS}.
// Each part file exports `items` (all s:0). Item shapes are listed in README.md.
import { rng, permute } from "../../engine/core.js";
import { items as concepts } from "./concepts.js";
import { items as relational } from "./relational.js";
import { items as nonrelational } from "./nonrelational.js";
import { items as analytics } from "./analytics.js";

export default function dp900Exam1() {
  const all = [...concepts, ...relational, ...nonrelational, ...analytics];
  // Interleave the skill areas the way the real exam does, in a fixed order.
  const order = permute(all.length, rng("dp900-e1-order"));
  const Q = order.map((i) => all[i]);
  const SECTIONS = [
    {
      name: "Questions",
      desc: `${Q.length} items: single and multiple answer, across the four skill areas of the study guide. You can review and change answers until you leave the section.`,
      review: true,
    },
  ];
  return { CASES: [], Q, SECTIONS };
}
