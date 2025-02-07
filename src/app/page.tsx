'use client'
import React, { useRef, useEffect, useState } from 'react';
import '@/styles/global.css';
import CommonLayout from './commonLayout';
import { ChatMessages, ChatInput } from '@/components/chatComponents';
import { useSession } from '@/hooks/sessionHook';

interface ChatResponse {
  message: any;
}

function App() {
  const { sessionId, messages, setMessages, resetSession } = useSession();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputFieldRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (inputFieldRef.current) {
      inputFieldRef.current.focus();
    }
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }, 100);
  };

  const sendMessage = async (message: string) => {
    try {
      console.log('Sending message:', process.env.REACT_APP_RESTAPI_ENDPOINT);
      const response = await fetch(`/api/coffeechat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Id': sessionId
        },
        body: JSON.stringify({message})
      });
      const data = await response.json();
      console.log('Response:', data);
      return data;
    } catch (error) {
      console.error('Error', error);
    }
  };

  const handleSendMessage = (input: string) => {
    const newMessage = {
      role: "user",
      content: [
        {
          text: input
        }
      ]
    };
    setMessages([...messages, newMessage]);
    scrollToBottom();
    setIsLoading(true);

    sendMessage(input).then((response:ChatResponse ) => {
      setMessages([...messages, newMessage, response.message]);
      setIsLoading(false);
      scrollToBottom();
    });
  };

  return (
    <CommonLayout 
      title="Coffee Chatbot"
      navLink={{ text: "View Telemetry", href: "/s3" }}
      mainClassName="h-screen overflow-hidden"
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-end mb-4">
          <button
            onClick={resetSession}
            title="Clear chat history"
            className="inline-flex items-center px-3 py-1 text-sm text-gray-600 hover:text-red-600 
              border border-gray-300 hover:border-red-300 rounded-md transition-colors
              bg-white"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            Clear Chat
          </button>
        </div>
        <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <ChatMessages messages={messages} isLoading={isLoading} />
            <div ref={messagesEndRef} />
          </div>
          <ChatInput 
            onSendMessage={handleSendMessage} 
            ref={inputFieldRef}
            autoFocus={true}
            className="focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent"
          />
        </div>
      </div>
    </CommonLayout>
  );
}

export default App;