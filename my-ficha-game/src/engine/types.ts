/**
 * Core types for the Cuban Dominoes game engine
 */

/** Represents a domino tile value (0-9 for double-nine set) */
export type PipValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

/** A domino tile with two sides */
export interface Tile {
  id: string
  left: PipValue
  right: PipValue
}

/** Player in the game */
export interface Player {
  id: string
  name: string
  hand: Tile[]
  score: number
  isBot: boolean
}

/** Placement position on the domino chain */
export type PlacementEnd = 'left' | 'right'

/** A placed tile in the domino chain */
export interface PlacedTile {
  tile: Tile
  /** Which end of the tile was placed */
  orientation: 'normal' | 'flipped'
}

/** The domino chain on the table */
export interface DominoChain {
  tiles: PlacedTile[]
  leftEnd: PipValue | null
  rightEnd: PipValue | null
  rootIndex: number // Index of the first played tile (spinner)
}

/** Valid move for a player */
export interface ValidMove {
  tile: Tile
  end: PlacementEnd
  /** Whether the tile needs to be flipped */
  requiresFlip: boolean
}

/** Game mode */
export type GameMode = '1v1' | '2v2'

/** Game round state */
export interface GameRound {
  roundNumber: number
  startingPlayer: string
  currentPlayer: string
  chain: DominoChain
  passes: number
  isBlocked: boolean
  turnStartTime: number
}

/** Game state */
export interface GameState {
  id: string
  mode: GameMode
  players: Player[]
  currentRound: GameRound
  targetScore: number
  isFinished: boolean
  winner?: string
  turnDuration: number
}

/** Special plays */
export interface SpecialPlay {
  type: 'capicua' | 'pollona' | 'viajera' | 'blocked_round'
  player: string
  points?: number
}

/** Round result */
export interface RoundResult {
  winner: string
  points: number
  specialPlays: SpecialPlay[]
  wasBlocked: boolean
  losingHandTotals?: Record<string, number>
}
