import { VercelV0Chat } from "@/components/ui/v0-ai-chat"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-black text-white">
      <VercelV0Chat />
    </main>
  )
}
