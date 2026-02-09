import React from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs, vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';

SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('json', json);

function decodeContent(content, encoding) {
    if (!content) return "";
  
    if (encoding === "base64") {
      try {
        // GitHub inserts newlines in base64
        const cleaned = content.replace(/\n/g, "");
        return atob(cleaned);
      } catch (err) {
        console.error("Base64 decode failed", err);
        return "";
      }
    }
  
    // utf-8 or plain text
    return content;
  }

export default function CodeViewer({ content,language, encoding = 'utf-8', theme = 'dark' }) {
    // Simple theme toggle based on prop or system preference could be added
    const style = theme === 'dark' ? vscDarkPlus : vs;
    const languageMap = {
        'js': 'javascript',
        'jsx': 'jsx',
        'css': 'css',
        'json': 'json',
        'html': 'html',
        'python': 'python',
        'java': 'java',
        'c': 'c',
        'cpp': 'cpp',
    }
    const decodedContent = decodeContent(content, encoding);
    return (
        <div className="h-full w-full overflow-auto text-sm bg-[#1e1e1e]">
            <SyntaxHighlighter
                language={languageMap[language]}
                style={style}
                customStyle={{
                    margin: 0,
                    padding: '1.5rem',
                    height: '100%',
                    width: '100%',
                    background: 'transparent',
                    fontSize: '14px',
                    lineHeight: '1.5'
                }}
                showLineNumbers={true}
                lineNumberStyle={{ minWidth: '3em', paddingRight: '1em', color: '#6e7681', textAlign: 'right' }}
            >
                {decodedContent}
            </SyntaxHighlighter>
        </div>
    );
}
