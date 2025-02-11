import threading
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_core.embeddings import Embeddings
from langchain_core.prompts import PromptTemplate
from langchain_core.vectorstores import InMemoryVectorStore
import os
from data.coffee_text import coffee_text
from data.coffee_embedding import embedding_json

embeddings = OpenAIEmbeddings()

def extract_message(event, context):
    import json

    print("event", event)
    print("context", context)
    request_message = ""
    session_id = ""

    if isinstance(event.get('body'), str):
        body_data = json.loads(event['body'])
        request_message = body_data['message']
        session_id = body_data['sessionId']

    if isinstance(event.get('message'), dict):
        request_message = event['message']['message']
        session_id = event['message']['sessionId']

    if isinstance(event.get('message'), str):
        request_message = event['message']
        session_id = event['sessionId']
    

    # request_message = event['message']['message']
    # session_id = event['message']['sessionId']

    os.environ["sessionId"] = session_id
    os.environ["MONOCLE_S3_KEY_PREFIX_CURRENT"] = f"{session_id}__" if session_id else ""

    return request_message

def create_chatbot_components():
    class CoffeeEmbeddings(Embeddings):
        model = "OpenAIEmbeddings"
        
        def embed_documents(self, documents):
            return embedding_json
            
        def embed_query(self, document):
            return embedding_json[0]

    model = ChatOpenAI()
    text = coffee_text
    vector_store = InMemoryVectorStore.from_texts(
        texts= [text],
        embedding= CoffeeEmbeddings(),
        kwargs=None,
        metadatas=None
    )
    retriever = vector_store.as_retriever()

    prompt = PromptTemplate.from_template(
        """Answer the question based only on the following context:
{context}
If you don't know the answer, you can say "I don't know".

Question: {question}"""
    )
    
    return retriever, prompt, model

def format_docs(docs):
        return "\n\n".join(doc.page_content for doc in docs)
