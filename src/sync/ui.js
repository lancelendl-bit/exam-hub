/* Sync section of the Progress dialog, plus the small status mark on the Progress button. */
export function initSyncUI(sync) {
  const $ = (s) => document.querySelector(s);
  if (!$("#syncBox")) return null;
  let editing = false;
  const MARKS = { syncing: ["…", "Syncing"], idle: ["✓", "Synced"], error: ["!", "Sync problem"], offline: ["–", "Offline"] };
  const say = (t) => ($("#syncMsg").textContent = t || "");
  const busy = (on) => ["#syncSignIn", "#syncSignUp", "#syncNow", "#syncSave"].forEach((s) => { const b = $(s); if (b) b.disabled = on; });

  function render(st = sync.status()) {
    const cfg = sync.config(), ses = sync.session();
    const m = MARKS[st.state];
    const mark = $("#syncMark");
    if (mark) { mark.textContent = m ? ` ${m[0]}` : ""; mark.title = m ? m[1] + (st.msg ? `: ${st.msg}` : "") : ""; }

    $("#syncCfg").hidden = !!cfg && !editing || !!(cfg && cfg.builtIn);
    $("#syncAuth").hidden = !cfg || !!ses || editing;
    $("#syncUser").hidden = !cfg || !ses || editing;
    $("#syncChange").hidden = !cfg || cfg.builtIn || editing;

    let text;
    if (!cfg) text = "Sync keeps your progress the same on every device you sign in on. Enter your Supabase project details to start.";
    else if (!ses) text = "Not signed in. Progress stays on this device until you sign in.";
    else if (st.state === "syncing") text = "Syncing…";
    else if (st.state === "error") text = `Sync problem: ${st.msg}`;
    else if (st.state === "offline") text = "Offline. Changes are kept here and will upload when you are back online.";
    else text = `Signed in as ${ses.user.email}.${st.at ? ` Last synced ${new Date(st.at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}.` : ""}`;
    $("#syncState").textContent = text;
    if (st.state === "idle" && st.msg && ses) say(st.msg);
  }

  $("#syncSave").onclick = () => {
    const url = $("#syncUrl").value.trim(), key = $("#syncKey").value.trim();
    // http is accepted only when the app itself is served over http (local development).
    const okUrl = /^https:\/\//i.test(url) || (/^http:\/\//i.test(url) && location.protocol === "http:");
    if (!okUrl || !key) return say("Enter an https:// project URL and the anon (public) key.");
    sync.setConfig(url, key); editing = false; say(""); render();
  };
  $("#syncChange").onclick = () => {
    const c = sync.config();
    $("#syncUrl").value = c ? c.url : ""; $("#syncKey").value = c ? c.key : "";
    editing = true; render();
  };
  const creds = () => ({ email: $("#syncEmail").value.trim(), password: $("#syncPass").value });
  async function auth(kind) {
    const { email, password } = creds();
    if (!email || !password) return say("Enter your email and password.");
    busy(true); say(kind === "up" ? "Creating account…" : "Signing in…");
    try {
      if (kind === "up") {
        const r = await sync.signUp(email, password);
        say(r.confirm ? "Check your email to confirm the account, then come back and sign in." : "Account created and signed in.");
      } else { await sync.signIn(email, password); say(""); }
      $("#syncPass").value = "";
    } catch (e) { say(e.message || "That didn't work."); }
    busy(false); render();
  }
  $("#syncSignIn").onclick = () => auth("in");
  $("#syncSignUp").onclick = () => auth("up");
  $("#syncPass").onkeydown = (e) => { if (e.key === "Enter") { e.preventDefault(); auth("in"); } };
  $("#syncNow").onclick = async () => { busy(true); say(""); await sync.sync(); busy(false); render(); };
  $("#syncOut").onclick = () => { sync.signOut(); say(""); render(); };

  render();
  return { render };
}
