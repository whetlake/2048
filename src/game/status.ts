import { moveBoard } from "./movement";
import { getEmptyPositions } from "./spawning";
import { DIRECTIONS, type Board, type GameStatus } from "./types";

export function getGameStatus(board: Board): GameStatus {
    if (hasWinningTile(board)) { return 'won' }
    if (getEmptyPositions(board).length > 0) { return 'playing'}
    if (hasAvailableMerge(board)) { return 'playing' }
    return 'lost'
}

function hasWinningTile(board: Board): boolean {
    return board.some((row) => row.some((cell) => cell === 2048))
}

function hasAvailableMerge(board: Board): boolean {
    return DIRECTIONS.some((direction) => moveBoard(board, direction).changed)
}