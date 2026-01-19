/**
 * Cuban Dominoes Game Engine
 * Pure TypeScript game logic - no side effects
 */

// Types
export type {
  Tile,
  PipValue,
  Player,
  PlacementEnd,
  PlacedTile,
  DominoChain,
  ValidMove,
  GameRound,
  GameMode,
  GameState,
  SpecialPlay,
  RoundResult,
} from './types'

// Tile utilities
export {
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

// Game engine
export {
  createGame,
  dealNewRound,
  getValidMoves,
  playTile,
  passTurn,
  getCurrentPlayer,
} from './game'
