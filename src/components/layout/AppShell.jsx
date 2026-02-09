import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, MessageSquare, LogOut, Settings } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function AppShell() {
    const location = useLocation();
    

    return (
        <div className="flex h-screen w-full flex-col bg-background text-foreground">
            {/* Top Navigation */}
            <header className="flex h-14 items-center justify-between border-b px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex items-center gap-4">
                    <Link to="/" className="flex items-center gap-2 font-semibold">
                        <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                            <MessageSquare className="h-5 w-5" />
                        </div>
                        <span className="text-lg tracking-tight">CodeAssistant</span>
                    </Link>
                </div>

                <nav className="flex items-center gap-4">
                    <Link to="/">
                        <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium hover:bg-secondary rounded-md transition-colors">
                            <Home className="h-4 w-4" />
                            Home
                        </button>
                    </Link>
                    <div className="h-4 w-[1px] bg-border mx-2" />
                    <button className="p-2 hover:bg-secondary rounded-md transition-colors">
                        <Settings className="h-4 w-4" />
                    </button>
                    <button className="p-2 hover:bg-secondary rounded-md transition-colors">
                        <LogOut className="h-4 w-4" />
                    </button>
                </nav>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto relative">
                <Outlet />
            </main>
        </div>
    );
}
