---
name: stem-decoder
description: Generate a stem decoder (a searchable phrase-to-answer reference) and its auto-generated Stem Decoder Quiz for a certification in Exam Hub. Use when asked to add, create or generate a stem decoder or decoder quiz for an exam or cert.
---

# Generate a stem decoder for a certification

A stem decoder maps the phrases that show up in exam question stems to what they point to, so a learner can read the last sentence of a question and know which kind of answer wins. In Exam Hub it is **data**: one file per cert. From that file the app builds two things automatically:

- the **Stem decoder** tab (a searchable reference page), and
- a **Stem Decoder Quiz** exam (`<certId>-stem`) generated from the rows. Each row becomes "this phrase appears in a stem, what does it point to?". The row's typical wrong pick is used as a distractor, so it must be a real feature that also works.

DP-700 is the model: `src/content/decoders/dp700.js` (its quiz is the hand-written exam `e4`, registered in `HAND_QUIZ`).

## Steps

1. **Pick the cert id.** It must exist in `src/certs.js`. If the cert is not in the app yet, add the cert and its exams first (see CLAUDE.md).
2. **Read the model and the cert's material.** Read `src/content/decoders/dp700.js` for the register and brevity. Read the cert's question bank and its official exam outline to see which topics and doc pages are already verified.
3. **Research from official sources only** (Microsoft Learn for Microsoft exams, docs.databricks.com for Databricks, and so on). Verify every row. Do not rely on memory for limits, defaults, option names, role or privilege names, or which engine supports what. Drop any row you cannot verify. Mark preview features "(preview)". No prices or dates.
4. **Write `src/content/decoders/<certId>.js`** as `export default { intro, how, tables, traps }`:
   - `intro`: one or two sentences.
   - `how`: three `["Bold lead.", "Rest of the step."]` pairs.
   - `tables`: `{id, h, sub, cols, d, rows}`. One cross-cutting table "Constraint phrases" with three columns (`Stem says`, `Points to`, `Typical wrong pick`), then two-column tables (`Stem says`, `Points to`) organised by skill area plus one for troubleshooting symptoms. `d` is the skill area number (a key of that cert's `domains`) the table mostly tests. Aim for 80 to 100 rows in all.
   - `traps`: groups of `[label, meaning]` pairs. A group whose `h` contains the word "distractor" is quizzed in reverse (pattern from example). Typical groups: "Words that flip the answer", "Common distractor patterns", and for Microsoft exams "Series questions".
5. **Row rules.** Each "Points to" is a short, concrete answer, at most 90 characters, with one idea (it becomes a quiz option). Stem phrases are unique across the whole file. Within a table no two answers are the same or interchangeable, so a reader never thinks two rows fit one stem. The wrong-pick column names a real feature that loses on the stated constraint.
6. **Register it** in `src/decoders.js`: import the file and add it to `DECODERS`. The Stem decoder tab and the generated quiz then appear for that cert, with no other change. Only if a hand-written quiz exists, add it to `HAND_QUIZ` instead of generating one.
7. **Check it.**
   - `npm test`: the decoder tests check shape, unique stems, domains, answer length, and that the generated quiz is well formed.
   - `npm run decoder:preview -- <certId> 10`: read a sample of the generated questions. Fix any row whose answer options could pass for each other.
   - Run the app, open the cert, check the Stem decoder tab and play a few quiz items.
8. **Commit on a branch.** Ask before merging to `main`, because pushing to `main` deploys the site.

## Notes

- The service map and monitoring map are not generated. They are hand-built diagrams and only DP-700 has them (`maps` in `src/certs.js`).
- Quiz items are single answer, four options, with the correct option authored first. The app shuffles them at runtime like every other item.
- Changing a decoder row changes the generated quiz items, and saved attempts store items by index, so edit rows sparingly once people have history on that quiz.
