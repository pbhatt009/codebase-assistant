import React, { useState, useRef, useEffect } from 'react';
import { SendHorizontal, Paperclip, Mic } from 'lucide-react';
import { cn } from '../../lib/utils';

export function ChatInput({ onSend }) {
    const [input, setInput] = useState('');
    const [scope, setScope] = useState('codebase'); // 'codebase' or 'file'
    const textareaRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        onSend(input, scope);
        setInput('');

        // Don't reset scope - user might want to keep chatting in same context
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleChange = (e) => {
        setInput(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
    };

    return (
        <div className="px-4 pb-4 pt-2 bg-gradient-to-t from-background via-background to-transparent">
            <div className="flex items-center gap-2 mb-2 px-1">
                <button
                    onClick={() => setScope('codebase')}
                    className={cn(
                        "text-xs px-2 py-1 rounded-full border transition-colors",
                        scope === 'codebase'
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background text-muted-foreground border-border hover:bg-secondary"
                    )}
                >
                    Entire Codebase
                </button>
                <button
                    onClick={() => setScope('file')}
                    className={cn(
                        "text-xs px-2 py-1 rounded-full border transition-colors",
                        scope === 'file'
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background text-muted-foreground border-border hover:bg-secondary"
                    )}
                >
                    Selected File
                </button>
            </div>
            <div className="relative flex items-end gap-2 p-2 rounded-xl border bg-background shadow-sm focus-within:ring-1 focus-within:ring-ring">
                <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                    <Paperclip className="h-5 w-5" />
                </button>

                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything about your codebase..."
                    className="flex-1 max-h-48 min-h-[44px] w-full resize-none border-0 bg-transparent py-3 px-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    rows={1}
                />

                <button
                    onClick={handleSubmit}
                    disabled={!input.trim()}
                    className={cn(
                        "p-2 rounded-lg transition-all duration-200 mb-0.5",
                        input.trim()
                            ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                            : "bg-muted text-muted-foreground cursor-not-allowed"
                    )}
                >
                    <SendHorizontal className="h-5 w-5" />
                </button>
            </div>
            <p className="text-[10px] text-center text-muted-foreground mt-2">
                AI can make mistakes. Please verify important information.
            </p>
        </div>
    );
}
