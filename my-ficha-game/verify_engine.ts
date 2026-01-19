
import { createGame, playTile } from './src/engine/game';

console.log('--- Starting Engine Verification ---');

// 1. Create Game
const game = createGame(['P1', 'P2', 'P3', 'P4'], '2v2');
console.log('Game created. Players:', game.players.length);
console.log('Current Player:', game.currentRound.currentPlayer);

const startingPlayerId = game.currentRound.currentPlayer;
const startingPlayer = game.players.find(p => p.id === startingPlayerId);

if (!startingPlayer) {
    console.error('Starting player not found!');
    process.exit(1);
}

console.log(`Starting Player: ${startingPlayer.name} (${startingPlayerId})`);

// 2. Find a valid move (first move)
// The starting player usually has the highest double or is just set to start.
// Any tile is valid for the first move.
const tileToPlay = startingPlayer.hand[0];
console.log(`Playing tile: ${tileToPlay.left}|${tileToPlay.right} (ID: ${tileToPlay.id})`);

// 3. Play the tile
try {
    const nextState = playTile(game, tileToPlay.id, 'left');
    console.log('Tile played successfully.');

    // 4. Verify State Update
    console.log('--- Post-Move Verification ---');

    // Check Chain
    console.log('Chain length:', nextState.currentRound.chain.tiles.length);
    if (nextState.currentRound.chain.tiles.length !== 1) {
        console.error('FAIL: Chain should have 1 tile.');
    } else {
        console.log('PASS: Chain has 1 tile.');
    }

    // Check Hand
    const updatedPlayer = nextState.players.find(p => p.id === startingPlayerId);
    if (updatedPlayer.hand.length !== startingPlayer.hand.length - 1) {
        console.error('FAIL: Player hand did not decrease.');
    } else {
        console.log('PASS: Player hand decreased by 1.');
    }

    // Check Turn
    console.log('Previous Player:', startingPlayerId);
    console.log('New Current Player:', nextState.currentRound.currentPlayer);

    if (nextState.currentRound.currentPlayer === startingPlayerId) {
        console.error('FAIL: Turn did not pass! Player is still the same.');
    } else {
        console.log('PASS: Turn passed to new player.');
    }

} catch (e) {
    console.error('Error playing tile:', e);
}
