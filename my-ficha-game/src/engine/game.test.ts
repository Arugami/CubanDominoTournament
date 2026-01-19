import { describe, it, expect } from 'vitest'
import { createGame, getValidMoves, playTile, passTurn, getCurrentPlayer } from './game'
import type { Tile } from './types'

describe('Game Creation', () => {
  it('creates a 1v1 game', () => {
    const game = createGame(['Alice', 'Bob'], '1v1')
    expect(game.players).toHaveLength(2)
    expect(game.mode).toBe('1v1')
    expect(game.targetScore).toBe(150)
  })

  it('creates a 2v2 game', () => {
    const game = createGame(['Alice', 'Bob', 'Carol', 'Dave'], '2v2')
    expect(game.players).toHaveLength(4)
    expect(game.mode).toBe('2v2')
  })

  it('throws error for invalid player count in 1v1', () => {
    expect(() => createGame(['Alice'], '1v1')).toThrow()
    expect(() => createGame(['Alice', 'Bob', 'Carol'], '1v1')).toThrow()
  })

  it('throws error for invalid player count in 2v2', () => {
    expect(() => createGame(['Alice', 'Bob'], '2v2')).toThrow()
  })

  it('deals 10 tiles per player in 1v1', () => {
    const game = createGame(['Alice', 'Bob'], '1v1')
    expect(game.players[0]!.hand).toHaveLength(10)
    expect(game.players[1]!.hand).toHaveLength(10)
  })

  it('deals 10 tiles per player in 2v2', () => {
    const game = createGame(['Alice', 'Bob', 'Carol', 'Dave'], '2v2')
    game.players.forEach((player) => {
      expect(player.hand).toHaveLength(10)
    })
  })

  it('initializes scores to 0', () => {
    const game = createGame(['Alice', 'Bob'], '1v1')
    game.players.forEach((player) => {
      expect(player.score).toBe(0)
    })
  })
})

describe('Valid Moves', () => {
  it('allows any tile as first move', () => {
    const game = createGame(['Alice', 'Bob'], '1v1')
    const moves = getValidMoves(game)
    expect(moves.length).toBeGreaterThan(0)
    expect(moves.length).toBe(game.players[0]!.hand.length)
  })

  it('returns empty array if no valid moves', () => {
    // Create a game and manually set up a state where no moves are possible
    const game = createGame(['Alice', 'Bob'], '1v1')
    // Set current player's hand to tiles that don't match chain ends
    const currentPlayerIndex = game.players.findIndex((p) => p.id === game.currentRound.currentPlayer)
    game.players[currentPlayerIndex]!.hand = [{ id: '1', left: 0, right: 0 }]
    game.currentRound.chain = {
      tiles: [
        {
          tile: { id: '2', left: 5, right: 6 },
          orientation: 'normal',
        },
      ],
      leftEnd: 5,
      rightEnd: 6,
      rootIndex: 0,
    }
    const moves = getValidMoves(game)
    expect(moves).toHaveLength(0)
  })

  it('detects when flip is required', () => {
    const game = createGame(['Alice', 'Bob'], '1v1')
    const tile: Tile = { id: 'test', left: 3, right: 6 }
    const currentPlayerIndex = game.players.findIndex((p) => p.id === game.currentRound.currentPlayer)
    game.players[currentPlayerIndex]!.hand = [tile]
    game.currentRound.chain = {
      tiles: [
        {
          tile: { id: 'placed', left: 5, right: 6 },
          orientation: 'normal',
        },
      ],
      leftEnd: 5,
      rightEnd: 6,
    }

    const moves = getValidMoves(game)
    const rightMove = moves.find((m) => m.end === 'right')
    expect(rightMove?.requiresFlip).toBe(true)
  })
})

describe('Playing Tiles', () => {
  it('places first tile successfully', () => {
    const game = createGame(['Alice', 'Bob'], '1v1')
    const currentPlayerIndex = game.players.findIndex((p) => p.id === game.currentRound.currentPlayer)
    const firstTile = game.players[currentPlayerIndex]!.hand[0]!
    const initialHandSize = game.players[currentPlayerIndex]!.hand.length

    const updatedGame = playTile(game, firstTile.id, 'left')

    const updatedPlayerIndex = updatedGame.players.findIndex((p) => p.id === game.currentRound.currentPlayer)
    expect(updatedGame.players[updatedPlayerIndex]!.hand).toHaveLength(initialHandSize - 1)
    expect(updatedGame.currentRound.chain.tiles).toHaveLength(1)
    expect(updatedGame.currentRound.currentPlayer).not.toBe(game.currentRound.currentPlayer)
  })

  it('throws error for invalid tile id', () => {
    const game = createGame(['Alice', 'Bob'], '1v1')
    expect(() => playTile(game, 'invalid-id', 'left')).toThrow()
  })

  it('advances to next player after valid move', () => {
    const game = createGame(['Alice', 'Bob'], '1v1')
    const currentPlayerId = game.currentRound.currentPlayer
    const currentPlayerIndex = game.players.findIndex((p) => p.id === game.currentRound.currentPlayer)
    const firstTile = game.players[currentPlayerIndex]!.hand[0]!

    const updatedGame = playTile(game, firstTile.id, 'left')

    expect(updatedGame.currentRound.currentPlayer).not.toBe(currentPlayerId)
  })

  it('resets pass counter after successful play', () => {
    const game = createGame(['Alice', 'Bob'], '1v1')
    game.currentRound.passes = 1
    const currentPlayerIndex = game.players.findIndex((p) => p.id === game.currentRound.currentPlayer)
    const firstTile = game.players[currentPlayerIndex]!.hand[0]!

    const updatedGame = playTile(game, firstTile.id, 'left')

    expect(updatedGame.currentRound.passes).toBe(0)
  })
})

