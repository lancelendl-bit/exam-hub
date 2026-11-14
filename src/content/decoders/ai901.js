/* AI-901 Microsoft Azure AI Fundamentals stem decoder. Same shape as every decoder: see dp700.js.
   Skills measured: Microsoft Learn study guide for AI-901 (skills measured as of April 15, 2026).
   Sources: Microsoft Learn pages for Foundry Models deployment types, model leaderboards, guardrails (default policies, harm
   categories, Prompt Shields), Azure OpenAI REST reference (sampling parameters), reasoning models, prompt engineering and system
   messages, the Foundry SDK quickstart and azure-ai-projects readme, Foundry Agent Service (prompt agents, function calling, file
   search, code interpreter, web search, toolboxes), Azure Language and Azure Speech in Foundry Tools, Azure OpenAI audio and image
   generation, Azure Vision Image Analysis 4.0, Face Limited Access, Azure Content Understanding in Foundry Tools (overview,
   prebuilt analyzers), Azure OpenAI quota and rate limits, and Microsoft's responsible AI principles. */
export default {
 intro: "AI-901 questions describe a business need or a few lines of Foundry SDK code and ask which AI workload, Foundry feature, model setting or responsible AI principle fits. The closing sentence usually holds the deciding constraint (no code, data residency, existing index, your own function, named fields). Read it first, then match the phrase below.",
 how: [
  ["Name the workload first.","Is it generative or agentic AI, text analysis, speech, computer vision or information extraction? That alone removes most options."],
  ["Find the deciding constraint.","Circle words such as reserved, within the EU, without code, existing index, your own API, named fields, identify a person or over 10 minutes."],
  ["Eliminate real features used in the wrong place.","OCR for invoice fields, file search for an existing index, Image Analysis for identity, temperature on a reasoning model: cross those out first."]
 ],
 tables: [
  {id:"constraint", h:"Constraint phrases", sub:"These closing phrases rank otherwise-valid answers. Match the phrase, then pick the option shaped like the middle column.", cols:["Stem says","Points to","Typical wrong pick"], d:2, rows:[
   ["Data must be processed inside the EU, pay per token","Data Zone Standard deployment","Global Standard deployment"],
   ["Reserved throughput with low latency variance","Provisioned deployment (PTUs)","Global Standard deployment"],
   ["Large asynchronous job, lower cost, results within a day","Global Batch deployment","Provisioned deployment"],
   ["Agent answers only from files the team uploads","File search tool over a vector store","Web search tool"],
   ["Agent must query an existing Azure AI Search index","Azure AI Search tool","File search tool with the files uploaded again"],
   ["Agent analyzes a CSV in Python and returns a chart","Code Interpreter tool","Function calling tool"],
   ["Agent calls an internal API that your own code runs","Function calling: your app runs it and returns the output","Code Interpreter tool"],
   ["Named fields from invoices with no model training","Content Understanding prebuilt-invoice analyzer","Image Analysis Read (OCR)"],
   ["Change an existing photo from a text instruction","Image edit API with a GPT-image model","New image generation from a prompt"],
   ["Recognize which known employee is in a photo","Face identification, after Limited Access approval","Image Analysis people detection"],
   ["Spoken back-and-forth with very low latency","Realtime API model such as gpt-realtime, or Voice Live","Batch transcription, then a chat call"],
   ["Transcribe thousands of stored call recordings","Batch transcription in Azure Speech","Real-time speech to text in the Speech SDK"],
   ["Detect instructions hidden inside grounding documents","Prompt Shields document attack detection (off by default)","User prompt attack detection"]
  ]},
  {id:"rai", h:"Responsible AI phrases", sub:"Responsible AI stems describe a risk or a duty. Name the principle, or the guardrail that addresses it.", cols:["Stem says","Points to"], d:1, rows:[
   ["Similar applicants get different loan outcomes by group","Fairness"],
   ["System behaves predictably and fails safely on odd inputs","Reliability and safety"],
   ["Personal data in prompts and training must be protected","Privacy and security"],
   ["Must work for people with disabilities and other languages","Inclusiveness"],
   ["Users can understand what the system does and its limits","Transparency"],
   ["A named owner answers for the system's outcomes","Accountability"],
   ["Microsoft document of a service's capabilities and limitations","Transparency note"],
   ["Four core harm categories in Foundry guardrails","Hate, sexual, violence and self-harm"],
   ["Default blocking level for the core harm categories","Medium: blocks medium and high severity"],
   ["Model output reproduces song lyrics or public code","Protected material detection"],
   ["Check that answers stick to the source documents","Groundedness detection (preview)"],
  ]},
  {id:"models", h:"Models and configuration phrases", sub:"Model stems ask how a generative model works, which model fits, or which parameter or deployment setting changes the output.", cols:["Stem says","Points to"], d:1, rows:[
   ["Text broken into words, word parts and punctuation","Tokens, each with a numeric ID"],
   ["Numeric vector that captures what a token means","Embedding"],
   ["Neural network architecture behind GPT models","Transformer"],
   ["Under about 10 billion parameters, runs on modest hardware","Small language model (SLM) such as Phi-4-mini"],
   ["Prompt plus response must fit within this limit","Context window, measured in tokens"],
   ["Value from 0 to 2; higher makes output more random","temperature (default 1)"],
   ["Sample only from the most probable tokens' mass","top_p (nucleus sampling)"],
   ["Cap how many tokens one response can use","max_tokens (max_completion_tokens on reasoning models)"],
   ["Stop the model repeating the same line verbatim","frequency_penalty"],
   ["Model works through steps before it answers","Reasoning model, such as o3 or o4-mini"],
   ["Rank models by quality, safety, cost and throughput","Model leaderboard in the model catalog (preview)"],
   ["Adapt a model's style with labeled example pairs","Supervised fine-tuning"]
  ]},
  {id:"workloads", h:"AI workload phrases", sub:"Workload stems describe what the business wants done. Name the workload before you name a service.", cols:["Stem says","Points to"], d:1, rows:[
   ["Create new text, images or code from a prompt","Generative AI"],
   ["Plans steps and takes actions with tools toward a goal","Agentic AI (an agent)"],
   ["Positive, negative or neutral tone of reviews","Sentiment analysis"],
   ["List of the main talking points in a document","Key phrase extraction"],
   ["People, organizations, locations and dates in text","Named entity recognition (NER)"],
   ["Find and redact phone numbers and ID numbers in text","PII detection"],
   ["Turn spoken audio into text","Speech recognition (speech to text)"],
   ["Read text aloud in a natural voice","Speech synthesis (text to speech)"],
   ["Describe and locate what appears in images","Computer vision"],
   ["Structured fields from forms, audio and video","Information extraction"]
  ]},
  {id:"foundry", h:"Foundry apps and agents phrases", sub:"Foundry stems name a prompt part, a line of SDK code, a portal feature or an agent part.", cols:["Stem says","Points to"], d:2, rows:[
   ["Sets the assistant's role, tone, format and boundaries","System message"],
   ["Sample user and assistant turns included in the prompt","Few-shot examples"],
   ["Source text supplied with an answer only from this rule","Grounding data in the prompt"],
   ["Python package for the Foundry SDK","azure-ai-projects, with azure-identity"],
   ["Object that connects code to a Foundry project","AIProjectClient(endpoint, DefaultAzureCredential())"],
   ["Get an authenticated client for Responses calls","project_client.get_openai_client()"],
   ["Line that sends input and returns the model's reply","openai_client.responses.create(model=..., input=...)"],
   ["Value to pass as model in that call","The deployment name in your project"],
   ["Try a deployed model in the browser without code","Playground in the Foundry portal"],
   ["Model, instructions and tools defined, Foundry runs it","Prompt agent"],
   ["Your own agent code in a container, hosted by Foundry","Hosted agent"],
   ["Keep multi-turn agent state across requests","A conversation passed with each response"],
   ["Output item asking your app to run a function","function_call, answered with function_call_output"],
   ["Share one curated set of tools across many agents","Toolbox behind a managed MCP endpoint"],
  ]},
  {id:"textspeech", h:"Text and speech phrases", sub:"Text and speech stems name an Azure Language or Azure Speech feature, or an audio-capable model.", cols:["Stem says","Points to"], d:2, rows:[
   ["Sentiment tied to aspects such as battery or screen","Opinion mining"],
   ["Summary written in new sentences","Abstractive summarization"],
   ["Summary made of sentences taken from the source","Extractive summarization"],
   ["Adjust pitch, pauses, speaking rate and pronunciation","SSML (Speech Synthesis Markup Language)"],
   ["Label which speaker said each phrase","Speaker diarization"],
   ["Detect which of several candidate languages is spoken","Language identification with candidate locales"],
   ["Better recognition of product names and jargon","Custom speech model trained on domain text"],
   ["Spoken audio rendered in another language live","Speech translation"],
   ["Audio prompt and spoken reply in one chat completions call","Audio model such as gpt-4o-audio-preview"],
   ["Transcribe a recorded file with an OpenAI model","/audio/transcriptions with gpt-4o-transcribe or whisper"],
   ["Brand voice built from recordings of voice talent","Custom neural voice (Limited Access)"]
  ]},
  {id:"vision", h:"Vision and image generation phrases", sub:"Vision stems name an Image Analysis 4.0 feature, a multimodal prompt or an image generation option.", cols:["Stem says","Points to"], d:2, rows:[
   ["One sentence that describes the whole image","Caption"],
   ["Descriptions of up to 10 regions, with boxes","Dense captions"],
   ["Words for the content and setting of an image","Tags"],
   ["Bounding box for each item found in an image","Object detection"],
   ["Text on street signs, labels and screenshots","Read (OCR) in Image Analysis 4.0"],
   ["Location of each person, with no identity","People detection"],
   ["Ask a question about an attached photo in chat","Vision-enabled multimodal model with image input"],
   ["Create a picture from a text description","GPT-image model through the image generation API"],
   ["Replace only a masked region of an image","Inpainting with the image edit API"],
  ]},
  {id:"extract", h:"Information extraction phrases", sub:"Extraction stems name a Content Understanding analyzer, a field method or an output.", cols:["Stem says","Points to"], d:2, rows:[
   ["Defines extraction settings, field schema and models","Analyzer"],
   ["Field value copied as it appears in the file","Extract method (documents only)"],
   ["Field value chosen from a fixed set of categories","Classify method"],
   ["Field value written freely, such as a call summary","Generate method"],
   ["Parent of a custom analyzer","prebuilt-document, prebuilt-image, prebuilt-audio or prebuilt-video"],
   ["Reliability of each extracted value from 0 to 1","Confidence score (estimateFieldSourceAndConfidence)"],
   ["Transcript, summary and speaker labels from a recording","prebuilt-audioSearch"],
   ["Transcript, keyframes and segment summaries from video","prebuilt-videoSearch"],
   ["One-paragraph description of an image for search","prebuilt-imageSearch"],
   ["Documents as chunked markdown for a RAG index","prebuilt-documentSearch"],
  ]},
  {id:"trouble", h:"Troubleshooting symptoms", sub:"Symptom stems describe an error or odd result. Name the cause or the fix.", cols:["Stem says","Points to"], d:2, rows:[
   ["429 Too Many Requests from a deployment","Wait retry-after-ms, then retry with exponential backoff"],
   ["Steady workload needs more tokens per minute than allowed","Raise the deployment's tokens-per-minute quota allocation"],
   ["Status 200 but finish_reason is content_filter","Output guardrail filtered the completion"],
   ["Request fails with an error before any generation","Input guardrail blocked the prompt"],
   ["o-series model rejects temperature and top_p","Reasoning models don't support those parameters"],
   ["Model not found from the SDK call","Pass the project's deployment name as model"],
   ["Transcript has no speaker labels","Diarization is off by default: enable it"],
   ["Diarization fails on a two-channel recording","Diarization needs mono audio"],
   ["Caption feature missing for the Vision resource","Captions run only in some regions; use one of them"],
   ["Face identify call is refused","Face identification needs Limited Access approval"],
  ]}
 ],
 traps: [
  {h:"Words that flip the answer", items:[
   ["“without writing code” / “in the portal”","Playground or the portal agent builder. The Foundry SDK is the coded path."],
   ["“reserved” / “predictable latency”","Provisioned deployment types. Standard types are pay per token, best effort."],
   ["“within the EU” / “data zone”","Data Zone deployment types. Global types can process data in any Azure region."],
   ["“identify” or “verify” a person","Face recognition is Limited Access. Face detection and Image Analysis people detection need no registration and return no identity."],
   ["“your code runs the function”","Function calling. Code Interpreter runs Python the model writes, in a sandbox."],
   ["“existing index”","Azure AI Search tool. File search builds its own vector store from uploaded files."],
   ["“named fields” / “key-value pairs”","A Content Understanding analyzer. OCR returns text, not fields."],
   ["“over 10 minutes” of speech output","Batch synthesis API, which returns audio asynchronously."]
  ]},
  {h:"Common distractor patterns", items:[
   ["OCR for a forms problem","Image Analysis Read returns text and positions. Invoice totals and dates as fields need prebuilt-invoice or a custom analyzer."],
   ["Tuning temperature and top_p together","The API reference recommends changing one or the other, not both."],
   ["System message treated as a guarantee","It steers the model but doesn't guarantee compliance; layer guardrails and evaluation."],
   ["Fine-tuning to add current facts","Prompt engineering is the starting point, and grounding data supplies up-to-date facts."],
   ["People detection used for identity","It returns boxes for people only. Identifying a person needs Face identification."],
   ["Retrying a 429 at once","Failed requests count toward the limit too, so instant retries keep you throttled."],
   ["Assuming audio models are filtered","Content filtering isn't applied to audio models such as Whisper in Azure OpenAI."],
   ["Sampling settings on a reasoning model","o-series models reject temperature, top_p and max_tokens; use max_completion_tokens."],
   ["Generate method expected to copy values","Only the extract method copies values as written, and only for documents."]
  ]},
  {h:"Series questions (“Does this meet the goal?”)", items:[
   ["Judge each solution alone","against every stated requirement. One miss means No."],
   ["Only one word often changes","between solutions, such as file search versus Azure AI Search, or Global versus Data Zone."],
   ["More than one can be Yes","and sometimes none are."]
  ]}
 ],
};
