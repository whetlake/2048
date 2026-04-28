import { getEmptyPositions } from './spawning'
import { getMaxTile } from './helpers'
import type { Board, Direction } from './types'

export type OllamaChatResponse = {
    message?: {
        content?: unknown
    }
}

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
        'Reply with one JSON object only. It must contain exactly one property named "move". The value must be one of the validMoves strings from the game context. Do not include explanation, markdown, or thinking text.'
    ].join('\n')
}

export function parseOllamaResponse(content: string, validMoves: Direction[]): Direction | null {
    try {
        const parsed = JSON.parse(content) as { move?: unknown }
        if (typeof parsed.move !== 'string') return null
        const move = parsed.move.trim().toLowerCase()
        return validMoves.includes(move as Direction) ? move as Direction : null
    } catch {
        return null
    }
}

export async function requestOllamaMove(endpoint: string, model: string, board: Board, validMoves: Direction[]): Promise<Direction | null> {
  const prompt = buildOllamaAdvisorPrompt(board, validMoves)
  const response = await fetch(`${endpoint.replace(/\/$/, '')}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      stream: false,
      format: 'json',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })
  })
  if (!response.ok) { throw new Error(`Ollama request failed with status ${response.status}`) }
  const data = await response.json() as OllamaChatResponse
  const content = data.message?.content
  if (typeof content !== 'string') return null
  return parseOllamaResponse(content, validMoves)
}