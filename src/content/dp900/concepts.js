// DP-900 skill area 1: Describe core data concepts. Items that cite the study guide cover general definitions that were not checked against a topic page.
export const items=[
/* src: https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blobs-introduction */
{s:0,d:1,t:"single",ref:"unstructured data definition images video blob storage",
 stem:`A media company stores millions of videos and scanned documents. The files have no particular data model or schema. Which term describes this kind of data, and which Azure service is optimized for it?`,
 opts:["Unstructured data, stored in Azure Blob Storage, which is optimized for massive amounts of it","Structured data, stored in Azure Table storage, which enforces a fixed set of columns on every item","Semi-structured data, stored in Azure Queue storage, which keeps files until the next consumer reads them","Structured data, stored in Azure SQL Database, which stores files best when each has a fixed schema"],a:0,
 ex:`The Blob Storage documentation defines unstructured data as data that doesn't adhere to a particular data model or definition, such as text or binary data, and describes Blob Storage as optimized for storing massive amounts of it. Table storage is a schemaless key/attribute store for structured NoSQL data, and Queue storage is for messages, not files.`},

/* src: https://learn.microsoft.com/en-us/azure/storage/common/storage-introduction */
{s:0,d:1,t:"single",ref:"Azure Table storage NoSQL key attribute schemaless",
 stem:`A web application must keep flexible datasets such as user profiles and address books. Items in the same table can have different properties, and no joins are needed. Which Azure Storage service fits?`,
 opts:["Azure Files, which exposes managed file shares and has no key/attribute entities","Azure Queue storage, which holds messages for asynchronous processing between components","Azure Elastic SAN, which presents block volumes to compute resources over the iSCSI protocol","Azure Table storage, a NoSQL key/attribute store with a schemaless design"],a:3,
 ex:`Azure Tables stores structured NoSQL data as a key/attribute store with a schemaless design, which suits flexible datasets like user data and address books. Files is for file shares, Queues is for messaging, and Elastic SAN provides block storage over iSCSI.`},

/* src: https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/dp-900 */
{s:0,d:1,t:"single",ref:"transactional workload OLTP many small writes",
 stem:`An online store records each order as it is placed. The workload is many small, concurrent inserts and updates of individual rows, and every change must be recorded reliably. Which workload type is this?`,
 opts:["An analytical workload, which scans large historical data sets to find trends","A streaming workload, which is defined by the absence of any stored data","A transactional workload, which records many small, reliable changes as they happen","A batch workload, which means all of the changes are collected and applied once a night"],a:2,
 ex:`Transactional (OLTP) workloads record business events as they happen, with many small reads and writes that must be reliable. Analytical workloads instead scan large volumes of historical data to find patterns.`},

/* src: https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/dp-900 */
{s:0,d:1,t:"single",ref:"analytical workload OLAP aggregate historical data",
 stem:`Analysts run queries that aggregate three years of sales across millions of rows to find seasonal trends. Few rows are changed, and queries read many of them at once. Which workload type is this?`,
 opts:["A transactional workload, which is optimized for frequent single-row updates and inserts by many users","An analytical workload, which reads and aggregates large volumes of historical data","A messaging workload, which moves small notifications between applications","A file-sharing workload, which serves documents to many users at once"],a:1,
 ex:`Analytical workloads read and aggregate large volumes of data to produce insights, typically with few writes. A transactional workload is the opposite shape: many small, frequent changes to individual rows.`},

/* src: https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/dp-900 */
{s:0,d:1,t:"single",ref:"JSON semi-structured data self-describing",
 stem:`An application exports records as JSON documents. Each record has fields, and some records have fields that others lack. How is this data classified?`,
 opts:["Unstructured data, because it has no organization of any kind to it","Semi-structured data, because it carries its own field names without a fixed table schema","Structured data, because every record has to contain the same columns","Binary data, because JSON is stored as compressed bytes and can't be read as text"],a:1,
 ex:`JSON is semi-structured: the fields are named in the data itself, but records need not share a rigid schema. Structured data follows a fixed schema such as table columns, and unstructured data has no model at all.`},

/* src: https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/dp-900 */
{s:0,d:1,t:"single",ref:"data file formats Parquet columnar CSV delimited text",
 stem:`A team will store analytical data in a data lake and needs a file format that stores values by column, compresses well and is efficient for queries that read only a few columns. Which format fits?`,
 opts:["CSV, a delimited text format that stores each row together as a line of plain text","Parquet, a columnar format that is efficient for analytical queries over selected columns","JPEG, an image format that cannot hold tabular values in any structured, queryable way at all","XML, a markup format that repeats every field name as a tag around each value"],a:1,
 ex:`Parquet is a columnar file format, so queries that read a few columns can skip the rest, and it compresses well. CSV and XML are row- or text-oriented formats, which makes column-selective reads less efficient.`},

/* src: https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/dp-900 */
{s:0,d:1,t:"single",ref:"database administrator responsibilities backup security performance",
 stem:`Which responsibility is most typical of a database administrator rather than a data analyst or a data engineer?`,
 opts:["Building dashboards that present sales trends to business managers","Designing the pipelines that move and transform data into a lake","Managing database security, backups, availability and performance of the servers","Writing machine learning models that predict customer churn each month for the marketing team"],a:2,
 ex:`Database administrators manage and secure databases, including backups, availability and performance. Data engineers build pipelines that ingest and transform data, and data analysts build reports and dashboards from it.`},

/* src: https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/dp-900 */
{s:0,d:1,t:"single",ref:"data engineer role pipelines ingest transform",
 stem:`A person builds and maintains the pipelines that ingest data from several sources, clean it and load it into an analytical store. Which role does this describe?`,
 opts:["Data analyst, who models data and builds reports from it","Database administrator, who tunes, patches and secures the operational database servers","Business owner, who defines which KPIs the company needs to see","Data engineer, who builds pipelines that make data available for analysis"],a:3,
 ex:`Data engineers provision data stores and build the pipelines that ingest, transform and load data for analysis. Data analysts consume that data to build models and visuals, and database administrators manage operational database servers.`},

/* src: https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/dp-900 */
{s:0,d:1,t:"single",ref:"data analyst role report visualization insights",
 stem:`A person explores a prepared data set, builds a data model and publishes reports and dashboards that business users read. Which role is this?`,
 opts:["Data analyst, who turns prepared data into models, reports and insights","Data engineer, who owns the ingestion pipelines and storage layout","Database administrator, who manages patching and backups for the servers","Security officer, who sets the access policies for every database"],a:0,
 ex:`Data analysts model data and create visualizations and reports so that others can make decisions. Data engineers prepare and move the data, and database administrators operate the databases themselves.`},

/* src: https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blobs-introduction */
{s:0,d:1,t:"multi",n:2,ref:"Blob Storage use cases streaming backup unstructured",
 stem:`Which two scenarios is Azure Blob Storage designed for? Each correct answer presents part of the solution.`,
 opts:["Serving images or documents directly to a browser","Running relational queries with joins across several normalized tables","Storing data for backup and restore, disaster recovery and archiving","Coordinating distributed locks between application instances in real time","Enforcing foreign key constraints between stored objects"],a:[0,2],
 ex:`The Blob Storage introduction lists serving images or documents to a browser, streaming video and audio, writing log files, backup and restore, disaster recovery, archiving, and storing data for analysis. Relational joins and foreign keys belong to relational databases.`},

/* src: https://learn.microsoft.com/en-us/azure/azure-sql/azure-sql-iaas-vs-paas-what-is-overview?view=azuresql */
{s:0,d:1,t:"single",ref:"Azure SQL Database PaaS fully managed patching backups",
 stem:`A company wants a relational database in Azure where Microsoft handles patching, backups and high availability, and the team never manages a virtual machine or the operating system. Which option fits?`,
 opts:["SQL Server installed on an Azure virtual machine, which hands the team full OS control","A database running on a self-built cluster of virtual machines the team operates","Azure SQL Database, a fully managed platform as a service relational database","A shared file server holding database files that the team patches itself"],a:2,
 ex:`Azure SQL Database is a database-as-a-service (PaaS) with built-in backups, patching and recovery. SQL Server on Azure VMs is IaaS, so the customer manages the VM, patching and backups.`},

/* src: https://learn.microsoft.com/en-us/azure/cosmos-db/overview */
{s:0,d:1,t:"single",ref:"Cosmos DB data models document key-value graph table vector",
 stem:`A team wants one managed Azure database that can serve operational data in several models, including document, key-value, graph and table, with single-digit millisecond response times. Which service is this?`,
 opts:["Azure SQL Database, which models all of its data as relational tables","Azure Cosmos DB, a fully managed NoSQL and vector database with multiple data models","Azure Blob Storage, which exposes the files in its containers as rows and columns of one table","Azure Data Factory, which stores operational data in its pipeline definitions"],a:1,
 ex:`The Cosmos DB overview says it can accommodate document, vector, key-value, graph and table models and offers single-digit millisecond response times. Azure SQL Database is relational, Blob Storage is object storage, and Data Factory orchestrates data movement.`},

/* src: https://learn.microsoft.com/en-us/azure/storage/common/storage-introduction */
{s:0,d:1,t:"single",ref:"Azure Queue storage messaging decouple components",
 stem:`A photo site uploads pictures, then must create thumbnails asynchronously so the customer doesn't wait. Which Azure Storage service decouples the upload from the thumbnail step?`,
 opts:["Azure Queue storage, a messaging store for asynchronous communication between components","Azure Files, a managed file share that notifies each reader of every new file and splits the upload from the thumbnail step","Azure Table storage, a key/attribute store that triggers code on every insert","Azure managed disks, block volumes attached to the VM that serves the upload"],a:0,
 ex:`Queue storage is for asynchronous messaging between application components. The storage introduction gives this exact thumbnail example: write a message to the queue after the upload, and let a function process it.`},

/* src: https://learn.microsoft.com/en-us/azure/databricks/introduction/ */
{s:0,d:1,t:"single",ref:"data lakehouse combines data warehouse data lake",
 stem:`Which description best fits a data lakehouse, as Azure Databricks uses the term?`,
 opts:["A relational database that only handles single-row transactional updates","A message broker that forwards events from many producers to many consumers","A file share that mounts blob containers as drives on virtual machines","An architecture that combines enterprise data warehouses and data lakes into one platform"],a:3,
 ex:`The Azure Databricks introduction says the data lakehouse combines enterprise data warehouses and data lakes so engineers, scientists and analysts can use a single source of truth. It is not a transactional database, a broker or a file share.`},

/* src: https://learn.microsoft.com/en-us/azure/stream-analytics/stream-analytics-introduction */
{s:0,d:1,t:"single",ref:"batch versus streaming data processing latency",
 stem:`Sensor readings arrive continuously and must be analyzed within seconds of arrival to raise alerts. Which processing style is needed?`,
 opts:["Batch processing, which collects data and processes it later in large groups","Streaming processing, which analyzes events continuously as they arrive","Manual processing, which requires an analyst to open each file by hand","Archive processing, which moves the readings to an offline tier first"],a:1,
 ex:`Streaming processes data in motion as it arrives, which is what low-latency alerting needs. Stream Analytics, for example, analyzes streaming data with very low latency. Batch processing waits and handles accumulated data in groups.`},

/* src: https://learn.microsoft.com/en-us/azure/storage/common/storage-introduction */
{s:0,d:1,t:"single",ref:"Azure Files SMB NFS file share lift and shift",
 stem:`An on-premises application reads and writes shared files over the SMB protocol. It must move to Azure with minimal changes. Which Azure Storage service fits best?`,
 opts:["Azure Blob Storage, which serves objects only over a REST interface","Azure Table storage, which exposes entities with partition and row keys","Azure Queue storage, which delivers messages of up to 64 KB each to consumers","Azure Files, which offers managed file shares over SMB, NFS and a REST API"],a:3,
 ex:`Azure Files provides fully managed file shares accessible over SMB, NFS and the Files REST API, and the docs list lift-and-shift of applications that use file shares as a use case. Blob Storage is object storage, even though it can be mounted over NFS 3.0 in some setups.`},

/* src: https://learn.microsoft.com/en-us/azure/storage/blobs/access-tiers-overview */
{s:0,d:1,t:"multi",n:2,ref:"blob access tiers hot cool cold archive characteristics",
 stem:`Which two statements about Azure Blob Storage access tiers are true? Each correct answer presents part of the solution.`,
 opts:["The hot tier has the highest storage cost but the lowest access cost","The archive tier is online, so blobs in it can be read in milliseconds","The archive tier is offline and a blob must be rehydrated to an online tier to be read","The cool tier has the lowest storage cost of all tiers, ahead of the archive tier","Tier changes are supported on page blobs and append blobs as well as on block blobs"],a:[0,2],
 ex:`The hot tier has the highest storage costs but the lowest access costs. Archive is an offline tier: a blob can't be read until it is rehydrated to hot, cool or cold. Archive has the lowest storage cost, and the tier can be set only on block blobs.`},

/* src: https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/dp-900 */
{s:0,d:1,t:"single",ref:"structured data tables rows columns schema relational",
 stem:`Customer records are stored in a table where every row has the same columns, such as CustomerID, Name and City, each with a defined data type. How is this data classified?`,
 opts:["Unstructured data, because rows are stored as raw bytes","Semi-structured data, because each row defines its own tags","Structured data, because it follows a fixed schema of rows and columns","Streaming data, because every row is a new event"],a:2,
 ex:`Structured data follows a fixed schema, typically tables with rows and columns of defined types, as in a relational database. Semi-structured data carries its own field names, and unstructured data has no model at all.`},
];
