// AI-901 skill areas: "Implement AI solutions for text and speech by using Foundry" and
// "Implement AI solutions with computer vision and image-generation capabilities by using Foundry".
// All items are d:2. Answer keys are in authored order; the engine shuffles options.

export const e1=[
/* src: https://learn.microsoft.com/en-us/python/api/overview/azure/ai-textanalytics-readme */
{s:0,d:2,t:"single",ref:"Azure Language analyze_sentiment positive negative neutral mixed confidence scores",
 stem:`A Python app uses <code>TextAnalyticsClient</code> from the Azure Language SDK to call <code>analyze_sentiment()</code> on a product review that praises the screen but complains about the battery. Which result can the app expect?`,
 opts:["A single numeric star rating from 1 to 5 for the review, with no labels or per-sentence detail","A list of key phrases such as screen and battery, but no sentiment label for the review overall","A sentiment label such as mixed for the review, with per-sentence sentiment and confidence scores","A free-form paragraph that explains the reviewer's mood, which varies a little on every call made"],a:2,
 ex:`<code>analyze_sentiment()</code> labels each document positive, negative, neutral or mixed, and its response includes per-sentence sentiment and confidence scores. Key phrases come from <code>extract_key_phrases()</code>, and a free-form, varying explanation is what a general-purpose model returns, not the Language SDK.`},

/* src: https://learn.microsoft.com/en-us/training/modules/get-started-text-analysis-azure/3-language-sdk */
{s:0,d:2,t:"multi",n:2,ref:"Azure Language SDK detect_language recognize_pii_entities redacted_text",
 stem:`A support team routes incoming emails by language and must store each email with personal details such as names and phone numbers masked. You build the app with the Azure Language Python SDK (<code>azure-ai-textanalytics</code>). Which two client methods should the app call? Each correct answer presents part of the solution.`,
 opts:["detect_language(), which returns the primary language, its ISO 639-1 code and a confidence score","recognize_pii_entities(), which returns the entities found and a redacted version of the text","extract_key_phrases(), which returns the main talking points and hides any personal details found","analyze_sentiment(), which returns the language of the text along with a positive or negative label","recognize_linked_entities(), which masks known people by replacing their names with Wikipedia links"],a:[0,1],
 ex:`<code>detect_language()</code> returns the language name, ISO 639-1 code and confidence score used for routing. <code>recognize_pii_entities()</code> returns the PII entities with their categories and a <code>redacted_text</code> property. Key phrase extraction and entity linking don't redact anything, and sentiment analysis doesn't return the language.`},

/* src: https://learn.microsoft.com/en-us/azure/ai-services/speech-service/get-started-speech-to-text */
{s:0,d:2,t:"single",ref:"Speech SDK AudioConfig filename recognize_once_async transcribe audio file",
 stem:`You build a Python app with Azure Speech in Foundry Tools that transcribes a short voicemail saved as <code>voicemail.wav</code>. You already created a <code>SpeechConfig</code> with your Foundry resource key and endpoint. Which code completes the app?`,
 opts:["audio_config = speechsdk.audio.AudioConfig(use_default_microphone=True), then call recognize_once_async() and read result.text from the result", "audio_config = speechsdk.audio.AudioOutputConfig(filename=\"voicemail.wav\"), pass it to a SpeechSynthesizer, then call speak_text_async()", "audio_config = speechsdk.audio.AudioConfig(filename=\"voicemail.wav\"), pass it to a SpeechSynthesizer, then call speak_ssml_async()", "audio_config = speechsdk.audio.AudioConfig(filename=\"voicemail.wav\"), pass it to a SpeechRecognizer, then call recognize_once_async().get()"],a:3,
 ex:`To recognize speech from a file, create <code>AudioConfig</code> with <code>filename</code> instead of <code>use_default_microphone</code>, pass it to a <code>SpeechRecognizer</code>, and call <code>recognize_once_async().get()</code>. The microphone option would listen live instead of reading the file, and <code>SpeechSynthesizer</code> with <code>AudioOutputConfig</code> does text to speech, writing audio rather than reading it.`},

/* src: https://learn.microsoft.com/en-us/azure/ai-services/speech-service/how-to-speech-synthesis */
{s:0,d:2,t:"single",ref:"speech_synthesis_voice_name SSML voice element priority which voice speaks",
 stem:`A text to speech app sets <code>speech_config.speech_synthesis_voice_name</code> to one voice. A developer then calls <code>speak_ssml_async()</code> with an SSML document whose <code>&lt;voice&gt;</code> element names a different voice. Which voice speaks?`,
 opts:["The voice set in speech_synthesis_voice_name, because the SpeechConfig always takes priority", "The default en-US voice, because the two settings conflict and the service ignores both of them", "The voice named in the SSML voice element, because SSML overrides the SpeechConfig settings", "Neither of them, because the service rejects any request that sets a voice in both of these places"],a:2,
 ex:`When the voice is set in SSML, the <code>speech_synthesis_voice_name</code> and <code>speech_synthesis_language</code> settings are ignored, so the SSML voice speaks. The SpeechConfig voice is used only when SSML doesn't set one, and the default en-US voice is used only when neither the voice name nor the language is set.`},

/* src: https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-synthesis-markup-structure */
{s:0,d:2,t:"single",ref:"SSML break element time attribute pause",
 stem:`An announcement app sends SSML to Azure Speech. You need an exact two-second pause between "Doors are closing" and "Please stand clear". Which SSML should you put between the two phrases?`,
 opts:["<prosody rate=\"2s\"/>, which slows the speaking rate for the next two seconds of the text", "<say-as interpret-as=\"pause\">2</say-as>, which reads the number as a pause length", "<voice name=\"silence\"/>, which switches to a silent voice for the next two seconds of the text", "<break time=\"2s\"/>, which inserts a pause of an absolute duration between the words"],a:3,
 ex:`The <code>break</code> element overrides the default pauses between words, and its <code>time</code> attribute sets an absolute duration in seconds or milliseconds, such as <code>2s</code> or <code>500ms</code>. The <code>prosody</code> rate attribute changes speaking speed, not silence, and <code>say-as</code> tells the service how to read content such as dates or numbers.`},

/* src: https://learn.microsoft.com/en-us/azure/foundry/openai/audio-completions-quickstart */
{s:0,d:2,t:"single",ref:"gpt-audio-mini input_audio base64 wav modalities text audio chat completions",
 stem:`Users record a spoken question as a WAV file, and your app must send it to a deployed <code>gpt-audio-mini</code> model and play back a spoken answer. The app reads the file and base64-encodes it. How should the request send the recording and ask for audio back?`,
 opts:["Add a content part of type image_url that holds a data URL of the WAV file, and set the detail value to high","Transcribe the file with Azure Speech first, then send only the text, since the model can't accept audio input","Add a content part of type input_audio with the base64 data and the wav format, and set modalities to text and audio","Upload the file to Blob Storage and put the plain URL in the system message, then set the response format to mp3 audio"],a:2,
 ex:`Audio-enabled models such as <code>gpt-audio-mini</code> accept an <code>input_audio</code> content part holding base64 data and its format. Setting <code>modalities=["text","audio"]</code> with an <code>audio</code> voice and format returns a spoken reply in <code>message.audio.data</code>. A separate transcription step isn't needed, because these models accept audio input directly.`},

/* src: https://learn.microsoft.com/en-us/training/modules/get-started-vision-azure/2-vision-enabled-models */
{s:0,d:2,t:"single",ref:"Responses API input_text input_image vision-enabled model image prompt",
 stem:`A safari app sends a photo and a question to a deployed <code>gpt-4.1-mini</code> model with <code>client.responses.create()</code>. The user message content is a list. Which pair of content parts should the list contain?`,
 opts:["A part of type input_text with the question, and a part of type input_image with the image_url","A part of type text with the question, and a part of type input_audio that holds the photo's bytes","A single part of type input_text that contains both the question and the photo's local file path","A part of type input_image only, because the model ignores any text sent with an image anyway"],a:0,
 ex:`With the Responses API, one user message can combine an <code>input_text</code> part for the instruction and an <code>input_image</code> part whose <code>image_url</code> is a URL or base64 data. The model reads both together. A local file path inside text isn't image data, and <code>input_audio</code> is for sound, not pictures.`},

/* src: https://learn.microsoft.com/en-us/training/modules/get-started-vision-azure/3-image-generation */
{s:0,d:2,t:"single",ref:"Responses API image_generation tool image_generation_call base64 decode save png",
 stem:`A marketing app calls <code>client.responses.create(model=deployment, input=prompt, tools=[{"type": "image_generation"}])</code>. It then finds the output item whose type is <code>image_generation_call</code>, passes its <code>result</code> to <code>base64.b64decode()</code>, and writes the bytes to <code>foundry_generated.png</code>. What does this code do?`,
 opts:["It describes an existing PNG image in text, and saves that description to a file with a .png name","It creates a new image from the text prompt, decodes the returned base64 data, and saves it as a PNG file","It uploads the PNG file to the model so the model can edit the image, then overwrites the original","It downloads an image from a public URL that the model returns, then converts it from JPEG to PNG"],a:1,
 ex:`The image generation tool makes the model create a new image from the prompt. The image comes back as base64 text in the <code>image_generation_call</code> item, so the code decodes it to bytes and writes the PNG. Nothing is read from disk or downloaded from a URL, and describing an image would be a vision input task, not generation.`},

/* src: https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/gpt-with-vision */
{s:0,d:2,t:"multi",n:2,ref:"vision-enabled chat model image URL or base64 data URL local image",
 stem:`You send images to a vision-enabled chat model deployed in Microsoft Foundry. Some photos are on a public website and some are on the user's laptop. Which two ways can the request supply an image? Each correct answer presents a complete solution.`,
 opts:["A valid HTTP or HTTPS URL that points to the image on the public website","A data URL that holds the local image as base64, such as data:image/jpeg;base64,...","The local path string, such as C:\\photos\\cat.jpg, which the service opens directly","An SSML audio element with a src attribute that points to the image file to describe","The image file name in the system message, which tells the model to find the image itself"],a:[0,1],
 ex:`The message content can include images as a valid HTTP or HTTPS URL or as base64-encoded image data, so a local file is first converted to base64 and passed as a data URL. The service can't open a path on the user's machine, and SSML is markup for text to speech, not image input.`},

/* src: https://learn.microsoft.com/en-us/training/modules/get-started-speech-azure/4-voice-live */
{s:0,d:2,t:"yesno",ref:"Azure Speech Voice Live API speech to speech agent voice mode generative model",
 stem:`You are building a returns assistant that holds real-time spoken conversations by using Azure Speech Voice Live. For each statement, select Yes if it is true. Otherwise, select No.`,
 rows:["The Voice Live API combines speech to text, AI reasoning and text to speech in one managed service, instead of you connecting separate pieces.","When you create a Voice Live solution in the Foundry playground, you choose a generative AI model for the agent to use alongside the acoustic models.","After you enable Voice mode for a Foundry agent, the client app must still call the speech to text and text to speech SDKs itself."],a:[1,1,0],
 ex:`Voice Live combines speech to text, reasoning and text to speech in one fully managed service, and you choose a generative AI model that it uses alongside its own acoustic models. Enabling Voice mode puts the speech configuration in the agent definition, which reduces the client code you need, so the client doesn't wire up the speech SDKs itself.`},

/* src: https://learn.microsoft.com/en-us/training/modules/get-started-text-analysis-azure/3-language-sdk */
{s:0,d:2,t:"multi",n:2,ref:"general-purpose model responses API vs Azure Language SDK deterministic structured output",
 stem:`A team compares the OpenAI Responses API with a deployed general-purpose model against the Azure Language SDK for text analysis. Which two statements are correct? Each correct answer presents a complete solution.`,
 opts:["The general-purpose model can return different wording for the same prompt, because it generates text probabilistically","The Azure Language SDK fits apps that need consistent, structured values such as a language code or redacted text","The Azure Language SDK requires you to train a custom model before it can detect the language of a document","The general-purpose model returns the same structured JSON on every call, because the playground fixes its schema","The Responses API can only translate text, so sentiment analysis needs a separate Azure Language resource"],a:[0,1],
 ex:`A general-purpose model generates text probabilistically, so the same prompt can come back worded differently, while the Azure Language SDK returns structured, deterministic values such as a language code, confidence score or redacted text. Language detection is prebuilt and needs no training, and a general-purpose model can also do sentiment analysis from a prompt.`},
];

