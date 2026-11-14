// AI-901 "Identify AI workloads" (d:1). Exam I items in e1, Exam II items in e2.
export const e1=[
/* src: https://learn.microsoft.com/en-us/azure/ai-services/language-service/sentiment-opinion-mining/overview */
{s:0,d:1,t:"single",ref:"sentiment analysis positive negative neutral sentence document level",
 stem:`A hotel chain collects thousands of guest reviews each week. Managers want each review, and each sentence in it, labeled as positive, neutral, or negative with a confidence score. Which text analysis technique should you use?`,
 opts:["Key phrase extraction, which returns the main concepts in each review as a list","Sentiment analysis, which labels sentences and documents with confidence scores","Entity linking, which matches the names in each review to articles on Wikipedia","Language detection, which reports the language and dialect a review is written in"],a:1,
 ex:`Sentiment analysis assigns positive, neutral, or negative labels at the sentence and document level, with confidence scores between 0 and 1. Key phrase extraction finds the main talking points but says nothing about how the guest felt.`},

/* src: https://learn.microsoft.com/en-us/azure/ai-services/language-service/overview */
{s:0,d:1,t:"single",ref:"language detection route support tickets by language",
 stem:`A global help desk receives support tickets in many languages, and nobody knows in advance which language a ticket uses. Each ticket must be routed to a team that speaks its language. Which capability fits?`,
 opts:["Named entity recognition, to find the country names and cities mentioned","Summarization, to reduce each ticket to a short recap before it is routed","Language detection, which evaluates text and identifies its language","PII detection, to find the customer's address and infer their country"],a:2,
 ex:`Language detection evaluates text and detects a wide range of languages and dialect variants, which is exactly what routing by language needs. Entity recognition or PII detection could find places mentioned in the text, but a place name doesn't tell you what language the ticket is written in.`},

/* src: https://learn.microsoft.com/en-us/training/modules/introduction-computer-vision/2-overview */
{s:0,d:1,t:"single",ref:"object detection bounding box multiple items checkout",
 stem:`A self-checkout camera must recognize every item a shopper places on the counter, such as an apple, a banana, and an orange together, and report where each item is in the picture. Which computer vision technique fits?`,
 opts:["Image classification, which predicts one label for the main subject of an image","Object detection, which returns each object found with a bounding box around it","Optical character recognition, which reads the price stickers on each item instead","Image generation, which creates a new picture of the counter from a text prompt"],a:1,
 ex:`Object detection examines regions of the image to find individual objects and returns their classes and bounding-box coordinates, so it handles several items at once. Image classification predicts a single label for the image's main subject, so it can't list and locate three separate items.`},

/* src: https://learn.microsoft.com/en-us/azure/ai-services/computer-vision/overview-image-analysis */
{s:0,d:1,t:"single",ref:"image captioning human-readable sentence alt text",
 stem:`A news website wants to add alt text to every uploaded photo automatically. The alt text should be one complete, human-readable sentence that describes the scene, such as "A person riding a skateboard down a city street." Which capability should you use?`,
 opts:["Image tagging, which returns a list of single words for objects and scenery","Smart cropping, which returns the coordinates of the most interesting region","Image captioning, which describes the image in a complete, readable sentence","Face detection, which returns a rectangle for each face found in the photo"],a:2,
 ex:`Image captioning generates a human-readable description of an image in complete sentences. Tagging returns individual tags for objects, scenery, and actions, which is useful metadata but isn't a sentence a screen reader can announce.`},

/* src: https://learn.microsoft.com/en-us/training/modules/introduction-ai-speech/2-speech-solutions */
{s:0,d:1,t:"single",ref:"speech synthesis text to speech navigation directions aloud",
 stem:`A delivery app shows turn-by-turn directions as text. Drivers must hear the directions without looking at the screen. Which AI workload produces the audio?`,
 opts:["Speech recognition, which converts the driver's spoken words into written app text","Speech synthesis, which converts written text into natural-sounding spoken audio","Sentiment analysis, which detects whether the instructions sound urgent or calm","Language detection, which works out the language the driver is currently using"],a:1,
 ex:`Speech synthesis (text to speech) turns written text into spoken audio, and the Learn module lists navigation instructions as a typical scenario. Speech recognition works the other way, from audio to text.`},

/* src: https://learn.microsoft.com/en-us/training/modules/fundamentals-generative-ai/7-agents */
{s:0,d:1,t:"single",ref:"AI agent model instructions tools action calendar email",
 stem:`An assistant must understand a request such as "move my 3 PM meeting to Friday and tell the attendees," then actually update the calendar and send the emails. Which kind of AI solution fits best?`,
 opts:["A text analysis pipeline that extracts the key phrases and dates in the request","A speech recognition app that transcribes the request into a meeting transcript","An image classification model trained on screenshots of calendar applications","An AI agent that combines a language model and instructions with action tools"],a:3,
 ex:`An agent uses a large language model to reason over the request, instructions that define its role, and tools. Action tools let it do things like update calendars and send email. Text analysis can pull the date out of the request, but it can't carry out the task.`},

/* src: https://learn.microsoft.com/en-us/training/modules/introduction-information-extraction/2-overview */
{s:0,d:1,t:"single",ref:"information extraction receipts OCR fields vendor date total",
 stem:`Employees photograph paper receipts for expense claims. The system must read each receipt and fill in Vendor, Date, Tax, and Total fields automatically. Which workload is this?`,
 opts:["Information extraction, which uses OCR and then maps the text to data fields","Image captioning, which writes a sentence that describes each receipt photo","Object detection, which draws a box around each receipt found in the photo","Sentiment analysis, which scores the text printed on each receipt for tone"],a:0,
 ex:`Information extraction combines OCR, which detects and reads the text in the image, with a step that identifies values and maps them to fields such as Vendor and Total. Object detection could find where the receipt is in the photo, but it wouldn't read the values or know which value is the total.`},

/* src: https://learn.microsoft.com/en-us/azure/ai-services/language-service/personally-identifiable-information/overview */
{s:0,d:1,t:"single",ref:"PII detection redact names phone numbers call transcripts",
 stem:`A contact center stores call transcripts for analytics. Before storage, customer names, phone numbers, and account numbers must be found and masked. Which Azure Language capability should you use?`,
 opts:["Key phrase extraction, which keeps only the main topics and drops the rest","Entity linking, which swaps each customer name for a link to a public article","Custom text classification, which sorts transcripts into the right categories","PII detection, which identifies and redacts personal data in conversations"],a:3,
 ex:`PII detection identifies, classifies, and redacts sensitive data in text, conversations, and documents, and redacting names and contact details in call transcripts is one of its listed use cases. Key phrase extraction isn't a redaction feature, and a key phrase can itself contain personal data.`},

/* src: https://learn.microsoft.com/en-us/training/modules/introduction-language/3-statistical-techniques */
{s:0,d:1,t:"single",ref:"extractive summarization select key sentences TextRank abstractive",
 stem:`A legal team needs summaries of long reports, made up only of sentences copied word for word from the original document, with no new wording added. Which approach produces this kind of summary?`,
 opts:["Abstractive summarization, which writes new sentences that capture the key themes","Extractive summarization, which selects the most representative original sentences","Sentiment analysis, which keeps only the sentences with the strongest emotional tone","Language detection, which keeps only the sentences written in the document's language"],a:1,
 ex:`Extractive summarization (for example, with TextRank) selects a subset of the original sentences, so no new text is generated. Abstractive summarization generates new sentences that aren't copied from the source, which the team doesn't want.`},

/* src: https://learn.microsoft.com/en-us/azure/ai-services/computer-vision/overview-identity */
{s:0,d:1,t:"single",ref:"face detection locate faces blur privacy rectangle",
 stem:`A video team must blur the faces of bystanders before publishing footage. The app only needs to locate the faces. It doesn't need to know who anyone is. Which capability is enough?`,
 opts:["Face detection, which returns the location rectangle of each face in a frame","Face identification, which matches each face against a group of known people","Face verification, which checks whether two face images show the same person","Image classification, which predicts a single label for the whole video frame"],a:0,
 ex:`Face detection finds human faces and returns the rectangle coordinates of their locations, which is all a blurring step needs, and face redaction is a listed use case. Identification and verification are recognition operations that compare faces to establish who someone is.`},

/* src: https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/audio/overview */
{s:0,d:1,t:"multi",n:2,ref:"Content Understanding prebuilt-callCenter summary sentiment role detection",
 stem:`A company wants insights from recorded support calls by using the post-call analysis prebuilt analyzer in Azure Content Understanding in Foundry Tools. Which two outputs does this analyzer produce? Each correct answer presents part of the solution.`,
 opts:["A summary of what happened during each call","A transcript in which speakers are labeled as agent or customer","A synthesized audio version of the call in a different voice","A bounding box around each person seen on the agent's webcam","A translated copy of the recording dubbed into a second language"],a:[0,1],
 ex:`The prebuilt-callCenter analyzer returns transcripts with speaker role detection, a call summary, call sentiment, mentioned companies and people, and call categories. It doesn't synthesize or dub audio, and it analyzes audio, not webcam video.`},

/* src: https://learn.microsoft.com/en-us/training/modules/introduction-ai-speech/2-speech-solutions */
{s:0,d:1,t:"multi",n:2,ref:"speech recognition scenarios captions dictation",
 stem:`Which two scenarios are examples of speech recognition (speech to text)? Each correct answer presents a complete solution.`,
 opts:["Showing live captions to meeting attendees who are deaf or hard of hearing","Reading news articles aloud to users who have visual impairments","A clinician dictating patient notes straight into the health record","Creating character voices for a video game without a recording studio","Announcing machine status alerts across a noisy factory floor"],a:[0,2],
 ex:`Captions and dictation both turn spoken audio into text, so they're speech recognition. Reading articles aloud, game character voices, and spoken alerts all turn text into audio, so they're speech synthesis.`},

/* src: https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/dall-e */
{s:0,d:1,t:"multi",n:2,ref:"image generation model text to image inpainting mask edit",
 stem:`A marketing team plans to use a gpt-image series model deployed in Microsoft Foundry. Which two tasks can this kind of model do? Each correct answer presents a complete solution.`,
 opts:["Return the bounding-box coordinates of every product in a shelf photo","Create a new image from a natural language description of the scene","Read the printed text on a scanned flyer and return it as editable text","Change part of an existing image by using a mask together with a prompt","Confirm whether two photos show the same person by comparing their faces"],a:[1,3],
 ex:`Image generation models create images from text prompts and optional input images, and the gpt-image models support editing (inpainting) with a mask and a prompt. Bounding boxes, OCR, and face verification are analysis tasks for vision models, not image generation.`},

/* src: https://learn.microsoft.com/en-us/azure/ai-services/language-service/overview */
{s:0,d:1,t:"yesno",ref:"key phrase extraction entity linking Wikipedia sentiment levels",
 stem:`You are evaluating Azure Language in Foundry Tools for a document review app. For each statement, select Yes if it is true. Otherwise, select No.`,
 rows:["Key phrase extraction evaluates unstructured text and returns its main concepts as a list.","Entity linking disambiguates the entities found in text and returns links to Wikipedia.","Sentiment analysis returns a sentiment label only for the whole document, not for individual sentences."],a:[1,1,0],
 ex:`Key phrase extraction returns the main concepts as a list, and entity linking disambiguates entities and links them to Wikipedia. Sentiment analysis labels each sentence as well as the whole document.`},
];

