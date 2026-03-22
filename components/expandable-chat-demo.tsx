"use client"

import { useState, FormEvent } from "react"
import { Send, Bot, Paperclip, Mic, CornerDownLeft, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat-bubble"
import { ChatInput } from "@/components/ui/chat-input"
import {
  ExpandableChat,
  ExpandableChatHeader,
  ExpandableChatBody,
  ExpandableChatFooter,
} from "@/components/ui/expandable-chat"
import { ChatMessageList } from "@/components/ui/chat-message-list"

export function ExpandableChatDemo({ initialOpen = false }: { initialOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "Hello! How can I help you today?",
      sender: "ai",
    },
    {
      id: 2,
      content: "I have a question about the component library.",
      sender: "user",
    },
    {
      id: 3,
      content: "Sure! I'd be happy to help. What would you like to know?",
      sender: "ai",
    },
  ])

  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = {
      id: messages.length + 1,
      content: input,
      sender: "user",
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          content: "This is a premium AI response to your message. I'm dynamically updating the UI with smooth auto-scrolling and transitions.",
          sender: "ai",
        },
      ])
      setIsLoading(false)
    }, 1200)
  }

  return (
    <ExpandableChat
      size="md"
      position="bottom-right"
      isOpen={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
      icon={<Sparkles className="h-6 w-6 text-black fill-current" />}
      className="z-50"
    >
      <ExpandableChatHeader className="flex-col text-center justify-center gap-1 border-neutral-800">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-1">
            <Bot className="h-6 w-6 text-black" />
        </div>
        <h1 className="text-xl font-bold text-white leading-tight">Raghav AI ✨</h1>
        <p className="text-xs text-neutral-400 font-medium tracking-wide">
          PERSONAL ASSISTANT
        </p>
      </ExpandableChatHeader>

      <ExpandableChatBody className="bg-neutral-950/40 backdrop-blur-xl">
        <ChatMessageList>
          {messages.map((message) => (
              <ChatBubble
                key={message.id}
                variant={message.sender === "user" ? "sent" : "received"}
              >
                <ChatBubbleAvatar
                  className="h-8 w-8 shrink-0 shadow-inner"
                  fallback={message.sender === "user" ? "U" : "R"}
                />
                <ChatBubbleMessage
                  variant={message.sender === "user" ? "sent" : "received"}
                  className={message.sender === "user" ? "bg-white text-black font-medium" : "bg-neutral-800 text-neutral-200"}
                >
                  {message.content}
                </ChatBubbleMessage>
              </ChatBubble>
          ))}

          {isLoading && (
              <ChatBubble variant="received">
                <ChatBubbleAvatar
                  className="h-8 w-8 shrink-0"
                  fallback="R"
                />
                <ChatBubbleMessage isLoading className="bg-neutral-800" />
              </ChatBubble>
          )}
        </ChatMessageList>
      </ExpandableChatBody>

      <ExpandableChatFooter className="border-neutral-800 bg-[#0d0d0d]">
        <form
          onSubmit={handleSubmit}
          className="relative rounded-2xl border border-neutral-800 bg-neutral-900 focus-within:ring-1 focus-within:ring-white/20 p-2 shadow-inner"
        >
          <ChatInput
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e as unknown as FormEvent);
              }
            }}
            placeholder="Type your message..."
            className="min-h-12 resize-none rounded-xl bg-transparent border-0 p-3 shadow-none focus-visible:ring-0 text-white placeholder:text-neutral-500"
          />
          <div className="flex items-center p-2 pt-0 justify-between">
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                type="button"
                className="text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg h-8 w-8 transition-colors"
              >
                <Paperclip className="size-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                type="button"
                className="text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg h-8 w-8 transition-colors"
              >
                <Mic className="size-4" />
              </Button>
            </div>
            <Button 
                type="submit" 
                size="sm" 
                className="ml-auto gap-1.5 h-8 rounded-lg bg-white text-black hover:bg-neutral-100 font-bold transition-transform active:scale-95"
            >
              Send
              <CornerDownLeft className="size-3.5" />
            </Button>
          </div>
        </form>
      </ExpandableChatFooter>
    </ExpandableChat>
  )
}
