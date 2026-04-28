import { describe, expect, test } from 'vitest'
import { buildOllamaAdvisorPrompt, parseOllamaResponse } from '../../src/game/ollamaAdvisor'
import type { Board, Direction } from '../../src/game/types'

describe('buildOllamaAdvisorPrompt', () => {
    test('includes the board and valid moves in json', () => {
        const board: Board = [
            [2, 2, null, null],
            [4, null, null, null],
            [null, null, null, null],
            [null, null, null, null]
        ]
        const validMoves: Direction[] = ['left', 'right']
        const prompt = buildOllamaAdvisorPrompt(board, validMoves)
        expect(prompt).toContain(JSON.stringify(board))
        expect(prompt).toContain(JSON.stringify(validMoves))
        expect(prompt).toContain('validMoves')
        expect(prompt).toContain('maxTile')
        expect(prompt).toContain('emptyCells')
        expect(prompt).toContain('JSON')
    })
})

describe('parseOllamaResponse', () => {
    test('parses a valid JSON move', () => {
        expect(parseOllamaResponse('{"move":"left"}', ['left', 'right'])).toBe('left')
    })
    test('rejects a move that is not valid for the current board', () => {
        expect(parseOllamaResponse('{"move":"up"}', ['left', 'right'])).toBeNull()
    })
    test('returns null for invalid JSON', () => {
        expect(parseOllamaResponse('move left', ['left', 'right'])).toBeNull()
    })
})