import { describe, expect, test } from 'vitest'
import { getGameStatus } from '../../src/game/status'
import type { Board } from '../../src/game/types'

describe('getGameStatus', () => {
    test('detects a won board', () => {
        const board: Board = [
            [4, null, null, 2],
            [2048, null, null, null],
            [4, 2, null, null],
            [4, null, null, null]
        ]
        expect(getGameStatus(board)).toBe('won')
    })
    test('empty cells exist, keep playing', () => {
        const board: Board = [
            [2, 4, 2, 4],
            [4, null, 4, 2],
            [2, 4, 2, 4],
            [4, 2, 4, 2]
        ]
        expect(getGameStatus(board)).toBe('playing')
    })
    test('full board, merge exist, keep playing', () => {
        const board: Board = [
            [2, 2, 4, 8],
            [16, 32, 64, 128],
            [256, 512, 1024, 2],
            [4, 8, 16, 32]
        ]
        expect(getGameStatus(board)).toBe('playing')
    })
    test('detect game is lost', () => {
        const board: Board = [
            [2, 4, 2, 4],
            [4, 2, 4, 2],
            [2, 4, 2, 4],
            [4, 2, 4, 2]
        ]
        expect(getGameStatus(board)).toBe('lost')
    })
})