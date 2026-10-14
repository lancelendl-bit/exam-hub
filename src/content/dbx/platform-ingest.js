export const items=[
/* src: https://docs.databricks.com/aws/en/getting-started/overview */
{s:0,d:1,t:"single",ref:"classic compute plane vs serverless compute plane",
 stem:`A financial services company has a security policy that requires the virtual machines that process its data to run inside its own AWS account and virtual network. A data engineer must choose a compute option for nightly Spark workloads that satisfies the policy.

Which option meets the policy?`,
 opts:["Serverless compute for jobs, because it runs inside the customer's own virtual network","Any compute option, because all Databricks compute runs in the control plane","Classic compute, because its resources run in the classic compute plane in the customer's cloud account","A serverless SQL warehouse, because serverless resources are created in the customer's cloud account"],a:2,
 ex:`Classic compute resources are created in your own AWS account, in the classic compute plane in your workspace's virtual network. Serverless compute (including serverless jobs and serverless SQL warehouses) runs in the serverless compute plane that Databricks manages, so it does not meet a requirement to keep the VMs in the customer's account. The control plane holds backend services such as the web application and workspace configuration, not the compute that processes data.`},

/* src: https://docs.databricks.com/aws/en/delta/history and https://docs.databricks.com/aws/en/data-governance/unity-catalog/ */
{s:0,d:1,t:"single",ref:"Delta Lake time travel RESTORE Unity Catalog lineage audit",
 stem:`A team loads daily files into a lakehouse table. They need to undo a bad load quickly, give auditors a record of data access and lineage, and let both BI and ML users read the same governed copy of the data.

Which strategy meets these requirements?`,
 opts:["Keep Parquet files in a shared folder with a nightly copy to a backup folder, and control access with notebook permissions","Use a Delta table registered in Unity Catalog, roll back bad loads with RESTORE TABLE, and rely on Unity Catalog for access control, audit logging and lineage","Use a Delta table and run VACUUM with a retention of 0 hours after every load so that storage stays small and rollback remains possible","Expose the raw files through temporary views that each user team re-creates in its own notebooks"],a:1,
 ex:`Delta Lake versions every write, so RESTORE TABLE can return a table to an earlier version, and Unity Catalog adds centralized access control, audit logging and lineage for one shared copy of the data. Running VACUUM with a retention of 0 hours deletes the data files that older versions reference, which removes the ability to restore to those versions.`},

/* src: https://docs.databricks.com/aws/en/compute/serverless/limitations */
{s:0,d:1,t:"single",ref:"serverless compute limitations streaming trigger availableNow",
 stem:`A data engineer moves a scheduled job to serverless compute. The notebook contains this streaming write:

<div class="code">(spark.readStream.table("main.raw.events")
  .writeStream
  .option("checkpointLocation", "/Volumes/main/raw/chk/events")
  .trigger(processingTime="1 minute")
  .toTable("main.silver.events"))</div>

The run fails with INFINITE_STREAMING_TRIGGER_NOT_SUPPORTED. What should the engineer do?`,
 opts:["Change the trigger to availableNow=True and let the job schedule control how often it runs","Enable Photon on the serverless compute so that time-based triggers are allowed","Switch to a continuous trigger with a one-minute interval, which serverless compute supports","Add a compute-scoped init script that overrides the default trigger"],a:0,
 ex:`Serverless compute supports Trigger.AvailableNow (recommended) and the deprecated Trigger.Once, but not time-based triggers such as processingTime or Trigger.Continuous, so a supported trigger must be set. Photon is not a setting that changes this, and compute-scoped init scripts are not supported on serverless compute.`},

/* src: https://docs.databricks.com/aws/en/jobs/compute */
{s:0,d:1,t:"single",ref:"serverless compute for jobs vs all-purpose compute",
 stem:`A team runs a nightly production job made of notebook tasks. They want Databricks to manage the compute, they do not want to size or maintain clusters, and they do not want to pay for compute while no task is running.

Which compute option should they choose for the job tasks?`,
 opts:["An all-purpose cluster that stays running so that it is ready when the schedule fires","A single shared classic cluster sized once and kept running for all jobs in the workspace","A classic jobs cluster that the team configures with a fixed node type and worker count","Serverless compute for jobs, which Databricks manages and which is the default for tasks that support it"],a:3,
 ex:`Serverless compute for jobs is managed by Databricks, is the default for supported tasks, and is the recommended choice for notebook tasks. Using all-purpose compute for production jobs is not recommended. A classic jobs cluster also stops after the run, but the team must configure and maintain its settings, which the requirements rule out.`},

/* src: https://docs.databricks.com/aws/en/ingestion/cloud-object-storage/auto-loader/schema */
{s:0,d:2,t:"single",ref:"Auto Loader schema evolution addNewColumns UnknownFieldException",
 stem:`A data engineer runs an Auto Loader stream that reads JSON files and sets only cloudFiles.format and cloudFiles.schemaLocation, with no schema and no schemaEvolutionMode. The Lakeflow Jobs task fails with an UnknownFieldException after the source team adds a new field to the files. The schema stored in the schema location now includes the new field.

What should the engineer do?`,
 opts:["Delete the schema location and the checkpoint, then reprocess all files from scratch","Restart the stream, for example through a job retry; it resumes with the updated schema","Set cloudFiles.schemaEvolutionMode to none so that the stream no longer fails","Set cloudFiles.inferColumnTypes to true so that schema changes no longer stop the stream"],a:1,
 ex:`The default mode when no schema is provided is addNewColumns: Auto Loader updates the stored schema, then stops the stream with an UnknownFieldException, and the stream picks up the new schema when it restarts. Setting none would make the stream ignore new columns instead of capturing them. inferColumnTypes only affects data type inference, not how new columns are handled.`},

/* src: https://docs.databricks.com/aws/en/ingestion/cloud-object-storage/auto-loader/schema */
{s:0,d:2,t:"single",ref:"Auto Loader rescue mode _rescued_data",
 stem:`A compliance team requires that an Auto Loader stream landing JSON files never fails because of schema changes and never silently drops fields that are not in the table schema. The target table schema must not change automatically.

Which cloudFiles.schemaEvolutionMode setting meets the requirement?`,
 opts:["addNewColumns","failOnNewColumns","none","rescue"],a:3,
 ex:`In rescue mode Auto Loader never evolves the schema and the stream does not fail because of schema changes. New columns and mismatched data go to the rescued data column (_rescued_data) as a JSON blob. addNewColumns evolves the schema and stops the stream, failOnNewColumns fails the stream, and none ignores new columns rather than preserving them.`},

/* src: https://docs.databricks.com/aws/en/ingestion/cloud-object-storage/auto-loader/schema */
{s:0,d:2,t:"single",ref:"Auto Loader inferColumnTypes JSON strings",
 stem:`A data engineer creates a new Auto Loader stream over JSON files with a schema location and no schema. Every column in the inferred schema, including numeric, timestamp and nested fields, comes back as STRING. The engineer wants Auto Loader to infer real data types for all columns without listing them one by one.

Which option should be added?`,
 opts:[".option(\"cloudFiles.inferColumnTypes\", \"true\")",".option(\"cloudFiles.schemaEvolutionMode\", \"addNewColumns\")",".option(\"cloudFiles.includeExistingFiles\", \"true\")",".option(\"cloudFiles.validateOptions\", \"true\")"],a:0,
 ex:`By default Auto Loader infers all columns of JSON, CSV and XML files as strings, including nested JSON fields. Setting cloudFiles.inferColumnTypes to true switches to type inference like the Spark DataFrameReader. The schemaEvolutionMode option controls how new columns are handled, not the types of existing ones, and the other two options affect which files are read and option validation.`},

/* src: https://docs.databricks.com/aws/en/ingestion/cloud-object-storage/auto-loader/file-detection-modes */
{s:0,d:2,t:"single",ref:"Auto Loader file notification mode file events directory listing",
 stem:`A retailer's Auto Loader stream uses the default file discovery mode on a Unity Catalog external location. Millions of files arrive continuously, the cloud LIST API costs are high, and discovery latency is growing.

What does Databricks recommend to improve scalability and performance?`,
 opts:["Raise cloudFiles.maxFilesPerTrigger so that each micro-batch lists more files","Replace the stream with COPY INTO scheduled every minute","Enable file events on the external location and use file notification mode with cloudFiles.useManagedFileEvents","Set cloudFiles.includeExistingFiles to false so that fewer files are listed"],a:2,
 ex:`Directory listing mode lists the input directory, which can significantly increase LIST API costs under continuous triggers. Databricks recommends file notification mode using file events for most workloads, which needs no additional permissions in the Auto Loader stream once file events are enabled on the external location. maxFilesPerTrigger only caps the batch size and does not change how files are discovered, and COPY INTO is better suited to thousands of files, not millions.`},

/* src: https://docs.databricks.com/aws/en/ingestion/cloud-object-storage/auto-loader/production */
{s:0,d:2,t:"single",ref:"Auto Loader trigger availableNow Lakeflow Jobs batch",
 stem:`A source system drops new files into cloud storage once per night. A data engineer wants to ingest them incrementally with Auto Loader into a Unity Catalog table and avoid paying for an always-on cluster, because latency is not a concern.

Which approach should the engineer use?`,
 opts:["Run the stream continuously on an all-purpose cluster so that it is ready when files arrive","Schedule a Lakeflow Jobs task after the expected arrival time that runs the stream with trigger(availableNow=True)","Schedule a task that re-reads the whole folder with spark.read and overwrites the table each night","Set cloudFiles.maxFilesPerTrigger to 1 so that the continuous stream uses little compute"],a:1,
 ex:`Auto Loader can be scheduled in Lakeflow Jobs as a batch job with Trigger.AvailableNow, which processes everything that has arrived since the last run, using the checkpoint to stay incremental, and then stops. A continuous stream keeps compute running, and a full re-read and overwrite is not incremental and gets slower as data grows.`},

/* src: https://docs.databricks.com/aws/en/sql/language-manual/delta-copy-into */
{s:0,d:2,t:"single",ref:"COPY INTO idempotent force option modified files",
 stem:`A data engineer loads a landing folder with this statement:

<div class="code">COPY INTO main.sales.orders
FROM 's3://acme-landing/orders/'
FILEFORMAT = CSV
FORMAT_OPTIONS ('header' = 'true')</div>

A partner replaces orders_0301.csv, which was loaded earlier, with a corrected file of the same name. Rerunning the statement inserts 0 rows. Why?`,
 opts:["COPY INTO only loads files whose modification time is newer than the last run, and the clock on the partner's system is behind","The statement failed silently because validation is on by default and must be disabled with VALIDATE 0 ROWS","COPY INTO reloads a file only when its name is listed in FILES, and no file list was given","COPY INTO is idempotent and skips files it already loaded even if they were modified since; setting COPY_OPTIONS ('force' = 'true') reloads them"],a:3,
 ex:`COPY INTO tracks files it has already loaded and skips them on later runs, even when the files have changed since. Setting the force copy option to true disables this idempotency so files are loaded regardless, which can duplicate rows unless the old rows are handled. Listing a file in FILES does not bypass the check, and VALIDATE performs a dry run that writes nothing.`},

/* src: https://docs.databricks.com/aws/en/sql/language-manual/delta-copy-into */
{s:0,d:2,t:"single",ref:"COPY INTO mergeSchema schema evolution",
 stem:`A Delta table main.sales.orders has the columns id and amount. New JSON files in the landing folder also contain a coupon column. The engineer wants the table schema to evolve when COPY INTO loads these files.

<div class="code">COPY INTO main.sales.orders
FROM '/Volumes/main/sales/landing/orders'
FILEFORMAT = JSON
-- missing clause</div>

Which clause completes the statement?`,
 opts:["COPY_OPTIONS ('mergeSchema' = 'true')","COPY_OPTIONS ('force' = 'true')","VALIDATE ALL","PATTERN = '*.json'"],a:0,
 ex:`The mergeSchema copy option (default false) lets COPY INTO evolve the target schema according to the incoming data. The force option disables idempotency and reloads files, it does not change the schema. VALIDATE only checks the data without writing it, and PATTERN selects files by name.`},

/* src: https://docs.databricks.com/aws/en/ingestion/cloud-object-storage/ */
{s:0,d:2,t:"single",ref:"Auto Loader vs COPY INTO millions of files schema evolution",
 stem:`A team will ingest files from a cloud storage folder that is expected to accumulate millions of files over time, and the schema of the files is likely to change often. They are choosing between COPY INTO and Auto Loader.

Which choice matches Databricks guidance?`,
 opts:["COPY INTO, because it is idempotent and Databricks recommends it for sources with millions of files","COPY INTO, because only COPY INTO can write to Unity Catalog tables","Auto Loader, because it needs fewer total operations to discover files than COPY INTO and gives better schema inference and evolution","Auto Loader, but only as an always-running stream because it cannot run as a triggered batch job"],a:2,
 ex:`Databricks suggests COPY INTO for files on the order of thousands and Auto Loader for millions or more. Auto Loader requires fewer operations to discover files, can split processing into several batches, and provides better primitive data types for schema inference and evolution. Auto Loader can also run as a scheduled batch job with Trigger.AvailableNow.`},

/* src: https://docs.databricks.com/aws/en/ingestion/file-upload/ */
{s:0,d:2,t:"single",ref:"upload local files create or modify table UI managed table",
 stem:`A business analyst has three CSV files on a laptop and no access to cloud storage. The analyst has CREATE TABLE on the schema main.finance and can use a running SQL warehouse. They want a Unity Catalog table quickly, without writing code.

What should the analyst use?`,
 opts:["COPY INTO with the FROM clause set to the laptop folder","The Create or modify table upload UI, which creates a Unity Catalog managed table from the files","An Auto Loader stream pointed at the laptop folder","A Lakeflow Connect managed database connector"],a:1,
 ex:`Databricks provides a UI that creates a Unity Catalog managed table from a file or files, which needs CREATE TABLE in the target schema and a running SQL warehouse. COPY INTO and Auto Loader read from locations the workspace can reach, such as cloud storage or volumes, not a local laptop folder, and a managed database connector reads from a database source.`},

/* src: https://docs.databricks.com/aws/en/ingestion/lakeflow-connect and https://docs.databricks.com/aws/en/ingestion/overview */
{s:0,d:2,t:"single",ref:"Lakeflow Connect managed connector Workday SaaS ingestion",
 stem:`A company keeps its HR data in Workday. The data engineering team is small, does not want to write or maintain API code, and needs incremental loads into Unity Catalog tables with Databricks operating the pipeline.

Which approach follows Databricks guidance for choosing an ingestion method?`,
 opts:["Use a Lakeflow Connect managed SaaS connector for Workday, the most managed option","Write a notebook with a REST client that pulls pages of data and appends them to a table","Point Auto Loader at the Workday service URL","Run COPY INTO against the Workday API endpoint"],a:0,
 ex:`Lakeflow Connect managed connectors cover enterprise SaaS applications such as Workday. They produce ingestion pipelines governed by Unity Catalog and run on serverless compute, with incremental loads after the first run. Databricks recommends starting with the most managed layer. A custom REST notebook works but the team would maintain it, and Auto Loader and COPY INTO read files from cloud storage, not an API.`},

/* src: https://docs.databricks.com/aws/en/ingestion/lakeflow-connect */
{s:0,d:2,t:"single",ref:"Lakeflow Connect database connector ingestion gateway staging",
 stem:`An engineer configures a Lakeflow Connect managed connector for a SQL Server database using the gateway-based architecture with change data capture. A SaaS connector needs only a connection, an ingestion pipeline and destination tables.

Which additional components does this database connector include?`,
 opts:["A Kafka cluster that buffers changes before the pipeline reads them","A file notification queue that must be created in the source database","A JDBC partition column and bounds that the engineer must tune for every table","An ingestion gateway and staging storage to support continuous change capture"],a:3,
 ex:`Database connectors include an ingestion gateway and staging storage to support continuous change capture, and the gateway runs in its own job as a continuous task. The ingestion pipeline then loads the captured changes into Unity Catalog tables. The managed connector does not require the engineer to run Kafka or tune JDBC partitioning.`},

/* src: https://docs.databricks.com/aws/en/connect/external-systems/jdbc */
{s:0,d:2,t:"single",ref:"Spark JDBC read partitionColumn numPartitions parallel",
 stem:`A notebook reads a 300-million-row PostgreSQL table with the code below. The Spark UI shows a single task doing all of the reading. The table has an indexed, evenly distributed integer column named id with values from 1 to 300,000,000.

<div class="code">df = (spark.read.format("jdbc")
  .option("url", jdbc_url)
  .option("dbtable", "public.events")
  .option("user", dbutils.secrets.get("jdbc", "username"))
  .option("password", dbutils.secrets.get("jdbc", "password"))
  .load())</div>

How should the engineer parallelize the read?`,
 opts:["Increase the fetchsize option, which makes the JDBC source open several connections","Call df.repartition(64) after load() so that the database is read by 64 tasks","Add partitionColumn (id), lowerBound, upperBound and numPartitions options","Wrap the read in df.cache() so that Spark splits it across executors"],a:2,
 ex:`By default the JDBC source queries the database with a single thread. Providing partitionColumn, lowerBound, upperBound and numPartitions makes Spark issue parallel range queries against the source. The fetchsize option only controls how many rows are fetched per round trip, and repartition or cache act after the single-threaded read.`},

/* src: https://docs.databricks.com/aws/en/ldp/load and https://docs.databricks.com/aws/en/sql/language-manual/functions/read_files */
{s:0,d:2,t:"single",ref:"streaming table read_files STREAM Auto Loader SQL",
 stem:`A SQL-only analyst must ingest new JSON files from the Unity Catalog volume /Volumes/main/raw/events as they arrive. Each file must be processed once, previously loaded files must not be read again, and no Python is allowed.

Which statement should the analyst use?`,
 opts:["CREATE OR REFRESH STREAMING TABLE main.bronze.events AS SELECT * FROM STREAM read_files('/Volumes/main/raw/events', format => 'json')","CREATE OR REPLACE TABLE main.bronze.events AS SELECT * FROM read_files('/Volumes/main/raw/events', format => 'json')","CREATE VIEW main.bronze.events AS SELECT * FROM read_files('/Volumes/main/raw/events', format => 'json')","INSERT INTO main.bronze.events SELECT * FROM read_files('/Volumes/main/raw/events', format => 'json')"],a:0,
 ex:`Using read_files with the STREAM keyword in a streaming table uses Auto Loader to ingest files incrementally, so each run processes only new files. The CREATE OR REPLACE TABLE and INSERT INTO versions read every file on each run (the INSERT also duplicates rows), and a view stores nothing and re-reads the files on every query.`},

/* src: https://docs.databricks.com/aws/en/semi-structured/variant */
{s:0,d:2,t:"single",ref:"VARIANT data type semi-structured JSON Delta table",
 stem:`A pipeline ingests JSON event payloads whose structure differs by event type and changes often. Analysts will query individual fields inside the payload. An engineer must choose the column type for the payload in the Delta table.

Which choice does Databricks recommend?`,
 opts:["A STRING column that holds the raw JSON text","A VARIANT column populated with parse_json, queried with path syntax such as payload:user.id","A STRUCT column whose fields are fixed at table creation and altered by hand whenever a new field appears","A BINARY column that holds gzip-compressed JSON"],a:1,
 ex:`Databricks recommends VARIANT over JSON strings for semi-structured data (Databricks Runtime 15.4 and above). A VARIANT column keeps the flexible structure and supports path extraction, such as the colon syntax and casts with ::. A STRING keeps the data as opaque text, and a fixed STRUCT needs a schema change for every new field.`},

/* src: https://docs.databricks.com/aws/en/ingestion/overview */
{s:0,d:2,t:"single",ref:"REST API ingestion notebook land to volume Lakeflow Jobs",
 stem:`A vendor exposes its data only through a REST API. No Lakeflow Connect connector or partner connector exists for it. The team wants the data in Unity Catalog and needs it refreshed every hour.

Which approach is appropriate?`,
 opts:["Point Auto Loader at the REST endpoint with cloudFiles.format set to json","Run COPY INTO with the API URL as the FROM location","Create a Lakeflow Connect managed database connector and enter the API URL as the host","Write a notebook that calls the API with a REST client, lands the responses in a Unity Catalog volume or table, and schedule it with Lakeflow Jobs"],a:3,
 ex:`When no managed or partner connector fits, Databricks provides general compute so you can build your own ingestion, such as a notebook that calls the REST API and writes the results to cloud storage or a volume, or directly to a table, orchestrated on a schedule with Lakeflow Jobs. Auto Loader ingests files from cloud storage and COPY INTO loads from a file location, neither reads from an HTTP API, and a database connector reads from databases.`}
];