export const e2=[
/* src: https://learn.microsoft.com/en-us/training/modules/get-started-text-analysis-azure/2-azure-language */
{s:0,d:2,t:"single",ref:"general-purpose AI model text analysis summarize translate chat playground follow-up",
 stem:`An analyst wants to paste long customer reviews written in French, get them translated to English, then ask for a short summary and follow-up questions in the same conversation. No fixed output format is needed. What should you use?`,
 opts:["A deployed general-purpose model in the Foundry chat playground, driven by natural language prompts", "Azure Language PII detection, which redacts the text and then returns a summary for each review", "Azure Speech batch transcription, which converts the text reviews to English and summarizes them", "Azure Language language detection, which returns the ISO code and then translates the review text"],a:0,
 ex:`A general-purpose model follows natural language instructions, so it can translate, summarize and answer follow-up questions in one conversation, and the playground keeps the context. Azure Language analyzers each return structured results for one task: language detection identifies the language but doesn't translate, and PII detection redacts personal details.`},

/* src: https://learn.microsoft.com/en-us/training/modules/get-started-text-analysis-azure/4-language-mcp */
{s:0,d:2,t:"single",ref:"Azure Language MCP server agent tool Foundry resource name connection",
 stem:`A Foundry agent must detect the language of support tickets and redact PII with consistent, structured results. You want the agent to call Azure Language without custom integration code. What should you do?`,
 opts:["Create a separate Azure Language resource, then paste its REST endpoint into the agent instructions", "Ask the agent's model to run language detection itself, since the model returns the same output every time", "Add the Azure Speech text to speech tool, which reads the ticket aloud and detects its language from the audio", "Add the Azure Language in Foundry Tools MCP server as a tool, configured with your Foundry resource name"],a:3,
 ex:`The Azure Language MCP server exposes Azure Language capabilities through MCP, so the agent can discover and call them. In the Foundry playground you add it as a tool and configure the connection with your Foundry resource name. The Foundry resource already includes Language tools, so you don't need a separate Language resource, and the model alone isn't deterministic.`},

/* src: https://learn.microsoft.com/en-us/training/modules/get-started-text-analysis-azure/3-language-sdk */
{s:0,d:2,t:"single",ref:"OpenAI client responses.create model deployment name base_url openai/v1",
 stem:`You deploy the <code>gpt-4.1</code> model in Foundry and name the deployment <code>review-analyzer</code>. A Python app creates <code>OpenAI(base_url=endpoint, api_key=key)</code> with the endpoint <code>https://&lt;resource&gt;.openai.azure.com/openai/v1/</code>. Which call sends a sentiment prompt to that deployment?`,
 opts:["client.responses.create(model=\"gpt-4.1\", input=prompt), using the base model name from the catalog","client.responses.create(model=\"review-analyzer\", input=prompt), using the deployment name","client.responses.create(model=endpoint, input=prompt), using the resource endpoint as the model value","client.responses.create(model=key, input=prompt), using the project key to select the deployment"],a:1,
 ex:`The <code>model</code> parameter takes the deployment name, the name you gave the model when you deployed it. Only if you keep the default does it match the base model name. The endpoint and key authenticate the client and are passed when you create it, not as the model value.`},

/* src: https://learn.microsoft.com/en-us/training/modules/get-started-speech-azure/2-speech-recognition */
{s:0,d:2,t:"single",ref:"start_continuous_recognition recognizing recognized events live captions",
 stem:`A live captioning app uses Azure Speech to transcribe a presenter who talks for an hour. Captions must show words while the presenter is still speaking, then be replaced by the final text for each sentence. How should you set up the <code>SpeechRecognizer</code>?`,
 opts:["Call recognize_once_async() in a loop, and print result.text only after each call returns its single result", "Call speak_text_async() on the presenter's audio, and read the interim captions from the synthesis result", "Call start_continuous_recognition(), show interim text from the recognizing event and final text from recognized", "Submit a batch transcription job with a SAS URI, and poll it every second to show the words as they arrive"],a:2,
 ex:`Continuous recognition handles long audio, and the <code>recognizing</code> event fires with interim results while the <code>recognized</code> event gives the final text of each utterance. <code>recognize_once_async()</code> recognizes a single utterance of up to about 30 seconds, so it isn't built for an hour of speech, and batch transcription is asynchronous, so it can't caption live speech.`},

/* src: https://learn.microsoft.com/en-us/training/modules/get-started-speech-azure/2-speech-recognition */
{s:0,d:2,t:"single",ref:"Azure Speech batch transcription SAS URI asynchronous best-effort",
 stem:`A call center keeps thousands of recorded calls in Azure Storage and wants transcripts by the next morning. Nobody needs the text while the calls are happening. Which Azure Speech approach fits?`,
 opts:["Batch transcription that points to the files with a SAS URI and returns the results asynchronously", "Real-time transcription from the default microphone, played back through the speakers overnight", "Text to speech with a neural voice, which writes each recording to a transcript file in Blob Storage", "Voice Live, which opens a conversation with each recording and summarizes the call while it runs"],a:0,
 ex:`Batch transcription is for recordings already in storage: you point to them with a shared access signature (SAS) URI and receive the results asynchronously, since jobs are scheduled on a best-effort basis. Real-time transcription is for live audio streams, and text to speech produces audio from text, not transcripts.`},

/* src: https://learn.microsoft.com/en-us/azure/ai-services/speech-service/how-to-speech-synthesis */
{s:0,d:2,t:"single",ref:"AudioOutputConfig filename speak_text_async save synthesized speech wav file",
 stem:`A backend service must create a spoken greeting with Azure Speech and save it as <code>greeting.wav</code> for later playback instead of playing it on a speaker. Which configuration should you pass to the <code>SpeechSynthesizer</code>?`,
 opts:["speechsdk.audio.AudioOutputConfig(use_default_speaker=True), which writes to the file named in the text","speechsdk.audio.AudioOutputConfig(filename=\"greeting.wav\"), then call speak_text_async() with the text","speechsdk.audio.AudioConfig(filename=\"greeting.wav\"), then call recognize_once_async() to record it","speechsdk.audio.AudioConfig(use_default_microphone=True), then save result.text as greeting.wav"],a:1,
 ex:`<code>AudioOutputConfig</code> with the <code>filename</code> parameter makes the synthesizer write the audio to a .wav file when you call <code>speak_text_async()</code>. <code>use_default_speaker=True</code> plays audio on the speaker instead, and <code>AudioConfig</code> with a recognizer is for speech to text input, not output.`},

/* src: https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-synthesis-markup-voice */
{s:0,d:2,t:"single",ref:"SSML prosody rate slow speaking rate percentage",
 stem:`Listeners say a neural voice in your audiobook app reads instructions too quickly. You want only one paragraph spoken about 20 percent slower than the default rate. Which SSML should wrap that paragraph?`,
 opts:["<break time=\"20%\">, which adds pauses between the words to make up 20 percent extra time", "<prosody volume=\"-20%\">, which lowers the voice so the listener hears each word more slowly", "<emphasis level=\"reduced\">, which reduces the stress and the speed of the text by 20 percent", "<prosody rate=\"-20%\">, which lowers the speaking rate of the enclosed text by 20 percent"],a:3,
 ex:`The <code>prosody</code> element's <code>rate</code> attribute sets the speaking rate, and a relative percentage such as <code>-20%</code> slows the enclosed text. The <code>break</code> time attribute takes seconds or milliseconds, not percentages, and the <code>volume</code> attribute changes loudness, not speed.`},

/* src: https://learn.microsoft.com/en-us/azure/foundry/openai/audio-completions-quickstart */
{s:0,d:2,t:"yesno",ref:"gpt-audio-mini audio modality Chat playground Realtime API low latency",
 stem:`You deploy <code>gpt-audio-mini</code> in Microsoft Foundry to answer spoken prompts. For each statement, select Yes if it is true. Otherwise, select No.`,
 rows:["The model can take audio as input and return text only, for example to transcribe a recording.","To get a spoken reply, the request sets modalities to include audio and gives a voice and format in the audio parameter.","You test the deployment by recording prompts in the Foundry Audio playground, which is the playground that supports this model."],a:[1,1,0],
 ex:`Audio-enabled models support audio in with text out, such as transcription, and a request returns spoken audio when <code>modalities</code> includes <code>audio</code> and the <code>audio</code> parameter sets a voice and format. The Audio playground doesn't support <code>gpt-audio-mini</code>, so you use the Chat playground, where you can record audio prompts and attach audio files.`},

/* src: https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/gpt-with-vision */
{s:0,d:2,t:"single",ref:"vision image_url detail low high auto tokens faster",
 stem:`A photo-sorting app asks a vision-enabled model only whether each image is indoors or outdoors. Fine detail doesn't matter, and you want faster responses with fewer tokens. How should you set the image part of the request?`,
 opts:["Set detail to high, so the model reads 512x512 segments of the image in its high resolution mode","Set detail to auto, so the model always picks the high resolution mode for photos larger than 512x512","Set detail to low, so the model processes a 512x512 version without turning on the high-res mode","Leave out the image_url field and describe the photo in text, so the model doesn't have to see it"],a:2,
 ex:`The <code>detail</code> value <code>low</code> keeps the model out of high-res mode and processes a 512x512 version, giving quicker responses and fewer tokens when fine detail isn't needed. <code>high</code> adds detailed 512x512 segments that each use double the token budget, and <code>auto</code>, the default, lets the model choose based on image size.`},

/* src: https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/dall-e */
{s:0,d:2,t:"multi",n:2,ref:"gpt-image-1 size 1536x1024 quality low medium high b64_json",
 stem:`You call a <code>gpt-image-1</code> deployment to make draft banner images. Drafts must be landscape and should generate as fast as possible. Which two request settings should you use? Each correct answer presents part of the solution.`,
 opts:["Set size to 1536x1024, one of the landscape sizes that the GPT-image-1 series supports","Set quality to low, since lower quality images from these models are generated faster","Set size to 1792x1024, the wide size that every image generation model in Foundry accepts","Set response_format to url, so the service skips base64 encoding and returns images faster","Set style to natural, which skips the cinematic rendering pass so drafts finish sooner"],a:[0,1],
 ex:`GPT-image-1 series sizes are <code>1024x1024</code>, <code>1024x1536</code> and <code>1536x1024</code>, and quality can be <code>low</code>, <code>medium</code> or <code>high</code>, with lower quality generating faster. <code>1792x1024</code> and the <code>style</code> option belong to DALL-E 3, and <code>response_format</code> isn't supported for GPT-image-1 series models, which always return base64.`},

/* src: https://learn.microsoft.com/en-us/training/modules/get-started-vision-azure/3-image-generation */
{s:0,d:2,t:"multi",n:2,ref:"Foundry image generation models GPT-Image-1.5 GPT-Image-1-Mini text-to-image",
 stem:`A design team wants to create new product illustrations from text descriptions by using a model deployed in Microsoft Foundry. Which two models can they deploy for this? Each correct answer presents a complete solution.`,
 opts:["GPT-Image-1.5, for high-fidelity text-to-image creation and editing","GPT-Image-1-Mini, a lighter model for cheaper, lower-latency images","GPT-4.1-mini, which takes images as input and answers about them","gpt-4o-mini-tts, which creates spoken audio from text descriptions","gpt-audio-mini, which answers prompts with spoken audio and text"],a:[0,1],
 ex:`GPT-Image-1.5 is the most advanced image generation model in Foundry and supports text-to-image and editing, and GPT-Image-1-Mini is a lighter, more cost-efficient version for lower latency. GPT-4.1-mini is multimodal for image input but returns text, and the TTS and audio models produce speech, not images.`},
];
