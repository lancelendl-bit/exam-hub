export const items=[
/* src: https://learn.microsoft.com/en-us/azure/cosmos-db/vector-search */
{s:0,d:2,t:"single",ref:"Cosmos DB vector index diskANN 1536 dimensions millions of vectors",
 stem:`A Cosmos DB for NoSQL container will hold 2 million embeddings of 1,536 dimensions, and queries must stay fast and cheap in RUs, with a small loss of recall acceptable. Which vector index type should you choose?`,
 opts:["flat, because it is built for the largest data sets and handles up to 4,096 dimensions","quantizedFlat, because it is recommended whenever you search across more than 50,000 vectors","diskANN, which is built for approximate search and fits searches scoped to over 50,000 vectors","No vector index, because the VectorDistance function only works on unindexed vector properties"],a:2,
 ex:`DiskANN is an approximate nearest neighbor index with some of the lowest latency and RU cost, and the docs call it the most performant when a query is scoped to more than 50,000 vectors. A flat index is limited to 505 dimensions, so 1,536 dimensions rules it out, and quantizedFlat is recommended for 50,000 vectors or fewer.`},

/* src: https://learn.microsoft.com/en-us/azure/cosmos-db/vector-search */
{s:0,d:2,t:"single",ref:"Cosmos DB flat index exact search 100% recall 505 dimensions",
 stem:`An application filters by tenant and then searches roughly 3,000 vectors of 384 dimensions. Results must be the exact nearest neighbors, with 100 percent recall. Which vector index type fits?`,
 opts:["diskANN, since it is the only type that can return the most similar vectors with exact results","flat, which performs a brute-force search and guarantees 100 percent recall for up to 505 dimensions","quantizedFlat, since quantization makes brute-force results more accurate than the original vectors are, and cheaper","None, since exact results can only be produced by a separate database that is built for vectors"],a:1,
 ex:`A flat index stores vectors in the regular index and runs a brute-force search, so it is guaranteed to find the most similar vectors, within a limit of 505 dimensions. DiskANN is approximate, and quantizedFlat compresses vectors so its accuracy can be slightly under 100 percent.`},

/* src: https://learn.microsoft.com/en-us/azure/cosmos-db/vector-search */
{s:0,d:2,t:"single",ref:"Cosmos DB VectorDistance ORDER BY TOP N similarity query",
 stem:`You write a vector similarity query for a Cosmos DB for NoSQL container. It must return the ten most similar documents and use as few RUs as possible. Which query is correct?`,
 opts:["SELECT c.title FROM c WHERE VectorDistance(c.contentVector, @q) > 10","SELECT * FROM c ORDER BY c.contentVector, which sorts by the stored embedding values themselves","SELECT TOP 10 c.title FROM c ORDER BY VectorDistance(c.contentVector, @q)","SELECT c.title FROM c ORDER BY VectorDistance(c.contentVector, @q) with the TOP clause left out"],a:2,
 ex:`Use VectorDistance in ORDER BY and always include TOP N. Without TOP N the vector search tries to return many more results, costing more RUs and adding latency. A WHERE comparison does not rank results, and ordering by the raw vector is not a similarity search.`},

/* src: https://learn.microsoft.com/en-us/azure/cosmos-db/vector-search */
{s:0,d:2,t:"single",ref:"Cosmos DB diskANN fewer than 1000 vectors full scan RU charges",
 stem:`A container has a diskANN vector index, but it holds only 400 vectors while the team loads test data. Vector queries cost more RUs than expected. What explains this?`,
 opts:["Indexes of type quantizedFlat and diskANN need at least 1,000 vectors, so with fewer a full scan is used","The diskANN type is limited to 505 dimensions, so with longer vectors the index is skipped by the query","Vector indexing is disabled until you set the consistency level of the account to strong consistency","Vector queries always run as a full scan when the TOP clause asks for fewer than 500 results, whatever the index type"],a:0,
 ex:`quantizedFlat and diskANN indexes require at least 1,000 indexed vectors so that quantization is accurate. With fewer, a full scan is run and RU charges can be higher. The 505-dimension limit belongs to the flat type, and consistency level does not affect vector indexing.`},

/* src: https://learn.microsoft.com/en-us/azure/cosmos-db/index-policy */
{s:0,d:2,t:"single",ref:"Cosmos DB composite index ORDER BY multiple properties",
 stem:`A query uses ORDER BY c.category ASC, c.createdAt DESC on a Cosmos DB for NoSQL container and fails because no index supports it. What should you add to the indexing policy?`,
 opts:["A composite index with category ascending and createdAt descending, in that order","A spatial index on the category property and a range index on the createdAt property","A second composite index with createdAt first and category second, in the same sort order","An excluded path for category, which removes it from the index and speeds up sorting"],a:0,
 ex:`An ORDER BY with two or more properties requires a composite index. The path sequence must match the ORDER BY clause, and the order (ascending or descending) must match too, or the exact opposite on all paths. Reversing the path sequence does not support the query.`},

/* src: https://learn.microsoft.com/en-us/azure/cosmos-db/index-policy */
{s:0,d:2,t:"single",ref:"Cosmos DB composite index equality filter range filter last RU",
 stem:`A frequent query is SELECT * FROM c WHERE c.tenantId = @t AND c.score > 10. It consumes many RUs. Which composite index reduces the cost most?`,
 opts:["tenantId followed by score, with the equality property first and the range property last","score followed by tenantId, with the range property first and the equality property last","A single composite path on tenantId alone, since composite indexes need only one property","An excluded path on score, so that the range filter is evaluated without an index entry"],a:0,
 ex:`For queries with several filters, properties with equality filters must come first in the composite index and the property with a range filter (>, <, <=, >=, !=) must come last. A composite index needs two or more paths, and excluding a path removes its index entries rather than helping a range filter.`},

/* src: https://learn.microsoft.com/en-us/azure/cosmos-db/index-policy */
{s:0,d:2,t:"single",ref:"Cosmos DB replace index add new composite index wait index transformation before removing old",
 stem:`You are replacing a single-property index with a composite index in a busy container and want no query regressions. What is the recommended order of operations?`,
 opts:["Remove the old index first, so the container never pays for two indexes, then add the new one","Add the new index, wait for the index transformation to complete, and then remove the old one","Set the indexing mode to none during the switch, then set it back to consistent afterward","Make both changes in a single update and let the query engine fall back to the best index"],a:1,
 ex:`Removing an index takes effect immediately, while adding one needs an index transformation. The docs say to add the new index first and wait for the transformation to finish before removing the previous one, otherwise queries that relied on it fall back to a full scan. Index transformation also consumes RUs.`},

/* src: https://learn.microsoft.com/en-us/azure/cosmos-db/consistency-levels */
{s:0,d:2,t:"single",ref:"Cosmos DB consistency level RU cost strong bounded staleness reads two replicas",
 stem:`After the default consistency level of a Cosmos DB account changes from session to strong, the RU charge for point reads roughly doubles with no change in the data. Why?`,
 opts:["Strong and bounded staleness reads are served from two replicas, so they cost about twice the RUs of single-replica reads","Strong consistency writes each item twice in every region, which doubles the RU charge for reads as well","Session tokens are no longer cached by the client, so every read is retried against another region","Strong consistency disables the index, so each read becomes a scan that costs more request units"],a:0,
 ex:`For strong and bounded staleness, reads are made against two replicas (a local minority quorum) to guarantee consistency, so read RU cost is twice that of session, consistent prefix and eventual, which use a single replica. Write RU cost for a given operation is the same at every level.`},

/* src: https://learn.microsoft.com/en-us/azure/cosmos-db/consistency-levels */
{s:0,d:2,t:"single",ref:"Cosmos DB session consistency session token share between clients read your writes",
 stem:`A web app runs on several instances behind a load balancer and uses session consistency. A user writes an item on one instance, and a later request served by another instance sometimes does not see the write. What should you do?`,
 opts:["Switch the account to eventual consistency, which orders reads after the user's own writes","Pass the session token from the writing instance to the instance that reads, without modifying it","Create a new CosmosClient for each request, so that every read starts with a fresh session","Enable multi-region writes, since session guarantees apply only across several write regions"],a:1,
 ex:`Session consistency gives read-your-writes within a session, and the client keeps the session token returned after each write. A client that has no token for a partition reads like eventual consistency, so the token has to be shared between instances, and its contents must not be modified. Eventual consistency gives no ordering guarantees.`},

/* src: https://learn.microsoft.com/en-us/azure/cosmos-db/change-feed-processor */
{s:0,d:2,t:"single",ref:"Cosmos DB change feed processor scale out processorName instance name lease container",
 stem:`A change feed processor runs on one compute instance and falls behind. You add more instances to share the work. Which settings must the new instances use?`,
 opts:["A different processor name and a different lease container on each instance, so they avoid conflicts","The same processor name and lease container as the first instance, with a different instance name each","The same instance name as the first instance, so that the leases can be passed on from one to the next","A new monitored container for each instance, with changes copied by hand between the containers"],a:1,
 ex:`Instances in one deployment unit must share the lease container configuration and processor name and each have a unique instance name. The processor then spreads the leases across the instances. A lease is owned by one instance at a time, so instances beyond the number of leases add no throughput.`},

/* src: https://learn.microsoft.com/en-us/azure/cosmos-db/change-feed-processor */
{s:0,d:2,t:"multi",n:2,ref:"Cosmos DB change feed processor at-least-once lease container state",
 stem:`You review the design of a change feed processor in .NET. Which two statements about it are true? Each correct answer presents part of the solution.`,
 opts:["Delivery is at-least-once, so the delegate can see the same batch again after a failure","The lease container stores progress per range and coordinates work among the instances","Delivery is exactly-once, so the delegate never needs to be idempotent in its handling","Progress is saved in the monitored container itself, next to the items that it is reading","On first start, the processor delivers every change that happened before it was created"],a:[0,1],
 ex:`If the delegate throws, the same batch is sent again from the last saved point, which is why the guarantee is at-least-once and handlers should tolerate repeats. The lease container is the state store and coordinator. By default, changes from before the first start are not detected unless you set a start time.`},

/* src: https://learn.microsoft.com/en-us/azure/cosmos-db/best-practice-python */
{s:0,d:2,t:"single",ref:"Cosmos DB Python SDK async client azure.cosmos.aio aiohttp FastAPI",
 stem:`A FastAPI service uses the Azure Cosmos DB for NoSQL Python SDK. Requests are slow under load because blocking calls stall the event loop. Which change follows the SDK best practices?`,
 opts:["Create a new synchronous CosmosClient inside each request handler to avoid sharing state","Use azure.cosmos.aio.CosmosClient, install aiohttp, and manage it with async with or await close()","Keep the synchronous client and wrap each call in a retry loop that sleeps between attempts","Turn off preferred_locations on the client, since regions are what make calls block the loop"],a:1,
 ex:`The sync CosmosClient makes blocking I/O calls and must not be used inside an async event loop. The async client lives in azure.cosmos.aio, needs aiohttp installed explicitly, and has to be closed. A client should also be reused for the lifetime of the app, not created per request.`},

/* src: https://learn.microsoft.com/en-us/azure/postgresql/extensions/how-to-use-pgvector */
{s:0,d:2,t:"single",ref:"Azure Database for PostgreSQL enable pgvector azure.extensions allowlist CREATE EXTENSION vector",
 stem:`You must use vector similarity search on an Azure Database for PostgreSQL flexible server. What are the required steps?`,
 opts:["Install the pgvector package on the server VM, then restart the PostgreSQL service on that VM","Allowlist the extension in azure.extensions, then run CREATE EXTENSION vector in each database","Run CREATE EXTENSION pgvector in the postgres database, which enables it for every database, including future ones","Enable the DiskANN index type on the server, which makes the vector data type available"],a:1,
 ex:`The extension must be added to the azure.extensions allowlist and then created with CREATE EXTENSION in every database that needs it. Although the community calls it pgvector, the binary and the extension are named vector, so the name to allowlist and create is vector, not pgvector.`},

/* src: https://learn.microsoft.com/en-us/azure/postgresql/extensions/how-to-optimize-performance-pgvector */
{s:0,d:2,t:"single",ref:"pgvector HNSW versus IVFFlat index build empty table speed recall",
 stem:`A new table for embeddings is empty, and rows will arrive continuously. You want the best speed-recall trade-off and no training step before the index is created. Which pgvector index type fits?`,
 opts:["IVFFlat, because its k-means clustering gives the best recall and is built before any rows exist","IVFFlat, because it builds faster than HNSW and uses less memory while giving better speed-recall","HNSW, which has better speed-recall and can be created on an empty table with no training step","A B-tree index on the vector column, which is the only index type that an empty table can have"],a:2,
 ex:`HNSW takes longer and more memory to build than IVFFlat but gives a better speed-recall trade-off, and it needs no training step, so it can be created on an empty table. IVFFlat partitions existing data with k-means, so data should be loaded before building it.`},

/* src: https://learn.microsoft.com/en-us/azure/postgresql/extensions/how-to-optimize-performance-pgvector */
{s:0,d:2,t:"single",ref:"pgvector IVFFlat lists probes sizing rows 1000 up to 1 million",
 stem:`A table has 500,000 rows and you create an IVFFlat index. Using the documented starting points for tables of up to 1 million rows, which settings do you choose?`,
 opts:["lists = 500 and probes = 50, from rows / 1000 and lists / 10","lists = 50 and probes = 500, from rows / 10,000 and lists * 10","lists = 707 and probes = 26, from sqrt(rows) and sqrt(lists)","lists = 5,000 and probes = 5,000, so that all lists are searched"],a:0,
 ex:`The docs suggest lists equal to rows / 1000 for tables of up to 1 million rows, and probes starting at lists / 10, giving 500 and 50. The square-root formulas are for larger datasets. Setting probes to the number of lists makes the search exact and the planner then stops using the index.`},

/* src: https://learn.microsoft.com/en-us/azure/postgresql/extensions/how-to-optimize-performance-pgvector */
{s:0,d:2,t:"single",ref:"pgvector index limit 2000 dimensions cannot index 3072",
 stem:`A table stores 3,072-dimension embeddings. CREATE INDEX with hnsw fails with an error that the column cannot have more than 2000 dimensions. What can you do?`,
 opts:["Cast the column to a vector with no dimensions, which removes the limit for HNSW","Raise maintenance_work_mem until the build has enough memory for 3,072 dimensions","Reduce the dimensionality of the embeddings to 2,000 or fewer, or leave them unindexed","Switch to the ivfflat type, because only the hnsw type has a limit on dimensions"],a:2,
 ex:`You can store vectors with more than 2,000 dimensions but cannot index them, and the limit applies to ivfflat and hnsw. The docs suggest dimensionality reduction, or partitioning and sharding instead of an index. A column with no declared dimensions cannot be indexed at all.`},

/* src: https://learn.microsoft.com/en-us/azure/postgresql/extensions/how-to-optimize-performance-pgvector */
{s:0,d:2,t:"single",ref:"pgvector operator class must match query operator cosine <=> vector_cosine_ops",
 stem:`You build an IVFFlat index with vector_cosine_ops, but EXPLAIN shows queries that ORDER BY embedding <-> '[...]' do not use it. What is wrong?`,
 opts:["The <-> operator is the L2 distance, so use <=> in the query or build the index with vector_l2_ops","The lists parameter is too large, so the planner skips every IVFFlat index that has many lists","The query needs ANALYZE in front of it, because indexes are chosen only when it is present","IVFFlat supports only inner product, so the index should use vector_ip_ops and the <#> operator for every search"],a:0,
 ex:`The access method must match the distance operator: vector_cosine_ops goes with <=>, vector_l2_ops with <->, and vector_ip_ops with <#>. A cosine index cannot serve an L2 ordering. IVFFlat supports all three classes, and EXPLAIN is how you check the plan, not a requirement for using an index.`},

/* src: https://learn.microsoft.com/en-us/azure/postgresql/connectivity/concepts-pgbouncer */
{s:0,d:2,t:"single",ref:"Azure PostgreSQL built-in PgBouncer pgbouncer.enabled port 6432 connection pooling",
 stem:`Many short-lived connections from scaled-out containers strain an Azure Database for PostgreSQL flexible server on the General Purpose tier. You want connection pooling without running extra VMs. What should you do?`,
 opts:["Set pgbouncer.enabled to true and point the apps at the same host name on port 6432","Set pgbouncer.enabled to true and keep port 5432, which then goes through PgBouncer instead","Move the server to the Burstable tier, which includes a dedicated pooling node for each client","Deploy PgBouncer on a separate VM, since built-in pooling is not offered on a flexible server"],a:0,
 ex:`The built-in PgBouncer runs on the database server VM, is switched on with the pgbouncer.enabled parameter without a restart, and listens on port 6432. Applications keep the host name and change the port. It is supported on General Purpose and Memory Optimized tiers, not Burstable, and pool mode defaults to transaction.`},

/* src: https://learn.microsoft.com/en-us/azure/redis/redis-modules */
{s:0,d:2,t:"single",ref:"Azure Managed Redis modules RediSearch vector search enable at creation",
 stem:`You created an Azure Managed Redis instance without choosing modules. The team now wants vector similarity search on it. What is the correct course of action?`,
 opts:["Load the RediSearch module manually with the MODULE LOAD command from a client connection","Enable RediSearch on the existing instance from the Advanced tab, which can be edited at any time","Create a new instance with the RediSearch module selected, because modules can only be added at creation","Switch the instance to the Flash Optimized tier, which turns on search for large data sets"],a:2,
 ex:`Modules such as RediSearch must be enabled when the Azure Managed Redis instance is created, and you cannot manually load modules. RediSearch also needs the Enterprise clustering policy and the NoEviction eviction policy. Flash Optimized tiers do not support RediSearch.`},

/* src: https://learn.microsoft.com/en-us/azure/redis/best-practices-memory-management */
{s:0,d:2,t:"single",ref:"Azure Managed Redis eviction policy volatile-lru keys without TTL expiration",
 stem:`An Azure Managed Redis cache uses the default eviction policy and fills up. Application errors continue even though memory pressure exists, because none of the keys are ever evicted. What is the most likely reason?`,
 opts:["The default policy is allkeys-lru, which only evicts keys whose last access is older than a day","The default policy is noeviction, so the cache refuses every write until an operator clears it","The default policy is volatile-lru, and the keys have no TTL, which makes them ineligible for eviction","The cache is in a Flash Optimized tier, which keeps all keys in memory and never evicts any of them for any reason"],a:2,
 ex:`The default for Azure Managed Redis is volatile-lru, so only keys with a TTL, set with a command like EXPIRE, are eligible for eviction. If no key has a TTL, nothing is evicted. The docs advise setting expirations on keys, or using allkeys-lru if any key may be evicted.`},
];
