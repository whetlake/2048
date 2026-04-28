import type { Board, Direction, MoveResult, Cell } from './types'
import { isTile } from './helpers'
import { BOARD_SIZE } from './constants'

export function moveBoard(board: Board, direction: Direction): MoveResult {
    assertValidBoard(board)
    let scoreDelta = 0
    // Prepare for move left
    let movedBoard = board
    if (direction === 'right') {
        movedBoard = reverseRows(board)
    } else if (direction === 'up') {
        movedBoard = transpose(movedBoard)
    } else if (direction === 'down') {
        movedBoard = reverseRows(transpose(movedBoard))
    }
    // Move left
    const movedRows = movedBoard.map((row) => moveRowLeft(row))
    movedBoard = movedRows.map((result) => result.row)
    scoreDelta = movedRows.reduce((total, result) => total + result.scoreDelta, 0)
    // Restore to original direction
    if (direction === 'right') {
        movedBoard = reverseRows(movedBoard)
    } else if (direction === 'up') {
        movedBoard = transpose(movedBoard)
    } else if (direction === 'down') {
        movedBoard = transpose(reverseRows(movedBoard))
    }
    return {
        board: movedBoard,
        scoreDelta,
        changed: !boardsEqual(board, movedBoard)
    }
}

// Slides non-empty tiles left, merges equal neighbouring cells once and then
// pads  empty cells with nulls
function moveRowLeft(row: Cell[]): { row: Cell[]; scoreDelta: number } {
    const tiles = row.filter(isTile)
    const mergedRow: Cell[] = []
    let scoreDelta = 0
    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i] === tiles[i+1]) {
            const merged = tiles[i] * 2
            mergedRow.push(merged)
            scoreDelta += merged
            i += 1
        } else {
            mergedRow.push(tiles[i])
        }
    }
    while (mergedRow.length < row.length) {
        mergedRow.push(null)
    }
    return {
        row: mergedRow,
        scoreDelta
    }
}

/*
Transformation functions
*/

// used for 'right'
function reverseRows(board: Board): Board {
    return board.map((row) => [...row].reverse())
}

// used for 'up' and 'down'
function transpose(board: Board): Board {
    return board[0].map((_, columnIndex) => board.map((row) => row[columnIndex]))
}

/*
Helper functions
*/

function boardsEqual(a: Board, b: Board): boolean {
    return a.every((row, rowIndex) =>
        row.every((cell, columnIndex) => cell === b[rowIndex][columnIndex]),
    )
}

function assertValidBoard(board: Board): void {
    if (board.length !== BOARD_SIZE) {
        throw new Error(`Board must have ${BOARD_SIZE} rows`)
    }
    for (const row of board) {
        if (row.length !== BOARD_SIZE) {
            throw new Error(`Board rows must have ${BOARD_SIZE} cells`)
        }
    }
}