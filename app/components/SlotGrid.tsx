'use client'

interface SlotGridProps {
  gridValues: string[]
  isSpinning: boolean
  names: string[]
}

export default function SlotGrid({ gridValues, isSpinning, names }: SlotGridProps) {
  // Convert flat array to 3x3 grid
  const grid = []
  for (let i = 0; i < 3; i++) {
    grid.push(gridValues.slice(i * 3, (i + 1) * 3))
  }

  return (
    <div className="relative w-full max-w-xs">
      {/* Slot Grid */}
      <div className="grid grid-cols-3 gap-1 bg-casino-dark/80 backdrop-blur-sm p-4 rounded-lg border-2 border-casino-gold/50">
        {grid.map((row, rowIndex) =>
          row.map((value, colIndex) => {
            const isWinningRow = rowIndex === 1 // Center row
            
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  relative h-16 flex items-center justify-center text-sm font-bold border border-casino-gold/30 rounded-md overflow-hidden
                  ${isSpinning ? 'bg-casino-red/20' : 'bg-casino-dark/50'}
                  ${isWinningRow ? 'ring-2 ring-casino-gold ring-opacity-70' : ''}
                  transition-all duration-300
                `}
              >
                {/* Spinning Effect Background */}
                {isSpinning && (
                  <div className="absolute inset-0 bg-gradient-to-b from-casino-gold/20 via-casino-red/20 to-casino-purple/20 animate-slot-spin-fast"></div>
                )}
                
                {/* Main Content */}
                <div className={`
                  relative z-10 flex items-center justify-center w-full h-full
                  ${isSpinning ? 'animate-reel-spin' : ''}
                  transition-all duration-300
                `}>
                  <span className={`
                    font-bold text-center select-none
                    ${isSpinning ? 
                      'text-transparent bg-clip-text bg-gradient-to-b from-white via-casino-gold to-white animate-slot-blur' : 
                      isWinningRow ? 'text-casino-gold font-extrabold' : 'text-white'
                    }
                    transition-all duration-300
                  `}>
                    {isSpinning ? '🎰' : value}
                  </span>
                </div>

                {/* Slot Machine Lines Effect */}
                {isSpinning && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-casino-gold/10 to-transparent animate-slot-spin-slow opacity-60"></div>
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-casino-gold/50 animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-casino-gold/50 animate-pulse"></div>
                  </>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Center Row Indicator */}
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-8">
        <div className="flex items-center">
          <div className="w-6 h-0.5 bg-casino-gold"></div>
          <div className="w-2 h-2 bg-casino-gold rounded-full ml-1"></div>
        </div>
      </div>
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-8">
        <div className="flex items-center">
          <div className="w-2 h-2 bg-casino-gold rounded-full mr-1"></div>
          <div className="w-6 h-0.5 bg-casino-gold"></div>
        </div>
      </div>

      {/* Winning Line Label */}
      <div className="absolute -left-16 top-1/2 transform -translate-y-1/2">
        <div className="text-xs text-casino-gold font-bold writing-mode-vertical">
          WIN LINE
        </div>
      </div>

      {/* Empty State */}
      {names.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-casino-dark/80 backdrop-blur-sm rounded-lg">
          <div className="text-center text-casino-gold/50">
            <div className="text-4xl mb-2">🎰</div>
            <div className="text-sm">Add names to play!</div>
          </div>
        </div>
      )}
    </div>
  )
}
