import { describe, expect, test } from "vitest"
import { createInitialState } from '../../src/game/state'
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