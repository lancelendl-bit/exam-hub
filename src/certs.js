/* Certification registry. Add a cert here, then add its exams to EXAMS in src/exams.js.
   `domains` keys are the numbers used in each question's `d` field.
   `topics` group items for the History page. They are keyword rules: the first topic whose
   pattern matches an item's `ref` tag (then its stem) wins. The last topic should be a catch-all. */
/* Where the "Look this up" link on an explanation goes. `search` is a URL that takes the search terms on the end. */
const MS_DOCS = { label: "Microsoft Learn", search: "https://learn.microsoft.com/en-us/search/?terms=" };
const DBX_DOCS = { label: "the Databricks docs", search: "https://www.google.com/search?q=site%3Adocs.databricks.com+" };

/* Optional per cert: `family` ("fabric" shows the Fabric reference maps), `docs`, and `examDay` (bullets for the hub). */
export const CERTS = [
  {
    id: "dp700",
    code: "DP-700",
    title: "Microsoft Fabric Data Engineer Associate",
    short: "Data Engineer",
    family: "fabric",
    docs: MS_DOCS,
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
  {
    id: "dp600",
    code: "DP-600",
    title: "Microsoft Fabric Analytics Engineer Associate",
    short: "Analytics Engineer",
    family: "fabric",
    docs: MS_DOCS,
    // Skill areas and weights from the Microsoft Learn study guide (skills measured as of October 19, 2026).
    domains: {
      1: "Maintain a data analytics solution",
      2: "Prepare data",
      3: "Implement and manage semantic models",
    },
    topics: [
      { id: "sec", name: "Security and governance", re: /secur|permission|rls|row-level|column-level|object-level|file-level|folder-level|label|sensitiv|endorse|governance|access control|workspace role|certif|promot/i },
      { id: "alm", name: "Lifecycle and deployment", re: /\bgit\b|version control|pbip|pbit|pbids|deployment|impact analysis|xmla|template|shared semantic|lineage|\balm\b/i },
      { id: "dl", name: "Direct Lake and performance", re: /direct lake|fallback|incremental refresh|performance|optimi|aggregation|large semantic|large model|storage format|vertipaq|query folding|slow|framing/i },
      { id: "query", name: "Querying data", re: /kql|visual query|summarizecolumns|evaluate|query editor|query tool/i },
      { id: "dax", name: "DAX and calculations", re: /\bdax\b|calculat|measure|iterator|window|offset|variable|format string|field parameter|information function|time intelligence/i },
      { id: "model", name: "Semantic model design", re: /semantic model|storage mode|import mode|directquery|dual|composite|relationship|bridge|many-to-many|star schema.*(semantic|model)|role-playing/i },
      { id: "ingest", name: "Getting data", re: /connection|onelake catalog|real-time hub|shortcut|mirror|ingest|pipeline|dataflow|copy job|data store|choose between|eventhouse|eventstream|gateway|notebook/i },
      { id: "transform", name: "Transforming data", re: /\bview\b|function|stored procedure|star schema|denormal|aggregat|merge|join|duplicate|null|missing|convert|data type|filter|enrich|dimension|fact table|surrogate|identity|ctas|qualify|try_cast|datetime|slowly changing|power query|t-sql|\bsql\b/i },
      { id: "other", name: "Other", re: /./ },
    ],
  },
  {
    id: "dbxde",
    code: "Databricks DE",
    title: "Databricks Certified Data Engineer Associate",
    short: "Data Engineer Associate",
    family: "databricks",
    docs: DBX_DOCS,
    // Skill areas and weights from the official exam guide (exam version as of May 4, 2026).
    domains: {
      1: "Databricks Intelligence Platform",
      2: "Data Ingestion and Loading",
      3: "Data Transformation and Modeling",
      4: "Working with Lakeflow Jobs",
      5: "Implementing CI/CD",
      6: "Troubleshooting, Monitoring, and Optimization",
      7: "Governance and Security",
    },
    examDay: [
      "The real exam has 45 scored multiple-choice questions in 90 minutes, with no test aids. That is about two minutes a question, and extra time is added for unscored items.",
      "Code in questions is SQL when possible, otherwise Python. Read the last sentence of the question first: it names what you have to decide.",
      "Databricks doesn't state a passing score on its exam page. This app marks 70% as the pass line, so treat a result as a guide.",
    ],
    topics: [
      { id: "platform", name: "Platform and compute", re: /serverless compute|compute plane|classic compute|all-purpose|photon|sql warehouse|architecture|medallion|spark configuration|compute vs/i },
      { id: "auto", name: "Files: Auto Loader, COPY INTO, upload", re: /auto loader|cloudfiles|copy into|schema evolution|rescued|file notification|directory listing|upload|local files/i },
      { id: "sec", name: "Unity Catalog and access control", re: /grant|revoke|deny|privilege|unity catalog|abac|row filter|column mask|managed table|external table|governance|lineage|securable|use catalog|use schema|permission|undrop/i },
      { id: "cicd", name: "CI/CD and bundles", re: /bundle|\bdabs?\b|git folder|repos|databricks cli|ci\/cd|pull request|branch|deploy/i },
      { id: "dlt", name: "Declarative pipelines and data quality", re: /declarative|expectation|materialized view|streaming table|data quality|constraint|\bdlt\b/i },
      { id: "ingest", name: "Other ingestion", re: /lakeflow connect|connector|ingest|jdbc|odbc|rest api|streaming|incremental|partner|json|semi-structured|variant/i },
      { id: "jobs", name: "Lakeflow Jobs", re: /lakeflow jobs|job run|\bjobs?\b|trigger|schedule|retry|run if|condition|for each|\bdag\b|file arrival|table update|orchestrat/i },
      { id: "perf", name: "Performance and troubleshooting", re: /spark ui|skew|spill|shuffle|liquid clustering|predictive optimization|oom|out-of-memory|memory|cluster start|library|aqe|adaptive|optimi|z-order|partitioning|broadcast|tuning|monitor|troubleshoot/i },
      { id: "transform", name: "PySpark and SQL transformations", re: /join|union|dedup|explode|aggregat|dataframe|pyspark|silver|gold|bronze|cleaning|null|window|cast|split|rename|merge|approx|distinct/i },
      { id: "other", name: "Other", re: /./ },
    ],
  },
];

export const docsUrl = (cert, term) => (cert.docs || MS_DOCS).search + encodeURIComponent(term);

export const certOf = (id) => CERTS.find((c) => c.id === id) || CERTS[0];

const strip = (t) => String(t || "").replace(/<[^>]+>/g, " ");

/** Topic id for a question, using the cert's keyword rules. */
export function topicOf(cert, q) {
  const topics = cert.topics || [];
  const hit = topics.find((t) => t.re.test(q.ref || "")) || topics.find((t) => t.re.test(strip(q.stem || q.scen)));
  return hit ? hit.id : "other";
}
