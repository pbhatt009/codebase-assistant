import React from 'react';
import { cn } from '../../lib/utils';
import { User, Sparkles, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';

export function MessageBubble({ role, content, timestamp }) {
    const isUser = role === 'user';

    return (
        <div className={cn(
            "flex w-full gap-4 p-6 hover:bg-black/5 dark:hover:bg-white/5 transition-colors group",
            isUser ? "" : "bg-muted/30"
        )}>
            <div className={cn(
                "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-sm border shadow-sm",
                isUser ? "bg-background" : "bg-primary text-primary-foreground"
            )}>
                {isUser ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
            </div>

            <div className="flex-1 space-y-2 overflow-hidden">
                <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">{isUser ? "You" : "Assistant"}</span>
                    <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">{timestamp}</span>
                </div>
                <div className="prose prose-stone dark:prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap">
                    {content}
                </div>

                {!isUser && (
                    <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"><Copy className="h-3.5 w-3.5" /></button>
                        <button className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"><ThumbsUp className="h-3.5 w-3.5" /></button>
                        <button className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"><ThumbsDown className="h-3.5 w-3.5" /></button>
                    </div>
                )}
            </div>
        </div>
    );
}
