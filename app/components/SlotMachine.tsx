'use client'

import GameModeSelector from './GameModeSelector'
import NameInput from './NameInput'
import SlotGrid from './SlotGrid'
import ControlButtons from './ControlButtons'
import ResultDisplay from './ResultDisplay'
import { useSlotMachine } from '../hooks/useSlotMachine'

export default function SlotMachine() {
  const {
    names,
    gameMode,
    isSpinning,
    lastWinner,
    lastWinners,
    gridValues,
    winnerText,
    resultData,
    addName,
    clearNames,
    removeWinner,
    setGameMode,
    pullLever
  } = useSlotMachine()

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Panel - Controls */}
      <div className="space-y-6">
        {/* Game Mode Selector */}
        <GameModeSelector 
          gameMode={gameMode} 
          setGameMode={setGameMode}
          disabled={isSpinning}
        />

        {/* Name Input */}
        <NameInput 
          onAddName={addName}
          disabled={isSpinning}
        />

        {/* Control Buttons */}
        <ControlButtons
          onSpin={pullLever}
          onClear={clearNames}
          onRemoveWinner={removeWinner}
          canSpin={names.length >= 2 && !isSpinning}
          canClear={names.length > 0}
          canRemoveWinner={
            (gameMode === 'single' && !!lastWinner) || 
            (gameMode === 'triple' && lastWinners.length > 0)
          }
          isSpinning={isSpinning}
        />

        {/* Names List */}
        <div className="bg-casino-dark/50 backdrop-blur-sm p-6 rounded-xl border border-casino-gold/30">
          <h3 className="text-xl font-bold text-casino-gold mb-4">
            Names in machine ({names.length}):
          </h3>
          <div className="flex flex-wrap gap-2">
            {names.map((name, index) => (
              <span
                key={index}
                className={`name-tag ${
                  (gameMode === 'single' && name === lastWinner) ||
                  (gameMode === 'triple' && lastWinners.includes(name))
                    ? 'winner'
                    : ''
                }`}
              >
                {name}
              </span>
            ))}
            {names.length === 0 && (
              <p className="text-casino-gold/70 italic">No names added yet...</p>
            )}
          </div>
        </div>
      </div>

      {/* Center Panel - Slot Machine */}
      <div className="flex flex-col items-center space-y-6">
        {/* Machine Container */}
        <div className="relative">
          {/* Machine Body */}
          <div className="w-80 h-96 bg-gradient-to-br from-casino-red to-casino-darkRed rounded-2xl border-4 border-casino-gold shadow-2xl animate-machine-glow">
            {/* Machine Top */}
            <div className="h-20 bg-gradient-to-br from-casino-gold to-casino-lightGold rounded-t-xl border-b-2 border-casino-red flex items-center justify-between px-6">
              {/* Lights */}
              <div className="flex gap-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`
                      w-4 h-4 rounded-full shadow-lg transition-all duration-300
                      ${isSpinning 
                        ? 'bg-red-500 animate-blink shadow-red-500/50' 
                        : 'bg-red-400/70 shadow-red-400/30'
                      }
                    `}
                    style={{ 
                      animationDelay: isSpinning ? `${i * 0.2}s` : '0s',
                      boxShadow: isSpinning ? '0 0 15px rgba(239, 68, 68, 0.8)' : '0 0 5px rgba(239, 68, 68, 0.4)'
                    }}
                  />
                ))}
              </div>
              
              {/* Jackpot Display */}
              <div className="text-center">
                <span className="block text-lg font-bold text-casino-red">JACKPOT</span>
                <div className="text-xs text-casino-dark font-bold animate-jackpot-flash">
                  💰 $999,999 💰
                </div>
              </div>
            </div>

            {/* Machine Body - Slot Grid */}
            <div className="p-6 h-64 flex flex-col items-center justify-center">
              <SlotGrid
                gridValues={gridValues}
                isSpinning={isSpinning}
                names={names}
              />
              
              {/* Winner Display */}
              <div className="mt-4 text-center">
                <div className="bg-casino-dark/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-casino-gold/50">
                  <div className="text-casino-gold font-bold text-sm">
                    {winnerText}
                  </div>
                </div>
              </div>
            </div>

            {/* Machine Bottom */}
            <div className="h-12 bg-gradient-to-br from-casino-gold to-casino-lightGold rounded-b-xl border-t-2 border-casino-red flex items-center justify-center">
              <div className="text-center">
                <div className="font-bold text-casino-red text-sm">LUCKY PICKER</div>
                <div className="text-xs text-casino-dark opacity-80">SN: LP-2025</div>
              </div>
            </div>
          </div>

          {/* Side Handle */}
          <button
            onClick={pullLever}
            disabled={names.length < 2 || isSpinning}
            className={`
              absolute -right-12 top-1/2 transform -translate-y-1/2 w-8 h-24 
              bg-gradient-to-br from-casino-purple to-casino-dark rounded-full 
              border-2 border-casino-gold cursor-pointer transition-all duration-300 
              hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed
              ${isSpinning ? 'animate-pulse rotate-12' : 'hover:rotate-3'}
              shadow-lg hover:shadow-xl
            `}
          >
            <div className={`
              absolute top-4 left-1/2 w-12 h-6 
              bg-gradient-to-br from-casino-gold to-casino-lightGold rounded-full 
              transform -translate-x-1/2 border border-casino-red transition-all duration-300
              ${isSpinning ? 'animate-bounce' : ''}
            `} />
            <div className={`
              absolute -bottom-4 left-1/2 w-10 h-10 
              bg-gradient-to-br from-casino-gold to-casino-red rounded-full 
              transform -translate-x-1/2 border-2 border-casino-dark transition-all duration-300
              ${isSpinning ? 'animate-pulse' : 'hover:scale-110'}
            `} />
          </button>
        </div>
      </div>

      {/* Right Panel - Results */}
      <div className="space-y-6">
        <ResultDisplay resultData={resultData} />
      </div>
    </div>
  )
}
