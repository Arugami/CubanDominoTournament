import { useState, useEffect } from 'react'
import { createGame, playTile, passTurn, getValidMoves, getCurrentPlayer } from './engine/game'
import { GameState } from './engine/types'
import { GameTable } from './components/game/GameTable'
import { PlayerHand } from './components/game/PlayerHand'
import { ScoreBoard } from './components/game/ScoreBoard'
import { GameControls } from './components/game/GameControls'
import { GameSetup, GameConfig } from './components/game/GameSetup'
import { LingoOverlay, LingoType } from './components/ui/LingoOverlay'
import { Toast, ToastType } from './components/ui/Toast'
import { LoadingTransition } from './components/ui/LoadingTransition'

import { soundManager } from './engine/audio'

function App() {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [selectedTile, setSelectedTile] = useState<string | null>(null)
  const [lingoState, setLingoState] = useState<{ type: LingoType, visible: boolean }>({ type: 'me-pegue', visible: false })
  const [toast, setToast] = useState<{ message: string, type: ToastType, visible: boolean }>({
    message: '',
    type: 'info',
    visible: false
  })
  const [loadingTransition, setLoadingTransition] = useState<{ visible: boolean, message: string }>({
    visible: false,
    message: ''
  })

  const currentPlayer = gameState ? getCurrentPlayer(gameState) : undefined
  const validMoves = gameState ? getValidMoves(gameState) : []
  const canPass = validMoves.length === 0

  const showToast = (message: string, type: ToastType = 'info') => {
    setToast({ message, type, visible: true })
  }

  const hideToast = () => {
    setToast(prev => ({ ...prev, visible: false }))
  }

  // Handle playing a tile (called from GameTable or inferred)
  const handlePlayTile = (tileId: string, end: 'left' | 'right') => {
    if (!gameState) return

    console.log('[handlePlayTile] Before play:', {
      currentPlayer: gameState.currentRound.currentPlayer,
      tileId,
      end
    })

    try {
      const newGameState = playTile(gameState, tileId, end)

      console.log('[handlePlayTile] After play:', {
        oldPlayer: gameState.currentRound.currentPlayer,
        newPlayer: newGameState.currentRound.currentPlayer,
        chainLength: newGameState.currentRound.chain.tiles.length
      })

      setGameState(newGameState)
      setSelectedTile(null)
      soundManager.playSlam() // THE SLAM!
    } catch (e) {
      console.error('[handlePlayTile] Error:', e)
      const errorMessage = e instanceof Error ? e.message : 'Invalid move'
      showToast(errorMessage, 'error')
    }
  }

  const handlePass = () => {
    if (!gameState) return
    try {
      const newGameState = passTurn(gameState)
      setGameState(newGameState)
      soundManager.playPass()
      showToast('Turn passed', 'info')
    } catch (error) {
      console.error('Cannot pass:', error)
      const errorMessage = error instanceof Error ? error.message : 'Cannot pass turn'
      showToast(errorMessage, 'error')
    }
  }

  const handleStartGame = (config: GameConfig) => {
    // Show loading transition
    setLoadingTransition({ visible: true, message: 'Starting game...' })

    try {
      // Brief delay for smooth transition
      setTimeout(() => {
        const newGame = createGame(config.playerNames, config.mode, config.targetScore)
        setGameState(newGame)
        setSelectedTile(null)
        setLingoState({ type: 'me-pegue', visible: false })

        // Hide loading transition
        setLoadingTransition({ visible: false, message: '' })
        showToast('Game started! Good luck!', 'success')

        // Try to play sound, but don't block game start if it fails
        try {
          soundManager.playClick()
        } catch (e) {
          console.warn('Audio start failed:', e)
        }
      }, 600)
    } catch (error) {
      console.error('Failed to start game:', error)
      setLoadingTransition({ visible: false, message: '' })
      showToast('Failed to start game. Please try again.', 'error')
    }
  }

  // Monitor game state for lingo events and turn timer
  useEffect(() => {
    if (!gameState || gameState.isFinished) return

    if (gameState.isFinished) {
      try {
        soundManager.playVictory()
      } catch (e) {
        console.warn('Audio victory failed:', e)
      }
      return
    }

    // Turn Timer Logic
    const checkTurnTimer = () => {
      const now = Date.now()
      const elapsed = (now - gameState.currentRound.turnStartTime) / 1000

      if (elapsed >= gameState.turnDuration) {
        // Time's up!
        if (canPass) {
          handlePass()
        } else {
          // Auto-play a random valid move
          const moves = getValidMoves(gameState)
          if (moves.length > 0) {
            const randomMove = moves[Math.floor(Math.random() * moves.length)]
            if (randomMove) {
              handlePlayTile(randomMove.tile.id, randomMove.end)
              showToast('Time\'s up! Auto-played tile.', 'info')
            }
          }
        }
      }
    }

    const timerInterval = setInterval(checkTurnTimer, 1000)
    return () => clearInterval(timerInterval)
  }, [gameState, canPass])

  // AI Logic
  useEffect(() => {
    if (!gameState || gameState.isFinished) return

    const currentPlayer = getCurrentPlayer(gameState)
    if (currentPlayer?.isBot) {
      // Small delay for realism
      const timer = setTimeout(() => {
        // Import dynamically to avoid circular dependencies if any (though ai.ts imports game.ts, so it's fine)
        // Actually, let's just use the imported function.
        // But wait, I need to import getBestMove first.
        // I'll add the import at the top later.

        // For now, let's assume I'll add the import.
        import('./engine/ai').then(({ getBestMove }) => {
          const move = getBestMove(gameState)
          if (move) {
            handlePlayTile(move.tile.id, move.end)
          } else {
            handlePass()
          }
        })
      }, 1500) // 1.5s delay

      return () => clearTimeout(timer)
    }
  }, [gameState?.currentRound.currentPlayer, gameState?.isFinished])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameState) return

      // ESC to deselect tile
      if (e.key === 'Escape' && selectedTile) {
        setSelectedTile(null)
        soundManager.playClick()
      }

      // N for New Game (when not in active game)
      if (e.key === 'n' && gameState.isFinished) {
        setGameState(null)
      }

      // P to Pass turn (when allowed)
      if (e.key === 'p' && canPass) {
        handlePass()
      }

      // 1-2 keys to play selected tile to left/right
      if (selectedTile && validMoves.length > 0) {
        if (e.key === '1' && validMoves.some(m => m.end === 'left')) {
          handlePlayTile(selectedTile, 'left')
        } else if (e.key === '2' && validMoves.some(m => m.end === 'right')) {
          handlePlayTile(selectedTile, 'right')
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameState, selectedTile, canPass, validMoves])

  const handleTileClick = (tileId: string) => {
    if (!gameState) return

    // If clicking the same tile, deselect it
    if (selectedTile === tileId) {
      setSelectedTile(null)
      soundManager.playClick()
      return
    }

    // If a tile is already selected, try to play it
    if (selectedTile) {
      // Logic to determine if we're clicking a valid end
      // For now, we rely on the GameTable to handle the end selection
      // But if we're just switching selection in hand:
      setSelectedTile(tileId)
      soundManager.playClick()
      return
    }

    // Select the tile
    setSelectedTile(tileId)
    soundManager.playClick()
  }

  const handleTileDragStart = (tileId: string) => {
    if (!gameState) return
    setSelectedTile(tileId)
  }

  const handleTileDragEnd = () => {
    // Don't clear selection immediately - wait for drop or explicit cancel
  }

  if (!gameState) {
    return <GameSetup onStartGame={handleStartGame} />
  }



  return (
    <div className="h-screen w-screen bg-cuban-navy flex flex-col p-4 gap-4 animate-fade-in">
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onClose={hideToast}
      />

      <LoadingTransition
        visible={loadingTransition.visible}
        message={loadingTransition.message}
        type="game-start"
      />

      <LingoOverlay
        type={lingoState.type}
        visible={lingoState.visible}
        onComplete={() => setLingoState(prev => ({ ...prev, visible: false }))}
      />

      {/* Header */}
      <header className="flex items-center justify-between px-2">
        <h1 className="text-3xl font-bold text-cuban-gold drop-shadow-[0_2px_8px_rgba(212,175,55,0.3)]">MyFicha</h1>
        <button
          onClick={() => setGameState(null)}
          className="px-5 py-2 brass-coin text-cuban-navy font-bold rounded-md text-sm"
        >
          New Game
        </button>
      </header>

      {/* Main game area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 min-h-0">
        {/* Sidebar - Scoreboard */}
        <div className="lg:col-span-1 space-y-4">
          <ScoreBoard
            players={gameState.players}
            currentPlayerId={gameState.currentRound.currentPlayer}
            targetScore={gameState.targetScore}
          />

          {/* Selected tile actions */}
          {selectedTile && (
            <div className="bg-cuban-emerald/20 rounded-lg p-4 space-y-2">
              <div className="text-cuban-gold text-sm font-semibold">Play Selected Tile</div>
              <div className="flex gap-2">
                <button
                  onClick={() => selectedTile && handlePlayTile(selectedTile, 'left')}
                  className="flex-1 px-3 py-2 bg-cuban-emerald text-cuban-navy font-semibold rounded hover:bg-cuban-emerald/80 transition-colors"
                >
                  ← Left <span className="text-xs opacity-70">(1)</span>
                </button>
                <button
                  onClick={() => selectedTile && handlePlayTile(selectedTile, 'right')}
                  className="flex-1 px-3 py-2 bg-cuban-emerald text-cuban-navy font-semibold rounded hover:bg-cuban-emerald/80 transition-colors"
                >
                  Right → <span className="text-xs opacity-70">(2)</span>
                </button>
              </div>
              <button
                onClick={() => setSelectedTile(null)}
                className="w-full px-3 py-1 text-cuban-gold/70 hover:text-cuban-gold text-sm"
              >
                Cancel <span className="text-xs opacity-60">(ESC)</span>
              </button>
            </div>
          )}

          {/* Keyboard shortcuts legend */}
          {!selectedTile && (
            <div className="bg-black/20 rounded-lg p-3 space-y-1.5">
              <div className="text-cuban-gold/70 text-xs font-semibold uppercase tracking-wider">Keyboard Shortcuts</div>
              <div className="space-y-1 text-[11px] text-cuban-cream/60">
                <div className="flex justify-between">
                  <span>Deselect tile</span>
                  <kbd className="px-1.5 py-0.5 bg-black/40 rounded text-cuban-gold/80 font-mono">ESC</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Pass turn</span>
                  <kbd className="px-1.5 py-0.5 bg-black/40 rounded text-cuban-gold/80 font-mono">P</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Play left/right</span>
                  <kbd className="px-1.5 py-0.5 bg-black/40 rounded text-cuban-gold/80 font-mono">1/2</kbd>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Game table */}
        <div className="lg:col-span-3 flex flex-col gap-4 min-h-0">
          <div className="flex-1 relative rounded-lg overflow-hidden border-2 border-cuban-tobacco/30">
            <GameTable
              gameState={gameState}
              selectedTileId={selectedTile}
              validMoves={validMoves}
              onTilePlayed={handlePlayTile}
              onPassTurn={handlePass}
            />
          </div>

          {/* Player hand */}
          {currentPlayer && (
            <PlayerHand
              tiles={currentPlayer.hand}
              onTileClick={handleTileClick}
              onTileDragStart={handleTileDragStart}
              onTileDragEnd={handleTileDragEnd}
              highlightedTiles={selectedTile ? [selectedTile] : []}
            />
          )}

          {/* Controls */}
          <GameControls canPass={canPass} onPass={handlePass} />
        </div>
      </div>

      {/* Game over overlay */}
      {gameState.isFinished && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-cuban-mahogany rounded-lg p-8 max-w-md text-center space-y-4">
            <h2 className="text-4xl font-bold text-cuban-gold">¡Game Over!</h2>
            <p className="text-2xl text-cuban-cream">
              {gameState.players.find((p) => p.id === gameState.winner)?.name} wins!
            </p>
            <button
              onClick={() => setGameState(null)}
              className="mt-4 px-6 py-3 bg-cuban-emerald text-cuban-navy font-bold rounded-lg hover:bg-cuban-gold transition-colors"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
