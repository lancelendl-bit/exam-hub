/* Stem decoders by cert id. A decoder gives the Stem decoder page and, unless the cert has a hand-written one,
   a generated Stem Decoder Quiz. To add one, see .claude/skills/stem-decoder/SKILL.md. */
import dp700 from "./content/decoders/dp700.js";
import dp600 from "./content/decoders/dp600.js";

export const DECODERS = { dp700, dp600 };

/* Certs whose decoder quiz is a hand-written exam in src/content (the id of that exam). */
export const HAND_QUIZ = { dp700: "e4" };

export const quizIdFor = (certId) => HAND_QUIZ[certId] || `${certId}-stem`;
