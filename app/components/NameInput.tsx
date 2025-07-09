'use client'

import { useState } from 'react'

interface NameInputProps {
  onAddName: (name: string) => void
  disabled?: boolean
}

export default function NameInput({ onAddName, disabled = false }: NameInputProps) {
  const [nameInput, setNameInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (nameInput.trim()) {
      onAddName(nameInput.trim())
      setNameInput('')
    }
  }

  return (
    <div className="bg-casino-dark/50 backdrop-blur-sm p-6 rounded-xl border border-casino-gold/30">
      <h3 className="text-xl font-bold text-casino-gold mb-4">Add Names</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Enter a name..."
            disabled={disabled}
            className="w-full px-4 py-3 bg-casino-dark/70 border border-casino-gold/50 rounded-lg text-white placeholder-casino-gold/50 focus:outline-none focus:ring-2 focus:ring-casino-gold focus:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
        <button
          type="submit"
          disabled={disabled || !nameInput.trim()}
          className="w-full px-6 py-3 bg-gradient-to-r from-casino-gold to-casino-lightGold text-casino-dark font-bold rounded-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          Add Name
        </button>
      </form>
      <div className="mt-4 text-sm text-casino-gold/70">
        <p>💡 <strong>Tip:</strong> Add at least 2 names to spin the slot machine!</p>
      </div>
    </div>
  )
}
