import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { PanelLeft, PanelRight, GripVertical } from 'lucide-react';

export default function SplitView({
    left: LeftComponent,
    right: RightComponent,
    initialLeftWidth = 33, // percentage
    minLeftWidth = 20,
    maxLeftWidth = 80
}) {
    const [leftWidth, setLeftWidth] = useState(initialLeftWidth);
    const [isDragging, setIsDragging] = useState(false);
    const [layout, setLayout] = useState('split'); // 'split' | 'left-only' | 'right-only'

    const startResize = (e) => {
        setIsDragging(true);
        e.preventDefault();
    };

    const stopResize = () => {
        setIsDragging(false);
    };

    const resize = (e) => {
        if (isDragging) {
            const newWidth = (e.clientX / window.innerWidth) * 100;
            if (newWidth >= minLeftWidth && newWidth <= maxLeftWidth) {
                setLeftWidth(newWidth);
            }
        }
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', resize);
            window.addEventListener('mouseup', stopResize);
        } else {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResize);
        }
        return () => {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResize);
        };
    }, [isDragging]);

    return (
        <div className="flex h-full w-full relative overflow-hidden">
            {/* Left Panel */}
            <div
                className={cn(
                    "h-full overflow-hidden transition-[width] duration-0",
                    layout === 'right-only' ? 'w-0 border-none' : ''
                )}
                style={{ width: layout === 'split' ? `${leftWidth}%` : layout === 'left-only' ? '100%' : '0%' }}
            >
                {LeftComponent}
            </div>

            {/* Resizer Handle */}
            {layout === 'split' && (
                <div
                    className="w-1 hover:w-1.5 h-full bg-border hover:bg-primary cursor-col-resize z-10 flex flex-col justify-center items-center transition-all group"
                    onMouseDown={startResize}
                >
                    <div className="h-8 w-1 bg-gray-300 group-hover:bg-primary-foreground/50 rounded-full" />
                </div>
            )}

            {/* Right Panel */}
            <div
                className={cn(
                    "h-full overflow-hidden flex-1",
                    layout === 'left-only' ? 'w-0 border-none hidden' : ''
                )}
            >
                {RightComponent}
            </div>

            {/* View Toggles (Floating/Absolute) */}
            <div className="absolute inset-x-0 bottom-6 flex justify-center pointer-events-none">
                <div className="bg-black/80 backdrop-blur text-white p-1 rounded-full shadow-lg pointer-events-auto flex items-center gap-1 border border-white/10">
                    <button
                        onClick={() => setLayout('left-only')}
                        className={cn("p-2 rounded-full hover:bg-white/20 transition-all", layout === 'left-only' && "bg-white/20 text-white")}
                        title="Chat Focus"
                    >
                        <PanelLeft className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => setLayout('split')}
                        className={cn("p-2 rounded-full hover:bg-white/20 transition-all", layout === 'split' && "bg-white/20 text-white")}
                        title="Split View"
                    >
                        <div className="flex gap-0.5"><div className="w-3 h-3 bg-current rounded-sm opacity-60" /><div className="w-3 h-3 bg-current rounded-sm" /></div>
                    </button>
                    <button
                        onClick={() => setLayout('right-only')}
                        className={cn("p-2 rounded-full hover:bg-white/20 transition-all", layout === 'right-only' && "bg-white/20 text-white")}
                        title="Code Focus"
                    >
                        <PanelRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
