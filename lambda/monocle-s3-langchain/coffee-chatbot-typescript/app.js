
// Monocle instrumentation
const { setupMonocle } = require("monocle2ai")
setupMonocle(
  "openai.app"
)

const { extractMessage, waitFor } = require("./utils.js") 
const { langchainInvoke } = require("./langchain.js")

exports.lambdaHandler = async (event, context) => {
  var { requestMessage } = extractMessage(event, context)

  const llmRagResponse = await langchainInvoke(requestMessage)

  await waitForResponse();
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

