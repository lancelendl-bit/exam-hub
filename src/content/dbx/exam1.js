// Databricks Certified Data Engineer Associate: Mock Exam I. Assembles the section files into one exam.
// Returns {CASES, Q, SECTIONS}. Every item is single-answer multiple choice, like the real exam.
// Item `d` is the exam guide section (1-7). See the weights in src/certs.js.
import { rng, permute } from "../../engine/core.js";
import { items as platformIngest } from "./platform-ingest.js";
import { items as transform } from "./transform.js";
import { items as jobsCicd } from "./jobs-cicd.js";
import { items as monitorGovernance } from "./monitor-governance.js";

export default function dbxExam1() {
  const all = [...platformIngest, ...transform, ...jobsCicd, ...monitorGovernance];
  // Mix the sections, as the real exam does, in a fixed order.
  const order = permute(all.length, rng("dbxde-e1-order"));
  const Q = order.map((i) => all[i]);
  const SECTIONS = [
    {
      name: "Questions",
      desc: `${Q.length} single-answer multiple-choice items across the seven sections of the exam guide. The real exam has 45 scored questions in 90 minutes. You can review and change answers until you finish.`,
      review: true,
    },
  ];
  return { CASES: [], Q, SECTIONS };
}
