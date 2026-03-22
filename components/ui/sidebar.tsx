"use client";

import React from "react";
import { 
  Plus, 
  Search, 
  Image as ImageIcon, 
  LayoutGrid, 
  Zap, 
  Box, 
  FolderPlus, 
  Folder, 
  MessageSquare,
  ChevronDown,
  PanelLeft,
  Settings,
  MoreHorizontal,
  SquarePen
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon?: React.ReactNode;
  label: string;
  active?: boolean;
  isCollapsed: boolean;
  onClick?: () => void;
}

function SidebarItem({ icon, label, active, isCollapsed, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-all duration-200",
        active 
          ? "bg-neutral-800 text-white" 
          : "text-neutral-400 hover:bg-neutral-900 hover:text-white",
        isCollapsed && "justify-center px-2 py-2.5"
      )}
    >
      {icon && <span className="w-5 h-5 flex items-center justify-center text-white">{icon}</span>}
      {!isCollapsed && <span className="truncate flex-1 text-left font-medium">{label}</span>}
      {!isCollapsed && active && <MoreHorizontal className="w-4 h-4 text-neutral-500" />}
    </button>
  );
}

interface ChatHistory {
  id: string;
  title: string;
}

interface ChatSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  onNewChat?: () => void;
  chats?: ChatHistory[];
}

export function ChatSidebar({ isCollapsed, onToggle, onNewChat, chats = [] }: ChatSidebarProps) {
  return (
    <div className={cn(
      "flex flex-col h-screen bg-[#0d0d0d] border-r border-neutral-800 transition-all duration-300 overflow-hidden",
      isCollapsed ? "w-[60px]" : "w-64"
    )}>
      {/* Header */}
      <div className={cn("p-4 pb-2 flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
        {isCollapsed ? (
          <button 
            onClick={onToggle}
            className="p-2 text-neutral-400 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <PanelLeft className="w-5 h-5 text-white" />
          </button>
        ) : (
          <>
            <div className="flex items-center">
              <span className="text-2xl font-black tracking-tighter text-white">Bestie</span>
            </div>
            <button 
              onClick={onToggle}
              className="p-2 text-neutral-400 hover:bg-neutral-900 rounded-lg transition-colors ml-auto"
            >
              <PanelLeft className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Main Navigation */}
      <div className={cn("px-2 py-2 space-y-1 overflow-y-auto flex-1 custom-scrollbar", isCollapsed && "items-center")}>
        <SidebarItem isCollapsed={isCollapsed} icon={<SquarePen className="w-5 h-5" />} label="New chat" onClick={onNewChat} />

        {/* Your Chats Section */}
        <div className="mt-6">
          {!isCollapsed && (
            <p className="px-3 mb-2 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
              Your chats
            </p>
          )}
          <div className="space-y-1 pb-4 text-neutral-600 text-[10px] px-3">
             {!isCollapsed && chats.length === 0 && (
                <span>No saved chats yet</span>
             )}
            {chats.map((chat: ChatHistory) => (
              <SidebarItem 
                key={chat.id} 
                isCollapsed={isCollapsed} 
                label={chat.title} 
                icon={isCollapsed ? <MessageSquare className="w-5 h-5" /> : null} 
              />
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
