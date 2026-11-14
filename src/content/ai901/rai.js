// AI-901 skill areas: "Describe principles of responsible AI" and "Identify AI model components and configurations" (d:1).
// e1 = Mock Exam I, e2 = Mock Exam II. All items s:0.

export const e1=[
/* src: https://learn.microsoft.com/en-us/training/modules/get-started-ai-fundamentals/7-responsible-ai */
{s:0,d:1,t:"single",ref:"responsible AI transparency disclose use of AI loan approval training data",
 stem:`A bank uses an AI-based application to approve or decline loans. The bank tells applicants that AI is used in the decision and describes features of the data the model was trained on, without revealing confidential information. Which responsible AI principle does this practice address?`,
 opts:["Fairness, because describing the data proves that every applicant is treated in the same way","Transparency, because users are made aware of how the system works and of its limitations","Accountability, because disclosure moves responsibility for the decision to the loan applicant","Inclusiveness, because explaining the data makes the application usable by more applicants"],a:1,
 ex:`Transparency means making users aware of how an AI system works and any limitations it may have. Microsoft Learn uses this exact example: a bank should disclose the use of AI and describe features of the training data. Fairness is about minimizing bias and testing outcomes, which disclosure alone does not do.`},

/* src: https://learn.microsoft.com/en-us/training/modules/get-started-ai-fundamentals/7-responsible-ai */
{s:0,d:1,t:"single",ref:"responsible AI inclusiveness speech agent text captions hearing impairment",
 stem:`You are building an AI agent that users talk to by voice. The agent also displays text captions of its spoken responses so that users with a hearing impairment can still use it. Which responsible AI principle does this design choice support?`,
 opts:["Reliability and safety, since the captions let the agent recover when speech recognition fails","Privacy and security, since captions keep spoken answers from being overheard by other people","Inclusiveness, since the solution should not exclude users and should be open to everyone","Transparency, since captions show users exactly which model generated each spoken response"],a:2,
 ex:`Inclusiveness means the benefits of AI should be open to everyone, so solutions shouldn't exclude some users. Microsoft Learn gives the example of a speech-based agent that also generates text captions for users with a hearing impairment. Captions aren't a reliability safeguard or a privacy control.`},

/* src: https://learn.microsoft.com/en-us/training/modules/get-started-ai-fundamentals/7-responsible-ai */
{s:0,d:1,t:"single",ref:"responsible AI reliability safety confidence threshold robot computer vision",
 stem:`A warehouse robot uses computer vision to detect objects before it picks them up. The robot only acts when the confidence score for an identified object is above a set threshold, and does nothing otherwise. Which responsible AI principle is this safeguard designed to support?`,
 opts:["Reliability and safety, because AI is probabilistic and the robot must avoid unintended harm","Fairness, because a threshold makes the robot treat every type of object in exactly the same way","Accountability, because the threshold makes the robot itself answerable for any damage it causes","Transparency, because the confidence score explains to operators why each object was identified"],a:0,
 ex:`AI is based on probabilistic models and isn't infallible, so reliability and safety means mitigating that risk. Learn's example is a robot that uses confidence values and avoids acting below a threshold so it doesn't cause unintended harm or damage. Accountability stays with people and organizations, never with the AI system.`},

/* src: https://learn.microsoft.com/en-us/training/modules/get-started-ai-fundamentals/7-responsible-ai */
{s:0,d:1,t:"multi",n:2,ref:"responsible AI privacy security facial identification delete images restrict access",
 stem:`An airport uses a facial identification system to give travelers temporary access to a secure area. Which two practices support the privacy and security principle? Each correct answer presents a complete solution.`,
 opts:["Delete the personal images used for temporary access as soon as they're no longer needed","Test the system across demographic groups to confirm it identifies everyone equally well","Prevent the images from being viewed by operators or users who have no need to see them","Publish a notice that describes how the identification model works and where it can fail","Display text instructions alongside audio prompts for travelers who can't hear the prompts"],a:[0,2],
 ex:`Privacy and security means keeping personal data secure and ensuring it can't be used to reveal private details. Learn's airport example says personal images should be deleted when no longer required and kept from operators who don't need them. Demographic testing supports fairness, the published notice supports transparency, and text instructions support inclusiveness.`},

/* src: https://learn.microsoft.com/en-us/training/modules/get-started-ai-fundamentals/7-responsible-ai */
{s:0,d:1,t:"single",ref:"responsible AI fairness college admissions demographic discrimination bias",
 stem:`A university plans to use AI to screen admissions applications. Before go-live, the team tests whether the system evaluates applications on relevant academic criteria and not on unrelated demographic factors. Which principle is this testing mainly intended to uphold?`,
 opts:["Inclusiveness, because the test makes sure that every applicant is able to submit an application","Privacy and security, because the test keeps applicants' demographic details out of the results","Reliability and safety, because the test confirms that the system keeps running during peak load","Fairness, because training data can carry unconscious bias that leads to discriminatory outputs"],a:3,
 ex:`Fairness addresses the risk that training data, or the way it was selected, reflects unconscious bias that makes a model produce discriminatory outputs. Developers should minimize bias and test for fairness, as in Learn's college admissions example. Inclusiveness is about not excluding users from the solution, not about how decisions are scored.`},

/* src: https://learn.microsoft.com/en-us/training/modules/get-started-ai-fundamentals/7-responsible-ai */
{s:0,d:1,t:"single",ref:"responsible AI accountability governance framework organization responsible",
 stem:`A company that builds and sells AI-powered apps sets up a governance framework that its development teams must follow to apply responsible AI principles to their work. Which principle does a governance framework most directly address?`,
 opts:["Accountability, because the people and organizations that build and distribute AI are answerable for it","Transparency, because the framework explains to end users how each app reaches the answers it returns","Fairness, because a governance framework removes unconscious bias from the training data automatically","Reliability and safety, because the framework guarantees the deployed models never return wrong answers"],a:0,
 ex:`Accountability holds that the people and organizations that develop and distribute AI solutions are accountable for their actions, and Learn says organizations should define and apply a governance framework to make sure they apply responsible AI principles. A framework doesn't by itself explain answers to users, remove bias, or make probabilistic models infallible.`},

/* src: https://learn.microsoft.com/en-us/azure/machine-learning/concept-responsible-ai?view=azureml-api-2 */
{s:0,d:1,t:"yesno",ref:"responsible AI accountability final authority privacy encrypt fairness similar recommendations",
 stem:`For each statement about Microsoft's responsible AI principles, select Yes if the statement is true. Otherwise, select No.`,
 rows:["Accountability norms help ensure that AI systems are not the final authority on decisions that affect people's lives.","Restricting network communications and encrypting data in transit and at rest are measures that support the privacy and security principle.","Under the fairness principle, an AI system may give different recommendations to people who have similar qualifications if they belong to different groups."],a:[1,1,0],
 ex:`Accountability norms keep humans in meaningful control so AI isn't the final authority on decisions about people's lives. Access restrictions, network restrictions, and encryption in transit and at rest are listed as ways to implement privacy and security. Fairness means people with similar symptoms, finances, or qualifications should get the same recommendations, so the third statement is false.`},

/* src: https://learn.microsoft.com/en-us/training/modules/fundamentals-generative-ai/3-language-models */
{s:0,d:1,t:"single",ref:"LLM tokenization tokens sub-words punctuation unique integer ID",
 stem:`A colleague says that a language model's vocabulary is simply a list of whole words. How should you correct this description of how an LLM breaks down text during training?`,
 opts:["The vocabulary holds full sentences, and each sentence gets one vector that is fixed before training","The vocabulary holds only single characters, and the model rebuilds words from them at inference time","The vocabulary holds tokens: words, sub-words, punctuation and common character sequences, each with an ID","The vocabulary holds only the words found in the prompt, which are tokenized fresh on each new request"],a:2,
 ex:`LLMs break their vocabulary into tokens, which include words, sub-words (like "un" in "unbelievable"), punctuation, and other common character sequences. Each distinct token is assigned a unique integer identifier. The vocabulary is built from large volumes of training data, not from each prompt.`},

/* src: https://learn.microsoft.com/en-us/training/modules/fundamentals-generative-ai/3-language-models */
{s:0,d:1,t:"single",ref:"transformer attention layer weights surrounding tokens embeddings multi-head",
 stem:`In the sentence "I heard a dog bark", a transformer's encoder processes the token "bark". What does the attention layer do at this step?`,
 opts:["It deletes the low-value tokens 'I' and 'a' from the vocabulary so they can't be used again","It weights the surrounding tokens by their influence, giving 'heard' and 'dog' more weight","It replaces 'bark' with the most frequent token in the training data that has a similar spelling","It assigns 'bark' a new integer ID, based on where the token appears in the sentence it is in"],a:1,
 ex:`An attention layer considers each token in the context of the sequence, weighting the surrounding tokens by their influence and using the weights to calculate the token's embedding. For "bark", "heard" and "dog" are stronger indicators than "I" or "a". Position is supplied by positional encoding; token IDs don't change.`},

/* src: https://learn.microsoft.com/en-us/training/modules/get-started-with-generative-ai-and-agents/2-generative-ai-models */
{s:0,d:1,t:"single",ref:"choose embedding model text-embedding-3-small semantic vector search",
 stem:`You need to convert thousands of support articles into vector representations so that an app can find the articles most semantically similar to a user's question. Which type of model should you choose from the Foundry model catalog?`,
 opts:["An image-generation model, because it produces dense visual representations of each article","An embedding model such as text-embedding-3-small, built for semantic vector representations","A reasoning model, because multi-step planning is needed to rank every article by its relevance","A speech-to-text model, because it converts written articles into a numeric form for comparison"],a:1,
 ex:`The Foundry module's task table recommends embedding models such as text-embedding-3-small for embeddings, because they're built for semantic vector representations. Reasoning models suit multi-step logic and planning, not producing vectors for similarity search.`},

/* src: https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/prompt-engineering */
{s:0,d:1,t:"single",ref:"temperature low value legal document focused deterministic",
 stem:`An app uses a deployed GPT model to draft contract clauses. Reviewers want output that is focused and consistent, not creative. How should you set the temperature parameter?`,
 opts:["Set it to a high value such as 1.8, so that the model always returns its most likely answer","Set it to a low value such as 0.2, which makes the output more focused and more concrete","Set it to exactly 1.0, which is the only value that disables random sampling in the model","Leave temperature alone and raise max output tokens, which makes the responses more focused"],a:1,
 ex:`Temperature ranges from 0 to 2. Lower values such as 0.2 make output more focused and concrete, and Microsoft recommends a much lower temperature for legal documents. Higher values make output more random and divergent. Max output tokens only caps response length.`},

/* src: https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/deployment-types */
{s:0,d:1,t:"multi",n:2,ref:"Data Zone Standard Data Zone Provisioned EU data processing deployment type",
 stem:`A company in the European Union must make sure that prompts and responses for its Foundry model deployment are processed only within the EU data zone. Which two deployment types meet this requirement? Each correct answer presents a complete solution.`,
 opts:["Global Standard","Data Zone Standard","Global Provisioned","Data Zone Provisioned","Developer"],a:[1,3],
 ex:`Data Zone deployment types process prompts and responses only within the Microsoft-specified data zone (US, EU, or APAC). Data Zone Standard is pay-per-token and Data Zone Provisioned adds reserved capacity. Global types can process data in any Azure region, and Developer has no data-residency guarantee.`},

/* src: https://learn.microsoft.com/en-us/training/modules/get-started-with-generative-ai-and-agents/2-generative-ai-models */
{s:0,d:1,t:"single",ref:"throttling rate limit TPM max output tokens deployment",
 stem:`Your chat app calls a model deployment in Foundry and starts receiving rate-limit errors during busy periods. You can't change the deployment's tokens per minute (TPM) allocation yet. What can you change in your code to reduce throttling?`,
 opts:["Raise the temperature setting so that the model chooses its next tokens more quickly","Add a longer system prompt so that the model needs fewer turns to complete each request","Switch every request to a reasoning model so that it spends more effort on each answer","Lower the max output tokens setting or reduce the number of concurrent requests you send"],a:3,
 ex:`Deployment quotas set how many tokens or requests are processed before throttling occurs. Larger prompts and higher max output token settings consume more TPM, so the module's advice is to lower max tokens or reduce concurrent requests. A longer system prompt adds input tokens and makes the problem worse.`},

/* src: https://learn.microsoft.com/en-us/training/modules/get-started-with-generative-ai-and-agents/2-generative-ai-models */
{s:0,d:1,t:"single",ref:"choose model GPT-4.1 low latency real-time chat vs reasoning model GPT-5",
 stem:`A retailer needs a model for a high-volume, real-time customer support chat that must respond quickly at scale. Complex multi-step planning isn't required. Based on Foundry guidance, which choice fits best?`,
 opts:["A reasoning-focused model with its thinking level set as high as it goes, for the most accuracy","An embedding model, because it returns a vector for each question faster than any chat model","GPT-4.1, which is optimized for speed, efficiency and low-latency inference for real-time chat","A domain-specialized model for legal work, because support chats need structured legal logic"],a:2,
 ex:`The Foundry module describes GPT-4.1 as ideal for real-time chat, customer support, and interactive apps that must respond quickly at scale, and better than reasoning-heavy models for high-volume production workloads. Reasoning models like GPT-5.x suit multi-step reasoning and planning, and trade speed for accuracy.`},
];

