/**
 * PlayerHand - Displays current player's tiles
 * Supports drag-and-drop for intuitive tile placement
 */

import { useState } from 'react'
import { Tile } from '@/engine/types'
import { soundManager } from '../../engine/audio'
import { DominoTile } from './DominoTile'

interface PlayerHandProps {
  tiles: Tile[]
  onTileClick?: (tileId: string) => void
  onTileDragStart?: (tileId: string) => void
  onTileDragEnd?: () => void
  highlightedTiles?: string[]
  disabled?: boolean
}

export function PlayerHand({
  tiles,
  onTileClick,
  onTileDragStart,
  onTileDragEnd,
  highlightedTiles = [],
  disabled = false
}: PlayerHandProps) {
  const [draggedTile, setDraggedTile] = useState<string | null>(null)

  const handleDragStart = (tileId: string) => {
    if (disabled) return
    soundManager.playClick()
    setDraggedTile(tileId)
    onTileDragStart?.(tileId)
  }

  const handleDragEnd = () => {
    setDraggedTile(null)
    onTileDragEnd?.()
  }

  return (
    <div
      className="w-full rounded-lg p-4 wood-texture"
      role="region"
      aria-label="Your hand"
    >
      <div className="text-cuban-gold text-xs font-semibold mb-3 tracking-wide uppercase opacity-80">Your Hand</div>
      <div className="flex gap-1.5 flex-wrap justify-center" role="list" aria-label="Your tiles">
        {tiles.map((tile) => {
          const isHighlighted = highlightedTiles.includes(tile.id)
          const isDragging = draggedTile === tile.id

          return (
            <div key={tile.id} role="listitem">
              <DominoTile
                tile={tile}
                size="sm"
                isDraggable={!disabled}
                isDragging={isDragging}
                isSelected={isHighlighted}
                onClick={() => {
                  if (!disabled) {
                    soundManager.playClick()
                    onTileClick?.(tile.id)
                  }
                }}
                onDragStart={(e) => {
                  e.dataTransfer.effectAllowed = 'move'
                  e.dataTransfer.setData('text/plain', tile.id)
                  handleDragStart(tile.id)
                }}
                onDragEnd={handleDragEnd}
                className={disabled ? 'opacity-50 cursor-not-allowed' : ''}
                aria-label={`Domino tile: ${tile.left} and ${tile.right}`}
                aria-selected={isHighlighted}
              />
            </div>
          )
        })}
      </div>
      {tiles.length === 0 && (
        <div className="text-cuban-gold/50 text-center py-4 italic text-sm">No tiles in hand</div>
      )}
    </div>
  )
}
