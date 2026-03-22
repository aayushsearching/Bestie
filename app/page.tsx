"use client";

import { useState } from "react";
import { ChatInterface } from "@/components/chat-interface";
import StarryBackground from "@/components/ui/animated-shader-background";
import { ChatSidebar } from "@/components/ui/sidebar";

interface ChatHistory {
  id: string;
  title: string;
}

export default function Home() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [chatId, setChatId] = useState(Date.now().toString());
  const [chats, setChats] = useState<ChatHistory[]>([]);
  const [currentTitle, setCurrentTitle] = useState("");

  const handleNewChat = () => {
    if (currentTitle) {
      setChats((prev: ChatHistory[]) => [
        { id: Date.now().toString(), title: currentTitle },
        ...prev,
      ]);
    }
    setChatId(Date.now().toString());
    setCurrentTitle("");
  };

  return (
    <div className="flex bg-black text-white h-screen max-h-screen overflow-hidden font-sans selection:bg-white/20 relative">
      <StarryBackground />
      
      {/* Left Sidebar */}
      <ChatSidebar 
        isCollapsed={isCollapsed} 
        onToggle={() => setIsCollapsed(!isCollapsed)} 
        onNewChat={handleNewChat}
        chats={chats}
      />

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 lg:p-12 bg-[#0d0d0d]/40 h-full overflow-hidden backdrop-blur-[1px]">
        {/* Integrated Chat Interface (Landing -> Chatting) */}
        <div className="relative w-full h-full flex items-center justify-center">
             <ChatInterface key={chatId} onFirstMessage={(title) => setCurrentTitle(title)} />
        </div>
      </main>
    </div>
  );
}
