# DP-700 Exam Hub: notes for Claude

Vanilla JS + Vite PWA. No framework, on purpose: the engine renders HTML strings into `#app`.

## Commands
- `npm run dev` / `npm run build` / `npm test`
- Always run `npm test` after editing a question bank. It catches broken answer keys and shuffle mistakes.

## Rules
- Question banks live in `src/content/examN.js` and return `{CASES, Q, SECTIONS}`. Item fields are listed in README.md.
- `series` item `scen` text is rendered escaped, so keep HTML out of it.
- Write answer keys `a` in the order the options are authored. `shuffleQ` reorders options at runtime with a fixed seed (`<examId>#<index>`).
  - Reordering existing items changes their seeds. That's fine, but saved progress maps answers by index.
- Saved progress is in localStorage under `dp700-hub-<examId>` with schema `v:2`. Don't rename the keys: users move progress with the Progress dialog.
- Facts must match current official docs: Microsoft Learn for the Fabric certs, docs.databricks.com for Databricks. Verify before adding or changing an explanation.
- To add an exam, add a content module, then add an entry to `EXAMS` in `src/exams.js`. Its `cert` must be an id from `src/certs.js`, and each item's `d` must be one of that cert's `domains` keys.
- DP-600 content lives in `src/content/dp600/`: one file per skill area (`maintain.js`, `prepare.js`, `models.js`) that each export `items`, assembled by `exam1.js`. Every item has a `/* src: <Learn URL> */` comment. Keep that when you edit, and re-verify the fact first.
- Databricks content lives in `src/content/dbx/`, in four files assembled by `exam1.js`. The exam is single-answer multiple choice only, and each `d` is one of the seven exam guide sections. Every item has a `/* src: <docs URL> */` comment. The exam guide lists DENY, but Databricks docs say Unity Catalog doesn't support it, so the bank follows the docs.
- To add a certification, add it to `CERTS` in `src/certs.js`. The hub shows a cert switcher once there is more than one. A cert can set `family` ("fabric" shows the Fabric reference maps), `docs` (where the explanation link goes) and `examDay` (hub notes). The DP-700 drill keeps the key `dp700-hub-drill`; other certs use `dp700-hub-drill-<certId>`.
- Finished attempts are logged under `dp700-hub-history` (see `src/history.js`). Items are stored by index, so reordering a bank changes what old attempts point at. Topic rules for the History page live on each cert in `src/certs.js`.
- Sync (`src/sync/`) copies every `dp700-hub-*` key except `dp700-hub-pref`. Exam documents are last-writer-wins on `updatedAt`, which `save()` only advances when content changes. Resetting writes a tombstone (`{deleted:true}`), not a removal. Don't write to those keys without going through `save()`, `clearState()` or the history helpers, or the change won't sync.
- The Find a cert page reads `src/catalog/`. Every entry needs official sources in `src`, every skill area with its official weight, and an `asOf` month. `buildsOn` is a suggested order, not a vendor rule. The candidates are Azure-related Microsoft certs only for now. A cert that gets exams must also get an `inapp.js` entry with the same id as in `src/certs.js` (a test checks this). The shortlist and the certs you have passed are saved under `dp700-hub-shortlist` and `dp700-hub-earned`, and sync like the other keys.
- Stem decoders are data: `src/content/decoders/<certId>.js`, registered in `src/decoders.js`. A decoder gives the Stem decoder tab and, unless the cert has a hand-written quiz (`HAND_QUIZ`), a generated quiz `<certId>-stem`. Use the `stem-decoder` skill to make one. The service and monitoring maps are hand-built and DP-700 only (`maps` in `src/certs.js`).
- Answer options must not give the answer away by length. Run `npm run lengths -- <examId>` after writing or editing a bank. The tests require the correct option to be the strict longest in 8 to 35% of four-option single items, an average correct/wrong length ratio of 0.85 to 1.2, and multi-answer items where the correct options are longer on average in at most 70% of items. Write distractors as detailed as the correct answer. The decoder quiz generator already picks distractors of mixed length.
- Phrases a user adds on the Stem decoder page are saved per cert under `dp700-hub-decoder-<certId>` (see `src/userDecoders.js`) and sync like other keys. They also feed a generated `<certId>-mine` quiz that is registered at runtime. Exams whose questions can change carry a `version`/`sig`, and saved progress made against older questions is ignored (`stateFor` in `src/main.js`).
- Keep the `dp700-hub-` prefix for every key, whatever the cert. The Progress dialog and sync rely on it.
