"use client";

import { useState } from "react";
import { ChatInterface } from "@/components/chat-interface";
import StarryBackground from "@/components/ui/animated-shader-background";
import { ChatSidebar } from "@/components/ui/sidebar";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatHistory {
  id: string;
  title: string;
  messages: Message[];
}

export default function Home() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string>(Date.now().toString());
  const [chats, setChats] = useState<ChatHistory[]>([]);
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);

  const saveCurrentToHistory = () => {
    if (currentMessages.length > 0) {
      setChats(prev => {
        const existingIdx = prev.findIndex(c => c.id === activeChatId);
        if (existingIdx > -1) {
          const updated = [...prev];
          updated[existingIdx] = { ...updated[existingIdx], messages: currentMessages };
          return updated;
        }
        const title = currentMessages[0].content.slice(0, 40);
        return [{ id: activeChatId, title, messages: currentMessages }, ...prev];
      });
    }
  };

  const handleNewChat = () => {
    saveCurrentToHistory();
    setActiveChatId(Date.now().toString());
    setCurrentMessages([]);
  };

  const handleSelectChat = (id: string) => {
    saveCurrentToHistory();
    const selected = chats.find(c => c.id === id);
    if (selected) {
      setActiveChatId(id);
      setCurrentMessages(selected.messages);
    }
  };

  return (
    <div className="flex bg-black text-white h-screen max-h-screen overflow-hidden font-sans selection:bg-white/20 relative">
      <StarryBackground />
      
      <ChatSidebar 
        isCollapsed={isCollapsed} 
        onToggle={() => setIsCollapsed(!isCollapsed)} 
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        chats={chats}
        activeChatId={activeChatId}
      />

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 lg:p-12 bg-[#0d0d0d]/40 h-full overflow-hidden backdrop-blur-[1px]">
        <div className="relative w-full h-full flex items-center justify-center">
             <ChatInterface 
               key={activeChatId} 
               initialMessages={currentMessages}
               onMessagesUpdate={setCurrentMessages}
             />
        </div>
      </main>
    </div>
  );
}
