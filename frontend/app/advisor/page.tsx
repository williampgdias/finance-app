/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Sparkles, Send, Loader2, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

/**
 * Interface representing a single chat message entity.
 * Mirrors the structure required by the LLM context window.
 */
interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

/**
 * Financial Advisor Page Component.
 * * Implements a persistent chat interface where the user can interact
 * with the AI Financial Mentor. The component manages the chat history state
 * and handles the API communication with context injection.
 */
export default function AdvisorPage() {
    // ============================================================================
    // State Management
    // ============================================================================

    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(false);

    // Reference to the end of the chat list for auto-scrolling
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // ============================================================================
    // Effects & Helpers
    // ============================================================================

    /**
     * Automatically scrolls the chat container to the most recent message.
     * Triggered whenever the 'messages' array updates or loading state changes.
     */
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    // ============================================================================
    // Event Handlers
    // ============================================================================

    /**
     * Handles the submission of a new message.
     * * 1. Updates UI optimistically with the user's message.
     * 2. Sends the message payload + conversation history to the backend.
     * 3. Appends the AI response to the local state.
     */
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        // Prevent submission of empty strings
        if (!input.trim()) return;

        const userMessageContent = input;

        // Clear input immediately for better UX
        setInput('');

        // Optimistic Update: Append user message to UI before API response
        const newHistory: ChatMessage[] = [
            ...messages,
            { role: 'user', content: userMessageContent },
        ];

        setMessages(newHistory);
        setLoading(true);

        try {
            // API Call: Send current prompt AND history for context awareness
            const response = await axios.post('http://localhost/api/ai/ask', {
                question: userMessageContent,
                history: newHistory, // Passing full context to the backend
            });

            // Append the AI's response to the conversation
            setMessages((prevMessages) => [
                ...prevMessages,
                { role: 'assistant', content: response.data.message },
            ]);
        } catch (error) {
            console.error('AI Service Error:', error);

            // Graceful error handling in the UI
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    role: 'assistant',
                    content:
                        "**System Notice:** I'm currently unable to access the financial data server. Please try again in a moment.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    // ============================================================================
    // Render
    // ============================================================================

    return (
        <main className="h-screen bg-gray-50 flex flex-col items-center pt-8 pb-4 px-4">
            {/* Page Header */}
            <div className="text-center mb-6 max-w-2xl flex-shrink-0">
                <div className="inline-flex items-center justify-center p-3 bg-gray-900 rounded-full mb-3 shadow-lg">
                    <Sparkles className="text-yellow-400" size={24} />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">
                    Financial Mentor
                </h1>
                <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">
                    AI-Powered Wealth Strategy & Analysis
                </p>
            </div>

            {/* Main Chat Container */}
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col flex-1 min-h-0 border border-gray-200">
                {/* Message List Area (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
                    {/* Empty State / Welcome Message */}
                    {messages.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
                            <Bot size={48} className="mb-4" />
                            <p className="text-sm font-medium">
                                Ready to analyze your finances.
                            </p>
                            <p className="text-xs mt-1">
                                Ask about your budget, savings goals, or
                                spending habits.
                            </p>
                        </div>
                    )}

                    {/* Message Bubbles */}
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex gap-4 ${
                                msg.role === 'user'
                                    ? 'flex-row-reverse'
                                    : 'flex-row'
                            }`}
                        >
                            {/* Avatar Icon */}
                            <div
                                className={`
                                w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm
                                ${
                                    msg.role === 'user'
                                        ? 'bg-gray-200 text-gray-600'
                                        : 'bg-gray-900 text-yellow-400'
                                }
                            `}
                            >
                                {msg.role === 'user' ? (
                                    <User size={16} />
                                ) : (
                                    <Sparkles size={16} />
                                )}
                            </div>

                            {/* Message Content */}
                            <div
                                className={`
                                max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm
                                ${
                                    msg.role === 'user'
                                        ? 'bg-gray-900 text-white rounded-tr-none'
                                        : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
                                }
                            `}
                            >
                                <ReactMarkdown
                                    components={{
                                        strong: ({ node, ...props }) => (
                                            <span
                                                className={`font-bold ${
                                                    msg.role === 'user'
                                                        ? 'text-white'
                                                        : 'text-gray-900'
                                                }`}
                                                {...props}
                                            />
                                        ),
                                        ul: ({ node, ...props }) => (
                                            <ul
                                                className="list-disc ml-4 space-y-1 my-2"
                                                {...props}
                                            />
                                        ),
                                        ol: ({ node, ...props }) => (
                                            <ol
                                                className="list-decimal ml-4 space-y-1 my-2"
                                                {...props}
                                            />
                                        ),
                                        p: ({ node, ...props }) => (
                                            <p
                                                className="mb-2 last:mb-0"
                                                {...props}
                                            />
                                        ),
                                    }}
                                >
                                    {msg.content}
                                </ReactMarkdown>
                            </div>
                        </div>
                    ))}

                    {/* Loading Indicator (Ghost Bubble) */}
                    {loading && (
                        <div className="flex gap-4 animate-pulse">
                            <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center mt-1 opacity-50">
                                <Sparkles
                                    className="text-yellow-400"
                                    size={16}
                                />
                            </div>
                            <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex items-center gap-2">
                                <Loader2
                                    className="animate-spin text-gray-400"
                                    size={16}
                                />
                                <span className="text-xs text-gray-400 font-medium">
                                    Analyzing financial data...
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Invisible element for auto-scroll anchoring */}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-100">
                    <form
                        onSubmit={handleSendMessage}
                        className="relative flex items-center gap-2"
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your financial question here..."
                            className="w-full bg-gray-50 text-gray-900 rounded-xl py-3 pl-4 pr-12 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all placeholder-gray-400"
                            disabled={loading}
                            aria-label="Message input"
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="absolute right-2 p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
                            aria-label="Send message"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
