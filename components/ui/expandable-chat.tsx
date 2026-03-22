"use client";

import React, { useRef, useState } from "react";
import { X, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type ChatPosition = "bottom-right" | "bottom-left";
export type ChatSize = "sm" | "md" | "lg" | "xl" | "full";

const chatConfig = {
  dimensions: {
    sm: "sm:max-w-sm sm:max-h-[500px]",
    md: "sm:max-w-md sm:max-h-[600px]",
    lg: "sm:max-w-lg sm:max-h-[700px]",
    xl: "sm:max-w-xl sm:max-h-[800px]",
    full: "sm:w-full sm:h-full",
  },
  positions: {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
  },
  chatPositions: {
    "bottom-right": "sm:bottom-[calc(100%+12px)] sm:right-0",
    "bottom-left": "sm:bottom-[calc(100%+12px)] sm:left-0",
  },
  states: {
    open: "pointer-events-auto opacity-100 visible scale-100 translate-y-0",
    closed: "pointer-events-none opacity-0 invisible scale-95 translate-y-4",
  },
};

interface ExpandableChatProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: ChatPosition;
  size?: ChatSize;
  icon?: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
}

const ExpandableChat: React.FC<ExpandableChatProps> = ({
  className,
  position = "bottom-right",
  size = "md",
  icon,
  children,
  isOpen: propsIsOpen,
  onToggle,
  ...props
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const isOpen = propsIsOpen ?? internalIsOpen;
  const toggleChat = onToggle ?? (() => setInternalIsOpen(!internalIsOpen));

  return (
    <div
      className={cn(`fixed ${chatConfig.positions[position]} z-50 transition-all duration-300`, className)}
      {...props}
    >
      <div
        ref={chatRef}
        className={cn(
          "flex flex-col bg-[#0d0d0d] border border-neutral-800 sm:rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] sm:absolute sm:w-[400px] sm:h-[600px] fixed inset-0 w-full h-full sm:inset-auto",
          chatConfig.chatPositions[position],
          chatConfig.dimensions[size],
          isOpen ? chatConfig.states.open : chatConfig.states.closed,
          className,
        )}
      >
        {children}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-neutral-400 hover:text-white hover:bg-neutral-800 p-2 rounded-xl"
          onClick={toggleChat}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      <ExpandableChatToggle
        icon={icon}
        isOpen={isOpen}
        toggleChat={toggleChat}
      />
    </div>
  );
};

ExpandableChat.displayName = "ExpandableChat";

const ExpandableChatHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={cn("flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-[#0d0d0d]", className)}
    {...props}
  />
);

ExpandableChatHeader.displayName = "ExpandableChatHeader";

const ExpandableChatBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => <div className={cn("flex-grow overflow-y-auto bg-black/40 backdrop-blur-sm", className)} {...props} />;

ExpandableChatBody.displayName = "ExpandableChatBody";

const ExpandableChatFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => <div className={cn("border-t border-neutral-800 p-4 bg-[#0d0d0d]/80", className)} {...props} />;

ExpandableChatFooter.displayName = "ExpandableChatFooter";

interface ExpandableChatToggleProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  isOpen: boolean;
  toggleChat: () => void;
}

const ExpandableChatToggle: React.FC<ExpandableChatToggleProps> = ({
  className,
  icon,
  isOpen,
  toggleChat,
  ...props
}) => (
  <Button
    variant="default"
    onClick={toggleChat}
    className={cn(
      "w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 bg-white hover:bg-neutral-100 text-black",
      className,
    )}
    {...props}
  >
    {isOpen ? (
      <X className="h-6 w-6" />
    ) : (
      icon || <MessageCircle className="h-6 w-6" />
    )}
  </Button>
);

ExpandableChatToggle.displayName = "ExpandableChatToggle";

export {
  ExpandableChat,
  ExpandableChatHeader,
  ExpandableChatBody,
  ExpandableChatFooter,
};
