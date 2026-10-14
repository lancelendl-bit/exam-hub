/* Exam registry. `cert` must match an id in src/certs.js.
   To add an exam: add a content module in src/content/, then add an entry here. */
import exam1Content from "./content/exam1.js";
import exam2Content from "./content/exam2.js";
import exam3Content from "./content/exam3.js";
import exam4Content from "./content/exam4.js";
import dp600Exam1 from "./content/dp600/exam1.js";
import dbxExam1 from "./content/dbx/exam1.js";

export const EXAMS = [
  { id: "e1", cert: "dp700", num: "EXAM I", title: "Mock Exam I", sub: "Original simulation", desc: "One case study, mixed item types, and two no-return series. The broadest first pass over the outline.", build: exam1Content },
  { id: "e2", cert: "dp700", num: "EXAM II", title: "Mock Exam II", sub: "Full-outline question bank", desc: "All-new items written against every bullet in Microsoft's skills outline and the Learn documentation.", build: exam2Content },
  { id: "e3", cert: "dp700", num: "EXAM III", title: "Mock Exam III", sub: "From your practice document", desc: "Every scenario from the practice-exam document you supplied, rewritten and re-verified, with items added from its Contoso and Litware cases.", build: exam3Content },
  { id: "e4", cert: "dp700", num: "QUIZ IV", title: "Stem Decoder Quiz", sub: "Read the stem, find the answer", desc: "Built from the DP-700 Stem Decoder doc: constraint phrases, scenario phrases, security wording, troubleshooting symptoms, and trap words.", build: exam4Content },
  { id: "d6e1", cert: "dp600", num: "EXAM I", title: "DP-600 Mock Exam I", sub: "Full-outline question bank", desc: "Written against every skill in Microsoft's DP-600 outline: maintain a solution, prepare data, and implement and manage semantic models. Each item was checked against Microsoft Learn.", build: dp600Exam1 },
  { id: "dbe1", cert: "dbxde", num: "EXAM I", title: "Databricks DE Associate Mock Exam I", sub: "All seven exam guide sections", desc: "Single-answer multiple choice in the style of the real exam, covering all seven sections of the May 2026 exam guide. Each item was checked against the Databricks documentation.", build: dbxExam1 },
];

export const examsOf = (certId) => EXAMS.filter((e) => e.cert === certId);
