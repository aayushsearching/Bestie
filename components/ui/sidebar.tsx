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
}

function SidebarItem({ icon, label, active, isCollapsed }: SidebarItemProps) {
  return (
    <button
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

const CHATS: string[] = [];

interface ChatSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function ChatSidebar({ isCollapsed, onToggle }: ChatSidebarProps) {
  return (
    <div className={cn(
      "flex flex-col h-screen bg-[#0d0d0d] border-r border-neutral-800 transition-all duration-300 overflow-hidden",
      isCollapsed ? "w-[60px]" : "w-64"
    )}>
      {/* Header */}
      <div className={cn("p-4 pb-2 flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
        <div className={cn("flex items-center justify-center")}>
             {/* Replace Logo with Text Raghav / R */}
             {isCollapsed ? (
               <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center border border-neutral-700">
                  <span className="text-sm font-black text-white">R</span>
               </div>
             ) : (
               <span className="text-2xl font-black tracking-tighter text-white">Raghav</span>
             )}
        </div>
        {!isCollapsed && (
          <button 
            onClick={onToggle}
            className="p-2 text-neutral-400 hover:bg-neutral-900 rounded-lg transition-colors ml-auto"
          >
            <PanelLeft className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Navigation */}
      <div className={cn("px-2 py-2 space-y-1 overflow-y-auto flex-1 custom-scrollbar", isCollapsed && "items-center")}>
        <SidebarItem isCollapsed={isCollapsed} icon={<SquarePen className="w-5 h-5" />} label="New chat" />

        {/* Your Chats Section */}
        <div className="mt-6">
          {!isCollapsed && (
            <p className="px-3 mb-2 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
              Your chats
            </p>
          )}
          <div className="space-y-1 pb-4 text-neutral-600 text-[10px] px-3">
             {!isCollapsed && CHATS.length === 0 && (
                <span>No saved chats yet</span>
             )}
            {CHATS.map((chat) => (
              <SidebarItem 
                key={chat} 
                isCollapsed={isCollapsed} 
                label={chat} 
                icon={isCollapsed ? <MessageSquare className="w-5 h-5" /> : null} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer / Toggle Section */}

      {/* Minimized Toggle (bottom) */}
      {isCollapsed && (
        <div className="p-3 pb-4 flex justify-center border-t border-neutral-900 mt-2">
            <button 
              onClick={onToggle}
              className="p-2 text-neutral-400 hover:bg-neutral-900 rounded-lg transition-colors"
            >
              <PanelLeft className="w-5 h-5" />
            </button>
        </div>
      )}
    </div>
  );
}
