export const items=[
/* src: https://docs.databricks.com/aws/en/sql/language-manual/sql-ref-null-semantics */
{s:0,d:3,t:"single",ref:"NULL semantics WHERE filter silver",
 stem:`A data engineer builds a silver table from bronze with this filter to remove cancelled orders:
<div class="code">SELECT * FROM bronze.orders
WHERE status &lt;&gt; 'cancelled'</div>
Some orders that are still being processed have a NULL <b>status</b> and must be kept, but they are missing from the silver table. Which change fixes the filter?`,
 opts:["Add DISTINCT to the SELECT list","WHERE status = NULL OR status <> 'cancelled'","WHERE status IS NULL OR status <> 'cancelled'","Cast status to STRING before comparing it with 'cancelled'"],a:2,
 ex:`A comparison with NULL evaluates to unknown, and WHERE keeps only rows whose condition is true, so rows with a NULL status are filtered out. Adding <b>status IS NULL</b> keeps them. <b>status = NULL</b> is also unknown for every row, so the second option behaves like the original filter.`},

/* src: https://docs.databricks.com/aws/en/pyspark/reference/classes/dataframe/dropDuplicates */
{s:0,d:3,t:"single",ref:"deduplicate keep latest record row_number window",
 stem:`The table <b>bronze.customer_updates</b> holds several rows per <b>customer_id</b>, each with an <b>updated_at</b> timestamp. A data engineer must write a silver table that keeps exactly one row per customer, the one with the latest <b>updated_at</b>. Which approach does this reliably?`,
 opts:["df.dropDuplicates([\"customer_id\"]), which keeps one row per customer","df.orderBy(\"updated_at\", ascending=False).dropDuplicates([\"customer_id\"])","df.distinct(), which removes rows that repeat in every column","Use row_number() per customer_id ordered by updated_at descending and keep row 1"],a:3,
 ex:`dropDuplicates only takes a subset of columns to compare. It has no parameter for choosing which duplicate survives, and the docs do not define it, so an earlier orderBy cannot be relied on. distinct() removes only rows that are identical in every column, so versions of a customer that differ in updated_at all remain.`},

/* src: https://docs.databricks.com/aws/en/pyspark/reference/classes/dataframe/unionByName */
{s:0,d:3,t:"single",ref:"union vs unionByName column order PySpark",
 stem:`Two bronze sources are read into DataFrames with the same column names but a different column order. <b>df_eu</b> has (order_id, region, amount) and <b>df_us</b> has (order_id, amount, region). The rows must be stacked into one silver DataFrame with each value landing in the correct column. Which call should the engineer use?`,
 opts:["df_eu.union(df_us)","df_eu.unionByName(df_us)","df_eu.join(df_us, \"order_id\", \"outer\")","df_eu.crossJoin(df_us)"],a:1,
 ex:`union resolves columns by position, so the US amount values would be paired with the EU region column. unionByName resolves them by name, and with allowMissingColumns=True it also fills columns that exist on only one side with NULL. A join or cross join adds columns side by side instead of stacking rows.`},

/* src: https://docs.databricks.com/aws/en/sql/language-manual/sql-ref-syntax-qry-select-setops */
{s:0,d:3,t:"single",ref:"UNION vs UNION ALL SQL duplicates",
 stem:`A pipeline combines two staging tables with the same schema:
<div class="code">SELECT * FROM stg.sales_store
UNION
SELECT * FROM stg.sales_online</div>
Each row is a separate sale, so identical rows are legitimate. The silver table has fewer rows than the two inputs together. What should the engineer change?`,
 opts:["Replace UNION with UNION DISTINCT","Replace UNION with INTERSECT ALL","Replace UNION with UNION ALL","Add DISTINCT to both SELECT lists"],a:2,
 ex:`UNION without a qualifier is UNION DISTINCT, which removes duplicate rows; UNION ALL preserves them. UNION DISTINCT is the default, so naming it changes nothing. In PySpark, DataFrame.union does not deduplicate; deduplication needs an explicit distinct().`},

/* src: https://docs.databricks.com/aws/en/sql/language-manual/sql-ref-syntax-qry-select-hints */
{s:0,d:3,t:"single",ref:"broadcast join hint small dimension table",
 stem:`A data engineer joins <b>sales</b> (billions of rows) to <b>stores</b> (about 3,000 rows) on <b>store_id</b>. The query plan shows a sort-merge join with a large shuffle of <b>sales</b>. The engineer wants <b>stores</b> to be broadcast to every executor regardless of <b>spark.sql.autoBroadcastJoinThreshold</b>. Which code does this?`,
 opts:["sales.join(F.broadcast(stores), \"store_id\")","sales.join(stores, \"store_id\").repartition(3000)","sales.join(stores, \"store_id\", \"left_anti\")","spark.conf.set(\"spark.sql.shuffle.partitions\", \"3000\")"],a:0,
 ex:`broadcast() marks a DataFrame as small enough for a broadcast join, and the SQL BROADCAST hint likewise broadcasts the hinted side regardless of autoBroadcastJoinThreshold. Changing the shuffle partition count or repartitioning still shuffles sales, and left_anti returns only the sales rows that have no matching store.`},

/* src: https://docs.databricks.com/aws/en/pyspark/reference/classes/dataframe/join */
{s:0,d:3,t:"single",ref:"left join multiple keys PySpark",
 stem:`The DataFrame <b>orders</b> has (order_id, line_no, sku, qty) and <b>shipments</b> has (order_id, line_no, shipped_at). A report must list every order line, with <b>shipped_at</b> NULL for lines that have not shipped. A line is identified by both <b>order_id</b> and <b>line_no</b>. Which join is correct?`,
 opts:["orders.join(shipments, \"order_id\", \"left\")","orders.join(shipments, [\"order_id\", \"line_no\"], \"left\")","orders.join(shipments, [\"order_id\", \"line_no\"], \"inner\")","orders.join(shipments, [\"order_id\", \"line_no\"], \"left_anti\")"],a:1,
 ex:`A list of column names performs an equi-join on all listed columns, and a left join returns every left row, with NULL where nothing matches. Joining on order_id alone pairs each line with every shipment of that order. inner drops unshipped lines, and left_anti returns only lines that have no match, without the shipped_at column.`},

/* src: https://docs.databricks.com/aws/en/pyspark/reference/functions/explode_outer */
{s:0,d:3,t:"single",ref:"explode vs explode_outer null empty array",
 stem:`The bronze table <b>events</b> has a column <b>tags</b> of type array&lt;string&gt;. Some events have an empty or NULL array. The silver table needs one row per tag, but events without tags must still appear, with a NULL <b>tag</b>. Which code meets this?`,
 opts:["df.select(\"event_id\", F.explode(\"tags\").alias(\"tag\"))","df.select(\"event_id\", F.explode(\"tags\").alias(\"tag\")).na.fill(\"unknown\")","df.select(\"event_id\", F.col(\"tags\")[0].alias(\"tag\"))","df.select(\"event_id\", F.explode_outer(\"tags\").alias(\"tag\"))"],a:3,
 ex:`explode produces no row for an empty or NULL array, so those events disappear. explode_outer produces one row with a NULL value instead. Filling NULLs afterwards cannot restore rows that explode already removed, and indexing element 0 returns only the first tag.`},

/* src: https://docs.databricks.com/aws/en/sql/language-manual/sql-ref-ansi-compliance */
{s:0,d:3,t:"single",ref:"try_cast invalid values ANSI mode silver",
 stem:`A job converts the string column <b>reading</b> in <b>bronze.sensor_raw</b> to DOUBLE while writing silver. ANSI mode is enabled and a few values are the text 'ERR'. The job fails with CAST_INVALID_INPUT. The engineer wants the job to complete, with unparseable values becoming NULL. Which expression should be used?`,
 opts:["try_cast(reading AS DOUBLE)","CAST(reading AS DOUBLE)","CAST(reading AS STRING)","CAST(trim(reading) AS DOUBLE)"],a:0,
 ex:`With ANSI mode on, CAST raises an error for an invalid input such as 'ERR'. try_cast is identical to CAST except that it returns NULL instead of raising a runtime error. Trimming whitespace does not make 'ERR' a valid number, so the job would still fail.`},

/* src: https://docs.databricks.com/aws/en/sql/language-manual/functions/split */
{s:0,d:3,t:"single",ref:"split regex delimiter PySpark columns",
 stem:`A column <b>version</b> contains strings such as '3.11.2'. A data engineer must split it on the period character into an array of three parts. Which PySpark expression produces ['3', '11', '2']?`,
 opts:["F.split(\"version\", \".\")","F.split(\"version\", \",\")","F.split(\"version\", r\"\\.\")","F.explode(F.col(\"version\"))"],a:2,
 ex:`The second argument of split is a regular expression, so an unescaped '.' matches any character and every character becomes a delimiter. Escaping it as \\. matches only a literal period. explode works on arrays or maps, not on a string, and a comma does not occur in the value.`},

/* src: https://docs.databricks.com/aws/en/sql/language-manual/functions/approx_count_distinct */
{s:0,d:3,t:"single",ref:"approx_count_distinct relativeSD",
 stem:`A dashboard shows daily unique visitors computed from a bronze clickstream table with billions of rows. COUNT(DISTINCT visitor_id) is too slow, and the business accepts an estimate that is within about 2%. Which expression fits?`,
 opts:["count(DISTINCT visitor_id)","approx_count_distinct(visitor_id, 0.02)","approx_count_distinct(visitor_id) with the default settings","count(visitor_id)"],a:1,
 ex:`approx_count_distinct uses HyperLogLog++ and takes an optional relativeSD argument for the maximum relative standard deviation, so 0.02 targets about 2%. The default accuracy is about 5%, which is looser than required, and count(visitor_id) counts non-NULL rows, not distinct visitors.`},

/* src: https://docs.databricks.com/aws/en/spark/conf */
{s:0,d:3,t:"single",ref:"Spark configuration scope compute vs notebook",
 stem:`A nightly Lakeflow Job runs three notebooks on one classic job compute. The engineer wants <b>spark.sql.shuffle.partitions</b> set to <b>auto</b> for all three notebooks without editing any of them. What should they do?`,
 opts:["Call spark.conf.set in the first notebook, because the setting carries over to the other notebooks","Run SET spark.sql.shuffle.partitions = auto in a SQL cell of the last notebook","Increase spark.executor.memory in the compute configuration","Add the property to the Spark config in the compute's advanced settings"],a:3,
 ex:`A property set with spark.conf.set or SET applies only to the SparkSession of that notebook, while properties set at the compute level apply to all notebooks and jobs on that compute. spark.executor.memory sizes executors and does not change how shuffle partitions are chosen.`},

/* src: https://docs.databricks.com/aws/en/optimizations/aqe */
{s:0,d:3,t:"single",ref:"spark.sql.shuffle.partitions auto optimized shuffle",
 stem:`An aggregation job runs daily on classic compute with the default shuffle partition setting of 200. Input volume varies a lot: 200 partitions are far too many on small days and too few on very large days. Which setting lets Databricks choose the partition count from the query plan and input size?`,
 opts:["Set spark.sql.shuffle.partitions to auto","Set spark.sql.shuffle.partitions to 2000","Raise spark.sql.autoBroadcastJoinThreshold","Raise spark.driver.memory"],a:0,
 ex:`On classic compute the default for spark.sql.shuffle.partitions is 200 (serverless compute already uses auto), and setting it to auto enables auto-optimized shuffle, which chooses the number from the query plan and input data size. A fixed 2000 has the same problem on a different scale, and autoBroadcastJoinThreshold governs when a join side is broadcast, not the number of shuffle partitions.`},

/* src: https://docs.databricks.com/aws/en/ldp/streaming-tables */
{s:0,d:3,t:"single",ref:"create streaming table read_files STREAM",
 stem:`Order files land continuously, append-only, in the Unity Catalog volume /Volumes/main/raw/orders as JSON. From a Databricks SQL warehouse, a data engineer wants a Unity Catalog object that processes each new file once and appends it. Which statement does this?`,
 opts:["CREATE VIEW main.silver.orders AS SELECT * FROM read_files('/Volumes/main/raw/orders', format => 'json')","CREATE TABLE main.silver.orders AS SELECT * FROM read_files('/Volumes/main/raw/orders', format => 'json')","CREATE OR REFRESH STREAMING TABLE main.silver.orders AS SELECT * FROM STREAM read_files('/Volumes/main/raw/orders', format => 'json')","SELECT * FROM STREAM read_files('/Volumes/main/raw/orders', format => 'json')"],a:2,
 ex:`Streaming tables are designed for append-only sources and process each input once, and the source query must be streaming, which in SQL means the STREAM keyword. A view stores no results and re-runs its query when queried, a CTAS table is a one-time snapshot, and a bare streaming query returns rows but does not create a Unity Catalog object.`},

/* src: https://docs.databricks.com/aws/en/views/materialized */
{s:0,d:3,t:"single",ref:"materialized view vs streaming table vs view gold",
 stem:`A gold dataset joins the <b>orders</b> fact table with the <b>customers</b> dimension and aggregates revenue by region. Customers often change region, and the results must reflect the current region after every refresh. BI dashboards query stored results through a SQL warehouse, refreshed on a schedule, so the join is not recomputed for every dashboard query. Which object should the engineer create?`,
 opts:["A streaming table that joins the orders stream to customers","A materialized view defined by the join and aggregation query","A standard view defined by the join and aggregation query","A table created once with CREATE TABLE AS SELECT"],a:1,
 ex:`A materialized view stores the query results in a managed table and refreshes them, and unlike a streaming table it recomputes joins when a dimension table changes. A streaming table processes each row once, so earlier results are not updated. A standard view stores nothing and recomputes at every query, and a one-time CTAS table becomes stale.`},

/* src: https://docs.databricks.com/aws/en/ldp/expectations */
{s:0,d:3,t:"single",ref:"expectations ON VIOLATION DROP ROW Lakeflow Spark Declarative Pipelines",
 stem:`A Lakeflow Spark Declarative Pipelines definition builds a silver dataset:
<div class="code">CREATE OR REFRESH MATERIALIZED VIEW silver_orders (
  CONSTRAINT valid_qty EXPECT (quantity &gt; 0)
) AS SELECT * FROM bronze_orders</div>
Rows with a non-positive quantity are currently written to <b>silver_orders</b>. They must be excluded, the update must keep running, and the number of dropped rows should appear in the pipeline's data quality metrics. What should the engineer do?`,
 opts:["Leave the definition as is, because EXPECT drops violating rows by default","Add ON VIOLATION FAIL UPDATE after the EXPECT clause","Group the rule with expect_all_or_drop in the SQL file","Add ON VIOLATION DROP ROW after the EXPECT clause"],a:3,
 ex:`An expectation with no ON VIOLATION clause only records violations and still writes the invalid records to the target. ON VIOLATION DROP ROW drops them before they are written and counts them in the metrics. FAIL UPDATE stops the update instead of continuing, and expect_all_or_drop is a Python decorator, not SQL syntax.`},

/* src: https://docs.databricks.com/aws/en/tables/constraints */
{s:0,d:3,t:"single",ref:"Delta CHECK constraint enforced vs informational primary key",
 stem:`The Unity Catalog table <b>main.silver.orders</b> is a regular Delta table that several jobs write to, outside any pipeline. Some jobs insert rows with a negative <b>quantity</b>. The team wants such writes to fail. Which approach enforces this?`,
 opts:["ALTER TABLE main.silver.orders ADD CONSTRAINT qty_positive CHECK (quantity > 0)","Define a Lakeflow Spark Declarative Pipelines expectation on the table","Declare a PRIMARY KEY constraint on order_id so that invalid rows are rejected","Create a view that filters on quantity > 0 and ask the jobs to write through it"],a:0,
 ex:`CHECK and NOT NULL constraints are enforced on Delta tables: a write that violates the constraint fails the transaction, and adding the constraint first verifies existing rows. Expectations apply only to streaming tables, materialized views and temporary views. Primary key constraints are informational and not enforced, and a view does not block writes to the table.`}
];
