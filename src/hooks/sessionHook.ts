import { useState, useEffect } from 'react';

const STORAGE_KEYS = {
    SESSION_ID: 'sessionId',
    CHAT_MESSAGES: 'chatMessages'
} as const;

const SESSION_PREFIX = 'session_';

interface UseSessionResult {
    sessionId: string;
    messages: any[];
    setMessages: (messages: any[]) => void;
    resetSession: () => void;
}

export function useSession(): UseSessionResult {
    const [messages, setMessages] = useState<any[]>([]);
    let initialSessionId = '';
    if(typeof sessionStorage == 'object') {
        initialSessionId = sessionStorage.getItem(STORAGE_KEYS.SESSION_ID) || ''
    }
    const [sessionId, setSessionId] = useState<string>(initialSessionId || '');

    useEffect(() => {
        // Initialize session
        let sid = sessionStorage.getItem(STORAGE_KEYS.SESSION_ID);
        if (!sid) {
            sid = `${SESSION_PREFIX}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            sessionStorage.setItem(STORAGE_KEYS.SESSION_ID, sid);
        }
        setSessionId(sid);

        // Load saved messages
        const savedMessages = sessionStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
        if (savedMessages) {
            setMessages(JSON.parse(savedMessages));
        }
    }, []);

    // Save messages to session storage when they change
    useEffect(() => {
        if (messages.length > 0) {
            sessionStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(messages));
        }
    }, [messages]);

    const resetSession = () => {
        const newSessionId = `${SESSION_PREFIX}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem(STORAGE_KEYS.SESSION_ID, newSessionId);
        sessionStorage.removeItem(STORAGE_KEYS.CHAT_MESSAGES);
        setSessionId(newSessionId);
        setMessages([]);
    };

    return { sessionId, messages, setMessages, resetSession };
}
