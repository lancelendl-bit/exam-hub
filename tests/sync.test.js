import { describe, it, expect, vi } from "vitest";
import { planSync, stamp, syncableDocs } from "../src/sync/merge.js";
import { createSync } from "../src/sync/index.js";
import { restore } from "../src/backup.js";
import { HKEY, emptyHistory, addAttempt, makeAttempt } from "../src/history.js";

/* ---------- helpers ---------- */
const memStore = () => {
  const m = new Map();
  return {
    get length() { return m.size; },
    key: (i) => [...m.keys()][i],
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k),
    raw: m,
  };
};

/** A tiny in-memory stand-in for the parts of Supabase the app calls. */
function fakeSupabase({ confirmEmail = false } = {}) {
  const users = {}, rows = {}, tokens = new Map(), refreshes = new Map();
  let n = 0, clock = Date.now();
  const log = [];
  const json = (status, body) => new Response(JSON.stringify(body), { status });
  const issue = (user) => {
    const access = `acc${++n}`, refresh = `ref${n}`;
    tokens.set(access, user.id); refreshes.set(refresh, user.id);
    return { access_token: access, refresh_token: refresh, expires_in: 3600, user: { id: user.id, email: user.email } };
  };
  async function fetchFn(url, init = {}) {
    const u = new URL(url);
    const body = init.body ? JSON.parse(init.body) : null;
    const auth = (init.headers || {}).Authorization;
    log.push(`${init.method || "GET"} ${u.pathname}`);
    if (u.pathname === "/auth/v1/signup") {
      if (users[body.email]) return json(400, { msg: "User already registered" });
      users[body.email] = { id: `u-${body.email}`, email: body.email, password: body.password };
      return json(200, confirmEmail ? { id: users[body.email].id, email: body.email } : issue(users[body.email]));
    }
    if (u.pathname === "/auth/v1/token" && u.searchParams.get("grant_type") === "password") {
      const us = users[body.email];
      return us && us.password === body.password ? json(200, issue(us)) : json(400, { error_description: "Invalid login credentials" });
    }
    if (u.pathname === "/auth/v1/token" && u.searchParams.get("grant_type") === "refresh_token") {
      const id = refreshes.get(body.refresh_token);
      const us = Object.values(users).find((x) => x.id === id);
      return us ? json(200, issue(us)) : json(400, { msg: "Invalid Refresh Token" });
    }
    if (u.pathname === "/rest/v1/progress") {
      const uid = tokens.get((auth || "").replace("Bearer ", ""));
      if (!uid) return json(401, { message: "JWT expired" });
      rows[uid] ||= {};
      if ((init.method || "GET") === "GET") return json(200, Object.entries(rows[uid]).map(([key, value]) => ({ key, value })));
      body.forEach((r) => { expect(r.user_id).toBe(uid); rows[uid][r.key] = r.value; });
      return new Response(null, { status: 201 });
    }
    return json(404, { message: "no route" });
  }
  return { fetchFn, users, rows, tokens, log, expireAll: () => tokens.clear(), advance: (ms) => (clock += ms), now: () => clock };
}

const device = (server, extra = {}) => {
  const store = memStore();
  const applied = [];
  const sync = createSync({ store, fetchFn: server.fetchFn, now: server.now, defaults: { url: "https://x.supabase.test", key: "anon" }, onApplied: (k) => applied.push(...k), ...extra });
  return { store, sync, applied, put: (k, v) => store.setItem(k, JSON.stringify(v)), get: (k) => JSON.parse(store.getItem(k)) };
};

const att = (at, exam = "e1") => makeAttempt({ cert: "dp700", exam, at, Q: [{ t: "single", a: 0, d: 1, ref: "x", opts: ["a", "b"] }], ans: { 0: 0 } });

