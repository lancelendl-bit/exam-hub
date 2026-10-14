/* Exam registry. `cert` must match an id in src/certs.js.
   To add an exam: add a content module in src/content/, then add an entry here. */
import exam1Content from "./content/exam1.js";
import exam2Content from "./content/exam2.js";
import exam3Content from "./content/exam3.js";
import exam4Content from "./content/exam4.js";
import dp600Exam1 from "./content/dp600/exam1.js";
import dbxExam1 from "./content/dbx/exam1.js";
import dp800Exam1 from "./content/dp800/exam1.js";
import ai200Exam1 from "./content/ai200/exam1.js";
import { CERTS } from "./certs.js";
import { DECODERS, HAND_QUIZ, quizIdFor } from "./decoders.js";
import { buildDecoderQuiz } from "./decoderQuiz.js";

export const EXAMS = [
  { id: "e1", cert: "dp700", num: "EXAM I", title: "Mock Exam I", sub: "Original simulation", desc: "One case study, mixed item types, and two no-return series. The broadest first pass over the outline.", build: exam1Content },
  { id: "e2", cert: "dp700", num: "EXAM II", title: "Mock Exam II", sub: "Full-outline question bank", desc: "All-new items written against every bullet in Microsoft's skills outline and the Learn documentation.", build: exam2Content },
  { id: "e3", cert: "dp700", num: "EXAM III", title: "Mock Exam III", sub: "From your practice document", desc: "Every scenario from the practice-exam document you supplied, rewritten and re-verified, with items added from its Contoso and Litware cases.", build: exam3Content },
  { id: "e4", cert: "dp700", num: "QUIZ IV", title: "Stem Decoder Quiz", sub: "Read the stem, find the answer", desc: "Built from the DP-700 Stem Decoder doc: constraint phrases, scenario phrases, security wording, troubleshooting symptoms, and trap words.", build: exam4Content },
  { id: "d6e1", cert: "dp600", num: "EXAM I", title: "DP-600 Mock Exam I", sub: "Full-outline question bank", desc: "Written against every skill in Microsoft's DP-600 outline: maintain a solution, prepare data, and implement and manage semantic models. Each item was checked against Microsoft Learn.", build: dp600Exam1 },
  { id: "dbe1", cert: "dbxde", num: "EXAM I", title: "Databricks DE Associate Mock Exam I", sub: "All seven exam guide sections", desc: "Single-answer multiple choice in the style of the real exam, covering all seven sections of the May 2026 exam guide. Each item was checked against the Databricks documentation.", build: dbxExam1 },
  { id: "d8e1", cert: "dp800", num: "EXAM I", title: "DP-800 Mock Exam I", sub: "Full-outline question bank", desc: "Written against the DP-800 skills outline: design and develop database solutions, secure, optimize and deploy them, and implement AI capabilities such as embeddings, vector search and RAG. Key items were checked against Microsoft Learn; the rest follow the pages cited in each item's source and weren't fetched when written.", build: dp800Exam1 },
  { id: "a2e1", cert: "ai200", num: "EXAM I", title: "AI-200 Mock Exam I", sub: "Full-outline question bank", desc: "Written against the AI-200 skills outline: containerized solutions (Container Registry, App Service, Container Apps, AKS), AI solutions on Cosmos DB, PostgreSQL and Azure Managed Redis, Service Bus, Event Grid and Azure Functions, and Key Vault, App Configuration, OpenTelemetry and KQL. The Microsoft Learn page cited above each item was fetched and the item's claims checked against it when written; two pages (OpenTelemetry custom spans and the Functions triggers overview) were read only in part.", build: ai200Exam1 },
];

export const examsOf = (certId) => EXAMS.filter((e) => e.cert === certId);

/* A decoder quiz is generated from a cert's decoder data, for certs that don't have a hand-written one. */
Object.keys(DECODERS).filter((id) => !HAND_QUIZ[id]).forEach((id) => {
  const cert = CERTS.find((c) => c.id === id);
  if (!cert) return;
  EXAMS.push({
    id: quizIdFor(id), cert: id, num: "QUIZ", title: `${cert.code} Stem Decoder Quiz`, sub: "Generated from the stem decoder",
    desc: "Each question shows a phrase from a question stem and asks what it points to. Wrong options include the typical trap the decoder warns about. Built automatically from the stem decoder.",
    build: () => buildDecoderQuiz(DECODERS[id], { certId: id }),
  });
});
