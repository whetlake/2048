import type { Board } from './types'
import { BOARD_SIZE } from './constants'

export function getEmptyPositions(board: Board): number[] {
    return board.flatMap((row, rowIndex) =>
        row.flatMap((cell, columnIndex) =>
            cell === null ? [rowIndex * BOARD_SIZE + columnIndex] : []
        )
    )
}

export function positionToCoordinates(i: number): { row: number, column: number } {
    return {
        row: Math.floor(i / BOARD_SIZE),
        column: i % BOARD_SIZE
    }
}

export function spawnTile(board: Board, position: number, value: 2 | 4): Board {
    const { row, column } = positionToCoordinates(position)
    if (board[row][column] !== null) {
        throw new Error('Cannot spawn tile on occupied cell')
    }
    const nextBoard = board.map((boardRow) => [...boardRow])
    nextBoard[row][column] = value
    return nextBoard
}

export function spawnRandomTile(board: Board, random: () => number): Board {
    const emptyPositions = getEmptyPositions(board)
    if (emptyPositions.length === 0) { return board }
    const randomPositionIndex = Math.floor(random() * emptyPositions.length)
    const position = emptyPositions[randomPositionIndex]
    const value = random() < 0.9 ? 2 : 4 // 90% of time return 2, otherwise 4
    return spawnTile(board, position, value)
}