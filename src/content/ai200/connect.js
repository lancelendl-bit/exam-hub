export const items=[
/* src: https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-dead-letter-queues */
{s:0,d:3,t:"single",ref:"Service Bus MaxDeliveryCountExceeded dead-letter queue default 10 abandon",
 stem:`A consumer reads from a Service Bus queue in peek-lock mode. For one malformed message, the handler throws and the message is abandoned every time. With default queue settings, what happens to it?`,
 opts:["It is deleted silently after the first failed attempt, because malformed messages are never retried","It stays in the active queue indefinitely, because the delivery count is only a metric for reporting","It moves to the transfer dead-letter queue after three attempts, with the reason HeaderSizeExceeded","After 10 deliveries it moves to the dead-letter queue with the reason MaxDeliveryCountExceeded"],a:3,
 ex:`The delivery count rises each time a peek-locked message is abandoned or its lock expires. When it exceeds the limit, which defaults to 10, the message goes to the dead-letter queue with the reason MaxDeliveryCountExceeded, and this behavior cannot be disabled. The transfer dead-letter queue is for failed auto-forward and send-via transfers.`},

/* src: https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-dead-letter-queues */
{s:0,d:3,t:"multi",n:2,ref:"Service Bus dead-letter queue behavior no automatic cleanup TTL not observed",
 stem:`You are documenting how the dead-letter queue (DLQ) of a Service Bus queue behaves. Which two statements are true? Each correct answer presents part of the solution.`,
 opts:["Messages stay in the DLQ until you retrieve them and complete the dead-lettered message","Time-to-live is not observed in the DLQ, and you cannot dead-letter a message from a DLQ","Messages are removed from the DLQ automatically when their original time-to-live passes","The DLQ is a separate resource, so you can delete it without deleting the parent entity","A message in the DLQ that fails processing is moved to a second DLQ for the same queue"],a:[0,1],
 ex:`There is no automatic cleanup of a DLQ, and expiry is not applied to messages in it. A message cannot be dead-lettered from a DLQ either. The DLQ needs no explicit creation and cannot be deleted or managed independently of its main entity.`},

/* src: https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-dead-letter-queues */
{s:0,d:3,t:"single",ref:"Service Bus settle message before closing receiver lock lost delivery count",
 stem:`A worker receives Service Bus messages in peek-lock mode, hands them to a background task and closes the receiver and client before the task calls Complete. Messages reappear and end up in the dead-letter queue with MaxDeliveryCountExceeded. What should you change?`,
 opts:["Settle each message while the receiver is still open, before you close the receiver or the client","Increase the maximum delivery count to 1,000 so that these messages stop reaching the dead-letter queue","Switch the entity to a topic, because only topic subscriptions can settle messages after a connection closes","Call Abandon on every message at once so that the delivery count is reset before the next receive"],a:0,
 ex:`In peek-lock mode the lock is tied to the receiver and its connection. Closing them before settlement leaves the message locked until the lock expires, after which it is redelivered with a higher delivery count. A larger count only hides the bug, and abandoning increments the count rather than resetting it.`},

/* src: https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-dead-letter-queues */
{s:0,d:3,t:"single",ref:"Service Bus auto-forward failure transfer dead-letter queue $Transfer source entity",
 stem:`A Service Bus queue auto-forwards to another queue that an administrator has disabled. Where do the messages that cannot be forwarded end up?`,
 opts:["In the dead-letter queue of the destination queue, because that is the entity that refused them","In the transfer dead-letter queue of the source queue, which has the path <queue>/$Transfer/$DeadLetterQueue","In the active messages of the source queue, where they wait with an extended lock until the target is enabled","They are dropped, because the transfer dead-letter queue applies to topics and not to queues"],a:1,
 ex:`When a message cannot be forwarded in auto-forward or send-via scenarios, it is placed in the transfer dead-letter queue of the source entity that did the forwarding, not on the destination. A disabled or deleted destination is one of the documented causes, along with a destination that exceeds its size or a chain of more than four hops.`},

/* src: https://learn.microsoft.com/en-us/azure/service-bus-messaging/topic-filters */
{s:0,d:3,t:"single",ref:"Service Bus topic subscription correlation filter versus SQL filter throughput message body",
 stem:`A topic subscription must receive only messages whose Label is "invoice" and whose user property region equals "eu". The topic has a high message rate and throughput matters most. Which rule type should you choose?`,
 opts:["A SQL filter that evaluates the JSON body of each message for the strings invoice and eu","A correlation filter with Label and a region property, which is cheaper to process than a SQL filter","A true filter on the subscription, with the message body checked inside the consuming application, at no extra cost","A false filter on the subscription, because it matches only messages that carry both of the values"],a:1,
 ex:`A correlation filter matches equality on system and user properties, combines several conditions with AND, and is much more efficient than a SQL filter, which lowers throughput. All filters work on message properties, never the body. A true filter selects everything and a false filter selects nothing.`},

/* src: https://learn.microsoft.com/en-us/azure/service-bus-messaging/topic-filters */
{s:0,d:3,t:"single",ref:"Service Bus subscription rules with actions without actions copies of message",
 stem:`A subscription has five rules: two have an action and three have no action. A single message matches all five rules. How many messages does the subscription receive?`,
 opts:["1 message, because the subscription keeps a single copy of every message it matches","5 messages, because each matching rule creates its own copy for the subscription","3 messages: one for each of the two rules with an action and one for the rules without actions","2 messages, because rules with no action are ignored when another rule has an action"],a:2,
 ex:`Rules without actions are combined with OR and give a single message, while each rule with an action produces its own copy with a RuleName property. So two action rules plus one combined result give three messages, which is the example the docs use.`},

/* src: https://learn.microsoft.com/en-us/azure/service-bus-messaging/topic-filters */
{s:0,d:3,t:"single",ref:"Service Bus new subscription default rule true filter replace remove",
 stem:`You create a topic subscription and add a correlation filter rule to select only priority messages. The subscriber still receives every message sent to the topic. What is the most likely cause?`,
 opts:["Correlation filters are only evaluated for sessions, so you must enable sessions on the topic","The default rule with a true filter still exists, so remove or replace it to keep only the new rule","The new rule needs a SQL action, because a rule with no action selects every message on the topic","The subscription must be recreated with dead-lettering enabled, so that unmatched messages are held"],a:1,
 ex:`Each new subscription gets a default rule that applies a true filter, which selects all messages, and rules without actions are combined with OR. Until that default rule is removed or replaced, it keeps matching everything.`},

/* src: https://learn.microsoft.com/en-us/azure/event-grid/delivery-and-retry */
{s:0,d:3,t:"single",ref:"Event Grid delivery 400 bad request not retried dead-letter drop",
 stem:`A webhook subscribed to Event Grid returns 400 Bad Request for an event. No dead-letter destination is configured. What does Event Grid do with the event?`,
 opts:["It retries for 24 hours on the exponential schedule, because every failure follows the same policy","It waits 30 seconds and retries once, since only the first retry is allowed for client errors","It sends the event to the webhook endpoint again every minute until the endpoint returns a success code","It does not retry, and drops the event, since dead-lettering is not turned on for the subscription"],a:3,
 ex:`For a webhook, 400, 401, 403 and 413 are not retried. Event Grid dead-letters the event if dead-lettering is configured and drops it otherwise. Only the codes outside that list follow the exponential backoff schedule.`},

/* src: https://learn.microsoft.com/en-us/azure/event-grid/delivery-and-retry */
{s:0,d:3,t:"single",ref:"Event Grid retry policy defaults 30 attempts 1440 minutes dead-letter storage account",
 stem:`You must keep events that Event Grid fails to deliver within the retry policy so that operators can review them later. Which configuration is correct?`,
 opts:["Lower the event time-to-live to 1 minute, which keeps failed events inside the topic for review","Set dead-lettering on the event subscription with a blob container in a storage account to hold the events","Dead-lettering is on by default, so you only need to read the events from the Event Grid topic","Raise the maximum attempts above 30, which stores any events that were not delivered in a log"],a:1,
 ex:`Dead-lettering is not enabled by default. You specify a storage account container when you create the event subscription, and undelivered events are written there after the retry attempts (default 30) or time-to-live (default 1,440 minutes) is exhausted, whichever limit comes first. The maximum attempts value is capped at 30.`},

/* src: https://learn.microsoft.com/en-us/azure/event-grid/event-filtering */
{s:0,d:3,t:"single",ref:"Event Grid advanced filtering data field custom event subject begins with StringIn",
 stem:`A custom topic publishes order events with subjects such as /orders/eu/1001 and a data.priority field. A subscription must receive only events for subjects that begin with /orders/eu and have data.priority equal to "high". What should you configure?`,
 opts:["A subject begins with filter of /orders/eu and an advanced filter that uses StringIn on data.priority","An event type filter of high, since event types are matched against fields found inside the data","Only an advanced filter on Subject, since the data field cannot be used together with another filter","A SQL rule with the expression data.priority = 'high', because Event Grid subscriptions accept SQL rules"],a:0,
 ex:`Subscriptions can combine a subject prefix filter with advanced filters, which compare values in the event data by using a key such as data.priority and an operator such as StringIn. Event Grid filters are event types, subject prefix or suffix, and advanced filters rather than SQL rules, and event types match the type field, not data. String comparisons in these filters are not case-sensitive.`},

/* src: https://learn.microsoft.com/en-us/azure/event-grid/delivery-and-retry */
{s:0,d:3,t:"single",ref:"Event Grid at least once delivery no ordering guarantee idempotent handler",
 stem:`A function subscribed to Event Grid updates an inventory count for each event. After endpoint timeouts, counts are sometimes too high, and updates can arrive out of order. Which design addresses both observations?`,
 opts:["Rely on the delivery order of Event Grid, and increase the endpoint timeout so that no retries happen","Make the handler idempotent by event id and not depend on order, because delivery is at least once","Set the event time-to-live to 1 minute so that each event is delivered exactly once to the endpoint","Switch the event schema to CloudEvents, which guarantees both ordered and exactly-once delivery"],a:1,
 ex:`Event Grid delivers each event at least once per matching subscription and does not guarantee order, so duplicates and reordering are possible, especially after timeouts and retries. The handler has to tolerate both, for example by tracking event ids. Neither a shorter time-to-live nor a schema choice changes that.`},

/* src: https://learn.microsoft.com/en-us/azure/azure-functions/functions-triggers-bindings */
{s:0,d:3,t:"single",ref:"Azure Functions exactly one trigger input output bindings return value",
 stem:`You design a function that runs when a queue message arrives, reads a Blob Storage item and writes a document to Azure Cosmos DB. Which description matches how Azure Functions models this?`,
 opts:["One queue trigger, a Blob input binding and a Cosmos DB output binding on the same function","Three triggers, one per service, because every service the function touches needs its own trigger","One queue trigger and two output bindings, since an input binding can only be a trigger itself","No trigger, because bindings alone are enough to start a function from a queue message"],a:0,
 ex:`A function must have exactly one trigger, and bindings are optional: it can have any number of input and output bindings, and the trigger is itself a special kind of input binding. A function cannot have several triggers, and without a trigger nothing invokes it.`},

/* src: https://learn.microsoft.com/en-us/azure/azure-functions/functions-scale */
{s:0,d:3,t:"single",ref:"Azure Functions hosting plan Flex Consumption virtual network integration serverless scale to zero",
 stem:`You are creating a new serverless function app in Python. It must scale to zero, scale out quickly on events, use pre-provisioned instances to cut cold starts, and reach resources through virtual network integration. Which hosting plan should you choose?`,
 opts:["Consumption plan, which is the recommended option for new serverless apps and supports virtual networks","Dedicated plan, since it is the only plan that can scale to zero when no events are arriving","Flex Consumption plan, which supports always-ready instances and virtual network integration","Container Apps with a Windows image, because Python function apps run only on Windows containers"],a:2,
 ex:`The Flex Consumption plan is the recommended serverless host for new apps: it scales to zero, supports always-ready instances and virtual network integration, and runs on Linux, which is the only OS for the Python runtime. The Consumption plan is legacy and has no virtual network integration, and the Dedicated plan scales manually or by autoscale rather than on events.`},

/* src: https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-service-bus-trigger */
{s:0,d:3,t:"single",ref:"Azure Functions Service Bus trigger autoCompleteMessages peek-lock settlement",
 stem:`A Service Bus-triggered function settles each message itself, by completing, abandoning or dead-lettering in code. Messages are being completed twice, and the second attempt causes errors. What should you configure?`,
 opts:["Set maxConcurrentCalls to 1 so that only one invocation completes a message at a time","Set the connection to a Key Vault reference, because settlement errors come from shared secrets","Set autoCompleteMessages to false, because by default the runtime calls Complete after a success","Set the receive mode to receive-and-delete, which removes the need to settle each message in code"],a:2,
 ex:`The Functions runtime receives messages in peek-lock mode and by default calls Complete if the function succeeds, or Abandon if it fails. When your code settles messages, turn automatic completion off, either in host.json or on the trigger attribute. Concurrency and the connection source do not control completion.`},

/* src: https://learn.microsoft.com/en-us/azure/azure-functions/functions-scale */
{s:0,d:3,t:"single",ref:"Azure Functions HTTP trigger 230 seconds timeout long running Durable Functions async pattern",
 stem:`An HTTP-triggered function in a Flex Consumption app runs a document analysis that takes about 6 minutes. Clients receive a timeout after roughly 4 minutes even though functionTimeout is not reached. How should you handle this?`,
 opts:["Raise functionTimeout to unbounded, because that setting limits how long an HTTP response can be","Move the app to the Premium plan, since only that plan can respond to HTTP calls after 230 seconds","Return an immediate response and run the work asynchronously, for example with the Durable Functions async pattern","Add a second HTTP trigger to the same function so that the load balancer keeps the connection open"],a:2,
 ex:`Regardless of the function app timeout, 230 seconds is the maximum time an HTTP-triggered function can take to respond, because of the default idle timeout of Azure Load Balancer. For longer work, defer the work and return at once, for example with the Durable Functions async pattern. A bigger plan or timeout does not change that limit.`},

/* src: https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-service-bus-trigger */
{s:0,d:3,t:"single",ref:"Azure Functions Service Bus trigger scaling permissions Manage Data Owner peek-based estimation",
 stem:`A Service Bus-triggered function uses an identity-based connection with a role that can only receive messages. The app works, but scaling reacts slowly and sometimes incorrectly to queue depth, with no startup errors. What is the likely cause and fix?`,
 opts:["The extension needs the Azure Service Bus Data Owner role (or Manage for SAS) to read accurate message counts","The role must be Data Sender, because the extension has to write scale metrics back to the queue","Functions cannot scale on Service Bus queue depth at all, so the trigger needs a fixed instance count","The app has to use a connection string with a Listen right, since identities cannot scale a function"],a:0,
 ex:`The extension reads accurate message counts through the Service Bus administration API, which needs more than receive permissions: Manage for SAS, or the Data Owner role (or a custom role with Microsoft.ServiceBus/namespaces/*/read) for identities. Without it the extension silently falls back to peek-based estimation.`},

/* src: https://learn.microsoft.com/en-us/azure/azure-functions/functions-scale */
{s:0,d:3,t:"single",ref:"Azure Functions custom container Linux hosting options Premium Dedicated Container Apps Flex no container",
 stem:`A team must run its function app from its own Linux container image with custom libraries. Which hosting options support this?`,
 opts:["Flex Consumption and Consumption, because both support a custom container image on Linux","Only the Consumption plan, because the other plans run code-only deployments with no container","Premium, Dedicated or Azure Container Apps, while Flex Consumption does not support containers","Dedicated only, since the Premium plan and Container Apps are available only for Windows apps"],a:2,
 ex:`The hosting comparison lists container support on Linux for the Premium plan, the Dedicated plan and Azure Container Apps. Flex Consumption and the legacy Consumption plan are code-only. Windows deployments are code-only, because Functions does not support Windows containers.`},
];
