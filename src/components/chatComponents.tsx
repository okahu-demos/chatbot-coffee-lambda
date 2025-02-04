import React, { useState, forwardRef } from 'react';
import Image from 'next/image';

export function ChatBubble({ role, content, isLoading }: { role: string, content: string, isLoading?: boolean }) {
    return (
        <div className={`${role === 'user' ? 'col-start-1 col-end-9' : 'col-start-5 col-end-13'} p-3 rounded-lg`}>
            <div className={`flex ${role === 'user' ? 'flex-row' : 'flex-row-reverse'} items-start`}>
                <div className={`flex items-center justify-center h-10 w-10 rounded-full ${role === 'user' ? 'bg-blue-100' : 'bg-blue-500'} flex-shrink-0`}>
                    {role === 'user' ? (
                        role.charAt(0).toUpperCase()
                    ) : (
                        <Image
                            src="/openai-logomark.svg"
                            alt="OpenAI Logo"
                            width={20}
                            height={20}
                            className="invert"
                        />
                    )}
                </div>
                <div className={`relative mx-3 text-sm ${role === 'user' ? 'bg-gray-100' : 'bg-blue-500'} py-3 px-4 shadow rounded-xl max-w-[80%]`}>
                    <span className={`whitespace-pre-wrap ${role === 'user' ? 'text-gray-800' : 'text-white'}`}>
                        {isLoading ? (
                            <div className="loading-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        ) : content}
                    </span>
                </div>
            </div>
        </div>
    );
}

export function ChatMessages({ messages, isLoading }: { messages: any[], isLoading: boolean }) {
    return (
        <div className="grid grid-cols-12 gap-y-2 px-2">
            {messages.map((message, index) =>
                <ChatBubble key={index} role={message.role} content={message.content.map((block: any) => block.text).join('\n')} />
            )}
            {isLoading && <ChatBubble role="bot" content="" isLoading={true} />}
        </div>
    );
}

interface ChatInputProps {
    onSendMessage: (message: string) => void;
}

export const ChatInput = forwardRef<HTMLInputElement, ChatInputProps>(({ onSendMessage }, ref) => {
    const [input, setInput] = useState('');

    const handleSendMessage = () => {
        if (input.trim() === '') {
            return;
        }
        onSendMessage(input);
        setInput('');
    }

    return (
        <div className="flex items-center gap-3 p-4 border-t border-gray-200 bg-white rounded-b-lg">
            <input
                ref={ref}
                type="text"
                value={input}
                onKeyUp={(e) => {
                    if (e.key === 'Enter') {
                        handleSendMessage();
                    }
                }}
                onChange={(e) => {
                    setInput(e.target.value)
                }}
                className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                placeholder="Type a message..."
            />
            <button
                onClick={handleSendMessage}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
                Send
            </button>
        </div>
    );
});

ChatInput.displayName = 'ChatInput';
