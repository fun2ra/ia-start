"use client";

import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

export default function ChatbotDemo() {
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hi there! How can I help you today?' },
    ]);
    const [input, setInput] = useState('');
    const chatEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { sender: 'user', text: input }];
        setMessages(newMessages);
        setInput('');

        // Simulate bot response (replace this with real API call)
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                { sender: 'bot', text: "I'm just a demo bot 😄" },
            ]);
        }, 600);
    };


    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') sendMessage();
    };

    return (
        <div className="max-w-md mx-auto mt-10 border rounded-2xl shadow-lg h-[600px] flex flex-col">
            <div className="p-4 border-b text-xl font-semibold">Insurance Chatbot Demo</div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow
              ${msg.sender === 'user' ? 'ml-auto bg-blue-500 text-white' : 'bg-white text-gray-800'}`}
                    >
                        {msg.text}
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>
            <div className="flex items-center p-3 border-t gap-2">
                <input
                    type="text"
                    className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none"
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button
                    className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                    onClick={sendMessage}
                >
                    <Send size={16} />
                </button>
            </div>
        </div>
    );
}
