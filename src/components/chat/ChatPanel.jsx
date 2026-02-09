import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { Plus, MessageSquare, History } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useSelector } from 'react-redux';


export default function ChatPanel({ repoName }) {
    const [messages, setMessages] = useState([
        { id: 1, role: 'system', content: `Hello! I'm your AI assistant for ${repoName}. Ask me anything about the code structure, functions, or logic.`, timestamp: 'Just now' }
    ]);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigate = useNavigate();

    const handleNewChat = () => {
        setMessages([
            { id: Date.now(), role: 'system', content: `Hello! I'm your AI assistant for ${repoName}. Ask me anything about the code structure, functions, or logic.`, timestamp: 'Just now' }
        ]);
    };

    const handleCheckScore = () => {
        navigate('score');
    };

    const handleSend = (text, scope) => {
        const newMsg = { id: Date.now(), role: 'user', content: text, scope: scope, timestamp: 'Just now' };
        setMessages(prev => [...prev, newMsg]);

        // Mock response
        setTimeout(() => {
            const contextMsg = scope === 'file' ? "the selected file" : "the entire codebase";
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'assistant',
                content: `I'm analyzing ${contextMsg} for you... This is a mock response demonstrating the chat UI with scope: ${scope}.`,
                timestamp: 'Just now'
            }]);
        }, 1000);
    };

    return (
        <div className="flex h-full relative bg-background">
            {/* History Sidebar Overlay (Mobile style or toggleable) */}
            <div className={cn(
                "absolute inset-y-0 left-0 z-20 w-64 transform bg-gray-50 dark:bg-zinc-900 border-r transition-transform duration-200 ease-in-out",
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-4 flex items-center justify-between border-b">
                    <span className="font-semibold text-sm">History</span>
                    <button onClick={() => setSidebarOpen(false)} className="text-muted-foreground hover:text-foreground">
                        <History className="h-4 w-4" />
                    </button>
                </div>
                <div className="p-2 space-y-1">
                    <button className="w-full text-left px-3 py-2 text-sm rounded-md bg-white dark:bg-black shadow-sm border border-border">
                        Explain Authentication
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm rounded-md text-muted-foreground hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
                        Refactoring API
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <div className="h-14 border-b flex items-center justify-between px-4 bg-background/95 backdrop-blur z-10">
                    <div className="flex items-center gap-2">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-secondary rounded-md" title="Conversations">
                            <History className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <div className="font-medium text-sm">
                            {repoName}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleCheckScore}
                            className="text-xs font-medium px-3 py-1.5 rounded-md bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors"
                        >
                            Check Score
                        </button>
                        <button
                            onClick={handleNewChat}
                            className="p-2 hover:bg-secondary rounded-md text-primary"
                            title="New Chat"
                        >
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto scroll-smooth">
                    <div className="flex flex-col min-h-full">
                        {messages.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
                                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                    <MessageSquare className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="font-semibold text-foreground mb-1">Start a conversation</h3>
                                <p className="max-w-xs text-sm">Ask questions about files, definitions, or architectural patterns.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col py-4">
                                {messages.map((msg) => (
                                    <MessageBubble key={msg.id} {...msg} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Input */}
                <ChatInput onSend={handleSend} />
            </div>
        </div>
    );
}
