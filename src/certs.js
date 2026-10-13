/* Certification registry. Add a cert here, then add its exams to EXAMS in src/exams.js.
   `domains` keys are the numbers used in each question's `d` field. */
export const CERTS = [
  {
    id: "dp700",
    code: "DP-700",
    title: "Microsoft Fabric Data Engineer Associate",
    short: "Data Engineer",
    domains: {
      1: "Implement and manage an analytics solution",
      2: "Ingest and transform data",
      3: "Monitor and optimize an analytics solution",
    },
  },
];

export const certOf = (id) => CERTS.find((c) => c.id === id) || CERTS[0];
