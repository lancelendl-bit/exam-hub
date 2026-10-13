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
- To add an exam, add a content module, then add an entry to `EXAMS` in `src/exams.js`. Its `cert` must be an id from `src/certs.js`, and each item's `d` must be one of that cert's `domains` keys.
- To add a certification, add it to `CERTS` in `src/certs.js`. The hub shows a cert switcher once there is more than one. The DP-700 drill keeps the key `dp700-hub-drill`; other certs use `dp700-hub-drill-<certId>`.
- Finished attempts are logged under `dp700-hub-history` (see `src/history.js`). Items are stored by index, so reordering a bank changes what old attempts point at. Topic rules for the History page live on each cert in `src/certs.js`.
- Sync (`src/sync/`) copies every `dp700-hub-*` key except `dp700-hub-pref`. Exam documents are last-writer-wins on `updatedAt`, which `save()` only advances when content changes. Resetting writes a tombstone (`{deleted:true}`), not a removal. Don't write to those keys without going through `save()`, `clearState()` or the history helpers, or the change won't sync.
- Keep the `dp700-hub-` prefix for every key, whatever the cert. The Progress dialog and sync rely on it.
