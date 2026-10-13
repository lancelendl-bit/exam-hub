/* Pure sync logic: which saved documents are synced, and which side wins for each one. No network, no DOM.

   A "document" is one localStorage entry under the dp700-hub- prefix.
   - History is merged (union of attempts, plus deletions), so neither device loses attempts.
   - Everything else is last-writer-wins on the document's `updatedAt` stamp. A deleted exam is a
     tombstone ({deleted:true, updatedAt}) so the deletion syncs too. */
import { HKEY, mergeHistory, emptyHistory } from "../history.js";

/** Keys that stay on this device. */
export const LOCAL_ONLY = ["dp700-hub-pref"];

export const syncableDocs = (all) => Object.fromEntries(Object.entries(all).filter(([k]) => !LOCAL_ONLY.includes(k)));

/** When a document last changed. Saves from before sync existed fall back to when the exam was finished. */
export const stamp = (v) => (v && (v.updatedAt ?? v.finishedAt ?? (v.lastScore && v.lastScore.at))) || 0;

const sameList = (a = [], b = []) => a.length === b.length && [...a].sort().every((x, i) => x === [...b].sort()[i]);
export const sameHistory = (a, b) => !!a && !!b && sameList(a.attempts.map((x) => x.id), b.attempts.map((x) => x.id)) && sameList(a.removed, b.removed);

/** Compares this device (`local`) with the server (`remote`). Both are {key: document}. */
export function planSync(local, remote) {
  const toPush = {}, toPull = {};
  for (const key of new Set([...Object.keys(local), ...Object.keys(remote)])) {
    const l = local[key], r = remote[key];
    if (key === HKEY) {
      const merged = mergeHistory(l && l.attempts ? l : emptyHistory(), r && r.attempts ? r : emptyHistory());
      if (!sameHistory(merged, r)) toPush[key] = merged;
      if (!sameHistory(merged, l)) toPull[key] = merged;
      continue;
    }
    if (l === undefined) { toPull[key] = r; continue; }
    if (r === undefined) { toPush[key] = l; continue; }
    const lu = stamp(l), ru = stamp(r);
    if (lu > ru) toPush[key] = l;
    else if (ru > lu) toPull[key] = r;
  }
  return { toPush, toPull };
}
