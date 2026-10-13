// Question bank for exam3Content. Returns {CASES, Q, SECTIONS}.
export default function exam3Content(){
/* ---------- Content ---------- */
const DOMAINS={1:"Implement and manage an analytics solution",2:"Ingest and transform data",3:"Monitor and optimize an analytics solution"};

const CASES=[
{ title:"Case study: Contoso, Ltd.",
  tabs:[
   {name:"Overview",html:`<p>Contoso, Ltd. is an online retailer that is modernizing its analytics platform on Fabric, starting with marketing analytics.</p><h4>IT structure</h4><ul><li>A <b>data engineering</b> team ingests, transforms, and loads data. They prefer Python or SQL.</li><li>A <b>data analyst</b> team queries data and builds semantic models and reports. They write Power Query and T-SQL.</li></ul><h4>User problems</h4><ul><li>The VP of marketing needs analysis of email content effectiveness. Compiling it manually takes a week; the target is under one day.</li><li>Exports from the marketing app sometimes fail because of transient connectivity errors.</li></ul>`},
   {name:"Existing environment",html:`<h4>Fabric</h4><ul><li>An F64 capacity named <code>Cap1</code>. All users may create items.</li><li>Two workspaces, <code>WorkspaceA</code> and <code>WorkspaceB</code>, that currently use <b>Pro license mode</b>.</li></ul>
<h4>Source systems</h4><ul><li><b>POS1</b>: SQL Server on an Azure VM in the same Entra tenant. The VM is on a private virtual network with public access blocked. Contains all website sales transactions.</li><li><b>MAR1</b>: a SaaS marketing app with seven entities (email open and interaction rates, website interactions). Each entity is exported through its own REST API endpoint.</li><li><b>Historical MAR1 data</b>: 12 Parquet files (300–900 MB each) about email interactions in an <b>Amazon S3</b> bucket.</li></ul>
<h4>Product data (in POS1)</h4><ul><li>Tables <code>Products</code>, <code>ProductSubcategories</code>, <code>ProductCategories</code>. Products relate to subcategories; subcategories relate to categories.</li></ul>
<h4>Azure</h4><ul><li>Mail-enabled security groups <code>DataAnalysts</code> and <code>DataEngineers</code>.</li><li>An Azure DevOps organization with a new project for Fabric repositories.</li></ul>`},
   {name:"Requirements",html:`<h4>Planned changes</h4><ul><li><code>Lakehouse1</code>: raw and cleansed data (bronze and silver).</li><li><code>Lakehouse2</code>: a dimensional model (gold) for analytical queries.</li><li>Azure Repos for source control.</li></ul>
<h4>Technical</h4><ul><li>Medallion architecture: bronze, silver, gold. Extensive cleansing of MAR1 data in silver: deduplication, missing values, capitalization.</li><li>Each layer must be fully populated before the next. If any step fails, email the data engineers.</li><li>Data imports must run simultaneously when possible.</li><li>S3 email data: minimize cross-cloud egress costs; never save a copy of the raw data in the lakehouses.</li><li>Ingestion items: source-controlled with the other workspace items; land in the bronze layer of Lakehouse1 in Delta format; no changes other than file format before bronze; minimize development effort and use a built-in connection; retry on connectivity errors.</li><li>Lakehouses, pipelines, and notebooks live in WorkspaceA. Semantic models, reports, and dataflows live in WorkspaceB.</li><li>Once a week, remove old files that are no longer referenced by a Delta table log.</li></ul>
<h4>Data transformation</h4><ul><li>ProductID values are unique. The gold product dimension must include only active products (<code>IsActive = 1</code>).</li><li>Categories and subcategories with no products are not analytically relevant and must be omitted from the product dimension.</li></ul>
<h4>Security</h4><ul><li>Data engineers: read and write to all lakehouses, including files; must be able to commit to source control in WorkspaceA.</li><li>Data analysts: read access only to the Delta tables in the gold layer; no access to bronze or silver data.</li></ul>`}
  ]},
{ title:"Case study: Litware, Inc.",
  tabs:[
   {name:"Overview",html:`<p>Litware, Inc. is a publisher with an online bookstore, retail bookstores worldwide, and an online advertising business for the authors it represents.</p><h4>Fabric environment</h4><ul><li>One workspace, <code>Workspace1</code>, with <b>high concurrency enabled</b>.</li><li>The data engineering team uses Python.</li></ul><h4>Security groups</h4><ul><li>Sales</li><li>Fabric Admins</li><li>Streaming Admins</li></ul>`},
   {name:"Existing environment",html:`<h4>Data processing</h4><ul><li>Retail stores send sales data at the end of each business day; the online store constantly sends logs and sales data to a central ERP system.</li><li>Medallion architecture: ERP sales data lands as Parquet files in the Files folder of a lakehouse. Notebooks transform the files into Delta tables for bronze and silver. The gold layer is a <b>warehouse with V-Order disabled</b>.</li><li>Book cover images in Azure Blob Storage are loaded into the Files folder.</li></ul>
<h4>Sales data</h4><ul><li>Month-end sales are processed on the first calendar day of each month. Data older than one month never changes.</li><li>The source refreshes every six hours starting at midnight.</li><li>A <b>Dataflow Gen1</b> dataflow captures new and historical data: Sales Date, Author, Price, Units, SKU.</li><li>Table <code>AuthorSales</code> holds per-author sales and has a column <code>AuthorEmail</code>. Authors sign in to a guest Fabric tenant with their email address.</li></ul>
<h4>Performance issues</h4><ul><li>Ad-hoc warehouse reports sometimes run for two hours and fail with: <i>"The SQL query failed while running."</i> The team wants to find queries that cause more than one failure.</li><li>New book releases cause sales spikes that slow ingestion.</li><li>Last month, sales data was not up to date when the sales team arrived in the morning.</li></ul>`},
   {name:"Requirements",html:`<h4>Planned changes</h4><ul><li>Book reviews will arrive in Amazon S3 buckets.</li><li>SEO data for authors will be streamed from a REST API.</li></ul>
<h4>Version control</h4><ul><li>GitHub integration, following the principle of least privilege.</li></ul>
<h4>Governance</h4><ul><li>Use only Fabric services and items. Additional Azure resources must not be provisioned.</li></ul>
<h4>Data</h4><ul><li>Process the SEO data in near real time.</li><li>Make the book reviews available in the lakehouse without copying the data.</li><li>When a new book cover image arrives in the Files folder, process it as soon as possible.</li></ul>`}
  ]}
];

const Q=[
/* ===== Section 1: Contoso case ===== */
{s:0,c:0,d:1,t:"single",ref:"share lakehouse Read all SQL endpoint data analysts",
 stem:`You need to ensure that the data analysts can access the gold layer in Lakehouse2. What should you do?`,
 opts:["Add the DataAnalysts group to the Viewer role for WorkspaceA","Share Lakehouse2 with the DataAnalysts group and grant Build reports on the default semantic model","Share Lakehouse2 with the DataAnalysts group and grant Read all SQL endpoint data","Share Lakehouse2 with the DataAnalysts group and grant Read all Apache Spark"],a:2,
 ex:`Read all SQL endpoint data (ReadData) gives T-SQL access to the Delta tables only, which is what analysts need and nothing more. The Viewer role would expose Lakehouse1 (bronze and silver) too. Build is for report authoring, and Read all Apache Spark (ReadAll) exposes the underlying files.`},
{s:0,c:0,d:2,t:"hot",ref:"S3 shortcut cache workspace settings OneLake retention egress",
 stem:`You need to make the historical MAR1 email data available while meeting the requirements for the S3 bucket. How should you complete the configuration? Select the appropriate option in each list.`,
 tpl:`Lakehouse1 > Files > New shortcut > [[0]]
Workspace settings > [[1]] tab > Cache for shortcuts: On
  Retention period: [[2]]`,
 sel:[["Amazon S3","Azure Data Lake Storage Gen2","Microsoft OneLake"],["OneLake","Spark settings","Git integration"],["1–28 days (resets on each access)","Fixed at 24 hours","Unlimited"]],a:[0,0,0],
 ex:`An S3 shortcut reads the Parquet files in place, so no raw copy is stored. Shortcut caching is enabled on the OneLake tab of workspace settings; files read through the shortcut are cached for the retention period you choose (1–28 days), which cuts repeated egress charges. Files larger than 1 GB aren't cached, and these files are all under 1 GB.`},
{s:0,c:0,d:2,t:"single",ref:"pipeline Copy activity REST connector retry workspace",
 stem:`You need to ingest the seven MAR1 entities into the bronze layer while meeting the requirements for data ingestion items. What should you create?`,
 opts:["A data pipeline in WorkspaceA with Copy activities that use the REST connector, with retry configured on each activity","A Dataflow Gen2 in WorkspaceB that calls each endpoint and writes to Lakehouse1","A notebook in WorkspaceA that calls the APIs with the requests library and writes Delta tables","An Eventstream with a custom endpoint source"],a:0,
 ex:`A pipeline uses a built-in REST connection, lands Delta tables with no transformation, supports activity retries for transient errors, and is source-controlled with the other WorkspaceA items. Dataflows must live in WorkspaceB, which would separate ingestion from the lakehouse, and a notebook with custom API code isn't a built-in connection or minimal effort.`},
{s:0,c:0,d:1,t:"yesno",ref:"pipeline activity dependencies on success on failure Office 365 Outlook parallel",
 stem:`You are designing the pipeline that populates the medallion layers. For each statement, select Yes if it is true. Otherwise, select No.`,
 rows:["Placing the seven MAR1 Copy activities in the pipeline with no dependencies between them lets them run simultaneously.","An Office 365 Outlook activity connected to each step with an On failure dependency meets the email requirement.","The silver-layer notebook activity should depend on the bronze Copy activities with an On completion dependency."],a:[1,1,0],
 ex:`Activities without dependencies run in parallel. On failure branches run only when the step fails, which is when the email must be sent. On completion runs even after a failure; because each layer must be fully populated before the next, use On success.`},
{s:0,c:0,d:3,t:"single",ref:"Delta VACUUM remove unreferenced files weekly",
 stem:`You need to meet the requirement to remove old files that are no longer referenced by a Delta table log once a week. What should you schedule?`,
 opts:["A notebook that runs VACUUM on the lakehouse tables","A notebook that runs OPTIMIZE on the lakehouse tables","A pipeline that resets the workspace shortcut cache","A Dataflow Gen2 refresh"],a:0,
 ex:`VACUUM deletes files that the Delta log no longer references and that are older than the retention threshold. OPTIMIZE compacts files; it doesn't remove old ones.`},
{s:0,c:0,d:2,t:"hot",ref:"inner join dimension active products omit unused categories",
 stem:`You are building the gold product dimension. How should you complete the query? Select the appropriate option in each list.`,
 tpl:`SELECT p.ProductID, p.Name, s.SubcategoryName, c.CategoryName
FROM   Products p
[[0]] ProductSubcategories s ON s.SubcategoryID = p.SubcategoryID
[[1]] ProductCategories    c ON c.CategoryID    = s.CategoryID
WHERE  p.IsActive = [[2]]`,
 sel:[["INNER JOIN","LEFT JOIN","RIGHT JOIN","FULL JOIN"],["INNER JOIN","LEFT JOIN","RIGHT JOIN"],["1","0","NULL"]],a:[0,0,0],
 ex:`Inner joins from Products outward keep only subcategories and categories that are assigned to at least one product, which drops the irrelevant ones. The WHERE clause keeps active products only.`},
{s:0,c:0,d:1,t:"single",ref:"workspace license mode Pro Fabric capacity create lakehouse",
 stem:`The data engineers report that they can't create Lakehouse1 in WorkspaceA. What should you do first?`,
 opts:["Assign WorkspaceA to the Cap1 capacity","Grant the DataEngineers group the Admin role","Enable Git integration for WorkspaceA","Create WorkspaceA in a new domain"],a:0,
 ex:`WorkspaceA uses Pro license mode, which supports only Power BI items. Fabric items such as lakehouses require the workspace to be assigned to a Fabric capacity (Cap1).`},
{s:0,c:0,d:1,t:"single",ref:"Contributor role commit Git lakehouse write least privilege",
 stem:`You need to assign the DataEngineers group a role in WorkspaceA that meets the security requirements and follows least privilege. Which role should you assign?`,
 opts:["Contributor","Member","Admin","Viewer"],a:0,
 ex:`Contributors can read and write all lakehouse data including files and can commit to Git. Members and Admins add the ability to manage access, which the engineers don't need.`},

/* ===== Section 2: Litware case ===== */
{s:1,c:1,d:1,t:"single",ref:"high concurrency isolation Spark sessions",
 stem:`You need to ensure that the processes for the bronze and silver layers run in isolation. How should you configure the Apache Spark settings?`,
 opts:["Disable high concurrency","Create a custom pool","Modify the number of executors","Set the default environment"],a:0,
 ex:`High concurrency lets notebooks share one Spark session. The case states it's enabled, so the bronze and silver notebooks can end up in the same session. Disabling it gives each run its own session. A custom pool changes compute sizing, not session sharing. (The source document's key says custom pool; Microsoft's definition of high concurrency makes that wrong.)`},
{s:1,c:1,d:1,t:"hot",ref:"row-level security warehouse SCHEMABINDING USER_NAME security policy",
 stem:`You need to ensure that authors can see only their own sales data. How should you complete the statements? Select the appropriate option in each list.`,
 tpl:`CREATE FUNCTION dbo.tvf_rlspredicate(@Author AS varchar(50))
  RETURNS TABLE
  WITH [[0]]
AS
  RETURN SELECT 1 AS tvf_rlspredicate_result
  WHERE @Author = [[1]]
GO

CREATE SECURITY POLICY RLSFilter
  ADD FILTER PREDICATE dbo.tvf_rlspredicate(AuthorEmail)
  ON [[2]]
  WITH (STATE = ON)`,
 sel:[["SCHEMABINDING","INLINE","BLOCK"],["USER_NAME()","AuthorEmail","AuthorSales.AuthorEmail"],["AuthorSales","AuthorEmail","FILTER"]],a:[0,0,0],
 ex:`RLS predicate functions must be schema-bound. USER_NAME() returns the signed-in author's email (their guest identity), which is compared with the AuthorEmail column passed to the predicate. The policy is bound to the AuthorSales table.`},
{s:1,c:1,d:2,t:"single",ref:"Eventstream custom endpoint REST near real time",
 stem:`You need to process the SEO data in near real time while meeting the governance requirement. What should you use?`,
 opts:["An Eventstream with a custom endpoint source and an Eventhouse destination","An Azure Event Hubs namespace and a Spark streaming notebook","A Dataflow Gen2 scheduled every minute","An Azure Function that writes to the lakehouse"],a:0,
 ex:`A custom endpoint lets the REST-streamed data be pushed straight into an Eventstream, and the Eventhouse is built for near-real-time analytics. Event Hubs and Azure Functions are additional Azure resources, which the governance requirement forbids.`},
{s:1,c:1,d:2,t:"single",ref:"S3 shortcut no copy lakehouse",
 stem:`You need to make the book reviews available in the lakehouse while meeting the data requirement. What should you create?`,
 opts:["An Amazon S3 shortcut in the lakehouse","A Copy job from S3 to the lakehouse","A Dataflow Gen2 with an S3 connector","Mirroring for Amazon S3"],a:0,
 ex:`A shortcut references the S3 data in place without copying it. Copy jobs and dataflows create copies, and mirroring isn't available for object storage.`},
{s:1,c:1,d:1,t:"single",ref:"OneLake events file created trigger Activator pipeline",
 stem:`You need to process new book cover images as soon as they arrive in the Files folder. What should you configure?`,
 opts:["An Activator rule on OneLake file-created events for the Files folder that runs a notebook","A notebook scheduled every minute","An Eventstream with the Files folder as a source","Keep your Direct Lake data up to date"],a:0,
 ex:`OneLake events emit FileCreated when files land in a lakehouse folder. An Activator rule on those events can start a notebook or pipeline immediately, which is event-driven rather than polling. This uses only Fabric items.`},
{s:1,c:1,d:3,t:"single",ref:"queryinsights exec_requests_history failed queries query_hash",
 stem:`You need to find the warehouse queries that caused more than one failure. What should you query?`,
 opts:["queryinsights.exec_requests_history, filtering on failed status and grouping by the query hash","sys.dm_exec_requests","The Capacity Metrics app","The Monitoring hub"],a:0,
 ex:`exec_requests_history keeps 30 days of completed requests including status and a query hash, so you can count failures per distinct query. sys.dm_exec_requests shows only running requests.`},
{s:1,c:1,d:2,t:"single",ref:"Dataflow Gen2 incremental refresh schedule after source refresh",
 stem:`You need to ensure that the sales data is up to date when the sales team arrives in the morning, with the least processing. What should you do?`,
 opts:["Migrate to a Dataflow Gen2 with incremental refresh on Sales Date, scheduled after the 6:00 AM source refresh","Keep the Dataflow Gen1 dataflow and schedule a full refresh at midnight","Migrate to a Dataflow Gen2 that reloads all history every hour","Replace the dataflow with mirroring"],a:0,
 ex:`The source refreshes at midnight and 6:00 AM, so a refresh scheduled after 6:00 AM captures the latest data before the team arrives. Incremental refresh processes only recent data, which works because data older than one month never changes.`},
{s:1,c:1,d:1,t:"single",ref:"Git integration GitHub commit Contributor least privilege",
 stem:`You need to let the data engineering team commit changes to the GitHub repository connected to Workspace1 while following least privilege. Which workspace role should you assign?`,
 opts:["Contributor","Viewer","Member","Admin"],a:0,
 ex:`Contributors can commit and update from Git. Viewers can't. Member and Admin grant unnecessary access-management rights.`},

/* ===== Section 3: main ===== */
{s:2,d:2,t:"single",ref:"lakehouse read T-SQL KQL Spark write Spark semi-structured",
 stem:`You have semi-structured data that will be written only by using Apache Spark and must be read by using T-SQL, KQL, and Spark. What should you use to store the data?`,
 opts:["A lakehouse","An eventhouse","A datamart","A warehouse"],a:0,
 ex:`A lakehouse is written by Spark, read by T-SQL through its SQL analytics endpoint, and read by KQL through a shortcut in a KQL database or the Eventhouse endpoint. A warehouse can't be written by Spark, and an eventhouse is written through ingestion, not Spark. (The source document's key says eventhouse; the lakehouse meets every stated requirement.)`},
{s:2,d:2,t:"single",ref:"pipeline on-premises data gateway SQL Server warehouse copy",
 stem:`You need to copy data from an on-premises SQL Server database that's reached through an on-premises data gateway into a Fabric warehouse. Which item should you use?`,
 opts:["A data pipeline","A Dataflow Gen1 dataflow","A KQL queryset","A Spark job definition","An eventstream"],a:0,
 ex:`Pipeline Copy activities support the on-premises data gateway and write directly to a warehouse. Gen1 dataflows are a Power BI item, querysets only run KQL, Spark can't use the gateway, and eventstreams are for streaming sources.`},
{s:2,d:3,t:"single",ref:"Direct Lake guardrails F32 300 million rows fallback",
 stem:`A warehouse on an F32 capacity is modeled with MD5 hash surrogate keys. Its single fact table grew from 200 million to 500 million rows. Direct Lake reports with year-over-year visuals have slowed down and some visuals show errors. You need the best query performance while minimizing operational cost. What should you do?`,
 opts:["Increase the capacity","Enable V-Order","Change the MD5 hash to SHA256","Modify the surrogate keys to use a different data type","Create views"],a:0,
 ex:`The Direct Lake guardrail for F32 is 300 million rows per table. At 500 million rows every query falls back to DirectQuery, which is slower and times out on heavy visuals. Only a larger SKU (F64 allows 1,500 million) restores Direct Lake mode. Warehouse tables already have V-Order on by default, and changing key types doesn't reduce the row count. (The source document's key says V-Order.)`},
{s:2,d:2,t:"hot",ref:"T-SQL ROLLUP GROUP BY year product subtotal",
 stem:`A warehouse has SalesOrderDetail (ProductID, ModifiedDate, OrderQty) and Product (ProductID, Name). You need order quantities summarized by year and product, plus a subtotal for each year across all products and a grand total. How should you complete the query? Select the appropriate option in each list.`,
 tpl:`[[0]](SO.ModifiedDate) AS OrderDate
      ,P.Name AS ProductName
      ,SUM(SO.OrderQty) AS OrderQty
FROM [dbo].[SalesOrderDetail] SO
INNER JOIN [dbo].[Product] P ON P.ProductID = SO.ProductID
GROUP BY [[1]]
ORDER BY OrderDate`,
 sel:[["SELECT YEAR","SELECT CAST","SELECT CONVERT"],["ROLLUP(YEAR(SO.ModifiedDate), P.Name)","CUBE(YEAR(SO.ModifiedDate), P.Name)","GROUPING SETS ((YEAR(SO.ModifiedDate), P.Name), (YEAR(SO.ModifiedDate)))","YEAR(SO.ModifiedDate), P.Name"]],a:[0,0],
 ex:`YEAR() extracts the grouping year. ROLLUP(year, product) returns year-and-product rows, a subtotal per year, and a grand total. GROUPING SETS with (year, product) and (year) would give the year subtotals without the grand total; CUBE adds per-product totals across years that weren't asked for.`},
{s:2,d:2,t:"multi",n:3,ref:"star schema dimension table columns",
 stem:`A flat table has TransactionID, Date, ProductID, ProductColor, ProductName, and SalesAmount. You split it into FactSales and DimProduct and will track changes in DimProduct. Which three columns should you include in DimProduct? Each correct answer presents part of the solution.`,
 opts:["Date","ProductName","ProductColor","TransactionID","SalesAmount","ProductID"],a:[1,2,5],
 ex:`The product dimension holds the product key and its descriptive attributes. Date belongs to a date dimension, TransactionID is the fact grain, and SalesAmount is a measure in the fact table.`},
{s:2,d:1,t:"single",ref:"high concurrency notebooks share Spark session",
 stem:`You create Notebook2 in a workspace that already has Notebook1. You need to be able to attach Notebook2 to the same Apache Spark session as Notebook1. What should you do?`,
 opts:["Enable high concurrency for notebooks","Enable dynamic allocation for the Spark pool","Change the runtime version","Increase the number of executors"],a:0,
 ex:`High concurrency mode lets multiple notebooks share one Spark session. The other settings change compute sizing or runtime, not session sharing.`},
{s:2,d:1,t:"multi",n:3,ref:"isolate PII table separate workspace Contributor",
 stem:`Lakehouse1 in Workspace1 contains Orders, Customer, and Employee tables. Employee contains PII. A data engineer must write to the Customer table but must not be able to read the Employee table. Which three actions should you perform? Each correct answer presents part of the solution.`,
 opts:["Share Lakehouse1 with the data engineer","Assign the data engineer the Contributor role for Workspace2","Assign the data engineer the Viewer role for Workspace2","Assign the data engineer the Contributor role for Workspace1","Migrate the Employee table from Lakehouse1 to Lakehouse2","Create a new workspace named Workspace2 that contains a new lakehouse named Lakehouse2","Assign the data engineer the Viewer role for Workspace1"],a:[3,4,5],
 ex:`Writing requires Contributor, and Contributors can read every table in the workspace, so the PII table must move to a lakehouse in a workspace the engineer has no role in.`},
{s:2,d:1,t:"single",ref:"row-level security warehouse function security policy",
 stem:`You plan to implement row-level security on a warehouse table so each sales representative sees only their rows. Which warehouse object do you need to create for the filtering logic?`,
 opts:["FUNCTION","STORED PROCEDURE","CONSTRAINT","SCHEMA"],a:0,
 ex:`RLS uses an inline table-valued function as the filter predicate, bound to the table by a security policy.`},
{s:2,d:1,t:"yesno",ref:"deployment pipeline what is copied semantic model data refresh schedule dataflows",
 stem:`Workspace1_DEV contains reports, notebooks, lakehouses, pipelines, Dataflow Gen1 and Gen2 dataflows, and semantic models with scheduled refresh. You deploy everything to Workspace1_TEST with a deployment pipeline. For each statement, select Yes if it is true. Otherwise, select No.`,
 rows:["Data from the semantic models is deployed to the target stage.","The Dataflow Gen1 dataflows are deployed to the target stage.","The scheduled refresh policies are deployed to the target stage."],a:[0,1,0],
 ex:`Deployment copies item definitions and metadata only. Semantic model data and refresh schedules aren't copied; the target must be refreshed and scheduled separately. Dataflows (Gen1 and Gen2) are supported items.`},
{s:2,d:1,t:"single",ref:"deploy eventhouse deployment pipeline",
 stem:`You need to deploy an eventhouse through Dev, Test, and Prod workspaces as part of the deployment process. What should you use?`,
 opts:["A Fabric deployment pipeline","GitHub Actions","An Azure DevOps pipeline"],a:0,
 ex:`Eventhouses are supported items in Fabric deployment pipelines, which handle stage-to-stage promotion natively.`},
{s:2,d:1,t:"single",ref:"database project validate invalid references warehouse",
 stem:`Before deploying Warehouse1 to another workspace, you need to verify whether it contains invalid references, with minimal development effort. What should you use?`,
 opts:["A database project","A deployment pipeline","A Python script","A T-SQL script"],a:0,
 ex:`Building a SQL database project validates every object reference in the schema and reports broken ones. Deployment pipelines move items; they don't validate object references. (The source document's key says deployment pipeline.)`},
{s:2,d:2,t:"single",ref:"OneLake availability eventhouse new data existing tables",
 stem:`Users can't see eventhouse data in OneLake file explorer. You enable OneLake availability for the eventhouse's KQL database without selecting Apply to existing tables. What is copied to OneLake?`,
 opts:["Only new data added to the eventhouse","Only the existing data in the eventhouse","Both new and existing data","No data","Only data in new databases"],a:0,
 ex:`By default, OneLake availability applies to new tables and new data from that point on. Selecting Apply to existing tables triggers the historic backfill.`},
{s:2,d:1,t:"single",ref:"service principal Azure DevOps Fabric API deployment pipeline",
 stem:`An Azure DevOps pipeline will call the Fabric API to run a deployment pipeline. Which authentication type should you use?`,
 opts:["Service principal","Microsoft Entra username and password","Managed private endpoint","Workspace identity"],a:0,
 ex:`A service principal is the supported identity for automation calling Fabric REST APIs. Workspace identity authenticates Fabric items to external resources, not external tools to Fabric.`},
{s:2,d:2,t:"single",ref:"shortcut cache retention last accessed GCS",
 stem:`A Google Cloud Storage bucket contains ProductFile.parquet (8 MB), StoreFile.json (500 MB), and TripsFile.csv (99 MB). Workspace1 has the shortcut cache enabled with a one-day retention period. Lakehouse1 has shortcuts Products (last accessed 12 hours ago), Stores (4 hours ago), and Trips (48 hours ago). You read all three shortcuts. Which shortcuts retrieve data from the cache?`,
 opts:["Stores and Products only","Stores only","Products only","Products, Stores, and Trips","Trips only","Products and Trips only"],a:0,
 ex:`GCS shortcuts support caching, and all three files are under the 1 GB limit. Trips was last accessed 48 hours ago, beyond the one-day retention, so its cached copy was purged.`},
{s:2,d:1,t:"single",ref:"managed private endpoint Spark job Azure SQL public access disabled",
 stem:`A Spark job definition must read an Azure SQL database that has public internet access disabled. What should you create?`,
 opts:["A managed private endpoint","An on-premises data gateway","An integration runtime","A data management gateway"],a:0,
 ex:`Managed private endpoints let Fabric Spark reach Azure resources privately; the resource owner approves the connection. Gateways and integration runtimes are for pipelines and dataflows, not Spark.`},
{s:2,d:2,t:"single",ref:"shortcut cache ADLS Gen2 not supported 1 GB limit",
 stem:`storage1 is an ADLS Gen2 account and storage2 is an S3 bucket. Delta Parquet files: ProductFile (storage1, 50 MB), TripsFile (storage2, 2 GB), StoreFile (storage2, 25 MB). Workspace1 has the shortcut cache enabled. Lakehouse1 has shortcuts Products, Stores, and Trips to these files. Which shortcuts retrieve data from the cache?`,
 opts:["Stores only","Trips and Stores only","Products and Stores only","Products only","Products, Stores, and Trips"],a:0,
 ex:`Caching applies to GCS, S3, S3-compatible, and on-premises gateway shortcuts, not ADLS Gen2, so Products is excluded. Files over 1 GB aren't cached, so Trips is excluded. Only Stores qualifies.`},
{s:2,d:1,t:"hot",ref:"orchestrate notebook pipeline schedule Real-Time hub Blob events semantic model refresh",
 stem:`Workspace1 contains Notebook1, Notebook2, Lakehouse1, Pipeline1, and semantic model Model1 (Keep your Direct Lake data up to date is disabled). Notebook1 must run every weekday at 8:00 AM. Notebook2 must run when a file is saved to an Azure Blob Storage container. Model1 must refresh when Notebook1 succeeds. How should you orchestrate each item? Select the appropriate option in each list.`,
 tpl:`Notebook1: [[0]]
Notebook2: [[1]]
Pipeline1: [[2]]
Model1:    [[3]]`,
 sel:[["Add Notebook1 to Pipeline1","Add Notebook1 to a Spark job definition","From Real-Time hub, configure the execution of Notebook1"],["From Real-Time hub, configure the execution of Notebook2","Add Notebook2 to Pipeline1","Add Notebook2 to a Spark job definition"],["Configure the execution of Pipeline1 by using a schedule","Add Pipeline1 to a Spark job definition","From Real-Time hub, configure the execution of Pipeline1"],["Add Model1 to Pipeline1","From Real-Time hub, configure Model1 to refresh","Set Keep your Direct Lake data up to date to On"]],a:[0,0,0,0],
 ex:`A scheduled pipeline runs Notebook1 on weekdays, and a Semantic model refresh activity after the notebook (On success) refreshes Model1 only when Notebook1 succeeds. Notebook2 is event-driven: Azure Blob Storage events in Real-Time hub trigger it.`},
{s:2,d:1,t:"single",ref:"create domain subdomains Fabric admin role",
 stem:`A user must create a new domain for the sales department, create east and west subdomains, and assign Workspace1 and Workspace2 to them. Which role should you assign, following least privilege?`,
 opts:["Fabric admin","Domain admin","Domain contributor","Workspace Admin"],a:0,
 ex:`Only Fabric admins can create top-level domains. Domain admins manage an existing domain, including subdomains and workspace assignment, but the domain must exist first.`},
{s:2,d:1,t:"single",ref:"Viewer role object-level permissions warehouse update",
 stem:`User3 must view all items in Workspace1 and update tables in warehouse DW1. You already assigned the appropriate object-level permissions on DW1. Which workspace role should you assign, following least privilege?`,
 opts:["Viewer","Contributor","Member","Admin"],a:0,
 ex:`Viewer lets User3 see every item. The SQL object-level permissions already granted on DW1 provide the write access to the tables, so a higher role isn't needed. (The source document's key says Contributor; the object-level permissions clue makes Viewer the least-privilege answer.)`},
{s:2,d:1,t:"single",ref:"share lakehouse directly Read all SQL endpoint data no Spark",
 stem:`User1 must use SQL to read table data in Lakehouse1, must not be able to use Spark to read the files, and must not access other items in Workspace1. What should you do?`,
 opts:["Share Lakehouse1 with User1 directly and select Read all SQL endpoint data","Assign User1 the Viewer role, then share Lakehouse1 with Read all SQL endpoint data","Share Lakehouse1 with User1 directly and select Build reports on the default semantic model","Assign User1 the Member role, then share Lakehouse1 with Read all SQL endpoint data"],a:0,
 ex:`Item sharing scopes access to Lakehouse1 only. ReadData grants T-SQL access without OneLake/Spark access. Any workspace role would expose the other items.`},
{s:2,d:1,t:"match",ref:"endorsement master data certified promoted dashboards cannot be endorsed",
 stem:`Match each entity to the endorsement badge you should apply. Each badge may be used once, more than once, or not at all.`,
 targets:["Entity1: lakehouse data used as a core organizational entity","Entity2: semantic model whose data meets organizational standards","Entity3: Power BI report that's ready for sharing and reuse","Entity4: Power BI dashboard with approved data for executive decisions"],
 pool:["Master data","Certified","Promoted","Cannot be endorsed"],a:[0,1,2,3],
 ex:`Master data marks core business entities, Certified marks items that passed a formal review, and Promoted marks items ready for reuse. Endorsement is available for every Fabric item except Power BI dashboards.`},
{s:2,d:1,t:"yesno",ref:"domains default domain workspace roles domain contributor",
 stem:`User1 is admin of Workspace1 and Domain1. User2 is admin of Workspace2 and Domain2. Group1 contains User1 and User3. User1 creates Workspace3. You add Group1 to the default domain setting of Domain1. For each statement, select Yes if it is true. Otherwise, select No.`,
 rows:["User3 has Viewer role access to Workspace3.","User3 has domain contributor access to Domain1.","User2 has Contributor role access to Workspace3."],a:[0,0,0],
 ex:`The default domain setting only assigns new workspaces created by those users to Domain1. It grants no workspace roles and doesn't make anyone a domain contributor. User2 has no role in Workspace3.`},
{s:2,d:1,t:"single",ref:"deployment pipeline paired items overwrite",
 stem:`deployPipeline1 deploys all items from Workspace1 to Workspace2. Items with the same name in both workspaces are paired. You modified items in Workspace1 and need them to overwrite the corresponding items in Workspace2 with minimal effort. What should you do?`,
 opts:["Run deployPipeline1 without modifying the items in Workspace2","Delete all the items in Workspace2, then run deployPipeline1","Rename each item in Workspace2 to match Workspace1","Back up the items in Workspace2, then run deployPipeline1"],a:0,
 ex:`Deployment overwrites paired items in the target stage with the source versions. Unpaired items are created. Nothing else is required.`},
{s:2,d:1,t:"single",ref:"deployment pipeline folders deployed",
 stem:`Workspace1 contains Pipeline1 and Lakehouse1. You add Folder1, move Pipeline1 into it, and deploy to Workspace2 with a deployment pipeline. What happens in Workspace2?`,
 opts:["Folder1 is created, Pipeline1 moves to Folder1, and Lakehouse1 is deployed","Only Pipeline1 and Lakehouse1 are deployed","Folder1 is created, and both Pipeline1 and Lakehouse1 move to Folder1","Only Folder1 is created and Pipeline1 moves to Folder1"],a:0,
 ex:`Deployment pipelines replicate the folder structure, so Folder1 is created with Pipeline1 inside it, and Lakehouse1 stays at the root.`},
{s:2,d:1,t:"build",ref:"environment install libraries default environment notebooks",
 stem:`Developers maintain Python libraries that transform data. You need the libraries available by default to new notebooks in Workspace1. Which three actions should you perform in sequence? Move the appropriate actions to the answer area and arrange them in the correct order.`,
 pool:["Create an environment","Install the libraries","Set the default environment","Change the runtime version","Create a pool"],a:[0,1,2],
 ex:`Create an environment, add the libraries to it, then set it as the workspace default so every new notebook attaches to it.`},
{s:2,d:3,t:"single",ref:"OPTIMIZE consolidate Parquet files Delta",
 stem:`Notebook1 reads Table1, transforms it, and merges into Table2. You need to consolidate the underlying Parquet files of Table1. Which command should you run?`,
 opts:["OPTIMIZE","VACUUM","BROADCAST","CACHE"],a:0,
 ex:`OPTIMIZE compacts small Parquet files into larger ones. VACUUM removes unreferenced files, BROADCAST is a join hint, and CACHE keeps data in memory.`},
{s:2,d:3,t:"single",ref:"Monitoring hub Location column workspace",
 stem:`You monitor item runs across five workspaces in the Monitoring hub. You need to identify the workspace in which a specific item runs. Which column should you view?`,
 opts:["Location","Capacity","Activity name","Submitter","Item type","Job type","Start time"],a:0,
 ex:`The Location column shows the workspace that contains the item.`},
{s:2,d:3,t:"single",ref:"Monitoring hub Spark application details runtime Delta version",
 stem:`Warehouse DW1 is loaded by Notebook1. You need to identify which version of Delta was used when Notebook1 ran. What should you use?`,
 opts:["Fabric Monitor (the Monitoring hub)","Real-Time hub","OneLake data hub","The Admin monitoring workspace","The Capacity Metrics app"],a:0,
 ex:`The Monitoring hub opens the Spark application details for each notebook run, including the runtime version, which determines the Delta version.`},
{s:2,d:1,t:"build",ref:"ALTER TABLE ADD CONSTRAINT PRIMARY KEY NONCLUSTERED NOT ENFORCED",
 stem:`In Warehouse1 you created dbo.DimCustomer (CustomerKey, Name, Email). You need to set CustomerKey as the primary key. Which three code segments should you run in sequence? Move the appropriate segments to the answer area and arrange them in the correct order.`,
 pool:["ALTER TABLE dbo.DimCustomer","ADD CONSTRAINT PK_DimCustomer PRIMARY KEY NONCLUSTERED (CustomerKey)","NOT ENFORCED","ADD CONSTRAINT PK_DimCustomer PRIMARY KEY CLUSTERED (CustomerKey)","ENFORCED","DROP CONSTRAINT PK_DimCustomer"],a:[0,1,2],
 ex:`Fabric Warehouse primary keys are added with ALTER TABLE and must be NONCLUSTERED and NOT ENFORCED.`},
{s:2,d:3,t:"single",ref:"semantic link notebook refresh semantic model monitor",
 stem:`You need to dynamically execute and monitor the refresh progress of semantic model Model1. What should you use?`,
 opts:["A semantic link in a notebook","The Monitoring hub","Dynamic management views in SSMS","Dynamic management views in Azure Data Studio"],a:0,
 ex:`Semantic link (SemPy) lets a notebook start a refresh and poll its status programmatically. The Monitoring hub shows status but can't trigger a refresh dynamically.`},
{s:2,d:1,t:"hot",ref:"notebookutils runMultiple DAG activities dependencies",
 stem:`Load_Orders depends on the successful run of Load_Salesperson. You need a notebook that runs both in the correct order. How should you complete the code? Select the appropriate option in each list.`,
 tpl:`DAG = {
  "[[0]]": [
    { "name": "Load_Salesperson", "path": "Load_Salesperson", "timeoutPerCellInSeconds": 300 },
    { "name": "Load_Orders", "path": "Load_Orders", "timeoutPerCellInSeconds": 600,
      "[[1]]": ["Load_Salesperson"] }
  ],
  "timeoutInSeconds": 43200
}
notebookutils.notebook.[[2]](DAG)`,
 sel:[["activities","notebooks","execute"],["dependencies","broadcast","notebooks"],["runMultiple","run","execute"]],a:[0,0,0],
 ex:`runMultiple takes a DAG whose activities list each notebook, and the dependencies array makes Load_Orders wait for Load_Salesperson.`},
{s:2,d:1,t:"hot",ref:"dynamic data masking partial ALTER COLUMN",
 stem:`Analysts with the Viewer role must see only the first two and last four characters of the CreditCard column in dbo.CreditCard. How should you complete the statement? Select the appropriate option in each list.`,
 tpl:`[[0]] TABLE dbo.CreditCard
[[1]] COLUMN [CreditCard]
ADD MASKED WITH (FUNCTION = '[[2]](2,"XXXXXXXXXX",4)')`,
 sel:[["ALTER","CREATE","UPDATE","REPLACE"],["ALTER","DROP","DEFAULT","UPDATE"],["partial","email","default","random"]],a:[0,0,0],
 ex:`Masks are added with ALTER TABLE ... ALTER COLUMN ... ADD MASKED. partial(prefix, padding, suffix) shows the first two and last four characters with padding between.`},
{s:2,d:1,t:"hot",ref:"ForEach items Lookup output.value pipeline expression",
 stem:`A pipeline named Dynamic Data Copy has a Lookup activity named "Lookup Schema and Table" connected to a ForEach named "Extraction Loop" that contains a Copy activity named "Batch Object Copy". The pipeline doesn't use parameters. How should you complete the ForEach Items expression? Select the appropriate option in each list.`,
 tpl:`@activity('[[0]]').[[1]]`,
 sel:[["Lookup Schema and Table","Batch Object Copy","Dynamic Data Copy","Extraction Loop"],["output.value","output","output.count","output.pipelineReturnValue"]],a:[0,0],
 ex:`The ForEach iterates the rows returned by the Lookup, which are in output.value when First row only is cleared.`},
{s:2,d:1,t:"hot",ref:"dynamic data masking default partial email date",
 stem:`DimCustomer has CustomerName, CustomerID, BirthDate, and EmailAddress. BirthDate must display 1900-01-01 and EmailAddress must show only the first character and the last five characters. How should you complete the statements? Select the appropriate option in each list.`,
 tpl:`ALTER TABLE DimCustomer ALTER COLUMN BirthDate
  ADD MASKED WITH (FUNCTION = [[0]])

ALTER TABLE DimCustomer ALTER COLUMN EmailAddress
  ADD MASKED WITH (FUNCTION = [[1]])`,
 sel:[["'default()'","'partial(1900-01-01)'","'random(1900-01-01, 1900-01-01)'"],["'partial(1,\"@\",5)'","'email()'","'default()'","'random(1,\"@\",5)'"]],a:[0,0],
 ex:`default() masks dates as 1900-01-01. partial(1, "@", 5) exposes the first character and the last five. email() would show the first character plus the domain suffix pattern, which isn't what was asked.`},

/* ===== Section 4: no-return series ===== */
{s:3,d:2,t:"series",grp:"A",ref:"KQL sort by default descending",
 scen:`An eventstream loads a KQL table named bike_location with columns BikepointID, Street, Neighbourhood, No_Bikes, No_Empty_Docks, and Timestamp. You need to return rows for the neighbourhood Sands End where No_Bikes is at least 15, ordered by No_Bikes ascending.`,
 sol:`Solution: You use the following code segment.`,
 code:`bike_location
| filter Neighbourhood == "Sands End" and No_Bikes >= 15
| sort by No_Bikes
| project BikepointID, Street, Neighbourhood, No_Bikes, No_Empty_Docks, Timestamp
| project BikepointID, Street, Neighbourhood, No_Bikes, No_Empty_Docks, Timestamp`,a:1,
 ex:`KQL's sort by defaults to descending order, so the results are not ascending. The duplicated project is harmless but the ordering fails the requirement.`},
{s:3,d:2,t:"series",grp:"A",ref:"KQL order by default descending",
 scen:`An eventstream loads a KQL table named bike_location with columns BikepointID, Street, Neighbourhood, No_Bikes, No_Empty_Docks, and Timestamp. You need to return rows for the neighbourhood Sands End where No_Bikes is at least 15, ordered by No_Bikes ascending.`,
 sol:`Solution: You use the following code segment.`,
 code:`bike_location
| filter Neighbourhood == "Sands End" and No_Bikes >= 15
| order by No_Bikes
| project BikepointID, Street, Neighbourhood, No_Bikes, No_Empty_Docks, Timestamp`,a:1,
 ex:`order by is an alias of sort by, and the default direction is descending. Without asc the results are in the wrong order.`},
{s:3,d:2,t:"series",grp:"A",ref:"KQL sort by asc",
 scen:`An eventstream loads a KQL table named bike_location with columns BikepointID, Street, Neighbourhood, No_Bikes, No_Empty_Docks, and Timestamp. You need to return rows for the neighbourhood Sands End where No_Bikes is at least 15, ordered by No_Bikes ascending.`,
 sol:`Solution: You use the following code segment.`,
 code:`bike_location
| filter Neighbourhood == "Sands End" and No_Bikes >= 15
| sort by No_Bikes asc
| project BikepointID, Street, Neighbourhood, No_Bikes, No_Empty_Docks, Timestamp`,a:0,
 ex:`The filter matches the requirement and asc makes the sort ascending. Meets the goal.`},
{s:3,d:2,t:"series",grp:"A",ref:"KQL database T-SQL query ORDER BY ascending default",
 scen:`An eventstream loads a KQL table named bike_location with columns BikepointID, Street, Neighbourhood, No_Bikes, No_Empty_Docks, and Timestamp. You need to return rows for the neighbourhood Sands End where No_Bikes is at least 15, ordered by No_Bikes ascending.`,
 sol:`Solution: You use the following code segment.`,
 code:`SELECT BikepointID, Street, Neighbourhood, No_Bikes, No_Empty_Docks, Timestamp
FROM bike_location
WHERE neighbourhood = 'Sands End'
AND no_bikes >= 15
ORDER BY no_bikes`,a:0,
 ex:`KQL databases accept T-SQL queries, and T-SQL's ORDER BY defaults to ascending. Meets the goal.`},
{s:3,d:1,t:"series",grp:"B",ref:"notebookutils credentials getSecret key vault URL secret name",
 scen:`Azure Key Vault KeyVault1 contains secrets. Notebook1 loads staged data to lakehouse tables and triggers a semantic model refresh. You plan to add code that calls the Fabric API to monitor the refreshes, and you need to retrieve the registered application ID and secret from KeyVault1 to generate the authentication token.`,
 sol:`Solution: You use notebookutils.credentials.getSecret and specify the Key Vault URL and the secret name.`,a:0,
 ex:`In Fabric, getSecret takes the Key Vault URL (https://<vault>.vault.azure.net/) and the secret name. Meets the goal. (The source document's key says No, which describes the older Synapse linked-service syntax.)`},
{s:3,d:1,t:"series",grp:"B",ref:"notebookutils credentials putSecret",
 scen:`Azure Key Vault KeyVault1 contains secrets. Notebook1 loads staged data to lakehouse tables and triggers a semantic model refresh. You plan to add code that calls the Fabric API to monitor the refreshes, and you need to retrieve the registered application ID and secret from KeyVault1 to generate the authentication token.`,
 sol:`Solution: You use notebookutils.credentials.putSecret and specify the Key Vault URL and the secret name.`,a:1,
 ex:`putSecret writes a secret to the vault. It doesn't retrieve one.`},
{s:3,d:1,t:"series",grp:"B",ref:"notebookutils credentials getSecret linked service not supported",
 scen:`Azure Key Vault KeyVault1 contains secrets. Notebook1 loads staged data to lakehouse tables and triggers a semantic model refresh. You plan to add code that calls the Fabric API to monitor the refreshes, and you need to retrieve the registered application ID and secret from KeyVault1 to generate the authentication token.`,
 sol:`Solution: You use notebookutils.credentials.getSecret and specify the Key Vault URL and the name of a linked service.`,a:1,
 ex:`Fabric notebooks have no linked services; getSecret expects the vault URL and the secret name.`}
];

const SECTIONS=[
 {name:"Case study: Contoso",desc:"Read the Contoso case on the left (tabs) and answer 8 questions. You can review answers before leaving the case, but you can't return afterward.",review:true},
 {name:"Case study: Litware",desc:"Read the Litware case on the left (tabs) and answer 8 questions. You can review answers before leaving the case, but you can't return afterward.",review:true},
 {name:"Questions",desc:"34 items: single and multiple answer, hot area, build list, drag and drop, and yes/no statements. You can review and change answers until you leave the section.",review:true},
 {name:"Scenario series",desc:"Seven items in two series. Each item restates the same scenario with a different solution. Answer Yes if the solution meets the goal. After you answer an item and select Next, you can't return to it.",review:false}
];
const MINUTES=100;


return {CASES,Q,SECTIONS};
}