export const e2=[
/* src: https://learn.microsoft.com/en-us/training/modules/get-started-ai-fundamentals/7-responsible-ai */
{s:0,d:1,t:"single",ref:"responsible AI fairness biased training data hiring model historical",
 stem:`A company trains a model to rank job applicants by using records of past hiring decisions. Most past hires came from a single demographic group. Which responsible AI principle is most at risk, and what should the developers do?`,
 opts:["Transparency; they should tell applicants that a model ranks them and leave the data as it is","Privacy and security; they should encrypt the past hiring records before they are used for training","Fairness; they should minimize bias in the training data and test the system for fair outcomes","Reliability and safety; they should add more servers so the ranking runs consistently under load"],a:2,
 ex:`Data selected by humans can reflect unconscious bias that makes a model produce discriminatory outputs. The fairness principle asks developers to minimize bias in training data and test AI systems for fairness. Telling applicants about the model supports transparency but doesn't fix the bias.`},

/* src: https://learn.microsoft.com/en-us/azure/machine-learning/concept-responsible-ai?view=azureml-api-2 */
{s:0,d:1,t:"single",ref:"responsible AI transparency interpretability explain why decision job candidate",
 stem:`A company uses an AI system to shortlist job candidates. A rejected candidate asks why the system did not select them, and the company wants to give a useful, human-understandable explanation. Which principle does this support?`,
 opts:["Inclusiveness, which requires that the system shortlist every candidate who applies for a role","Transparency, where interpretability gives people useful explanations of how the system decides","Accountability, which requires that the candidate takes responsibility for the system's decision","Privacy and security, which requires that the reasons for a decision are never shared with anyone"],a:1,
 ex:`When AI informs decisions that affect people's lives, such as selecting job candidates, people need to understand how those decisions are made. Interpretability, providing useful explanations of AI behavior, is a crucial part of transparency. Accountability stays with the people and organizations that build and deploy the system.`},

/* src: https://learn.microsoft.com/en-us/azure/machine-learning/concept-responsible-ai?view=azureml-api-2 */
{s:0,d:1,t:"single",ref:"responsible AI privacy consumers control how their data is used privacy laws",
 stem:`A chatbot app explains to users what conversation data it collects, how the data is stored, and lets each user choose whether their conversations can be used to improve the service. Which principle are these features mainly designed to meet?`,
 opts:["Privacy and security, since privacy laws require transparency about data use and user control","Fairness, since giving every user the same data choices guarantees equal answers for everyone","Reliability and safety, since stored conversations allow the chatbot to restart after a failure","Inclusiveness, since letting users opt out means the app can be used without an internet link"],a:0,
 ex:`AI systems must comply with privacy laws that require transparency about how data is collected, used, and stored, and that give consumers appropriate controls over how their data is used. These features fall under privacy and security, not fairness or reliability.`},

/* src: https://learn.microsoft.com/en-us/azure/machine-learning/concept-responsible-ai?view=azureml-api-2 */
{s:0,d:1,t:"single",ref:"responsible AI reliability safety error analysis cohorts higher error rate unexpected conditions",
 stem:`Before release, a team analyzes where its model fails and finds subsets of data, including rarely observed input conditions, with a higher error rate than the overall benchmark. Which principle does this work mainly support?`,
 opts:["Transparency, because publishing error rates is the main goal of analyzing model failures","Accountability, because the analysis assigns blame for each failure to the original data team","Inclusiveness, because rare inputs must be removed so the model only sees common conditions","Reliability and safety, because systems should work as designed and respond safely to the unexpected"],a:3,
 ex:`Reliability and safety means AI systems operate reliably and consistently, function as designed, and respond safely to unexpected conditions. Error analysis that finds cohorts with higher error rates, including rarely observed input conditions, supports this principle. Removing rare inputs wouldn't make the system handle them.`},

/* src: https://learn.microsoft.com/en-us/azure/machine-learning/concept-responsible-ai?view=azureml-api-2 */
{s:0,d:1,t:"single",ref:"responsible AI accountability lineage who published model why changes when deployed MLOps",
 stem:`An organization logs who publishes each model, why changes were made, and when models were deployed or used in production. It also sets alerts for events such as data drift. Which principle is this governance data primarily intended to support?`,
 opts:["Inclusiveness, because the logs make each model usable by more people in the organization","Fairness, because the logs make sure every model treats all user groups in the same way","Accountability, because people who design and deploy AI must answer for how it operates","Transparency, because the logs explain to end users why the model gave a specific answer"],a:2,
 ex:`People who design and deploy AI systems must be accountable for how they operate. Capturing lineage (who published a model, why it changed, when it was deployed) and alerting on lifecycle events are MLOps capabilities listed for accountability. Explaining individual answers to end users is interpretability, part of transparency.`},

/* src: https://learn.microsoft.com/en-us/training/modules/get-started-ai-fundamentals/7-responsible-ai */
{s:0,d:1,t:"multi",n:2,ref:"responsible AI inclusiveness don't exclude users accessibility",
 stem:`You are reviewing a voice-driven AI app against the inclusiveness principle. Which two actions support inclusiveness? Each correct answer presents a complete solution.`,
 opts:["Encrypt stored voice recordings so attackers can't reveal personal details of the app's users","Show text captions of spoken responses so that users with a hearing impairment can use the app","Test the app with people across a range of abilities to confirm it doesn't exclude some users","Name an owner who is answerable for the app's behavior and for any harm that it causes users","Act only when the speech recognizer's confidence score is above a threshold that you defined"],a:[1,2],
 ex:`Inclusiveness means AI should be open to everyone, so developers should make sure their solutions don't exclude some users. Captions for spoken output and testing with people of varying abilities both serve that goal. Encryption supports privacy and security, a named owner supports accountability, and a confidence threshold supports reliability and safety.`},

/* src: https://learn.microsoft.com/en-us/training/modules/get-started-ai-fundamentals/7-responsible-ai */
{s:0,d:1,t:"yesno",ref:"responsible AI content filters guardrails conception design operation",
 stem:`For each statement about responsible AI, select Yes if the statement is true. Otherwise, select No.`,
 rows:["Content filters are one way that an AI system can mitigate the risk of generating harmful content.","Responsible AI principles should be considered from a solution's conception, through its design and implementation, and into its operation.","Because humans select a model's training data, the model's outputs can't reflect bias."],a:[1,1,0],
 ex:`Content filters are one guardrail against harmful content, but a responsible solution also needs the principles applied from conception through design, implementation, and operation. Human-selected data is exactly where unconscious bias can come from, so the third statement is false.`},

/* src: https://learn.microsoft.com/en-us/training/modules/fundamentals-generative-ai/3-language-models */
{s:0,d:1,t:"single",ref:"embeddings cosine similarity semantic closeness vectors dog puppy",
 stem:`After training, the embedding vectors for "dog" and "puppy" point in nearly the same direction, while "skateboard" points in a very different one. How can you measure how semantically close two tokens are?`,
 opts:["Compare the integer token IDs, because tokens with close IDs always have similar meanings","Count the characters that the two tokens share, because shared spelling shows shared meaning","Compare the positional encodings, because tokens used in the same position have one meaning","Calculate the cosine similarity of their embedding vectors in the multi-dimensional space"],a:3,
 ex:`Tokens used in similar contexts get embeddings that point in similar directions, and you measure semantic closeness by calculating the cosine similarity of the vectors. Token IDs are just labels assigned in order, and positional encoding only says where a token appears in a sequence.`},

/* src: https://learn.microsoft.com/en-us/azure/aks/concepts-ai-ml-language-models */
{s:0,d:1,t:"single",ref:"small language model SLM Phi-4-mini narrow task limited resources",
 stem:`A team needs a model for a well-defined, narrow text task. It must run on modest hardware with a small memory footprint and be cheap to run. Which kind of model fits best?`,
 opts:["A small language model such as Phi-4-mini, which is faster and cheaper to run","A large language model with hundreds of billions of parameters, for broad knowledge","An embedding model, because it produces text answers with the smallest footprint","A multimodal model, because handling images makes the model need less memory"],a:0,
 ex:`Small language models (generally under 10 billion parameters, such as Phi-4-mini at 3.8 billion) are faster and cheaper to run, have smaller storage and memory footprints, and suit well-defined or narrow tasks. Large language models are more general and expressive but more expensive to run. Embedding models return vectors, not text answers.`},

/* src: https://learn.microsoft.com/en-us/training/modules/get-started-with-generative-ai-and-agents/2-generative-ai-models */
{s:0,d:1,t:"single",ref:"multimodal model images audio chat completions Phi-4-multimodal-instruct",
 stem:`Users of a field service app will send photos of damaged equipment and spoken questions about them in the same chat. Which type of model should you choose from the Foundry model catalog?`,
 opts:["An embedding model such as text-embedding-3-small, which handles images and audio as vectors","A coding model such as GPT-5.1-codex, which supports complex agent flows with multiple tools","A multimodal model such as Phi-4-multimodal-instruct, which accepts images and audio in chat","A text-only small language model, because photos and audio are converted to text by the app"],a:2,
 ex:`The Foundry module lists multimodal models such as Phi-4-multimodal-instruct for scenarios that need images, audio, and video in chat completions. Embedding models produce semantic vectors for search, and coding models target code generation and complex agent flows.`},

/* src: https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/chatgpt */
{s:0,d:1,t:"multi",n:2,ref:"context window token limit long conversation trim oldest messages Responses API truncation",
 stem:`A chat app sends the full conversation history with each request. After long conversations, requests fail because the model's token limit (context window) is exceeded. Which two actions resolve this? Each correct answer presents a complete solution.`,
 opts:["Track the token count and remove the oldest user and assistant messages, keeping the system message","Raise the temperature setting so that the model writes shorter answers and leaves more room for the history","Use the Responses API so that it handles truncation and management of the conversation history","Switch the deployment type to Global Batch so that long conversations are given a separate token quota","Increase top_p so that the model considers more candidate tokens and fits more history into each request"],a:[0,2],
 ex:`The combined token count of the messages plus the requested output must stay within the model's limit, or the request fails. You can track tokens and drop the oldest non-system messages, or let the Responses API manage truncation of the history. Temperature and top_p control randomness, not context size, and Global Batch is for asynchronous jobs.`},

/* src: https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/prompt-engineering */
{s:0,d:1,t:"single",ref:"temperature top_p alter one not both randomness",
 stem:`A developer has already raised the temperature of a marketing-copy app to get more varied wording. They now plan to lower top_p in the same request as well. What does Microsoft recommend?`,
 opts:["Change both together, because top_p only works when temperature is also above its default","Set top_p to 0, because top_p only controls length and has no effect on output randomness","Replace temperature with max output tokens, which is the parameter that sets output variety","Adjust only one of them at a time, since both control randomness but in different ways"],a:3,
 ex:`Top_p (top probability) is similar to temperature in that it controls the randomness of the response, but it does so in a different way. The general recommendation is to alter one of these two parameters at a time, not both. Max output tokens caps response length rather than variety.`},

/* src: https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/deployment-types */
{s:0,d:1,t:"single",ref:"Global Batch deployment large asynchronous jobs lower cost 24 hour",
 stem:`A retailer needs to generate descriptions for 200,000 products. The work isn't time-sensitive, and it must not disrupt the quota of the retailer's live chat deployment. Which deployment type should you use?`,
 opts:["Global Batch, which processes large asynchronous jobs with a separate quota at lower cost","Global Provisioned, which reserves throughput units so that the job completes in real time","Developer, which runs inference globally and is designed for high-volume production work","Standard, which keeps all processing inside one Azure geography for maximum throughput"],a:0,
 ex:`Global Batch handles large asynchronous groups of requests with a 24-hour target turnaround and lower cost than Global Standard. Its separate enqueued token quota avoids disrupting online workloads. Provisioned types reserve capacity for predictable real-time throughput, and Developer is only for evaluating fine-tuned models.`},

/* src: https://learn.microsoft.com/en-us/training/modules/fundamentals-generative-ai/3-language-models */
{s:0,d:1,t:"single",ref:"transformer decoder predict next token masked attention preceding tokens",
 stem:`Given the prompt "When my dog was a ...", how does the decoder block of a transformer produce a completion?`,
 opts:["It looks up the full sentence in its training data and returns the most frequent ending","It runs the encoder again on each token and outputs the token with the largest vector","It uses attention over the preceding tokens to predict the next one, adds it, and repeats","It returns all candidate tokens at once and lets the application pick the best next word"],a:2,
 ex:`The decoder uses attention over the tokens that precede the one being predicted (masked attention during training), and a feed-forward network picks the most probable next token. That token is added to the sequence and the process repeats until the decoder predicts the sequence has ended, for example predicting "puppy".`},
];
