import React, { useState, useEffect,useRef} from "react";
import { useSelector } from "react-redux";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { Plus, History, X } from "lucide-react";
import { cn } from "../../lib/utils";
import{ addThread,setThreads } from "../../store/threads";
import { getthreads,gethistory,newchat} from "../../utils/api";
import { u } from "framer-motion/client";
import { useDispatch } from "react-redux";

import axios from 'axios'  





export default function ChatPanel({ repoName }) {

  const redux_threads=useState(useSelector((state) => state.threads?.threads || []));
  console.log("redux threads:", redux_threads);
  const userId = useSelector((state) => state.currRepo?.repo_info?.added_by);
  const repoId = useSelector((state) => state.currRepo?.repo_info?.id);
  console.log("userId:", userId, "repoId:", repoId);
  const [selectedThread, setSelectedThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [threads, setthread] = useState([]);
  const[ThreadTitle, setThreadTitle] = useState("");
  const[isCreatingThread, setIsCreatingThread] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    async function fetchThreads() {
    console.log(redux_threads)
    if(redux_threads[0].length === 0 && repoId&&userId) {
      const response=await getthreads(repoId,userId);
      dispatch(setThreads(response));
      setthread(response);
    //   console.log("Fetched threads:", response);
    //   console.log("Updated threads state:", threads);
    }
}
      if(redux_threads[0].length === 0) {
        fetchThreads();
      }
      else {
        setthread(redux_threads[0]);
        console.log("Using threads from Redux:", redux_threads[0]);}

  },[userId, repoId]);


  useEffect(()=>{
    if (!selectedThread) return;
    async function fetchHistory() {
  

    setLoadingHistory(true);
    const response = await gethistory(selectedThread);

    setMessages(response);
    setLoadingHistory(false);
    }
    fetchHistory();
   
  }, [selectedThread]);


const bottomRef = useRef(null);

useEffect(() => {
  bottomRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);


  const handleSend = async (text) => {
  if (!text.trim() || !selectedThread || !userId || !repoId) return;

    setMessages((prev) => [
  ...prev,
  {
    id:Date.now(),
    role: "user",
    created_at: new Date().toISOString(),
    content: text
  },
  {
    id: Date.now() + 1,
    role: "assistant",
    created_at: new Date().toISOString(),
    content: ""
  }
]);

  const response = await fetch("/api/respond", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: text,
      thread_id: selectedThread,
      user_id: userId,
      repo_id: repoId,
    }),
  });
const reader = response.body.getReader();
const decoder = new TextDecoder("utf-8");



