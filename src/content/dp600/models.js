export const items=[
/* src: https://learn.microsoft.com/en-us/fabric/fundamentals/direct-lake-develop */
{s:0,d:3,t:"single",ref:"Direct Lake on OneLake vs Direct Lake on SQL analytics endpoint choose",
 stem:`Fabrikam Logistics stores Delta tables in a lakehouse and in a warehouse, in the same Fabric workspace. You need one semantic model that reads both items in memory, includes an Import table from an Excel file on SharePoint, applies OneLake security roles to Viewers, and never falls back to DirectQuery. What should you create?`,
 opts:[`A Direct Lake on SQL analytics endpoints model on the lakehouse`,`An Import model that connects to both SQL analytics endpoints`,`A Direct Lake on OneLake model with the Excel table added as an Import table`,`A DirectQuery model on the warehouse with the lakehouse tables set to Dual`],a:2,
 ex:`Direct Lake on OneLake can use one or more Fabric items, supports composite models with Import tables, works with OneLake security, and has no DirectQuery fallback. Direct Lake on SQL analytics endpoints is limited to a single data source, can't be mixed with other storage modes in the same model, and can fall back to DirectQuery.`},

/* src: https://learn.microsoft.com/en-us/fabric/fundamentals/direct-lake-how-it-works */
{s:0,d:3,t:"single",ref:"Direct Lake on SQL analytics endpoint DirectQuery fallback SQL view materialize",
 stem:`Woodgrove Retail has a Direct Lake on SQL analytics endpoints model over a warehouse. The Sales table in the model is based on a SQL view in the warehouse. Visuals that use the table are slow because their queries run in DirectQuery mode. You need every query to be answered from the in-memory cache. What should you do?`,
 opts:[`Materialize the view as a Delta table and point the model table to it`,`Set the Direct Lake behavior property to DirectLakeOnly and refresh the model`,`Turn on Keep your Direct Lake data up to date so the model reframes automatically`,`Scale up the capacity to the next larger F SKU to give the queries more memory`],a:0,
 ex:`A table based on an unmaterialized SQL view always falls back to DirectQuery, so the fix is to land the data in a Delta table and reframe the model. DirectLakeOnly would not remove the cause. It would make queries against the view fail instead of falling back.`},

/* src: https://learn.microsoft.com/en-us/fabric/fundamentals/direct-lake-how-it-works */
{s:0,d:3,t:"single",ref:"Direct Lake framing keep your Direct Lake data up to date automatic updates refresh",
 stem:`A Fabric pipeline loads several Delta tables in a Direct Lake model between 01:00 and 03:00. Analysts who open reports during the load see a mix of old and new data. You need consumers to see new data only after the whole pipeline succeeds. What should you do?`,
 opts:[`Set the Direct Lake behavior property to DirectQueryOnly for the fact tables`,`Configure an incremental refresh policy on the fact tables that keeps one day of data`,`Scale up the capacity during the load window to speed up the pipeline`,`Turn off Keep your Direct Lake data up to date, then refresh the model after the load`],a:3,
 ex:`With automatic updates off, the model keeps its last framing until a refresh reframes it, so a refresh activity after the final load step publishes all changes at once. DirectQueryOnly always reads the latest data, including partial loads, and Direct Lake tables don't support model table partitions, so incremental refresh doesn't apply.`},

/* src: https://learn.microsoft.com/en-us/power-bi/transform-model/desktop-storage-mode */
{s:0,d:3,t:"single",ref:"Power BI Dual storage mode limited relationships composite model dimension tables",
 stem:`In Power BI Desktop, Northwind Trading has a composite model over one Azure SQL database. The Orders fact table (four billion rows) uses DirectQuery. The SurveyResponse table uses Import. The Customer, Date, and Geography tables use DirectQuery and relate one-to-many to both fact tables. The relationships to SurveyResponse are limited. You must reduce limited relationships and keep Orders uncached. What should you do?`,
 opts:[`Set Orders to Dual`,`Set Customer, Date, and Geography to Dual`,`Set Customer, Date, and Geography to Import`,`Set SurveyResponse to DirectQuery`],a:1,
 ex:`Dual dimension tables can behave as Import when they join to the Import table and as DirectQuery when they join to the DirectQuery fact table, so the relationships stay regular. Import dimensions would still form limited relationships with the DirectQuery Orders table, and a Dual Orders table would cache four billion rows.`},

/* src: https://learn.microsoft.com/en-us/power-bi/enterprise/service-premium-large-models */
{s:0,d:3,t:"single",ref:"large semantic model storage format enable Fabric capacity 1 GB limit",
 stem:`Alpine Insurance published an Import semantic model to a workspace on an F128 capacity. The model is 800 MB now and will reach about 15 GB after you load five years of history. You need to ensure that the model can grow beyond the size limit of the small storage format on this capacity. What should you do?`,
 opts:[`Enable the XMLA endpoint with read-write access and republish the model`,`Define an incremental refresh policy and leave the other settings unchanged`,`Move the workspace to Pro license mode and republish the model`,`Turn on Large semantic model storage format and refresh the model`],a:3,
 ex:`The small storage format has a size ceiling (10 GB on an F128 capacity), and semantic models on Fabric capacities can grow beyond it only when the large semantic model storage format is enabled, after which the limit is the capacity size. Incremental refresh reduces refresh work but doesn't raise the size limit, and Pro mode keeps the 1 GB limit.`},

/* src: https://learn.microsoft.com/en-us/dax/index-function-dax */
{s:0,d:3,t:"single",ref:"DAX INDEX function PARTITIONBY ORDERBY window functions",
 stem:`A matrix shows Fiscal Year on rows. The Date table has Fiscal Year and Month Number columns, and the model has a [Total Sales] measure. You need a measure that returns the sales of the last month in each fiscal year shown. Which expression should you use?`,
 opts:[`CALCULATE ( [Total Sales], OFFSET ( -1, ALLSELECTED ( 'Date'[Fiscal Year], 'Date'[Month Number] ), ORDERBY ( 'Date'[Month Number] ), PARTITIONBY ( 'Date'[Fiscal Year] ) ) )`,`CALCULATE ( [Total Sales], INDEX ( -1, ALLSELECTED ( 'Date'[Fiscal Year], 'Date'[Month Number] ), ORDERBY ( 'Date'[Month Number] ), PARTITIONBY ( 'Date'[Fiscal Year] ) ) )`,`CALCULATE ( [Total Sales], INDEX ( -1, ALLSELECTED ( 'Date'[Fiscal Year], 'Date'[Month Number] ), ORDERBY ( 'Date'[Month Number] ) ) )`,`CALCULATE ( [Total Sales], INDEX ( -1, ALLSELECTED ( 'Date'[Fiscal Year], 'Date'[Month Number] ), ORDERBY ( 'Date'[Month Number], DESC ), PARTITIONBY ( 'Date'[Fiscal Year] ) ) )`],a:1,
 ex:`INDEX with position -1 returns the last row of each partition, and PARTITIONBY on Fiscal Year makes the partition follow the year in the current row. Without PARTITIONBY there is one partition, so every year shows the same single last row. With a descending ORDERBY, -1 returns the first month, and OFFSET returns rows relative to the current row rather than an absolute position.`},

/* src: https://learn.microsoft.com/en-us/dax/isinscope-function-dax */
{s:0,d:3,t:"single",ref:"DAX ISINSCOPE variables ALLSELECTED percent of parent matrix",
 stem:`A matrix has Category and Subcategory from the Product table on rows. You need a measure that shows each subcategory's share of its own category and returns BLANK on the category rows and the grand total row. Which measure should you create?`,
 opts:[`VAR SalesNow = [Total Sales] VAR CatSales = CALCULATE ( [Total Sales], ALLSELECTED ( 'Product'[Subcategory] ) ) RETURN IF ( ISINSCOPE ( 'Product'[Subcategory] ), DIVIDE ( SalesNow, CatSales ) )`,`VAR SalesNow = [Total Sales] VAR AllSales = CALCULATE ( [Total Sales], ALLSELECTED ( 'Product' ) ) RETURN IF ( ISINSCOPE ( 'Product'[Subcategory] ), DIVIDE ( SalesNow, AllSales ) )`,`DIVIDE ( [Total Sales], CALCULATE ( [Total Sales], ALLSELECTED ( 'Product'[Subcategory] ) ) )`,`VAR SalesNow = [Total Sales] VAR CatSales = CALCULATE ( [Total Sales], ALLSELECTED ( 'Product'[Subcategory] ) ) RETURN IF ( HASONEVALUE ( 'Product'[Category] ), DIVIDE ( SalesNow, CatSales ) )`],a:0,
 ex:`ISINSCOPE is true only at the Subcategory level, and ALLSELECTED on Subcategory removes the row's subcategory filter while keeping the category filter, so the denominator is the category total. Without ISINSCOPE, or with HASONEVALUE on Category, the category rows return 100 percent instead of BLANK, and ALLSELECTED on the whole Product table divides by the grand total.`},

/* src: https://learn.microsoft.com/en-us/power-bi/guidance/power-bi-optimization */
{s:0,d:3,t:"single",ref:"Power BI optimization guide Top N filter table visual Performance Analyzer",
 stem:`Tailwind Energy has a report on an Import model. Performance Analyzer shows that a table visual listing 120 million meter readings spends most of its load time in the DAX query. Users only read the first few hundred rows and use slicers to find others. You need to cut the load time without changing the capacity. What should you do?`,
 opts:[`Convert the Import tables to DirectQuery and keep the table visual unchanged`,`Enable the large semantic model storage format and refresh the model`,`Apply a Top N filter to the table visual with a generous row limit`,`Add more slicers to the report page and sync them across pages`],a:2,
 ex:`The more rows a visual has to display, the slower it loads, so a Top N filter set above what users need keeps the experience the same while greatly reducing the data and memory the query uses. DirectQuery adds source round trips, and the large storage format raises a size limit that isn't the problem here.`},

/* src: https://learn.microsoft.com/en-us/power-bi/connect-data/incremental-refresh-overview */
{s:0,d:3,t:"multi",n:2,ref:"incremental refresh RangeStart RangeEnd parameters query folding Power BI Desktop",
 stem:`Contoso has an Import model with a 600-million-row fact table loaded from Azure SQL Database. You plan to configure incremental refresh in Power BI Desktop. Which two actions should you perform in Power Query before you define the policy? Each correct answer presents part of the solution.`,
 opts:[`Create two Date/Time parameters named RangeStart and RangeEnd`,`Create two Date parameters named StartDate and EndDate for the date filter`,`Convert the fact table to a calculated table so that partitions can be created`,`Enable the large semantic model storage format and republish the model`,`Filter the date column on RangeStart and RangeEnd so that the filter folds`],a:[0,4],
 ex:`The incremental refresh policy depends on the reserved, case-sensitive Date/Time parameters RangeStart and RangeEnd, and on a filter that references them and folds to the source so that each partition queries only its own date range. Parameters with other names can't drive partitioning, and the large storage format is optional.`},

/* src: https://learn.microsoft.com/en-us/power-bi/guidance/relationships-many-to-many */
{s:0,d:3,t:"multi",n:2,ref:"many-to-many relationship bridging table factless fact table bidirectional",
 stem:`A bank's semantic model has Customer and Account dimension tables, each with a unique ID, and a Transaction fact table related to Account. Joint account holders mean that customers and accounts have a many-to-many association. You need a Customer slicer to filter Transaction amounts, following Microsoft guidance. Which two actions should you perform? Each correct answer presents part of the solution.`,
 opts:[`Add a bridging table of customer-account pairs, related one-to-many to each dimension`,`Relate Customer to Account directly by using a many-to-many relationship that filters in both directions`,`Set the relationship between Account and the bridging table to filter both ways`,`Set both relationships on the bridging table to filter in both directions`,`Add a CustomerID column to Account and repeat the account row for each joint holder`],a:[0,2],
 ex:`A bridging table with a one-to-many relationship from each dimension keeps both dimensions on the one side, and a single bi-directional relationship carries the customer filter through the bridge to Account and on to Transaction. Relating the dimensions directly with many-to-many cardinality is discouraged, and making both relationships bi-directional is more than the guidance calls for.`},

/* src: https://learn.microsoft.com/en-us/dax/window-function-dax */
{s:0,d:3,t:"hot",ref:"DAX WINDOW function running total ABS REL PARTITIONBY",
 stem:`You need a measure that returns the cumulative [Total Sales] by month and restarts at the start of each fiscal year. How should you complete the measure? Select the appropriate option in each list.`,
 tpl:`Cumulative Sales =
SUMX (
    WINDOW (
        [[0]],
        [[1]],
        ALLSELECTED ( 'Date'[Fiscal Year], 'Date'[Month Number] ),
        PARTITIONBY ( 'Date'[Fiscal Year] )
    ),
    [Total Sales]
)`,
 sel:[[`-1, ABS`,`1, ABS`,`-2, REL`],[`0, ABS`,`1, REL`,`0, REL`]],a:[1,2],
 ex:`The window must start at the first row of the partition (1, ABS) and end at the current row (0, REL), which gives a running total that restarts for each fiscal year. A start of -1, ABS begins at the last row of the partition, and -2, REL would produce a moving three-month sum instead of a cumulative one.`},

/* src: https://learn.microsoft.com/en-us/power-bi/transform-model/calculation-groups */
{s:0,d:3,t:"match",ref:"field parameters calculation groups dynamic format strings composite model DirectQuery Power BI semantic models",
 stem:`You are designing semantic model features for several reports. Match each goal to the feature that meets it. Each option can be used once.`,
 targets:[`Let readers use a slicer to switch a chart between the Revenue, Margin, and Units measures`,`Add YTD and prior-year variants to every existing measure without writing a copy of each measure`,`Show one measure in a currency format that follows the selected country while it stays numeric`,`Add a local Excel table and a new measure to a certified enterprise semantic model without copying it`],
 pool:[`Calculated column that uses FORMAT`,`Calculation group`,`Composite model that uses DirectQuery for a Power BI semantic model`,`Field parameter`,`Dynamic format string on the measure`,`Bridging table`],a:[3,1,4,2],
 ex:`A field parameter lets slicer selections swap the fields a visual uses, a calculation group applies calculation items to existing measures through SELECTEDMEASURE, and a dynamic format string changes the format of a measure without converting it to text as FORMAT does. A composite model on a published semantic model lets you add local tables and measures.`},

/* src: https://learn.microsoft.com/en-us/fabric/fundamentals/direct-lake-overview */
{s:0,d:3,t:"yesno",ref:"Direct Lake on OneLake composite model guardrails fallback Direct Lake on SQL",
 stem:`Contoso is choosing between the two forms of Direct Lake storage mode. For each statement, select Yes if it is true. Otherwise, select No.`,
 rows:[`A Direct Lake on OneLake semantic model can also contain Import tables that load data from other data sources.`,`A single semantic model can contain both Direct Lake on SQL analytics endpoints tables and Dual storage mode tables.`,`When a Delta table exceeds a capacity guardrail in a Direct Lake on OneLake model, refresh fails and the model can't be queried until the Delta tables are optimized.`],a:[1,0,1],
 ex:`Direct Lake on OneLake supports composite modeling with Import tables and never falls back to DirectQuery, so an exceeded guardrail causes a refresh failure. Direct Lake on SQL analytics endpoints can't be combined with DirectQuery or Dual tables in the same model, and it falls back to DirectQuery instead when guardrails are exceeded.`},

/* src: https://learn.microsoft.com/en-us/power-bi/connect-data/incremental-refresh-overview */
{s:1,d:3,t:"series",grp:"C",ref:"incremental refresh policy RangeStart RangeEnd large fact table",
 scen:`Contoso has an Import-mode semantic model in a Fabric workspace. The Sales table has 900 million rows and is loaded from Azure SQL Database. The OrderDate column has the Date/Time data type. Rows older than one month never change. A full refresh takes many hours and sometimes times out. You need to shorten the refresh while keeping five years of history.`,
 sol:`Solution: In Power Query, you create Date/Time parameters named RangeStart and RangeEnd and filter OrderDate by using them so that the filter folds to the source. You define an incremental refresh policy that archives five years and refreshes the last month.`,a:0,
 ex:`The policy lets the service keep older partitions and refresh only the most recent month, which shortens each refresh while retaining five years of history. Meets the goal.`},
/* src: https://learn.microsoft.com/en-us/power-bi/enterprise/service-premium-large-models */
{s:1,d:3,t:"series",grp:"C",ref:"large semantic model storage format does not shorten refresh",
 scen:`Contoso has an Import-mode semantic model in a Fabric workspace. The Sales table has 900 million rows and is loaded from Azure SQL Database. The OrderDate column has the Date/Time data type. Rows older than one month never change. A full refresh takes many hours and sometimes times out. You need to shorten the refresh while keeping five years of history.`,
 sol:`Solution: You enable the large semantic model storage format and increase the frequency of the scheduled refresh.`,a:1,
 ex:`The large storage format raises the model size limit but doesn't partition the table, and every scheduled refresh would still reload all 900 million rows. Doesn't meet the goal.`}
];
