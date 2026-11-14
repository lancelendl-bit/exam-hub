// DP-900 skill area 4: Describe an analytics workload. Visualization-choice items cite the study guide (general guidance, not checked against a topic page).
export const items=[
/* src: https://learn.microsoft.com/en-us/azure/data-factory/introduction */
{s:0,d:4,t:"single",ref:"Azure Data Factory ETL ELT pipelines orchestration",
 stem:`A team needs a managed cloud service to build data-driven workflows, called pipelines, that ingest data from many stores, transform it and load it on a schedule. Which Azure service fits?`,
 opts:["Azure Data Factory, a managed cloud service for ETL, ELT and data integration","Azure Event Hubs, a streaming platform that ingests events from many producers for later readers","Azure Queue storage, a messaging store for asynchronous components","Power BI Desktop, a Windows app for building reports from data"],a:0,
 ex:`Azure Data Factory is a managed cloud service built for hybrid extract-transform-load (ETL), extract-load-transform (ELT) and data integration projects, with pipelines that orchestrate movement and transformation. Fabric Data Factory is its next-generation counterpart.`},

/* src: https://learn.microsoft.com/en-us/azure/data-factory/introduction */
{s:0,d:4,t:"single",ref:"Data Factory pipeline activity linked service dataset concepts",
 stem:`In Azure Data Factory, which component defines the connection information needed to reach an external data store, much like a connection string?`,
 opts:["A dataset, which represents the structure of data inside a store","A pipeline, which is a logical grouping of activities","A linked service, which defines the connection to a data source or compute","A trigger, which decides when a pipeline run starts"],a:2,
 ex:`Linked services are much like connection strings: they define the connection information Data Factory needs to reach external resources. A dataset then represents the structure of the data within that store.`},

/* src: https://learn.microsoft.com/en-us/azure/data-factory/introduction */
{s:0,d:4,t:"single",ref:"Data Factory mapping data flows Spark no-cluster transformation",
 stem:`A data engineer wants to build visual data transformation logic in Data Factory that runs at scale without managing Spark clusters. Which feature provides this?`,
 opts:["A copy activity, which moves data but doesn't transform its content","Mapping data flows, which run transformation graphs on Spark that Data Factory manages","A linked service, which stores the connection details of a compute resource","An integration runtime, which is a stored procedure for data cleanup"],a:1,
 ex:`Mapping data flows let engineers build transformation graphs that execute on a Spark cluster that spins up and down as needed, so they don't have to manage clusters. The copy activity is for data movement.`},

/* src: https://learn.microsoft.com/en-us/fabric/get-started/microsoft-fabric-overview */
{s:0,d:4,t:"single",ref:"Microsoft Fabric SaaS analytics platform OneLake",
 stem:`Which description best fits Microsoft Fabric?`,
 opts:["A single relational database engine that only runs T-SQL transactions","An analytics platform delivered as SaaS that spans ingestion, transformation, real-time analytics and reporting","A file share service that exposes SMB shares to virtual machines","A message broker that routes events between serverless functions"],a:1,
 ex:`Fabric is an analytics platform, delivered as software as a service, that supports end-to-end data workflows from ingestion and transformation to real-time processing, analytics and reporting, using OneLake as its shared storage.`},

/* src: https://learn.microsoft.com/en-us/fabric/get-started/microsoft-fabric-overview */
{s:0,d:4,t:"single",ref:"OneLake unified logical data lake ADLS Gen2 Fabric",
 stem:`In Microsoft Fabric, where do all workloads store and access their data by default, without data being copied between workloads?`,
 opts:["Separate Azure storage accounts that each team creates and manages for its own workload","The local disks of the Power BI Desktop computers","A queue in each workspace, which hands the data to the next workload","OneLake, a unified logical data lake built on Azure Data Lake Storage Gen2"],a:3,
 ex:`OneLake is the unified, tenant-wide logical data lake for Fabric, built on ADLS Gen2. All workloads operate over it, which enables shared access across workloads without moving or duplicating data.`},

/* src: https://learn.microsoft.com/en-us/fabric/get-started/microsoft-fabric-overview */
{s:0,d:4,t:"single",ref:"OneLake shortcut zero-copy external data S3",
 stem:`A team wants to analyze data that lives in Amazon S3 and Azure Data Lake Storage from Fabric without ETL or copying it into OneLake. Which feature provides zero-copy access?`,
 opts:["A pipeline copy activity that copies the files nightly into a lakehouse","A OneLake shortcut, which gives zero-copy access to external data sources","A paginated report, which stores a snapshot of the external files","A Real-Time hub stream that ingests each of the files as an event"],a:1,
 ex:`OneLake shortcuts provide zero-copy access to external data sources such as Azure Data Lake Storage, Amazon S3 and Google Cloud Storage without ETL or data migration. A copy activity would duplicate the data.`},

/* src: https://learn.microsoft.com/en-us/fabric/get-started/microsoft-fabric-overview */
{s:0,d:4,t:"single",ref:"Fabric Data Engineering Apache Spark notebooks",
 stem:`Which Microsoft Fabric workload provides Apache Spark, notebooks and tools for processing large datasets and scheduling data transformation jobs?`,
 opts:["Real-Time Intelligence, which analyzes data in motion as it arrives","Power BI, which connects to data and builds interactive reports","Data Engineering, which provides Apache Spark with notebooks for transformation","Data Warehouse, which exposes the SQL engine and no Spark runtime"],a:2,
 ex:`Fabric Data Engineering provides Apache Spark for processing large datasets, with notebooks and tools for writing and scheduling data transformation jobs. Real-Time Intelligence targets streaming data, and Data Warehouse targets SQL.`},

/* src: https://learn.microsoft.com/en-us/fabric/get-started/microsoft-fabric-overview */
{s:0,d:4,t:"single",ref:"Fabric Data Warehouse Delta Lake format separates compute storage",
 stem:`Which Fabric workload provides SQL performance and scale, separates compute from storage, and natively stores data in the open Delta Lake format?`,
 opts:["Fabric Data Science, which builds and operationalizes machine learning models","Fabric Data Warehouse, which scales compute and storage independently","Fabric Data Factory, which ingests data using more than 200 native connectors","Fabric IQ, which unifies business semantics across data and systems"],a:1,
 ex:`Fabric Data Warehouse provides industry-leading SQL performance and scale, separates compute from storage so each scales independently, and natively stores data in the open Delta Lake format.`},

/* src: https://learn.microsoft.com/en-us/fabric/get-started/microsoft-fabric-overview */
{s:0,d:4,t:"single",ref:"Fabric Real-Time Intelligence data in motion IoT clickstream",
 stem:`A company wants to analyze IoT sensor readings, application logs and website clickstreams as the data arrives, and to act on it. Which Fabric workload is built for this?`,
 opts:["Real-Time Intelligence, which analyzes data in motion as it arrives","Data Engineering, which centers on Apache Spark jobs that are run on a schedule","Power BI, which shows static reports on previously loaded data","Data Science, which trains models on historical data sets"],a:0,
 ex:`Real-Time Intelligence analyzes data as it arrives, such as IoT sensor readings, application logs or website clickstreams, and supports insight, visualization and action on data in motion.`},

/* src: https://learn.microsoft.com/en-us/azure/databricks/introduction/ */
{s:0,d:4,t:"single",ref:"Azure Databricks Apache Spark Delta Lake ETL data engineering",
 stem:`A team needs a unified analytics platform for ETL and data engineering that combines Apache Spark with Delta and lets them write logic in SQL, Python and Scala. Which Azure service fits?`,
 opts:["Azure Table storage, which holds the entities in a flat key store","Azure Databricks, a unified analytics platform that combines Spark with Delta","Azure Queue storage, which runs the ETL logic inside each message","Azure Files, which stores notebooks as files on SMB shares"],a:1,
 ex:`Azure Databricks is a unified, open analytics platform. For ETL and data engineering it combines Apache Spark with Delta, and ETL logic can be composed in SQL, Python and Scala.`},

/* src: https://learn.microsoft.com/en-us/azure/databricks/introduction/ */
{s:0,d:4,t:"multi",n:2,ref:"Azure Databricks use cases lakehouse machine learning",
 stem:`Which two use cases does Azure Databricks list for its platform? Each correct answer presents part of the solution.`,
 opts:["Building an enterprise data lakehouse","Serving SMB file shares to on-premises Windows clients","Machine learning, AI and data science","Hosting block storage volumes for virtual machines","Replacing Power BI Desktop as a report authoring app"],a:[0,2],
 ex:`The Azure Databricks introduction lists building an enterprise data lakehouse, ETL and data engineering, machine learning, AI and data science, data warehousing and BI, governance with Unity Catalog, and real-time and streaming analytics. SMB shares and block volumes belong to Azure Files and managed disks.`},

/* src: https://learn.microsoft.com/en-us/azure/stream-analytics/stream-analytics-introduction */
{s:0,d:4,t:"single",ref:"Azure Stream Analytics real-time SQL query language streaming",
 stem:`A team wants a fully managed service that analyzes streaming data from Event Hubs and IoT Hub using a SQL-based query language with temporal constraints. Which service fits?`,
 opts:["Azure Data Factory, which orchestrates scheduled batch pipelines","Azure Blob Storage, which keeps the stream as objects until the next read","Azure Table storage, which indexes events by partition key","Azure Stream Analytics, a managed stream processing engine with a SQL-like language"],a:3,
 ex:`Azure Stream Analytics is a fully managed stream processing engine. It uses a SQL query language augmented with temporal constraints and can read from Event Hubs and IoT Hub.`},

/* src: https://learn.microsoft.com/en-us/azure/event-hubs/event-hubs-about */
{s:0,d:4,t:"single",ref:"Azure Event Hubs ingest millions of events Kafka",
 stem:`Millions of IoT events per second must be ingested with low latency, and some existing producers use Apache Kafka clients. Which Azure service ingests these events without code changes?`,
 opts:["Azure Event Hubs, a managed streaming platform with native Kafka support","Azure SQL Database, which inserts each event as a transactional row and scales to any rate","Azure Files, which receives each event as a file on a share","Power BI service, which stores the events in a dashboard"],a:0,
 ex:`Event Hubs is a fully managed, real-time data streaming platform that ingests millions of events per second with low latency, and natively supports Apache Kafka, AMQP 1.0 and HTTPS, so Kafka workloads can run without code changes.`},

/* src: https://learn.microsoft.com/en-us/azure/event-hubs/event-hubs-about */
{s:0,d:4,t:"single",ref:"Event Hubs Capture Blob Storage Data Lake batch analytics",
 stem:`Streaming events in Event Hubs must also be kept in near real time in Azure Data Lake Storage for later batch analytics. Which Event Hubs feature does this?`,
 opts:["Consumer groups, which give each reader its own position in the stream","Partitions, which are ordered sequences of events used for throughput","Schema Registry, which stores the schemas for producers and consumers of the stream","Capture, which writes streaming data to Blob Storage or Data Lake Storage"],a:3,
 ex:`Capture writes streaming data in near real time to Azure Blob Storage or Azure Data Lake Storage for long-term retention or batch analytics. Consumer groups and partitions affect how events are read, not where they are stored.`},

/* src: https://learn.microsoft.com/en-us/power-bi/fundamentals/power-bi-overview */
{s:0,d:4,t:"single",ref:"Power BI Desktop versus Power BI service share collaborate",
 stem:`A report author wants full data modeling and report design tools on a Windows computer, and will then publish the report to share with a team. Which two Power BI components are used, in order?`,
 opts:["Power BI Desktop to create it, then the Power BI service to share it","Power BI Mobile to create it, then Power BI Desktop to share it","The Power BI service to model it, then Power BI Mobile to publish it","Power BI Report Server to create it, then the Power BI Desktop to share it"],a:0,
 ex:`Desktop is best for data modeling and report creation, and the service is ideal for sharing and collaboration. The Power BI Mobile app is for viewing reports on phones and tablets.`},

/* src: https://learn.microsoft.com/en-us/power-bi/fundamentals/power-bi-overview */
{s:0,d:4,t:"single",ref:"Power BI paginated reports printable invoices Report Builder",
 stem:`A finance team needs pixel-perfect, printable reports such as invoices. Which Power BI feature is intended for this?`,
 opts:["Interactive dashboards, which present tiles of live visuals","Power BI Mobile, which is the app for viewing reports on phones","Q&A, which answers natural language questions about a data set","Paginated reports, created with Power BI Report Builder"],a:3,
 ex:`Paginated reports are for structured, printable reports such as invoices and are created with Power BI Report Builder. Power BI Mobile is for viewing, not authoring pixel-perfect output.`},

/* src: https://learn.microsoft.com/en-us/power-bi/fundamentals/power-bi-overview */
{s:0,d:4,t:"multi",n:2,ref:"Power BI Desktop capabilities Power Query DAX relationships",
 stem:`Which two tasks can you do in Power BI Desktop? Each correct answer presents part of the solution.`,
 opts:["Transform data by using the Power Query Editor","Provision Event Hubs namespaces for streaming ingestion","Create data models with relationships, calculated columns and DAX","Restore archived blobs to the hot access tier","Schedule SQL Server Agent jobs on a managed instance"],a:[0,2],
 ex:`Power BI Desktop connects to more than 100 data sources, uses the Power Query Editor for transformation, and creates data models with DAX, calculated columns and relationships. The other tasks belong to other Azure services.`},

/* src: https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/dp-900 */
{s:0,d:4,t:"single",ref:"choose visualization line chart trend over time",
 stem:`An analyst wants a visual that shows how monthly revenue changed across the last 36 months and makes the trend easy to see. Which visualization fits best?`,
 opts:["A line chart, which plots values over a continuous time axis","A pie chart with one slice for each of the 36 months, so shares can be compared","A table that lists every month with no visual encoding","A card visual that shows one single number only"],a:0,
 ex:`A line chart shows change over time and makes trends easy to see. A pie chart with 36 slices is hard to read, and a card shows only one value. Visual-choice guidance is general practice rather than a single docs rule.`},
];