export const e2=[
/* src: https://learn.microsoft.com/en-us/azure/ai-services/language-service/overview */
{s:0,d:1,t:"single",ref:"key phrase extraction main talking points survey comments",
 stem:`A product team has thousands of open-ended survey comments. They want a quick list of the main talking points in each comment, such as "battery life" or "setup instructions." Which technique fits?`,
 opts:["Key phrase extraction, which returns the main concepts in the text as a list","Language detection, which tells you which language each comment was written in","Entity linking, which connects named things in the text to articles on Wikipedia","Text to speech, which reads each comment aloud so the team can review it faster"],a:0,
 ex:`Key phrase extraction evaluates unstructured text and returns its main concepts, the talking points, as a list. Entity linking works on named entities and links them to Wikipedia. It doesn't pull out general topics like "battery life".`},

/* src: https://learn.microsoft.com/en-us/azure/ai-services/language-service/overview */
{s:0,d:1,t:"single",ref:"prebuilt named entity recognition people organizations locations dates",
 stem:`A news archive must tag each article with the people, organizations, locations, and dates it mentions. The team has no labeled data and doesn't want to train a model. Which capability should you use?`,
 opts:["Custom named entity recognition, trained on labeled examples of each category","Custom text classification, which assigns each article to categories you define","Prebuilt named entity recognition, which categorizes entities into predefined types","Key phrase extraction, which returns the main concepts of each article as a list"],a:2,
 ex:`Prebuilt NER identifies entities in text and sorts them into predefined types such as person, organization, location, and date, with no model to train. Custom NER also extracts entities, but you have to train it on labeled data, which the team doesn't have.`},

/* src: https://learn.microsoft.com/en-us/azure/ai-services/language-service/sentiment-opinion-mining/overview */
{s:0,d:1,t:"single",ref:"opinion mining aspect-based sentiment product attributes",
 stem:`A review reads "The battery lasts all day, but the screen is too dim." The retailer wants a positive result for the battery and a negative result for the screen, not one score for the whole review. Which feature provides this?`,
 opts:["Document-level sentiment, which returns one label for the review as a whole","Opinion mining, which links sentiment to specific attributes in the review text","Key phrase extraction, which lists battery and screen as the main topics it found","Language detection, which confirms that the review was written in English text"],a:1,
 ex:`Opinion mining, also called aspect-based sentiment analysis, links opinions to specific attributes of a product or service. A document-level label would blend the praise and the complaint into one result.`},

/* src: https://learn.microsoft.com/en-us/training/modules/introduction-computer-vision/2-overview */
{s:0,d:1,t:"single",ref:"image classification predict single label main subject",
 stem:`A wildlife project has trail-camera photos that each show one animal. Researchers want every photo labeled with the species of its main subject, such as deer, fox, or bear. Locating the animal in the frame isn't required. Which technique fits?`,
 opts:["Semantic segmentation, which assigns a class to every pixel in each photo","Object detection, which returns a bounding box for each animal it finds","Image classification, which predicts a label from the image's contents","OCR, which reads the timestamp text that the camera prints on each photo"],a:2,
 ex:`Image classification uses a model trained on labeled images to predict one label for an image's main subject. Object detection and segmentation also locate the animal, which adds work the researchers don't need.`},

/* src: https://learn.microsoft.com/en-us/training/modules/introduction-computer-vision/2-overview */
{s:0,d:1,t:"single",ref:"semantic segmentation classify individual pixels precise outline",
 stem:`An agriculture robot must spray only weeds and never touch crops. It needs a pixel-precise outline of each weed in the camera image, not just a rectangle around it. Which technique fits?`,
 opts:["Image classification, which labels the whole image with a single plant type","Object detection, which places a rectangular bounding box around each weed","Image captioning, which describes the field in a complete natural sentence","Semantic segmentation, which classifies individual pixels by their object"],a:3,
 ex:`Semantic segmentation classifies each pixel by the object it belongs to, which gives a much more precise location than a bounding box. Object detection only returns rectangular coordinates, and those would include crop pixels.`},

/* src: https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-translation */
{s:0,d:1,t:"single",ref:"speech translation speech to speech real time multilingual meeting",
 stem:`During an international meeting, a presenter speaks Spanish. Attendees in another room must hear the presentation in English, in near real time. Which capability fits?`,
 opts:["Speech translation, which turns speech in one language into translated speech","Text to speech, which reads the Spanish slides aloud in a natural-sounding voice","Language identification, which only reports that the spoken language is Spanish","Batch transcription, which converts the recording into Spanish text after the meeting"],a:0,
 ex:`Speech translation in Azure Speech in Foundry Tools does real-time speech-to-speech and speech-to-text translation. Language identification only tells you which language is being spoken, and batch transcription runs after the fact without translating.`},

/* src: https://learn.microsoft.com/en-us/training/modules/introduction-ai-speech/3-speech-recognition */
{s:0,d:1,t:"single",ref:"speech recognition language model their there homophones",
 stem:`A speech recognition system hears the same sounds for "their" and "there." Which stage of the recognition pipeline picks the right word by using vocabulary, grammar, and the surrounding words?`,
 opts:["Audio capture, which samples the analog sound wave into a digital signal","Language modeling, which predicts likely word sequences from the context","Pre-processing, which turns the raw audio into MFCC feature vectors","Acoustic modeling, which predicts the phoneme heard in each audio frame"],a:1,
 ex:`The acoustic model can't tell homophones apart because their phonemes are identical. The language model settles it by applying vocabulary, grammar, and context to predict the most likely word sequence.`},

/* src: https://learn.microsoft.com/en-us/training/modules/introduction-ai-speech/4-speech-synthesis */
{s:0,d:1,t:"single",ref:"speech synthesis text normalization abbreviations numbers",
 stem:`Before a text-to-speech system speaks "Dr. Lee paid $25.50," it must turn the text into "Doctor Lee paid twenty-five dollars and fifty cents." Which stage of speech synthesis does this?`,
 opts:["Prosody generation, which sets the pitch, duration, and pauses of the speech","Vocoding, which turns mel-spectrograms into the final audio waveform samples","Text normalization, which expands abbreviations, numbers, and symbols","Grapheme-to-phoneme conversion, which maps the letters in each word to sounds"],a:2,
 ex:`Text normalization expands abbreviations, numbers, dates, and symbols into spoken forms so the system doesn't try to pronounce raw characters. Grapheme-to-phoneme conversion comes later, during linguistic analysis, and works on the words that normalization has already expanded.`},

/* src: https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/video/overview */
{s:0,d:1,t:"single",ref:"Content Understanding video transcript key frames segmentation search",
 stem:`A training department has a large library of lecture videos. It wants each video turned into searchable content with a transcript, key frames, and a description of each scene, so a chat agent can answer questions about them. Which service fits?`,
 opts:["Azure Language summarization, which condenses the text of each lecture's slides","Azure Content Understanding, which analyzes the video into transcripts and segments","Azure Speech text to speech avatar, which produces a talking-presenter video","An image generation model, which creates a new thumbnail image for each lecture"],a:1,
 ex:`The Content Understanding video analyzer produces WebVTT transcripts, key frames, segment descriptions, and scene segmentation in a RAG-ready format that an agent can use. A text to speech avatar creates new video. It doesn't analyze existing video.`},

/* src: https://learn.microsoft.com/en-us/training/modules/fundamentals-generative-ai/7-agents */
{s:0,d:1,t:"single",ref:"multi-agent system specialized agents collaborate",
 stem:`A procurement workflow needs one AI component to gather supplier quotes, another to analyze them, and a third to place the order. Each component has its own specialty. What is this design called?`,
 opts:["A single agent whose one large prompt covers all three of the tasks","A text analysis pipeline that chains entity and key phrase extraction","A computer vision pipeline that reads each quote by using OCR alone","A multi-agent system in which specialized agents collaborate on tasks"],a:3,
 ex:`In a multi-agent system, several agents each have a specialty, such as gathering, analyzing, or acting, and they work together through prompts. One agent could attempt everything, but the scenario describes separate specialized components.`},

/* src: https://learn.microsoft.com/en-us/azure/ai-services/language-service/overview */
{s:0,d:1,t:"multi",n:2,ref:"Azure Language transcribed conversations PII summarization",
 stem:`A team has transcripts of recorded customer conversations. Which two Azure Language in Foundry Tools features accept transcribed conversations as input? Each correct answer presents a complete solution.`,
 opts:["PII detection, to find and redact personal data in the transcripts","Entity linking, to connect product names to articles on Wikipedia","Summarization, to recap the issue and resolution of each conversation","Custom text classification, to sort transcripts into custom categories","Key phrase extraction, to list the main concepts of each transcript"],a:[0,2],
 ex:`The Azure Language feature guide lists transcribed conversations as an input for PII detection and for summarization, including call center summarization of the issue and resolution. Entity linking, custom text classification, and key phrase extraction are listed for unstructured text only.`},

/* src: https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/overview */
{s:0,d:1,t:"multi",n:2,ref:"Content Understanding field extraction methods extract classify generate audio",
 stem:`You design a Content Understanding analyzer for recorded phone calls. One field must pick a call reason from a fixed list of categories, and another must be a short free-text recap of the call. Which two field extraction methods should you use? Each correct answer presents part of the solution.`,
 opts:["Classify, to pick a value for the field from a predefined set of categories","Extract, to copy values directly as they appear in the call recordings","Generate, to produce a value freely from the input, such as a summary","Redact, to mask the values that the analyzer finds in the recordings","Translate, to convert the transcript of each call into another language"],a:[0,2],
 ex:`Classify picks from a predefined set of categories, and Generate produces values freely, such as summarizing an audio conversation. Extract copies values as they appear, but it's supported for documents only. Redact and Translate aren't field extraction methods.`},

/* src: https://learn.microsoft.com/en-us/azure/ai-services/computer-vision/overview-image-analysis */
{s:0,d:1,t:"multi",n:2,ref:"object detection dense captions bounding box coordinates",
 stem:`An app must know where things are in an image, so each result needs bounding-box coordinates. Which two image analysis features return bounding boxes? Each correct answer presents a complete solution.`,
 opts:["Image captioning, which returns one sentence that describes the image","Object detection, which returns coordinates for each object it finds","Image tagging, which returns tags for the objects, scenery, and actions","Dense captioning, which returns a caption and a box for each object","Image categorization, which places the image in a category taxonomy"],a:[1,3],
 ex:`Object detection returns bounding-box coordinates for each tag it applies, and dense captioning returns a bounding box and a caption for each object. Captioning, tagging, and categorization describe the image as a whole and return no coordinates.`},

/* src: https://learn.microsoft.com/en-us/training/modules/fundamentals-generative-ai/7-agents */
{s:0,d:1,t:"yesno",ref:"agent components instructions system prompt knowledge action tools",
 stem:`You are explaining AI agents to a new developer. For each statement, select Yes if it is true. Otherwise, select No.`,
 rows:["An agent's instructions are a system prompt that defines its role and behavior.","A tool that sends email on the user's behalf is an example of a knowledge tool.","In a multi-agent system, agents communicate with each other through prompts."],a:[1,0,1],
 ex:`Instructions are the agent's system prompt, its job description. Sending email is an action tool. Knowledge tools provide information, such as search engines or databases. Agents in a multi-agent system communicate through prompts.`},
];
