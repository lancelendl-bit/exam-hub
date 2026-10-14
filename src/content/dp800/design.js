export const items=[
/* src: https://learn.microsoft.com/en-us/sql/t-sql/data-types/vector-data-type */
{s:0,d:1,t:"single",ref:"vector data type float16 dimensions limit",
 stem:`You are designing a table in Azure SQL Database that stores embeddings produced by a model that returns 3,072 dimensions per vector. You need to store each embedding in a column of the vector data type. Which column definition should you use?`,
 opts:["VECTOR(3072) with the default float32 base type","VECTOR(3072, float16)","VARBINARY(MAX) with a computed column that converts it to VECTOR","Two VECTOR(1536) columns that are concatenated at query time"],a:1,
 ex:`The vector type holds up to 1,998 dimensions with the default float32 base type and up to 3,996 dimensions with float16, so only a half-precision column fits 3,072 dimensions. The float32 definition exceeds its limit, and vectors don't support concatenation or other arithmetic operators, so splitting one embedding across two columns can't be searched as one vector.`},

/* src: https://learn.microsoft.com/en-us/sql/t-sql/data-types/vector-data-type */
{s:0,d:1,t:"single",ref:"vector column constraints DEFAULT CHECK not supported",
 stem:`You have a table named dbo.Docs with a column named Embedding that has the data type VECTOR(1536). You need to prevent rows from being inserted without an embedding. Which change should you make?`,
 opts:["Add a CHECK constraint that tests that the vector has 1536 elements","Add a DEFAULT constraint that supplies a vector of zeros","Create a UNIQUE constraint on Embedding so that every row has a distinct vector","Alter Embedding to NOT NULL"],a:3,
 ex:`The only column-level constraints a vector column supports are NULL and NOT NULL. DEFAULT, CHECK, PRIMARY KEY, FOREIGN KEY and UNIQUE constraints aren't supported on vector columns, and the dimension count is already enforced by the type definition.`},

/* src: https://learn.microsoft.com/en-us/sql/t-sql/statements/create-json-index-transact-sql */
{s:0,d:1,t:"single",ref:"CREATE JSON INDEX json data type JSON_VALUE",
 stem:`A table named dbo.Orders has a clustered primary key and a column named Info that uses the json data type. Queries filter with JSON_VALUE(Info, '$.Customer.Type') = 'IN' and scan the whole table. You need to speed these queries up without adding columns to the table. What should you do?`,
 opts:["Create a clustered columnstore index on the Info column","Create a vector index on the Info column","Create a full-text index and rewrite the filter with CONTAINS","Create a JSON index on the Info column"],a:3,
 ex:`CREATE JSON INDEX works on a json column and the optimizer can use it for predicates built on JSON_VALUE, JSON_PATH_EXISTS and JSON_CONTAINS. The table needs a clustered key, which it has. A vector index works only on vector columns, and a columnstore index can't be built over a json column to serve path lookups.`},

/* src: https://learn.microsoft.com/en-us/sql/t-sql/statements/create-json-index-transact-sql */
{s:0,d:1,t:"single",ref:"JSON index FOR paths overlap",
 stem:`You are creating a JSON index on a json column named Doc. The index must cover only the Customer and Order objects of each document. Which statement should you run?`,
 opts:["CREATE JSON INDEX ix ON dbo.T (Doc) FOR ('$.Customer', '$.Customer.Name', '$.Order')","CREATE JSON INDEX ix ON dbo.T (Doc) FOR ('$.Customer', '$.Order')","CREATE JSON INDEX ix ON dbo.T (Doc) FOR ('$.Customer.*', '$.Order.*') WITH (ONLINE = ON)","CREATE JSON INDEX ix ON dbo.T (Doc, Id) FOR ('$.Customer', '$.Order')"],a:1,
 ex:`A JSON index takes one json column and a list of SQL/JSON paths, and each path indexes everything beneath it. Paths can't overlap, so listing $.Customer together with $.Customer.Name fails. JSON indexes can only be created offline, so ONLINE = ON raises an error, and the index covers one json column, not a column list.`},

/* src: https://learn.microsoft.com/en-us/sql/t-sql/statements/create-json-index-transact-sql */
{s:0,d:1,t:"single",ref:"JSON_VALUE RETURNING int range search json index",
 stem:`A query must return orders where the numeric customer ID stored at $.Customer.ID in a json column is between 16000 and 16500. The query should be eligible to use the JSON index on the column. How should you write the predicate?`,
 opts:["WHERE JSON_VALUE(Info, '$.Customer.ID' RETURNING INT) BETWEEN 16000 AND 16500","WHERE JSON_QUERY(Info, '$.Customer.ID') BETWEEN 16000 AND 16500 with an integer cast","WHERE JSON_VALUE(Info, '$.Customer.ID') LIKE '16%' on the string result","WHERE ISJSON(Info) = 1 AND Info LIKE '%\"ID\":16%'"],a:0,
 ex:`JSON_VALUE with RETURNING INT converts the scalar to a number so a range predicate compares numerically, and equality and range predicates on JSON_VALUE are the shapes a JSON index supports. LIKE on JSON_VALUE isn't a supported index predicate, JSON_QUERY returns objects or arrays rather than scalars, and a LIKE over the raw text can't use the index.`},

/* src: https://learn.microsoft.com/en-us/sql/t-sql/functions/regular-expressions-functions-transact-sql */
{s:0,d:1,t:"single",ref:"REGEXP_SPLIT_TO_TABLE split string into rows pattern",
 stem:`A column named Tags contains values such as 'sql; ai ,vector;json'. Delimiters vary between a semicolon and a comma, with optional spaces around them. You need one row per tag. Which T-SQL feature should you use?`,
 opts:["REGEXP_REPLACE to turn every delimiter into a comma, then LIKE to test each tag","REGEXP_SUBSTR with an occurrence number of 1 to return the first tag","STRING_SPLIT with a single-character delimiter","REGEXP_SPLIT_TO_TABLE with a pattern that matches either delimiter"],a:3,
 ex:`REGEXP_SPLIT_TO_TABLE is a table-valued function that splits a string on a regular expression and returns one row per piece, so one pattern can cover both delimiters and the spaces. REGEXP_SUBSTR returns a single match, and STRING_SPLIT accepts one fixed delimiter, so it can't handle a mix without preprocessing.`},

/* src: https://learn.microsoft.com/en-us/sql/t-sql/functions/regular-expressions-functions-transact-sql */
{s:0,d:1,t:"single",ref:"REGEXP_LIKE validate pattern WHERE clause",
 stem:`You need to find rows in dbo.Contacts where the Phone column doesn't match the pattern of three digits, a hyphen and four digits. The filter must use a regular expression in a WHERE clause. Which predicate should you use?`,
 opts:["WHERE REGEXP_COUNT(Phone, '^[0-9]{3}-[0-9]{4}$') = 1","WHERE REGEXP_LIKE(Phone, '^[0-9]{3}-[0-9]{4}$') = 0","WHERE NOT REGEXP_LIKE(Phone, '^[0-9]{3}-[0-9]{4}$')","WHERE REGEXP_INSTR(Phone, '^[0-9]{3}-[0-9]{4}$') = 0"],a:2,
 ex:`REGEXP_LIKE returns a Boolean that says whether the text matches the pattern, so it can be negated directly in a WHERE clause. REGEXP_COUNT returns how many times a pattern occurs, and REGEXP_INSTR returns a position, so those would need extra logic. Comparing REGEXP_LIKE to a number isn't valid because it's a predicate, not an integer.`},

/* src: https://learn.microsoft.com/en-us/sql/t-sql/functions/edit-distance-transact-sql */
{s:0,d:1,t:"single",ref:"EDIT_DISTANCE maximum_distance return value",
 stem:`You run SELECT EDIT_DISTANCE('Chocolate', 'Sweets', 2). The strings are 8 edits apart. What does the function return?`,
 opts:["8, because the true distance is always returned","3, which is the maximum distance plus one","2, because the result is capped at the maximum distance","NULL, because the distance exceeds the maximum"],a:1,
 ex:`When the actual edit distance is greater than the optional maximum_distance, EDIT_DISTANCE returns maximum_distance plus 1, so the result is 3. The cap lets the function stop early. It returns NULL only when an input is NULL, and EDIT_DISTANCE is in preview in SQL Server 2025 at the time of writing.`},

/* src: https://learn.microsoft.com/en-us/sql/t-sql/functions/edit-distance-transact-sql */
{s:0,d:1,t:"multi",n:2,ref:"EDIT_DISTANCE fuzzy matching Damerau-Levenshtein",
 stem:`You plan to use EDIT_DISTANCE to detect near-duplicate customer names. Which two statements about the function are true? Each correct answer presents part of the solution.`,
 opts:["It implements the Damerau-Levenshtein (optimal string alignment) algorithm","It returns a bit value that says whether the two strings are equal after case folding is applied","It counts the edits needed to turn one string into the other, including transpositions","It accepts varchar(max) and nvarchar(max) arguments directly, without any conversion","It returns a decimal between 0 and 1 that expresses how similar the two strings are"],a:[0,2],
 ex:`EDIT_DISTANCE returns an int that is the minimum number of insertions, deletions, substitutions and transpositions, computed with the Damerau-Levenshtein optimal string alignment algorithm. It does not accept max types, and the 0-to-1 similarity idea belongs to the separate similarity functions, not to EDIT_DISTANCE.`},

/* src: https://learn.microsoft.com/en-us/sql/relational-databases/graphs/sql-graph-overview */
{s:0,d:1,t:"single",ref:"graph tables AS NODE AS EDGE MATCH friends of friends",
 stem:`You have a graph database in Azure SQL Database with a node table named Person and an edge table named FriendOf. You need to return the people who are friends of the friends of Alice. Which query pattern should you use?`,
 opts:["Join Person to itself twice on a column named FriendId","Use a recursive CTE over a foreign key in Person","Use MATCH(p1-(f1)->p2-(f2)->p3) with p1 filtered to Alice","Use FOR SYSTEM_TIME to walk back through the friendship history"],a:2,
 ex:`SQL graph queries use the MATCH operator in the WHERE clause to pattern-match node and edge tables with the arrow syntax, so two hops are expressed as node-edge-node-edge-node. A self-join or recursive CTE could emulate it on ordinary tables, but they don't use the node and edge tables. FOR SYSTEM_TIME queries temporal history, which is unrelated.`},

/* src: https://learn.microsoft.com/en-us/sql/relational-databases/tables/temporal-tables */
{s:0,d:1,t:"single",ref:"temporal table FOR SYSTEM_TIME AS OF history",
 stem:`A system-versioned temporal table named dbo.Price holds the current price of each product. An analyst needs to see the prices exactly as they were at 09:00 on a past date. Which clause should you add to the query?`,
 opts:["FOR SYSTEM_TIME AS OF '2026-03-01T09:00:00'","FOR JSON PATH, ROOT('as_of'), applied to the query","OPTION (RECOMPILE, USE HINT('ASOF')) with a parameter","AT TIME ZONE '2026-03-01T09:00:00' after the table name"],a:0,
 ex:`FOR SYSTEM_TIME AS OF returns the rows that were valid at the given point in time, reading the current and history tables together. AT TIME ZONE converts a date value between zones and doesn't query history, FOR JSON shapes output, and ASOF isn't a query hint.`},

/* src: https://learn.microsoft.com/en-us/sql/relational-databases/security/ledger/ledger-overview */
{s:0,d:1,t:"single",ref:"ledger tables append-only updatable",
 stem:`A bank stores card authorizations in Azure SQL Database. Rows must never be changed or removed after they are inserted, and auditors must be able to verify that history has not been tampered with. Which table type should you create?`,
 opts:["A system-versioned temporal table","An updatable ledger table","An append-only ledger table","A memory-optimized table with SCHEMA_AND_DATA durability"],a:2,
 ex:`Ledger tables provide cryptographic tamper evidence, and an append-only ledger table only allows INSERT, which blocks UPDATE and DELETE. An updatable ledger table allows changes and records each version in a history table. A temporal table keeps history too, but its rows can still be modified and it doesn't provide tamper evidence.`},

/* src: https://learn.microsoft.com/en-us/sql/relational-databases/in-memory-oltp/introduction-to-memory-optimized-tables */
{s:0,d:1,t:"single",ref:"memory-optimized table SCHEMA_ONLY durability staging",
 stem:`An ingestion service in SQL Server writes millions of short-lived rows into a staging table. The rows can be rebuilt after a restart, so data loss at restart is acceptable, but write latency must be as low as possible. How should you create the table?`,
 opts:["As a memory-optimized table with DURABILITY = SCHEMA_ONLY","As a clustered columnstore table","As a memory-optimized table with DURABILITY = SCHEMA_AND_DATA","As a ledger table with LEDGER = ON"],a:0,
 ex:`A memory-optimized table with DURABILITY = SCHEMA_ONLY keeps the schema across a restart but not the rows, and it avoids logging row changes to disk, which suits transient staging data. SCHEMA_AND_DATA persists the rows and so adds I/O. Columnstore favors analytics scans, and ledger tables add overhead for tamper evidence.`},

/* src: https://learn.microsoft.com/en-us/sql/relational-databases/indexes/columnstore-indexes-overview */
{s:0,d:1,t:"single",ref:"clustered columnstore index large fact table analytics",
 stem:`A 2-billion-row fact table in Azure SQL Database is queried mostly with aggregations over a few columns and is loaded in large batches. You need to reduce storage and speed up the aggregations. Which index should you create on the table?`,
 opts:["A nonclustered B-tree index on every column used in aggregations","A clustered columnstore index","A filtered nonclustered index on the date column","A JSON index on the largest column"],a:1,
 ex:`Clustered columnstore indexes store data by column with high compression and batch-mode processing, which is what large analytic scans and batch loads need. B-tree indexes on many columns add storage and write cost without the compression, and a filtered index only helps a narrow slice of the table.`},

/* src: https://learn.microsoft.com/en-us/sql/relational-databases/sequence-numbers/sequence-numbers */
{s:0,d:1,t:"single",ref:"SEQUENCE shared number generator NEXT VALUE FOR default",
 stem:`Two tables named dbo.OnlineOrders and dbo.StoreOrders must draw order numbers from one shared series so that no number repeats across them. Which design should you use?`,
 opts:["An IDENTITY column on each table, using different seed values and increments for the two tables","A SEQUENCE object with a DEFAULT of NEXT VALUE FOR on each order number column","A DEFAULT constraint on each table that calls MAX(OrderNumber) + 1 across the other table","A computed column on each table that calls NEWID() and converts the result to an integer"],a:1,
 ex:`A SEQUENCE is a schema-bound object that isn't tied to a table, so a DEFAULT of NEXT VALUE FOR in both tables draws from one series. Identity values are tied to one table. MAX + 1 isn't safe under concurrency, and NEWID() produces GUIDs rather than a numeric series.`},

/* src: https://learn.microsoft.com/en-us/sql/relational-databases/partitions/partitioned-tables-and-indexes */
{s:0,d:1,t:"single",ref:"partitioned table SWITCH PARTITION archive sliding window",
 stem:`A partitioned table named dbo.Events has one partition per month. At the start of each month you must move the oldest month to an archive table with the same structure, as quickly as possible and without copying rows. What should you use?`,
 opts:["DELETE with a TOP clause in a loop, committing after each batch of rows","ALTER TABLE ... SWITCH PARTITION to the archive table","INSERT ... SELECT into the archive table, followed by TRUNCATE TABLE on the source","A MERGE statement that moves matched rows into the archive table and deletes the source"],a:1,
 ex:`Switching a partition is a metadata operation that moves a whole partition into a table with an identical structure, so no rows are copied. Insert and delete or MERGE rewrite every row and generate heavy logging.`},

/* src: https://learn.microsoft.com/en-us/sql/relational-databases/user-defined-functions/create-user-defined-functions-database-engine */
{s:0,d:1,t:"single",ref:"inline table-valued function CROSS APPLY parameterized",
 stem:`You need a reusable parameterized query that returns the latest five orders for a customer. Developers must be able to join it to a Customers table with CROSS APPLY, and the optimizer must be able to expand it into the calling query. What should you create?`,
 opts:["A stored procedure that returns a result set","A scalar user-defined function that returns a comma-separated list","An inline table-valued function","A multi-statement table-valued function that fills a table variable"],a:2,
 ex:`An inline table-valued function consists of a single SELECT and is treated like a parameterized view, so the optimizer can expand it into the outer query. A stored procedure can't be joined or applied. A multi-statement function builds a table variable and gets less accurate estimates, and a scalar function returns one value.`},

/* src: https://learn.microsoft.com/en-us/sql/relational-databases/triggers/dml-triggers */
{s:0,d:1,t:"single",ref:"DML trigger deleted table audit old values",
 stem:`You must record the old value of every changed price in an audit table without changing the application. You create an AFTER UPDATE trigger on dbo.Product. Which source should the trigger read to get the values from before the update?`,
 opts:["The inserted table","The sys.dm_tran_locks view","The deleted table","The OUTPUT clause of the original UPDATE statement"],a:2,
 ex:`Inside a DML trigger, the deleted table holds the pre-change row images and the inserted table holds the post-change images. The OUTPUT clause belongs to the statement that the application issues, which can't be changed, and a locks DMV has nothing to do with row values.`},

/* src: https://learn.microsoft.com/en-us/sql/t-sql/language-elements/throw-transact-sql */
{s:0,d:1,t:"single",ref:"TRY CATCH THROW rethrow XACT_STATE rollback",
 stem:`A stored procedure runs several updates inside one transaction. When any statement fails, the procedure must roll back and then return the original error number and message to the caller. Which code should the CATCH block contain?`,
 opts:["IF XACT_STATE() <> 0 ROLLBACK TRANSACTION; THROW;","RETURN ERROR_NUMBER();","SELECT ERROR_MESSAGE(); COMMIT TRANSACTION;","IF @@TRANCOUNT = 0 ROLLBACK TRANSACTION; PRINT ERROR_MESSAGE();"],a:0,
 ex:`The CATCH block should roll back when a transaction is still open and then run THROW with no arguments, which rethrows the original error to the caller. Committing in CATCH would keep partial work, PRINT or SELECT doesn't raise an error, and returning ERROR_NUMBER() hides the failure from callers that check for exceptions.`},

/* src: https://learn.microsoft.com/en-us/sql/t-sql/queries/select-over-clause-transact-sql */
{s:0,d:1,t:"single",ref:"CTE ROW_NUMBER window function remove duplicates latest row",
 stem:`dbo.Readings contains several rows per SensorId. You must delete everything except the most recent row for each sensor, which is the row with the greatest ReadAt. Which approach should you use?`,
 opts:["A SELECT DISTINCT over SensorId and ReadAt, written as a derived table that the DELETE joins to","A GROUP BY on SensorId with HAVING MAX(ReadAt) = ReadAt, which would keep one row per group","A CTE with ROW_NUMBER() OVER (PARTITION BY SensorId ORDER BY ReadAt DESC), deleting rows numbered above 1","A correlated subquery that selects TOP 1 SensorId from the same table for each outer row"],a:2,
 ex:`A CTE that numbers rows per sensor from newest to oldest lets you delete through the CTE where the row number is above 1, keeping the latest row. DISTINCT over those columns removes nothing when ReadAt differs, HAVING can't reference a non-grouped column that way, and a TOP 1 subquery can't pick one row per sensor.`},

/* src: https://learn.microsoft.com/en-us/sql/t-sql/queries/from-transact-sql */
{s:0,d:1,t:"single",ref:"correlated subquery CROSS APPLY top N per group",
 stem:`You need the three most recent orders for every customer in dbo.Customers, returned in a single query. Which construct should you use?`,
 opts:["CROSS APPLY over a correlated SELECT TOP (3) that is ordered by OrderDate DESC","A LEFT JOIN to dbo.Orders with TOP (3) placed in the outer SELECT and an ORDER BY on OrderDate","A UNION ALL of three SELECT TOP (1) statements, each one filtered to a different customer","A GROUP BY on CustomerId that returns MAX(OrderDate) together with a count of the orders"],a:0,
 ex:`CROSS APPLY runs the inner query once per outer row, so a correlated TOP (3) with an ORDER BY returns the top three per customer. TOP in the outer SELECT limits the whole result, not each group, and GROUP BY with MAX returns only one value per customer.`},

/* src: https://docs.github.com/copilot/how-tos/custom-instructions/adding-repository-custom-instructions-for-github-copilot */
{s:0,d:1,t:"single",ref:"GitHub Copilot instruction file repository custom instructions",
 stem:`Your team wants GitHub Copilot to follow the same T-SQL naming and error-handling rules for everyone who works in a repository, without each developer repeating them in every chat. What should you do?`,
 opts:["Paste the rules into the first message of each Copilot chat session that a developer opens","Create a .github/copilot-instructions.md file in the repository that contains the rules","Add the rules as comments at the top of every .sql file, and ask reviewers to check for them","Store the rules in a SQL Server extended property on the database, so tools can read them"],a:1,
 ex:`A repository custom instructions file at .github/copilot-instructions.md is added automatically as context to Copilot requests for that repository, so the rules apply to everyone. Pasting rules per chat or into comments relies on each person, and database extended properties are not read by Copilot.`},

/* src: https://learn.microsoft.com/en-us/sql/relational-databases/system-stored-procedures/sp-invoke-external-rest-endpoint-transact-sql */
{s:0,d:1,t:"single",ref:"AI-assisted tools security impact MCP least privilege",
 stem:`A developer connects an AI coding assistant to a production database through an MCP server by using the developer's own db_owner login. You need to reduce the security impact of an agent that issues unintended statements. What should you do first?`,
 opts:["Give the MCP server a dedicated login with read-only permissions on the needed objects","Keep the db_owner login, but ask the agent to confirm each statement before it runs","Move the connection string into the assistant's instruction file so it is shared by the team","Disable auditing for the MCP session so that the audit logs don't contain sensitive prompts"],a:0,
 ex:`An agent acts with the permissions of the identity it connects with, so the lasting control is least privilege: a dedicated principal with only the access the task needs. A confirmation prompt still leaves db_owner behind it, and putting secrets in an instruction file or turning off auditing makes the exposure worse.`},

/* src: https://learn.microsoft.com/en-us/sql/relational-databases/tables/temporal-tables */
{s:0,d:1,t:"multi",n:2,ref:"temporal table requirements primary key period columns",
 stem:`You are converting an existing table named dbo.Product into a system-versioned temporal table. Which two requirements must the table meet? Each correct answer presents part of the solution.`,
 opts:["It must have a primary key","It must be memory-optimized, because history tables are stored in memory","It must have two datetime2 period columns declared with PERIOD FOR SYSTEM_TIME","It must have a clustered columnstore index, because the history table needs one","It must contain a json column that holds the earlier versions of each row"],a:[0,2],
 ex:`A system-versioned temporal table requires a primary key and a pair of datetime2 columns that define the system-time period, plus a history table. Memory optimization, columnstore and json columns are optional and unrelated to the requirement.`},
];
