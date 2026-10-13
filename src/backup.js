/* Export / import exam progress so it can move between devices (PC ↔ iPhone).
   Everything the app saves lives in localStorage under the "dp700-hub-" prefix. */
import { HKEY, mergeHistory, emptyHistory } from "./history.js";

export const PREFIX = "dp700-hub-";

export function collect(store = localStorage) {
  const out = {};
  for (let i = 0; i < store.length; i++) {
    const k = store.key(i);
    if (k && k.startsWith(PREFIX)) out[k] = JSON.parse(store.getItem(k));
  }
  return out;
}

/** Validates and writes an export. Returns the number of entries restored. */
export function restore(data, store = localStorage) {
  if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("That isn't a progress export.");
  const keys = Object.keys(data).filter((k) => k.startsWith(PREFIX));
  if (!keys.length) throw new Error("No DP-700 progress found in that export.");
  keys.forEach((k) => {
    if (k === HKEY && data[k] && Array.isArray(data[k].attempts)) {
      // History is merged, never replaced, so importing an old export can't erase attempts made since.
      let cur = emptyHistory();
      try { const p = JSON.parse(store.getItem(k)); if (p && Array.isArray(p.attempts)) cur = p; } catch (e) { /* none yet */ }
      store.setItem(k, JSON.stringify(mergeHistory(cur, data[k])));
    } else {
      // An import is a deliberate act, so it counts as the newest edit when synced devices compare copies.
      const v = data[k];
      if (v && typeof v === "object" && !Array.isArray(v)) v.updatedAt = Date.now();
      store.setItem(k, JSON.stringify(v));
    }
  });
  return keys.length;
}

export function initBackup() {
  const $ = (s) => document.querySelector(s);
  const dlg = $("#backupDlg");
  if (!dlg) return;
  const msg = (t) => ($("#bkMsg").textContent = t);
  $("#backup").onclick = () => { msg(""); $("#bkText").value = ""; dlg.showModal(); };
  $("#bkExport").onclick = () => {
    const blob = new Blob([JSON.stringify(collect(), null, 1)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `dp700-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    msg("Exported. Import this file on your other device.");
  };
  $("#bkCopy").onclick = async () => {
    try { await navigator.clipboard.writeText(JSON.stringify(collect())); msg("Copied. Paste it into Import on the other device."); }
    catch { $("#bkText").value = JSON.stringify(collect()); $("#bkText").select(); msg("Copy the selected text."); }
  };
  $("#bkFile").onchange = async (e) => { const f = e.target.files[0]; if (f) $("#bkText").value = await f.text(); };
  $("#bkImport").onclick = () => {
    try {
      const n = restore(JSON.parse($("#bkText").value));
      msg(`Restored ${n} saved item${n === 1 ? "" : "s"}. Reloading…`);
      setTimeout(() => location.reload(), 700);
    } catch (err) { msg(err instanceof SyntaxError ? "That text isn't valid JSON." : err.message); }
  };
}
