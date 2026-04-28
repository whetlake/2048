import { getEmptyPositions } from './spawning'
import { getMaxTile } from './helpers'
import type { Board, Direction } from './types'

export function buildOllamaAdvisorPrompt(board: Board, validMoves: Direction[]): string {
    const promptContext = {
        board,
        validMoves,
        maxTile: getMaxTile(board),
        emptyCells: getEmptyPositions(board).length
    }

    return [
        'You are advising the next move in a 2048 game.',
        'Choose one move that avoids game over and maximizes the chance of reaching 2048.',
        'Use only one of the valid moves provided in the JSON context.',
        `Game context: ${JSON.stringify(promptContext)}`,
        'Reply with JSON only using the format, for example: {"move":"left"}'
    ].join('\n')
}

export function parseOllamaResponse(content: string, validMoves: Direction[]): Direction | null {
    try {
        const parsed = JSON.parse(content) as { move?: unknown }
        if (typeof parsed.move !== 'string') return null
        return validMoves.includes(parsed.move as Direction) ? parsed.move as Direction : null
    } catch {
        return null
    }
}