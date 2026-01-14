import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'YUV.AI Trends',
  description: 'Track trending topics in AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

