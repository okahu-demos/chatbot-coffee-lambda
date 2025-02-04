const { ChatOpenAI, OpenAIEmbeddings } = require("@langchain/openai")
const { Embeddings } = require("@langchain/core/embeddings");

const { PromptTemplate } = require("@langchain/core/prompts");
const { MemoryVectorStore } = require("langchain/vectorstores/memory")

const { coffeeText } = require("./data/coffeeText");
const embeddingJson = require("./data/coffeeEmbedding.json");

const embeddings = new OpenAIEmbeddings()

exports.waitFor = async (ms) => {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

exports.extractMessageAndTrackSpans = function extractMessageAndTrackSpans(event, context) {
    console.log("event", event)
    console.log("context", context)
    let requestMessage = ""
    if (typeof event.body === 'string') {
      requestMessage = JSON.parse(event.body).message
    }
    if (typeof event.message === 'object') {
      requestMessage = event.message.message
    }
    if (typeof event.message === 'string') {
      requestMessage = event.message
    }
    const spans = []
    const cachedFoo = console.dir
    console.dir = function (...args) {
      if (typeof args[0] === 'object' && typeof args[0].traceId == "string") {
        spans.push(args[0])
      }
  
      cachedFoo(...args)
    }
    return { requestMessage, cachedFoo, spans }
  }

  

exports.createChatbotComponents = async function createChatbotComponents() {
    class CoffeeEmbeddings extends Embeddings {
        model = "OpenAIEmbeddings";
        embedDocuments(documents) {
            return new Promise((resolve, reject) => {
                // console.log("embedDocuments", documents)
                resolve(embeddingJson);
            });
        }
        async embedQuery(document) {
            const res = await embeddings.embedQuery(document);
            return res;
        }
    }


    const model = new ChatOpenAI({});
    const text = coffeeText;
    const vectorStore = await MemoryVectorStore.fromTexts(
        [text],
        {},
        new CoffeeEmbeddings(),
        {}
    );
    const retriever = vectorStore.asRetriever();

    const prompt = PromptTemplate.fromTemplate(`Answer the question based only on the following context:
{context} .
If you don't know the answer, you can say "I don't know".

Question: {question}`);
    return { retriever, prompt, model };
}