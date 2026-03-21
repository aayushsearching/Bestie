import { VercelV0Chat } from "@/components/ui/v0-ai-chat"
import AnoAI from "@/components/ui/animated-shader-background"
import { ChatSidebar } from "@/components/ui/sidebar"

export default function Home() {
  return (
    <div className="flex bg-black text-white min-h-screen">
      {/* Left Sidebar */}
      <ChatSidebar />

      {/* Main Content */}
      <main className="relative flex-1 flex flex-col items-center justify-center p-24 overflow-hidden">
        <AnoAI />
        <div className="relative z-10 w-full max-w-4xl">
          <VercelV0Chat />
        </div>
      </main>
    </div>
  )
}
