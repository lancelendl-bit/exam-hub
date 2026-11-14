// AI-901 skill area: Implement generative AI apps and agents by using Foundry (all d:2).
// Prompts, model deployment and playgrounds, Foundry SDK chat clients, agents in the portal and agent client apps.
// e1 = Mock Exam I, e2 = Mock Exam II. Every item cites the Learn page it was verified against.

export const e1=[
/* src: https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/chatgpt */
{s:0,d:2,t:"single",ref:"few-shot learning example user assistant messages after system message",
 stem:`A support app sends each customer email to a deployed chat model and must get back only one category label, such as Billing, Shipping or Returns. With a zero-shot prompt, the replies come back as long sentences in varied formats. Which prompt change best conditions the model to return labels in the expected format?`,
 opts:["Raise the temperature toward 2, so that the model explores more phrasings before it settles on one label for each email","Remove the system message, so that the user message carries all of the rules and the model has less text to process","Add example user and assistant message pairs after the system message, each one an email followed by its label","Fine-tune the model on labeled emails first, because chat models ignore any examples that are sent inside a prompt"],a:2,
 ex:`This is few-shot learning: with chat models you add example user and assistant interactions to the messages array after the system message, and the examples prime the model to respond in the same way. A higher temperature makes output more random, not more consistent, and removing the system message throws away the instructions instead of adding guidance.`},

/* src: https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/chatgpt */
{s:0,d:2,t:"single",ref:"grounding data system message answer only from context say I don't know",
 stem:`An HR chatbot must answer questions about the company leave policy, which is a short document, and must not answer from outside knowledge. Which approach matches the Learn guidance on using data for grounding?`,
 opts:["Tell the model in the user message to answer from its training data, and set temperature to 0 so its answers are factual","Put the policy text in the system message, tell the model to answer only from that context, and say I don't know otherwise","Send only the employee question with no system message, because grounding text in a prompt makes the model fabricate","Add three few-shot examples of unrelated questions, so the model learns the policy facts permanently for later requests"],a:1,
 ex:`For a small amount of information, you can include it in the system message and tell the model to answer only from that context, with an explicit "I don't know" fallback. For large data, you retrieve the relevant parts at query time, for example with embeddings or Azure AI Search. A low temperature makes output more focused but doesn't supply facts the model doesn't have, and few-shot examples only condition the current request.`},

/* src: https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/advanced-prompt-engineering */
{s:0,d:2,t:"single",ref:"system message role scope tone output format",
 stem:`Every reply from a chat app must use a friendly tone, stay on the topic of gardening and return JSON with fixed keys. Where should you define these rules?`,
 opts:["In the system message, which sets the assistant's role, boundaries, tone and output format for the conversation","In each assistant message, so that the model reads the rules back as its own earlier answers before every reply","In the deployment settings, by choosing a deployment type that applies a fixed tone and output format to replies","In the max_tokens parameter, by setting it low enough that the model can produce only short JSON replies on topic"],a:0,
 ex:`A system message is the set of instructions and context that guides the model. You use it to define the assistant's role and boundaries, set its tone and specify output formats such as JSON. It typically appears first and acts as the highest-level instructions. Deployment types control where data is processed and how you pay, not tone, and max_tokens only limits length.`},

/* src: https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/prompt-engineering */
{s:0,d:2,t:"multi",n:2,ref:"reduce fabrication citations give the model an out not found",
 stem:`A chat app answers questions about product documents that are pasted into the prompt, and testers report occasional made-up facts. Which two prompt techniques from the Learn prompt engineering guidance help reduce this? Each correct answer presents a complete solution.`,
 opts:["Ask the model to cite the source inline for each statement it makes","Raise the temperature so the model weighs a wider range of answers","Give the model an out, such as reply not found if there is no answer","Remove the documents so the model relies only on its trained knowledge","Place every instruction in the middle of the documents to hide them"],a:[0,2],
 ex:`Asking for citations makes grounded statements much more likely, because a fabricated answer would also need a bad citation, and inline citations work better than citations at the end. Giving the model an alternative path, such as "respond with 'not found' if the answer isn't present", also helps it avoid false responses. A higher temperature makes output more random, and removing grounding data removes one of the most effective ways to get reliable answers.`},

/* src: https://learn.microsoft.com/en-us/azure/foundry/concepts/concept-playgrounds */
{s:0,d:2,t:"single",ref:"model not available in deployment list region support",
 stem:`In the Foundry portal you want to deploy a model that you found in the model catalog, but it isn't available to deploy in your project, while other models deploy normally. What is the most likely cause?`,
 opts:["The project has no agent yet, and catalog models stay unavailable until the first agent in the project is created","The model isn't offered in the region of your Foundry resource, so you should check its regional availability","The model can be deployed only from the Python SDK, because the portal deploys Azure OpenAI models and no others","The playground is closed, and a model can be deployed only while a chat session in the playground is still open"],a:1,
 ex:`The playgrounds troubleshooting table lists "Model not available in deployment list" with the fix "Check model regional availability for your Foundry resource region", and the deployment article says your project and resource must be in a supported region for the model. The portal deploys partner models too (its own example is a Llama model), and you don't need an agent or an open playground to deploy.`},

/* src: https://learn.microsoft.com/en-us/azure/foundry/concepts/concept-playgrounds */
{s:0,d:2,t:"single",ref:"model playground compare models up to three side by side",
 stem:`You have deployed two chat models and want to send the same prompt and system message to both and see their answers side by side in the Foundry portal before choosing one. What should you use?`,
 opts:["Compare models in the model playground, which runs up to three models at once with a synced prompt and setup","The agents playground, which allows one agent per project and therefore compares the models one after the other","The Deployments list, where the Succeeded status column shows a quality score for each model's latest test answer","The images playground, which is the playground that the portal opens for every catalog model after deployment"],a:0,
 ex:`Compare mode in the model playground runs up to three models in parallel. Each model gets the same prompt, system message and parameters, and the responses stream side by side so you can compare quality, latency and token use. The deployment list only shows status, and the images playground opens only for image generation models.`},

/* src: https://learn.microsoft.com/en-us/azure/foundry/foundry-models/how-to/deploy-foundry-models */
{s:0,d:2,t:"single",ref:"partner and community models Azure Marketplace subscription terms",
 stem:`You deploy Llama-4-Scout-17B-16E-Instruct and gpt-4o-mini from the Foundry model catalog. For one of the two deployments, the portal asks you to read and accept terms of use before you can continue. What explains this?`,
 opts:["gpt-4o-mini is sold by Azure, so it needs an Azure Marketplace subscription before the deployment is created","Both models need a Marketplace subscription, so the portal asks once and then applies the same terms to the other","Llama-4-Scout comes from partners and community, and those models require an Azure Marketplace subscription","Llama-4-Scout can only be deployed with code, so the terms prompt turns the portal deployment into a script"],a:2,
 ex:`Foundry Models from partners and community, such as Llama-4-Scout-17B-16E-Instruct, require a subscription through Azure Marketplace, so you read the terms and select Agree and Proceed. Foundry Models sold by Azure, such as the Azure OpenAI model gpt-4o-mini, don't need a Marketplace subscription.`},

/* src: https://learn.microsoft.com/en-us/azure/foundry/quickstarts/get-started-code */
{s:0,d:2,t:"single",ref:"get_openai_client AIProjectClient responses.create missing line",
 stem:`A developer writes this chat client with the Foundry SDK (azure-ai-projects 2.x). It fails because <code>openai</code> is not defined.
<div class="code">from azure.identity import DefaultAzureCredential
from azure.ai.projects import AIProjectClient

project = AIProjectClient(
    endpoint=FOUNDRY_PROJECT_ENDPOINT,
    credential=DefaultAzureCredential(),
)
# missing line
response = openai.responses.create(model="gpt-5-mini", input="Hello")
print(response.output_text)</div>
Which line should replace the comment?`,
 opts:["openai = project.agents.create_version()","openai = project.get_openai_client()","openai = DefaultAzureCredential().get_token()","openai = AIProjectClient.from_connection_string()"],a:1,
 ex:`In the Foundry SDK quickstart, you create the project client and then call <code>project.get_openai_client()</code> to get an OpenAI-compatible client that calls the Responses API through your project. <code>agents.create_version()</code> creates an agent, not a client, and connection strings belong to the older hub-based SDK.`},

/* src: https://learn.microsoft.com/en-us/azure/foundry/quickstarts/get-started-code */
{s:0,d:2,t:"single",ref:"Foundry project endpoint format services.ai.azure.com api projects",
 stem:`Which value should you pass as <code>endpoint</code> when you create an <code>AIProjectClient</code> for a Foundry project?`,
 opts:["https://<resource-name>.openai.azure.com/openai/deployments/<deployment-name>","https://<project-name>.cognitiveservices.azure.com/text/analytics/v3.1","https://ai.azure.com/build/<project-name>/playground/chat?model=<model>","https://<resource-name>.services.ai.azure.com/api/projects/<project-name>"],a:3,
 ex:`The project endpoint has the format https://&lt;resource-name&gt;.services.ai.azure.com/api/projects/&lt;project-name&gt;. The ai.azure.com address is the Foundry portal itself, and the other two are service-specific endpoints rather than the project endpoint that the Foundry SDK expects.`},

/* src: https://learn.microsoft.com/en-us/azure/foundry/tutorials/quickstart-create-foundry-resources */
{s:0,d:2,t:"multi",n:2,ref:"DefaultAzureCredential az login Foundry User role keyless",
 stem:`A Python chat client creates an <code>AIProjectClient</code> with <code>DefaultAzureCredential()</code> and no API key. You run it on your own laptop for the first time. Which two conditions must be met for the call to succeed? Each correct answer presents part of the solution.`,
 opts:["You signed in with az login, so the Azure CLI credential in the chain gets a token","Your account has the Foundry User role, so it can use the project's deployed models","The project's API key is in an environment variable that the credential reads first","A managed identity is assigned to the laptop, because the chain tries nothing else","The model playground is open, because the SDK reuses the portal's browser session"],a:[0,1],
 ex:`The quickstarts tell you to run <code>az login</code> before running the samples, and DefaultAzureCredential includes the Azure CLI credential in its chain. The Foundry User role gives the minimum permissions to build and test with the project and its deployed models. The chain doesn't read API keys, and managed identity is only one of several credentials it tries.`},

/* src: https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/chatgpt */
{s:0,d:2,t:"yesno",ref:"Chat Completions messages system role end with user message no memory",
 stem:`You build a console chat loop with the Chat Completions API. For each statement, select Yes if it is true. Otherwise, select No.`,
 rows:["The system message is optional, but you should include at least a basic one to get the best results.","To trigger a reply, the messages list should end with a user message.","The model remembers earlier calls, so each request needs to send only the newest user question."],a:[1,1,0],
 ex:`The system message is optional, but the docs recommend including at least a basic one. You end with a user message to show that it's the assistant's turn. The model has no memory, so a chat loop sends the running transcript with each question, or the model loses the context of earlier questions and answers.`},

/* src: https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/file-search */
{s:0,d:2,t:"single",ref:"agent tool file search uploaded documents vector store",
 stem:`You are building an agent that must answer employee questions from a set of product manuals in PDF files that you upload, and its answers must come from those manuals. Which tool should you add to the agent?`,
 opts:["Code interpreter, which runs Python code in a sandbox to open and summarize the manuals","Web search, which grounds its answers in real-time information from the public web","File search, which indexes your uploaded files in a vector store and retrieves passages","Function calling, which lets the model call custom functions that you write and host"],a:2,
 ex:`File search grounds an agent in your own documents. Files added to a vector store are parsed, chunked and embedded automatically, and the tool runs keyword and semantic search to retrieve relevant content. Web search is for current public information, and code interpreter is for running code over data, not for retrieval across a document set.`},

/* src: https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/code-interpreter */
{s:0,d:2,t:"single",ref:"code interpreter CSV analysis chart sandbox Python",
 stem:`An analyst gives an agent a CSV file of monthly sales and asks it to calculate growth rates and return a bar chart as a PNG file. Which tool lets the agent do this?`,
 opts:["File search, because it splits the CSV into chunks and draws charts from the chunks that match best","Code interpreter, because the model writes and runs Python in a sandbox to analyze data and make charts","Web search, because it looks the growth rates up online and returns a chart with inline URL citations","Memory, because it keeps the CSV values across conversations and renders them as an image when asked"],a:1,
 ex:`Code Interpreter lets an agent's model write and run Python code in a sandboxed environment for data analysis, math and chart generation, and generated files such as charts can be downloaded. File search retrieves text passages and web search retrieves public web content; neither runs code.`},

/* src: https://learn.microsoft.com/en-us/azure/foundry/quickstarts/get-started-code */
{s:0,d:2,t:"single",ref:"agent client conversations.create conversation id multi-turn history",
 stem:`A client app for an existing agent contains this code.
<div class="code">openai = project.get_openai_client(agent_name="hr-agent")
conversation = openai.conversations.create()
r1 = openai.responses.create(conversation=conversation.id,
                             input="How many vacation days do I get?")
r2 = openai.responses.create(conversation=conversation.id,
                             input="And how many sick days?")</div>
Why does the app pass <code>conversation.id</code> to both calls?`,
 opts:["To create a new version of hr-agent for each call, so each answer comes from a fresh definition","To send each question to a different model deployment and keep whichever answer comes back first","To keep the history server side, so the second call sees the first question and answer as context","To delete the first response when the second call starts, so no history is ever stored in Foundry"],a:2,
 ex:`A conversation persists items across turns. When a conversation drives a response, the conversation is provided as model input and the new response is appended to it, so "And how many sick days?" is answered in context. <code>get_openai_client(agent_name=...)</code> binds the client to the agent; it doesn't create versions or route to several deployments.`},

/* src: https://learn.microsoft.com/en-us/azure/foundry/concepts/concept-playgrounds */
{s:0,d:2,t:"multi",n:2,ref:"agents playground attach tools test multi-turn tracing no code",
 stem:`Which two tasks can you perform in the agents playground of the Foundry portal without writing code? Each correct answer presents a complete solution.`,
 opts:["Attach tools such as code interpreter, file search and web search to the agent","Retrain the weights of the agent's model by uploading a set of past conversations","Test multi-turn conversations with the agent and view tracing for its responses","Change the Azure region of the Foundry resource that hosts the agent's project","Package the agent as a container image and publish it as a hosted agent endpoint"],a:[0,2],
 ex:`In the agents playground you can configure instructions, attach tools such as code interpreter, file search and web search, add knowledge sources, test multi-turn conversations and view tracing and evaluation data. Retraining a model is fine-tuning, not a playground action, and hosted agents are code you package and deploy yourself.`},

/* src: https://learn.microsoft.com/en-us/azure/foundry/agents/overview */
{s:0,d:2,t:"single",ref:"prompt agent least to manage instructions model tools hosted agent",
 stem:`A team wants its first agent running quickly. They will set instructions, a model and tools, and they don't want to write orchestration code or manage containers. Which option in Foundry Agent Service fits?`,
 opts:["A hosted agent, which runs your own framework code as a container behind a managed endpoint","An ephemeral agent, which stores its definition in Foundry as a persisted and versioned resource","A voice-based prompt agent, which is required whenever an agent uses tools such as file search","A prompt agent, which Foundry runs for you from the instructions, model and tools you configure"],a:3,
 ex:`Prompt agents are the fastest path: you define instructions, a model and tools, and Foundry runs the agent with no code or infrastructure to manage. Hosted agents give the most control but you bring your own code as a container. An ephemeral agent is the opposite of persisted: its definition lives in your application code and you call the Responses API directly.`},
];

