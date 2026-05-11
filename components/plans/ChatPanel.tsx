'use client';

import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import type { ChatMessage } from '@/types';
import type { ApiSuccess } from '@/types/api';

interface ChatPanelProps {
    planId: string;
}

export function ChatPanel({ planId }: ChatPanelProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        api.get<ApiSuccess<ChatMessage[]>>(`/plans/${planId}/chat`)
            .then((res) => setMessages(res.data.data))
            .catch(() => setError('Failed to load chat history'))
            .finally(() => setLoading(false));
    }, [planId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, sending]);

    const handleSend = async () => {
        const trimmed = input.trim();
        if (!trimmed || sending) return;

        const optimisticUserMsg: ChatMessage = {
            id: crypto.randomUUID(),
            plan_id: planId,
            role: 'user',
            content: trimmed,
            created_at: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, optimisticUserMsg]);
        setInput('');
        setSending(true);
        setError(null);

        try {
            const res = await api.post<ApiSuccess<ChatMessage>>(`/plans/${planId}/chat`, {
                message: trimmed,
            });
            setMessages((prev) => [...prev, res.data.data]);
        } catch (err) {
            setError(getErrorMessage(err));
            setMessages((prev) => prev.filter((m) => m.id !== optimisticUserMsg.id));
        } finally {
            setSending(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col bg-surface rounded-lg border overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b">
                <h2 className="font-mono text-sm font-semibold text-text-secondary">
                    Ask about your plan
                </h2>
            </div>

            {/* Messages */}
            <div className="flex flex-col gap-3 p-4 h-[400px] overflow-y-auto">
                {loading && (
                    <p className="text-xs text-text-muted text-center">Loading chat history...</p>
                )}

                {!loading && messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
                        <p className="text-sm text-text-secondary">
                            Ask me anything about your retirement plan.
                        </p>
                        <p className="text-xs text-text-muted">
                            Try: &quot;Am I on track?&quot; or &quot;What if I increase my
                            contributions?&quot;
                        </p>
                    </div>
                )}

                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] px-4 py-2.5 rounded-lg text-sm leading-relaxed ${
                                message.role === 'user'
                                    ? 'bg-accent text-white'
                                    : 'bg-background text-text-primary border border-border'
                            }`}
                        >
                            {message.role === 'user' ? (
                                message.content
                            ) : (
                                <div className="prose prose-sm max-w-none">
                                    <ReactMarkdown>{message.content}</ReactMarkdown>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {/* Typing indicator */}
                {sending && (
                    <div className="flex justify-start">
                        <div className="px-4 py-2.5 rounded-lg bg-background border border-border">
                            <span className="text-xs text-text-muted">Thinking...</span>
                        </div>
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            {/* Error */}
            {error && <p className="px-4 py-2 text-xs text-error border-t">{error}</p>}

            {/* Input */}
            <div className="flex gap-2 p-3 border-t">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={sending || loading}
                    placeholder="Ask about your retirement plan..."
                    className="flex-1 px-3 py-2 rounded-md border border-border bg-background text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
                />
                <button
                    onClick={handleSend}
                    disabled={sending || loading || !input.trim()}
                    className="cursor-pointer px-4 py-2 rounded-md bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {sending ? '...' : 'Send'}
                </button>
            </div>
        </div>
    );
}
