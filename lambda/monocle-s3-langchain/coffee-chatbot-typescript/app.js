
// Monocle instrumentation
const { setupMonocle, setScopes } = require("monocle2ai")
setupMonocle(
  "chatbot-coffee-lambda-ts-langchain"
)

const { extractMessage, waitFor } = require("./utils.js") 
const { langchainInvoke } = require("./langchain.js")

exports.lambdaHandler = async (event, context) => {
  var { requestMessage, sessionId } = extractMessage(event, context)

  const llmRagResponse = await setScopes(
    {
      "sessionId": sessionId
    },
    () => {
      return langchainInvoke(requestMessage)
    })

  // await waitForResponse();
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: {
        role: "assistant",
        content: [
          {
            text: llmRagResponse
          }
        ]
      }
    })
  };
  return response;
};

async function waitForResponse() {
  await waitFor(3000);
}