while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  let buffer = decoder.decode(value, { stream: true });
       console.log("Received buffer1:", buffer);
  buffer=buffer.split(':').slice(1).join(':');
     console.log("Received buffer2:", buffer);
  
       setMessages(prev => {
          const updated = [...prev];
          const last = updated.length - 1;

          updated[last] = {
            ...updated[last],
            content: updated[last].content + buffer
          };

          return updated;
        });

      }
    
  }


    

  





  const createThread = async (title) => {
    if (!title || !repoId || !userId) return;
    const newThread = await newchat(repoId, userId, title);
    console.log("Created new thread:", newThread);
    setthread((prev) => [...prev, newThread[0]]);
    dispatch(addThread(newThread[0]));
    setSelectedThread(newThread[0].id);
  }

  return (
    <div className="flex h-full relative bg-white text-slate-900 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {isCreatingThread && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    
    <div className="bg-white w-[360px] rounded-xl shadow-xl p-6 relative">

      {/* Close button */}
      <button
        onClick={() => setIsCreatingThread(false)}
        className="absolute top-3 right-3 text-slate-500 hover:text-slate-800"
      >
        ✕
      </button>

      {/* Title */}
      <h2 className="text-lg font-semibold text-slate-800 mb-4 text-center">
        Create Thread
      </h2>

      {/* Input */}
      <input
        type="text"
        placeholder="Enter thread title..."
        value={ThreadTitle}
        onChange={(e) => setThreadTitle(e.target.value)}
        className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Buttons */}
      <div className="flex justify-end gap-2 mt-5">
        <button
          onClick={() => setIsCreatingThread(false)}
          className="px-3 py-1.5 text-sm border border-slate-300 rounded-md hover:bg-slate-100"
        >
          Cancel
        </button>

        <button
          onClick={() => {
            createThread(ThreadTitle);
            setThreadTitle("");
            setIsCreatingThread(false);
          }}
          className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Create
        </button>
      </div>

    </div>
  </div>
)}
      {/* Sidebar */}
      
      <div
        className={cn(
          "absolute inset-y-0 left-0 z-20 w-72 transform bg-white border-r border-slate-200 transition-transform duration-200 shadow-sm",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-blue-600 text-white text-[11px] font-semibold">
              TH
            </span>
            <div className="flex flex-col">
              <span className="font-semibold text-xs uppercase tracking-wider text-slate-700">
                Threads
              </span>
              <span className="text-[10px] text-slate-500">
                Manage conversations
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsCreatingThread(true)}
              className="inline-flex items-center justify-center rounded-md bg-blue-600 text-white px-2 py-1 text-xs font-medium hover:bg-blue-700 transition"
            >
              <Plus className="mr-1 h-3 w-3" />
              New
            </button>

            <button
              onClick={() => setSidebarOpen(false)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="p-2 space-y-1.5 overflow-y-auto h-[calc(100%-3.5rem)]">
          {threads.length === 0 ? (
            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-4 text-center">
              <History className="h-5 w-5 text-slate-400 mx-auto mb-2" />
              <div className="text-sm font-medium text-slate-700 mb-1">
                No threads yet
              </div>
              <div className="text-xs text-slate-500 mb-3">
                Start a new conversation.
              </div>
              <button
                onClick={() => setIsCreatingThread(true)}
                className="bg-blue-600 text-white px-3 py-1.5 text-xs rounded-md hover:bg-blue-700 transition"
              >
                Start first thread
              </button>
            </div>
          ) : (
            threads.map((thread) => (
              <button
                key={thread.id}
                onClick={() => setSelectedThread(thread.id)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md border transition",
                  selectedThread?.id === thread.id
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "hover:bg-slate-100 border-transparent text-slate-700"
                )}
              >
                <div className="text-sm font-medium truncate">
                  {thread.title}
                </div>
                <div className="text-xs text-slate-500 truncate">
                  Conversation thread
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header */}
        <div className="h-14 border-b border-slate-200 bg-white px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="h-8 w-8 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 transition flex items-center justify-center"
            >
              <History className="h-4 w-4 text-slate-600" />
            </button>

            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {repoName || "Conversation"}
              </span>
              <span className="text-sm font-medium text-slate-900">
                {selectedThread
                  ? selectedThread.title
                  : "Select or start a thread"}
              </span>
            </div>
          </div>

          {selectedThread && (
            <div className="text-xs text-emerald-600 font-medium">
              ● Live assistant
            </div>
          )}
        </div>

        {/* Content */}
        {!selectedThread ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-sm">
            <History className="h-8 w-8 text-slate-400 mb-3" />
            <div className="text-base font-medium text-slate-700 mb-2">
              No thread selected
            </div>
            <button
              onClick={() => setIsCreatingThread(true)}
              className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm hover:bg-blue-700 transition"
            >
              New thread
            </button>
          </div>
        ) : loadingHistory ? (
          <div className="flex-1 flex items-center justify-center text-slate-500">
            Loading history…
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 px-4 bg-slate-50">
              {messages.length === 0 ? (
                <div className="flex h-full items-center justify-center text-slate-400">
                  No messages yet.
                </div>
              ) : (
                messages.map((msg) => (
                  <MessageBubble key={msg.id} {...msg} />
                ))
              )}
                <div ref={bottomRef} />
            </div>

            <div className="border-t border-slate-200 bg-white px-4 py-2">
              <ChatInput onSend={handleSend} />
            </div>
          </>
        )}
      </div>
    </div>

  );
}