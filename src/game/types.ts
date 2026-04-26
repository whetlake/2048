export type Cell = number | null
export type Board = Cell[][]
export type Direction = 'left' | 'right' | 'up' | 'down'
export type MoveResult = {
    board: Board,
    scoreDelta: number,
    changed: boolean // is required because the board can change without merge
}