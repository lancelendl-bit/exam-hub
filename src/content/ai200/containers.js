export const items=[
/* src: https://learn.microsoft.com/en-us/azure/container-registry/container-registry-tasks-overview */
{s:0,d:1,t:"single",ref:"ACR quick task az acr build without local Docker",
 stem:`A developer machine has no Docker Engine installed. You must build a container image from the local source folder and have the finished image pushed to Azure Container Registry without leaving the command line. What should you use?`,
 opts:["Run az acr build, which sends the build context to the registry and builds and pushes the image there","Run docker build locally, because Azure Container Registry can only store images that are built elsewhere","Create a timer trigger task, which compiles the local folder at the next scheduled time on the machine","Run az acr import, which compiles a local source directory into an image inside the target registry"],a:0,
 ex:`A quick task, started with az acr build, offloads docker build and docker push to Azure: the command sends the context to the registry and by default pushes the built image when the build completes, so no local Docker Engine is needed. A timer trigger only runs a task on a schedule, and az acr import copies existing images rather than building one.`},

/* src: https://learn.microsoft.com/en-us/azure/container-registry/container-registry-tasks-overview */
{s:0,d:1,t:"single",ref:"ACR Tasks base image update trigger automate OS patching",
 stem:`Several application images are built on a shared base image that receives OS patches. You must rebuild every dependent application image automatically whenever the updated base image is pushed to your registry. Which feature should you configure?`,
 opts:["A scheduled timer trigger that rebuilds all images each night, whether or not the base image changed","An Azure Container Registry task that tracks the base image dependency and rebuilds on a base image update","A webhook on the registry that sends an email, after which an operator rebuilds each image by hand","A multi-step task that pulls the base image once and tags it with the names of every application image, in one run"],a:1,
 ex:`Azure Container Registry tasks can track the base image an application image depends on and build the application image automatically when that base image is updated in the registry or in a public repo such as Docker Hub. A nightly timer rebuilds without knowing whether anything changed, and a manual rebuild after an email is the toil the feature removes.`},

/* src: https://learn.microsoft.com/en-us/azure/container-registry/container-registry-tasks-overview */
{s:0,d:1,t:"single",ref:"ACR task source trigger commit pull request personal access token",
 stem:`You create an Azure Container Registry task whose context is a GitHub repository, and you accept the default trigger settings. Which statement describes the result?`,
 opts:["A build starts on every commit, and pull request builds are off until you enable that trigger yourself","A build starts on every pull request, and commits to the branch are ignored unless you enable them","Both commit and pull request triggers run, and the task needs no token because the registry has a webhook","Neither trigger runs, so every build must be started with az acr run from a developer workstation"],a:0,
 ex:`With a Git repository as the context, the commit trigger is enabled by default and the pull request trigger is not. To set the webhook the task also needs a personal access token for the repo. The other choices reverse the defaults or claim no token is needed.`},

/* src: https://learn.microsoft.com/en-us/azure/container-registry/container-registry-tasks-overview */
{s:0,d:1,t:"single",ref:"ACR Tasks image platform linux arm64 --platform",
 stem:`A team runs an ARM-based Linux cluster. Their Azure Container Registry task builds images, but the resulting images fail to start on the ARM64 nodes. The Dockerfile is correct. What should you change?`,
 opts:["Add a second registry in an ARM region, because images are built for the region where the registry was created","Rebuild with a Windows base image, because Windows images are the default for registry tasks","Specify --platform with Linux/arm64/v8, because tasks build for Linux AMD64 unless told otherwise","Enable the pull request trigger, because architecture is selected by the type of trigger used"],a:2,
 ex:`By default Azure Container Registry tasks build images for the Linux OS and the AMD64 architecture. The --platform option selects another OS or architecture, for example Linux/arm64/v8. The region of the registry and the trigger type do not choose the architecture.`},

/* src: https://learn.microsoft.com/en-us/azure/app-service/configure-custom-container */
{s:0,d:1,t:"single",ref:"App Service custom container WEBSITES_PORT",
 stem:`You deploy a custom Linux container to Azure App Service. The container serves HTTP on port 8000, but the site returns errors because App Service cannot reach it. Which action fixes the problem?`,
 opts:["Set the app setting WEBSITES_PORT to 8000","Set the app setting WEBSITES_ENABLE_APP_SERVICE_STORAGE to 8000","Expose a second port 80 from the same container so that the platform can choose between the two","Add the port number to DOCKER_REGISTRY_SERVER_URL so the pull request is routed to port 8000"],a:0,
 ex:`App Service assumes a custom container listens on port 80 and only lets the container expose one port for HTTP, so a different port is declared with the WEBSITES_PORT app setting. The storage setting controls persistence, and the registry URL setting only affects how the image is pulled.`},

/* src: https://learn.microsoft.com/en-us/azure/app-service/configure-custom-container */
{s:0,d:1,t:"multi",n:2,ref:"App Service pull image from ACR managed identity AcrPull acrUseManagedIdentityCreds",
 stem:`A web app runs a custom container from a private Azure Container Registry, and you must remove the stored registry password. Which two steps are required to pull the image by using a system-assigned managed identity? Each correct answer presents part of the solution.`,
 opts:["Assign the AcrPull role to the app's identity at the scope of the registry","Set the site configuration acrUseManagedIdentityCreds to true on the web app","Store the registry admin password in the DOCKER_REGISTRY_SERVER_PASSWORD app setting","Assign the Owner role to the app's identity at the scope of the subscription","Set the WEBSITES_ENABLE_APP_SERVICE_STORAGE app setting to false on the web app"],a:[0,1],
 ex:`The documented steps are to enable the managed identity, grant it the AcrPull role on the registry, and set acrUseManagedIdentityCreds so the app uses the identity to pull. A password setting keeps the secret you wanted to remove, Owner at subscription scope is far more access than a pull needs, and the storage setting is about persistence.`},

/* src: https://learn.microsoft.com/en-us/azure/app-service/configure-custom-container */
{s:0,d:1,t:"single",ref:"App Service Linux custom container persistent storage /home WEBSITES_ENABLE_APP_SERVICE_STORAGE",
 stem:`A Linux custom container in Azure App Service writes upload files to /home/uploads. After each restart the files are gone, and instances in a scaled-out app do not see each other's files. Which is the most likely cause, and the fix?`,
 opts:["Persistent storage is disabled by default for Linux custom containers, so set WEBSITES_ENABLE_APP_SERVICE_STORAGE to true","Files under /home are always deleted at restart, so move the uploads to the container's /tmp directory instead","Scale-out copies the image again to each instance, so you must switch the image pull to managed identity","The app needs the WEBSITES_PORT setting, because uploads are sent through the port that the container exposes"],a:0,
 ex:`On Linux custom containers, persistent storage is disabled by default. When it is enabled through WEBSITES_ENABLE_APP_SERVICE_STORAGE, writes to /home persist across restarts and are shared by all instances. Writing to /tmp is not persistent, and the image pull method has no effect on files the app writes.`},

/* src: https://learn.microsoft.com/en-us/azure/container-apps/scale-app */
{s:0,d:1,t:"single",ref:"Container Apps default scale rule min max replicas HTTP",
 stem:`You deploy a container app that has external ingress. You do not define any scale rules or replica limits. Which scaling behavior applies?`,
 opts:["It scales on CPU use between 1 and 5 replicas, because CPU is the default custom trigger","It runs exactly one replica at all times, because scaling is off until you add a rule","The default HTTP scale rule applies, with a minimum of 0 and a maximum of 10 replicas","The app scales on queue length between 0 and 100 replicas, using a rule from the environment"],a:2,
 ex:`With no rule defined, Container Apps applies the default HTTP scale rule with a minimum of 0 replicas and a maximum of 10. The limits can be configured up to 1,000 replicas. There is no default CPU or queue rule.`},

/* src: https://learn.microsoft.com/en-us/azure/container-apps/scale-app */
{s:0,d:1,t:"single",ref:"Container Apps no ingress queue worker scale to zero minReplicas KEDA custom rule",
 stem:`A container app processes messages from an Azure Service Bus queue. It has ingress disabled and no scale rules, with the default replica limits. After a quiet period it stops processing new messages. What should you do?`,
 opts:["Enable ingress with an HTTP rule, since scaling decisions only exist for apps that receive web requests","Raise the maximum replicas to 1,000, because the app stopped after it reached its limit of replicas","Add a custom scale rule for the Service Bus queue, or set the minimum replicas to 1 or more","Lower the cool down period to 0 seconds, so that the replica is never removed by the platform"],a:2,
 ex:`With ingress off and no rule or minimum, the app scales to zero and has no trigger to start again. A custom KEDA rule such as azure-servicebus, or minReplicas of 1 or more, fixes that. Raising the maximum does not help an app at zero replicas, and the cool down period only delays the scale-in to zero.`},

/* src: https://learn.microsoft.com/en-us/azure/container-apps/scale-app */
{s:0,d:1,t:"single",ref:"Container Apps scale rule managed identity authentication Service Bus Event Hubs Queue",
 stem:`A KEDA scale rule in Azure Container Apps reads queue length from Azure Service Bus. Policy forbids connection strings stored as app secrets. Which authentication approach does Container Apps support for this scale rule?`,
 opts:["Only secrets, because scale rules are evaluated outside the app and cannot use any identity","Managed identity, which scale rules for Azure resources such as Service Bus support in place of secrets","Only a shared access signature that is placed in the metadata of the rule in clear text","The scale rule always reuses the identity of the user who most recently deployed a revision"],a:1,
 ex:`Scale rules support secrets-based authentication, and rules for Azure resources including Azure Queue Storage, Azure Service Bus and Azure Event Hubs also support managed identity, which the docs recommend where possible. A clear-text SAS in metadata would be worse than a secret, and the rule does not borrow the deployer's identity.`},

/* src: https://learn.microsoft.com/en-us/azure/container-apps/scale-app */
{s:0,d:1,t:"single",ref:"Container Apps KEDA desiredReplicas ceil messageCount scale algorithm",
 stem:`A Container Apps scale rule uses the azure-servicebus scaler with messageCount set to 5, minReplicas of 0 and maxReplicas of 20. The queue holds 50 messages. Using the documented scaling algorithm, how many replicas does the app aim for?`,
 opts:["5 replicas, from messageCount directly","10 replicas, from ceil(50 / 5)","20 replicas, because the maximum is always used","50 replicas, one for each queued message"],a:1,
 ex:`The documented algorithm is desiredReplicas = ceil(currentMetricValue / targetMetricValue), so 50 divided by 5 gives 10. The result is limited by maxReplicas and by the scale-up step. The docs show the same case and reach ten. Using the maximum or one replica per message ignores the formula.`},

/* src: https://learn.microsoft.com/en-us/azure/container-apps/revisions */
{s:0,d:1,t:"multi",n:2,ref:"Container Apps revision-scope changes new revision properties.template",
 stem:`A container app runs in the default revision mode. Which two changes cause Azure Container Apps to create a new revision when you deploy them? Each correct answer presents part of the solution.`,
 opts:["Changing the container image tag in the template","Adding or editing a scale rule in the template","Changing the value of an existing app secret","Turning ingress on or off for the container app","Changing a traffic splitting rule between revisions"],a:[0,1],
 ex:`Revision-scope changes are changes to properties.template, such as the container image, revision suffix and scale rules, and they create a revision. Application-scope changes, which live in properties.configuration, apply to all revisions and do not: secret values, revision mode, ingress, traffic splitting, labels, registry credentials and Dapr settings.`},

/* src: https://learn.microsoft.com/en-us/azure/container-apps/revisions */
{s:0,d:1,t:"single",ref:"Container Apps multiple revision mode traffic splitting blue-green 80/20",
 stem:`You must send 20 percent of requests to a new version of a container app and 80 percent to the current version, then shift all traffic after validation. Which revision setup supports this?`,
 opts:["Single revision mode, because the platform splits traffic between the old and the new revision","A new container app for each version, since one app can never hold two active revisions at once","Single revision mode with the minimum replicas set to 5, so that the replicas are shared by version","Multiple revision mode with a traffic splitting rule that gives each revision its percentage of requests"],a:3,
 ex:`In multiple revision mode you can run several active revisions, split traffic between them by percentage and choose when to deprovision old ones, which suits A/B and blue-green testing. Single revision mode, the default, moves all traffic to the new revision once its replicas are running.`},

/* src: https://learn.microsoft.com/en-us/azure/container-apps/log-monitoring */
{s:0,d:1,t:"single",ref:"Container Apps logs ContainerAppSystemLogs_CL ErrImagePull revision provisioning",
 stem:`A new Azure Container Apps revision fails to provision. You suspect an image pull error that the Container Apps service reports, not something the app printed. Which Log Analytics table should you query first?`,
 opts:["ContainerAppConsoleLogs_CL, which holds the stdout and stderr output from your containers","ContainerAppSystemLogs_CL, which holds messages that the Container Apps service generates","AzureActivity, because provisioning errors are only stored as control plane operations in it","ContainerAppHTTPLogs, which always exists in every workspace as soon as the app is deployed"],a:1,
 ex:`System logs come from the Container Apps service and include revision provisioning errors such as ErrImagePull, Timeout or ContainerCrashing. Console logs are the stdout and stderr of your containers. HTTP logs exist only after you enable them through diagnostic settings, and can take several minutes to show up.`},

/* src: https://learn.microsoft.com/en-us/azure/aks/tutorial-kubernetes-deploy-application */
{s:0,d:1,t:"single",ref:"AKS kubectl apply manifest LoadBalancer EXTERNAL-IP pending",
 stem:`You deploy a manifest to AKS with kubectl apply -f. The store-front service is of type LoadBalancer, and kubectl get service shows EXTERNAL-IP as <pending>. What does this mean, and what do you do?`,
 opts:["The manifest failed validation, so you delete the cluster and apply the manifest again from the start","The service has no pods behind it, so you must change the type of the service to NodePort","A public IP address is still being assigned, so keep watching with kubectl get service --watch","The image registry rejected the credentials, so you must rename the service to match the image"],a:2,
 ex:`The docs show the EXTERNAL-IP of a LoadBalancer service as <pending> at first and changing to a public IP address after a short time, and they suggest watching with the --watch argument. If the app still does not load, check the pods and any image registry authorization problem.`},

/* src: https://learn.microsoft.com/en-us/azure/aks/core-aks-concepts */
{s:0,d:1,t:"single",ref:"AKS system node pool user node pool CoreDNS application pods",
 stem:`You manage an AKS Standard cluster. You want critical system pods such as CoreDNS kept apart from your application pods, and you want application nodes sized differently for compute-heavy work. Which design matches AKS concepts?`,
 opts:["Keep one node pool for everything, since pods in kube-system are always scheduled onto the control plane","Run the application in the kube-system namespace so that it shares the nodes of the system components","Move CoreDNS to a user node pool, because only user node pools may host the critical system pods","Use a system node pool for critical system pods and separate user node pools for your application pods"],a:3,
 ex:`A system node pool exists mainly to host critical system pods such as coredns and konnectivity-agent, while user node pools exist mainly to host application pods and can have different VM sizes. The control plane is Azure-managed and does not run your node workloads, and deploying your own applications to kube-system is not recommended.`},
];
