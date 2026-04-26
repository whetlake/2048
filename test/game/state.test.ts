import { describe, expect, test } from "vitest"
import { createInitialState, playTurn } from '../../src/game/state'
import { fakeRandomSequence } from "../helpers/fakeRandomSequence"

describe('createInitialState', () => {
    test('creates a board with two random 2 tiles', () => {
        const random = fakeRandomSequence([0, 0, 0])
        expect(createInitialState(random)).toEqual({
            board: [
                [2, 2, null, null],
                [null, null, null, null],
                [null, null, null, null],
                [null, null, null, null]
            ],
            score: 0,
            status: 'playing'
        })
    })
    test('create a board with four random 2 tiles', () => {
        const random = fakeRandomSequence([0.99, 0, 0, 0, 0]) // 0.99 creates four tiles; each following 0 picks the first remaining empty cell.
        expect(createInitialState(random)).toEqual({
            board: [
                [2, 2, 2, 2],
                [null, null, null, null],
                [null, null, null, null],
                [null, null, null, null]
            ],
            score: 0,
            status: 'playing'
        })
    })
})

describe('playNextTurn', () => {
    test('plays a valid turn by moving, spawning, and updating score', () => {
        const state = {
            board: [
                [null, 8, 2, 2],
                [4, 2, null, 2],
                [null, null, null, null],
                [null, null, null, 2]
            ],
            score: 10,
            status: 'playing' as const
        }
        const random = fakeRandomSequence([0.6, 0.5]) // pick last empty with value 2
        expect(playTurn(state, 'up', random)).toEqual({
            board: [
                [4, 8, 2, 4],
                [null, 2, null, 2],
                [null, null, null, null],
                [2, null, null, null]
            ],
            score: 14,
            status: 'playing'
        })
    })
    test('does not spawn when move does not change the board', () => {
        const state = {
            board: [
                [2, 4, null, null],
                [8, null, null, null],
                [null, null, null, null],
                [null, null, null, null]
            ],
            score: 10,
            status: 'playing' as const
        }
        expect(playTurn(state, 'left', fakeRandomSequence([0, 0.5]))).toEqual(state)
    })
})