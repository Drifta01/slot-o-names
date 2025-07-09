'use client'

export interface ResultData {
  show: boolean
  type: 'single' | 'jackpot' | 'triple' | 'tripleJackpot'
  winner?: string
  winners?: string[]
  message: string
}

interface ResultDisplayProps {
  resultData: ResultData
}

export default function ResultDisplay({ resultData }: ResultDisplayProps) {
  if (!resultData.show) {
    return (
      <div className="bg-casino-dark/50 backdrop-blur-sm p-6 rounded-xl border border-casino-gold/30">
        <h3 className="text-xl font-bold text-casino-gold mb-4">Results</h3>
        <div className="text-center text-casino-gold/50 py-8">
          <div className="text-4xl mb-2">🎰</div>
          <div>Pull the lever to see results!</div>
        </div>
      </div>
    )
  }

  const getResultIcon = () => {
    switch (resultData.type) {
      case 'jackpot':
        return '🎰💰'
      case 'tripleJackpot':
        return '🎰🎰🎰'
      case 'triple':
        return '🎯🎯🎯'
      default:
        return '🎯'
    }
  }

  const getResultTitle = () => {
    switch (resultData.type) {
      case 'jackpot':
        return 'JACKPOT!'
      case 'tripleJackpot':
        return 'TRIPLE JACKPOT!'
      case 'triple':
        return 'Triple Winners!'
      default:
        return 'Winner!'
    }
  }

  return (
    <div className="space-y-6">
      {/* Current Result */}
      <div className={`
        bg-casino-dark/50 backdrop-blur-sm p-6 rounded-xl border border-casino-gold/30 animate-result-appear
        ${(resultData.type === 'jackpot' || resultData.type === 'tripleJackpot') ? 'animate-jackpot' : ''}
      `}>
        <h3 className="text-xl font-bold text-casino-gold mb-4">
          {getResultIcon()} {getResultTitle()}
        </h3>
        
        <div className="text-center space-y-4">
          {/* Winner(s) Display */}
          {/* <div className="space-y-2">
            {resultData.winner && (
              <div className={`
                inline-block px-4 py-2 rounded-lg font-bold text-lg
                ${(resultData.type === 'jackpot') 
                  ? 'bg-gradient-to-r from-casino-gold to-casino-lightGold text-casino-dark animate-glow' 
                  : 'bg-casino-red text-white'
                }
              `}>
                🏆 {resultData.winner}
              </div>
            )}
            
            {resultData.winners && resultData.winners.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center">
                {resultData.winners.map((winner, index) => (
                  <div
                    key={index}
                    className={`
                      px-3 py-2 rounded-lg font-bold
                      ${(resultData.type === 'tripleJackpot') 
                        ? 'bg-gradient-to-r from-casino-gold to-casino-lightGold text-casino-dark animate-glow' 
                        : 'bg-casino-red text-white'
                      }
                    `}
                  >
                    🏆 {winner}
                  </div>
                ))}
              </div>
            )}
          </div> */}
          
          {/* Result Message */}
          <div className="text-casino-gold/80 text-sm">
            {resultData.message}
          </div>
        </div>
      </div>

      {/* Game Instructions */}
      <div className="bg-casino-dark/50 backdrop-blur-sm p-4 rounded-xl border border-casino-gold/30">
        <h4 className="text-lg font-bold text-casino-gold mb-3">How to Play</h4>
        <div className="text-sm text-casino-gold/70 space-y-2">
          <div>🎯 <strong>Single Mode:</strong> Winner is picked from the center cell</div>
          <div>🎰 <strong>Triple Mode:</strong> Three winners from the center row</div>
          <div>💰 <strong>Jackpot:</strong> When all center row cells match the same name!</div>
          <div>🎮 Add at least 2 names and pull the lever to start</div>
        </div>
      </div>
    </div>
  )
}
