import { describe, it, expect } from 'vitest'
import {
  generateTileSet,
  shuffleTiles,
  calculatePipTotal,
  isDouble,
  countDoubles,
  shouldReshuffle,
  getHighestTile,
  getHighestDouble,
  tileMatches,
  formatTile,
} from './tiles'
import type { Tile } from './types'

describe('Tile Generation', () => {
  it('generates exactly 55 tiles for double-nine set', () => {
    const tiles = generateTileSet()
    expect(tiles).toHaveLength(55)
  })

  it('generates unique tiles', () => {
    const tiles = generateTileSet()
    const ids = new Set(tiles.map((t) => t.id))
    expect(ids.size).toBe(55)
  })

  it('includes all doubles from 0-0 to 9-9', () => {
    const tiles = generateTileSet()
    const doubles = tiles.filter((t) => t.left === t.right)
    expect(doubles).toHaveLength(10) // 0-0 through 9-9
  })
})

describe('Tile Shuffling', () => {
  it('shuffles tiles while maintaining count', () => {
    const original = generateTileSet()
    const shuffled = shuffleTiles(original)
    expect(shuffled).toHaveLength(55)
  })

  it('creates a different order', () => {
    const original = generateTileSet()
    const shuffled = shuffleTiles(original)
    // With 55 tiles, odds of same order are astronomically low
    const sameOrder = shuffled.every((tile, i) => tile.id === original[i]!.id)
    expect(sameOrder).toBe(false)
  })

  it('does not mutate original array', () => {
    const original = generateTileSet()
    const firstId = original[0]!.id
    shuffleTiles(original)
    expect(original[0]!.id).toBe(firstId)
  })
})

describe('Pip Calculations', () => {
  it('calculates pip total correctly', () => {
    const tiles: Tile[] = [
      { id: '1', left: 0, right: 0 }, // 0
      { id: '2', left: 6, right: 6 }, // 12
      { id: '3', left: 3, right: 4 }, // 7
    ]
    expect(calculatePipTotal(tiles)).toBe(19)
  })

  it('returns 0 for empty hand', () => {
    expect(calculatePipTotal([])).toBe(0)
  })
})

describe('Double Detection', () => {
  it('identifies doubles correctly', () => {
    expect(isDouble({ id: '1', left: 5, right: 5 })).toBe(true)
    expect(isDouble({ id: '2', left: 3, right: 4 })).toBe(false)
  })

  it('counts doubles in a hand', () => {
    const tiles: Tile[] = [
      { id: '1', left: 0, right: 0 },
      { id: '2', left: 6, right: 6 },
      { id: '3', left: 3, right: 4 },
      { id: '4', left: 9, right: 9 },
    ]
    expect(countDoubles(tiles)).toBe(3)
  })

  it('determines if reshuffle is needed (5+ doubles)', () => {
    const tiles: Tile[] = Array(5)
      .fill(null)
      .map((_, i) => ({ id: `${i}`, left: 0, right: 0 }))
    expect(shouldReshuffle(tiles)).toBe(true)

    const tilesWithFour: Tile[] = Array(4)
      .fill(null)
      .map((_, i) => ({ id: `${i}`, left: 0, right: 0 }))
    expect(shouldReshuffle(tilesWithFour)).toBe(false)
  })
})

describe('Tile Selection', () => {
  it('finds highest tile', () => {
    const tiles: Tile[] = [
      { id: '1', left: 3, right: 4 }, // 7
      { id: '2', left: 6, right: 6 }, // 12
      { id: '3', left: 5, right: 5 }, // 10
    ]
    const highest = getHighestTile(tiles)
    expect(highest?.id).toBe('2')
  })

  it('finds highest double', () => {
    const tiles: Tile[] = [
      { id: '1', left: 3, right: 3 },
      { id: '2', left: 6, right: 6 },
      { id: '3', left: 5, right: 4 },
    ]
    const highest = getHighestDouble(tiles)
    expect(highest?.id).toBe('2')
  })

  it('returns null when no doubles exist', () => {
    const tiles: Tile[] = [
      { id: '1', left: 3, right: 4 },
      { id: '2', left: 5, right: 6 },
    ]
    expect(getHighestDouble(tiles)).toBeNull()
  })
})

describe('Tile Matching', () => {
  it('matches tile to pip value', () => {
    const tile: Tile = { id: '1', left: 3, right: 6 }
    expect(tileMatches(tile, 3)).toBe(true)
    expect(tileMatches(tile, 6)).toBe(true)
    expect(tileMatches(tile, 5)).toBe(false)
  })
})

describe('Tile Formatting', () => {
  it('formats tile for display', () => {
    const tile: Tile = { id: '1', left: 3, right: 6 }
    expect(formatTile(tile)).toBe('[3|6]')
  })
})
