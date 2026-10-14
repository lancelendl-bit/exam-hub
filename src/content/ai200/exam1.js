// AI-200 Mock Exam I. Assembles the four skill-area files into one exam. Returns {CASES, Q, SECTIONS}.
// Each part file exports `items` (all s:0). Item shapes are listed in README.md.
import { rng, permute } from "../../engine/core.js";
import { items as containers } from "./containers.js";
import { items as data } from "./data.js";
import { items as connect } from "./connect.js";
import { items as secure } from "./secure.js";

export default function ai200Exam1() {
  const all = [...containers, ...data, ...connect, ...secure];
  // Interleave the skill areas the way the real exam does, in a fixed order.
  const order = permute(all.length, rng("ai200-e1-order"));
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
