import { describe, it, expect } from 'vitest'
import { calculateLayout } from './layout'
import { DominoChain } from './types'

describe('Layout Engine', () => {
    it('places single tile at center', () => {
        const chain: DominoChain = {
            tiles: [{ tile: { id: '1', left: 6, right: 6 }, orientation: 'normal' }],
            leftEnd: 6,
            rightEnd: 6,
            rootIndex: 0
        }

        const { positions } = calculateLayout(chain)
        const pos = positions.get('1-0')

        expect(pos).toBeDefined()
        expect(pos?.x).toBe(0)
        expect(pos?.y).toBe(0)
        // Double 6-6 should be vertical (90 deg)
        expect(pos?.rotation).toBe(90)
    })

    it('places horizontal chain correctly', () => {
        const chain: DominoChain = {
            tiles: [
                { tile: { id: '1', left: 6, right: 5 }, orientation: 'normal' }, // Left
                { tile: { id: '2', left: 6, right: 6 }, orientation: 'normal' }, // Center (Root)
                { tile: { id: '3', left: 6, right: 4 }, orientation: 'normal' }  // Right
            ],
            leftEnd: 5,
            rightEnd: 4,
            rootIndex: 1
        }

        const { positions } = calculateLayout(chain)

        const center = positions.get('2-1')
        const left = positions.get('1-0')
        const right = positions.get('3-2')

        expect(center?.x).toBe(0)
        expect(center?.y).toBe(0)

        // Left tile should be to the left
        expect(left?.x).toBeLessThan(0)
        expect(left?.y).toBe(0)

        // Right tile should be to the right
        expect(right?.x).toBeGreaterThan(0)
        expect(right?.y).toBe(0)
    })

    it('turns when hitting bounds', () => {
        // Create a long chain to force a turn
        // Config: boardWidth 800. Limit ~300.
        // Tile width 40. Gap 4. Total ~44 per tile.
        // 10 tiles = 440px > 300px. Should turn.

        const tiles = []
        for (let i = 0; i < 15; i++) {
            tiles.push({
                tile: { id: `t${i}`, left: 1, right: 1 } as any,
                orientation: 'normal' as const
            })
        }

        const chain: DominoChain = {
            tiles,
            leftEnd: 1,
            rightEnd: 1,
            rootIndex: 0 // Start at left, grow right
        }

        const { positions } = calculateLayout(chain)

        // Check if any tile has y != 0 (meaning it turned)
        const turnedTiles = Array.from(positions.values()).filter(p => p.y !== 0)
        expect(turnedTiles.length).toBeGreaterThan(0)
    })
})
