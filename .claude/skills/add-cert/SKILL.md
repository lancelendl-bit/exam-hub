---
name: add-cert
description: Add a certification to Exam Hub as a full set: the cert, a verified mock exam, a stem decoder with its generated quiz, and a service map. Use when asked to add, build or "add to exams" one or more certifications, including when the user pastes the instruction copied from the Find a cert page's Add to Exams button.
---

# Add a certification to Exam Hub

The Find a cert page has an **Add to Exams** button. It queues the shortlisted certs (`dp700-hub-requests`) and copies an instruction that points here. The app can't build exams by itself, so this skill is the process. A queued cert flips to **Added** by itself once its id exists in `src/certs.js`.

Do these steps for each requested cert, one cert at a time, on one branch per batch (`feature/add-<ids>`). Nothing here is deployed until the user says so, because pushing to `main` deploys the site.

## 0. Know what to build

- Find each cert in `src/catalog/` (id, official `url`, `skills` with weights, `asOf`). If it is not there, research it first and add a catalog entry (official sources only, every skill area with its official weight).
- Read the model files: `src/certs.js` (DP-600 and Databricks entries), `src/content/dp600/` and `src/content/dbx/` (question banks), `src/content/decoders/dp600.js`, `src/content/maps/dp600.js`. Reuse their shape and briefs.
- **Facts must match current official docs** (Microsoft Learn for Microsoft exams, the vendor's own docs otherwise). Verify before writing. Drop what you can't verify. No prices or dates. Mark preview features "(preview)".

## 1. The cert

1. Add an entry to `CERTS` in `src/certs.js`: `id` (same id as the catalog entry), `code`, `title`, `short`, `docs` (where "Look this up" goes), `domains` (the official skill areas, numbered 1..n, with the weights in a comment), and `topics` (keyword rules for the History page, last one `other`). Add `examDay` bullets when the exam format differs from Microsoft's (question count, time, scoring). Leave `maps` out: `maps` is only for DP-700's hand-built diagrams.
2. Move the catalog entry into `src/catalog/inapp.js` (set `inApp: true`, keep the same id, `buildsOn` and `skills`) and delete it from the candidates file. A test checks that every cert has an `inapp.js` entry.

## 2. The mock exam

Write the bank in `src/content/<certId>/`, one file per skill area or group of areas, each `export const items=[...]`, assembled by an `exam1.js` that interleaves them in a fixed shuffled order (copy `src/content/dbx/exam1.js`). Register it in `src/exams.js` with `cert: "<certId>"`. Item shapes are in README.md.

- Aim for about 60 to 70 items, split by the official weights. Use only the item types the real exam uses (Databricks is single answer only; Microsoft exams also use multi, hot area, build list, drag and drop, yes/no and series).
- Every item has a `/* src: <official URL> */` comment above it, a `ref` search phrase, and an explanation that says why the right answer is right and why the main distractor is wrong.
- **Say only what you verified.** The exam's `desc` in `src/exams.js` may claim "each item was checked against <docs>" only when you fetched the source page for every item. Otherwise say "key items were checked" and list the unverified topics in the pull request. A headless run that skipped fetching must not claim full verification.
- **No length giveaway.** Run `npm run lengths -- <examId>`. The tests require the correct option to be the strict longest in 8 to 35% of four-option single items. Write distractors as detailed as the correct answer.
- Spread correct answers across positions 0 to 3.
- Parallel work: one agent per skill area works well. Brief each with the files to read, the shape, the fact rules, and the counts. Then read their output yourself and re-check the riskiest claims against the docs.

## 3. The stem decoder and its quiz

Follow the `stem-decoder` skill: `src/content/decoders/<certId>.js`, registered in `src/decoders.js`. The Stem decoder tab and the generated `<certId>-stem` quiz appear automatically.

## 4. The service map

Write `src/content/maps/<certId>.js` and register it in `src/maps.js` (`MAPS.<certId> = map`). The Service map tab then shows for that cert. Shape:

```js
export default {
  title: "…map", intro: "One or two sentences.",
  src: ["official URLs the facts came from"],
  groups: { src: "Sources", ingest: "Ingest" },        // id -> label, at most 8
  columns: ["Sources", "Ingest", "Store", "…"],         // 4 to 6 headings, left to right
  nodes: [{ id, g, col, name, sub, what, feat: [], lingo: [[term, def]], traps: [] }],
  edges: [[fromId, toId, label]],
  flows: [{ name, desc, steps: [[nodeId, text]] }],
};
```

Rules (a test enforces them via `validateMap` in `src/mapModel.js`): ids are lowercase letters, digits and underscore and unique; 22 to 28 nodes, at most 7 per column, in top-to-bottom order within a column; `name` ≤ 24 characters, `sub` ≤ 44, `what` ≤ 160, 2 to 6 `feat` items of ≤ 140, `lingo` definitions ≤ 160, `traps` ≤ 140 and phrased the way an exam stem would test them; 40 to 55 edges that mostly run left to right, no repeats, labels ≤ 18 characters; 5 or 6 flows of 3 to 6 steps whose consecutive steps are joined by an edge, covering each exam area. The monitoring map is not generated: it exists only for DP-700.

## 5. Check it

- `npm test` (all of it, including the map, decoder and length tests) and `npm run build`.
- `npm run decoder:preview -- <certId> 10` for a sample of the generated quiz.
- Run the app (`npm run dev`), switch to the cert and check: the exam list (mock exam and Stem Decoder Quiz), an attempt through to Results and History, the Stem decoder tab, the Service map tab (boxes, links lit on select, flows, glossary), and that DP-700 still has its own two maps.
- Update README.md's feature list and layout table, and CLAUDE.md if a rule changed.

## 6. Hand back

Commit on the branch, summarise what was built and what could not be verified, and **ask before merging to `main`**.
