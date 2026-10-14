export const items=[
/* src: https://learn.microsoft.com/en-us/sql/relational-databases/security/encryption/always-encrypted-database-engine */
{s:0,d:2,t:"single",ref:"Always Encrypted deterministic equality search keys never reach server",
 stem:`A column named NationalId in Azure SQL Database must be encrypted so that database administrators can't read the plaintext, and the application must still be able to look up a row with WHERE NationalId = @id. Which approach should you use?`,
 opts:["Transparent data encryption with a customer-managed key","Always Encrypted with deterministic encryption","Always Encrypted with randomized encryption","Dynamic Data Masking with the default() function"],a:1,
 ex:`Always Encrypted encrypts and decrypts in the client driver, so the server never holds the keys, and deterministic encryption produces the same ciphertext for the same value, which allows equality comparisons. Randomized encryption is stronger but can't be used in equality predicates without enclaves. TDE protects files at rest, and masking only changes what a query returns.`},

/* src: https://learn.microsoft.com/en-us/sql/t-sql/data-types/vector-data-type */
{s:0,d:2,t:"single",ref:"Always Encrypted vector type not supported",
 stem:`A table has a vector column that stores embeddings of confidential documents. A compliance officer asks you to protect the column with Always Encrypted. What should you tell them?`,
 opts:["Use deterministic encryption so that vector distance can still be computed on the server","Always Encrypted works on vector columns only when a secure enclave is configured","Encrypt the column with a column master key stored in Azure Key Vault","The vector type isn't supported with Always Encrypted"],a:3,
 ex:`The vector data type documentation lists Always Encrypted as unsupported for vector columns. A key store choice or an enclave doesn't change that, and encrypted ciphertext can't be used in distance computation on the server anyway.`},

/* src: https://learn.microsoft.com/en-us/sql/relational-databases/security/dynamic-data-masking */
{s:0,d:2,t:"single",ref:"Dynamic Data Masking UNMASK permission email function",
 stem:`Support agents query dbo.Customer and must see email addresses as aXXX@XXXX.com, while the fraud team must see full values. You must not change the application. Which solution meets the requirements?`,
 opts:["Encrypt Email with Always Encrypted, and give the agents no access to the column master key","Mask Email with the email() function, and grant UNMASK only to the fraud team","Create a row-level security policy that blocks the agents from reading customer rows","Revoke SELECT on the Email column from the support agents, and keep it for the fraud team"],a:1,
 ex:`Dynamic Data Masking applies a mask such as email() at query time to principals that lack the UNMASK permission, and granting UNMASK to the fraud team lets them see real values. Always Encrypted would need application changes, row-level security hides whole rows, and revoking SELECT would make the agents' existing queries fail.`},

/* src: https://learn.microsoft.com/en-us/sql/relational-databases/security/row-level-security */
{s:0,d:2,t:"single",ref:"row-level security security policy filter predicate SESSION_CONTEXT",
 stem:`An application connects to Azure SQL Database through one shared login for all tenants and stores the tenant ID with SESSION_CONTEXT at connection start. Every query on dbo.Invoices must automatically return only rows for that tenant. What should you create?`,
 opts:["A view that filters on SUSER_SNAME(), with the application querying the view only","A Dynamic Data Masking rule on the TenantId column, granted per tenant","A trigger that deletes the other tenants' rows from the result after each SELECT","A security policy whose filter predicate compares TenantId to SESSION_CONTEXT(N'TenantId')"],a:3,
 ex:`Row-level security uses an inline table-valued predicate function bound to a table by a security policy, and the function can read SESSION_CONTEXT, which suits applications that share one login. A view on SUSER_SNAME() would see the same login for every tenant. Masking doesn't remove rows, and a trigger can't run on SELECT.`},

/* src: https://learn.microsoft.com/en-us/sql/relational-databases/security/row-level-security */
{s:0,d:2,t:"single",ref:"row-level security BLOCK predicate AFTER INSERT prevent write",
 stem:`A security policy on dbo.Orders already has a FILTER predicate that limits reads to the user's region. Users can still insert rows that belong to other regions. You need to stop that. What should you add?`,
 opts:["A BLOCK predicate for AFTER INSERT","A second FILTER predicate on the same table","A masking rule on the Region column","A DENY SELECT on the Region column"],a:0,
 ex:`Filter predicates silently remove rows from reads but don't stop writes. BLOCK predicates, such as AFTER INSERT, prevent writes that would violate the predicate. A second filter would again only affect reads, and masking or column-level DENY doesn't govern which rows may be written.`},

/* src: https://learn.microsoft.com/en-us/sql/relational-databases/security/authentication-access/permissions-database-engine */
{s:0,d:2,t:"single",ref:"object-level permissions GRANT EXECUTE schema least privilege",
 stem:`An application role must run every stored procedure in the Sales schema, including procedures that are added later, but must not read or change the tables directly. What should you do?`,
 opts:["Add the role to the db_datareader and db_datawriter fixed database roles","Make the role the owner of the Sales schema, so it controls everything in it","Grant EXECUTE on the Sales schema to the role","Grant SELECT, INSERT, UPDATE and DELETE on each Sales table to the role"],a:2,
 ex:`A GRANT EXECUTE on the schema covers current and future procedures in it and keeps table access closed, because ownership chaining lets the procedures reach the tables when the owners match. Fixed roles and table grants give direct table access, and schema ownership gives far more control than needed.`},

/* src: https://learn.microsoft.com/en-us/azure/azure-sql/database/authentication-aad-overview */
{s:0,d:2,t:"single",ref:"passwordless access managed identity Microsoft Entra authentication Azure SQL",
 stem:`A web app on Azure App Service connects to Azure SQL Database with a connection string that contains a SQL login and password. You need to remove the stored password. What should you do?`,
 opts:["Encrypt the password with a column-level key and keep the ciphertext in the app settings","Enable a managed identity on the app, add a database user for it, and use Entra authentication","Create a second SQL login with a much longer password, and rotate that password every month","Store the password in a DATABASE SCOPED CREDENTIAL and have the app reference it by name"],a:1,
 ex:`A managed identity lets the app obtain Microsoft Entra tokens without any secret, and the database user created FROM EXTERNAL PROVIDER receives the permissions. Encrypting or rotating a password still leaves a password to manage, and a database scoped credential is used by the database to call outward, not by an app to sign in.`},

/* src: https://learn.microsoft.com/en-us/azure/azure-sql/database/auditing-overview */
{s:0,d:2,t:"single",ref:"auditing Azure SQL Database destinations Log Analytics storage",
 stem:`You need to record which principals ran which statements against an Azure SQL Database, and to query the audit records with Kusto queries in Azure Monitor. Which destination should you configure for the auditing?`,
 opts:["A Log Analytics workspace","The database's own sys.fn_get_audit_file view","The SQL Server error log on the logical server","A local .sqlaudit file on the primary replica"],a:0,
 ex:`Azure SQL auditing can write to an Azure Storage account, a Log Analytics workspace or Event Hubs, and Log Analytics is queried with Kusto queries in Azure Monitor. Local files and an error log on the logical server aren't audit destinations for Azure SQL Database.`},

/* src: https://learn.microsoft.com/en-us/sql/t-sql/statements/create-external-model-transact-sql */
{s:0,d:2,t:"single",ref:"secure model endpoint managed identity database scoped credential Azure OpenAI",
 stem:`You create an external model that calls an Azure OpenAI deployment from Azure SQL Database. Security policy forbids API keys in the database. Which credential should the external model use?`,
 opts:["A database scoped credential with IDENTITY = 'HTTPEndpointHeaders' whose secret holds the api-key","A database scoped credential with IDENTITY = 'HTTPEndpointQueryString' whose secret holds the key","A database scoped credential with IDENTITY = 'Managed Identity' for the Cognitive Services resource","A SQL login that is a member of sysadmin, used by the model when it calls the endpoint"],a:2,
 ex:`A database scoped credential with the Managed Identity identity has the database use its managed identity to get a token for the Cognitive Services resource, so no key is stored, and the identity needs an Azure role such as Cognitive Services OpenAI User on the Azure OpenAI resource. The other credential types carry the key in headers or the query string.`},

/* src: https://learn.microsoft.com/en-us/azure/data-api-builder/overview */
{s:0,d:2,t:"single",ref:"secure GraphQL REST MCP endpoints Data API builder authentication roles permissions",
 stem:`You expose dbo.Salary through Data API builder as REST, GraphQL and MCP endpoints. Only callers authenticated through Microsoft Entra ID with the HR role may read it. Where do you enforce this?`,
 opts:["In the firewall rules that protect the SQL Server and the container host","In the dbo.Salary table, by using a CHECK constraint on the caller's name","In the entity's permissions in the DAB configuration, with an Entra ID provider","In the OpenAPI document that DAB generates for the REST endpoints"],a:2,
 ex:`DAB defines which roles can perform which actions on each entity in its configuration, and the authentication provider, such as Microsoft Entra ID, supplies the caller's role claims. The same entity model serves REST, GraphQL and MCP. Firewall rules don't know about caller roles, and a CHECK constraint or OpenAPI document doesn't control access.`},

/* src: https://learn.microsoft.com/en-us/sql/t-sql/statements/set-transaction-isolation-level-transact-sql */
{s:0,d:2,t:"single",ref:"read committed snapshot isolation readers block writers",
 stem:`An OLTP database suffers from readers that block writers and writers that block readers under the default READ COMMITTED isolation level in SQL Server. You need readers to see committed data without taking shared locks, and you want no application changes. What should you do?`,
 opts:["Set the isolation level to SERIALIZABLE on every connection","Add NOLOCK hints to every query in the application","Enable READ_COMMITTED_SNAPSHOT on the database","Set the isolation level to READ UNCOMMITTED for the database"],a:2,
 ex:`With READ_COMMITTED_SNAPSHOT on, the default READ COMMITTED level uses row versioning, so readers see the last committed version without shared locks and need no code changes. SERIALIZABLE increases blocking, while NOLOCK and READ UNCOMMITTED allow dirty reads and so don't guarantee committed data.`},

/* src: https://learn.microsoft.com/en-us/sql/t-sql/statements/set-transaction-isolation-level-transact-sql */
{s:0,d:2,t:"single",ref:"snapshot isolation update conflict phantom serializable",
 stem:`A booking procedure reads the number of free seats and then inserts a booking. Two sessions run it at the same time and both book the last seat. You must guarantee that no concurrent session inserts a row that matches the range the first session read. Which isolation level should you use?`,
 opts:["READ COMMITTED","SNAPSHOT","READ UNCOMMITTED","SERIALIZABLE"],a:3,
 ex:`SERIALIZABLE takes range locks so that other sessions can't insert rows that would match the range already read, which prevents phantoms. READ COMMITTED allows non-repeatable reads and phantoms, and READ UNCOMMITTED is weaker still. SNAPSHOT gives a consistent view but doesn't block a concurrent insert into the range.`},

/* src: https://learn.microsoft.com/en-us/sql/relational-databases/performance/deadlocks-guide */
{s:0,d:2,t:"single",ref:"deadlock prevention access objects same order",
 stem:`Two stored procedures update dbo.Account and dbo.Ledger inside transactions, but one updates Account first and the other updates Ledger first. Deadlocks occur several times a day. What is the most effective change to the code?`,
 opts:["Raise the transaction isolation level to SERIALIZABLE in both procedures","Have both procedures access the tables in the same order","Add a WAITFOR DELAY before the second update","Increase the max server memory setting"],a:1,
 ex:`A classic cause of deadlocks is two transactions that take locks on the same resources in opposite order, so making every code path access objects in the same order removes the cycle. Stricter isolation holds more locks, a delay only changes timing, and memory settings don't change lock ordering.`},

/* src: https://learn.microsoft.com/en-us/sql/relational-databases/performance/monitoring-performance-by-using-the-query-store */
{s:0,d:2,t:"single",ref:"Query Store plan regression force plan",
 stem:`After a statistics update, a stored procedure becomes ten times slower. Query Store shows that two plans exist for the main query and the older plan is faster. You need to restore the old behavior without changing code. What should you do?`,
 opts:["Clear the procedure cache on the instance","Drop and recreate the stored procedure with WITH RECOMPILE","Force the older plan for the query in Query Store","Disable Query Store so the optimizer picks a new plan"],a:2,
 ex:`Query Store keeps plans and runtime statistics per query, and forcing a plan makes the optimizer use that plan for the query, so a regression can be fixed without code changes. Clearing the cache or recompiling just compiles again and may pick the slow plan, and disabling Query Store removes the evidence.`},

/* src: https://learn.microsoft.com/en-us/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-requests-transact-sql */
{s:0,d:2,t:"single",ref:"blocking DMV sys.dm_exec_requests blocking_session_id",
 stem:`Users report that a report query hangs. You need to identify which session is blocking it by querying a dynamic management view. Which column tells you the blocking session?`,
 opts:["The wait_resource column in sys.dm_exec_query_stats","The blocking_session_id column in sys.dm_exec_requests","The plan_handle column in sys.dm_exec_cached_plans","The total_elapsed_time column in sys.dm_exec_sessions"],a:1,
 ex:`sys.dm_exec_requests has a row for each running request, and blocking_session_id gives the session that holds the lock the request waits for, or 0 when the request isn't blocked. The other columns describe cached plan statistics, plan handles or elapsed time, not the blocker.`},

/* src: https://learn.microsoft.com/en-us/azure/azure-sql/database/query-performance-insight-use */
{s:0,d:2,t:"single",ref:"Query Performance Insight Azure SQL Database top resource-consuming queries",
 stem:`You need a portal view for an Azure SQL Database that lists the queries that consume the most CPU over the past day, with no scripts. Which tool should you use?`,
 opts:["Query Performance Insight","The graphical execution plan of a single query","The Azure Advisor cost recommendations","The Azure SQL Database firewall page"],a:0,
 ex:`Query Performance Insight shows top resource-consuming and long-running queries for a database from the Azure portal, and it relies on Query Store data. An execution plan shows one query, Advisor cost recommendations are about spend, and the firewall page only manages network access.`},

/* src: https://learn.microsoft.com/en-us/sql/tools/sql-database-projects/sql-database-projects */
{s:0,d:2,t:"single",ref:"SQL database project dacpac SqlPackage publish SDK-style Microsoft.Build.Sql",
 stem:`You manage a schema in a Microsoft.Build.Sql SDK-style SQL database project. A pipeline must validate object references and then update an existing database so that it matches the project. Which sequence should the pipeline run?`,
 opts:["dotnet build to produce a .dacpac, then SqlPackage publish against the database","Run every .sql file alphabetically with sqlcmd against the database","dotnet publish to a folder, then copy the files to the database server","dotnet build, then SqlPackage extract to overwrite the project"],a:0,
 ex:`Building the project validates references and syntax against the target platform and produces a .dacpac, and SqlPackage publish compares the .dacpac to the target and applies only the needed changes. Running every file in order ignores object dependencies, and extract goes the other way by pulling a schema out of a database.`},

/* src: https://learn.microsoft.com/en-us/sql/t-sql/statements/create-vector-index-transact-sql */
{s:0,d:2,t:"single",ref:"vector index DACPAC deployment limitation 100 rows post-deployment script",
 stem:`A SQL database project contains a table with a vector column and a vector index. A schema-only DACPAC publish to a new database succeeds, but the vector index is missing afterward. What should you do?`,
 opts:["Add a database scoped configuration option that makes DACPAC build indexes asynchronously","Convert the vector column to varbinary(max) so that DACPAC can create an index on it","Load 100 or more rows with non-null vectors, then create the index in a post-deployment script","Republish the DACPAC with the ALLOW_STALE_VECTOR_INDEX option turned on for the session"],a:2,
 ex:`A vector index needs at least 100 rows with non-null vector values, and a schema-only DACPAC deployment can succeed without creating it when the table has fewer rows. DacFx doesn't create it later, so create it after loading data, for instance in a post-deployment script, and verify in sys.vector_indexes. The other options don't exist for this problem.`},

/* src: https://learn.microsoft.com/en-us/sql/tools/sql-database-projects/sql-database-projects */
{s:0,d:2,t:"single",ref:"schema drift detection SQL database project SqlPackage DriftReport",
 stem:`Production changes have been made outside source control. Before the next release you must detect which production objects differ from what the SQL database project last deployed. What should you do?`,
 opts:["Rebuild the project and compare file timestamps","Run SqlPackage with the DriftReport action against the production database","Compare the .dacpac size with the previous build","Disable ad hoc DDL with a server-level trigger and wait"],a:1,
 ex:`SqlPackage can produce a drift report that compares the database's current schema with the deployed .dacpac registration and lists the changes made outside the project. File timestamps or sizes say nothing about the live database, and a DDL trigger only blocks future changes.`},

/* src: https://learn.microsoft.com/en-us/sql/tools/sql-database-projects/sql-database-projects */
{s:0,d:2,t:"single",ref:"CI/CD secrets management pipeline connection string GitHub secrets",
 stem:`A GitHub Actions workflow publishes a database project to Azure SQL Database. The target server's connection details must never appear in the repository or the workflow log. What should you do?`,
 opts:["Commit the connection string in a .env file, and add that file to .gitignore afterwards","Store the connection string in the .sqlproj file as a property that the build reads","Use encrypted secrets in the workflow, or federated identity so that no secret exists","Print the connection string in a workflow step so that reviewers can verify the target"],a:2,
 ex:`Credentials belong in GitHub encrypted secrets, which are masked in logs, or better in an identity-based login such as OpenID Connect federation with Microsoft Entra that avoids a stored password. Committing the value, even if the file is ignored later, leaves it in history, and a .sqlproj file is source-controlled.`},

/* src: https://learn.microsoft.com/en-us/azure/data-api-builder/overview */
{s:0,d:2,t:"single",ref:"Data API builder configuration entity stored procedure expose GraphQL REST caching",
 stem:`You must expose the table dbo.Product and the stored procedure dbo.GetTopSellers to client apps as REST and GraphQL endpoints without writing API code. Which solution should you use?`,
 opts:["Data API builder, with a configuration that defines an entity for each object","An Azure Function that contains a hand-written controller for each of the objects","A SQL Agent job that writes the results as JSON files to Blob Storage on a schedule","Linked servers with distributed queries that the client applications run directly"],a:0,
 ex:`Data API builder is a configuration-driven engine that exposes tables, views and stored procedures as REST and GraphQL (and MCP) endpoints from one JSON file, with permissions and relationships defined per entity. Writing controllers is the code DAB is meant to replace, and the other options don't expose APIs.`},

/* src: https://learn.microsoft.com/en-us/sql/relational-databases/track-changes/about-change-data-capture-sql-server */
{s:0,d:2,t:"single",ref:"change data capture versus Change Tracking intermediate changes history",
 stem:`A downstream ETL process must see every intermediate value of each row that was changed between two loads, including the before and after images of updates. Which feature should you enable on the source tables?`,
 opts:["Change Tracking","Temporal tables with a history retention of zero","Change data capture","A clustered columnstore index"],a:2,
 ex:`Change data capture reads the transaction log and records inserts, updates and deletes, with before and after images of updated rows, in change tables. Change Tracking only records that a row changed and its key, and the current values are read from the table, so intermediate versions are lost.`},

/* src: https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-azure-sql-trigger */
{s:0,d:2,t:"single",ref:"Azure Functions SQL trigger binding Change Tracking",
 stem:`You need an Azure Function to run every time rows are inserted or updated in an Azure SQL Database table, without writing polling code. Which feature should you use, and what must be enabled on the table?`,
 opts:["The SQL trigger binding, with Change Tracking enabled on the database and the table","The SQL output binding, with change data capture enabled on the table","A timer trigger that runs SELECT COUNT(*) every minute","An HTTP trigger, with a DML trigger on the table that calls the function"],a:0,
 ex:`The Azure SQL trigger binding for Azure Functions monitors a table for changes and uses SQL Change Tracking, so Change Tracking must be enabled on the database and on the table, which must have a primary key. The output binding writes rows rather than reacting to changes, and a timer trigger is polling code.`},

/* src: https://learn.microsoft.com/en-us/azure/azure-sql/database/monitoring-sql-database-azure-monitor */
{s:0,d:2,t:"single",ref:"Azure Monitor Log Analytics Application Insights recommend configuration",
 stem:`A team wants end-to-end request traces from its API through to the Azure SQL calls it makes, plus a place to run Kusto queries over database metrics and logs. Which pair of Azure Monitor components should you recommend?`,
 opts:["Azure Advisor for recommendations and Azure Service Health for platform incidents","Application Insights for the API, and a Log Analytics workspace for the database","Azure Policy for governance rules and Microsoft Defender for Cloud for security posture","Azure Backup for retention, with a Recovery Services vault to hold the restore points"],a:1,
 ex:`Application Insights provides application performance monitoring and distributed tracing, and a Log Analytics workspace is the store queried with Kusto for database diagnostics sent from Azure SQL. Advisor, Policy, Defender and Backup serve other needs and don't give request traces or log queries.`},
];
