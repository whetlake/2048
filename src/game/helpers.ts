import { getEmptyPositions } from "./spawning"
import type { Board, Cell } from "./types"

export function isTile(cell: Cell): cell is number {
    return cell !== null
}

export function getSearchDepth(board: Board): number {
    const emptyCells = getEmptyPositions(board).length
    if (emptyCells >= 10) return 2
    if (emptyCells >= 6) return 3
    if (emptyCells >= 3) return 4
    return 5
}