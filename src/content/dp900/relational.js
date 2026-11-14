// DP-900 skill area 2: Identify considerations for relational data on Azure. SQL statement and database object items cite the study guide (general definitions, not checked against a topic page).
export const items=[
/* src: https://learn.microsoft.com/en-us/office/troubleshoot/access/database-normalization-description */
{s:0,d:2,t:"single",ref:"normalization purpose eliminate redundancy",
 stem:`A designer splits a customer's address out of the Orders, Invoices and Shipping tables into one Customers table. What is the main purpose of normalization like this?`,
 opts:["To eliminate redundant data and inconsistent dependencies so each fact is stored once","To make every query faster by always joining the largest tables together first, which is the goal of every normal form","To convert relational tables into schemaless documents that need no keys","To compress the tables so they use less storage than a columnar file would"],a:0,
 ex:`Normalization organizes tables and relationships to eliminate redundancy and inconsistent dependency: a changed address then needs updating in only one place. It can add tables and joins, so it doesn't promise faster queries.`},

/* src: https://learn.microsoft.com/en-us/office/troubleshoot/access/database-normalization-description */
{s:0,d:2,t:"single",ref:"first normal form repeating groups",
 stem:`An Inventory table has columns VendorCode1 and VendorCode2. A third vendor now has to be supported. Which normalization step addresses this design?`,
 opts:["Add a VendorCode3 column and update the application code to read it","Move vendors to a separate table and link them to inventory by a key","Store all vendor codes in one text column, separated by commas","Delete the second vendor column, since an item should have one vendor"],a:1,
 ex:`First normal form removes repeating groups: place vendor information in its own Vendors table and link it to inventory with a key. Adding columns doesn't scale to a dynamic number of vendors and needs table and program changes.`},

/* src: https://learn.microsoft.com/en-us/office/troubleshoot/access/database-normalization-description */
{s:0,d:2,t:"single",ref:"primary key foreign key relationship",
 stem:`The Orders table has a CustomerID column whose values must match the CustomerID that uniquely identifies each row in the Customers table. What is the Orders.CustomerID column called?`,
 opts:["A primary key, because it identifies each order in the Orders table uniquely","A foreign key, because it refers to the primary key of another table","A clustered view, because it combines both tables into one result","A stored procedure, because it runs when an order is inserted"],a:1,
 ex:`A foreign key is a column that relates a table to the primary key of another table. The primary key of Customers uniquely identifies its rows. Orders.CustomerID is the many-side link back to Customers.`},

/* src: https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/dp-900 */
{s:0,d:2,t:"single",ref:"SQL statement categories DDL DML",
 stem:`Which SQL statement is a data definition language (DDL) statement, because it changes the structure of the database rather than the rows inside it?`,
 opts:["INSERT INTO Customers VALUES (1, 'Ana')","UPDATE Customers SET City = 'Oslo' WHERE ID = 1","SELECT Name, City FROM Customers WHERE City = 'Oslo'","CREATE TABLE Customers (ID int, Name varchar(50))"],a:3,
 ex:`CREATE TABLE defines a database object, which is DDL. INSERT and UPDATE are data manipulation statements that change rows, and SELECT queries them.`},

/* src: https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/dp-900 */
{s:0,d:2,t:"single",ref:"SQL view saved query virtual table",
 stem:`A team wants a named, saved query that returns only current customers and can be queried like a table, without storing a second copy of the data. Which database object fits?`,
 opts:["A view, a virtual table defined by a saved query","An index, which stores a duplicate of the customer rows on disk","A foreign key, which hides rows from people who query the table","A stored procedure, which copies customer rows into another table"],a:0,
 ex:`A view is a virtual table whose contents come from a saved SELECT query, so it stores no separate copy of the data. An index speeds up lookups, and a stored procedure is saved code that runs on request.`},

/* src: https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/dp-900 */
{s:0,d:2,t:"single",ref:"database index speeds up queries",
 stem:`Queries that filter a large Orders table by OrderDate are slow. Which database object can speed up these lookups?`,
 opts:["A view over the Orders table, which stores the filtered rows only","A stored procedure that wraps the query, which always runs it faster","An index on OrderDate, which lets the engine find rows without scanning the table","A foreign key on OrderDate, which sorts the table physically"],a:2,
 ex:`An index lets the database engine locate matching rows without scanning the whole table. A view and a stored procedure package a query but don't change how rows are found.`},

/* src: https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/dp-900 */
{s:0,d:2,t:"single",ref:"stored procedure saved SQL code",
 stem:`A team wants to package several SQL statements as a named routine that applications call with parameters. Which database object is this?`,
 opts:["A view, which returns the results of a saved query as a table","An index, which accelerates the lookup of rows by a column value","A table, which stores rows that the application inserts","A stored procedure, a saved set of SQL statements that can accept parameters"],a:3,
 ex:`A stored procedure is a saved set of SQL statements that is run by name and can take parameters. A view only wraps a SELECT, and an index is a lookup structure.`},

/* src: https://learn.microsoft.com/en-us/azure/azure-sql/azure-sql-iaas-vs-paas-what-is-overview?view=azuresql */
{s:0,d:2,t:"single",ref:"SQL Managed Instance migration near 100% compatibility",
 stem:`A company will migrate an existing on-premises SQL Server application to Azure with minimal changes. It wants a fully managed service with almost 100 percent feature parity with the SQL Server database engine, including instance-scoped features. Which service fits?`,
 opts:["Azure SQL Database single database, which is for new cloud-born applications","SQL Server on Azure VMs, which is managed by the customer at the OS level and has full parity","Azure Cosmos DB for NoSQL, which uses a document model and no SQL Server engine","Azure SQL Managed Instance, a PaaS service with almost all SQL Server instance features"],a:3,
 ex:`SQL Managed Instance is described as best for most migrations to the cloud, with almost 100 percent feature parity with the SQL Server engine and support for instance-scoped features. SQL Server on VMs is also compatible, but it is IaaS and you manage the VM, so it isn't the fully managed choice.`},

/* src: https://learn.microsoft.com/en-us/azure/azure-sql/azure-sql-iaas-vs-paas-what-is-overview?view=azuresql */
{s:0,d:2,t:"single",ref:"SQL Server on Azure VM OS-level access lift and shift",
 stem:`An application requires access to the operating system of the database host and full control over the SQL Server instance. The team is willing to manage the VM. Which option should it choose?`,
 opts:["Azure SQL Database, which hides the operating system from customers","SQL Server on Azure VMs, which gives full control over the engine and the OS","Azure SQL Managed Instance, which gives OS access through remote desktop sessions","Azure Database for MySQL, which is a managed service that has no OS access"],a:1,
 ex:`SQL Server on Azure VMs is IaaS and is best for applications that require OS-level access: you get full administrative control of the instance and OS, and the added responsibility of managing the VM. Azure SQL Database and Managed Instance are PaaS services.`},

/* src: https://learn.microsoft.com/en-us/azure/azure-sql/azure-sql-iaas-vs-paas-what-is-overview?view=azuresql */
{s:0,d:2,t:"single",ref:"Azure SQL Database elastic pool multitenant SaaS variable usage",
 stem:`A SaaS vendor runs one Azure SQL database per tenant. Each database has a different, variable usage pattern, and the vendor wants to share resources to control cost. Which Azure SQL Database option fits?`,
 opts:["Separate SQL Server on Azure VMs, one for each tenant","An elastic pool, which shares a set of resources across many databases","SQL Managed Instance with one database for all tenants","A single database sized for the busiest tenant's peak"],a:1,
 ex:`An elastic pool is a collection of databases with a shared set of resources, a cost-effective choice for managing many databases with variable usage patterns and the multitenant SaaS pattern. Sizing every database for peak wastes resources.`},

/* src: https://learn.microsoft.com/en-us/azure/azure-sql/azure-sql-iaas-vs-paas-what-is-overview?view=azuresql */
{s:0,d:2,t:"multi",n:2,ref:"Azure SQL family PaaS IaaS products",
 stem:`Which two products belong to the Azure SQL family? Each correct answer presents part of the solution.`,
 opts:["Azure SQL Managed Instance","Azure Table storage","SQL Server on Azure Virtual Machines","Azure Cosmos DB for Cassandra","Azure Database for MySQL flexible server"],a:[0,2],
 ex:`The Azure SQL family is Azure SQL Database, Azure SQL Managed Instance and SQL Server on Azure VMs. MySQL flexible server is a separate open-source database service, and Table storage and Cosmos DB are non-relational.`},

/* src: https://learn.microsoft.com/en-us/azure/postgresql/flexible-server/overview */
{s:0,d:2,t:"single",ref:"Azure Database for PostgreSQL community version managed",
 stem:`A team has an application built on the PostgreSQL engine and wants a fully managed Azure service that runs the community version of PostgreSQL, so little refactoring is needed. Which service fits?`,
 opts:["Azure SQL Database, which runs the SQL Server engine rather than PostgreSQL and needs code changes","Azure Cosmos DB for Table, which exposes a key/attribute data model","Azure Database for PostgreSQL, a fully managed service running community PostgreSQL","Azure Files, which mounts a PostgreSQL data directory as a share"],a:2,
 ex:`Azure Database for PostgreSQL is a fully managed service that runs the community version of PostgreSQL, which gives full application compatibility and requires minimal refactoring to migrate. Azure SQL Database uses the SQL Server engine.`},

/* src: https://learn.microsoft.com/en-us/azure/mysql/flexible-server/overview */
{s:0,d:2,t:"single",ref:"Azure Database for MySQL flexible server community edition",
 stem:`Which statement about Azure Database for MySQL flexible server is correct?`,
 opts:["It runs the SQL Server engine and uses T-SQL for every query that the service accepts","It is a fully managed service based on the MySQL Community Edition engine","It stores data in a graph model and is queried with Gremlin","It is an IaaS offer where the customer patches the operating system"],a:1,
 ex:`The service is a fully managed relational database based on the MySQL Community Edition engine, with automated patching of hardware, OS and engine. It isn't SQL Server, graph or IaaS.`},

/* src: https://learn.microsoft.com/en-us/azure/azure-sql/azure-sql-iaas-vs-paas-what-is-overview?view=azuresql */
{s:0,d:2,t:"single",ref:"PaaS versus IaaS administration responsibility backups patching",
 stem:`Compared with SQL Server on an Azure VM, which statement about Azure SQL Database is correct?`,
 opts:["The customer applies operating system patches and takes the backups","Azure applies patches and manages backups, but custom admin tasks are more limited","The customer controls when system updates happen, can pause the service and manages the VM","The service has full parity with every feature in on-premises SQL Server"],a:1,
 ex:`With PaaS options Azure automates patching, backups and recovery, which reduces administration but limits custom administration tasks and scripts. Full control over updates and OS belongs to SQL Server on Azure VMs.`},
];
