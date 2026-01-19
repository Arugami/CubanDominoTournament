/**
 * Core game engine for Cuban Dominoes
 * Pure game logic - no side effects, fully testable
 */

import type {
  GameState,
  Player,
  Tile,
  ValidMove,
  PlacementEnd,
  SpecialPlay,
  GameMode,
  DominoChain,
  PlacedTile,
} from './types'
import {
  generateTileSet,
  shuffleTiles,
  calculatePipTotal,
  shouldReshuffle,
  getHighestDouble,
  tileMatches,
} from './tiles'

/**
 * Create a new game
 */
export function createGame(
  playerNames: string[],
  mode: GameMode = '1v1',
  targetScore: number = 150,
  turnDuration: number = 30
): GameState {
  if (mode === '1v1' && playerNames.length !== 2) {
    throw new Error('1v1 mode requires exactly 2 players')
  }
  if (mode === '2v2' && playerNames.length !== 4) {
    throw new Error('2v2 mode requires exactly 4 players')
  }

  const players: Player[] = playerNames.map((name, index) => ({
    id: `player-${index}`,
    name,
    hand: [],
    score: 0,
    isBot: name.startsWith('Bot'), // Simple convention for now
  }))

  const game: GameState = {
    id: `game-${Date.now()}`,
    mode,
    players,
    currentRound: {
      roundNumber: 1,
      startingPlayer: players[0]!.id, // Placeholder, will be set in dealNewRound
      currentPlayer: players[0]!.id,
      chain: {
        tiles: [],
        leftEnd: null,
        rightEnd: null,
        rootIndex: 0,
      },
      passes: 0,
      isBlocked: false,
      turnStartTime: Date.now(),
    },
    targetScore,
    isFinished: false,
    turnDuration,
  }

  return dealNewRound(game)
}

/**
 * Deal tiles for a new round
 */
export function dealNewRound(game: GameState): GameState {
  let tiles = generateTileSet()
  let attempts = 0
  const maxAttempts = 10

  // Keep shuffling until no player has 5+ doubles
  let validDeal = false
  let hands: Tile[][] = []

  while (!validDeal && attempts < maxAttempts) {
    tiles = shuffleTiles(tiles)
    hands = []
    // Cuban Dominoes: Always deal 10 tiles per player, regardless of mode (1v1 or 2v2)
    // In 2v2 (4 players), 40 tiles are used, 15 left over.
    // In 1v1 (2 players), 20 tiles are used, 35 left over.
    const tilesPerPlayer = 10

    for (let i = 0; i < game.players.length; i++) {
      const start = i * tilesPerPlayer
      const playerHand = tiles.slice(start, start + tilesPerPlayer)
      hands.push(playerHand)

      if (shouldReshuffle(playerHand)) {
        attempts++
        break
      }

      if (i === game.players.length - 1) {
        validDeal = true
      }
    }
  }

  // If we couldn't get a valid deal after max attempts, just use the last one
  const updatedPlayers = game.players.map((player, index) => ({
    ...player,
    hand: hands[index] || [],
  }))

  // Determine starting player
  let startingPlayerId = game.currentRound.startingPlayer

  // If it's the first round, determine by highest double
  if (game.currentRound.roundNumber === 1) {
    let highestDoubleValue = -1
    // Reset starting player to first player as default fallback
    startingPlayerId = updatedPlayers[0]!.id

    for (const player of updatedPlayers) {
      const playerHighestDouble = getHighestDouble(player.hand)
      if (playerHighestDouble && playerHighestDouble.left > highestDoubleValue) {
        highestDoubleValue = playerHighestDouble.left
        startingPlayerId = player.id
      }
    }
  }
  // For subsequent rounds, the winner of the previous round starts (already set in finishRound)
  // If finishRound set a winner, that player is already in game.currentRound.startingPlayer
  // But we need to ensure we don't overwrite it with logic above unless it's round 1.

  return {
    ...game,
    players: updatedPlayers,
    currentRound: {
      ...game.currentRound,
      startingPlayer: startingPlayerId,
      currentPlayer: startingPlayerId,
      chain: {
        tiles: [],
        leftEnd: null,
        rightEnd: null,
        rootIndex: 0,
      },
      passes: 0,
      isBlocked: false,
      turnStartTime: Date.now(),
    },
  }
}

/**
 * Get valid moves for current player
 */
