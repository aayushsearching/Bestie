"use client";

import { useState } from "react";
import { ChatInterface } from "@/components/chat-interface";
import AnoAI from "@/components/ui/animated-shader-background";
import { ChatSidebar } from "@/components/ui/sidebar";

export default function Home() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex bg-black text-white h-screen max-h-screen overflow-hidden font-sans selection:bg-white/20">
      {/* Left Sidebar */}
      <ChatSidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />

      {/* Main Content */}
      <main className="relative flex-1 flex flex-col items-center justify-center p-4 lg:p-12 bg-[#0d0d0d] h-full overflow-hidden">
        {/* Transparent Shader Background */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
           <AnoAI />
        </div>
        
        {/* Integrated Chat Interface (Landing -> Chatting) */}
        <div className="relative z-10 w-full h-full flex items-center justify-center">
             <ChatInterface />
        </div>
      </main>
    </div>
  );
}
