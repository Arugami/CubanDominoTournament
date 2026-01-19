/**
 * GameTable - Main game board component
 * Renders the Cuban-themed domino table with chain visualization
 */

import { useState, useEffect, useRef, useMemo } from 'react'
import { calculateLayout, DEFAULT_CONFIG } from '@/engine/layout'
import { GameState, ValidMove } from '@/engine/types'
import { soundManager } from '@/engine/audio'
import { DominoTile } from './DominoTile'
import { TurnTimer } from './TurnTimer'

interface GameTableProps {
  gameState: GameState
  selectedTileId?: string | null
  validMoves?: ValidMove[]
  onTilePlayed?: (tileId: string, end: 'left' | 'right') => void
  onPassTurn?: () => void
}

export function GameTable({ gameState, selectedTileId, validMoves = [], onTilePlayed, onPassTurn }: GameTableProps) {
  const [lastPlacedIndex, setLastPlacedIndex] = useState<number | null>(null)
  const [dragOverEnd, setDragOverEnd] = useState<'left' | 'right' | null>(null)
  const prevChainLengthRef = useRef(gameState.currentRound.chain.tiles.length)

  const containerRef = useRef<HTMLDivElement>(null)
  const [boardSize, setBoardSize] = useState({ width: 800, height: 600 })

  // Resize observer for board dimensions
  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) {
        setBoardSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        })
      }
    })

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  // Calculate layout
  const { positions, leftTip, rightTip } = useMemo(() => {
    return calculateLayout(gameState.currentRound.chain, {
      ...DEFAULT_CONFIG,
      boardWidth: boardSize.width,
      boardHeight: boardSize.height
    })
  }, [gameState.currentRound.chain, boardSize])

  // Track when a new tile is placed to trigger slam animation
  useEffect(() => {
    const currentLength = gameState.currentRound.chain.tiles.length
    const prevLength = prevChainLengthRef.current

    if (currentLength > prevLength) {
      soundManager.playSlam()
      // Animation logic simplified for now
      setLastPlacedIndex(currentLength - 1) // Just a trigger, index might not match perfectly with snake but good enough for visual pop
      const timer = setTimeout(() => setLastPlacedIndex(null), 300)
      prevChainLengthRef.current = currentLength
      return () => clearTimeout(timer)
    }
    prevChainLengthRef.current = currentLength
  }, [gameState.currentRound.chain.tiles.length])

  const currentPlayer = gameState.players.find(
    (p) => p.id === gameState.currentRound.currentPlayer
  )

  const canPlayLeft = validMoves.some(m => m.end === 'left')
  const canPlayRight = validMoves.some(m => m.end === 'right')
  const hasSelection = !!selectedTileId
  const isBlocked = validMoves.length === 0

  // Find tip positions for drop zones
  // We need to find the "next" position for left and right ends.
  // The layout engine returns positions for EXISTING tiles.
  // We can infer the drop zone position by "simulating" a placement?
  // Or we can expose the `ChainEndState` from layout engine?
  // `calculateLayout` returns a Map. It doesn't return the end states.
  // I should update `layout.ts` to return end states or calculated drop zones.
  // OR, I can just look at the extreme tiles and guess? No, snake layout is complex.

  // Let's update `layout.ts` to return `leftTip` and `rightTip` positions?
  // Or I can just calculate them here by calling `placeTile` hypothetically?
  // But `placeTile` is internal.

  // For now, let's just center the board.
  const centerX = boardSize.width / 2
  const centerY = boardSize.height / 2

  return (
    <div
      className="relative w-full h-full rounded-lg overflow-hidden"
      role="region"
      aria-label="Game table"
    >
      {/* Wood table border/frame */}
      <div className="absolute inset-0 wood-texture" />

      {/* Inner felt surface */}
      <div className="absolute inset-4 rounded-sm overflow-hidden" style={{
        background: 'linear-gradient(135deg, #0A4439 0%, #083832 100%)',
        boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Subtle felt texture noise */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`
        }} />

        {/* Warm vignette spotlight effect */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0, 0, 0, 0.4) 100%)'
        }} />
      </div>

      {/* Content layer */}
      <div className="relative w-full h-full flex flex-col items-center justify-center p-8">
        {/* Turn Timer */}
        <div className="absolute top-4 right-4 z-20">
          <TurnTimer
            startTime={gameState.currentRound.turnStartTime}
            duration={gameState.turnDuration}
            isActive={!gameState.isFinished && !gameState.currentRound.isBlocked}
          />
        </div>

        {/* Chain visualization area */}
        <div
          ref={containerRef}
          className="flex-1 w-full relative overflow-hidden"
          role="region"
          aria-label={`Domino chain with ${gameState.currentRound.chain.tiles.length} tiles`}
        >
          {gameState.currentRound.chain.tiles.length === 0 ? (
            <div
              className="absolute inset-0 flex items-center justify-center text-cuban-gold/60 text-lg font-light italic tracking-wide"
            >
              Waiting for first move...
            </div>
          ) : (
            <>
              {/* Left Drop Zone */}
              {hasSelection && canPlayLeft && leftTip && (
                <div
                  className={`absolute flex flex-col items-center gap-2 transition-all z-10 ${dragOverEnd === 'left' ? 'scale-125' : 'animate-pulse'}`}
                  style={{
                    left: centerX + leftTip.x,
                    top: centerY + leftTip.y,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onDragOver={(e) => {
                    e.preventDefault()
                    e.dataTransfer.dropEffect = 'move'
                    setDragOverEnd('left')
                  }}
                  onDragLeave={() => setDragOverEnd(null)}
                  onDrop={(e) => {
                    e.preventDefault()
                    const tileId = e.dataTransfer.getData('text/plain')
                    setDragOverEnd(null)
                    if (tileId && onTilePlayed) {
                      onTilePlayed(tileId, 'left')
                    }
                  }}
                >
                  <div className={`w-10 h-10 rounded-full border-2 border-cuban-emerald flex items-center justify-center transition-all ${dragOverEnd === 'left'
                    ? 'bg-cuban-emerald/60 shadow-[0_0_20px_rgba(46,204,113,0.8)]'
                    : 'bg-cuban-emerald/30'
                    }`}>
                    <span className="text-cuban-emerald text-xl font-bold">+</span>
                  </div>
                </div>
              )}

              {/* Tiles */}
              {gameState.currentRound.chain.tiles.map((placedTile, index) => {
                const pos = positions.get(`${placedTile.tile.id}-${index}`)
                if (!pos) return null

                const isJustPlaced = lastPlacedIndex === index

                return (
                  <div
                    key={`${placedTile.tile.id}-${index}`}
                    className="absolute transition-all duration-500 ease-out"
                    style={{
                      left: centerX + pos.x,
                      top: centerY + pos.y,
                      transform: `translate(-50%, -50%) rotate(${pos.rotation}deg)`,
                      zIndex: pos.zIndex
                    }}
                  >
                    <DominoTile
                      tile={placedTile.tile}
                      size="sm"
                      orientation="horizontal" // Always horizontal, rotation handled by parent div
                      isFlipped={placedTile.orientation === 'flipped'}
                      className={isJustPlaced ? 'animate-tile-slam' : ''}
                    />
                  </div>
                )
              })}

              {/* Right Drop Zone */}
              {hasSelection && canPlayRight && rightTip && (
                <div
                  className={`absolute flex flex-col items-center gap-2 transition-all z-10 ${dragOverEnd === 'right' ? 'scale-125' : 'animate-pulse'}`}
                  style={{
                    left: centerX + rightTip.x,
                    top: centerY + rightTip.y,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onDragOver={(e) => {
                    e.preventDefault()
                    e.dataTransfer.dropEffect = 'move'
                    setDragOverEnd('right')
                  }}
                  onDragLeave={() => setDragOverEnd(null)}
                  onDrop={(e) => {
                    e.preventDefault()
                    const tileId = e.dataTransfer.getData('text/plain')
                    setDragOverEnd(null)
                    if (tileId && onTilePlayed) {
                      onTilePlayed(tileId, 'right')
                    }
                  }}
                >
                  <div className={`w-10 h-10 rounded-full border-2 border-cuban-emerald flex items-center justify-center transition-all ${dragOverEnd === 'right'
                    ? 'bg-cuban-emerald/60 shadow-[0_0_20px_rgba(46,204,113,0.8)]'
                    : 'bg-cuban-emerald/30'
                    }`}>
                    <span className="text-cuban-emerald text-xl font-bold">+</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Pass Turn Overlay */}
        {isBlocked && onPassTurn && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-20 animate-fade-in">
            <div className="bg-cuban-mahogany p-6 rounded-lg shadow-2xl border border-cuban-gold/30 flex flex-col items-center gap-4">
              <div className="text-cuban-gold text-xl font-bold">No Valid Moves</div>
              <button
                onClick={onPassTurn}
                className="brass-coin px-8 py-3 text-cuban-navy font-bold rounded-md hover:scale-105 transition-transform"
              >
                Pass Turn
              </button>
            </div>
          </div>
        )}

        {/* Game info footer */}
        <div className="w-full mt-4 flex justify-between items-center text-cuban-gold/90 text-xs tracking-wide px-2">
          <div className="drop-shadow-sm flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cuban-emerald animate-pulse shadow-[0_0_8px_rgba(46,204,113,0.8)]" />
            <span className="opacity-70">Current Turn: </span>
            <span className="font-bold text-cuban-emerald">{currentPlayer?.name}</span>
          </div>
          <div className="opacity-70 drop-shadow-sm">
            Round {gameState.currentRound.roundNumber} | Target: {gameState.targetScore}
          </div>
        </div>
      </div>
    </div>
  )
}