export function getValidMoves(game: GameState): ValidMove[] {
  const currentPlayer = game.players.find(
    (p) => p.id === game.currentRound.currentPlayer
  )
  if (!currentPlayer) return []

  const { chain } = game.currentRound
  const validMoves: ValidMove[] = []

  // First tile can be played anywhere
  if (chain.tiles.length === 0) {
    for (const tile of currentPlayer.hand) {
      validMoves.push({
        tile,
        end: 'left',
        requiresFlip: false,
      })
    }
    return validMoves
  }

  // Check each tile against both ends of the chain
  for (const tile of currentPlayer.hand) {
    // Check left end
    if (chain.leftEnd !== null) {
      if (tileMatches(tile, chain.leftEnd)) {
        validMoves.push({
          tile,
          end: 'left',
          requiresFlip: tile.left === chain.leftEnd,
        })
      }
    }

    // Check right end
    if (chain.rightEnd !== null) {
      if (tileMatches(tile, chain.rightEnd)) {
        validMoves.push({
          tile,
          end: 'right',
          requiresFlip: tile.right === chain.rightEnd,
        })
      }
    }
  }

  return validMoves
}

/**
 * Play a tile
 */
export function playTile(
  game: GameState,
  tileId: string,
  end: PlacementEnd
): GameState {
  const currentPlayer = game.players.find(
    (p) => p.id === game.currentRound.currentPlayer
  )
  if (!currentPlayer) {
    throw new Error('Current player not found')
  }

  const tile = currentPlayer.hand.find((t) => t.id === tileId)
  if (!tile) {
    throw new Error('Tile not in player hand')
  }

  const validMoves = getValidMoves(game)
  const validMove = validMoves.find(
    (m) => m.tile.id === tileId && m.end === end
  )
  if (!validMove) {
    throw new Error('Invalid move')
  }

  // Create placed tile
  const placedTile: PlacedTile = {
    tile,
    orientation: validMove.requiresFlip ? 'flipped' : 'normal',
  }

  // Update chain
  let updatedChain: DominoChain

  if (game.currentRound.chain.tiles.length === 0) {
    // First tile
    updatedChain = {
      tiles: [placedTile],
      leftEnd: tile.left,
      rightEnd: tile.right,
      rootIndex: 0,
    }
  } else {
    const tiles = [...game.currentRound.chain.tiles]
    let leftEnd = game.currentRound.chain.leftEnd!
    let rightEnd = game.currentRound.chain.rightEnd!
    let rootIndex = game.currentRound.chain.rootIndex

    if (end === 'left') {
      tiles.unshift(placedTile)
      leftEnd = validMove.requiresFlip ? tile.right : tile.left
      // Since we prepended, the root index shifts by +1
      rootIndex += 1
    } else {
      tiles.push(placedTile)
      rightEnd = validMove.requiresFlip ? tile.left : tile.right
      // Root index stays same
    }

    updatedChain = { tiles, leftEnd, rightEnd, rootIndex }
  }

  // Remove tile from player hand
  const updatedPlayers = game.players.map((p) =>
    p.id === currentPlayer.id
      ? { ...p, hand: p.hand.filter((t) => t.id !== tileId) }
      : p
  )

  // Check if player won (played last tile)
  const playerWon = updatedPlayers.find((p) => p.id === currentPlayer.id)!.hand.length === 0

  if (playerWon) {
    // Round is over
    return finishRound(
      {
        ...game,
        players: updatedPlayers,
        currentRound: {
          ...game.currentRound,
          chain: updatedChain,
        },
      },
      currentPlayer.id,
      false
    )
  }

  // Move to next player
  const nextPlayerId = getNextPlayer(game)

  return {
    ...game,
    players: updatedPlayers,
    currentRound: {
      ...game.currentRound,
      chain: updatedChain,
      currentPlayer: nextPlayerId,
      passes: 0, // Reset passes on successful play
      isBlocked: false,
      turnStartTime: Date.now(),
    },
  }
}

/**
 * Pass turn (no valid moves)
 */
export function passTurn(game: GameState): GameState {
  const validMoves = getValidMoves(game)
  if (validMoves.length > 0) {
    throw new Error('Cannot pass when valid moves are available')
  }

  const passes = game.currentRound.passes + 1


  // If all players pass, game is blocked
  if (passes >= game.players.length) {
    return finishRound(game, '', true)
  }

  const nextPlayerId = getNextPlayer(game)

  return {
    ...game,
    currentRound: {
      ...game.currentRound,
      currentPlayer: nextPlayerId,
      passes,
      turnStartTime: Date.now(),
    },
  }
}

/**
 * Finish a round
 */