/* ---------- planSync ---------- */
describe("planSync", () => {
  it("newer document wins, in either direction", () => {
    const a = { "dp700-hub-e1": { updatedAt: 200, ans: { 0: 1 } } }, b = { "dp700-hub-e1": { updatedAt: 100, ans: {} } };
    expect(Object.keys(planSync(a, b).toPush)).toEqual(["dp700-hub-e1"]);
    expect(Object.keys(planSync(b, a).toPull)).toEqual(["dp700-hub-e1"]);
    expect(planSync(a, a)).toEqual({ toPush: {}, toPull: {} });
  });
  it("copies documents that exist on only one side", () => {
    const { toPush, toPull } = planSync({ "dp700-hub-e1": { updatedAt: 1 } }, { "dp700-hub-e2": { updatedAt: 1 } });
    expect(Object.keys(toPush)).toEqual(["dp700-hub-e1"]);
    expect(Object.keys(toPull)).toEqual(["dp700-hub-e2"]);
  });
  it("a newer tombstone beats an older document", () => {
    const { toPull } = planSync({ "dp700-hub-e1": { updatedAt: 10, ans: { 0: 1 } } }, { "dp700-hub-e1": { deleted: true, updatedAt: 20 } });
    expect(toPull["dp700-hub-e1"].deleted).toBe(true);
  });
  it("falls back to the finish time for saves that predate sync", () => {
    expect(stamp({ lastScore: { at: 55 } })).toBe(55);
    expect(stamp({ finishedAt: 60, lastScore: { at: 55 } })).toBe(60);
    expect(stamp({})).toBe(0);
  });
  it("merges history from both sides instead of picking one", () => {
    const a = emptyHistory(), b = emptyHistory();
    addAttempt(a, att(1)); addAttempt(b, att(2));
    const { toPush, toPull } = planSync({ [HKEY]: a }, { [HKEY]: b });
    expect(toPush[HKEY].attempts).toHaveLength(2);
    expect(toPull[HKEY].attempts).toHaveLength(2);
  });
  it("leaves identical history alone", () => {
    const a = emptyHistory(); addAttempt(a, att(1));
    expect(planSync({ [HKEY]: a }, { [HKEY]: JSON.parse(JSON.stringify(a)) })).toEqual({ toPush: {}, toPull: {} });
  });
  it("keeps device-only keys out", () => {
    expect(Object.keys(syncableDocs({ "dp700-hub-pref": {}, "dp700-hub-e1": {} }))).toEqual(["dp700-hub-e1"]);
  });
});