export const e2=[
/* src: https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/prompt-engineering */
{s:0,d:2,t:"single",ref:"recency bias repeat instructions at the end of the prompt",
 stem:`You paste a long report into a prompt, and the model sometimes ignores the formatting instructions that you placed at the very start. Which technique from the prompt engineering guidance should you try first?`,
 opts:["Repeat the instructions at the end of the prompt, since recency bias gives later text more influence","Send the instructions in a separate earlier request, since the model remembers them on the next call","Raise top_p and temperature together, since changing both at once makes the output format consistent","Remove all separators and headings, since clear syntax such as --- confuses models and wastes tokens"],a:0,
 ex:`Models can be susceptible to recency bias, where information at the end of the prompt has more influence than information at the beginning, so the guidance suggests repeating instructions at the end. The model has no memory between calls, the docs recommend changing temperature or top_p but not both, and clear syntax such as --- separators is recommended.`},

/* src: https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/prompt-engineering */
{s:0,d:2,t:"single",ref:"prime the output cue bulleted list",
 stem:`You want a model to return a summary as a bulleted list. Which change to the prompt primes the output toward that format?`,
 opts:["Start the prompt by asking for as many words as possible, so that the list has more detail in it","Send the request without any system message, so that the model uses its default list formatting","Set max_tokens to 1, because a very low token limit forces the model to switch into list formatting","End the prompt with a cue such as: Here's a bulleted list of key points, then a new line and -"],a:3,
 ex:`Priming the output means ending the prompt with a few words that the model builds on. The guidance's example cue, "Here's a bulleted list of key points:\\n- ", helps make sure the output is formatted as bullet points. A token limit of 1 would cut the reply off, and removing the system message removes guidance rather than adding it.`},

/* src: https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/advanced-prompt-engineering */
{s:0,d:2,t:"single",ref:"system message when unsure policy clarifying question fallback",
 stem:`An internal IT support assistant guesses when a request is vague or missing details. Based on the system message design guidance, what should you add to its system message?`,
 opts:["A list of every question users might ask, because a system message covers only the requests it lists","A fallback: ask a clarifying question if details are missing, then say you don't know if still unsure","A rule to always answer with full confidence, because hedged replies are blocked as a safety violation","A temperature value written as text, because the system message sets the model's sampling parameters"],a:1,
 ex:`The design checklist says to add a "when unsure" policy that tells the model what to do when a request is ambiguous, out of scope or missing information. The docs' technical support example asks a clarifying question and then says it doesn't know if it still can't answer. Sampling parameters such as temperature are set on the request, not in the system message text.`},

/* src: https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/advanced-prompt-engineering */
{s:0,d:2,t:"yesno",ref:"system message no guarantee highest-level instructions overly long",
 stem:`You are writing a system message for a customer-facing chat app. For each statement, select Yes if it is true. Otherwise, select No.`,
 rows:["A well-written system message guarantees that the model follows every rule it contains.","In chat APIs the system message typically comes first and acts as the highest-level set of instructions.","An overly long system message uses context window space and leaves less room for user content."],a:[0,1,1],
 ex:`A system message influences the model but doesn't guarantee compliance, so you still test and layer it with other mitigations such as filtering and evaluation. It typically appears first and acts as the highest-level instructions. The docs list overly long system messages as a common pitfall because they consume context window and reduce room for user content.`},

/* src: https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/prompt-engineering */
{s:0,d:2,t:"single",ref:"few-shot examples condition current inference only not permanent",
 stem:`A colleague says that once you send five few-shot examples in a prompt, the deployed model permanently learns the pattern for every later request. Which statement is accurate?`,
 opts:["The examples condition the model only for the current request and don't change the model itself","The examples are saved with the deployment and apply to later calls until the deployment is deleted","The examples work only with the completion API and are ignored when they are sent as chat messages","The examples update the model weights, which is why the docs describe few-shot prompts as fine-tuning"],a:0,
 ex:`The prompt engineering article says few-shot learning isn't learning in the sense that the model is permanently changed; the examples condition the model only for the current inference. With chat models you add them as example user and assistant messages, so to reuse them you send them with each request.`},

/* src: https://learn.microsoft.com/en-us/azure/foundry/concepts/concept-playgrounds */
{s:0,d:2,t:"yesno",ref:"model playground compare three models open in VS Code tools compare mode",
 stem:`You are testing deployed models in the Foundry model playground. For each statement, select Yes if it is true. Otherwise, select No.`,
 rows:["Compare mode can run up to three models at once with the same prompt and system message.","From the Code tab, Open in VS Code for the Web imports the code sample, endpoint and key.","The Tools section stays visible in the playground while compare mode runs several models."],a:[1,1,0],
 ex:`Compare mode runs up to three models with synced input. Open in VS Code for the Web, on the Code tab, imports the code sample, API endpoint and key into a VS Code for the Web workspace. The Tools section isn't visible in compare mode; you close the other models first to see it.`},

/* src: https://learn.microsoft.com/en-us/azure/foundry/concepts/concept-playgrounds */
{s:0,d:2,t:"single",ref:"model playground Save as agent continue in agents playground",
 stem:`You tuned a system prompt for a deployed model in the model playground. You now want to add knowledge and memory and continue prototyping it as an agent. What should you select?`,
 opts:["Compare models, which turns the current chat into an agent and adds two more models as its tools","Deploy base model, which creates a second deployment that the portal then treats as an agent","Save as agent, which continues work in the agents playground with tools, knowledge and memory","Open in VS Code for the Web, which publishes the chat to Microsoft Teams as an agent with memory"],a:2,
 ex:`From the model playground you can select Save as agent to continue prototyping in the agents playground, where you add tools, knowledge and memory. Compare models runs models side by side, Deploy base model creates a model deployment, and Open in VS Code for the Web moves the code sample into an editor.`},

/* src: https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/chatgpt */
{s:0,d:2,t:"single",ref:"chat.completions.create choices[0].message.content reply text",
 stem:`A Python app calls a deployed chat model with the Chat Completions API.
<div class="code">response = client.chat.completions.create(
    model="YOUR-DEPLOYMENT-NAME",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Who founded Microsoft?"},
    ],
)</div>
Which expression returns the text of the assistant's reply?`,
 opts:["response.messages[-1].content","response.choices[0].message.content","response.output[0].role","response.usage.completion_tokens"],a:1,
 ex:`A chat completion returns a list of choices, and the reply text is in <code>response.choices[0].message.content</code>. The usage object reports token counts, not text. The Responses API, used in the Foundry SDK quickstart, exposes the text as <code>response.output_text</code> instead.`},

/* src: https://learn.microsoft.com/en-us/azure/foundry/foundry-models/how-to/deploy-foundry-models */
{s:0,d:2,t:"single",ref:"deployment name model parameter routes requests",
 stem:`In the Foundry portal you deploy gpt-5-mini and change the deployment name to support-chat before you select Deploy. Which value should your code pass in the <code>model</code> parameter of <code>responses.create()</code>?`,
 opts:["gpt-5-mini, because the model parameter always takes the catalog model name and ignores deployments","The model version string, because the parameter must match the version listed on the model card","The project endpoint URL, because the model parameter selects the project that contains the deployment","support-chat, because the deployment name in the model parameter routes requests to that deployment"],a:3,
 ex:`A deployment uses the model name by default, but you can change it. During inference, the deployment name goes in the <code>model</code> parameter to route requests to that deployment, so the code passes support-chat. The endpoint is set when you create the client, not in the model parameter.`},

/* src: https://learn.microsoft.com/en-us/azure/developer/python/sdk/authentication/credential-chains */
{s:0,d:2,t:"single",ref:"DefaultAzureCredential managed identity same code local and Azure",
 stem:`A chat client that uses <code>DefaultAzureCredential</code> works on your laptop after you run az login. You deploy it to an Azure App Service app that has a managed identity with access to the Foundry project. What change does the authentication code need so that it works there?`,
 opts:["Replace DefaultAzureCredential with an API key, because managed identities can't call Foundry projects","Add az login to the app's startup script, because only the Azure CLI credential can call the project","None: DefaultAzureCredential also tries managed identity, so the same code can authenticate in Azure","Switch the client to a connection string, because AIProjectClient accepts credentials only on a laptop"],a:2,
 ex:`DefaultAzureCredential is a preconfigured chain that tries environment, workload identity, managed identity, Azure CLI and other credentials in order, so an app can move from local development to Azure without changing authentication code. The docs do suggest switching to a specific credential such as ManagedIdentityCredential in production for easier debugging and faster startup, but that is an optimization, not a requirement.`},

/* src: https://learn.microsoft.com/en-us/azure/foundry/quickstarts/get-started-code */
{s:0,d:2,t:"multi",n:2,ref:"pip install azure-ai-projects azure-identity Foundry SDK",
 stem:`You start a lightweight Python chat client that follows the Foundry SDK quickstart: it uses <code>AIProjectClient</code> and authenticates with <code>DefaultAzureCredential</code>. Which two packages provide these classes? Each correct answer presents part of the solution.`,
 opts:["azure-ai-projects","azure-identity","azure-ai-textanalytics","azure-cognitiveservices-speech","azure-storage-blob"],a:[0,1],
 ex:`<code>AIProjectClient</code> comes from <code>azure-ai-projects</code> (version 2.x for the current Foundry projects API), and <code>DefaultAzureCredential</code> comes from <code>azure-identity</code>. The other packages are the Language, Speech and Blob Storage SDKs.`},

/* src: https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/web-search */
{s:0,d:2,t:"single",ref:"web search tool real-time public web inline citations",
 stem:`A travel agent built in Foundry must answer questions about today's flight disruptions and show users where the information came from. Which tool should you add to it?`,
 opts:["File search, so the agent retrieves passages from a vector store of last year's travel guides","Code interpreter, so the agent writes Python that predicts today's disruptions from sample data","Function calling with no functions defined, so the model falls back on its own trained knowledge","Web search, so the agent grounds replies in real-time public web data with inline citations"],a:3,
 ex:`The web search tool lets the agent's model retrieve and ground responses with real-time information from the public web, and it returns answers with inline URL citations. File search only covers files you uploaded, and neither code interpreter nor the model's training data knows about today's disruptions.`},

/* src: https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/prompt-agents */
{s:0,d:2,t:"single",ref:"prompt agent instructions role behavior boundaries expected output",
 stem:`When you define a prompt agent, which setting describes the agent's role, behavior, boundaries and expected output?`,
 opts:["Instructions, which describe the agent's role, behavior, boundaries and expected output","Model, which provides the reasoning and also stores the rules for behavior and output format","Tools, which list the actions the agent can take and also hold its role and boundaries","Toolboxes, which group tools behind an MCP endpoint and also define the agent's persona"],a:0,
 ex:`A prompt agent is defined by a model, instructions and tools. The model provides reasoning and language capabilities, the instructions describe the role, behavior, boundaries and expected output, and tools let the agent retrieve information or take actions. Toolboxes group reusable tools behind a managed MCP-compatible endpoint.`},

/* src: https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/prompt-agents */
{s:0,d:2,t:"single",ref:"prompt agent save creates new version history",
 stem:`You change the instructions of a saved prompt agent in the Foundry portal and then save the agent. What happens?`,
 opts:["The edit overwrites the agent in place, and the earlier instructions can't be recovered afterward","The edit is kept only in the playground session and is lost when you close the browser tab","Saving creates a new version of the agent, and earlier definitions stay in its version history","Saving creates a separate agent with a new name, and existing conversations move to it automatically"],a:2,
 ex:`A saved prompt agent is a versioned resource in a Foundry project. Saving a change to its model, instructions, tools or skills creates a new version, and earlier definitions are kept in the agent's version history.`},

/* src: https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/runtime-components */
{s:0,d:2,t:"single",ref:"previous_response_id follow-up without conversation",
 stem:`A client app for an agent asks a follow-up question. The app doesn't create a conversation.
<div class="code">openai = project.get_openai_client(agent_name="travel-agent")
response = openai.responses.create(input="What is the largest city in France?")
follow_up = openai.responses.create(
    # missing argument
    input="What is the population of that city?",
)</div>
The follow-up must know that "that city" means the city in the first answer. Which argument completes the call?`,
 opts:["conversation=response.output_text","agent_version=response.id","previous_response_id=response.id","store=False"],a:2,
 ex:`Without a conversation, you chain turns by passing <code>previous_response_id</code>; by default the service stores response history server side, so the follow-up gets the earlier context. <code>conversation</code> takes a conversation ID, not response text, and <code>store=False</code> stops the service from keeping the response, which would make the client carry context itself.`},

/* src: https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/file-search */
{s:0,d:2,t:"multi",n:2,ref:"file search vector store upload_and_poll FileSearchTool vector_store_ids",
 stem:`You use the Foundry SDK to give a prompt agent access to product documents through file search. Which two steps are required? Each correct answer presents part of the solution.`,
 opts:["Upload the files to a vector store and wait for ingestion to finish","Deploy an embedding model and write code that chunks every file","Add FileSearchTool with the vector store ID to the agent's tools","Add CodeInterpreterTool so that the agent can open each PDF file","Create one vector store per file and attach each store to the agent"],a:[0,2],
 ex:`You upload files to a vector store (for example with <code>upload_and_poll</code>, which returns after ingestion), then add <code>FileSearchTool(vector_store_ids=[...])</code> to the agent definition. The service parses, chunks and embeds files itself, so you don't build that pipeline. A vector store holds up to 10,000 files, and an agent can currently have at most one vector store attached.`},
];
