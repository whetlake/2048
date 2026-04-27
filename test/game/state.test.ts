import { describe, expect, test } from "vitest"
import { createInitialState, playTurn } from '../../src/game/state'
import { fakeRandomSequence } from "../helpers/fakeRandomSequence"
import { GameState } from "../../src/game/types"

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

describe('playTurn', () => {
    test('plays a valid turn by moving, spawning, and updating score', () => {
        const state: GameState = {
            board: [
                [null, 8, 2, 2],
                [4, 2, null, 2],
                [null, null, null, null],
                [null, null, null, 2]
            ],
            score: 10,
            status: 'playing'
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
        const state: GameState = {
            board: [
                [2, 4, null, null],
                [8, null, null, null],
                [null, null, null, null],
                [null, null, null, null]
            ],
            score: 10,
            status: 'playing'
        }
        expect(playTurn(state, 'left', fakeRandomSequence([0, 0.5]))).toEqual(state)
    })
    test('game won after reaching 2048', () => {
        const state: GameState = {
            board: [
                [1024, 1024, null, null],
                [2, 4, 8, 16],
                [32, 64, 128, 256],
                [512, 2, 4, 8]
            ],
            score: 0,
            status: 'playing'
        }
        const random = fakeRandomSequence([0, 0.5])
        expect(playTurn(state, 'left', random).status).toBe('won')
    })
    test('game lost, no moves left', () => {
        const state: GameState = {
            board: [
                [2, 4, 2, 4],
                [4, 2, 4, 2],
                [2, 4, 2, 4],
                [4, null, 2, 4]
            ],
            score: 0,
            status: 'playing'
        }
        const random = fakeRandomSequence([0, 0.5])
        expect(playTurn(state, 'left', random)).toEqual({
            board: [
                [2, 4, 2, 4],
                [4, 2, 4, 2],
                [2, 4, 2, 4],
                [4, 2, 4, 2]
            ],
            score: 0,
            status: 'lost'
        })
    })
})