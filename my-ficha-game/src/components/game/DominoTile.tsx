/**
 * DominoTile - Premium, tactile domino component
 * Encapsulates the physical look and feel of the tile (bevels, shadows, texture)
 */

import { Tile } from '@/engine/types'
import { DominoPip } from './DominoPip'

interface DominoTileProps {
    tile: Tile
    orientation?: 'vertical' | 'horizontal'
    isFlipped?: boolean
    size?: 'sm' | 'md' | 'lg'
    isDraggable?: boolean
    isDragging?: boolean
    isSelected?: boolean
    isValidMove?: boolean
    isValidLeft?: boolean
    isValidRight?: boolean
    onClick?: () => void
    onDragStart?: (e: React.DragEvent) => void
    onDragEnd?: () => void
    className?: string
    style?: React.CSSProperties
}

export function DominoTile({
    tile,
    orientation = 'vertical', // Deprecated: kept for API compatibility, rotation handled by parent transform
    isFlipped = false,
    size = 'md',
    isDraggable = false,
    isDragging = false,
    isSelected = false,
    isValidMove = false,
    isValidLeft = false,
    isValidRight = false,
    onClick,
    onDragStart,
    onDragEnd,
    className = '',
    style = {}
}: DominoTileProps) {

    // Size configurations - Strict 2:1 Aspect Ratio
    const sizes = {
        sm: { width: 'w-8', height: 'h-16', pipSize: 'sm' as const },
        md: { width: 'w-12', height: 'h-24', pipSize: 'md' as const },
        lg: { width: 'w-16', height: 'h-32', pipSize: 'lg' as const }
    }

    const currentSize = sizes[size]

    // Determine values based on orientation/flip
    const topValue = isFlipped ? tile.right : tile.left
    const bottomValue = isFlipped ? tile.left : tile.right

    // Haptic feedback helper
    const triggerHaptic = (pattern: number[]) => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(pattern)
        }
    }

    const handleMouseDown = () => {
        if (!isDraggable && !onClick) return
        triggerHaptic([10]) // Light tap on touch/click
    }

    return (
        <div
            onClick={onClick}
            onMouseDown={handleMouseDown}
            draggable={isDraggable}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            className={`
        relative flex flex-col items-center justify-center
        bg-[#FEFEF8] /* Solid Ivory */
        rounded-[3px] /* Subtle rounding */
        transition-all duration-200 ease-out
        transform-gpu perspective-1000
        
        /* Crisp Border */
        border-[1.5px] border-black/80
        
        /* Simple Drop Shadow */
        ${isDragging
                    ? 'shadow-[0_12px_24px_rgba(0,0,0,0.3)] scale-110 -translate-y-4 z-50 cursor-grabbing'
                    : isSelected
                        ? 'shadow-[0_4px_8px_rgba(0,0,0,0.2)] scale-105 -translate-y-1 z-10 ring-2 ring-cuban-gold'
                        : 'shadow-[0_2px_4px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.2)] hover:-translate-y-0.5'
                }

        /* Valid Move Glow */
        ${(isValidLeft || isValidRight || isValidMove)
                    ? 'ring-2 ring-cuban-emerald ring-offset-1'
                    : ''
                }

        /* Always vertical layout - rotation handled by parent */
        flex-col
        
        /* Cursor */
        ${isDraggable && !isDragging ? 'cursor-grab active:cursor-grabbing' : ''}
        ${onClick && !isDraggable ? 'cursor-pointer' : ''}
        ${!isDraggable && !onClick ? 'cursor-default' : ''}
        
        /* Fixed dimensions - always tall (2:1 ratio) */
        ${currentSize.width}
        ${currentSize.height}
        
        ${className}
      `}
            style={{
                transformStyle: 'preserve-3d',
                ...style
            }}
        >
            {/* Top/Left Pip Container */}
            <div className="flex-1 flex items-center justify-center w-full h-full z-10">
                <DominoPip value={topValue} size={currentSize.pipSize} />
            </div>

            {/* Divider Line - Always horizontal (tiles are always vertical) */}
            <div className="relative z-10 w-full h-[0.5px] bg-black/20" />

            {/* Brass Spinner (Center Pin) - Small & Subtle */}
            <div className="absolute z-30 rounded-full bg-gradient-to-br from-[#D4A574] to-[#B8945F] w-2 h-2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_1px_1px_rgba(0,0,0,0.3)]" />

            {/* Bottom/Right Pip Container */}
            <div className="flex-1 flex items-center justify-center w-full h-full z-10">
                <DominoPip value={bottomValue} size={currentSize.pipSize} />
            </div>

            {/* Double Indicator (Star) - Adjusted position */}
            {tile.left === tile.right && (
                <div className="absolute top-1 right-1 text-cuban-gold drop-shadow-sm z-20">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                </div>
            )}
        </div>
    )
}
