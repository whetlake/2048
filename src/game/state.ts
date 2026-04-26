import { BOARD_SIZE } from "./constants"
import { getEmptyPositions, spawnTile } from "./spawning"
import type { Board, GameState } from "./types"

export function createInitialState(random: () => number): GameState {
    let board = createEmptyBoard()
    const tileCount = 2 + Math.floor(random() * 3)
    for (let count = 0; count < tileCount; count += 1) {
        const emptyPositions = getEmptyPositions(board)
        const randomPositionIndex = Math.floor(random() * emptyPositions.length)
        const position = emptyPositions[randomPositionIndex]
        board = spawnTile(board, position, 2) // always span 2
    }
    return {
        board,
        score: 0,
        status: 'playing',
    }
}

/*
Helpers
*/

function createEmptyBoard(): Board {
    return Array.from({length: BOARD_SIZE}, () =>
        Array.from({length: BOARD_SIZE}, () => null)
    )
}