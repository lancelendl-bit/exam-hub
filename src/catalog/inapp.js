/* The certifications that already have exams in the app, described the same way as catalog entries.
   `id` matches the cert id in src/certs.js. Skill weights come from each vendor's current exam guide. */
export const entries = [
  {
    id: "dp700", vendor: "Microsoft", code: "DP-700", title: "Fabric Data Engineer Associate", level: "Associate",
    topics: ["Data engineering"], platforms: ["Fabric"],
    audience: "Data engineers who build data loading, transformation and orchestration solutions on Microsoft Fabric.",
    skills: [
      { name: "Implement and manage an analytics solution", weight: "30–35%" },
      { name: "Ingest and transform data", weight: "30–35%" },
      { name: "Monitor and optimize an analytics solution", weight: "30–35%" },
    ],
    format: "", prerequisites: "", buildsOn: [],
    url: "https://learn.microsoft.com/en-us/credentials/certifications/fabric-data-engineer-associate/",
    src: ["https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/dp-700"], asOf: "2026-10", inApp: true,
  },
  {
    id: "dp600", vendor: "Microsoft", code: "DP-600", title: "Fabric Analytics Engineer Associate", level: "Associate",
    topics: ["Analytics and BI", "Data engineering"], platforms: ["Fabric", "Power BI"],
    audience: "Analytics engineers who design and manage semantic models, warehouses and lakehouses on Microsoft Fabric.",
    skills: [
      { name: "Maintain a data analytics solution", weight: "25–30%" },
      { name: "Prepare data", weight: "45–50%" },
      { name: "Implement and manage semantic models", weight: "25–30%" },
    ],
    format: "", prerequisites: "", buildsOn: [],
    url: "https://learn.microsoft.com/en-us/credentials/certifications/fabric-analytics-engineer-associate/",
    src: ["https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/dp-600"], asOf: "2026-10", inApp: true,
  },
  {
    id: "dbxde", vendor: "Databricks", code: "Databricks DE Associate", title: "Databricks Certified Data Engineer Associate", level: "Associate",
    topics: ["Data engineering"], platforms: ["Databricks"],
    audience: "Data engineers who do foundational ingestion, transformation, orchestration and governance work on the Databricks platform.",
    skills: [
      { name: "Databricks Intelligence Platform", weight: "6%" },
      { name: "Data Ingestion and Loading", weight: "21%" },
      { name: "Data Transformation and Modeling", weight: "22%" },
      { name: "Working with Lakeflow Jobs", weight: "16%" },
      { name: "Implementing CI/CD", weight: "10%" },
      { name: "Troubleshooting, Monitoring, and Optimization", weight: "10%" },
      { name: "Governance and Security", weight: "15%" },
    ],
    format: "45 scored multiple-choice questions, 90 minutes.",
    prerequisites: "None required; six months of hands-on Databricks experience is highly recommended.",
    buildsOn: [],
    url: "https://www.databricks.com/learn/certification/data-engineer-associate",
    src: ["https://www.databricks.com/learn/certification/data-engineer-associate"], asOf: "2026-10", inApp: true,
  },
];
