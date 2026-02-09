import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FileCode, File, FolderOpen } from 'lucide-react';
import { cn } from '../../lib/utils';

export function FileTreeNode({ node, level = 0, onSelect, selectedFile }) {
    const [isOpen, setIsOpen] = useState(false);

    const isFolder = node.type === 'folder';
    const isSelected = selectedFile?.path === node.path;

    const handleClick = (e) => {
        e.stopPropagation();
        if (isFolder) {
            setIsOpen(!isOpen);
        } else {
            onSelect(node);
        }
    };

    return (
        <div>
            <div
                onClick={handleClick}
                className={cn(
                    "flex items-center gap-1.5 py-1 px-2 cursor-pointer select-none text-sm transition-colors whitespace-nowrap overflow-hidden text-ellipsis hover:bg-secondary/50",
                    isSelected ? "bg-primary/10 text-primary" : "text-gray-600 dark:text-gray-400"
                )}
                style={{ paddingLeft: `${level * 12 + 8}px` }}
            >
                <span className="shrink-0 text-gray-400">
                    {isFolder ? (
                        isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />
                    ) : <span className="w-3.5" />}
                </span>

                <span className="shrink-0 text-blue-500 dark:text-blue-400">
                    {isFolder ? (
                        isOpen ? <FolderOpen className="h-4 w-4" /> : <Folder className="h-4 w-4" />
                    ) : (
                        <FileCode className="h-4 w-4 text-gray-500" />
                    )}
                </span>

                <span>{node.name}</span>
            </div>

            {isFolder && isOpen && node.children && (
                <div>
                    {[...node.children]
                        .sort((a, b) => {
                            const aIsFolder = a.type === 'folder';
                            const bIsFolder = b.type === 'folder';
                            if (aIsFolder !== bIsFolder) {
                                // Folders first
                                return aIsFolder ? -1 : 1;
                            }
                            // Then sort alphabetically by name
                            return a.name.localeCompare(b.name);
                        })
                        .map((child) => (
                            <FileTreeNode
                                key={child.path}
                                node={child}
                                level={level + 1}
                                onSelect={onSelect}
                                selectedFile={selectedFile}
                            />
                        ))}
                </div>
            )}
        </div>
    );
}

export default function FileTree({ files, onSelectFile, selectedFile }) {
    return (
        <div className="h-full overflow-y-auto py-2">
            {[...files]
                .sort((a, b) => {
                    const aIsFolder = a.type === 'folder';
                    const bIsFolder = b.type === 'folder';
                    if (aIsFolder !== bIsFolder) {
                        // Folders first
                        return aIsFolder ? -1 : 1;
                    }
                    return a.name.localeCompare(b.name);
                })
                .map((node) => (
                    <FileTreeNode
                        key={node.path}
                        node={node}
                        onSelect={onSelectFile}
                        selectedFile={selectedFile}
                    />
                ))}
        </div>
    );
}
