# Fabric Exam Hub

An installable, offline practice app for the Microsoft Fabric certifications. Pick a certification at the top of the hub. DP-700 (Fabric Data Engineer Associate) is built in.

- **4 exams:** three full mock exams (case studies, hot area, drag-and-drop, Yes/No series) and the Stem Decoder quiz. Together they have 219 items.
- **Missed-item drill:** everything you got wrong across exams, in one run.
- **Check answer** on every item, free section jumping, and "retake with missed first".
- **Reference tabs:**
  - **Service map:** interactive map of Fabric items and how they connect, with flows and a glossary.
  - **Monitoring map:** which tool monitors which item, and when to use it.
  - **Stem decoder:** searchable phrase → answer tables.
- **History** page: score trend with the 700 pass line, skill-area accuracy, topics weakest first, items you keep missing, and a log of every attempt you can export as CSV. Results you finished before this existed are picked up automatically.
- **Progress** button: export or import your progress to move it between PC and phone. Importing merges history instead of replacing it.
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
```

### Turn on hosting (one time)

1. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Every push to `main` runs the tests, builds the app, and deploys it.

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
