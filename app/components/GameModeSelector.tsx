'use client'

import { GameMode } from '../hooks/useSlotMachine'

interface GameModeSelectorProps {
  gameMode: GameMode
  setGameMode: (mode: GameMode) => void
  disabled: boolean
}

export default function GameModeSelector({ gameMode, setGameMode, disabled }: GameModeSelectorProps) {
  return (
    <div className="bg-casino-dark/50 backdrop-blur-sm p-6 rounded-xl border border-casino-gold/30">
      <h4 className="text-xl font-bold text-casino-gold mb-4 text-center">Game Mode:</h4>
      <div className="space-y-3">
        <label className="flex items-center p-3 rounded-lg border border-casino-gold/20 hover:border-casino-gold/50 cursor-pointer transition-all duration-300 hover:bg-casino-gold/10">
          <input
            type="radio"
            name="gameMode"
            value="single"
            checked={gameMode === 'single'}
            onChange={(e) => setGameMode(e.target.value as GameMode)}
            disabled={disabled}
            className="mr-3 w-4 h-4 text-casino-gold"
          />
          <span className="text-white font-medium">🎯 Single Winner</span>
        </label>
        <label className="flex items-center p-3 rounded-lg border border-casino-gold/20 hover:border-casino-gold/50 cursor-pointer transition-all duration-300 hover:bg-casino-gold/10">
          <input
            type="radio"
            name="gameMode"
            value="triple"
            checked={gameMode === 'triple'}
            onChange={(e) => setGameMode(e.target.value as GameMode)}
            disabled={disabled}
            className="mr-3 w-4 h-4 text-casino-gold"
          />
          <span className="text-white font-medium">🎰 Triple Winners</span>
        </label>
      </div>
    </div>
  )
}
