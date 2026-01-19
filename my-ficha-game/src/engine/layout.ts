/**
 * Layout engine for Cuban Dominoes
 * Calculates 2D positions for a snake/spiral chain
 */

import { DominoChain, PlacedTile } from './types'

export interface TilePosition {
    x: number
    y: number
    rotation: number // degrees: 0, 90, 180, 270
    zIndex: number
}

export interface LayoutConfig {
    tileWidth: number
    tileHeight: number
    gap: number
    boardWidth: number
    boardHeight: number
}

// Default dimensions based on DominoTile.tsx (sm size)
// sm: w-8 (32px) h-16 (64px) - Strict 2:1 Ratio
export const DEFAULT_CONFIG: LayoutConfig = {
    tileWidth: 32,
    tileHeight: 64,
    gap: 4,
    boardWidth: 800, // Default, should be overridden by container size
    boardHeight: 600,
}

type Direction = 'left' | 'right' | 'up' | 'down'

interface ChainEndState {
    x: number
    y: number
    direction: Direction
    // The bounding box of the last placed tile at this end
    lastRect: { width: number; height: number }
}

export interface LayoutResult {
    positions: Map<string, TilePosition>
    leftTip?: ChainEndState
    rightTip?: ChainEndState
}

/**
 * Calculate layout for the entire chain
 */
export function calculateLayout(
    chain: DominoChain,
    config: LayoutConfig = DEFAULT_CONFIG
): LayoutResult {
    const positions = new Map<string, TilePosition>()
    const { tiles, rootIndex } = chain

    if (tiles.length === 0) return { positions }

    // Place first tile (spinner) in center
    const centerTile = tiles[rootIndex]
    if (!centerTile) return { positions } // Should not happen if rootIndex is valid

    const isFirstDouble = centerTile.tile.left === centerTile.tile.right

    // First tile logic:
    // If double, it's usually vertical (90 deg) to be "crosswise" to the horizontal flow.
    // If normal, it's horizontal (0 deg).
    const firstRotation = isFirstDouble ? 90 : 0

    positions.set(getTileKey(centerTile, rootIndex), {
        x: 0,
        y: 0,
        rotation: firstRotation,
        zIndex: 1
    })

    const getDim = (r: number) => {
        // Normalize rotation to 0-180 for dimension check
        const isVert = Math.abs(r) % 180 === 90
        return {
            width: isVert ? config.tileHeight : config.tileWidth,
            height: isVert ? config.tileWidth : config.tileHeight
        }
    }

    const firstDim = getDim(firstRotation)

    // Initialize tips
    // Left tip moves Left. Right tip moves Right.
    // We need to track the "connection point" for the next tile.
    // For the first tile at (0,0):
    // Left end is at x = -width/2
    // Right end is at x = +width/2

    let leftState: ChainEndState = {
        x: -firstDim.width / 2,
        y: 0,
        direction: 'left',
        lastRect: firstDim
    }

    let rightState: ChainEndState = {
        x: firstDim.width / 2,
        y: 0,
        direction: 'right',
        lastRect: firstDim
    }

    // Process Left Side (from rootIndex - 1 down to 0)
    for (let i = rootIndex - 1; i >= 0; i--) {
        const tile = tiles[i]
        if (tile) {
            leftState = placeTile(tile, i, leftState, positions, config, getDim)
        }
    }

    // Process Right Side (from rootIndex + 1 up to length - 1)
    for (let i = rootIndex + 1; i < tiles.length; i++) {
        const tile = tiles[i]
        if (tile) {
            rightState = placeTile(tile, i, rightState, positions, config, getDim)
        }
    }

    return { positions, leftTip: leftState, rightTip: rightState }
}

function placeTile(
    tile: PlacedTile,
    index: number,
    state: ChainEndState,
    positions: Map<string, TilePosition>,
    config: LayoutConfig,
    getDim: (r: number) => { width: number; height: number }
): ChainEndState {
    const isDouble = tile.tile.left === tile.tile.right
    let rotation = 0

    // Determine rotation based on direction
    // If moving Left/Right:
    //   Normal tile: Horizontal (0 or 180)
    //   Double: Vertical (90)
    // If moving Up/Down:
    //   Normal tile: Vertical (90 or 270)
    //   Double: Horizontal (0)

    if (state.direction === 'left' || state.direction === 'right') {
        rotation = isDouble ? 90 : 0
    } else {
        rotation = isDouble ? 0 : 90
    }



    // Calculate new position
    let x = state.x
    let y = state.y

    // Check bounds and turn if needed
    const limitX = config.boardWidth / 2 - config.tileHeight * 2
    const limitY = config.boardHeight / 2 - config.tileHeight * 2

    let nextDirection = state.direction

    if (state.direction === 'left' && x < -limitX) {
        nextDirection = 'up'
    } else if (state.direction === 'right' && x > limitX) {
        nextDirection = 'down'
    } else if (state.direction === 'up' && y < -limitY) {
        nextDirection = 'right'
    } else if (state.direction === 'down' && y > limitY) {
        nextDirection = 'left'
    }

    if (nextDirection !== state.direction) {
        if (nextDirection === 'up' || nextDirection === 'down') {
            rotation = isDouble ? 0 : 90
        } else {
            rotation = isDouble ? 90 : 0 // Recalculate dim with potentially new rotation
        }
    }

    const finalDim = getDim(rotation)

    // Calculate new position
    if (nextDirection === 'left') {
        x = state.x - config.gap - finalDim.width / 2
        y = state.y
    } else if (nextDirection === 'right') {
        x = state.x + config.gap + finalDim.width / 2
        y = state.y
    } else if (nextDirection === 'up') {
        x = state.x
        y = state.y - config.gap - finalDim.height / 2
    } else if (nextDirection === 'down') {
        x = state.x
        y = state.y + config.gap + finalDim.height / 2
    }

    // Update positions
    positions.set(getTileKey(tile, index), {
        x,
        y,
        rotation,
        zIndex: 1
    })

    // Update State for next tile
    // We need the NEW edge.
    let newX = x
    let newY = y

    if (nextDirection === 'left') {
        newX = x - finalDim.width / 2
    } else if (nextDirection === 'right') {
        newX = x + finalDim.width / 2
    } else if (nextDirection === 'up') {
        newY = y - finalDim.height / 2
    } else if (nextDirection === 'down') {
        newY = y + finalDim.height / 2
    }

    return {
        x: newX,
        y: newY,
        direction: nextDirection,
        lastRect: finalDim
    }
}

function getTileKey(tile: PlacedTile, index: number): string {
    return `${tile.tile.id}-${index}`
}
