/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState } from 'react';
import axios from 'axios';
import { Sparkles, Send, Loader2, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function AdvisorPage() {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAskAi = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim()) return;

        setLoading(true);
        setError('');
        setAnswer('');

        try {
            const response = await axios.post('http://localhost/api/ai/ask', {
                question: question,
            });

            setAnswer(response.data.message);
        } catch (err) {
            console.error(err);
            // Error message in English
            setError('Sorry, my brain is a bit slow today. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 p-8 pb-20 flex flex-col items-center">
            {/* Header */}
            <div className="text-center mb-10 max-w-2xl">
                <div className="inline-flex items-center justify-center p-3 bg-gray-900 rounded-full mb-4 shadow-lg">
                    <Sparkles className="text-yellow-400" size={32} />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    Financial Advisor
                </h1>
                <p className="text-gray-500">
                    Ask anything about your finances. I'm sarcastic, but I give
                    good advice.
                </p>
            </div>

            {/* Chat Area */}
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm overflow-hidden min-h-100 flex flex-col">
                {/* Answer Display Area */}
                <div className="flex-1 p-8 bg-gray-50/50 overflow-y-auto">
                    {!answer && !loading && !error && (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
                            <Bot size={64} className="mb-4" />
                            <p>Waiting for your question...</p>
                        </div>
                    )}

                    {loading && (
                        <div className="flex items-center justify-center h-full gap-3 text-gray-500 animate-pulse">
                            <Loader2 className="animate-spin" />
                            <p>Consulting the financial stars...</p>
                        </div>
                    )}

                    {answer && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex gap-4">
                                <div className="min-w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center mt-1">
                                    <Sparkles
                                        className="text-yellow-400"
                                        size={20}
                                    />
                                </div>
                                <div className="bg-white p-6 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 text-gray-800 leading-relaxed">
                                    <ReactMarkdown
                                        components={{
                                            strong: ({ node, ...props }) => (
                                                <span
                                                    className="font-bold text-gray-900"
                                                    {...props}
                                                />
                                            ),

                                            ul: ({ node, ...props }) => (
                                                <ul
                                                    className="list-disc ml-4 space-y-1"
                                                    {...props}
                                                />
                                            ),
                                            ol: ({ node, ...props }) => (
                                                <ol
                                                    className="list-decimal ml-4 space-y-1"
                                                    {...props}
                                                />
                                            ),
                                        }}
                                    >
                                        {answer}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-center">
                            {error}
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-100">
                    <form onSubmit={handleAskAi} className="relative">
                        <input
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="e.g. Should I buy a new car or invest?"
                            className="w-full bg-gray-100 text-gray-900 rounded-xl py-4 pl-6 pr-16 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all shadow-inner"
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            disabled={loading || !question.trim()}
                            className="absolute right-2 top-2 p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <Send size={20} />
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
