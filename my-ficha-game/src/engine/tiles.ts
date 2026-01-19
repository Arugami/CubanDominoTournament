/**
 * Tile generation and manipulation utilities
 */

import type { Tile, PipValue } from './types'

/**
 * Generate a complete double-nine domino set (55 tiles)
 */
export function generateTileSet(): Tile[] {
  const tiles: Tile[] = []
  let id = 0

  for (let left = 0; left <= 9; left++) {
    for (let right = left; right <= 9; right++) {
      tiles.push({
        id: `tile-${id++}`,
        left: left as PipValue,
        right: right as PipValue,
      })
    }
  }

  return tiles
}

/**
 * Shuffle tiles using Fisher-Yates algorithm
 */
export function shuffleTiles(tiles: Tile[]): Tile[] {
  const shuffled = [...tiles]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!]
  }
  return shuffled
}

/**
 * Calculate the total pip count of tiles
 */
export function calculatePipTotal(tiles: Tile[]): number {
  return tiles.reduce((sum, tile) => sum + tile.left + tile.right, 0)
}

/**
 * Check if a tile is a double
 */
export function isDouble(tile: Tile): boolean {
  return tile.left === tile.right
}

/**
 * Count the number of doubles in a hand
 */
export function countDoubles(tiles: Tile[]): number {
  return tiles.filter(isDouble).length
}

/**
 * Check if a hand should be reshuffled (5+ doubles rule)
 */
export function shouldReshuffle(tiles: Tile[]): boolean {
  return countDoubles(tiles) >= 5
}

/**
 * Get the highest tile in a hand (for determining first play)
 */
export function getHighestTile(tiles: Tile[]): Tile | null {
  if (tiles.length === 0) return null

  return tiles.reduce((highest, tile) => {
    const tileTotal = tile.left + tile.right
    const highestTotal = highest.left + highest.right
    return tileTotal > highestTotal ? tile : highest
  })
}

/**
 * Get the highest double in a hand
 */
export function getHighestDouble(tiles: Tile[]): Tile | null {
  const doubles = tiles.filter(isDouble)
  if (doubles.length === 0) return null

  return doubles.reduce((highest, tile) =>
    tile.left > highest.left ? tile : highest
  )
}

/**
 * Check if a tile matches a pip value
 */
export function tileMatches(tile: Tile, value: PipValue): boolean {
  return tile.left === value || tile.right === value
}

/**
 * Format tile for display
 */
export function formatTile(tile: Tile): string {
  return `[${tile.left}|${tile.right}]`
}
