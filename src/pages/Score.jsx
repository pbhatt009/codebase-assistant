import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { getscore } from '../utils/api';
import { cn } from '../lib/utils';

export default function Score() {
    const { repoId } = useParams();
    const navigate = useNavigate();
    const [repoScore, setRepoScore] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchScore() {
            setLoading(true);
            const scoreData = await getscore(repoId);
            setRepoScore(scoreData);
            setLoading(false);
        }
        fetchScore();
    }, [repoId]);

    if (loading || !repoScore) {
        return (
            <div className="container mx-auto max-w-4xl py-8 px-6 flex justify-center items-center h-screen">
                <span className="text-lg text-muted-foreground">Loading repository score...</span>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-4xl py-8 px-6">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Workspace
            </button>

            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Repository Score</h1>
                <p className="text-muted-foreground">Automated analysis of repository quality and structure.</p>
            </div>

            {/* Overall Score Card */}
            <div className="bg-card border rounded-xl p-8 mb-8 flex items-center justify-between shadow-sm">
                <div>
                    <h2 className="text-xl font-semibold mb-2">Overall Score</h2>
                    <p className="text-sm text-muted-foreground max-w-md">
                        Score based on README, code complexity, comments, and structure.
                    </p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="relative flex items-center justify-center">
                        <svg className="h-32 w-32 transform -rotate-90">
                            <circle
                                className="text-muted/20"
                                strokeWidth="8"
                                stroke="currentColor"
                                fill="transparent"
                                r="56"
                                cx="64"
                                cy="64"
                            />
                            <circle
                                className="text-primary transition-all duration-1000 ease-out"
                                strokeWidth="8"
                                strokeDasharray={351.86}
                                strokeDashoffset={repoScore?.score ? (351.86 - (351.86 * repoScore.score) / 100) : 351.86}
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="transparent"
                                r="56"
                                cx="64"
                                cy="64"
                            />
                        </svg>
                        <span className="absolute text-4xl font-bold">{repoScore?.score ?? '--'}</span>
                    </div>
                    <span className="text-sm font-medium mt-2 text-muted-foreground">
                        {typeof repoScore?.score === 'number'
                            ? repoScore.score >= 80
                                ? "Excellent"
                                : repoScore.score >= 60
                                    ? "Good"
                                    : "Needs Improvement"
                            : "--"}
                    </span>
                </div>
            </div>

            {/* Good & Bad Points */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <h3 className="font-semibold text-green-700 mb-2">Good</h3>
                    <ul className="list-disc pl-5 text-green-900">
                        {Array.isArray(repoScore?.good) && repoScore.good.length > 0
                            ? repoScore.good.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))
                            : <li>No good points found.</li>}
                    </ul>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <h3 className="font-semibold text-red-700 mb-2">Bad</h3>
                    <ul className="list-disc pl-5 text-red-900">
                        {Array.isArray(repoScore?.bad) && repoScore.bad.length > 0
                            ? repoScore.bad.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))
                            : <li>No bad points found.</li>}
                    </ul>
                </div>
            </div>

            {/* File Scores */}
            <div className="mb-8">
                <h3 className="font-semibold text-lg mb-3">File Scores</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm border rounded-xl">
                        <thead>
                            <tr className="bg-secondary">
                                <th className="px-3 py-2 text-left">File</th>
                                <th className="px-3 py-2 text-left">Score</th>
                                <th className="px-3 py-2 text-left">LOC</th>
                                <th className="px-3 py-2 text-left">Issues</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(repoScore?.file_scores) && repoScore.file_scores.length > 0
                                ? repoScore.file_scores.map((file, idx) => (
                                    <tr key={idx} className="border-t">
                                        <td className="px-3 py-2">{file.file}</td>
                                        <td className="px-3 py-2">{file.score}</td>
                                        <td className="px-3 py-2">{file.loc}</td>
                                        <td className="px-3 py-2">
                                            {Array.isArray(file.issues) && file.issues.length > 0
                                                ? file.issues.join(', ')
                                                : 'None'}
                                        </td>
                                    </tr>
                                ))
                                : <tr><td colSpan={4} className="px-3 py-2 text-center">No file scores found.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Folder Scores */}
            <div className="mb-8">
                <h3 className="font-semibold text-lg mb-3">Folder Scores</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm border rounded-xl">
                        <thead>
                            <tr className="bg-secondary">
                                <th className="px-3 py-2 text-left">Folder</th>
                                <th className="px-3 py-2 text-left">Score</th>
                                <th className="px-3 py-2 text-left">Depth</th>
                                <th className="px-3 py-2 text-left">Issues</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(repoScore?.folder_scores) && repoScore.folder_scores.length > 0
                                ? repoScore.folder_scores.map((folder, idx) => (
                                    <tr key={idx} className="border-t">
                                        <td className="px-3 py-2">{folder.folder}</td>
                                        <td className="px-3 py-2">{folder.score}</td>
                                        <td className="px-3 py-2">{folder.depth}</td>
                                        <td className="px-3 py-2">
                                            {Array.isArray(folder.issues) && folder.issues.length > 0
                                                ? folder.issues.join(', ')
                                                : 'None'}
                                        </td>
                                    </tr>
                                ))
                                : <tr><td colSpan={4} className="px-3 py-2 text-center">No folder scores found.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Issues */}
            <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900 rounded-xl p-6 flex items-start gap-4">
                <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1" />
                <div>
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Issues & Recommendations</h3>
                    <ul className="list-disc pl-5 text-blue-700 dark:text-blue-300">
                        {Array.isArray(repoScore?.issue) && repoScore.issue.length > 0
                            ? repoScore.issue.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))
                            : <li>No issues found.</li>}
                    </ul>
                </div>
            </div>
        </div>
    );
}
