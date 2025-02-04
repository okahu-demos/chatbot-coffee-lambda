const { formatDocumentsAsString } = require("langchain/util/document");
const { createChatbotComponents } = require("./utils");
const { RunnableSequence, RunnablePassthrough } = require("@langchain/core/runnables");
const { StringOutputParser } = require("@langchain/core/output_parsers");

const langchainInvoke = async (msg) => {
    const { retriever, prompt, model } = await createChatbotComponents();

    const chain = RunnableSequence.from([
        {
            context: retriever.pipe(formatDocumentsAsString),
            question: new RunnablePassthrough(),
        },
        prompt,
        model,
        new StringOutputParser(),
    ]);

    const res = await chain.invoke(msg)
    return res;
}

exports.langchainInvoke = langchainInvoke


