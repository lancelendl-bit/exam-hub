// DP-600 Mock Exam I. Assembles the three skill-area files into one exam. Returns {CASES, Q, SECTIONS}.
// Each part file exports `items`: s:0 are regular items, s:1 are the Yes/No scenario series.
// Item shapes are listed in README.md.
import { rng, permute } from "../../engine/core.js";
import { items as maintain } from "./maintain.js";
import { items as prepare } from "./prepare.js";
import { items as models } from "./models.js";

export default function dp600Exam1() {
  const all = [...maintain, ...prepare, ...models];
  const regular = all.filter((q) => q.s === 0);
  const series = all.filter((q) => q.s === 1).sort((a, b) => (a.grp > b.grp ? 1 : a.grp < b.grp ? -1 : 0));
  // Interleave the skill areas the way the real exam does, in a fixed order.
  const order = permute(regular.length, rng("dp600-e1-order"));
  const Q = [...order.map((i) => regular[i]), ...series];

  const groups = new Set(series.map((q) => q.grp)).size;
  const SECTIONS = [
    {
      name: "Questions",
      desc: `${regular.length} items: single and multiple answer, hot area, build list, drag and drop, and yes/no statements. You can review and change answers until you leave the section.`,
      review: true,
    },
    {
      name: "Scenario series",
      desc: `${series.length} items in ${groups} series. Each item restates the same scenario with a different solution. Answer Yes if the solution meets the goal. After you answer an item and select Next, you can't return to it.`,
      review: false,
    },
  ];
  return { CASES: [], Q, SECTIONS };
}