/* ---------- full flow against the fake server ---------- */
describe("sync between two devices", () => {
  it("signs up, uploads, and a second device receives everything", async () => {
    const server = fakeSupabase();
    const a = device(server), b = device(server);
    expect(await a.sync.signUp("me@x.test", "pw-123456")).toEqual({ signedIn: true });
    a.put("dp700-hub-e1", { v: 2, updatedAt: 100, ans: { 0: 1 } });
    const h = emptyHistory(); addAttempt(h, att(5)); a.put(HKEY, h);
    await a.sync.sync();

    await b.sync.signIn("me@x.test", "pw-123456");
    expect(b.get("dp700-hub-e1").ans).toEqual({ 0: 1 });
    expect(b.get(HKEY).attempts).toHaveLength(1);
    expect(b.applied.sort()).toEqual([HKEY, "dp700-hub-e1"].sort());
    expect(b.sync.status().state).toBe("idle");
  });

  it("converges when both devices changed different things", async () => {
    const server = fakeSupabase();
    const a = device(server), b = device(server);
    await a.sync.signUp("me@x.test", "pw-123456");
    await b.sync.signIn("me@x.test", "pw-123456");
    a.put("dp700-hub-e1", { v: 2, updatedAt: 100, ans: { 0: 1 } });
    b.put("dp700-hub-e2", { v: 2, updatedAt: 150, ans: { 3: 0 } });
    const ha = emptyHistory(); addAttempt(ha, att(1)); a.put(HKEY, ha);
    const hb = emptyHistory(); addAttempt(hb, att(2, "e2")); b.put(HKEY, hb);
    await a.sync.sync(); await b.sync.sync(); await a.sync.sync();
    for (const d of [a, b]) {
      expect(Object.keys(d.get("dp700-hub-e1").ans)).toEqual(["0"]);
      expect(Object.keys(d.get("dp700-hub-e2").ans)).toEqual(["3"]);
      expect(d.get(HKEY).attempts.map((x) => x.at)).toEqual([1, 2]);
    }
  });

  it("the most recent edit of the same exam wins, and the loser is parked for recovery", async () => {
    const server = fakeSupabase();
    const a = device(server), b = device(server);
    await a.sync.signUp("me@x.test", "pw-123456");
    await b.sync.signIn("me@x.test", "pw-123456");
    a.put("dp700-hub-e1", { v: 2, updatedAt: 100, ans: { 0: 1 } });
    await a.sync.sync(); await b.sync.sync();
    b.put("dp700-hub-e1", { v: 2, updatedAt: 300, ans: { 0: 1, 1: 2 } });
    a.put("dp700-hub-e1", { v: 2, updatedAt: 200, ans: { 0: 3 } });
    await b.sync.sync(); await a.sync.sync();
    expect(a.get("dp700-hub-e1").ans).toEqual({ 0: 1, 1: 2 });
    const undo = JSON.parse(a.store.getItem("dp700-sync-undo"));
    expect(JSON.parse(undo["dp700-hub-e1"].value).ans).toEqual({ 0: 3 });
  });

  it("a reset exam stays reset on the other device", async () => {
    const server = fakeSupabase();
    const a = device(server), b = device(server);
    await a.sync.signUp("me@x.test", "pw-123456");
    await b.sync.signIn("me@x.test", "pw-123456");
    a.put("dp700-hub-e1", { v: 2, updatedAt: 100, ans: { 0: 1 } });
    await a.sync.sync(); await b.sync.sync();
    a.put("dp700-hub-e1", { deleted: true, updatedAt: 400 });
    await a.sync.sync(); await b.sync.sync();
    expect(b.get("dp700-hub-e1").deleted).toBe(true);
  });

  it("never uploads device-only keys", async () => {
    const server = fakeSupabase();
    const a = device(server);
    await a.sync.signUp("me@x.test", "pw-123456");
    a.put("dp700-hub-pref", { cert: "dp600" });
    a.put("dp700-hub-e1", { v: 2, updatedAt: 1 });
    await a.sync.sync();
    const stored = Object.keys(server.rows["u-me@x.test"]);
    expect(stored).toEqual(["dp700-hub-e1"]);
  });

  it("refreshes an expired access token and retries", async () => {
    const server = fakeSupabase();
    const a = device(server);
    await a.sync.signUp("me@x.test", "pw-123456");
    a.put("dp700-hub-e1", { v: 2, updatedAt: 1 });
    server.expireAll(); // the server now rejects the stored access token
    await a.sync.sync();
    expect(a.sync.status().state).toBe("idle");
    expect(server.log.some((l) => l.includes("/auth/v1/token"))).toBe(true);
    expect(Object.keys(server.rows["u-me@x.test"])).toEqual(["dp700-hub-e1"]);
  });

  it("signs out cleanly when the refresh token is rejected", async () => {
    const server = fakeSupabase();
    const a = device(server);
    await a.sync.signUp("me@x.test", "pw-123456");
    server.expireAll();
    a.store.setItem("dp700-sync-session", JSON.stringify({ ...a.sync.session(), refresh_token: "bogus", expires_at: 0 }));
    await a.sync.sync();
    expect(a.sync.status().state).toBe("signedOut");
    expect(a.sync.session()).toBeNull();
  });

  it("reports offline without touching local data", async () => {
    const server = fakeSupabase();
    const a = device(server, { fetchFn: async () => { throw new TypeError("Failed to fetch"); } });
    a.store.setItem("dp700-sync-session", JSON.stringify({ access_token: "t", refresh_token: "r", expires_at: Date.now() + 1e6, user: { id: "u", email: "me@x.test" } }));
    a.put("dp700-hub-e1", { v: 2, updatedAt: 1, ans: { 0: 1 } });
    await a.sync.sync();
    expect(a.sync.status().state).toBe("offline");
    expect(a.get("dp700-hub-e1").ans).toEqual({ 0: 1 });
  });

  it("rejects a wrong password with the server's message", async () => {
    const server = fakeSupabase();
    const a = device(server);
    await a.sync.signUp("me@x.test", "pw-123456");
    await expect(device(server).sync.signIn("me@x.test", "nope")).rejects.toThrow("Invalid login credentials");
  });

  it("handles projects that require email confirmation", async () => {
    const server = fakeSupabase({ confirmEmail: true });
    const a = device(server);
    expect(await a.sync.signUp("me@x.test", "pw-123456")).toEqual({ confirm: true });
    expect(a.sync.session()).toBeNull();
  });

  it("does nothing until a server is configured", async () => {
    const store = memStore();
    const s = createSync({ store, fetchFn: () => { throw new Error("no network expected"); } });
    expect(s.status().state).toBe("off");
    await s.sync();
    expect(s.config()).toBeNull();
  });

  it("batches rapid saves into one upload", async () => {
    vi.useFakeTimers();
    try {
      const server = fakeSupabase();
      const a = device(server);
      await a.sync.signUp("me@x.test", "pw-123456");
      const before = server.log.filter((l) => l.startsWith("POST /rest")).length;
      a.put("dp700-hub-e1", { v: 2, updatedAt: 1 });
      a.sync.touch(); a.sync.touch(); a.sync.touch();
      await vi.advanceTimersByTimeAsync(3500);
      expect(server.log.filter((l) => l.startsWith("POST /rest")).length - before).toBe(1);
    } finally { vi.useRealTimers(); }
  });
});

describe("importing progress", () => {
  it("stamps imported exam state so it beats an older synced copy", () => {
    const store = memStore();
    restore({ "dp700-hub-e1": { v: 2, ans: { 0: 1 } } }, store);
    expect(JSON.parse(store.getItem("dp700-hub-e1")).updatedAt).toBeGreaterThan(0);
  });
});
