import { moveBoard } from './movement'
import { getEmptyPositions, spawnTile } from './spawning'
import { getSearchDepth, isTile } from './helpers'
import { DIRECTIONS } from './types'
import type { Board, Direction } from './types'
import { EMPTY_CELL_WEIGHT, MAX_TILE_WEIGHT, VALID_MOVE_WEIGHT, SMOOTHNESS_WEIGHT } from './constants'

export function getValidMoves(board: Board): Direction[] {
    return DIRECTIONS.filter((direction) => moveBoard(board, direction).changed)
}

export function scoreBoard(board: Board): number {
    const emptyCells = getEmptyPositions(board).length
    const maxTile = getMaxTile(board)
    const validMoves = getValidMoves(board).length
    const smoothnessPenalty = getSmoothnessPenalty(board)
    // Heuristic for expectimax states where we reward space, tile progression and flexibility of the moves
    return emptyCells * EMPTY_CELL_WEIGHT + maxTile * MAX_TILE_WEIGHT + validMoves * VALID_MOVE_WEIGHT - smoothnessPenalty * SMOOTHNESS_WEIGHT
}

function getMaxTile(board: Board): number {
    const tiles = board.flat().filter(isTile)
    return tiles.length === 0 ? 0 : Math.max(...tiles)
}

export function scoreMove(board: Board, direction: Direction, depth: number = getSearchDepth(board)): number {
    const move = moveBoard(board, direction)
    if (!move.changed) return Number.NEGATIVE_INFINITY
    return move.scoreDelta + scoreAfterRandomSpawn(move.board, depth -1)
}

export function suggestMove(board: Board): Direction | null {
    const validMoves = getValidMoves(board)
    if (validMoves.length === 0) return null
    const depth = getSearchDepth(board)
    let bestMove = validMoves[0]
    let bestScore = Number.NEGATIVE_INFINITY
    for (const direction of validMoves) {
        const moveScore = scoreMove(board, direction, depth)
        if (moveScore > bestScore) {
            bestMove = direction; bestScore = moveScore
        }
    }
    return bestMove
}

function scoreAfterRandomSpawn(board: Board, depth: number): number {
    if (depth <= 0) return scoreBoard(board)
    const emptyPositions = getEmptyPositions(board)
    if (emptyPositions.length === 0) return scoreBoard(board)
    let totalScore = 0
    for (const position of emptyPositions) {
        totalScore += scoreSpawnOutcome(board, position, 2, depth) * 0.9
        totalScore += scoreSpawnOutcome(board, position, 4, depth) * 0.1
    }
    return totalScore / emptyPositions.length
}

function scoreSpawnOutcome(board: Board, position: number, value: 2 | 4, depth: number): number {
    const spawnedBoard = spawnTile(board, position, value)
    const validMoves = getValidMoves(spawnedBoard)
    if (validMoves.length === 0) return scoreBoard(spawnedBoard)
    return Math.max(...validMoves.map((direction) => scoreMove(spawnedBoard, direction, depth)))
}

function getSmoothnessPenalty(board: Board): number {
    let penalty = 0
    for (let rowIndex = 0; rowIndex < board.length; rowIndex += 1) {
        for (let columnIndex = 0; columnIndex < board[rowIndex].length; columnIndex += 1) {
            const cell = board[rowIndex][columnIndex]
            if (cell === null) continue
            const rightCell = board[rowIndex][columnIndex + 1]
            const downCell = board[rowIndex + 1]?.[columnIndex]
            if (rightCell !== null && rightCell !== undefined) {
                penalty += Math.abs(cell - rightCell)
            }
            if (downCell !== null && downCell !== undefined) {
                penalty += Math.abs(cell - downCell)
            }
        }
    }
    return penalty
}