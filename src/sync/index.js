/* Sync orchestrator: configuration, sign-in, and one "exchange" that pulls the server's documents,
   decides per document who wins (merge.js), applies what came in and pushes what is newer here.

   Device-only keys (not exported, not synced): dp700-sync-config, dp700-sync-session, dp700-sync-undo.
   Before a server copy replaces a local document, the local copy is parked in dp700-sync-undo. */
import { collect } from "../backup.js";
import { HKEY } from "../history.js";
import { planSync, syncableDocs } from "./merge.js";
import { supabaseProvider } from "./supabase.js";

const CFG = "dp700-sync-config", SES = "dp700-sync-session", UNDO = "dp700-sync-undo";

export function createSync({
  store = localStorage,
  fetchFn = (...a) => fetch(...a),
  now = () => Date.now(),
  defaults = {}, // {url, key} baked in at build time
  onApplied = () => {}, // called with the keys that changed locally because of a sync
  onStatus = () => {},
  debounceMs = 3000,
} = {}) {
  const read = (k) => { try { return JSON.parse(store.getItem(k)); } catch (e) { return null; } };
  const write = (k, v) => store.setItem(k, JSON.stringify(v));
  let status = { state: "off", msg: "", at: null, email: null };
  let timer = null, running = null, queued = false;
  const set = (s) => { status = { ...status, ...s }; onStatus(status); };

  const config = () => {
    const c = read(CFG) || {};
    const url = c.url || defaults.url || "", key = c.key || defaults.key || "";
    return url && key ? { url, key, builtIn: !c.url && !!defaults.url } : null;
  };
  const session = () => read(SES);
  const provider = () => { const c = config(); return c ? supabaseProvider({ url: c.url, key: c.key, fetchFn, now }) : null; };

  function refreshStatus() {
    if (!config()) return set({ state: "off", email: null, msg: "" });
    const s = session();
    if (!s) return set({ state: "signedOut", email: null });
    if (status.state === "off" || status.state === "signedOut") set({ state: "idle", email: s.user.email });
  }

  async function refreshSession(p, s) {
    try {
      const n = await p.refresh(s.refresh_token);
      write(SES, n);
      return n;
    } catch (e) {
      if ([400, 401, 403].includes(e.status)) {
        store.removeItem(SES);
        set({ state: "signedOut", email: null, msg: "Your sign-in expired. Sign in again." });
        return null;
      }
      throw e;
    }
  }

  async function exchange(p, s) {
    const remote = await p.pull(s.access_token);
    const local = syncableDocs(collect(store));
    const { toPush, toPull } = planSync(local, remote);
    const pulled = Object.keys(toPull);
    if (pulled.length) {
      const undo = read(UNDO) || {};
      pulled.forEach((k) => {
        const cur = store.getItem(k);
        if (cur != null && k !== HKEY) undo[k] = { value: cur, at: now() };
        store.setItem(k, JSON.stringify(toPull[k]));
      });
      write(UNDO, undo);
      onApplied(pulled);
    }
    const pushed = Object.keys(toPush);
    await p.push(s.access_token, s.user.id, toPush);
    return { pushed: pushed.length, pulled: pulled.length };
  }

  async function doSync() {
    const p = provider();
    if (!p) return refreshStatus();
    let s = session();
    if (!s) return set({ state: "signedOut", email: null });
    set({ state: "syncing", msg: "" });
    try {
      if (s.expires_at - 60000 < now()) { s = await refreshSession(p, s); if (!s) return; }
      let r;
      try { r = await exchange(p, s); } catch (e) {
        if (e.status !== 401) throw e;
        s = await refreshSession(p, s); if (!s) return;
        r = await exchange(p, s);
      }
      set({ state: "idle", at: now(), email: s.user.email, msg: `Sent ${r.pushed}, received ${r.pulled}.` });
    } catch (e) {
      const offline = e instanceof TypeError || (typeof navigator !== "undefined" && navigator.onLine === false);
      set(offline ? { state: "offline", msg: "Offline. Will retry." } : { state: "error", msg: e.message || "Sync failed." });
    }
  }

  /** Runs a sync now. A call made while one is running queues exactly one follow-up. */
  function sync() {
    if (running) { queued = true; return running; }
    running = doSync().finally(() => { running = null; if (queued) { queued = false; sync(); } });
    return running;
  }

  /** Call after any local save. Waits a few seconds so a burst of answers becomes one upload. */
  function touch() {
    if (!config() || !session()) return;
    clearTimeout(timer);
    timer = setTimeout(sync, debounceMs);
  }

  async function signIn(email, password) {
    const p = provider();
    if (!p) throw new Error("Enter the server details first.");
    const s = await p.signIn(email, password);
    write(SES, s);
    set({ state: "idle", email: s.user.email, msg: "" });
    await sync();
  }

  async function signUp(email, password) {
    const p = provider();
    if (!p) throw new Error("Enter the server details first.");
    const r = await p.signUp(email, password);
    if (!r.session) return { confirm: true };
    write(SES, r.session);
    set({ state: "idle", email: r.session.user.email, msg: "" });
    await sync();
    return { signedIn: true };
  }

  function signOut() {
    store.removeItem(SES);
    set({ state: "signedOut", email: null, msg: "Signed out. Your progress stays on this device." });
  }

  function setConfig(url, key) { write(CFG, { url: String(url).trim(), key: String(key).trim() }); refreshStatus(); }
  function clearConfig() { store.removeItem(CFG); store.removeItem(SES); status = { ...status, email: null }; refreshStatus(); }

  /** Sync on start, when the app regains focus or comes back online, and every two minutes while open. */
  function start(win = window) {
    const go = () => { if (win.document.visibilityState !== "hidden") sync(); };
    win.addEventListener("online", go);
    win.addEventListener("focus", go);
    win.document.addEventListener("visibilitychange", go);
    setInterval(go, 120000);
    go();
  }

  refreshStatus();
  return { sync, touch, signIn, signUp, signOut, setConfig, clearConfig, start, config, session, status: () => status };
}
