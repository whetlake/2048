import readline from 'node:readline'
import { stdin } from 'node:process'
import { createInitialState, playTurn } from "./game/state"
import type { Board, Direction, GameState } from "./game/types"

const reset = '\x1b[0m' // ANSI escape codes keep the CLI dependency free
const bold = '\x1b[1m'
const cyan = '\x1b[36m'
const green = '\x1b[32m'
const red = '\x1b[31m'
const yellow = '\x1b[33m'

const controls: Record<string, Direction> = {
    left: 'left',
    right: 'right',
    up: 'up',
    down: 'down'
}

const playingHelpText = 'Use arrow keys to move. Press u to undo, n for new game, or q/Esc/Ctrl+C/Ctrl+Z to quit.'
const finishedHelpText = 'Press n for new game, or q/Esc/Ctrl+C/Ctrl+Z to quit.'

let state = createInitialState(Math.random)

// Game states are immutable, so undo can keep previous states
const history: GameState[] = []
readline.emitKeypressEvents(stdin)

// Raw mode lets the CLI react to arrow keys as individual key presses,
// without having to press Enter
if (stdin.isTTY) { stdin.setRawMode(true) }

render()

stdin.on('keypress', (_, key) => {
    if (key.name === 'q' || (key.ctrl && key.name === 'c') || key.name === 'escape' || (key.ctrl && key.name === 'z')) {
        exit()
        return
    }
    if (key.name === 'u') {
        const previousState = history.pop()
        if (previousState) {
            state = previousState
            render()
        }
        return
    }
    if (key.name === 'n') {
        state = createInitialState(Math.random)
        history.length = 0
        render()
        return
    }
    const direction = controls[key.name]
    if (direction && state.status === 'playing') {
        const nextState = playTurn(state, direction, Math.random)
        if (nextState !== state) {
            history.push(state)
            state = nextState
            render()
        }
    }
})

function render(): void {
    console.clear()
    console.log(paint(`Score: ${state.score}`, bold))
    if (state.status === "won") { console.log(paint(`Status: ${state.status}`, green)) }
    else if (state.status === "lost") { console.log(paint(`Status: ${state.status}`, red)) }
    else { console.log(paint(`Status: ${state.status}`, yellow)) }
    printBoard(state.board)
    if (state.status === 'playing') {
        console.log(playingHelpText)
    } else {
        console.log(finishedHelpText)
    }
}

function exit(): void {
    if (stdin.isTTY) { stdin.setRawMode(false)}
    process.exit(0)
}

function printBoard(board: Board): void {
    const line = "+------+------+------+------+"
    console.log(paint(line, cyan))
    for (const row of board) {
        const cells = row.map((cell) => {
            const value = cell === null ? '' : String(cell)
            return value.padStart(4, ' ')
        })
        console.log(paint(`| ${cells.join(' | ')} |`, cyan))
        console.log(paint(line, cyan))
    }
}

function paint(text: string, color: string): string {
    return `${color}${text}${reset}`
}