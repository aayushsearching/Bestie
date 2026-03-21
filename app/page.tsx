import { VercelV0Chat } from "@/components/ui/v0-ai-chat"
import AnoAI from "@/components/ui/animated-shader-background"

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-24 bg-black text-white">
      <AnoAI />
      <div className="relative z-10 w-full max-w-4xl">
        <VercelV0Chat />
      </div>
    </main>
  )
}
