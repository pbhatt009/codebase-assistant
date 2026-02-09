import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertTriangle, XCircle, TrendingUp } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Score() {
    const { repoId } = useParams();
    const navigate = useNavigate();

    // Mock Data
    const overallScore = 85;
    const metrics = [
        { name: 'Maintainability', score: 90, status: 'good', description: 'Code is well-structured and easy to understand.' },
        { name: 'Documentation', score: 75, status: 'warning', description: 'Some functions lack JSDoc comments.' },
        { name: 'Testing', score: 60, status: 'critical', description: 'Low test coverage detected in core modules.' },
        { name: 'Performance', score: 95, status: 'good', description: 'No significant performance bottlenecks found.' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'good': return 'text-green-600 bg-green-50 border-green-200';
            case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'critical': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'good': return <CheckCircle className="h-5 w-5" />;
            case 'warning': return <AlertTriangle className="h-5 w-5" />;
            case 'critical': return <XCircle className="h-5 w-5" />;
            default: return null;
        }
    };

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
                <h1 className="text-3xl font-bold tracking-tight mb-2">Codebase Health Score</h1>
                <p className="text-muted-foreground">Comprehensive analysis of repository quality metrics.</p>
            </div>

            {/* Overall Score Card */}
            <div className="bg-card border rounded-xl p-8 mb-8 flex items-center justify-between shadow-sm">
                <div>
                    <h2 className="text-xl font-semibold mb-2">Overall Quality</h2>
                    <p className="text-sm text-muted-foreground max-w-md">
                        Calculated based on static analysis, complexity metrics, and community standards.
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
                                strokeDashoffset={351.86 - (351.86 * overallScore) / 100}
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="transparent"
                                r="56"
                                cx="64"
                                cy="64"
                            />
                        </svg>
                        <span className="absolute text-4xl font-bold">{overallScore}</span>
                    </div>
                    <span className="text-sm font-medium mt-2 text-muted-foreground">Excellent</span>
                </div>
            </div>

            {/* Detailed Metrics Grid */}
            <div className="grid gap-6 md:grid-cols-2">
                {metrics.map((metric) => (
                    <div key={metric.name} className="border rounded-xl p-6 bg-card hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-lg">{metric.name}</h3>
                            <div className={cn("px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5", getStatusColor(metric.status))}>
                                {getStatusIcon(metric.status)}
                                {metric.score}/100
                            </div>
                        </div>
                        <div className="w-full bg-secondary h-2 rounded-full mb-3 overflow-hidden">
                            <div
                                className={cn("h-full rounded-full transition-all duration-500",
                                    metric.status === 'good' ? 'bg-green-500' :
                                        metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                                )}
                                style={{ width: `${metric.score}%` }}
                            />
                        </div>
                        <p className="text-sm text-muted-foreground">{metric.description}</p>
                    </div>
                ))}
            </div>

            <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900 rounded-xl p-6 flex items-start gap-4">
                <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1" />
                <div>
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Improvement Recommendation</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                        Focus on increasing test coverage in the `core/auth` module to boost your Testing score. Adding JSDoc to utility functions will also improve the Documentation rating.
                    </p>
                </div>
            </div>
        </div>
    );
}
