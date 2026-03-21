import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'V0 Chat Demo',
  description: 'Integrating an existing React component',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-black text-white">{children}</body>
    </html>
  )
}
