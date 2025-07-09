'use client'

interface ControlButtonsProps {
  onSpin: () => void
  onClear: () => void
  onRemoveWinner: () => void
  canSpin: boolean
  canClear: boolean
  canRemoveWinner: boolean
  isSpinning: boolean
}

export default function ControlButtons({
  onSpin,
  onClear,
  onRemoveWinner,
  canSpin,
  canClear,
  canRemoveWinner,
  isSpinning
}: ControlButtonsProps) {
  return (
    <div className="space-y-4">
      <div className="bg-casino-dark/50 backdrop-blur-sm p-6 rounded-xl border border-casino-gold/30">
        <h3 className="text-xl font-bold text-casino-gold mb-4">Controls</h3>
        
        {/* Spin Button */}
        <button
          onClick={onSpin}
          disabled={!canSpin}
          className={`
            w-full px-6 py-4 text-lg font-bold rounded-lg shadow-lg transition-all duration-300 mb-3
            ${canSpin 
              ? 'bg-gradient-to-r from-casino-red to-casino-darkRed text-white hover:scale-105 hover:shadow-xl active:scale-95' 
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }
            ${isSpinning ? 'animate-pulse' : ''}
          `}
        >
          {isSpinning ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Spinning...
            </div>
          ) : (
            '🎰 PULL LEVER!'
          )}
        </button>

        {/* Secondary Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onRemoveWinner}
            disabled={!canRemoveWinner}
            className={`
              px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300
              ${canRemoveWinner 
                ? 'bg-gradient-to-r from-casino-purple to-casino-dark text-white hover:scale-105' 
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            Remove Winner
          </button>
          
          <button
            onClick={onClear}
            disabled={!canClear}
            className={`
              px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300
              ${canClear 
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:scale-105' 
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            Clear All
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-4 text-xs text-casino-gold/70 space-y-1">
          {!canSpin && (
            <p>💡 Need at least 2 names to spin the machine</p>
          )}
          {canSpin && !isSpinning && (
            <p>🎯 Click the lever or use the button above to spin!</p>
          )}
          {isSpinning && (
            <p>🎲 The reels are spinning... Good luck!</p>
          )}
        </div>
      </div>
    </div>
  )
}
