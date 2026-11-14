// DP-900 skill area 3: Describe considerations for working with non-relational data on Azure.
export const items=[
/* src: https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blobs-introduction */
{s:0,d:3,t:"single",ref:"blob types block append page",
 stem:`A virtual machine writes log data continuously, always adding new records at the end of the file. Which blob type is optimized for this pattern?`,
 opts:["Block blob, which is meant for uploading whole objects in managed blocks","Page blob, which stores random access files such as VHD disk images","Table blob, which keeps each log line as an entity with a row key","Append blob, which is optimized for append operations such as logging"],a:3,
 ex:`Append blobs are made of blocks like block blobs but are optimized for append operations, which suits logging data from virtual machines. Page blobs store random access files like VHDs, and block blobs store text and binary data in general.`},

/* src: https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blobs-introduction */
{s:0,d:3,t:"single",ref:"blob storage resources storage account container blob hierarchy",
 stem:`In Azure Blob Storage, what is the correct order of resources from the top level down?`,
 opts:["Container, then storage account, then blob","Storage account, then container, then blob","Blob, then container, then storage account","Storage account, then blob, then container"],a:1,
 ex:`Blob Storage has three resource types: the storage account, a container in the account, and a blob in a container. A container organizes blobs much like a directory.`},

/* src: https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blobs-introduction */
{s:0,d:3,t:"single",ref:"Azure Data Lake Storage hierarchical namespace big data analytics",
 stem:`A team wants an enterprise data lake on Azure with a hierarchical file system plus low-cost tiered storage and strong consistency, for big data analytics. Which service provides this on top of Blob Storage?`,
 opts:["Azure Queue storage, which retains messages in a flat list","Azure Table storage, which scales a schemaless key/attribute store","Azure Elastic SAN, which presents iSCSI volumes to virtual machines","Azure Data Lake Storage, which adds a hierarchical file system to Blob Storage"],a:3,
 ex:`Blob Storage supports Azure Data Lake Storage, Microsoft's enterprise big data analytics solution, which offers a hierarchical file system along with the benefits of Blob Storage such as low-cost tiered storage, high availability and strong consistency.`},

/* src: https://learn.microsoft.com/en-us/azure/storage/blobs/access-tiers-overview */
{s:0,d:3,t:"single",ref:"blob archive tier rehydrate offline compliance data",
 stem:`Compliance data must be kept for years and is almost never read. Waiting hours to retrieve it is acceptable, and the lowest possible storage cost matters most. Which blob access tier fits?`,
 opts:["Hot, which has the lowest access cost but the highest storage cost","Cool, which has a 30-day minimum, millisecond access to data and the lowest storage cost of all","Archive, an offline tier with the lowest storage cost and retrieval in hours","Cold, which has a 90-day minimum and retrieval in milliseconds"],a:2,
 ex:`The archive tier is an offline tier for rarely accessed data with flexible latency on the order of hours. It has the lowest storage cost and a 180-day minimum retention. Cool and cold tiers stay online with millisecond latency but cost more to store.`},

/* src: https://learn.microsoft.com/en-us/azure/storage/common/storage-introduction */
{s:0,d:3,t:"single",ref:"Azure Files versus Blob Storage SMB share",
 stem:`Multiple virtual machines need to mount the same shared folder and read and write files with the SMB protocol. Which Azure Storage service should be used?`,
 opts:["Azure Files, which provides managed file shares accessed over SMB and NFS","Azure Blob Storage, which stores objects that are addressed by URL only","Azure Table storage, which stores flexible entities by partition key and row key","Azure Queue storage, which stores messages for later processing"],a:0,
 ex:`Azure Files sets up highly available network file shares accessed with SMB, NFS or the REST API, and multiple VMs can share the same files with read and write access. Blob objects are addressed by URL rather than mounted as an SMB share.`},

/* src: https://learn.microsoft.com/en-us/azure/storage/common/storage-introduction */
{s:0,d:3,t:"single",ref:"Table storage now part of Cosmos DB for Table premium",
 stem:`An application uses Azure Table storage and now needs throughput-optimized tables, global distribution and automatic secondary indexes. Which offering provides these?`,
 opts:["Azure Queue storage, which adds message ordering to each table","Azure Files, which exposes each table as a folder on an SMB share with its own indexes","Azure Cosmos DB for Table, a premium table offering with these capabilities","Azure SQL Database, which converts table entities into relational rows"],a:2,
 ex:`The storage documentation says Table storage is now part of Azure Cosmos DB and that Azure Cosmos DB for Table provides throughput-optimized tables, global distribution and automatic secondary indexes.`},

/* src: https://learn.microsoft.com/en-us/azure/cosmos-db/introduction */
{s:0,d:3,t:"single",ref:"Cosmos DB good fit workloads latency sensitive elastic global",
 stem:`Which workload is a good fit for Azure Cosmos DB?`,
 opts:["A latency-sensitive, highly elastic workload such as real-time personalization","A highly relational CRM application that depends on many joins and constraints","An analytical workload that runs interactive and batch analytics for data analysts","A file share that lets teams edit shared documents over the SMB protocol"],a:0,
 ex:`The overview lists flexible schema, latency-sensitive, highly elastic, high throughput and highly available workloads as good fits. It names analytical (OLAP) workloads, where Microsoft Fabric is suggested, and highly relational apps, where Azure SQL or MySQL is suggested, as poor fits.`},

/* src: https://learn.microsoft.com/en-us/azure/cosmos-db/introduction */
{s:0,d:3,t:"single",ref:"Cosmos DB MongoDB API wire protocol migrate existing app",
 stem:`A team has an existing application written for MongoDB and wants to keep using its drivers and tools while moving to a Cosmos DB API. Which API provides wire protocol compatibility with MongoDB?`,
 opts:["API for Apache Gremlin, which targets graph traversal queries","API for MongoDB, which offers full wire protocol compatibility with MongoDB","API for Table, which modernizes applications written for Table storage","API for Apache Cassandra, which is queried with the CQL language and keeps wide-column data"],a:1,
 ex:`The Cosmos DB documentation describes the API for MongoDB as the way to migrate existing MongoDB applications with full wire protocol compatibility and familiar tools. Gremlin is for graphs, Table for Azure Table Storage apps, and Cassandra uses CQL.`},

/* src: https://learn.microsoft.com/en-us/azure/cosmos-db/introduction */
{s:0,d:3,t:"single",ref:"Cosmos DB Gremlin API graph relationships",
 stem:`A social app stores people and the relationships between them, and must run graph traversal queries. Which Azure Cosmos DB API is intended for this?`,
 opts:["API for NoSQL, which uses native SQL queries over document data with automatic indexing","API for PostgreSQL, which is for distributed relational applications","API for Table, which stores entities with a partition key and a row key","API for Apache Gremlin, which builds graph apps with a graph traversal language"],a:3,
 ex:`The API for Apache Gremlin is for creating graph-based applications with the Gremlin traversal language for complex relationship queries. The API for NoSQL queries documents with SQL-style queries.`},

/* src: https://learn.microsoft.com/en-us/azure/cosmos-db/introduction */
{s:0,d:3,t:"single",ref:"Cosmos DB API for NoSQL document SQL queries automatic indexing",
 stem:`A team starts a new document-based application on Cosmos DB. It wants native SQL-style queries, automatic indexing and schema flexibility. Which API fits?`,
 opts:["API for Apache Cassandra, which is for wide-column workloads in CQL","API for NoSQL, which offers native SQL queries and automatic indexing","API for Apache Gremlin, which is meant only for graph traversal queries","API for Table, which is for key/attribute applications"],a:1,
 ex:`The API for NoSQL builds document-based applications with native SQL queries, automatic indexing and schema flexibility, and the documentation recommends it for most new applications. Cassandra, Gremlin and Table target other models.`},

/* src: https://learn.microsoft.com/en-us/azure/cosmos-db/introduction */
{s:0,d:3,t:"multi",n:2,ref:"Cosmos DB APIs list NoSQL MongoDB Cassandra Gremlin Table PostgreSQL",
 stem:`Which two are APIs offered by Azure Cosmos DB? Each correct answer presents part of the solution.`,
 opts:["API for Apache Cassandra","API for Azure Queue storage","API for Apache Gremlin","API for SQL Server Agent","API for Azure Data Lake"],a:[0,2],
 ex:`Cosmos DB offers NoSQL, MongoDB, PostgreSQL, Apache Cassandra, Apache Gremlin and Table APIs. Queue storage, SQL Server Agent and Data Lake are not Cosmos DB APIs.`},
];
