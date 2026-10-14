# Exam Hub

An installable, offline practice app for Microsoft Fabric (DP-700, DP-600) and Databricks (Data Engineer Associate) certifications. Pick a certification at the top of the hub.

- **DP-700:** 4 exams. Three full mock exams (case studies, hot area, drag-and-drop, Yes/No series) and the Stem Decoder quiz. Together they have 219 items.
- **Databricks Data Engineer Associate:** one 70-item mock exam covering all seven sections of the May 2026 exam guide, in the real exam's single-answer multiple-choice style. Each item cites the Databricks documentation it was checked against.
- **DP-600:** one 60-item mock exam across the three skill areas, with items checked against Microsoft Learn (each item's source is in a comment above it in `src/content/dp600/`).
- **Missed-item drill:** everything you got wrong across exams, in one run.
- **Check answer** on every item, free section jumping, and "retake with missed first".
- **Reference tabs** (they follow the certification you have selected):
  - **Service map:** DP-700 keeps its hand-built map. Other certs get a map drawn from data (boxes in lanes, link lines, a detail panel, walk-through flows and a glossary). **Monitoring map** is a hand-built DP-700 diagram and only shows for DP-700.
  - **Stem decoder:** searchable phrase → answer tables for each cert. A **Stem Decoder Quiz** is generated from the same data.
  - **Add your own phrases** on the decoder page, one at a time or pasted in bulk (`phrase | points to | wrong pick`). They are saved with your progress and sync. A **My Phrases Quiz** is built from them and appears on the exam list.
- **Reset…** on an exam card either resets progress (History stays) or deletes all data for that exam, including its attempts in History.
- **History** page: score trend with the 700 pass line, skill-area accuracy, topics weakest first, items you keep missing, and a log of every attempt you can export as CSV. Results you finished before this existed are picked up automatically.
- **Find a cert** page: where you stand (practice progress for every cert in the app), a list where you record the certifications you have really passed, and Azure-related certifications you could pursue next, each with its official skill areas. Suggestions adapt to what you have passed and practiced. Shortlist the ones you want, then press **Add to Exams**. The app can't build exams by itself, so that queues them (with a status per cert) and opens a pre-filled GitHub issue. Submit it and the `add-cert` workflow (`.github/workflows/add-cert.yml`, needs the `ANTHROPIC_API_KEY` secret and the Claude GitHub app) runs Claude Code, which follows the `add-cert` skill and opens a pull request. Nothing deploys until you merge it. The queue also has a chat instruction you can paste into Claude Code instead. Each cert gets its entry, a mock exam checked against the official docs, a stem decoder and quiz, and a service map. A queued cert shows Added once it has exams.
- **Cloud sync:** sign in on each device (desktop app, browser, iPhone) and progress and history follow you. See [Sync setup](#sync-setup).
- **Progress** button: sync, or export and import a file. Importing merges history instead of replacing it.
- Answer order is shuffled with a fixed seed, so the position of the correct answer gives nothing away.

## Install it

Once GitHub Pages is on (see below), open `https://lancelendl-bit.github.io/exam-hub/`. Then:

- **iPhone:** in Safari, tap Share → **Add to Home Screen**.
- **Windows (Chrome or Edge):** click the install icon in the address bar.

After the first load the app works offline.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # content integrity + engine tests (vitest)
npm run build    # production build in dist/
npm run decoder:preview -- dp600   # sample of a cert's generated decoder quiz
```

### Turn on hosting (one time)

1. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Every push to `main` runs the tests, builds the app, and deploys it.

## Sync setup

Sync uses a Supabase project you own. The app talks to it with plain `fetch`, so there is no SDK. The same code works with a self-hosted Supabase, only the URL changes.

1. In Supabase, open **SQL Editor**, paste `supabase/schema.sql` and run it. This creates one `progress` table where each user can only see their own rows.
2. **Authentication → Providers → Email** must be on. If **Confirm email** is on, new accounts get a confirmation email once. Turn it off if you want sign-up to sign in immediately.
3. Copy the **Project URL** and the **anon public key** (Project Settings → API). The anon key is meant to be public. Row-level security is what protects the data.
4. Give the app those two values, either way:
   - **Once per device:** Progress → Cloud sync → paste them in, then create an account or sign in.
   - **Baked into the build** (best for the phone): add repository variables `VITE_SYNC_URL` and `VITE_SYNC_KEY` under Settings → Secrets and variables → Actions → Variables. The deploy workflow passes them to the build, so every device only has to sign in. For local dev, put them in `.env.local`.

How it behaves:
- It syncs on start, when the app regains focus or comes back online, about 3 seconds after you answer something, and every two minutes while open.
- History from all devices is merged, so no attempt is lost.
- For an exam in progress, the most recently edited copy wins. If another device's copy replaces yours, yours is parked in `dp700-sync-undo` in local storage.
- Resetting an exam syncs too.
- Offline is fine. Changes stay on the device and upload later.
- The sign-in session and server details stay on the device. They are never exported or synced.

### Using a home server

Self-hosted Supabase works unchanged: set the Project URL to your server. Two things to plan for:
- The GitHub Pages site is HTTPS, so the browser blocks calls to a plain `http://` server. Your server needs a real HTTPS address.
- Your iPhone must reach it away from home, so it needs a tunnel or VPN-reachable HTTPS address (for example Tailscale or a Cloudflare Tunnel).

## Layout

| Path | What |
|---|---|
| `index.html` | App shell: top bar, views, progress dialog |
| `src/main.js` | Hub, exam runner, review, results, drill, view switching |
| `src/certs.js` | Certification registry: code, title, skill areas |
| `src/exams.js` | Exam registry: which exams exist and which cert each belongs to |
| `src/engine/core.js` | Pure logic: seeded shuffle, answer remap, scoring (unit-tested) |
| `src/content/exam1-4.js` | Question banks. Each returns `{CASES, Q, SECTIONS}` |
| `src/history.js` | Attempt log and the analytics behind the History page (unit-tested) |
| `src/historyView.js` | History page: HTML and SVG charts |
| `src/sync/` | Cloud sync: pure merge rules, Supabase provider, orchestrator, dialog UI |
| `supabase/schema.sql` | The one table sync needs, with row-level security |
| `src/discover.js`, `src/discoverView.js` | Find a cert page: shortlist, passed certifications, suggestions, filters |
| `src/catalog/` | Certification facts for that page: `inapp.js` (certs with exams), `microsoft.js` (Azure-related candidates) |
| `src/maps.js`, `src/content/maps/`, `src/mapModel.js`, `src/mapView.js` | Service map data per cert, its validation, and the page that draws it |
| `src/requests.js` | The Add to Exams queue |
| `.claude/skills/add-cert/` | Project skill: the whole process of adding a cert (cert, exam, decoder, map) |
| `src/decoders.js`, `src/content/decoders/` | Stem decoder data per cert. Each one gives the decoder page and a generated quiz |
| `src/decoderQuiz.js`, `src/decoderView.js` | Builds the quiz from decoder data, and renders the decoder page |
| `src/userDecoders.js` | Phrases you add in the app: validation, bulk paste, and the My Phrases Quiz |
| `src/optionBias.js` | Measures whether the correct option gives itself away by length (`npm run lengths`) |
| `.claude/skills/stem-decoder/` | Project skill: how to generate a decoder and quiz for a new cert |
| `src/backup.js` | Progress export / import |
| `maps/*.html` | The three reference pages, loaded in the hub's tabs |
| `tests/` | Vitest suites |
| `scripts/make-icons.py` | Regenerates the PWA icons |

## Question format

```js
{ s: 1,            // section index
  d: 2,            // skills-outline domain (1-3)
  t: "single",     // single | multi | hot | build | match | yesno | series
  stem: "…", opts: ["…"], a: 0,
  ex: "Explanation shown after Check answer",
  ref: "topic tag" }
```

`npm test` checks every item:
- each answer key points at a real option
- shuffling never changes which answer is correct
- a perfect answer sheet scores 1000
