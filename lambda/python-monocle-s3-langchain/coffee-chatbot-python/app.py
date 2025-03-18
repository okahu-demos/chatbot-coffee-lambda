import time
from monocle_apptrace.instrumentation.common.instrumentor import setup_monocle_telemetry
from chatbot_lib.utils import extract_message
from chatbot_lib.langchain import langchain_invoke
import json

setup_monocle_telemetry(workflow_name="openai.app")


def lambda_handler(event, context):
    request_message = extract_message(event, context)
    llm_rag_response = langchain_invoke(request_message)
    print("llm_rag_response: ", llm_rag_response)
    return {
        "statusCode": 200,
        "body": json.dumps(
            {"message": {"role": "assistant", "content": [{"text": llm_rag_response}]}}
        ),
    }
