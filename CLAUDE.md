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
- Facts must match current Microsoft Learn docs for Fabric. Verify before adding or changing an explanation.
- To add an exam, add a content module, then add an entry to `EXAMS` in `src/main.js`.
