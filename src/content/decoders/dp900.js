/* DP-900 Azure Data Fundamentals stem decoder. Same shape as every decoder: see dp700.js.
   Skills measured: Microsoft Learn study guide for DP-900 (skills measured as of July 21, 2026).
   Sources: Microsoft Learn pages for Azure SQL (what is Azure SQL), Azure Database for PostgreSQL and MySQL flexible server, Azure Storage
   introduction, Blob Storage introduction and access tiers, Azure Cosmos DB overview, Azure Data Factory, Microsoft Fabric overview,
   Azure Databricks introduction, Azure Stream Analytics, Azure Event Hubs, Power BI overview, and the database normalization article.
   Rows on SQL statements, data roles and file formats are general definitions from the study guide outline. */
export default {
 intro: "DP-900 questions describe a data need in one or two sentences and ask which data type, Azure service or Power BI feature fits. The closing phrase usually holds the constraint (fully managed, OS access, graph, streaming, rarely read). Read it first, then match the phrase below.",
 how: [
  ["Name the shape of the data.","Rows and columns with a fixed schema, JSON documents, files, messages or events in motion. The shape rules out most services at once."],
  ["Find the workload and the constraint.","Transactional or analytical, batch or streaming, managed or full control, exact or flexible schema. One word in the last sentence usually decides it."],
  ["Eliminate by what the service is for.","Many options are real services used for the wrong job: a queue for file shares, a relational engine for graphs, a batch tool for live events. Cross those out first."]
 ],
 tables: [
  {id:"constraint", h:"Constraint phrases", sub:"These closing phrases rank otherwise-valid answers. Match the phrase, then pick the option shaped like the middle column.", cols:["Stem says","Points to","Typical wrong pick"], d:2, rows:[
   ["Fully managed relational database, no VM to manage","Azure SQL Database (PaaS)","SQL Server on Azure VMs"],
   ["Requires operating system access to the host","SQL Server on Azure VMs (IaaS)","Azure SQL Database"],
   ["Migrate SQL Server with almost 100 percent feature parity","Azure SQL Managed Instance","Azure SQL Database single database"],
   ["Many databases with variable usage share resources","Elastic pool in Azure SQL Database","One oversized single database"],
   ["Community PostgreSQL, minimal refactoring","Azure Database for PostgreSQL","Azure SQL Database"],
   ["Community MySQL engine, fully managed","Azure Database for MySQL flexible server","Azure SQL Managed Instance"],
   ["Unstructured data at massive scale","Azure Blob Storage","Azure Table storage"],
   ["Mount a shared folder over SMB","Azure Files","Azure Blob Storage"],
   ["Rarely read, hours of latency is acceptable, lowest cost","Archive access tier (offline)","Cool access tier"],
   ["Infrequent access but still immediate reads","Cool or cold access tier (online)","Archive access tier"],
   ["Single-digit millisecond NoSQL at global scale","Azure Cosmos DB","Azure SQL Database"],
   ["Existing MongoDB app, keep drivers and tools","Cosmos DB API for MongoDB","Cosmos DB API for NoSQL"],
   ["Analyze events as they arrive","Streaming (Stream Analytics or Real-Time Intelligence)","Scheduled batch pipeline"],
   ["Run Kafka workloads without code changes","Azure Event Hubs","Azure Queue storage"],
   ["Zero-copy access to S3 or ADLS data from Fabric","OneLake shortcut","Pipeline copy activity"],
   ["Pixel-perfect printable invoices","Power BI paginated report","Interactive dashboard"],
   ["Share and collaborate on a finished report","Power BI service","Power BI Desktop"],
   ["Model data and author a report on Windows","Power BI Desktop","Power BI Mobile app"]
  ]},
  {id:"concepts", h:"Core data concepts phrases", sub:"Concept stems name a data shape, a workload type or a job role.", cols:["Stem says","Points to"], d:1, rows:[
   ["Fixed schema of rows and columns","Structured data"],
   ["Fields named in the data, records can differ","Semi-structured data (JSON)"],
   ["No data model, such as video or binary files","Unstructured data"],
   ["Many small inserts and updates, reliable writes","Transactional workload (OLTP)"],
   ["Aggregate years of history to find trends","Analytical workload (OLAP)"],
   ["Columnar file format efficient for analytics","Parquet"],
   ["Plain-text rows split by a delimiter","CSV"],
   ["Manages backups, security and server performance","Database administrator"],
   ["Builds pipelines that ingest and transform data","Data engineer"],
   ["Builds models, reports and dashboards","Data analyst"],
   ["Object store for text and binary data","Azure Blob Storage"],
   ["Messages for asynchronous work between components","Azure Queue storage"],
   ["Schemaless key/attribute store","Azure Table storage"],
   ["Warehouse and lake combined in one platform","Data lakehouse"]
  ]},
  {id:"relational", h:"Relational data phrases", sub:"Relational stems name a design rule, a SQL statement or database object, or an Azure SQL product.", cols:["Stem says","Points to"], d:2, rows:[
   ["Store each fact once, remove redundancy","Normalization"],
   ["Repeating columns such as Vendor1, Vendor2","First normal form: move them to a related table"],
   ["Uniquely identifies each row in a table","Primary key"],
   ["Column that refers to a key in another table","Foreign key"],
   ["Statement that creates a table","CREATE TABLE (DDL)"],
   ["Statement that adds rows","INSERT (DML)"],
   ["Saved query used like a virtual table","View"],
   ["Speeds up lookups by a column value","Index"],
   ["Saved set of SQL statements with parameters","Stored procedure"],
   ["PaaS built for new cloud-born applications","Azure SQL Database"],
   ["PaaS with instance-scoped features for migrations","Azure SQL Managed Instance"],
   ["IaaS with full control of the engine and the OS","SQL Server on Azure VMs"],
   ["Serverless compute and elastic pools","Azure SQL Database"],
   ["Open-source engine run as a managed service","Azure Database for PostgreSQL or MySQL"]
  ]},
  {id:"nonrel", h:"Non-relational data phrases", sub:"Non-relational stems name a storage service, a blob setting or a Cosmos DB API.", cols:["Stem says","Points to"], d:3, rows:[
   ["Append-only logging from virtual machines","Append blob"],
   ["VHD files and random access disks","Page blob"],
   ["Account, container, blob","Blob Storage resource hierarchy"],
   ["Hierarchical file system on Blob Storage","Azure Data Lake Storage"],
   ["Highest storage cost, lowest access cost","Hot access tier"],
   ["Offline tier, rehydrate before reading","Archive access tier"],
   ["Tier can be set only on block blobs","Access tiers"],
   ["SMB, NFS and REST file shares","Azure Files"],
   ["Throughput-optimized tables, global distribution","Azure Cosmos DB for Table"],
   ["Native SQL queries over documents, automatic indexing","Cosmos DB API for NoSQL"],
   ["Wire protocol compatibility with MongoDB","Cosmos DB API for MongoDB"],
   ["Cassandra Query Language workloads","Cosmos DB API for Apache Cassandra"],
   ["Graph traversal of relationships","Cosmos DB API for Apache Gremlin"],
   ["Distributed relational apps on the PostgreSQL protocol","Cosmos DB API for PostgreSQL"],
   ["Flexible schema, latency sensitive, elastic","Good fit for Cosmos DB"],
   ["Highly relational app with many joins","Poor fit for Cosmos DB; use Azure SQL or MySQL"]
  ]},
  {id:"analytics", h:"Analytics workload phrases", sub:"Analytics stems name an integration service, a Fabric workload, a streaming service or a Power BI component.", cols:["Stem says","Points to"], d:4, rows:[
   ["Managed ETL and ELT pipelines","Azure Data Factory"],
   ["Connection information for a data store","Linked service"],
   ["Visual transformations run on managed Spark","Mapping data flow"],
   ["Logical group of activities","Pipeline"],
   ["Unified SaaS analytics platform","Microsoft Fabric"],
   ["Single tenant-wide logical data lake in Fabric","OneLake"],
   ["Spark notebooks and scheduled transformations","Fabric Data Engineering"],
   ["SQL engine that stores data as Delta","Fabric Data Warehouse"],
   ["Sensor data and clickstreams in motion","Real-Time Intelligence"],
   ["Unified open analytics platform on Spark and Delta","Azure Databricks"],
   ["SQL-like query over streaming data","Azure Stream Analytics"],
   ["Ingest millions of events per second","Azure Event Hubs"],
   ["Write streaming events to Blob or Data Lake","Event Hubs Capture"],
   ["Power Query, DAX and relationships on Windows","Power BI Desktop"],
   ["Workspaces, sharing and scheduled refresh","Power BI service"],
   ["Show a trend across months","Line chart"]
  ]}
 ],
 traps: [
  {h:"Words that flip the answer", items:[
   ["\"fully managed\" / \"no VM\"","PaaS: Azure SQL Database or Managed Instance, not SQL Server on a VM."],
   ["\"operating system access\"","SQL Server on Azure VMs. PaaS services hide the OS."],
   ["\"as it arrives\" / \"in motion\"","Streaming services, not a scheduled batch pipeline."],
   ["\"rarely accessed\" / \"hours is fine\"","Archive tier. The cool and cold tiers are still online."],
   ["\"existing app\" with a named engine","The matching compatible service: MongoDB API, PostgreSQL or MySQL."],
   ["\"printable\" / \"invoice\"","Paginated report built with Power BI Report Builder."]
  ]},
  {h:"Common distractor patterns", items:[
   ["Right service, wrong workload","Cosmos DB is not built for analytics, and Fabric is not an operational store."],
   ["Messaging for file sharing","Queue storage holds messages. File shares are Azure Files."],
   ["Relational engine for graphs","Graph relationships point to the Gremlin API, not a SQL database."],
   ["Archive tier for fast reads","Archive blobs must be rehydrated first, which can take hours."],
   ["Batch tool for streaming","Data Factory moves data on schedules or triggers; Stream Analytics handles live events."],
   ["Desktop to share","Power BI Desktop authors reports. Sharing and collaboration happen in the service."],
   ["Copying when a shortcut works","A OneLake shortcut gives zero-copy access; a copy activity duplicates the data."]
  ]}
 ],
};
