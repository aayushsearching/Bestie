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
  MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon?: React.ReactNode;
  label: string;
  active?: boolean;
}

function SidebarItem({ icon, label, active }: SidebarItemProps) {
  return (
    <button
      className={cn(
        "flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-colors",
        active 
          ? "bg-neutral-800 text-white" 
          : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
      )}
    >
      {icon && <span className="w-4 h-4">{icon}</span>}
      <span className="truncate flex-1 text-left">{label}</span>
      {active && <MoreHorizontal className="w-4 h-4 text-neutral-500" />}
    </button>
  );
}

const CHATS = [
  "Vedic Report Analysis",
  "Emotion Detection Chatbot",
  "Ollama OpenCLAW Integration",
  "GATE Score Breakdown",
  "HealthX Project Upgrade",
  "Editing Code as Collaborator",
  "GitHub to Website Sync Issues",
  "Cloudflare Pages Overview",
  "Gamma PPT Template",
  "Mobile Site Not Reached",
  "Domain Setup with Cloudflare"
];

export function ChatSidebar() {
  return (
    <div className="flex flex-col w-64 h-screen bg-[#0d0d0d] border-r border-neutral-800">
      {/* Header */}
      <div className="p-3 flex items-center justify-between">
        <div className="w-8 h-8 bg-neutral-800 rounded-lg flex items-center justify-center">
            <Box className="w-5 h-5 text-white" />
        </div>
        <button className="p-2 text-neutral-400 hover:bg-neutral-900 rounded-lg transition-colors">
          <PanelLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Main Navigation */}
      <div className="px-3 py-2 space-y-1 overflow-y-auto flex-1 custom-scrollbar">
        <SidebarItem icon={<Plus />} label="New chat" />
        <SidebarItem icon={<Search />} label="Search chats" />
        
        <div className="pt-2 space-y-1">
          <SidebarItem icon={<ImageIcon />} label="Images" />
          <SidebarItem icon={<LayoutGrid />} label="Apps" />
          <SidebarItem icon={<Zap />} label="Codex" />
          <SidebarItem icon={<Box />} label="GPTs" />
        </div>

        {/* Projects Section */}
        <div className="mt-6">
          <p className="px-3 mb-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            Projects
          </p>
          <div className="space-y-1">
            <SidebarItem icon={<FolderPlus />} label="New project" />
            <SidebarItem icon={<Folder />} label="AI Agent" />
            <SidebarItem icon={<Folder />} label="Student Leaderboard" />
          </div>
        </div>

        {/* Your Chats Section */}
        <div className="mt-6">
          <p className="px-3 mb-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            Your chats
          </p>
          <div className="space-y-1 pb-4">
            {CHATS.map((chat) => (
              <SidebarItem key={chat} label={chat} />
            ))}
          </div>
        </div>
      </div>

      {/* Footer Profile */}
      <div className="p-3 border-t border-neutral-800">
        <button className="flex items-center gap-3 w-full px-3 py-2 hover:bg-neutral-900 rounded-xl transition-colors">
          <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white text-xs font-bold">
            TB
          </div>
          <div className="flex flex-col flex-1 text-left min-w-0">
            <span className="text-sm font-medium text-white truncate">TECH BRO</span>
            <span className="text-xs text-neutral-500 truncate">Go</span>
          </div>
        </button>
      </div>
    </div>
  );
}
