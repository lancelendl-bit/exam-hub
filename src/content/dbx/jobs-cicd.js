export const items=[
/* src: https://docs.databricks.com/aws/en/jobs/file-arrival-triggers and https://docs.databricks.com/aws/en/jobs/triggers */
{s:0,d:4,t:"single",ref:"Lakeflow Jobs file arrival trigger",
 stem:`A retail analytics team receives supplier price files in a Unity Catalog volume at unpredictable times, several times a day. A job must process each new file soon after it lands and should not run when nothing new has arrived. What should the data engineer configure?`,
 opts:["A scheduled trigger every minute whose first task checks the volume for new files","A file arrival trigger on the volume path","A continuous trigger so that the job is always running and waiting for files","A table update trigger on the table that the job eventually loads"],a:1,
 ex:`A file arrival trigger checks the Unity Catalog volume or external location for new files and starts a run only when new files appear, which is exactly the data-driven behaviour needed. A scheduled trigger every minute is time-based, so it starts a run whether or not data has arrived and wastes compute. A table update trigger watches tables, not files landing in storage.`},

/* src: https://docs.databricks.com/aws/en/jobs/file-arrival-triggers */
{s:0,d:4,t:"single",ref:"file arrival trigger wait after last change minimum time between triggers",
 stem:`Several hundred small files from a logistics partner land in a Unity Catalog volume over about ten minutes. The job's file arrival trigger starts a run on the first file and again during the burst. The engineer wants a run to start only after file activity has paused for 60 seconds, and wants no more than one run every 15 minutes. Which advanced settings should be used?`,
 opts:["Set only Minimum time between triggers to 900 seconds so runs are at least 15 minutes apart","Set only Wait after last change to 60 seconds so the run starts after a quiet period","Set Wait after last change to 60 and Minimum time between triggers to 900","Replace the trigger with a scheduled trigger every 15 minutes during the nightly window"],a:2,
 ex:`Wait after last change is a debounce that resets with every new file, so the run starts only after a quiet period. Minimum time between triggers is a cooldown that caps runs at one per interval. Using only the cooldown still lets the first file start a run mid-burst, and using only the debounce does not cap how often runs start. A schedule would no longer be data-driven.`},

/* src: https://docs.databricks.com/aws/en/jobs/trigger-table-update */
{s:0,d:4,t:"single",ref:"Lakeflow Jobs table update trigger all tables updated",
 stem:`A job builds a gold customer table from two silver tables, orders_silver and returns_silver. Each is refreshed by a separate pipeline at different, unpredictable times during the day. The job should run when both tables have received new data, not when only one has. Which trigger configuration meets this requirement?`,
 opts:["A table update trigger on both tables with the condition All tables are updated","A table update trigger on both tables with the condition Any table is updated","A file arrival trigger on the storage location that holds the data files of the silver tables","A scheduled trigger set to the latest time of day at which either pipeline usually finishes"],a:0,
 ex:`A table update trigger can monitor several tables and, with the All tables are updated condition, starts the job only after every monitored table has updated. The Any table is updated condition would run the job after a single refresh and build gold from partly stale inputs. A fixed schedule cannot follow pipelines whose finish times vary.`},

/* src: https://docs.databricks.com/aws/en/jobs/trigger-table-update */
{s:0,d:4,t:"single",ref:"table update trigger requirements SELECT run as principal",
 stem:`A team adds a table update trigger to a job that monitors the Unity Catalog table main.sales.orders. The table receives MERGE updates every hour, but the job never starts and the trigger reports an evaluation failure. The job runs as the service principal sp-etl. What is the most likely cause?`,
 opts:["Table update triggers can only monitor streaming tables","Table update triggers ignore changes made by MERGE statements","Table update triggers cannot monitor Unity Catalog tables, only Hive metastore tables","sp-etl lacks SELECT on the table, plus USE CATALOG and USE SCHEMA on its parents"],a:3,
 ex:`The Run as principal must be able to read the monitored table, because the trigger reads table metadata and change history. Without SELECT, USE CATALOG and USE SCHEMA, the trigger fails to evaluate and the job does not run. Updates, merges and deletes all count as triggering operations, and Delta tables in Unity Catalog are supported, so the other options describe limits that do not exist.`},

/* src: https://docs.databricks.com/aws/en/jobs/scheduled */
{s:0,d:4,t:"single",ref:"Lakeflow Jobs scheduled trigger time zone daylight saving",
 stem:`A job runs hourly on a schedule configured with the America/New_York time zone. Twice a year, around the clock change, one hourly run is skipped or delayed by an hour. The team needs runs at consistent absolute hourly intervals. What should they do?`,
 opts:["Change the cron expression to fire every 10 seconds","Change the schedule time zone to UTC","Raise the job's maximum concurrent runs to 2","Replace the schedule with a continuous trigger"],a:1,
 ex:`When a schedule uses a time zone that observes daylight saving time, an hourly job can be skipped or delayed when the clock changes. Databricks recommends UTC for hourly jobs that must run at absolute times. More concurrent runs do not change when the scheduler fires, and a continuous trigger starts a new run whenever the previous one ends rather than on the hour.`},

/* src: https://docs.databricks.com/api/workspace/jobs/create and https://docs.databricks.com/aws/en/jobs/configure-task */
{s:0,d:4,t:"single",ref:"Lakeflow Jobs task retries min_retry_interval_millis",
 stem:`A notebook task sometimes fails because an external API throttles requests. The engineer defines the job in a bundle and wants the task retried up to three times, with at least five minutes between the start of a failed attempt and the start of the retry. Which task settings should be used?`,
 opts:["max_retries: 3, min_retry_interval_millis: 300000","max_retries: 3, min_retry_interval_millis: 5","max_retries: 300000, min_retry_interval_millis: 3","retry_on_timeout: true, min_retry_interval_millis: 300000"],a:0,
 ex:`max_retries sets how many times an unsuccessful run is retried, and min_retry_interval_millis is in milliseconds, so five minutes is 300000. A value of 5 would mean five milliseconds. Setting only retry_on_timeout does not enable retries on ordinary failures, because max_retries defaults to 0 and retry_on_timeout only covers timeouts.`},

/* src: https://docs.databricks.com/aws/en/jobs/if-else and https://docs.databricks.com/aws/en/jobs/task-values */
{s:0,d:4,t:"single",ref:"Lakeflow Jobs If/else condition task task values",
 stem:`A job has a notebook task named ingest that calls dbutils.jobs.taskValues.set to store the number of loaded rows under the key row_count. A downstream task named transform should run only when row_count is greater than 0. Otherwise the run should end without running it. What should the engineer add to the job?`,
 opts:["Set the Run if dependencies of transform to At least one succeeded, so that it runs only after ingest has finished","Add a retry policy to ingest so that the task repeats until it has written some rows","Add an If/else condition task testing {{tasks.ingest.values.row_count}} > 0, and run transform when true","Add a For each task that takes row_count as its input and runs transform as the nested task"],a:2,
 ex:`The If/else condition task compares operands such as task value references and exposes true and false outcomes that downstream tasks can depend on. Run if conditions look only at the statuses of upstream tasks, so an ingest task that succeeded with zero rows would still trigger transform. A For each task loops over an array and does not branch.`},

/* src: https://docs.databricks.com/aws/en/jobs/run-if */
{s:0,d:4,t:"single",ref:"Lakeflow Jobs run if dependencies at least one failed",
 stem:`A job runs three independent ingestion tasks (crm, erp and web) in parallel, followed by a task named notify_oncall that sends a page. The page must be sent if at least one ingestion task fails and must not be sent when all of them succeed. Which Run if dependencies setting should notify_oncall use?`,
 opts:["All succeeded, the default","All done, whatever the outcome","All failed","At least one failed"],a:3,
 ex:`The At least one failed condition runs the task when any dependency has failed, and marks it Excluded (skipped) when none has. All done would run notify_oncall after every run, including successful ones, and so send false pages. All failed would miss the case where only one or two ingestion tasks fail.`},

/* src: https://docs.databricks.com/aws/en/jobs/for-each */
{s:0,d:4,t:"single",ref:"Lakeflow Jobs For each task concurrency",
 stem:`A For each task loops over a list of 12 table names produced by an upstream task and runs a nested notebook task for each name. Every iteration takes about ten minutes, so the loop takes roughly two hours. The engineer wants four iterations to run at the same time. What should they do?`,
 opts:["Set the job's maximum concurrent runs to 4","Set the For each task's concurrency to 4","Nest a second For each task inside the first and give it four inputs","Pass the list as a job parameter instead of as a task value"],a:1,
 ex:`The For each task has an optional concurrency setting that controls how many iterations run in parallel, and its default is 1, which is why the iterations run one after another. The job's maximum concurrent runs limits simultaneous runs of the whole job, not iterations. A For each task cannot be nested inside another For each task, and changing the input source does not change concurrency.`},

/* src: https://docs.databricks.com/aws/en/jobs/dashboard and https://docs.databricks.com/aws/en/jobs/pipeline */
{s:0,d:4,t:"single",ref:"Lakeflow Jobs pipeline task dashboard task dependencies",
 stem:`Every morning, a Lakeflow Spark Declarative Pipeline refreshes the gold tables. Afterward, a published dashboard built on those tables must refresh and its subscribers must receive the update by email. The dashboard must refresh only after the pipeline update completes. Which job design meets these requirements?`,
 opts:["A pipeline task followed by a dashboard task that depends on it","A pipeline task and a dashboard task with no dependency, both scheduled for 6:00 AM","A pipeline task followed by a SQL task that runs the dashboard's dataset queries","A single notebook task that starts the pipeline update and then exports the dashboard as a PDF"],a:0,
 ex:`A pipeline task runs one pipeline update, and a dashboard task that depends on it refreshes the published dashboard and emails the selected subscribers once the upstream task succeeds. Without a dependency, the two tasks start together and the dashboard can refresh against stale tables. A SQL task running the queries does not refresh the dashboard or notify its subscribers.`},

/* src: https://docs.databricks.com/aws/en/jobs/run-if */
{s:0,d:4,t:"single",ref:"Lakeflow Jobs run if at least one succeeded",
 stem:`A job extracts sales data from two regional systems with tasks named extract_eu and extract_us. A task named combine should run if at least one extract succeeded, so the business still receives a partial report. It must not run when both extracts fail. Which Run if dependencies setting should combine use?`,
 opts:["All succeeded (the default)","None failed","At least one succeeded","All done, whatever the outcome"],a:2,
 ex:`At least one succeeded runs the task when any dependency succeeded, even if another failed. None failed requires that no dependency failed, so a single failed extract would prevent combine from running. All done would also run combine when both extracts fail.`},

/* src: https://docs.databricks.com/aws/en/repos/git-operations-with-repos and https://docs.databricks.com/aws/en/repos/ci-cd-techniques-with-repos */
{s:0,d:5,t:"single",ref:"Databricks Git folders create branch commit push pull request",
 stem:`A developer is changing an ETL notebook stored in a Databricks Git folder under their user folder. The remote repository protects its main branch, and the change must be reviewed before it is merged. Which workflow is correct?`,
 opts:["Edit the notebook while the Git folder is on main and use Commit & Push so the change merges into main after review","Commit in the Git folder, then click Create pull request in the Git folder dialog so the change merges on approval","Create a branch in the Git folder, commit and push to it, then open a pull request in the Git provider","Use the Rebase action in the Git folder to open a pull request against the main branch of the remote"],a:2,
 ex:`Developers work on their own branch in a Git folder, push the commits, and create the pull request in the Git provider, where reviewers approve and merge it. Databricks does not create pull requests. Committing directly to a protected main branch is not allowed, and Rebase rewrites branch history rather than opening a pull request.`},

/* src: https://docs.databricks.com/aws/en/repos/ci-cd-techniques-with-repos */
{s:0,d:5,t:"single",ref:"production Git folder CI/CD update after merge",
 stem:`A team keeps a top-level Git folder that scheduled jobs use as their notebook source in production. Most analysts have Can Run on the folder. The folder must always match the main branch and must never be edited by hand. How should it be kept up to date?`,
 opts:["Give every developer Can Edit on the folder so that they can pull main whenever it is needed","Let developers commit and push straight from the production folder to the main branch","Ask developers to switch the production folder to their own feature branches for testing","Have an external CI/CD tool update it to the latest main commit after each merge"],a:3,
 ex:`The production Git folder should change only through automation after a pull request merges into the deployment branch, for example a CI/CD tool such as GitHub Actions that pulls the latest commits. Only admins and service principals should be able to edit it. Hand edits or feature branches in that folder make it drift from source control.`},

/* src: https://docs.databricks.com/aws/en/dev-tools/bundles/variables and https://docs.databricks.com/aws/en/dev-tools/bundles/settings */
{s:0,d:5,t:"single",ref:"Declarative Automation Bundles variables targets",
 stem:`A bundle defines a Lakeflow Spark Declarative Pipeline. From one codebase, the pipeline must publish to the catalog dev_cat when deployed to the dev target and to prod_cat when deployed to the prod target. Which approach should the engineer use?`,
 opts:["Declare a catalog variable, set catalog to \${var.catalog}, and give each target a value under variables","Keep two copies of the pipeline YAML file and comment one of them out before each deployment","Create one bundle for each environment and copy the pipeline source into each of them","Hard-code dev_cat in the pipeline and change the setting with a notebook after the deployment"],a:0,
 ex:`Bundle variables are declared at the top level, referenced with \${var.name}, and given a different value in each target, so one codebase can be promoted unchanged. Separate copies of the bundle or of the YAML files, and edits made after the deployment, break the single-codebase goal.`},

/* src: https://docs.databricks.com/aws/en/dev-tools/bundles/variables */
{s:0,d:5,t:"single",ref:"bundle variable precedence BUNDLE_VAR environment variable",
 stem:`A bundle contains the following configuration:
<div class="code">variables:
  catalog:
    default: dev_cat

targets:
  prod:
    variables:
      catalog: prod_cat</div>
The CI runner has the environment variable BUNDLE_VAR_catalog set to staging_cat. A CI step runs databricks bundle deploy -t prod without a --var option. Which catalog value does the deployment use?`,
 opts:["prod_cat","staging_cat","dev_cat","None, because the variable is set in more than one place and the deployment fails"],a:1,
 ex:`Variable values resolve in a fixed order: the --var option, then BUNDLE_VAR_ environment variables, then variable-overrides.json, then the variables mapping under the target, then the top-level default. The environment variable therefore beats the prod target value. The target value does not win just because the target is prod, and multiple sources do not cause an error.`},

/* src: https://docs.databricks.com/aws/en/dev-tools/bundles/deployment-modes and https://docs.databricks.com/aws/en/dev-tools/bundles/pipelines-tutorial */
{s:0,d:5,t:"single",ref:"bundle mode development pauses schedules",
 stem:`An engineer deploys a bundle with databricks bundle deploy -t dev, and the dev target sets mode: development. The deployed job is named [dev jsmith] nightly_load, and its cron schedule never fires, although the same schedule works in the prod target. What explains this behaviour?`,
 opts:["The Quartz cron expression is valid only when the target mode is set to production","A schedule becomes active only after databricks bundle run has been executed at least once","Development mode prefixes names and pauses schedules unless pause_status is UNPAUSED","The job's max_concurrent_runs of 1 blocks scheduled runs in development mode"],a:2,
 ex:`In development mode, bundle deployments prefix resource names with [dev user], tag jobs and pipelines, and pause schedules and triggers, which can be overridden by setting pause_status to UNPAUSED. Development mode actually enables concurrent runs on jobs, so max_concurrent_runs is not the cause, and cron expressions do not depend on the mode.`},

/* src: https://docs.databricks.com/aws/en/dev-tools/bundles/ci-cd-bundles and https://docs.databricks.com/aws/en/dev-tools/auth/oauth-m2m and https://docs.databricks.com/aws/en/dev-tools/cli/bundle-commands */
{s:0,d:5,t:"single",ref:"Databricks CLI bundle validate deploy CI/CD service principal",
 stem:`A team uses GitHub Actions to promote a bundle to production whenever a pull request merges into main. Which approach follows recommended practice?`,
 opts:["Authenticate with the lead engineer's personal credentials, run bundle deploy -t prod, and run bundle validate -t prod afterward to confirm","Run bundle destroy -t prod --auto-approve, then bundle deploy -t prod to guarantee that production starts from a clean state","Import the changed notebooks into the production workspace with the CLI and then edit the jobs by hand in the workspace UI","Authenticate as a service principal using OAuth environment variables, then run bundle validate -t prod and bundle deploy -t prod"],a:3,
 ex:`Databricks recommends service principals rather than personal users for CI/CD, and the CLI can authenticate as one through OAuth machine-to-machine environment variables. The workflow validates the configuration and then deploys the same bundle to the prod target. Running destroy first permanently deletes the previously deployed jobs and pipelines, and deploy already creates, updates or removes resources to match the bundle.`},

/* src: https://learn.microsoft.com/en-us/azure/databricks/dev-tools/cli/bundle-commands */
{s:0,d:5,t:"single",ref:"bundle generate job bind existing resource",
 stem:`A job created by hand in the production workspace (job ID 6565621249) must now be managed by the team's bundle. The team ran databricks bundle generate job --existing-job-id 6565621249 and then deployed to prod. Production now has two copies of the job. What should the team have done?`,
 opts:["Use --bind with bundle generate job, or bundle deployment bind, before deploying","Deploy with the --force option so that the bundle overwrites the existing job in the workspace","Give the job in the bundle the same name as the existing job so that deploy matches the two","Run bundle summary after the deployment, which merges duplicate jobs into a single job"],a:0,
 ex:`Deploying generated configuration without binding creates a new resource, because a bundle tracks deployed resources by ID and not by name. Binding links the bundle's resource key to the existing job so the next deploy updates it. The --force option only overrides blocking validations such as Git branch checks, and bundle summary only reports the bundle's resources.`}
];
