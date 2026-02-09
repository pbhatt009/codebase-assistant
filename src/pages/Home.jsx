import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Github, Folder, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { getEmbeddings,gettree} from '../utils/api.js';
import { curr_repo_info, addTree } from '../store/curr_repo';
import {addRepo} from '../store/repo_data.js'
import { useDispatch, useSelector } from 'react-redux';

// Mock Data


export default function Home() {
   
const reduxRepos = useSelector((state) => state.repoData.repos);

const [repos, setrepos] = useState(() => {
  // 1. Try Redux first
  if (reduxRepos && Object.keys(reduxRepos).length > 0) {
    return reduxRepos;
  }

  // 2. Try localStorage
  const saved = localStorage.getItem("repos");
  return saved ? JSON.parse(saved) : {};
});
    console.log("repos",repos)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [githubUrl, setGithubUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    
   
      useEffect(()=>{
              console.log("saving",repos)
             if (repos && Object.keys(repos).length > 0) {
    localStorage.setItem("repos", JSON.stringify(repos));
    console.log("repos saved successfully");
  }
      },[repos])

    const handleSelectRepo = async (id,repoName) => {
        console.log(repos)
      console.log(id)
        const repo_data = repos[id]
        if (!repo_data) {
            console.log("Repo not found");
            return;
          }
        console.log(repo_data)
          
        const info={"repo_owner":repo_data.owner_name,"repo_name":repo_data.repo_name}

        try {
            console.log(repo_data)

          
            const tree = await  gettree(info)
            console.log(tree)
            dispatch(curr_repo_info(repo_data))
            dispatch(addTree(tree));
            navigate(`/workspace/${repoName}`);

            // Mock success - usually we'd parse the URL to get the repo name
           
        } catch (err) {
            setError('Failed to load repository. Please try again.');
        }


        
    };

    const handleImport = async (e) => {
        e.preventDefault();
        setError(null);

        if (!githubUrl.trim()) {
            setError('Please enter a GitHub URL');
            return;
        }

        if (!githubUrl.includes('github.com')) {
            setError('Invalid GitHub URL. Please provide a valid repository link.');
            return;
        }

        setIsLoading(true);

        try {
            // Simulate preview mode fetch
            const embeddings = await getEmbeddings(githubUrl);
            console.log(embeddings.tree);
            dispatch(curr_repo_info(embeddings.repo_info));
            dispatch(addTree(embeddings.tree));
            setrepos(prev => ({
            ...(prev || {}),
            [embeddings.repo_info.id]: embeddings.repo_info
            }));
            

            dispatch(addRepo(embeddings.repo_info));

            // Mock success - usually we'd parse the URL to get the repo name
            const mockId = 'preview-' + Date.now();
            navigate(`/workspace/${mockId}`);
        } catch (err) {
            setError('Failed to fetch repository. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto max-w-5xl py-12 px-6">
            <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">My Codebases</h1>
                    <p className="text-muted-foreground text-gray-500">Select a repository to start chatting with your codebase.</p>
                </div>

                <form onSubmit={handleImport} className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <Github className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground text-gray-400" />
                        <input
                            type="text"
                            placeholder="https://github.com/username/repo"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-9"
                            value={githubUrl}
                            onChange={(e) => setGithubUrl(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 shadow-sm whitespace-nowrap"
                    >
                        {isLoading ? (
                            <>
                                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></span>
                                Previewing...
                            </>
                        ) : (
                            <>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Codebase
                            </>
                        )}
                    </button>
                </form>
            </div>

            {error && (
                <div className="mb-6 p-4 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
                    {error}
                </div>
            )}

            {Object.keys(repos).length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 dark:border-gray-700 bg-transparent p-12 text-center min-h-[400px]">
                    <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                        <Folder className="h-8 w-8 text-gray-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Repositories Available</h3>
                    <p className="text-sm text-gray-500">Add a repository using the form above to get started.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(repos).map(([id, repo])  => (
                        <div
                            key={id}
                            className="group relative flex flex-col justify-between rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:border-primary/20 cursor-pointer bg-white dark:bg-zinc-950"
                            onClick={() => handleSelectRepo(id,repo.repo_name)}
                        >
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        {repo?.owner_avatar_url ? (
                                            <img 
                                                src={repo.owner_avatar_url} 
                                                alt={repo.owner_name || 'Owner'} 
                                                className="w-8 h-8 rounded-full"
                                            />
                                        ) : (
                                            <div className="p-2 bg-secondary rounded-full group-hover:bg-primary/10 transition-colors">
                                                <Github className="h-5 w-5 text-gray-700 dark:text-gray-300 group-hover:text-primary" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {repo.private && (
                                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                                                Private
                                            </span>
                                        )}
                                        {repo.score !== undefined && (
                                            <span className={cn(
                                                "px-2.5 py-0.5 rounded-full text-xs font-medium border",
                                                repo.score >= 90 ? "bg-green-50 text-green-700 border-green-200" : "bg-yellow-50 text-yellow-700 border-yellow-200"
                                            )}>
                                                Score: {repo.score?.final_score}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <h3 className="font-semibold text-lg tracking-tight mb-2 group-hover:text-primary  text-gray-400 transition-colors">{repo.repo_name}</h3>
                                {repo.description && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
                                        {repo.description}
                                    </p>
                                )}
                                {repo?.owner_name && (
                                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                                        <span>Owner: {repo.owner_name}</span>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 border-t bg-gray-50/50 dark:bg-gray-900/50 rounded-b-xl flex items-center justify-between group-hover:bg-primary/5 transition-colors">
                                <span className="text-xs font-medium text-gray-500">
                                    Click to open repository
                                </span>
                                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 duration-300" />
                            </div>
                        </div>
                    ))}

                    {/* Empty State / Add New Card */}
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 dark:border-gray-700 bg-transparent p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors cursor-pointer min-h-[200px]">
                        <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                            <Plus className="h-6 w-6 text-gray-500" />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">Load Local Repository</span>
                        <span className="text-sm text-gray-500 mt-1">Select a folder from your disk</span>
                    </div>
                </div>
            )}
        </div>
    );
}
