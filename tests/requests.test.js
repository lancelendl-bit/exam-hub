import { describe, it, expect } from "vitest";
import { loadRequests, saveRequests, requestCerts, removeRequest, statusOf, buildPrompt, buildIssue, issueUrl, ISSUE_LABEL, REPO, REQUESTS_KEY } from "../src/requests.js";
import { findHTML } from "../src/discoverView.js";
import { ALL, CANDIDATES } from "../src/catalog/index.js";
import { CERTS } from "../src/certs.js";
import { emptyHistory } from "../src/history.js";
import { practiceStatus } from "../src/discover.js";

const mem = () => {
  const m = new Map();
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, String(v)), raw: m };
};

describe("the Add to Exams queue", () => {
  it("queues new certs once and skips ones already in the app", () => {
    const r = loadRequests(mem());
    const inApp = new Set(["dp700"]);
    expect(requestCerts(r, ["dp750", "dp700", "az104"], inApp, 100)).toEqual(["dp750", "az104"]);
    expect(requestCerts(r, ["dp750", "ai103"], inApp, 200)).toEqual(["ai103"]);
    expect(r.items.map((x) => x.id)).toEqual(["dp750", "az104", "ai103"]);
    expect(r.items[0].at).toBe(100);
  });
  it("removes a request", () => {
    const r = loadRequests(mem());
    requestCerts(r, ["dp750", "az104"], new Set());
    removeRequest(r, "dp750");
    expect(r.items.map((x) => x.id)).toEqual(["az104"]);
  });
  it("saves under a synced key and survives garbage", () => {
    const s = mem();
    const r = loadRequests(s);
    requestCerts(r, ["dp750"], new Set());
    saveRequests(r, s);
    expect(REQUESTS_KEY.startsWith("dp700-hub-")).toBe(true);
    expect(loadRequests(s).items[0].id).toBe("dp750");
    s.setItem(REQUESTS_KEY, "{nope");
    expect(loadRequests(s).items).toEqual([]);
  });
  it("says a request is added once the cert has exams", () => {
    expect(statusOf({ id: "dp600" }, new Set(["dp600"]))).toBe("added");
    expect(statusOf({ id: "dp750" }, new Set(["dp600"]))).toBe("requested");
  });
  it("builds an instruction that names every cert and points at the skill", () => {
    const p = buildPrompt([{ code: "DP-750", title: "Azure Databricks Data Engineer Associate" }, { code: "AZ-104", title: "Azure Administrator Associate" }]);
    expect(p).toContain("DP-750 (Azure Databricks Data Engineer Associate); AZ-104 (Azure Administrator Associate)");
    expect(p).toContain(".claude/skills/add-cert");
    expect(p).toContain("ask me before deploying");
  });
});

describe("the GitHub issue the button opens", () => {
  const entries = [{ id: "dp750", code: "DP-750", title: "Azure Databricks Data Engineer Associate" }, { id: "az104", code: "AZ-104", title: "Azure Administrator Associate" }];
  it("lists one cert per line as id: code (title)", () => {
    const { title, body } = buildIssue(entries);
    expect(title).toBe("Add to Exams: DP-750, AZ-104");
    expect(body).toContain("- dp750: DP-750 (Azure Databricks Data Engineer Associate)\n- az104: AZ-104 (Azure Administrator Associate)");
  });
  it("links to the new-issue page of this repo with the workflow's label", () => {
    const u = new URL(issueUrl(entries));
    expect(u.origin + u.pathname).toBe("https://github.com/" + REPO + "/issues/new");
    expect(u.searchParams.get("labels")).toBe(ISSUE_LABEL);
    expect(u.searchParams.get("body")).toBe(buildIssue(entries).body);
  });
  it("uses the label the workflow listens for", async () => {
    const fs = await import("node:fs");
    const wf = fs.readFileSync(new URL("../.github/workflows/add-cert.yml", import.meta.url), "utf8");
    expect(wf).toContain("github.event.label.name == '" + ISSUE_LABEL + "'");
    expect(wf).toContain("github.repository_owner");
  });
});

describe("the shortlist card and queue on the page", () => {
  const ctx = (extra = {}) => ({
    all: ALL, catalog: CANDIDATES, practice: practiceStatus(emptyHistory()), earned: { items: [] }, earnedCount: 0, earnedIds: new Set(),
    shortlist: [], filters: { q: "", level: "", topic: "", platform: "", onlyShort: false }, fits: Object.fromEntries(CANDIDATES.map((e) => [e.id, { score: 0, reasons: [] }])),
    nameOf: (x) => { const e = ALL.find((c) => c.id === x.id); return e ? { code: e.code, title: e.title } : { code: x.id, title: "" }; },
    error: "", requests: { items: [] }, inAppIds: new Set(CERTS.map((c) => c.id)), requested: new Set(), msg: "", ...extra,
  });
  it("shows an enabled Add to Exams button when something is shortlisted", () => {
    const html = findHTML(ctx({ shortlist: ["dp750"] }));
    expect(html).toContain('id="shAdd"');
    expect(html).not.toMatch(/id="shAdd"\s+disabled/);
    expect(html).toContain("The app can't build them by itself");
  });
  it("shows no shortlist card, so no button, when nothing is shortlisted", () => {
    expect(findHTML(ctx())).not.toContain('id="shAdd"');
  });
  it("lists queued certs with their status and marks their cards", () => {
    const html = findHTML(ctx({ requests: { items: [{ id: "dp750", at: Date.now() }, { id: "dp600", at: Date.now() }] }, requested: new Set(["dp750"]) }));
    expect(html).toContain("Added to Exams queue");
    expect(html).toContain("Waiting to be built");
    expect(html).toContain("✓ Added"); // dp600 already has exams
    expect(html).toContain('data-unreq="dp750"');
    expect(html).toContain("In the queue");
    expect(html).toContain('id="reqCopy"');
    expect(html).toContain('id="reqIssue"');
  });
  it("shows the result message under the shortlist", () => {
    expect(findHTML(ctx({ shortlist: ["dp750"], msg: "Queued 1. The instruction is copied." }))).toContain("Queued 1. The instruction is copied.");
  });
});
