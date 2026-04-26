import { describe, expect, test } from 'vitest'
import movementCases from '../fixtures/movement-cases.json'
import { moveBoard } from '../../src/game/movement'

describe('moveBoard', () => {
    test.each(movementCases)('$name', ({ before, direction, after, scoreDelta, changed }) => {
        const afterMove = moveBoard(before, direction)
        expect(afterMove.board).toEqual(after)
        expect(afterMove.scoreDelta).toBe(scoreDelta)
        expect(afterMove.changed).toBe(changed)
    })
})