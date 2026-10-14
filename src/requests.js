/* The "Add to Exams" queue: certifications you asked to have built into the app. Pure functions plus load/save,
   unit-tested. The app can't build exams by itself, so a request is a durable to-do plus a ready instruction for
   Claude Code (see .claude/skills/add-cert/SKILL.md). A request counts as added once the cert exists in src/certs.js.

   Saved under dp700-hub-requests so it syncs like the rest of your progress: {v:1, updatedAt, items:[{id, at}]} */
export const REQUESTS_KEY = "dp700-hub-requests";

export function loadRequests(store = localStorage) {
  try {
    const o = JSON.parse(store.getItem(REQUESTS_KEY));
    if (o && Array.isArray(o.items)) return { v: 1, updatedAt: o.updatedAt || 0, items: o.items.filter((x) => x && x.id) };
  } catch (e) { /* none yet */ }
  return { v: 1, updatedAt: 0, items: [] };
}

export function saveRequests(r, store = localStorage) {
  r.updatedAt = Date.now();
  store.setItem(REQUESTS_KEY, JSON.stringify(r));
}

/** Queues certs not already queued. `inApp` (ids that already have exams) are skipped. Returns the ids newly queued. */
export function requestCerts(r, ids, inApp = new Set(), now = Date.now()) {
  const added = [];
  ids.forEach((id) => {
    if (inApp.has(id) || r.items.some((x) => x.id === id)) return;
    r.items.push({ id, at: now });
    added.push(id);
  });
  return added;
}

export function removeRequest(r, id) {
  r.items = r.items.filter((x) => x.id !== id);
  return r;
}

/** "added" once the cert has exams in the app, otherwise "requested". */
export const statusOf = (item, inApp) => (inApp.has(item.id) ? "added" : "requested");

/** The instruction to paste into Claude Code. `entries` are catalog entries ({code, title}). */
export function buildPrompt(entries) {
  const list = entries.map((e) => `${e.code} (${e.title})`).join("; ");
  return `Add these certifications to Exam Hub: ${list}. ` +
    `Run the add-cert process from .claude/skills/add-cert for each one: add the cert and its Find a cert entry, ` +
    `a mock exam checked against the official docs, a stem decoder with its generated quiz, and a service map. ` +
    `Test everything, commit on a branch, and ask me before deploying.`;
}

/* The automated route: the button opens a prefilled GitHub issue labelled `add-cert`. The workflow in
   .github/workflows/add-cert.yml runs Claude Code on it and opens a pull request. */
export const REPO = "lancelendl-bit/exam-hub";
export const ISSUE_LABEL = "add-cert";

/** Title and body of the issue. The body lists one cert per line as `- <catalog id>: <code> (<title>)`. */
export function buildIssue(entries) {
  const codes = entries.map((e) => e.code).join(", ");
  const lines = entries.map((e) => `- ${e.id}: ${e.code} (${e.title})`).join("\n");
  return {
    title: `Add to Exams: ${codes}`,
    body: `Build these certifications into Exam Hub:\n\n${lines}\n\nCreated by the Add to Exams button. When this issue is labelled \`${ISSUE_LABEL}\`, the add-cert workflow builds each one and opens a pull request.`,
  };
}

export function issueUrl(entries) {
  const { title, body } = buildIssue(entries);
  return `https://github.com/${REPO}/issues/new?labels=${ISSUE_LABEL}&title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
}
