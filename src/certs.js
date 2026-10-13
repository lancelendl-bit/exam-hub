/* Certification registry. Add a cert here, then add its exams to EXAMS in src/exams.js.
   `domains` keys are the numbers used in each question's `d` field.
   `topics` group items for the History page. They are keyword rules: the first topic whose
   pattern matches an item's `ref` tag (then its stem) wins. The last topic should be a catch-all. */
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
    topics: [
      { id: "sec", name: "Security and governance", re: /secur|permission|rls|row-level|column-level|masking|label|purview|governance|encrypt|identity|private link|firewall|access|role|credential|sensitiv|audit|endorse|gateway|managed/i },
      { id: "rt", name: "Real-time and Eventstreams", re: /eventstream|eventhouse|kql|real-time|streaming|activator|event hub|kusto|windowing|tumbling/i },
      { id: "alm", name: "Source control and deployment", re: /\bgit\b|deployment|\balm\b|ci\/cd|source control|branch|variable librar|release|fabric cli/i },
      { id: "mon", name: "Monitoring and troubleshooting", re: /monitor|capacity|metrics|troubleshoot|alert|\blog|diagnos|throttl|smoothing|query insights|spark ui|history/i },
      { id: "spark", name: "Lakehouse and Spark", re: /lakehouse|spark|notebook|delta|environment|pool|v-order|vacuum|optimize|shortcut|onelake|parquet|library|livy|session|medallion|table maintenance/i },
      { id: "wh", name: "Warehouse and SQL", re: /warehouse|t-sql|sql|mirror|merge|\bcte\b|\bscd\b|slowly changing|dimension|star schema|clone|snapshot|stored procedure/i },
      { id: "orch", name: "Pipelines and dataflows", re: /pipeline|dataflow|copy|orchestrat|trigger|schedule|foreach|lookup|activity|power query|incremental|refresh|fast copy|staging|runmultiple|parameter/i },
      { id: "other", name: "Other", re: /./ },
    ],
  },
];

export const certOf = (id) => CERTS.find((c) => c.id === id) || CERTS[0];

const strip = (t) => String(t || "").replace(/<[^>]+>/g, " ");

/** Topic id for a question, using the cert's keyword rules. */
export function topicOf(cert, q) {
  const topics = cert.topics || [];
  const hit = topics.find((t) => t.re.test(q.ref || "")) || topics.find((t) => t.re.test(strip(q.stem || q.scen)));
  return hit ? hit.id : "other";
}
