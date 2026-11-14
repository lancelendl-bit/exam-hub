// AI-901 skill area: Implement AI solutions for information extraction by using Foundry (d:2).
// Azure Content Understanding in Foundry Tools: documents, images, audio, video, analyzers, field schemas,
// confidence and grounding, segmentation, and a lightweight client app. Every item cites its Learn source.

export const e1=[
/* src: https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/overview */
{s:0,d:2,t:"single",ref:"Content Understanding field method generate summary audio conversation",
 stem:`You build a custom audio analyzer in Azure Content Understanding in Foundry Tools for support calls. A field named CallSummary must hold a short summary of each conversation, written by the model. Which field method should you set for CallSummary?`,
 opts:["extract, so the value is copied exactly as it appears in the source content","classify, so the value is chosen from a fixed list of summary categories","generate, so the model writes the value freely from the input content","No method, because summaries must come from a separate Azure Language call"],a:2,
 ex:`Content Understanding has three field methods. Generate produces values freely from the input, such as summarizing an audio conversation. Extract copies values as they appear in the input and is supported for documents only, so it can't be used on an audio analyzer. Classify picks a value from a predefined set of categories.`},

/* src: https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/video/overview */
{s:0,d:2,t:"single",ref:"Content Understanding video segmentation enableSegment contentCategories news stories",
 stem:`A broadcaster uses Content Understanding to analyze recorded news programs. Each program must be split into one segment per news story, ignoring ads, so each story can be indexed on its own. What should you configure on the custom video analyzer?`,
 opts:["Set enableSegment to true and describe the story-based split in a contentCategories description","Set enableSegment to false so the service treats the whole program as a single segment","Set returnDetails to true so that the shot timestamps in cameraShotTimesMs become the segments","Add a classify field whose enum lists every story title that could appear in a broadcast"],a:0,
 ex:`With enableSegment set to true, you describe the segmentation logic in natural language in contentCategories, and the model creates segments to match, for example one per news story. Setting enableSegment to false treats the entire video as one segment. Shot detection (cameraShotTimesMs) marks camera cuts, not story boundaries.`},

/* src: https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/concepts/analyzer-reference */
{s:0,d:2,t:"single",ref:"Content Understanding analyzer models property model name deployment defaults",
 stem:`Your custom analyzer definition sets "models": {"completion": "gpt-5.2"}. In your Foundry resource, that model is deployed under the deployment name cu-chat. How does Content Understanding find the deployment at analysis time?`,
 opts:["It fails, because the models property must contain the deployment name cu-chat rather than a model name","It maps the model name to the deployment you set as the default for that model at the resource level","It deploys a new copy of gpt-5.2 automatically each time the analyzer receives an analyze request","It ignores the models property and always uses a model that Microsoft hosts for Content Understanding"],a:1,
 ex:`The models property takes Foundry catalog model names, not deployment names. At runtime the service maps each model name to the model deployment you configured as a default at the resource level (or one supplied in the analyze request). You bring your own deployments, so the service doesn't host or create them per request.`},

/* src: https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/quickstart/use-rest-api */
{s:0,d:2,t:"single",ref:"Content Understanding REST analyze 202 Operation-Location poll status Succeeded",
 stem:`Your app sends POST {endpoint}/contentunderstanding/analyzers/prebuilt-invoice:analyze and receives HTTP 202 Accepted. How does the app get the extracted fields?`,
 opts:["Read the fields from the body of the 202 response, which already holds the complete analysis result","Send the same POST request again until the service returns 200 with the fields included","Call GET on the analyzer definition at /analyzers/prebuilt-invoice to download the results","Call GET on the Operation-Location URL and poll until the status field returns Succeeded"],a:3,
 ex:`Analysis is asynchronous. The 202 response carries an Operation-Location header that points to analyzerResults/{request-id}. You GET that URL and poll every one to two seconds while status is NotStarted or Running; when status is Succeeded, the result object contains the fields. GET on the analyzer itself returns its definition, not results.`},

/* src: https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/choosing-right-ai-tool */
{s:0,d:2,t:"single",ref:"choose Document Intelligence containers on-premises air-gapped vs Content Understanding",
 stem:`A government agency must extract fields from standard application forms on servers that have no connection to the internet. Which option does Microsoft Learn recommend for this requirement?`,
 opts:["A Content Understanding custom analyzer that runs in a zero-shot mode","A Content Understanding prebuilt-layout analyzer that is called over REST","Document Intelligence containers that run on the agency's own servers","A multimodal model deployed in Foundry and called with an extraction prompt"],a:2,
 ex:`For on-premises or air-gapped deployment, the decision guide recommends Document Intelligence containers and notes they're the only option today. Content Understanding analyzers and Foundry model deployments are cloud services that the app calls over the network.`},

/* src: https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/document/overview */
{s:0,d:2,t:"multi",n:2,ref:"Content Understanding confidence grounding estimateFieldSourceAndConfidence human review",
 stem:`An accounts payable team processes invoices with a custom document analyzer. Values the model is unsure about must go to a person, and reviewers must see where on the page each value came from. Which two actions should you take? Each correct answer presents part of the solution.`,
 opts:["Set estimateFieldSourceAndConfidence to true in the analyzer config","Set tableFormat to markdown so reviewers can read tables more easily","Route fields whose confidence score is low to a human review queue","Change every field method to generate so confidence is always one","Set enableFormula to true so the analyzer returns source locations"],a:[0,2],
 ex:`Confidence and grounding are opt-in for document fields: set estimateFieldSourceAndConfidence to true (or estimateSourceAndConfidence on a field). Each value then has a 0 to 1 confidence score and a source location. Learn recommends routing low-confidence or poorly grounded values to human review and letting high-confidence values continue automatically. Table format and formula detection don't add confidence or grounding.`},

/* src: https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/audio/overview */
{s:0,d:2,t:"multi",n:2,ref:"prebuilt-callCenter output summary sentiment",
 stem:`A contact center sends call recordings to the prebuilt-callCenter analyzer without creating a custom analyzer. Which two outputs does this analyzer return? Each correct answer presents a complete solution.`,
 opts:["A short summary of the call","The overall sentiment of the call","A spoken audio reply in the agent's voice","Key frame thumbnails for each call scene","A copy of the call translated into French"],a:[0,1],
 ex:`prebuilt-callCenter returns a transcript with speaker role detection, a call summary, call sentiment, mentioned companies and people, top articles, and call categories. It doesn't synthesize speech or translate the recording, and key frames are a video output.`},

/* src: https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/concepts/classifier */
{s:0,d:2,t:"yesno",ref:"Content Understanding classification contentCategories other category training page",
 stem:`You use Content Understanding classification to sort scanned loan packages into document types. For each statement, select Yes if it is true. Otherwise, select No.`,
 rows:["You must provide a labeled training dataset before the analyzer can classify documents.","If you don't include an other category in contentCategories, every file is classified into one of your defined categories.","With the GA API, the smallest unit a document can be classified at is a single page."],a:[0,1,1],
 ex:`Classification doesn't need a training dataset; you define category names and descriptions. Without an other category, content is forced into one of your categories. In the GA version the minimum unit is one page, and in-page segmentation is available only in the 2026-06-01-preview API version (preview).`},

/* src: https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/image/overview */
{s:0,d:2,t:"single",ref:"Content Understanding image analyzer not optimized text extraction use document schema",
 stem:`A warehouse takes phone photos of printed shipping forms and wants to pull the sender, recipient, and tracking number from the text on each form. Which approach does Learn recommend in Content Understanding?`,
 opts:["An image analyzer based on prebuilt-image with a free-form description field","A document field extraction schema, because the analysis depends mostly on text","The prebuilt-imageSearch analyzer, which writes a one-paragraph description","A video analyzer, because it samples frames and runs OCR on each sampled frame"],a:1,
 ex:`Learn notes that image analyzers aren't optimized for scenarios where the analysis is based mainly on extracted text, and suggests a document field extraction schema instead. prebuilt-imageSearch generates a description of the image for search, not structured text fields.`},
];

