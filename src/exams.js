/* Exam registry. `cert` must match an id in src/certs.js.
   To add an exam: add a content module in src/content/, then add an entry here. */
import exam1Content from "./content/exam1.js";
import exam2Content from "./content/exam2.js";
import exam3Content from "./content/exam3.js";
import exam4Content from "./content/exam4.js";

export const EXAMS = [
  { id: "e1", cert: "dp700", num: "EXAM I", title: "Mock Exam I", sub: "Original simulation", desc: "One case study, mixed item types, and two no-return series. The broadest first pass over the outline.", build: exam1Content },
  { id: "e2", cert: "dp700", num: "EXAM II", title: "Mock Exam II", sub: "Full-outline question bank", desc: "All-new items written against every bullet in Microsoft's skills outline and the Learn documentation.", build: exam2Content },
  { id: "e3", cert: "dp700", num: "EXAM III", title: "Mock Exam III", sub: "From your practice document", desc: "Every scenario from the practice-exam document you supplied, rewritten and re-verified, with items added from its Contoso and Litware cases.", build: exam3Content },
  { id: "e4", cert: "dp700", num: "QUIZ IV", title: "Stem Decoder Quiz", sub: "Read the stem, find the answer", desc: "Built from the DP-700 Stem Decoder doc: constraint phrases, scenario phrases, security wording, troubleshooting symptoms, and trap words.", build: exam4Content },
];

export const examsOf = (certId) => EXAMS.filter((e) => e.cert === certId);