function finishRound(
  game: GameState,
  winnerId: string,
  blocked: boolean
): GameState {
  let roundWinner = winnerId
  let points = 0
  const specialPlays: SpecialPlay[] = []

  // Helper to check if players are teammates (2v2)
  // In 2v2: P0 & P2 are team A, P1 & P3 are team B
  const isTeammate = (p1Id: string, p2Id: string) => {
    if (game.mode !== '2v2') return false
    const p1Index = parseInt(p1Id.split('-')[1]!)
    const p2Index = parseInt(p2Id.split('-')[1]!)
    return (p1Index % 2) === (p2Index % 2)
  }

  if (blocked) {
    // Find player/team with lowest pip total
    let lowestTotal = Infinity

    // In 2v2, we compare TEAM totals for blocked game?
    // Rules say: "In a blocked game, the team/player with the lowest pip count in their hand wins."
    // Usually in Cuban dominoes, it's individual lowest hand that wins the round for the team.
    // "The team/player with the lowest pip count in their hand wins." -> Implies individual hand check.

    for (const player of game.players) {
      const total = calculatePipTotal(player.hand)
      if (total < lowestTotal) {
        lowestTotal = total
        roundWinner = player.id
      } else if (total === lowestTotal) {
        // Tie in blocked game
        // Rules: "Winner is the team/player who won the previous round."
        // If first round, "Winner is determined by who played the highest domino at the start of the match."
        // For now, let's stick to simple lowest total wins. 
        // If tie, we might need complex logic. Let's assume strict inequality for now or simple resolution.
        // If it's a tie between teammates, it doesn't matter.
        // If it's a tie between opponents, we need the tie breaker rule.
        // Implementing simple tie breaker: First player in turn order from start? Or just keep current winner.
      }
    }

    specialPlays.push({
      type: 'blocked_round',
      player: roundWinner,
    })
  }

  // Calculate points
  // Rules: "The winner scores the total pip value of the losing side’s remaining tiles."
  for (const player of game.players) {
    const isWinnerOrTeammate = player.id === roundWinner || isTeammate(player.id, roundWinner)

    if (!isWinnerOrTeammate) {
      points += calculatePipTotal(player.hand)
    }
  }

  // Check for pollona (opponents scored 0 this game - they have full hands)
  // Only relevant if winner played all tiles? Or just if opponents have full hands?
  // Rules: "Winning a game where the opponents score zero points." -> This is usually a match win condition, not round.
  // But here it says "Winning a round where..." -> "Pollona: Winning a game where..."
  // Let's keep the existing check but adapt for teams.
  const opponentsHaveFullHands = game.players
    .filter((p) => p.id !== roundWinner && !isTeammate(p.id, roundWinner))
    .every((p) => p.hand.length === 10) // Always 10 tiles now

  if (opponentsHaveFullHands && !blocked) {
    specialPlays.push({
      type: 'pollona',
      player: roundWinner,
    })
  }

  // Check for viajera (100+ points in a round)
  if (points >= 100) {
    specialPlays.push({
      type: 'viajera',
      player: roundWinner,
      points,
    })
  }

  // Update winner's score (or winner's team score)
  const updatedPlayers = game.players.map((p) => {
    if (p.id === roundWinner || isTeammate(p.id, roundWinner)) {
      return { ...p, score: p.score + points }
    }
    return p
  })

  // Check if game is finished
  // In 2v2, check if any team reached target
  const winner = updatedPlayers.find((p) => p.score >= game.targetScore)
  const isFinished = winner !== undefined

  // Prepare next round
  const nextRoundNumber = game.currentRound.roundNumber + 1

  // Winner of this round starts the next one
  const nextStartingPlayer = roundWinner

  if (isFinished) {
    return {
      ...game,
      players: updatedPlayers,
      isFinished: true,
      winner: winner?.id,
      currentRound: {
        ...game.currentRound,
        // Keep final state for display
      }
    }
  }

  // Prepare for next round
  const nextGameBase: GameState = {
    ...game,
    players: updatedPlayers,
    currentRound: {
      ...game.currentRound,
      roundNumber: nextRoundNumber,
      startingPlayer: nextStartingPlayer,
      currentPlayer: nextStartingPlayer,
      chain: { tiles: [], leftEnd: null, rightEnd: null, rootIndex: 0 },
      passes: 0,
      isBlocked: false,
      turnStartTime: Date.now(),
    },
    turnDuration: game.turnDuration,
  }

  return dealNewRound(nextGameBase)
}

/**
 * Get next player in turn order
 */
function getNextPlayer(game: GameState): string {
  const currentIndex = game.players.findIndex(
    (p) => p.id === game.currentRound.currentPlayer
  )
  const nextIndex = (currentIndex + 1) % game.players.length
  return game.players[nextIndex]!.id
}

/**
 * Get current player
 */
export function getCurrentPlayer(game: GameState): Player | null {
  return game.players.find((p) => p.id === game.currentRound.currentPlayer) || null
}
