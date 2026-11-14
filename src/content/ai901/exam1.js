// AI-901 Mock Exam I. Assembles the skill-area files into one exam. Returns {CASES, Q, SECTIONS}.
// Each part file exports `e1` and `e2` (items for Exam I and Exam II, all s:0). Item shapes are listed in README.md.
import { rng, permute } from "../../engine/core.js";
import { e1 as rai } from "./rai.js";
import { e1 as workloads } from "./workloads.js";
import { e1 as foundry } from "./foundry.js";
import { e1 as textvision } from "./textvision.js";
import { e1 as extract } from "./extract.js";

export default function ai901Exam1() {
  const all = [...rai, ...workloads, ...foundry, ...textvision, ...extract];
  // Interleave the skill areas the way the real exam does, in a fixed order.
  const order = permute(all.length, rng("ai901-e1-order"));
  const Q = order.map((i) => all[i]);
  const SECTIONS = [
    {
      name: "Questions",
      desc: `${Q.length} items across the two skill areas of the AI-901 study guide. You can review and change answers until you leave the section.`,
      review: true,
    },
  ];
  return { CASES: [], Q, SECTIONS };
}
