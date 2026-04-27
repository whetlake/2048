import './style.css'
import { createInitialState, playTurn } from './game/state'
import type { Board, Cell, Direction, GameState } from './game/types'

const controls: Record<string, Direction> = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'up',
  ArrowDown: 'down'
}

function getAppRoot(): HTMLDivElement {
  const app = document.querySelector<HTMLDivElement>('#app')
  if (!app) { throw new Error('App root not found')}
  return app
}

const app = getAppRoot()

let state: GameState = createInitialState(Math.random)

render()

window.addEventListener('keydown', handleKeyDown)

function render(): void {
  app.innerHTML = renderGame(state)
  bindEvents()
}

function handleKeyDown(event: KeyboardEvent): void {
  const direction = controls[event.key]
  if (!direction || state.status !== 'playing') return
  event.preventDefault()
  state = playTurn(state, direction, Math.random)
  render()
}

function renderGame(state: GameState): string {
  return `
    <main class="app">
      <section class="game-shell">
        ${renderHeader(state)}
        <div class="game-layout">
          ${renderBoard(state.board)}
          ${renderAdvisor()}
        </div>
      </section>
    </main>
  `
}

function renderHeader(state: GameState): string {
  return `
    <header class="game-header">
      <div>
        <h1>2048</h1>
        <p class="status status-${state.status}">${getStatusText(state.status)}</p>
      </div>
      <div class="game-actions">
        <div class="score">
          <span>Score</span>
          <strong>${state.score}</strong>
        </div>
        <button id="new-game" class="new-game" type="button">New</button>
      </div>
    </header>
  `
}

function renderBoard(board: Board): string {
  return `
    <section class="board" aria-label="Game board">
      ${board.map((row) => row.map(renderTile).join('')).join('')}
    </section>
  `
}

function renderTile(cell: Cell): string {
  const value = cell === null ? '' : String(cell)
  const sizeClass = cell === null ? '' : ` tile-digits-${Math.min(value.length, 5)}`
  return `<div class="tile${sizeClass}" data-value="${cell ?? 'empty'}">${value}</div>`
}

function renderAdvisor(): string {
  return `
    <aside class="advisor">
      <h2>Advisor</h2>
      <p>Use arrow keys to move. Demo states available below.</p>
      <div class="demo-actions">
        <button id="pre-won" type="button">Pre-won</button>
        <button id="pre-lost" type="button">Pre-lost</button>
      </div>
    </aside>
  `
}

function bindEvents(): void {
  app.querySelector<HTMLButtonElement>('#new-game')?.addEventListener('click', () => {
    state = createInitialState(Math.random)
    render()
  })
  app.querySelector<HTMLButtonElement>('#pre-won')?.addEventListener('click', () => {
    state = createPreWonState()
    render()
  })
  app.querySelector<HTMLButtonElement>('#pre-lost')?.addEventListener('click', () => {
    state = createPreLostState()
    render()
  })
}

function getStatusText(status: GameState['status']): string {
  if (status === 'won') return 'You won'
  if (status === 'lost') return 'Game over'
  return 'Playing'
}

function createPreWonState(): GameState {
  return {
    board: [
      [1024, 1024, null, null],
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 2, 4, 8],
    ],
    score: 0,
    status: 'playing',
  }
}

function createPreLostState(): GameState {
  return {
    board: [
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, null, 2, 4],
    ],
    score: 0,
    status: 'playing',
  }
}