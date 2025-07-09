'use client'

import { useState, useCallback, useEffect } from 'react'

export type GameMode = 'single' | 'triple'

export interface ResultData {
  show: boolean
  type: 'single' | 'jackpot' | 'triple' | 'tripleJackpot'
  winner?: string
  winners?: string[]
  message: string
}

export function useSlotMachine() {
  const [names, setNames] = useState<string[]>([])
  const [gameMode, setGameMode] = useState<GameMode>('single')
  const [isSpinning, setIsSpinning] = useState(false)
  const [lastWinner, setLastWinner] = useState<string | null>(null)
  const [lastWinners, setLastWinners] = useState<string[]>([])
  const [gridValues, setGridValues] = useState<string[]>(Array(9).fill('???'))
  const [winnerText, setWinnerText] = useState('🎰 Ready to Play!')
  const [resultData, setResultData] = useState<ResultData>({
    show: false,
    type: 'single',
    message: ''
  })

  // Update grid display when names change
  const updateGridDisplay = useCallback((nameList: string[]) => {
    if (nameList.length === 0) {
      setGridValues(Array(9).fill('???'))
      return
    }

    // Fill grid with random names
    const newGrid = Array(9).fill('').map(() => {
      const randomName = nameList[Math.floor(Math.random() * nameList.length)]
      return randomName
    })
    setGridValues(newGrid)
  }, [])

  // Add default names on mount
  useEffect(() => {
    const defaultNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank']
    setNames(defaultNames)
    updateGridDisplay(defaultNames)
    setWinnerText('🎰 Ready to Play!')
  }, [updateGridDisplay])

  // Add name
  const addName = useCallback((name: string) => {
    const trimmedName = name.trim()
    if (trimmedName && !names.includes(trimmedName)) {
      const newNames = [...names, trimmedName]
      setNames(newNames)
      updateGridDisplay(newNames)
      setWinnerText('Ready to play!')
      return true
    }
    return false
  }, [names, updateGridDisplay])

  // Remove name
  const removeName = useCallback((nameToRemove: string) => {
    const newNames = names.filter((name: string) => name !== nameToRemove)
    setNames(newNames)
    updateGridDisplay(newNames)
  }, [names, updateGridDisplay])

  // Clear all names
  const clearNames = useCallback(() => {
    setNames([])
    setLastWinner(null)
    setLastWinners([])
    setGridValues(Array(9).fill('???'))
    setWinnerText('Add names to play!')
    setResultData({ show: false, type: 'single', message: '' })
  }, [])

  // Remove winner
  const removeWinner = useCallback(() => {
    if (gameMode === 'single' && lastWinner) {
      removeName(lastWinner)
      setLastWinner(null)
      setWinnerText('Ready to play!')
      setResultData({ show: false, type: 'single', message: '' })
    } else if (gameMode === 'triple' && lastWinners.length > 0) {
      lastWinners.forEach(winner => removeName(winner))
      setLastWinners([])
      setWinnerText('Ready to play!')
      setResultData({ show: false, type: 'single', message: '' })
    }
  }, [gameMode, lastWinner, lastWinners, removeName])

  // Play sound effect
  const playSound = useCallback((frequencies: number[], volumes: number[], duration = 0.5) => {
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      
      frequencies.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.value = freq
        oscillator.type = 'sine'

        gainNode.gain.setValueAtTime(0, audioContext.currentTime)
        gainNode.gain.linearRampToValueAtTime(volumes[index] || 0.1, audioContext.currentTime + 0.1)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)

        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + duration)
      })
    } catch {
      // Silently fail if audio context is not available
    }
  }, [])

  // Check winning patterns
  const checkWinningPatterns = useCallback((winners: string[]) => {
    const patterns = {
      jackpot: false,
      line: false,
      winningName: null as string | null,
      lineWinners: [] as string[]
    }

    // Only check the center row (middle horizontal line: cells 3, 4, 5)
    const centerRow = [3, 4, 5]
    const [a, b, c] = centerRow
    
    if (winners[a] === winners[b] && winners[b] === winners[c] && winners[a] !== '???') {
      patterns.line = true
      patterns.lineWinners = [winners[a], winners[b], winners[c]]
      patterns.winningName = winners[a]
      patterns.jackpot = true // If all three in center row match, it's a jackpot
    }

    return patterns
  }, [])

  // Check for win
  const checkForWin = useCallback((winners: string[]) => {
    if (gameMode === 'single') {
      // Single winner mode - center cell (index 4) determines the winner
      const winner = winners[4]
      const patterns = checkWinningPatterns(winners)

      if (patterns.jackpot) {
        setLastWinner(winner)
        setWinnerText('🎰 JACKPOT! 🎰')
        setResultData({
          show: true,
          type: 'jackpot',
          winner,
          message: 'Center cell winner!'
        })
        // Play jackpot sound
        const notes = [261, 329, 392, 523, 659, 784, 1047]
        notes.forEach((freq, index) => {
          setTimeout(() => {
            playSound([freq], [0.3], 0.3)
          }, index * 200)
        })
      } else {
        setLastWinner(winner)
        setWinnerText(`🎯 Winner: ${winner}`)
        setResultData({
          show: true,
          type: 'single',
          winner,
          message: 'Selected from the center cell!'
        })
        playSound([523, 659, 784], [0.2, 0.2, 0.2], 0.5)
      }
    } else {
      // Triple winners mode - check for center row pattern only
      const patterns = checkWinningPatterns(winners)

      if (patterns.line) {
        setLastWinners(patterns.lineWinners)
        setWinnerText('🎰 Center Row Winners!')
        setResultData({
          show: true,
          type: 'tripleJackpot',
          winners: patterns.lineWinners,
          message: 'All center row cells match! INCREDIBLE!'
        })
        // Play jackpot sound
        const notes = [261, 329, 392, 523, 659, 784, 1047]
        notes.forEach((freq, index) => {
          setTimeout(() => {
            playSound([freq], [0.3], 0.3)
          }, index * 200)
        })
      } else {
        // Show center winner as fallback
        const winner = winners[4]
        setLastWinner(winner)
        setWinnerText(`🎯 Winner: ${winner}`)
        setResultData({
          show: true,
          type: 'single',
          winner,
          message: 'Selected from the center cell!'
        })
        playSound([523, 659, 784], [0.2, 0.2, 0.2], 0.5)
      }
    }
  }, [gameMode, checkWinningPatterns, playSound])

  // Animate cell during spin
  const startCellAnimation = useCallback(() => {
    if (names.length === 0) return

    const animationInterval = setInterval(() => {
      if (!isSpinning) {
        clearInterval(animationInterval)
        return
      }
      // Rapidly change the displayed names (faster for more realistic slot effect)
      const newGrid = Array(9).fill('').map(() => {
        const randomName = names[Math.floor(Math.random() * names.length)]
        return randomName
      })
      setGridValues(newGrid)
    }, 50) // Changed from 100ms to 50ms for faster spinning effect

    return animationInterval
  }, [names, isSpinning])

  // Pull lever (start spinning)
  const pullLever = useCallback(() => {
    if (isSpinning || names.length < 2) return

    setIsSpinning(true)
    setWinnerText('🎰 Spinning...')
    setResultData({ show: false, type: 'single', message: '' })

    // Play spinning sound (longer duration for extended spin)
    playSound([200, 250, 300], [0.1, 0.1, 0.1], 3.5)

    // Start animation
    const animationInterval = startCellAnimation()

    // Stop spinning after longer delay for more realistic effect
    setTimeout(() => {
      setIsSpinning(false)
      if (animationInterval) clearInterval(animationInterval)

      // Set final values
      const finalGrid = Array(9).fill('').map(() => {
        if (names.length > 0) {
          const finalName = names[Math.floor(Math.random() * names.length)]
          return finalName
        }
        return '???'
      })
      setGridValues(finalGrid)

      // Check for win after a brief delay
      setTimeout(() => {
        checkForWin(finalGrid)
      }, 500)
    }, 3500) // Extended from 3000ms to 3500ms for more dramatic effect
  }, [isSpinning, names, playSound, startCellAnimation, checkForWin])

  return {
    names,
    gameMode,
    isSpinning,
    lastWinner,
    lastWinners,
    gridValues,
    winnerText,
    resultData,
    addName,
    removeName,
    clearNames,
    removeWinner,
    setGameMode,
    pullLever
  }
}
