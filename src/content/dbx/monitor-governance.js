export const items=[
/* src: https://docs.databricks.com/aws/en/jobs/monitor */
{s:0,d:6,t:"single",ref:"Lakeflow Jobs run history matrix view duration trend",
 stem:`A data engineer supports a nightly Lakeflow Jobs job that normally finishes in about 25 minutes. Over the past two weeks the data has reached consumers later each morning, although every run still succeeds. The engineer wants to confirm the slowdown and see which task is responsible.

What should they do?`,
 opts:["Open the Graph view of the latest run, because each task node shows the durations of earlier runs","Open the runs page and review the Top 5 error types table for the job","Open the job's Runs tab and compare run and task bar heights across recent runs in the matrix view","Use the Finished runs count graph to compare how many runs completed each day"],a:2,
 ex:`The matrix view on the job's Runs tab shows the history of runs with each task, and the height of each bar indicates its duration, so a growing bar for one task identifies the slow step. The Graph view describes a single run, and the Top 5 error types table and the Finished runs count graph count outcomes, which do not change here because every run succeeds.`},

/* src: https://docs.databricks.com/aws/en/jobs/run-if ; https://docs.databricks.com/aws/en/jobs/repair-job-failures */
{s:0,d:6,t:"single",ref:"Lakeflow Jobs task graph upstream failed repair run",
 stem:`A Lakeflow Jobs job has the tasks ingest_orders, clean_orders, build_gold and refresh_dashboard in a chain, each with the default Run if setting. Last night's run is marked Failed. In the run's graph view, ingest_orders succeeded, clean_orders failed, and build_gold and refresh_dashboard show Upstream failed.

The engineer wants to fix the problem without re-running tasks that already succeeded. What should they do?`,
 opts:["Open build_gold and read its logs, because Upstream failed means that task ran and raised an error","Open the clean_orders task run, fix the cause, and then use Repair run","Click Run now so that all four tasks run again from the beginning","Set Run if dependencies on build_gold to All done so that it runs after the failure"],a:1,
 ex:`With the default All succeeded condition, a task whose dependency failed is marked Upstream failed and never runs, so the root cause is the first failed task upstream, clean_orders. Repair run re-runs only the unsuccessful tasks and their dependents. Run now repeats ingest_orders needlessly, and All done would let build_gold run even though its input was never produced.`},

/* src: https://docs.databricks.com/aws/en/optimizations/spark-ui-guide/long-spark-stage-page */
{s:0,d:6,t:"single",ref:"Spark UI stage spill memory not skew",
 stem:`A nightly aggregation job slowed down after its input volume tripled. In the Spark UI, the longest stage shows spill statistics at the top of the stage page. In the Summary Metrics table, the Max task duration is close to the 75th percentile, and shuffle read is spread evenly across the tasks.

Which change best addresses the bottleneck?`,
 opts:["Use worker instance types with more memory","Add a random salt to the grouping keys and aggregate in two steps","Lower spark.sql.shuffle.partitions so that each task processes more data","Double the size of the driver node"],a:0,
 ex:`Spill statistics on the stage page mean tasks ran short of execution memory, and Databricks lists using instances with more memory among the fixes. Salting addresses skew, but the Max duration is not far above the 75th percentile, so there is no skew. Fewer shuffle partitions would give each task more data and more memory pressure, and the driver is not the constraint.`},

/* src: https://docs.databricks.com/aws/en/delta/clustering ; https://docs.databricks.com/aws/en/optimizations/predictive-optimization */
{s:0,d:6,t:"single",ref:"Liquid Clustering CLUSTER BY AUTO predictive optimization",
 stem:`A Unity Catalog managed table is partitioned by order_date, and a weekly job runs OPTIMIZE with ZORDER BY (customer_id). Analysts change their filter columns often, and the team wants Databricks to choose and maintain the data layout automatically.

Which approach meets the requirement?`,
 opts:["Keep the partitioning and schedule OPTIMIZE FULL every night","Recreate the table with CLUSTER BY (order_date, customer_id, region, status, channel) so every filter column is a key","Make the table external and enable predictive optimization on its schema","Recreate the table with CLUSTER BY AUTO and enable predictive optimization for its schema"],a:3,
 ex:`Liquid clustering replaces partitioning and ZORDER, and CLUSTER BY AUTO lets Databricks select the clustering keys, which requires predictive optimization for the automatic key selection and clustering operations. Liquid clustering allows at most four keys, so the five-key option is invalid. Predictive optimization runs only on Unity Catalog managed tables, so making the table external removes it.`},

/* src: https://docs.databricks.com/aws/en/compute/troubleshooting/cluster-error-codes */
{s:0,d:6,t:"single",ref:"cluster startup failure INIT_SCRIPT_FAILURE",
 stem:`A job cluster for a nightly pipeline fails to start after a teammate changed the path of a cluster-scoped init script. The compute event log shows the termination code INIT_SCRIPT_FAILURE.

What should the data engineer do first?`,
 opts:["Request a vCPU quota increase for the cloud account, then restart the cluster","Allow inbound traffic from the Databricks control plane in the security group","Read the init script logs and correct the script path, storage permissions or failing command","Retry later, because the cloud provider launch failure is transient and clears on its own"],a:2,
 ex:`INIT_SCRIPT_FAILURE means a cluster-scoped init script could not be fetched or exited with an error, so the cluster failed to launch; the fix is whatever the init script logs identify, such as a wrong path or missing permissions. A quota increase is the answer to AWS_RESOURCE_QUOTA_EXCEEDED, opening control-plane traffic fixes INSTANCE_UNREACHABLE, and retrying fits transient CLOUD_PROVIDER_LAUNCH_FAILURE errors.`},

/* src: https://docs.databricks.com/aws/en/libraries/notebooks-python-libraries */
{s:0,d:6,t:"single",ref:"notebook-scoped library conflict restartPython",
 stem:`A notebook's first cell runs import pandas as pd. A later cell runs %pip install pandas==2.2.2, which is newer than the version in the Databricks Runtime, yet print(pd.__version__) still shows the older version.

What should the engineer do?`,
 opts:["Run %pip uninstall pandas to remove the runtime copy first","Put the %pip install before the imports and run dbutils.library.restartPython() after it","Install the same version with a cluster init script so that it overrides the runtime","Rerun the %pip command with --upgrade, because %pip restarts the Python process automatically"],a:1,
 ex:`The module was already imported, and %pip commands do not automatically restart the Python process, so the session keeps using the old version. Databricks recommends installing session libraries at the start of the notebook and restarting Python with dbutils.library.restartPython(). A library bundled in the runtime cannot be uninstalled, and init scripts make library resolution less predictable.`},

/* src: https://kb.databricks.com/jobs/driver-unavailable */
{s:0,d:6,t:"single",ref:"driver out of memory collect Driver is temporarily unavailable",
 stem:`A nightly job fails with "Driver is temporarily unavailable". The event log says the driver was up but not responsive, likely due to garbage collection. The notebook runs rows = df.collect() on a 90-million-row DataFrame and then loops over the rows in Python.

What is the best fix?`,
 opts:["Use DataFrame operations in Spark instead of collecting all rows to the driver","Add 20 more worker nodes so that the cluster has more total memory for the collected rows","Raise spark.sql.shuffle.partitions to 2000 so that the collected data is split into smaller tasks","Turn on autoscaling for the workers so that the cluster grows while the notebook loops over the rows"],a:0,
 ex:`Collecting a very large result into the driver causes driver out-of-memory and garbage-collection pressure, and the recommended remedy is to keep data distributed and use Spark operations, or give the driver more memory if collect is unavoidable. Adding or autoscaling workers does not add driver capacity, and shuffle partitions do not change how much data is pulled to the driver.`},

/* src: https://docs.databricks.com/aws/en/tables/external */
{s:0,d:7,t:"single",ref:"Unity Catalog external table drop data files",
 stem:`A data engineer creates an external table in Unity Catalog and later drops it:
<div class="code">CREATE TABLE prod.logs.web_events (event_id STRING, ts TIMESTAMP)
LOCATION 's3://acme-lake/web_events';

DROP TABLE prod.logs.web_events;</div>
What happens to the data files?`,
 opts:["Unity Catalog deletes the files from the bucket immediately","Unity Catalog removes only the table metadata, and the files stay in the bucket","Unity Catalog keeps the files for 7 days so the drop can be undone, then purges them","The DROP fails until the files in the location are deleted manually"],a:1,
 ex:`Unity Catalog does not delete the underlying data in cloud storage when an external table is dropped, so only the metadata is removed and the files must be deleted directly. Deleting data after a recovery window is the behavior of managed tables, and the drop of an external table does not require the location to be empty.`},

/* src: https://docs.databricks.com/aws/en/sql/language-manual/sql-ref-syntax-ddl-undrop-table ; https://docs.databricks.com/aws/en/tables/managed */
{s:0,d:7,t:"single",ref:"UNDROP TABLE managed table recovery",
 stem:`Yesterday, a data engineer who owns the Unity Catalog managed table prod.sales.orders ran DROP TABLE prod.sales.orders by mistake. The workspace uses default settings, and the engineer has the required privileges on the schema and catalog.

Which statement recovers the table?`,
 opts:["RESTORE TABLE prod.sales.orders TO VERSION AS OF 0;","CREATE TABLE prod.sales.orders LOCATION '<managed storage path>';","Nothing, because dropping a managed table deletes its files immediately","UNDROP TABLE prod.sales.orders;"],a:3,
 ex:`By default a dropped Unity Catalog table can be recovered with UNDROP TABLE for 7 days, and only afterwards does an asynchronous purge delete the data files. RESTORE TABLE rolls back an existing table to an earlier version, so it cannot bring back a dropped one.`},

/* src: https://docs.databricks.com/aws/en/tables/convert-external-managed */
{s:0,d:7,t:"single",ref:"convert external table to managed SET MANAGED",
 stem:`The data engineer owns the Delta external table prod.sales.orders and works on serverless compute. The team wants Unity Catalog to manage the table's storage instead of the external location.

Which statement converts the table in place?`,
 opts:["ALTER TABLE prod.sales.orders SET MANAGED;","ALTER TABLE prod.sales.orders SET MANAGED MOVE;","ALTER TABLE prod.sales.orders SET TBLPROPERTIES ('delta.managed' = 'true');","DROP TABLE prod.sales.orders; then CREATE TABLE prod.sales.orders without a LOCATION clause"],a:0,
 ex:`ALTER TABLE ... SET MANAGED converts a Delta external table to a managed table when the user owns it and uses serverless compute or Databricks Runtime 17.3 LTS or above; ALTER TABLE ... UNSET MANAGED rolls it back within 14 days. The MOVE and COPY options apply only to foreign tables, and dropping then recreating without LOCATION would produce an empty managed table rather than convert the data.`},

/* src: https://docs.databricks.com/aws/en/data-governance/unity-catalog/access-control/permissions-concepts */
{s:0,d:7,t:"single",ref:"USE CATALOG USE SCHEMA SELECT permission error",
 stem:`An admin runs the following statement:
<div class="code">GRANT SELECT ON TABLE prod.sales.orders TO analysts;</div>
Members of the group analysts have no other privileges on prod, yet SELECT * FROM prod.sales.orders fails with a permission error.

Which additional statements fix this with the fewest privileges?`,
 opts:["GRANT ALL PRIVILEGES ON TABLE prod.sales.orders TO analysts; GRANT USE SCHEMA ON SCHEMA prod.sales TO analysts;","GRANT MODIFY ON TABLE prod.sales.orders TO analysts; GRANT USE SCHEMA ON SCHEMA prod.sales TO analysts;","GRANT USE CATALOG ON CATALOG prod TO analysts; GRANT USE SCHEMA ON SCHEMA prod.sales TO analysts;","GRANT CREATE TABLE ON SCHEMA prod.sales TO analysts;"],a:2,
 ex:`To read a table a principal needs USE CATALOG on the catalog, USE SCHEMA on the schema and SELECT on the table, and SELECT alone is not sufficient. The other options add table-level, data-changing or object-creation privileges (two of them also grant USE SCHEMA) but none grants USE CATALOG on the catalog, so access still fails.`},

/* src: https://docs.databricks.com/aws/en/data-governance/unity-catalog/access-control/permissions-concepts */
{s:0,d:7,t:"single",ref:"Unity Catalog privilege inheritance grant on schema",
 stem:`The group data_analysts already has USE CATALOG on the catalog prod and USE SCHEMA on the schema prod.sales. The group must be able to read all current and future tables in prod.sales and nothing else.

Which statement meets the requirement with the least ongoing effort?`,
 opts:["GRANT SELECT ON TABLE for every existing table, repeated whenever a table is created","GRANT ALL PRIVILEGES ON SCHEMA prod.sales TO data_analysts;","GRANT SELECT ON CATALOG prod TO data_analysts;","GRANT SELECT ON SCHEMA prod.sales TO data_analysts;"],a:3,
 ex:`A privilege granted on a parent object automatically applies to all current and future child objects, so SELECT on the schema covers every table in it. SELECT on the catalog would also expose every other schema, ALL PRIVILEGES on the schema grants far more than reading, and per-table grants must be repeated for each new table.`},

/* src: https://docs.databricks.com/aws/en/sql/language-manual/security-deny ; https://docs.databricks.com/aws/en/sql/language-manual/security-revoke */
{s:0,d:7,t:"single",ref:"DENY not supported Unity Catalog REVOKE schema grant",
 stem:`The group contractors can read every table in the schema prod.hr through this grant:
<div class="code">GRANT SELECT ON SCHEMA prod.hr TO contractors;</div>
Security wants contractors to keep reading all tables except prod.hr.salaries.

Which approach works in Unity Catalog?`,
 opts:["DENY SELECT ON TABLE prod.hr.salaries TO contractors; then keep the schema-level grant","REVOKE SELECT ON SCHEMA prod.hr FROM contractors; then GRANT SELECT per table","REVOKE SELECT ON TABLE prod.hr.salaries FROM contractors; then keep the schema-level grant","REVOKE USE SCHEMA ON SCHEMA prod.hr FROM contractors;"],a:1,
 ex:`The classic DENY statement applies only to the hive_metastore catalog and is not supported by Unity Catalog, so access is narrowed by revoking the broad grant and granting at a lower level. REVOKE removes only an explicitly granted privilege, so revoking SELECT on the table leaves the inherited schema grant in force, and revoking USE SCHEMA would block every table in the schema.`},

/* src: https://docs.databricks.com/aws/en/data-governance/unity-catalog/filters-and-masks/manually-apply */
{s:0,d:7,t:"single",ref:"column mask SET MASK is_account_group_member",
 stem:`A data engineer creates this function so that only the hr_admins group sees real Social Security numbers:
<div class="code">CREATE FUNCTION prod.hr.ssn_mask(ssn STRING)
RETURN CASE WHEN is_account_group_member('hr_admins') THEN ssn
            ELSE '***-**-****' END;</div>
Which statement applies the mask to the ssn column of prod.hr.employees?`,
 opts:["ALTER TABLE prod.hr.employees ALTER COLUMN ssn SET MASK prod.hr.ssn_mask;","ALTER TABLE prod.hr.employees SET ROW FILTER prod.hr.ssn_mask ON (ssn);","GRANT EXECUTE ON FUNCTION prod.hr.ssn_mask TO hr_admins;","ALTER TABLE prod.hr.employees ALTER COLUMN ssn DROP MASK;"],a:0,
 ex:`A column mask function is bound to a column with ALTER TABLE ... ALTER COLUMN ... SET MASK, and every query then returns the masked value unless the user belongs to hr_admins. SET ROW FILTER expects a function that returns a boolean to include or exclude rows, granting EXECUTE does not attach anything to the column, and DROP MASK removes a mask.`},

/* src: https://docs.databricks.com/aws/en/data-governance/unity-catalog/filters-and-masks/ ; https://docs.databricks.com/aws/en/data-governance/unity-catalog/filters-and-masks/manually-apply */
{s:0,d:7,t:"single",ref:"row filter function SET ROW FILTER boolean group",
 stem:`The table prod.sales.orders has a region column. Members of the account group global_sales must see all rows. Everyone else must see only rows where region = 'EMEA'. The engineer writes:
<div class="code">CREATE FUNCTION prod.sales.region_filter(region STRING)
RETURNS BOOLEAN
RETURN ???;

ALTER TABLE prod.sales.orders
SET ROW FILTER prod.sales.region_filter ON (region);</div>
Which expression replaces ???`,
 opts:["is_account_group_member('global_sales') AND region = 'EMEA'","region = 'EMEA'","is_account_group_member('global_sales') OR region = 'EMEA'","IF(is_account_group_member('global_sales'), region, NULL)"],a:2,
 ex:`A row filter returns a boolean for each row, and rows that evaluate to FALSE are excluded, so the OR lets global_sales members see everything and everyone else see only EMEA rows. The AND version shows global_sales only EMEA rows and hides everything from other users, region = 'EMEA' also restricts global_sales, and the IF expression returns a string instead of a boolean.`},

/* src: https://docs.databricks.com/aws/en/data-governance/unity-catalog/abac/abac-vs-rls-cm ; https://docs.databricks.com/aws/en/data-governance/unity-catalog/filters-and-masks/ */
{s:0,d:7,t:"single",ref:"ABAC policy central column masking governed tags many tables",
 stem:`A governance team must mask the ssn column for the group us_analysts, except admins, across about 400 tables in the catalog prod. New tables with such columns are added every week, and table owners must not be able to remove the protection.

Which solution fits best?`,
 opts:["Run ALTER COLUMN ssn SET MASK on each table, and rerun the script as new tables appear","Create a dynamic view over each table that checks group membership, and grant analysts access only to the views","Create one mask function and grant EXECUTE on it to us_analysts so that it applies automatically","Tag the ssn columns with a governed tag and create a column mask ABAC policy on the catalog that matches the tag"],a:3,
 ex:`ABAC policies attached at the catalog or schema level apply to every table whose tags match, including tables added later, and table owners cannot override, modify or remove them; Databricks recommends them for consistent masking across many tables. Table-level masks must be set one table at a time and can be changed by owners, dynamic views multiply objects, and EXECUTE on a function attaches nothing.`},

/* src: https://docs.databricks.com/aws/en/data-governance/unity-catalog/abac/core-concepts ; https://docs.databricks.com/aws/en/data-governance/unity-catalog/abac/best-practices */
{s:0,d:7,t:"single",ref:"ABAC policy tag match new table column tags not inherited",
 stem:`An ABAC policy protects the schema prod.customers:
<div class="code">CREATE POLICY mask_ssn
ON SCHEMA prod.customers
COLUMN MASK mask_ssn_fn
TO us_analysts EXCEPT admins
FOR TABLES
MATCH COLUMNS has_tag_value('pii', 'ssn') AS ssn
ON COLUMN ssn;</div>
A new table, prod.customers.leads, is created. Members of us_analysts still see real values in its ssn column.

What is the most likely cause?`,
 opts:["ABAC policies apply only to tables that existed when the policy was created, so it must be recreated","The ssn column of the new table is not tagged with the governed tag pii = ssn, so the policy does not match it","The table owner must run ALTER COLUMN ssn SET MASK to opt the new table in to the policy","Row filter and column mask policies can only be attached to individual tables, not to schemas"],a:1,
 ex:`A policy applies to new tables in its scope as long as the tags match its conditions, and column tags are not inherited from the table, so the column itself must carry the governed tag pii = ssn. Recreating the policy or running SET MASK is unnecessary, and row filter and column mask policies can be attached at the catalog, schema or table level.`}
];
