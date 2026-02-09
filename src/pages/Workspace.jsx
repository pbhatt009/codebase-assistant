import React from 'react';
import { useParams } from 'react-router-dom';
import SplitView from '../components/layout/SplitView';
import ChatPanel from '../components/chat/ChatPanel';
import CodePanel from '../components/code/CodePanel';

export default function Workspace() {
    const { repoId } = useParams();

    // In a real app, we'd fetch repo data here.
    const repoName = repoId === '1' ? 'facebook/react' : repoId === '2' ? 'vercel/next.js' : 'Repo';

    return (
        <div className="h-full w-full bg-background overflow-hidden">
            <SplitView
                left={<ChatPanel repoName={repoName} />}
                right={<CodePanel />}
                initialLeftWidth={35}
            />
        </div>
    );
}
