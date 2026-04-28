import { describe, expect, test } from 'vitest'
import { moveBoard } from '../../src/game/movement'
import { scoreBoard, getValidMoves, suggestMove } from '../../src/game/expectimax'
import type { Board } from '../../src/game/types'

describe('getValidMoves', () => {
    test('returns only directions that change the board', () => {
        const board: Board = [
            [2, 4, null, null],
            [8, null, null, null],
            [null, null, null, null],
            [null, null, null, null]
        ]
        expect(getValidMoves(board)).toEqual(['right', 'down'])
    })
    test('returns no moves for a lost board', () => {
        const board: Board = [
            [2, 4, 2, 4],
            [4, 2, 4, 2],
            [2, 4, 2, 4],
            [4, 2, 4, 2]
        ]
        expect(getValidMoves(board)).toEqual([])
    })
})

describe('scoreBoard', () => {
    test('scores a board with more move options better when max tile is equal', () => {
        const boardWithMoreSpace: Board = [
            [2, 4, 8, 16],
            [32, 64, null, null],
            [null, null, null, null],
            [null, null, null, null]
        ]
        const boardWithLessSpace: Board = [
            [2, 4, 8, 16],
            [32, 64, 2, 4],
            [8, 16, null, null],
            [null, null, null, null]
        ]
        expect(scoreBoard(boardWithMoreSpace)).toBeGreaterThan(scoreBoard(boardWithLessSpace))
    })
    test('scores a board with higher max tile better when shape is similar', () => {
        const lowerMaxTile: Board = [
            [16, null, null, null],
            [null, null, null, null],
            [null, null, null, null],
            [null, null, null, null]
        ]
        const higherMaxTile: Board = [
            [32, null, null, null],
            [null, null, null, null],
            [null, null, null, null],
            [null, null, null, null]
        ]
        expect(scoreBoard(higherMaxTile)).toBeGreaterThan(scoreBoard(lowerMaxTile))
    })
})

describe('suggestMove', () => {
    test('returns null when no moves are available', () => {
        const board: Board = [
            [2, 4, 2, 4],
            [4, 2, 4, 2],
            [2, 4, 2, 4],
            [4, 2, 4, 2]
        ]
        expect(suggestMove(board)).toBeNull()
    })
    test('choose an obvious merge move', () => {
        const board: Board = [
            [2, 2, null, null],
            [4, null, null, null],
            [8, null, null, null],
            [16, null, null, null]
        ]
        expect(getValidMoves(board)).toContain(suggestMove(board))
    })
    test('compare immediate merge score directly', () => {
        const board: Board = [
            [2, 2, null, null],
            [4, null, null, null],
            [4, null, null, null],
            [null, null, null, null]
        ]
        expect(moveBoard(board, 'up').scoreDelta).toBeGreaterThan(moveBoard(board, 'left').scoreDelta)
    })
    test('prefere a move with better expected future position', () => {
        const board: Board = [
            [2, 2, null, null],
            [4, null, null, null],
            [4, null, null, null],
            [null, null, null, null]
        ]
        expect(suggestMove(board)).toBe('left')
    })
    test('scores smoother boards better when large tiles are arranged together', () => {
        const smoothBoard: Board = [
            [1024, 512, null, null],
            [256, 128, null, null],
            [64, 32, null, null],
            [16, 8, null, null]
        ]
        const roughBoard: Board = [
            [1024, 8, null, null],
            [16, 512, null, null],
            [256, 32, null, null],
            [64, 128, null, null]
        ]
        expect(scoreBoard(smoothBoard)).toBeGreaterThan(scoreBoard(roughBoard))
    })
    test('rewards keeping the largest tile in a corner', () => {
        const cornerBoard: Board = [
            [128, 2, 4, 8],
            [16, 32, 64, 2],
            [4, 8, 16, 32],
            [2, 4, 8, 16],
        ]
        const middleBoard: Board = [
            [16, 2, 4, 8],
            [16, 32, 128, 2],
            [4, 8, 16, 32],
            [2, 4, 8, 16],
        ]
        expect(scoreBoard(cornerBoard)).toBeGreaterThan(scoreBoard(middleBoard))
    })
})