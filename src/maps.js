/* Service maps by cert id. A map is data (src/content/maps/<certId>.js) that the app draws as a diagram.
   DP-700 keeps its hand-built service and monitoring maps (see `maps` in src/certs.js).
   To add one, see .claude/skills/add-cert/SKILL.md. */
import dp600 from "./content/maps/dp600.js";
import dbxde from "./content/maps/dbxde.js";
import dp800 from "./content/maps/dp800.js";

export const MAPS = { dp600, dbxde, dp800 };
