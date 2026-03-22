"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Mic, 
  AudioLines, 
  ArrowUp, 
  Paperclip, 
  Smile, 
  Heart, 
  Frown, 
  CircleHelp,
  Bot,
  User,
  MoreHorizontal,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Copy
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "@/components/ui/chat-bubble";
import { ChatMessageList } from "@/components/ui/chat-message-list";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isLanding = messages.length === 0;

  const handleSend = (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    // AI Simulation
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm Raghav's AI assistant. I've switched to the chat view as you requested. The input is now at the bottom, just like ChatGPT!",
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsLoading(false);
    }, 1000);
  };

  const ActionButton = ({ icon, label, text }: { icon: React.ReactNode; label: string; text: string }) => (
    <button
      onClick={() => handleSend(text)}
      className="flex items-center gap-2 px-4 py-2 bg-neutral-900/50 hover:bg-neutral-800 rounded-full border border-neutral-800 text-neutral-400 hover:text-white transition-all text-sm whitespace-nowrap"
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className={cn("relative w-full h-full flex flex-col items-center", isLanding && "justify-center")}>
      <AnimatePresence mode="wait">
        {isLanding ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col items-center justify-center w-full max-w-3xl space-y-8 h-full"
          >
            <h1 className="text-4xl font-semibold text-white tracking-tight text-center">
               How are you feeling today !
            </h1>

            <div className="w-full relative group">
              <div className="relative bg-neutral-900/80 backdrop-blur-xl border border-neutral-800 rounded-3xl p-2 transition-all duration-300 focus-within:border-neutral-700 focus-within:ring-1 focus-within:ring-white/10 shadow-2xl">
                <div className="flex items-center gap-3 px-3">
                  <Plus className="w-5 h-5 text-neutral-500 hover:text-white cursor-pointer transition-colors" />
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Ask anything"
                    className="flex-1 bg-transparent border-none py-4 text-white placeholder:text-neutral-500 focus:outline-none text-base"
                  />
                  <div className="flex items-center gap-2">
                    <Mic className="w-5 h-5 text-neutral-500 hover:text-white cursor-pointer transition-colors" />
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center cursor-pointer hover:bg-neutral-200 transition-colors" onClick={() => handleSend()}>
                        <AudioLines className="w-4 h-4 text-black" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <ActionButton icon={<CircleHelp className="w-4 h-4" />} label="Confused" text="I am feeling bit confused" />
              <ActionButton icon={<Smile className="w-4 h-4" />} label="Happy" text="I am very happy right now yaaaay !" />
              <ActionButton icon={<Heart className="w-4 h-4" />} label="Emotional" text="I am feeling very emotional" />
              <ActionButton icon={<Frown className="w-4 h-4" />} label="Want to cry" text="I want to cry aaaaah" />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full flex flex-col max-w-4xl mx-auto"
          >
            {/* Header Area (Optional) */}
            <div className="flex items-center justify-between p-4 sticky top-0 z-20 bg-black/50 backdrop-blur-md">
                 <div className="flex items-center gap-2 group cursor-pointer">
                    <span className="text-sm font-semibold text-neutral-300 group-hover:text-white transition-colors">Raghay AI</span>
                    <Bot className="w-4 h-4 text-neutral-500" />
                 </div>
                 <div className="flex items-center gap-4">
                    <Share2 className="w-4 h-4 text-neutral-500 hover:text-white cursor-pointer" />
                    <MoreHorizontal className="w-4 h-4 text-neutral-500 hover:text-white cursor-pointer" />
                 </div>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-hidden">
                <ChatMessageList smooth>
                    {messages.map((msg) => (
                        <div key={msg.id} className={cn(
                            "group flex flex-col gap-2 w-full",
                            msg.role === "user" ? "items-end" : "items-start"
                        )}>
                            {msg.role === "assistant" && (
                                <div className="flex items-center gap-3 mb-1">
                                    <div className="w-6 h-6 rounded-full border border-neutral-800 flex items-center justify-center">
                                         <Bot className="w-3.5 h-3.5 text-white" />
                                    </div>
                                    <span className="text-xs font-bold text-white uppercase tracking-wider">Hey Raghav 👋</span>
                                </div>
                            )}
                            <div className={cn(
                                "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                                msg.role === "user" 
                                    ? "bg-neutral-800 text-white" 
                                    : "bg-transparent text-neutral-200 border-none px-0"
                            )}>
                                {msg.content}
                            </div>
                            {msg.role === "assistant" && (
                                <div className="flex items-center gap-4 mt-2 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <RotateCcw className="w-3.5 h-3.5 text-neutral-600 hover:text-white cursor-pointer" />
                                    <ThumbsUp className="w-3.5 h-3.5 text-neutral-600 hover:text-white cursor-pointer" />
                                    <ThumbsDown className="w-3.5 h-3.5 text-neutral-600 hover:text-white cursor-pointer" />
                                    <Copy className="w-3.5 h-3.5 text-neutral-600 hover:text-white cursor-pointer" />
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex flex-col gap-2 items-start animate-pulse">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="w-6 h-6 rounded-full border border-neutral-800 bg-neutral-900" />
                            </div>
                            <div className="h-4 w-32 bg-neutral-800 rounded-full" />
                        </div>
                    )}
                </ChatMessageList>
            </div>

            {/* Bottom Input Area */}
            <div className="w-full max-w-3xl mx-auto p-4 pb-8">
                <div className="relative bg-neutral-900/90 border border-neutral-800 rounded-2xl p-2 transition-all focus-within:border-neutral-700 shadow-xl">
                    <div className="flex items-center gap-3 px-3">
                        <Plus className="w-4 h-4 text-neutral-500" />
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Message Raghav AI..."
                            className="flex-1 bg-transparent border-none py-3 text-white placeholder:text-neutral-500 focus:outline-none text-sm"
                        />
                        <div className="flex items-center gap-2">
                            <Mic className="w-4 h-4 text-neutral-500" />
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                                input.trim() ? "bg-white text-black" : "bg-neutral-800 text-neutral-500"
                            )} onClick={() => handleSend()}>
                                <ArrowUp className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </div>
                <p className="text-[10px] text-neutral-600 text-center mt-3">
                    ChatGPT can make mistakes. Check important info.
                </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
