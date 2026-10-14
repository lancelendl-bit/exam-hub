export const items=[
/* src: https://learn.microsoft.com/en-us/azure/key-vault/secrets/tutorial-rotation */
{s:0,d:4,t:"single",ref:"Key Vault secret rotation SecretNearExpiry Event Grid Azure Function",
 stem:`A secret in Azure Key Vault holds a database password and has an expiration date. You must rotate it automatically before it expires, using Azure Functions. Which design follows the documented pattern?`,
 opts:["Key Vault publishes a near-expiry event to Event Grid, which calls a function that creates a new secret version","A timer-triggered function polls the vault every second and rewrites the secret value in a loop","The application deletes the secret on expiry, and Key Vault then regenerates it with a random value","A Service Bus queue holds the secret, and a function purges the vault as soon as the queue is empty"],a:0,
 ex:`In the tutorial, Key Vault publishes a SecretNearExpiry event thirty days before the expiration date, Event Grid calls the function app endpoint subscribed to it, and the function generates a new password, creates a new secret version in Key Vault and updates the database. Key Vault does not regenerate deleted secrets itself.`},

/* src: https://learn.microsoft.com/en-us/azure/key-vault/general/rbac-guide */
{s:0,d:4,t:"single",ref:"Key Vault RBAC Key Vault Secrets User read secret contents least privilege",
 stem:`A web app uses a managed identity to read secrets from a Key Vault that uses the Azure RBAC permission model. The app must read secret values and do nothing else. Which role should you assign at the scope of the vault?`,
 opts:["Key Vault Reader, since it grants read access to the contents of secrets in the vault","Key Vault Contributor, because it is the standard data plane role for applications that read secrets","Key Vault Secrets Officer, since it is the least privileged role that can read secret contents","Key Vault Secrets User, which reads secret contents and grants no rights to manage secrets"],a:3,
 ex:`Key Vault Secrets User can read secret contents. Key Vault Reader can read metadata only, not secret contents. Key Vault Secrets Officer can perform any action on secrets, which is more than needed, and Key Vault Contributor is a control plane role that gives no access to keys, secrets or certificates.`},

/* src: https://learn.microsoft.com/en-us/azure/key-vault/general/rbac-guide */
{s:0,d:4,t:"single",ref:"Key Vault Reader role metadata not secret contents audit team",
 stem:`An audit team must list the secrets in a vault and see their names, expiration dates and tags. They must not be able to read any secret value. Which built-in role fits, with the vault using Azure RBAC?`,
 opts:["Key Vault Reader, which reads metadata of the vault and its objects but not secret contents","Key Vault Secrets User, because the role shows properties but hides the value of each secret","Key Vault Administrator, because it is the only role that can list secrets in a vault that uses RBAC","Key Vault Contributor, since it reads secret metadata through the data plane of the key vault"],a:0,
 ex:`Key Vault Reader reads metadata of the vault and its certificates, keys and secrets but cannot read sensitive values such as secret contents. Secrets User returns the value, Administrator can do everything on data, and Contributor works on the control plane only.`},

/* src: https://learn.microsoft.com/en-us/azure/key-vault/general/rbac-guide */
{s:0,d:4,t:"single",ref:"Key Vault switch permission model to Azure RBAC invalidates access policies outage",
 stem:`A vault currently uses access policies for its applications. You change its permission model to Azure RBAC without creating any role assignments first. What is the result?`,
 opts:["Existing access policy permissions are kept, and RBAC is applied only to newly created secrets","Access policy permissions stop applying, so apps can fail until equivalent Azure roles are assigned","Applications keep working, because the data plane ignores the permission model that is selected","The vault is locked for 24 hours, and then the access policies are converted to roles automatically by Azure"],a:1,
 ex:`The docs warn that setting the Azure RBAC permission model invalidates all access policy permissions and can cause outages when equivalent Azure roles are not assigned. Assign the roles first, and plan the change.`},

/* src: https://learn.microsoft.com/en-us/azure/key-vault/general/rbac-guide */
{s:0,d:4,t:"single",ref:"Key Vault one vault per application per environment role assignment scope",
 stem:`You design Key Vault access for an application that runs in development, pre-production and production. Which approach follows the documented recommendation?`,
 opts:["One shared vault for every application, with a role assignment on each individual secret","A vault for each application in each environment, with roles assigned at the vault scope","One vault per environment for all applications, with role assignments on each key and secret","A single vault per subscription, with the Contributor role granted to every application identity"],a:1,
 ex:`The guidance is a vault per application per environment, with roles at the key vault scope. Assigning roles on individual keys, secrets and certificates is not recommended except in narrow cases. Object-scope assignments do not isolate teams either, since administrative actions need vault-level permissions.`},

/* src: https://learn.microsoft.com/en-us/azure/azure-app-configuration/use-key-vault-references-dotnet-core */
{s:0,d:4,t:"single",ref:"App Configuration Key Vault reference app needs access to Key Vault stores URI not value",
 stem:`A key in Azure App Configuration is a Key Vault reference. The app reads App Configuration successfully, but resolving the reference fails with an authorization error. What should you do?`,
 opts:["Grant the app's identity access to the secret in Key Vault, because App Configuration never reads the vault","Grant the App Configuration store access to Key Vault, since the store resolves the secret for the app on its behalf","Copy the secret value into the App Configuration key, because references cannot be resolved by clients","Add a label to the key so that the provider treats the value as a secret instead of a plain setting"],a:0,
 ex:`A Key Vault reference stores a URI, not a secret value. The app, using the client provider, reads the value straight from Key Vault, so the app must authenticate to both services and be granted access to the vault. The two services do not communicate directly.`},

/* src: https://learn.microsoft.com/en-us/azure/azure-app-configuration/howto-best-practices */
{s:0,d:4,t:"single",ref:"App Configuration sentinel key refresh once after updating multiple keys",
 stem:`You update 30 related settings in Azure App Configuration at once. Applications use dynamic refresh, and you want each app to reload the full configuration only once, after all changes are complete. Which approach should you use?`,
 opts:["Watch all selected keys, so that the app reloads after every single key change that you make","Watch one sentinel key, and update it only after all the other settings have been changed","Restart every application after the change, since the provider cannot refresh a value at runtime","Give each setting its own label, which makes the provider refresh them together as one set"],a:1,
 ex:`With a sentinel key, the provider monitors one key and refreshes the whole configuration only when it changes, so updating the sentinel last gives a single consistent reload. Monitoring all selected keys reloads when any one of them changes, and the providers support dynamic refresh without a restart.`},

/* src: https://learn.microsoft.com/en-us/azure/azure-app-configuration/howto-best-practices */
{s:0,d:4,t:"single",ref:"App Configuration labels environment stacking load unlabeled then Development last loaded wins",
 stem:`An app loads App Configuration keys that start with TestApp: in two steps: first the keys with no label, then the keys labeled Development. A key exists in both sets with different values. Which value does the app use?`,
 opts:["The unlabeled value, because the default key always overrides any labeled copy of that key","An error is raised, since the same key cannot exist both with a label and with no label","The Development value, because when sets are stacked the last one loaded takes precedence","Both values, merged into a list, because the provider keeps every version of a repeated key"],a:2,
 ex:`App Configuration treats each key and label as an independent entry. The providers let you stack selections, and keys in a later set overwrite matching keys loaded earlier. A key with a label and the same key without one are two separate key-values.`},

/* src: https://learn.microsoft.com/en-us/azure/azure-app-configuration/howto-best-practices */
{s:0,d:4,t:"single",ref:"App Configuration reduce requests Kubernetes provider multiple workloads ConfigMap throttling",
 stem:`Twenty workloads on one AKS cluster each pull settings directly from the same App Configuration store, and requests are being throttled. Which option does the documentation recommend to cut requests?`,
 opts:["Add the App Configuration Kubernetes Provider, which creates ConfigMaps and Secrets that all the workloads share","Lower the refresh interval of each workload to one second, so that the store sees fewer total reads","Store the connection string in each pod as an environment variable, which bypasses the request quota","Create one key-value per workload with a unique label, so that the store has fewer entries to scan"],a:0,
 ex:`The Kubernetes provider runs once in the cluster, builds ConfigMaps and Secrets from key-values and Key Vault references and supports dynamic updates, so workloads read those instead of calling the store. Shortening the refresh interval would raise requests; the guidance is to increase it, watch a sentinel key, or use geo-replication.`},

/* src: https://learn.microsoft.com/en-us/azure/azure-app-configuration/howto-best-practices */
{s:0,d:4,t:"single",ref:"App Configuration bootstrap managed identity Microsoft Entra instead of connection string endpoint",
 stem:`An app on Azure App Service must connect to Azure App Configuration without any secret in its settings. Which option fits best?`,
 opts:["Embed the connection string in the code, because the endpoint URL by itself grants write access","Enable a managed identity, grant it access to the store, and give the app only the endpoint URL","Put the access key in a publicly readable file, which is allowed if the file name is hard to guess","Use the connection string of the store in the settings of the app, with the key rotated each day"],a:1,
 ex:`The recommended approach is Microsoft Entra authentication. With a managed identity the app needs only the endpoint URL, which is safe to put in code or configuration. Connection strings contain credentials and must be treated as secrets, for example stored in Key Vault.`},

/* src: https://learn.microsoft.com/en-us/azure/azure-monitor/app/opentelemetry-add-modify */
{s:0,d:4,t:"single",ref:"OpenTelemetry Python custom span SpanKind.SERVER background job requests table",
 stem:`A Python background job is instrumented with OpenTelemetry and exports to Application Insights. A custom span created with start_as_current_span appears in the dependencies table as InProc, but you want the job to appear in the requests table. What should you do?`,
 opts:["Create the span with kind=SpanKind.SERVER, which makes it a request in Application Insights","Call span.record_exception on it, because only spans that record an exception are listed as requests","Rename the tracer to the name of the cloud role, because the tracer name decides the table that is used","Create the span with kind=SpanKind.CLIENT, so that the job is shown as an outgoing call from the app"],a:0,
 ex:`By default, a custom span appears in dependencies with the type InProc. The docs show that a background job is created as a span of SERVER kind so it appears in the requests table. Recording exceptions or renaming the tracer does not change the table.`},

/* src: https://learn.microsoft.com/en-us/azure/azure-monitor/app/opentelemetry-add-modify */
{s:0,d:4,t:"single",ref:"OpenTelemetry Python add custom dimensions span processor set_attribute customDimensions",
 stem:`Every request span from a Python service must carry two extra values, CustomDimension1 and CustomDimension2, visible as customDimensions in Application Insights. Which approach should you use?`,
 opts:["Add the values to the connection string, which Application Insights copies to every record it stores","Print the values to stdout in each handler, since the distro converts console text to span attributes","Write a span processor that sets the attributes in on_start and pass it to the distro configuration","Create a separate Application Insights resource for each value so that they are kept independent"],a:2,
 ex:`The documented way to add attributes to all spans is a SpanProcessor whose on_start calls span.set_attribute, registered when the distro is configured. The attributes appear in customDimensions. A connection string identifies the resource and does not carry per-span values.`},

/* src: https://learn.microsoft.com/en-us/azure/azure-monitor/app/opentelemetry-enable */
{s:0,d:4,t:"single",ref:"OpenTelemetry cloud role name multiple services same Application Insights resource",
 stem:`Three microservices send OpenTelemetry data to one Application Insights resource, and the Application Map shows them as a single node. What is required to show them as separate nodes?`,
 opts:["Give each service a separate instrumentation key by editing the SDK that is installed on the service","Enable adaptive sampling, because services are separated by the sampling rate that each one uses","Set a cloud role name for each service, which is required when services share a resource","Place the three services into one container app, so that the map groups them by their container"],a:2,
 ex:`The docs say that if two or more services emit telemetry to the same Application Insights resource, you are required to set the cloud role names so they are represented properly on the Application Map. Sampling does not identify a service.`},

/* src: https://learn.microsoft.com/en-us/azure/azure-monitor/app/opentelemetry-enable */
{s:0,d:4,t:"single",ref:"APPLICATIONINSIGHTS_CONNECTION_STRING environment variable production OpenTelemetry",
 stem:`You are deploying a service instrumented with OpenTelemetry for Application Insights to production. How should the connection string be supplied?`,
 opts:["Set it in code, which the docs recommend for production since a deploy then always carries its value","Use the APPLICATIONINSIGHTS_CONNECTION_STRING environment variable, and keep setting it in code for local testing","Send it in an HTTP header on every request, since the exporter reads it from the incoming traffic","Commit it into the repository as a constant, which is valid because the string holds only a public id"],a:1,
 ex:`The guidance for production is an environment variable (or the applicationinsights.json file, for Java only). Setting the connection string in code is recommended only for local development and test environments.`},

/* src: https://learn.microsoft.com/en-us/kusto/query/summarize-operator */
{s:0,d:4,t:"single",ref:"KQL summarize by bin time explicit binning count",
 stem:`You write a KQL query to chart the number of events per hour. The query uses summarize count() by TimeGenerated, and the chart is unreadable, with a point for each distinct timestamp. What should you change?`,
 opts:["Use summarize count() by bin(TimeGenerated, 1h), because automatic hourly bins are no longer provided","Use summarize dcount(TimeGenerated), which returns one number for each hour in the queried range","Replace summarize with project, because project aggregates rows into a single result for each hour","Add take 1h at the end, since take groups rows that fall inside the hour that you specify"],a:0,
 ex:`To summarize over ranges, use bin() to reduce values to discrete buckets: summarize ... by bin(timestamp, 1h). The docs note that automatic hourly bins for datetime columns are no longer supported, so explicit binning is required. dcount returns a distinct count, and project and take do not aggregate.`},

/* src: https://learn.microsoft.com/en-us/azure/container-apps/log-monitoring */
{s:0,d:4,t:"single",ref:"KQL Container Apps HTTP logs enable diagnostic settings ContainerAppHTTPLogs StatusCode",
 stem:`You want to query 5xx responses for a container app in Log Analytics with ContainerAppHTTPLogs, but the table does not exist in the workspace. What is required?`,
 opts:["Query ContainerAppConsoleLogs_CL instead, because HTTP logs are written to the console table automatically","Enable HTTP logs through diagnostic settings on the Container Apps environment, then wait for the table to show","Enable Dapr on the container app, since ingress logs come from the Dapr sidecar and not from ingress","Set the minimum replicas to 1, because the table is created only when the app has a running replica"],a:1,
 ex:`HTTP logs are emitted by the ingress layer only when enabled through Azure Monitor diagnostic settings on the managed environment. After enabling them it can take several minutes for the ContainerAppHTTPLogs table to appear. Console logs hold only what your containers write to stdout and stderr.`},

/* src: https://learn.microsoft.com/en-us/azure/container-apps/log-monitoring */
{s:0,d:4,t:"single",ref:"KQL summarize countif percentile by RevisionName bin error rate new revision",
 stem:`After you deploy a new revision, you want to compare request volume, 5xx errors and P95 latency of each revision in 5-minute buckets, using ContainerAppHTTPLogs. Which query shape is correct?`,
 opts:["ContainerAppHTTPLogs | summarize count(), countif(StatusCode >= 500), percentile(RequestDuration, 95) by RevisionName, bin(TimeGenerated, 5m)","ContainerAppHTTPLogs | project RevisionName, StatusCode | summarize dcount(RevisionName) by StatusCode, take 5","ContainerAppConsoleLogs_CL | summarize percentile(StatusCode, 95) by Log_s, bin(TimeGenerated, 5m)","ContainerAppSystemLogs_CL | where StatusCode >= 500 | summarize count() by Log_s, ago(5m)"],a:0,
 ex:`The documented pattern summarizes count(), countif(StatusCode >= 500) and percentile(RequestDuration, 95) by RevisionName and bin(TimeGenerated, 5m) over the HTTP logs table, where RequestDuration is in milliseconds. The console and system log tables have no StatusCode or latency columns, and ago() is not a grouping expression.`},
];