describe('Passing Turn', () => {
  it('increments pass counter', () => {
    const game = createGame(['Alice', 'Bob'], '1v1')
    // Set up scenario where current player has no valid moves
    const currentPlayerIndex = game.players.findIndex((p) => p.id === game.currentRound.currentPlayer)
    game.players[currentPlayerIndex]!.hand = [{ id: '1', left: 0, right: 0 }]
    game.currentRound.chain = {
      tiles: [
        {
          tile: { id: '2', left: 5, right: 6 },
          orientation: 'normal',
        },
      ],
      leftEnd: 5,
      rightEnd: 6,
    }

    const updatedGame = passTurn(game)
    expect(updatedGame.currentRound.passes).toBe(1)
  })

  it('throws error when valid moves exist', () => {
    const game = createGame(['Alice', 'Bob'], '1v1')
    expect(() => passTurn(game)).toThrow()
  })

  it('advances to next player', () => {
    const game = createGame(['Alice', 'Bob'], '1v1')
    const currentPlayerId = game.currentRound.currentPlayer
    const currentPlayerIndex = game.players.findIndex((p) => p.id === game.currentRound.currentPlayer)
    game.players[currentPlayerIndex]!.hand = [{ id: '1', left: 0, right: 0 }]
    game.currentRound.chain = {
      tiles: [
        {
          tile: { id: '2', left: 5, right: 6 },
          orientation: 'normal',
        },
      ],
      leftEnd: 5,
      rightEnd: 6,
    }

    const updatedGame = passTurn(game)
    expect(updatedGame.currentRound.currentPlayer).not.toBe(currentPlayerId)
  })
})

describe('Scoring', () => {
  it('calculates 2v2 scores correctly (opposing team only)', () => {
    const game = createGame(['Alice', 'Bob', 'Carol', 'Dave'], '2v2')

    // Mock hands for scoring
    // Team A: Alice (0), Carol (2)
    // Team B: Bob (1), Dave (3)
    // Assume Alice wins. Bob and Dave's tiles should be summed. Carol's should NOT.

    game.players[0]!.hand = [] // Alice wins
    game.players[1]!.hand = [{ id: 'b1', left: 5, right: 5 }] // Bob: 10 points
    game.players[2]!.hand = [{ id: 'c1', left: 1, right: 1 }] // Carol: 2 points (teammate)
    game.players[3]!.hand = [{ id: 'd1', left: 2, right: 2 }] // Dave: 4 points

    // We need to trigger finishRound. We can do this by playing the last tile for Alice.
    // But playTile requires valid move. 
    // Easier to mock the internal call or just test the logic if we exposed it.
    // Since we can't easily mock internal functions, let's simulate a game end via playTile.

    // Reset game to a state where Alice has 1 tile and plays it to win.
    const winningGame = createGame(['Alice', 'Bob', 'Carol', 'Dave'], '2v2')
    const alice = winningGame.players[0]!
    alice.hand = [{ id: 'win', left: 6, right: 6 }]
    winningGame.currentRound.currentPlayer = alice.id
    winningGame.currentRound.chain = {
      tiles: [{ tile: { id: 'start', left: 6, right: 6 }, orientation: 'normal' }],
      leftEnd: 6,
      rightEnd: 6,
      rootIndex: 0
    }

    // Set other players hands
    winningGame.players[1]!.hand = [{ id: 'b1', left: 5, right: 5 }] // 10 pts
    winningGame.players[2]!.hand = [{ id: 'c1', left: 1, right: 1 }] // 2 pts
    winningGame.players[3]!.hand = [{ id: 'd1', left: 2, right: 2 }] // 4 pts

    const finishedGame = playTile(winningGame, 'win', 'left')

    // Alice and Carol should get 10 + 4 = 14 points.
    expect(finishedGame.players[0]!.score).toBe(14)
    expect(finishedGame.players[2]!.score).toBe(14)
    expect(finishedGame.players[1]!.score).toBe(0)
    expect(finishedGame.players[3]!.score).toBe(0)
  })
})

describe('Getting Current Player', () => {
  it('returns the current player', () => {
    const game = createGame(['Alice', 'Bob'], '1v1')
    const currentPlayer = getCurrentPlayer(game)
    expect(currentPlayer).not.toBeNull()
    expect(currentPlayer?.id).toBe(game.currentRound.currentPlayer)
  })
})
