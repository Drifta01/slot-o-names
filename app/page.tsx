'use client'

import SlotMachine from './components/SlotMachine'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="text-center py-8">
        <h1 className="text-4xl md:text-6xl font-bold text-casino-gold mb-4 text-shadow-lg">
          🎰 Slot Machine Name Picker
        </h1>
        <p className="text-lg text-white opacity-80">
          Pull the lever and let luck decide the winner!
        </p>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-8">
        <SlotMachine />
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-white opacity-60">
        <p>&copy; 2025 Slot Machine Name Picker - Built with ❤️</p>
      </footer>
    </div>
  )
}
