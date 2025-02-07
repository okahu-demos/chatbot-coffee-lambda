# from langchain.utils import format_documents_as_string
from langchain_core.runnables import RunnableSequence, RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from .utils import create_chatbot_components, format_docs

def langchain_invoke(msg):
    retriever, prompt, model = create_chatbot_components()
    rag_chain = (
        {"context": retriever | format_docs, "question": RunnablePassthrough()}
        | prompt
        | model
        | StrOutputParser()
    )
    val = rag_chain.invoke(msg)
    return val
