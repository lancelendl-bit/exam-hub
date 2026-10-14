export const items=[
/* src: https://learn.microsoft.com/en-us/fabric/data-factory/data-source-management */
{s:0,d:2,t:"single",ref:"Manage connections and gateways create cloud connection Fabric",
 stem:`You have a Fabric workspace. Several dataflows and pipelines will read from the same Azure SQL database. You need to create one reusable cloud connection that stores the server, the database, and the authentication method. Where should you create the connection?`,
 opts:["In the Admin portal, under Tenant settings, by adding a data connection","In the workspace settings of each workspace that uses the database","In Manage connections and gateways, by selecting New and Cloud","In the OneLake catalog, on the Govern tab, by selecting a data source"],a:2,
 ex:`Manage connections and gateways is where you create a shareable cloud connection with a connection type, server, database, and an authentication method (Basic, OAuth2, or Service Principal) that supported Fabric items can reuse. Tenant settings and the Govern tab manage governance and administration, not data source credentials.`},

/* src: https://learn.microsoft.com/en-us/fabric/governance/onelake-catalog-explore */
{s:0,d:2,t:"single",ref:"OneLake catalog Explore endorsed items certified promoted",
 stem:`Contoso's analysts need to find lakehouses and semantic models that the organization has reviewed and approved. The items are spread across many workspaces, and the analysts don't know the workspace names. What should you recommend they use?`,
 opts:["The OneLake catalog Explore tab with the Endorsed items filter","The Real-Time hub, by searching each streaming source in turn","The Govern tab of the OneLake catalog","The lineage view of each workspace, opened one workspace at a time"],a:0,
 ex:`The Explore tab lists the items a user can access across workspaces, and the Endorsed items filter shows certified items first and then promoted items. The Govern tab provides governance insights and administrative settings, and a workspace lineage view only shows relationships inside one workspace.`},

/* src: https://learn.microsoft.com/en-us/fabric/real-time-hub/real-time-hub-overview */
{s:0,d:2,t:"single",ref:"Real-Time hub discover streaming data Fabric events eventstream",
 stem:`A data engineer needs one tenant-wide place to discover Azure Event Hubs sources, Fabric workspace item events, and KQL database tables, and to start connecting those streaming sources to an eventstream. What should the engineer use?`,
 opts:["The Monitoring hub","The Explore tab of the OneLake catalog","A Copy job","The Real-Time hub"],a:3,
 ex:`The Real-Time hub is the single tenant-wide place for streaming data. It lists streams and KQL tables, offers connectors for sources such as Azure Event Hubs, and exposes Fabric and Azure events that you can route to eventstreams, KQL databases, and Activator. The OneLake catalog is for discovering and governing data items, not event sources.`},

/* src: https://learn.microsoft.com/en-us/fabric/fundamentals/decision-guide-pipeline-dataflow-spark */
{s:0,d:2,t:"single",ref:"decision guide copy activity Copy job dataflow Eventstream Spark",
 stem:`You have a lakehouse. A data engineer who is experienced with Power Query must clean sales data, apply business rules by using many built-in transformations, and write the result to two destinations. The data volume is low to medium, and the solution must use no code or low code. What should you use?`,
 opts:["A Copy job","Dataflow Gen2","An eventstream","A Spark notebook"],a:1,
 ex:`Dataflow Gen2 gives a Power Query, low-code experience with 300+ transformation functions and can write to multiple destinations. A Copy job is limited to lightweight transformations such as type conversion and column mapping, and a Spark notebook requires code.`},

/* src: https://learn.microsoft.com/en-us/fabric/onelake/onelake-shortcuts */
{s:0,d:2,t:"single",ref:"OneLake shortcut Amazon S3 Delta Tables folder SQL analytics endpoint",
 stem:`A partner stores Delta tables in an Amazon S3 bucket. Data residency rules forbid copying the data into OneLake. Analysts must query the tables from Spark and from the SQL analytics endpoint of a lakehouse. What should you create?`,
 opts:["A pipeline with a Copy activity that runs every hour","A mirrored database for the S3 bucket","An Amazon S3 shortcut in the Tables section of the lakehouse","A Dataflow Gen2 query that uses the S3 connector"],a:2,
 ex:`A shortcut references the data in place, and a shortcut in the Tables section that targets Delta data is recognized as a table that Spark and the SQL analytics endpoint can read. Mirroring is for databases and catalogs rather than storage buckets, and the other options copy the data into OneLake.`},

/* src: https://learn.microsoft.com/en-us/fabric/onelake/unify-data */
{s:0,d:2,t:"single",ref:"Fabric mirroring Snowflake proprietary format shortcut",
 stem:`Fabrikam keeps curated tables in Snowflake native tables. The finance team wants near real-time, read-only analytics in Fabric. Engineers don't want to build schedules or pipelines, and the solution should keep cost low. What should you use?`,
 opts:["Mirroring for Snowflake","A OneLake shortcut to the Snowflake database","A pipeline Copy activity that runs every five minutes","A Copy job that uses incremental copy"],a:0,
 ex:`Mirroring continuously replicates the data into OneLake as read-only Delta tables, with no schedule to manage, and the replication compute is free while mirroring storage is free up to a capacity-based limit. Shortcuts work only with open formats, so they can't reference proprietary Snowflake storage, and the other options are scheduled data movement that consumes capacity.`},

/* src: https://learn.microsoft.com/en-us/fabric/fundamentals/decision-guide-data-store */
{s:0,d:2,t:"single",ref:"Fabric decision guide choose data store eventhouse",
 stem:`Wingtip Energy ingests billions of JSON smart-meter events. Analysts need interactive time series and geospatial analysis over the events, and Power BI reports must use a fast DirectQuery mode. Which data store should you choose?`,
 opts:["A lakehouse that stores the events as Delta tables","A warehouse that stores the events in fact tables","A SQL database in Fabric that stores the events in tables","An eventhouse that stores the events in a KQL database"],a:3,
 ex:`Eventhouse is the Fabric store for streaming event data and high-granularity activity data, with time series analysis, geospatial functions, and fast DirectQuery mode in Power BI. A warehouse targets enterprise SQL-based BI with full transaction support, and SQL database in Fabric targets operational OLTP workloads.`},

/* src: https://learn.microsoft.com/en-us/fabric/fundamentals/decision-guide-data-store */
{s:0,d:2,t:"single",ref:"SQL database in Fabric OLTP decision guide data store",
 stem:`You are developing a .NET order-entry app that needs high-concurrency transactions, strongly enforced foreign keys, and automatic index tuning. Reporting teams must query the same data from Spark and Power BI without affecting the app. Which Fabric data store should host the app data?`,
 opts:["A warehouse, because it supports T-SQL transactions","A SQL database in Fabric","A lakehouse, because it exposes a SQL analytics endpoint","An eventhouse, because it scales to high ingestion rates"],a:1,
 ex:`SQL database in Fabric uses the Azure SQL Database engine, enforces constraints, tunes indexes automatically, and provides a SQL analytics endpoint so analytical queries don't hit the operational database. In a warehouse, foreign keys can only be created as NOT ENFORCED, so it can't meet the integrity requirement.`},

/* src: https://learn.microsoft.com/en-us/fabric/data-warehouse/identity */
{s:0,d:2,t:"single",ref:"Fabric warehouse surrogate key IDENTITY bigint primary key not enforced",
 stem:`You are designing a DimProduct dimension table in a Fabric warehouse for a star schema. The source system identifies products by a ProductCode value. Which design should you use for the key?`,
 opts:["Make ProductCode the primary key and let the warehouse enforce its uniqueness","Define an enforced primary key inline in the CREATE TABLE statement","Add a BIGINT IDENTITY surrogate key column and keep ProductCode as a natural key","Add an INT IDENTITY(1000, 1) column as the surrogate key and keep ProductCode as an attribute"],a:2,
 ex:`A single-column surrogate key is the recommended dimension key, and IDENTITY columns in a warehouse must be bigint with no custom seed or increment. Primary keys can only be added with ALTER TABLE as NONCLUSTERED and NOT ENFORCED, so the warehouse never enforces uniqueness and the load process must protect it.`},

/* src: https://learn.microsoft.com/en-us/fabric/data-warehouse/dimensional-modeling-dimension-tables */
{s:0,d:2,t:"single",ref:"snowflake dimension denormalize view semantic model hierarchy Fabric warehouse",
 stem:`A Fabric warehouse stores Product, Subcategory, and Category as three related tables. Report authors need a Category > Subcategory > Product hierarchy in a semantic model. The ETL process must keep loading the three tables separately. What should you do?`,
 opts:["Create a view that joins the three tables and base the semantic model on the view","Create the hierarchy in the semantic model by using columns from all three tables","Merge the three tables into one table in the ETL process","Add a bridge table between the Product and Category tables"],a:0,
 ex:`A semantic model hierarchy can use columns from only one table, so a snowflake dimension should deliver a denormalized result through a view that joins its tables. Merging the tables in the ETL would break the requirement to keep loading them separately, and a bridge table is for many-to-many (multivalued) relationships.`},

/* src: https://learn.microsoft.com/en-us/fabric/data-warehouse/data-types */
{s:0,d:2,t:"single",ref:"Fabric warehouse supported data types datetime2 decimal varchar",
 stem:`You are creating a table in a Fabric warehouse for converted source data. The columns store an event timestamp with microsecond precision, a monetary amount, and a customer name. Which set of column data types can you use?`,
 opts:["datetime, money, nvarchar(100)","datetimeoffset, smallmoney, tinyint","datetime2(9), decimal(19,4), nvarchar(100)","datetime2(6), decimal(19,4), varchar(100)"],a:3,
 ex:`The warehouse stores datetime2 with up to six fractional digits, decimal in place of money, and varchar in place of nvarchar. datetime, money, smallmoney, datetimeoffset, tinyint, and nvarchar aren't supported for persisted tables, and datetime2(9) exceeds the six-digit limit.`},

/* src: https://learn.microsoft.com/en-us/fabric/data-warehouse/visual-query-editor */
{s:0,d:2,t:"single",ref:"visual query editor Save as view Fabric warehouse merge queries",
 stem:`An analyst uses the visual query editor in a Fabric warehouse to merge DimCity and FactSale and then group the result. Power BI authors must reuse the result, and it must always reflect current warehouse data without storing a second copy. What should the analyst select?`,
 opts:["Save as table","Save as view","Download Excel file","Visualize results"],a:1,
 ex:`Save as view creates a warehouse view from the query, so every read returns current data and nothing is duplicated. Save as table runs CREATE TABLE AS SELECT and stores a separate copy that goes stale until it is reloaded.`},

/* src: https://learn.microsoft.com/en-us/power-query/merge-queries-left-anti */
{s:0,d:2,t:"single",ref:"Power Query merge queries left anti join",
 stem:`In Dataflow Gen2, a Sales query has a CustomerID column and a Customers query has an ID column. You need one merge step that keeps only the Sales rows that have no matching customer. Which join kind should you select?`,
 opts:["Left outer","Inner","Left anti","Full outer"],a:2,
 ex:`A left anti join returns only the rows from the left table that have no match in the right table. A left outer join also returns the matching rows, and an inner join returns only the matching rows.`},

/* src: https://learn.microsoft.com/en-us/kusto/query/arg-max-aggregation-function?view=microsoft-fabric */
{s:0,d:2,t:"single",ref:"KQL summarize arg_max latest row per group eventhouse",
 stem:`An eventhouse table named Telemetry has the columns DeviceId, Timestamp, and Temperature. You need a KQL query that returns the most recent row, with all columns, for each device. Which query should you run?`,
 opts:["Telemetry | summarize arg_max(Timestamp, *) by DeviceId","Telemetry | summarize max(Timestamp), max(Temperature) by DeviceId","Telemetry | top 1 by Timestamp desc","Telemetry | distinct DeviceId, Timestamp, Temperature"],a:0,
 ex:`arg_max(Timestamp, *) inside summarize returns the whole row that has the maximum Timestamp in each DeviceId group. max() returns only the timestamp value, and top 1 returns a single row for the entire table.`},

/* src: https://learn.microsoft.com/en-us/dax/dax-queries */
{s:0,d:2,t:"single",ref:"DAX query EVALUATE SUMMARIZECOLUMNS name expression pairs",
 stem:`In DAX query view of a semantic model that has a [Total Sales] measure, you need a query that returns one row for each combination of year and product category, plus a column named Sales. Which query should you run?`,
 opts:[`SUMMARIZECOLUMNS('Date'[Year], Product[Category], "Sales", [Total Sales])`,`EVALUATE SUMMARIZECOLUMNS('Date'[Year], Product[Category], "Sales", [Total Sales])`,`EVALUATE SUMMARIZECOLUMNS('Date'[Year], Product[Category], [Total Sales])`,`EVALUATE GROUPBY('Date'[Year], Product[Category], "Sales", [Total Sales])`],a:1,
 ex:`A DAX query needs EVALUATE in front of the table expression, and SUMMARIZECOLUMNS takes group-by columns followed by name and expression pairs. Without EVALUATE the text isn't a query, and the unnamed [Total Sales] breaks the name and expression pair syntax. GROUPBY expects a table as its first argument.`},

/* src: https://learn.microsoft.com/en-us/fabric/real-time-intelligence/event-house-onelake-availability */
{s:0,d:2,t:"hot",ref:"Eventhouse OneLake availability Delta write latency",
 stem:`You need to expose the tables of a KQL database in an eventhouse as Delta tables in OneLake. How should you complete the procedure? Select the appropriate option in each list.`,
 tpl:`In the OneLake section of the details pane, set Availability to [[0]].
By default, data is written to OneLake with a delay of up to [[1]], or until the files reach a sufficient size.`,
 sel:[["Shortcut","Mirrored","Enabled"],["24 hours","3 hours","30 seconds"]],a:[2,1],
 ex:`Setting Availability to Enabled creates a logical copy of the KQL data as Delta tables that other engines can read. The adaptive batching mechanism waits up to 3 hours, or until the files are large enough, and TargetLatencyInMinutes can lower the delay to a minimum of 5 minutes.`},

/* src: https://learn.microsoft.com/en-us/sql/t-sql/queries/select-qualify-clause-transact-sql?view=fabric */
{s:0,d:2,t:"hot",ref:"Fabric warehouse CTAS QUALIFY ROW_NUMBER TRY_CAST datetime2",
 stem:`You have a Fabric warehouse. You need to create a table that holds the latest row for each order from a staging table, and the text date must be converted to a type that warehouse tables support. How should you complete the T-SQL? Select the appropriate option in each list.`,
 tpl:`CREATE TABLE dbo.Orders
AS
SELECT OrderID,
       TRY_CAST(OrderDateText AS [[0]]) AS OrderDate,
       Amount
FROM stg.Orders
[[1]] ROW_NUMBER() OVER (PARTITION BY OrderID ORDER BY LoadTs DESC) = 1;`,
 sel:[["datetime","datetime2(6)","datetimeoffset"],["WHERE","HAVING","QUALIFY"]],a:[1,2],
 ex:`datetime2(6) is a supported persisted type, whereas datetime and datetimeoffset can't be used in warehouse tables, and TRY_CAST returns NULL instead of failing on bad text. QUALIFY filters on window function results, while window functions aren't allowed in WHERE and HAVING filters grouped aggregates.`},

/* src: https://learn.microsoft.com/en-us/fabric/data-factory/what-is-copy-job */
{s:0,d:2,t:"build",ref:"Copy job incremental copy watermark ROWVERSION on-premises data gateway",
 stem:`An on-premises SQL Server database doesn't have change data capture enabled, but every table has a ROWVERSION column. You need to load the tables into a lakehouse and, after the first full load, copy only new or changed rows on a schedule without building a pipeline. Which four actions should you perform in sequence? Move the appropriate actions to the answer area and arrange them in the correct order.`,
 pool:["Create a Copy job and select the connection and the source tables","Create an eventstream that uses a SQL Server CDC source","Install an on-premises data gateway and sign in","In the Copy job, set the copy mode to Incremental copy and choose the ROWVERSION column as the watermark","Create a OneLake shortcut that points to the SQL Server database","In Manage connections and gateways, create an On-premises connection that uses the gateway"],a:[2,5,0,3],
 ex:`The gateway and an On-premises connection let Fabric reach the database, and a Copy job then handles bulk and incremental copy without a pipeline. Without CDC on the source, watermark-based incremental copy on a ROWVERSION column tracks inserts and updates, and the first run copies everything. A shortcut can't reference a SQL Server database, and an eventstream CDC source needs CDC enabled.`},

/* src: https://learn.microsoft.com/en-us/power-query/fill-values-column */
{s:0,d:2,t:"build",ref:"Power Query fill up replace values null empty cells",
 stem:`In a Dataflow Gen2 query, a spreadsheet export shows the salesperson name only on the last row of each block of item rows, and the other Comments cells contain empty strings. Rows that hold only a name have a null Units value. You need every item row to carry the salesperson and then drop the name-only rows. Which three actions should you perform in sequence? Move the appropriate actions to the answer area and arrange them in the correct order.`,
 pool:["Use Fill > Down on the Comments column","Replace the empty cells in the Comments column with null by using Replace values","Filter the Units column to remove rows where Units is null","Use Remove duplicates on the Comments column","Use Fill > Up on the Comments column","Change the type of the Comments column to Text"],a:[1,4,2],
 ex:`Fill up replaces null values with the next nonempty value below, but it ignores empty strings, so the blanks must first be converted to null with Replace values. After the fill, the name-only rows are no longer needed and can be removed by filtering out null Units. Fill down would copy names in the wrong direction.`},

/* src: https://learn.microsoft.com/en-us/fabric/enterprise/powerbi/onelake-integration-overview */
{s:0,d:2,t:"multi",n:2,ref:"OneLake integration semantic models import tables Delta refresh",
 stem:`You plan to turn on OneLake integration for an import semantic model so that data engineers can query its tables as Delta tables. Which two statements are true? Each correct answer presents a complete fact.`,
 opts:["Measures and calculation group tables are exported as Delta tables","The model's import data is written to Delta tables only after a refresh runs","The feature is supported on Power BI Pro and Premium Per User workspaces","DirectQuery tables are exported as Delta tables on refresh","The feature requires a Power BI Premium P SKU or a Fabric F SKU"],a:[1,4],
 ex:`Exported Delta tables appear and update only when the model is refreshed, and OneLake integration is supported on Premium P and Fabric F SKUs only. Measures, calculation group tables, DirectQuery tables, and hybrid tables can't be exported, and Pro and Premium Per User aren't supported.`},

/* src: https://learn.microsoft.com/en-us/dax/dax-queries */
{s:0,d:2,t:"multi",n:2,ref:"DAX query EVALUATE DEFINE MEASURE ORDER BY SUMMARIZECOLUMNS",
 stem:`You are writing DAX queries against a semantic model by using DAX query view. Which two statements are true? Each correct answer presents a complete fact.`,
 opts:["SUMMARIZECOLUMNS returns its rows sorted by the first group-by column","EVALUATE is the only required keyword in a DAX query","A DAX query can contain only one EVALUATE statement","A measure defined with DEFINE MEASURE overrides a model measure of the same name for that query only","The Sort by column property of a model column is applied to DAX query results"],a:[1,3],
 ex:`EVALUATE is required and everything else is optional, and DEFINE MEASURE creates a query-scoped measure that takes precedence over a model measure with the same name without changing the model. A query can contain several EVALUATE statements, SUMMARIZECOLUMNS guarantees no sort order, and sort-by-column settings must be repeated in ORDER BY.`},

/* src: https://learn.microsoft.com/en-us/fabric/data-factory/dataflow-gen2-incremental-refresh */
{s:0,d:2,t:"multi",n:2,ref:"Dataflow Gen2 incremental refresh requirements query folding DateTime column",
 stem:`You plan to configure incremental refresh on a query in Dataflow Gen2 that loads a lakehouse table. Which two statements are true? Each correct answer presents a complete fact.`,
 opts:["The query must return a Date, DateTime, or DateTimeZone column to filter by","Incremental refresh works with the default destination configuration","A changed bucket is appended to the destination without removing existing rows","The query should fully fold to the source","A bucket is refreshed only when the minimum value of the change column decreases"],a:[0,3],
 ex:`Incremental refresh buckets data on a date or datetime column, and the query should fully fold so the filter is pushed to the source. The destination must be defined explicitly rather than by default configuration, a changed bucket replaces the old bucket data by deleting and reinserting, and a bucket is processed when the maximum value of the change column changes.`},

/* src: https://learn.microsoft.com/en-us/fabric/data-warehouse/ingest-data */
{s:0,d:2,t:"match",ref:"KQL DAX T-SQL visual query editor choose query tool",
 stem:`You need to choose the right query option for four tasks. Which option should you use for each task? To answer, select the appropriate option for each goal.`,
 targets:["Count events per five-minute interval in an eventhouse","Persist a no-code merge and group-by of warehouse tables as a view","Return a summary table from a semantic model by using EVALUATE","Create a warehouse table from a join of a warehouse table and a lakehouse table"],
 pool:["DAX query","KQL","T-SQL CREATE TABLE AS SELECT with three-part names","Visual query editor","Spark SQL in a notebook","Power Query in a Dataflow Gen2"],a:[1,3,0,2],
 ex:`KQL summarize with bin() is the way to aggregate eventhouse data, and the visual query editor offers a no-code merge and group-by with Save as view. A DAX query starts with EVALUATE, and T-SQL CTAS with three-part names can read tables from other warehouses and lakehouses in the same workspace. Spark SQL runs in notebooks over lakehouse data, and a dataflow transformation isn't saved as a warehouse view.`},

/* src: https://learn.microsoft.com/en-us/fabric/data-warehouse/data-warehousing */
{s:0,d:2,t:"yesno",ref:"SQL analytics endpoint lakehouse stored procedure read-only scalar UDF preview",
 stem:`You have a lakehouse named LH1. For each of the following statements, select Yes if the statement is true. Otherwise, select No.`,
 rows:["You can create a stored procedure in the SQL analytics endpoint of LH1 that encapsulates a query over a Delta table.","You can run INSERT statements in the SQL analytics endpoint of LH1 to add rows to a Delta table.","Scalar user-defined functions in Fabric Data Warehouse are a generally available feature."],a:[1,0,0],
 ex:`The SQL analytics endpoint is read-only over Delta tables, but you can create views, inline table-valued functions, and stored procedures in it. Data changes require Spark or a warehouse. Scalar user-defined functions are still a preview feature in Fabric Data Warehouse.`},

/* src: https://learn.microsoft.com/en-us/fabric/onelake/onelake-shortcuts */
{s:0,d:2,t:"yesno",ref:"OneLake shortcuts Tables folder schema sync deletion lakehouse",
 stem:`You plan to use OneLake shortcuts in a lakehouse. For each of the following statements, select Yes if the statement is true. Otherwise, select No.`,
 rows:["You can create a shortcut in a subdirectory of the Tables folder of a lakehouse.","Schema changes at the source of a shortcut in the Tables section are reflected without manual updates.","Deleting a shortcut to an ADLS Gen2 folder from a lakehouse also deletes the folder in the storage account."],a:[0,1,0],
 ex:`Shortcuts in the Tables folder can be created only at the top level, and their table schemas synchronize automatically with the source. Deleting a shortcut removes only the shortcut object, so the target data stays in place.`},

/* src: https://learn.microsoft.com/en-us/fabric/real-time-intelligence/event-house-onelake-availability */
{s:1,d:2,t:"series",grp:"B",ref:"Eventhouse OneLake availability shortcut lakehouse",
 scen:`Fabrikam Logistics stores vehicle telemetry in a KQL database in an eventhouse. Data engineers must read the telemetry as Delta tables from a lakehouse by using Spark and T-SQL. Engineers must not maintain any schedule, pipeline, or copy job for the data. You need to make the telemetry available.`,
 sol:`Solution: You turn on OneLake availability for the KQL database, and then you create a OneLake shortcut in the lakehouse that points to the telemetry tables.`,a:0,
 ex:`OneLake availability exposes the KQL tables as Delta tables in OneLake, and a lakehouse can create a shortcut to them, so no schedule or copy job is needed. Meets the goal.`},

/* src: https://learn.microsoft.com/en-us/fabric/data-factory/what-is-copy-job */
{s:1,d:2,t:"series",grp:"B",ref:"Copy job schedule copy eventhouse to lakehouse",
 scen:`Fabrikam Logistics stores vehicle telemetry in a KQL database in an eventhouse. Data engineers must read the telemetry as Delta tables from a lakehouse by using Spark and T-SQL. Engineers must not maintain any schedule, pipeline, or copy job for the data. You need to make the telemetry available.`,
 sol:`Solution: You create a Copy job that runs every five minutes and copies the telemetry tables from the eventhouse into lakehouse tables.`,a:1,
 ex:`A Copy job is scheduled data movement that duplicates the data into the lakehouse, which breaks the requirement that engineers maintain no schedule or copy job. Doesn't meet the goal.`},

/* src: https://learn.microsoft.com/en-us/fabric/fundamentals/decision-guide-pipeline-dataflow-spark */
{s:1,d:2,t:"series",grp:"B",ref:"Dataflow Gen2 refresh schedule copy eventhouse data lakehouse",
 scen:`Fabrikam Logistics stores vehicle telemetry in a KQL database in an eventhouse. Data engineers must read the telemetry as Delta tables from a lakehouse by using Spark and T-SQL. Engineers must not maintain any schedule, pipeline, or copy job for the data. You need to make the telemetry available.`,
 sol:`Solution: You create a Dataflow Gen2 that reads the telemetry tables and writes them to the lakehouse, and you schedule it to refresh every hour.`,a:1,
 ex:`A scheduled dataflow still copies the data on a refresh cadence that engineers must maintain, and the lakehouse data is stale between refreshes. Doesn't meet the goal.`}
];
