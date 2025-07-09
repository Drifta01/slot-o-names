import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Slot-O-Names | 3x3 Slot Machine Name Picker',
  description: 'A fun 3x3 grid slot machine for randomly selecting names with casino-style animations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-casino-dark via-casino-purple to-casino-dark min-h-screen">
        {children}
      </body>
    </html>
  )
}
