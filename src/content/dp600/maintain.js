export const items=[
/* src: https://learn.microsoft.com/en-us/fabric/security/service-admin-row-level-security */
{s:0,d:1,t:"single",ref:"row-level security Power BI workspace roles Viewer",
 stem:`You have a Fabric workspace named Sales that contains a semantic model named SM1. SM1 has a row-level security (RLS) role named WestOnly that filters the Region column to West. User1 is a member of WestOnly and has the Contributor role in the workspace. User1 sees all regions in reports that use SM1. You need to ensure that the WestOnly filter applies to User1. What should you do?`,
 opts:["Grant User1 Build permission on SM1","Add User1 to a second RLS role that also filters Region to West","Change the workspace role of User1 to Viewer","Define object-level security on the Region column"],a:2,
 ex:`RLS restricts data only for users with Viewer permissions. Admin, Member and Contributor roles have edit permission on the semantic model, so RLS does not apply to them. Build permission or extra role membership changes nothing while User1 is a Contributor.`},

/* src: https://learn.microsoft.com/en-us/fabric/cicd/deployment-pipelines/understand-the-deployment-process */
{s:0,d:1,t:"single",ref:"deployment pipelines Direct Lake semantic model autobinding data source rule",
 stem:`You have a deployment pipeline with Development, Test and Production stages. The Development workspace contains a lakehouse named LH1 and a Direct Lake semantic model named SM1 that uses the SQL analytics endpoint of LH1. After you deploy to Test, SM1 in Test still reads from LH1 in Development. You need SM1 in Test to read from LH1 in Test after every deployment. What should you do?`,
 opts:["Select the Select related option when you deploy","Create a parameter rule for the report in the Test stage","Re-create SM1 in the Test stage by using the XMLA endpoint","Create a data source rule on SM1 in the Test stage"],a:3,
 ex:`A Direct Lake semantic model does not autobind to items in the target stage, so it keeps pointing at the source lakehouse until you use a data source rule to bind it. Select related only adds dependent items to the deployment selection. It does not change bindings. Data source rules can rebind Direct Lake on SQL analytics endpoint models, but they are not supported for Direct Lake on OneLake.`},

/* src: https://learn.microsoft.com/en-us/fabric/cicd/deployment-pipelines/create-rules */
{s:0,d:1,t:"single",ref:"deployment pipeline deployment rules data source rule stage owner",
 stem:`You have a deployment pipeline. A semantic model named SM1, owned by User1, uses an Azure SQL database named SalesDev in the Development stage. SM1 must use an Azure SQL database named SalesProd after each deployment to the Production stage. Where should User1 create the data source rule?`,
 opts:["In the Development stage, on SM1","In the Production stage, on SM1","In the Test stage, on SM1, so that it flows on to Production","In Power BI Desktop, by editing the data source before each deployment"],a:1,
 ex:`Deployment rules are created in the target stage, on the item, by the item owner. They can't be created in the development stage, and a rule in Test applies only to deployments into Test. The rule takes effect at the next deployment to that stage, and a data source rule can only swap a source for one of the same type.`},

/* src: https://learn.microsoft.com/en-us/fabric/governance/impact-analysis */
{s:0,d:1,t:"single",ref:"impact analysis lineage notify contacts semantic model downstream",
 stem:`You plan to remove a column from a semantic model named SM1. Reports in 12 other workspaces use SM1. You need to identify the downstream items and workspaces that depend on SM1, and then email the workspace contacts about the change. What should you use?`,
 opts:["Compare stages in a deployment pipeline","The Git status column in the workspace","Impact analysis and the Notify contacts option","The Certified endorsement badge on SM1"],a:2,
 ex:`Impact analysis lists the direct children or all downstream items and workspaces, and Notify contacts emails the contact lists of the affected workspaces. You need write permission on the item to run it. Compare stages only shows differences between two pipeline stages and does not find dependent items in other workspaces.`},

/* src: https://learn.microsoft.com/en-us/fabric/enterprise/powerbi/service-premium-connect-tools */
{s:0,d:1,t:"single",ref:"XMLA endpoint read write capacity setting deploy semantic model",
 stem:`You have an F64 Fabric capacity. The tenant setting 'Allow XMLA endpoints and Analyze in Excel with on-premises semantic models' is enabled. Workspace Contributors try to deploy a tabular model from Visual Studio to a workspace on the capacity, and the write operation is rejected. You need to allow the deployment. What should you do?`,
 opts:["Change the users to the Viewer role","Set the XMLA Endpoint property of the capacity to Read Write","Enable the 'Users can work with semantic models in Excel using a live connection' setting","Grant the users Reshare permission on the workspace"],a:1,
 ex:`The XMLA endpoint is read-only by default, and write operations such as deploying a model or running TMSL scripts need the capacity admin to set it to Read Write. The setting applies to all workspaces on the capacity. The Excel live connection setting affects only Analyze in Excel.`},

/* src: https://learn.microsoft.com/en-us/power-bi/developer/projects/projects-overview */
{s:0,d:1,t:"single",ref:"Power BI Desktop project pbip TMDL PBIR Git",
 stem:`Four analysts at Litware co-author a Power BI report and its semantic model in Power BI Desktop. The work is saved in a single PBIX file, and merge conflicts keep occurring in Git. You need to enable meaningful diffs and merges of report and model changes in pull requests. What should you do?`,
 opts:["Save the report as a .pbit template and commit the template","Export a .pbids file for each analyst and commit it to the repository","Commit the PBIX file by using Git LFS so that every version is stored","Save the work as a Power BI Project (.pbip) and commit the project folders"],a:3,
 ex:`A Power BI Project saves the report and the semantic model as separate folders of plain-text files (PBIR and TMDL), which is what makes diffs and merges practical. A .pbit is a template for starting new reports, not a source-control format, and a .pbids file holds only a single data source connection.`},

/* src: https://learn.microsoft.com/en-us/fabric/governance/service-security-sensitivity-label-downstream-inheritance */
{s:0,d:1,t:"single",ref:"sensitivity label inheritance upon creation downstream inheritance tenant setting",
 stem:`Information protection is enabled for your tenant. The tenant setting 'Automatically apply sensitivity labels to downstream content' is disabled, and no default label policy is configured. A semantic model named SM1 has the sensitivity label Confidential. User1 creates a new report that uses SM1. Which sensitivity label does the new report have?`,
 opts:["Confidential","No label, because downstream inheritance is disabled","The label that the tenant uses as the default","Whatever label User1 applies, because new items never inherit labels"],a:0,
 ex:`Inheritance upon creation is a separate capability from downstream inheritance, so a new report takes the label of the labeled semantic model even when the tenant setting is off. That setting only controls whether a label change on a parent propagates to existing downstream items.`},

/* src: https://learn.microsoft.com/en-us/fabric/fundamentals/endorsement-promote-certify */
{s:0,d:1,t:"single",ref:"endorse Fabric items promoted certified master data",
 stem:`User1 owns a semantic model named Sales Model and has write permission on it. The Fabric admin enabled certification and specified a reviewer group that does not include User1. User1 wants Sales Model to show an endorsement badge so that other users can find it. Which badge can User1 apply directly?`,
 opts:["Certified","Master data","Promoted","Certified, after being assigned the Admin role in the workspace"],a:2,
 ex:`Anyone with write permission on an item can promote it. Certified and Master data can be applied only by reviewers that the Fabric admin has specified, and a workspace role does not change that. Users who are not authorized can request certification instead.`},

/* src: https://learn.microsoft.com/en-us/fabric/data-warehouse/column-level-security */
{s:0,d:1,t:"single",ref:"Fabric warehouse column-level security GRANT SELECT columns",
 stem:`You have a Fabric warehouse named WH1 that contains a table named dbo.Customers. The table has a CreditCard column. The Microsoft Entra group Analysts must query all columns of dbo.Customers except CreditCard by using T-SQL. What should you do?`,
 opts:["Run GRANT SELECT with a column list that excludes CreditCard on dbo.Customers to Analysts","Define object-level security on CreditCard in a Power BI semantic model","Create a security policy with a filter predicate on dbo.Customers","Assign Analysts the Viewer workspace role and hide CreditCard in the model"],a:0,
 ex:`Column-level security in a warehouse is implemented with GRANT SELECT on the permitted columns, and queries that include a denied column fail. A security policy filters rows, not columns, and semantic model security applies only to queries that go through the model, not to T-SQL.`},

/* src: https://learn.microsoft.com/en-us/fabric/onelake/security/get-started-security */
{s:0,d:1,t:"multi",n:2,ref:"OneLake security roles folder read lakehouse Viewer",
 stem:`You have a Fabric lakehouse named LH1 with the folders Files/Finance and Files/HR. The Entra group Analysts must read only Files/Finance from Spark notebooks and must not be able to change any item. Which two actions should you perform? Each correct answer presents part of the solution.`,
 opts:["Assign Analysts the Contributor role in the workspace so that they can run Spark notebooks","Assign Analysts the Viewer role in the workspace","Share LH1 with Analysts and select Read all with Apache Spark","Create a OneLake security role that grants Analysts Read on Files/Finance","Create an RLS role in a semantic model that uses LH1 and add Analysts to it"],a:[1,3],
 ex:`The Viewer role prevents item changes, and a OneLake security role then grants Read on just the Files/Finance folder. Read all with Apache Spark exposes the whole lakehouse through the default reader role, and Contributor allows writes.`},

/* src: https://learn.microsoft.com/en-us/fabric/cicd/deployment-pipelines/understand-the-deployment-process */
{s:0,d:1,t:"multi",n:2,ref:"deployment pipelines item properties not copied semantic model",
 stem:`You deploy a report and its semantic model from the Test stage to the Production stage of a deployment pipeline. Which two semantic model or report properties are not copied during the deployment? Each correct answer presents part of the solution.`,
 opts:["Report pages","Model measures and relationships","Refresh schedule","Report visuals","Data source credentials"],a:[2,4],
 ex:`Deployment pipelines copy metadata such as report pages and visuals, and model metadata. Refresh schedules, data source credentials, role assignments, permissions and endorsement settings stay as they were in the target stage and must be configured there.`},

/* src: https://learn.microsoft.com/en-us/fabric/cicd/git-integration/git-integration-process */
{s:0,d:1,t:"hot",ref:"Fabric Git integration workspace roles connect commit switch branch",
 stem:`You are planning Git integration for a Fabric workspace. How should you complete the permission design? Select the appropriate option in each list.`,
 tpl:`Role that can connect the workspace to a Git repo:      [[0]]
Lowest workspace role that can commit changes to Git:    [[1]]
A Contributor can switch the connected branch only when: [[2]]`,
 sel:[["Contributor","Member","Admin"],["Viewer","Contributor","Admin"],["the user owns the Git repository","the tenant admin disables Git integration","the workspace setting 'Allow users with at least Contributor role to change Git branch' is on"]],a:[2,1,2],
 ex:`Only an Admin can connect, disconnect or sync the workspace connection, while Contributors and above can commit and update once it exists. Viewers cannot see Git information. Contributors with write permission on all items can switch branches only when an Admin turns on the workspace setting.`},

/* src: https://learn.microsoft.com/en-us/fabric/cicd/deployment-pipelines/create-rules */
{s:0,d:1,t:"build",ref:"deployment pipeline create deployment rule data source rule deploy",
 stem:`You have a Development workspace with a semantic model that uses a development SQL Server. You need a new deployment pipeline that deploys the semantic model to Test and uses a test SQL Server there. Which four actions should you perform in sequence? Move the appropriate actions to the answer area and arrange them in the correct order.`,
 pool:["Deploy again from Development to Test","Create a data source rule on the semantic model in the Development stage","Create a data source rule on the semantic model in the Test stage","Create a deployment pipeline and assign the Development workspace to the Development stage","Deploy the Development stage content to the Test stage","Refresh the semantic model in the Development stage"],a:[3,4,2,0],
 ex:`The first deployment creates the semantic model in Test, and only then can you define a rule on it in the Test stage. A rule takes effect at the next deployment to that stage, which is why you deploy again. Rules can't be created in the Development stage.`},

/* src: https://learn.microsoft.com/en-us/power-bi/create-reports/desktop-templates ; https://learn.microsoft.com/en-us/power-bi/connect-data/desktop-data-sources */
{s:0,d:1,t:"match",ref:"pbit template pbids data source file pbip project XMLA endpoint",
 stem:`You are choosing reusable assets and lifecycle tools for Power BI content. Match each requirement to the asset or feature that meets it. Each option can be used once, more than once, or not at all.`,
 targets:["Give authors a starting point with pages, model and queries but no data","Prefill a single data source connection in the Get Data experience","Save the report and semantic model as text files for source control","Run TMSL scripts that change the metadata of a published semantic model"],
 pool:["Power BI Project (.pbip)","XMLA endpoint set to Read Write","PBIX file","Power BI template (.pbit)","Power BI data source file (.pbids)","Shared semantic model with Build permission"],a:[3,4,0,1],
 ex:`A .pbit holds report pages, the model definition and queries without data, while a .pbids file holds one data source connection without credentials. A .pbip project stores report and model as text files, and TMSL scripts need the XMLA endpoint with read-write enabled.`},

/* src: https://learn.microsoft.com/en-us/fabric/security/service-admin-row-level-security */
{s:0,d:1,t:"yesno",ref:"row-level security Power BI roles members Contributor Microsoft 365 group",
 stem:`You have a Fabric workspace that contains a semantic model with row-level security (RLS) roles. For each statement, select Yes if it is true. Otherwise, select No.`,
 rows:["RLS roles in the model filter the rows that a workspace Contributor sees.","You can add a Microsoft 365 group as a member of an RLS role.","A user who is a member of two RLS roles can see the rows that either role allows."],a:[0,0,1],
 ex:`RLS applies only to Viewers, so Admins, Members and Contributors are not filtered. Microsoft 365 groups are not supported as RLS role members, but Entra security groups, mail-enabled groups and distribution groups are. Roles are additive, so a user in two roles sees the union of their rows.`},

/* src: https://learn.microsoft.com/en-us/fabric/enterprise/powerbi/service-premium-connect-tools */
{s:1,d:1,t:"series",grp:"A",ref:"XMLA endpoint read write refresh partition SSMS",
 scen:`Workspace1 is on an F64 Fabric capacity and contains an Import semantic model named SM1 that has an incremental refresh policy with monthly partitions. You need to refresh only the March 2025 partition now. The refresh must not be subject to the 48 refreshes per day limit of scheduled refresh in the Power BI service.`,
 sol:`Solution: You set the XMLA Endpoint property of the capacity to Read Write, connect to the workspace from SQL Server Management Studio, and process the partition by running a TMSL refresh command.`,a:0,
 ex:`The XMLA endpoint supports fine-grain refresh of a single partition when it is enabled for read-write, and refreshes through it are not limited to 48 per day. Meets the goal.`},
/* src: https://learn.microsoft.com/en-us/fabric/enterprise/powerbi/service-premium-connect-tools */
{s:1,d:1,t:"series",grp:"A",ref:"XMLA endpoint read-only default refresh partition",
 scen:`Workspace1 is on an F64 Fabric capacity and contains an Import semantic model named SM1 that has an incremental refresh policy with monthly partitions. You need to refresh only the March 2025 partition now. The refresh must not be subject to the 48 refreshes per day limit of scheduled refresh in the Power BI service.`,
 sol:`Solution: You leave the XMLA Endpoint property of the capacity at its default Read Only setting and process the partition from SQL Server Management Studio.`,a:1,
 ex:`The default Read Only setting lets tools query the semantic model but not perform write operations such as refresh or partition processing. You must change the setting to Read Write first. Doesn't meet the goal.`}
];
