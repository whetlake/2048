export type Cell = number | null
export type Board = Cell[][]

export const DIRECTIONS = ['left', 'right', 'up', 'down'] as const
export type Direction = typeof DIRECTIONS[number]
export type MoveResult = {
    board: Board,
    scoreDelta: number,
    changed: boolean // is required because the board can change without an actual merge
}
export type GameStatus = 'playing' | 'won' | 'lost'
export type GameState = {
    board: Board
    score: number
    status: GameStatus
}