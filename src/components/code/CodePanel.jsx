import React, { useState } from 'react';
import FileTree from './FileTree';
import CodeViewer from './CodeViewer';
import { Network, GitBranch, Search } from 'lucide-react';
import { getFileContent } from '../../utils/api';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';


export default function CodePanel({ initialFile }) {
const reduxRepo = useSelector((state) => state.currRepo);

  const [currRepo, setrepo] = useState(() => {
    // 1. Try Redux first
    if (reduxRepo?.repo_info && Object.keys(reduxRepo.repo_info).length > 0) {
      return reduxRepo;
    }

    // 2. Try localStorage
    const saved = localStorage.getItem("currrepo");
    return saved ? JSON.parse(saved) :reduxRepo;
  });
  /// save to local storage
  console.log("currRepo", currRepo);
    useEffect(() => {
    if (currRepo?.repo_info && Object.keys(currRepo.repo_info).length > 0) {
      localStorage.setItem("currrepo", JSON.stringify(currRepo));
      console.log("currrepo saved");
    }
  }, [currRepo]);
    
    const tree = currRepo.tree;
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileContent, setFileContent] = useState(null);
   useEffect(() => {
    if(selectedFile!==null) {
        getFileContent(selectedFile.url).then((res) => {
            setFileContent(res);
        });
    }
   },[selectedFile])
   console.log(tree);
   console.log(selectedFile);

    return (
        <div className="h-full flex flex-col md:flex-row bg-background border-l">
            {/* Sidebar */}
            <div className="w-full md:w-64 border-r bg-sidebar flex flex-col">
                <div className="h-10 border-b flex items-center px-4 bg-sidebar/50">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Explorer</span>
                </div>
                <div className="flex-1 overflow-hidden">
                    <FileTree
                        files={tree}
                        onSelectFile={setSelectedFile}
                        selectedFile={selectedFile}
                    />
                </div>
                <div className="h-8 border-t flex items-center px-4 gap-3 text-muted-foreground bg-sidebar/50">
                    <GitBranch className="h-3.5 w-3.5" />
                    <span className="text-xs">main</span>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col bg-[#1e1e1e] overflow-hidden relative">
                {/* Tabs/Breadcrumbs could go here */}
                {selectedFile ? (
                    <>
                        <div className="h-10 bg-[#1e1e1e] flex items-center px-4 border-b border-[#333]">
                            <span className="text-sm text-gray-300 flex items-center gap-2">
                                <FileTreeIcon name={selectedFile.name} />
                                {selectedFile.name}
                            </span>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <CodeViewer
                                content={fileContent?.content || '// Select a file to view content'}
                                encoding={fileContent?.encoding}
                                language={selectedFile?.name.split('.').pop()}
                            />
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                            <Search className="h-8 w-8 opacity-50" />
                        </div>
                        <p>Select a file to view code</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function FileTreeIcon({ name }) {
    // simplified icon logic
    return <span className="opacity-70">📄</span>;
}
