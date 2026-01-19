import { GameState, ValidMove } from './types'
import { getValidMoves, calculateTileValue } from './game'

/**
 * Get the best move for the current bot player
 */
export function getBestMove(gameState: GameState): ValidMove | null {
    const validMoves = getValidMoves(gameState)

    if (validMoves.length === 0) {
        return null
    }

    // Simple heuristic:
    // 1. Play heaviest double
    // 2. Play heaviest tile

    // Sort moves by priority
    validMoves.sort((a, b) => {
        const tileA = a.tile
        const tileB = b.tile

        const isDoubleA = tileA.left === tileA.right
        const isDoubleB = tileB.left === tileB.right

        const valueA = calculateTileValue(tileA)
        const valueB = calculateTileValue(tileB)

        // Prioritize doubles
        if (isDoubleA && !isDoubleB) return -1
        if (!isDoubleA && isDoubleB) return 1

        // Then prioritize value (heavier is better to get rid of points)
        return valueB - valueA
    })

    return validMoves[0] || null
}
