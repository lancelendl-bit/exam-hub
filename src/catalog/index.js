/* Every certification the Find a cert page knows about.
   inapp.js: certs that already have exams in the app. microsoft.js: Azure-related certs you could add next.
   Facts come from the vendors' official pages; each entry lists its sources in `src`.
   `buildsOn` is a suggested order, not a vendor requirement. */
import { entries as inapp } from "./inapp.js";
import { entries as microsoft } from "./microsoft.js";

export const ALL = [...inapp, ...microsoft];
export const CANDIDATES = ALL.filter((e) => !e.inApp);