export const e2=[
/* src: https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/tutorial/create-custom-analyzer */
{s:0,d:2,t:"single",ref:"Content Understanding image analyzer classify enum chart type",
 stem:`You build a custom image analyzer for pictures of business charts. A field named ChartType must always be one of bar, line, or pie. How should you define the field?`,
 opts:["type string, method classify, and an enum that lists bar, line, and pie","type string, method extract, and a description that names the three chart types","type array, method generate, and items that each hold one of the chart types","type boolean, method classify, and one separate field for each chart type"],a:0,
 ex:`The classify method picks a value from a predefined set, so you add an enum with the allowed values, as in the tutorial's chart analyzer. Extract copies values as they appear and is supported for documents only, so it doesn't fit an image analyzer. Generate writes free-form values and wouldn't restrict the output to the three types.`},

/* src: https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/choosing-right-ai-tool */
{s:0,d:2,t:"single",ref:"choose prebuilt-contract inferred fields unstructured legal agreements",
 stem:`A legal team wants to pull the parties and the contract end date from service agreements. Many agreements state only a start date and a term length, so the end date has to be worked out. Which tool does Learn recommend?`,
 opts:["A Document Intelligence prebuilt model, built for standard structured forms","A Document Intelligence custom model trained on five labeled agreement samples","The Content Understanding prebuilt-layout analyzer, which returns tables and sections","The Content Understanding prebuilt-contract analyzer, which can infer missing fields"],a:3,
 ex:`For unstructured documents such as legal agreements, Learn recommends Content Understanding and prebuilt-contract. It can infer fields not stated in the document, such as deriving an end date from a start date and duration. Document Intelligence models are aimed at structured documents, and prebuilt-layout returns layout without field extraction.`},

/* src: https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/quickstart/use-rest-api */
{s:0,d:2,t:"single",ref:"Content Understanding Python SDK ContentUnderstandingClient begin_analyze poller result",
 stem:`You write a small Python app with the azure-ai-contentunderstanding package. You already created client = ContentUnderstandingClient(endpoint=endpoint, credential=AzureKeyCredential(key)). Which code analyzes an invoice at invoice_url and waits for the result?`,
 opts:["result = client.get_analyzer(analyzer_id=\"prebuilt-invoice\", inputs=[AnalysisInput(url=invoice_url)])","result = client.begin_create_analyzer(analyzer_id=\"prebuilt-invoice\", resource=AnalysisInput(url=invoice_url)).result()","result = client.begin_analyze(analyzer_id=\"prebuilt-invoice\", inputs=[AnalysisInput(url=invoice_url)]).result()","result = client.analyze_text(model=\"prebuilt-invoice\", documents=[invoice_url])"],a:2,
 ex:`begin_analyze starts the long-running analysis and returns a poller; calling result() waits until it finishes and returns an AnalysisResult whose contents hold the fields. get_analyzer returns an analyzer's definition, and begin_create_analyzer creates a custom analyzer rather than analyzing a file.`},

/* src: https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/concepts/prebuilt-analyzers */
{s:0,d:2,t:"single",ref:"prebuilt-documentSearch RAG ingestion figure descriptions chunked markdown",
 stem:`You are ingesting product manuals (PDFs full of diagrams) into a search index for a retrieval-augmented generation (RAG) chat app. You want Markdown output, figure descriptions, a document summary, and chunks ready for embedding. Which prebuilt analyzer fits best?`,
 opts:["prebuilt-read, which provides basic OCR for words, paragraphs, and barcodes","prebuilt-documentSearch, which Learn recommends for RAG document ingestion","prebuilt-layout, which returns tables and sections without using a language model","prebuilt-documentFieldSchema, which proposes a field schema for new document types"],a:1,
 ex:`prebuilt-documentSearch is the RAG analyzer for documents: it extracts layout as Markdown, describes figures, analyzes charts and diagrams, adds a one-paragraph summary, and produces chunked output for embedding. prebuilt-read and prebuilt-layout are content extraction analyzers without figure descriptions or summaries, and prebuilt-documentFieldSchema is a utility analyzer.`},

/* src: https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/video/overview */
{s:0,d:2,t:"single",ref:"Content Understanding video limitation 1 FPS frame sampling 512 pixels",
 stem:`A video analyzer misses a product logo that appears on screen for only a fraction of a second, and it can't read the small print in a corner of the frame. What explains this?`,
 opts:["The analyzer samples about one frame per second and resizes frames to 512 by 512 pixels","Video analyzers transcribe only the audio track and never inspect any of the visual frames","Logos are detected only when the field method is set to extract instead of generate","Shot detection removes every frame that falls between two camera cuts in the video"],a:0,
 ex:`Learn lists two video limits: frame sampling at about 1 frame per second, so rapid or single-frame events can be missed, and sampled frames resized to 512 by 512 pixels, so small text or distant objects can be lost. Video analysis does use visual frames (key frames and descriptions), and extract is supported for documents only.`},

/* src: https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/audio/overview */
{s:0,d:2,t:"multi",n:2,ref:"Content Understanding audio multilingual transcription locales auto empty",
 stem:`Your audio recordings switch between English and Spanish mid-conversation, and the transcript must apply the right language to each phrase. How can you configure the locales setting of the audio analyzer to enable multilingual transcription? Each correct answer presents a complete solution.`,
 opts:["Leave locales empty","Set locales to auto","Set locales to only en-US","Set locales to en-US and es-ES","Set returnDetails to false"],a:[0,1],
 ex:`Multilingual transcription, which applies language and locale per phrase, is enabled when you don't specify a locale or set locales to auto. A single locale gives single-language transcription. Listing several locales turns on language detection, which picks the dominant language and still produces a single-language transcript.`},

/* src: https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/concepts/analyzer-reference */
{s:0,d:2,t:"multi",n:2,ref:"Content Understanding baseAnalyzerId supported base analyzers custom analyzer",
 stem:`You are creating custom analyzers. Which two values can you set as the baseAnalyzerId of a custom analyzer? Each correct answer presents a complete solution.`,
 opts:["prebuilt-audio","prebuilt-invoice","prebuilt-image","prebuilt-callCenter","prebuilt-imageSearch"],a:[0,2],
 ex:`Custom analyzers derive from one of four base analyzers: prebuilt-document, prebuilt-audio, prebuilt-video, or prebuilt-image. Domain-specific analyzers such as prebuilt-invoice and prebuilt-callCenter, and RAG analyzers such as prebuilt-imageSearch, aren't base analyzers. You can copy a prebuilt definition as a template, but the result still uses a base analyzer.`},

/* src: https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/choosing-right-ai-tool */
{s:0,d:2,t:"yesno",ref:"Content Understanding vs Document Intelligence labeling multimodal",
 stem:`You are comparing Azure Content Understanding with Azure Document Intelligence for a new project. For each statement, select Yes if it is true. Otherwise, select No.`,
 rows:["A Content Understanding custom analyzer can start extracting fields without any labeled training data.","A Document Intelligence custom model is trained with labeled samples, with as few as five per document variant.","Document Intelligence models are the recommended choice for extracting fields from audio and video recordings."],a:[1,1,0],
 ex:`Content Understanding custom analyzers work zero-shot: you describe the fields in plain language, and labeled samples are optional to improve accuracy. Document Intelligence custom models train on labeled samples, as few as five. For multimodal input (image, audio, video), Learn recommends Content Understanding analyzers.`},

/* src: https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/choosing-right-ai-tool */
{s:0,d:2,t:"single",ref:"Content Understanding vs build your own multimodal model confidence grounding",
 stem:`A developer plans to send scanned claim forms straight to a deployed multimodal model in Foundry with a prompt that asks for the fields as JSON. The business needs a confidence score and a source location for each field without writing custom code for them. What should you recommend?`,
 opts:["Keep the model and ask it in the prompt to add a confidence value for each field","Keep the model and raise the temperature so its answers vary less between runs","Use Content Understanding, which returns confidence scores and grounding per field","Keep the model and add a system message that lists the source page for every field"],a:2,
 ex:`Learn's comparison shows that Content Understanding and Document Intelligence provide confidence and grounding, while building your own with Foundry models offers no confidence or grounding unless you implement it yourself. Asking the model to report its own confidence or sources isn't the built-in, calibrated feature the business asked for, and a higher temperature makes output more varied, not less.`},
];
