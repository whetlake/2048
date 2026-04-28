import './style.css'
import { createInitialState, playTurn } from './game/state'
import type { Board, Cell, Direction, GameState } from './game/types'
import { getValidMoves, suggestMove } from './game/expectimax'
import { requestOllamaMove } from './game/ollamaAdvisor'

const controls: Record<string, Direction> = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'up',
  ArrowDown: 'down'
}

const directionSymbols: Record<Direction, string> = {
    left: '←',
    right: '→',
    up: '↑',
    down: '↓'
}

const minSwipeDistance = 30 // required for mobile drag direction
let pointerStart: { x: number; y: number} | null = null

function getAppRoot(): HTMLDivElement {
  const app = document.querySelector<HTMLDivElement>('#app')
  if (!app) { throw new Error('App root not found')}
  return app
}

const app = getAppRoot()

let state: GameState = createInitialState(Math.random)
let suggestedMove: Direction | null = null
let advisorAsked = false
let advisorThinking = false
let ollamaEndpoint = 'http://localhost:11434'
let ollamaModel = 'qwen2-math'
let ollamaAsked = false
let ollamaStatus = ''
let ollamaThinking = false
let ollamaSuggestedMove: Direction | null = null

render()

window.addEventListener('keydown', handleKeyDown)

function render(): void {
  app.innerHTML = renderGame(state)
  bindEvents()
}

function handleKeyDown(event: KeyboardEvent): void {
  const direction = controls[event.key]
  if (!direction) return
  event.preventDefault()
  playDirection(direction)
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
  const suggestionText = advisorThinking
    ? '<span class="advisor-thinking">Thinking...</span>'
    : !advisorAsked
      ? '?'
      : suggestedMove === null
        ? '-'
        : directionSymbols[suggestedMove]
  return `
    <aside class="advisor">
      <h2>Advisor</h2>
      <p class="advisor-suggestion">Suggested move: <strong>${suggestionText}</strong></p>
      <button id="ask-advisor" class="advisor-button" type="button" ${advisorThinking ? 'disabled' : ''}>Ask advisor</button>
      <p>Use arrow keys to move. Demo states available below.</p>
      ${renderOllamaAdvisor()}
      <div class="demo-actions">
        <button id="pre-won" type="button">Pre-won</button>
        <button id="pre-lost" type="button">Pre-lost</button>
      </div>
    </aside>
  `
}

function renderOllamaAdvisor(): string {
  const ollamaSuggestionText = ollamaThinking
    ? 'Thinking...'
    : !ollamaAsked
      ? '?'
      : ollamaSuggestedMove === null
        ? '-'
        : directionSymbols[ollamaSuggestedMove]
  return `
    <section class="llm-advisor">
      <h3>Ollama advisor</h3>
      <p class="ollama-suggestion">Suggested move: <strong>${ollamaSuggestionText}</strong></p>
      <label class="llm-field">
        Endpoint
        <input id="ollama-endpoint" type="url" value="${escapeHtml(ollamaEndpoint)}">
      </label>
      <label class="llm-field">
        Model
        <input id="ollama-model" type="text" value="${escapeHtml(ollamaModel)}">
      </label>
      <button id="ask-ollama" class="advisor-button" type="button" ${ollamaThinking ? 'disabled' : ''}>Ask Ollama</button>
      <p class="llm-note">Uses a local Ollama server. No API key is required or stored.</p>
      ${ollamaStatus ? `<p class="llm-status">${escapeHtml(ollamaStatus)}</p>` : ''}
    </section>
  `
}

// Event handling including key events, swipe events, advisor events
function bindEvents(): void {
  app.querySelector<HTMLButtonElement>('#new-game')?.addEventListener('click', () => {
    state = createInitialState(Math.random)
    resetAdvisors()
    render()
  })
  const gameShell = app.querySelector<HTMLElement>('.game-shell')
  gameShell?.addEventListener('pointerdown', handlePointerDown)
  gameShell?.addEventListener('pointerup', handlePointerUp)
  app.querySelector<HTMLButtonElement>('#ask-advisor')?.addEventListener('click', async () => {
    advisorAsked = true
    advisorThinking = true
    suggestedMove = null
    render()

    await waitForPaint()
    
    suggestedMove = suggestMove(state.board)
    advisorThinking = false
    render()
  })
  const endpointInput = app.querySelector<HTMLInputElement>('#ollama-endpoint')
  endpointInput?.addEventListener('input', () => { ollamaEndpoint = endpointInput.value })
  const modelInput = app.querySelector<HTMLInputElement>('#ollama-model')
  modelInput?.addEventListener('input', () => { ollamaModel = modelInput.value })
  app.querySelector<HTMLButtonElement>('#ask-ollama')?.addEventListener('click', async () => {
    ollamaAsked = true
    ollamaThinking = true
    ollamaStatus = ''
    ollamaSuggestedMove = null
    render()
    try {
      const validMoves = getValidMoves(state.board)
      ollamaSuggestedMove = await requestOllamaMove(ollamaEndpoint, ollamaModel, state.board, validMoves)
    } catch {
      ollamaStatus = 'Could not connect to Ollama'
    } finally {
      ollamaThinking = false
      render()
    }
  })
  // TODO: WE CAN REMOVE THE DEMO TO TEST WIN AND LOSE
  app.querySelector<HTMLButtonElement>('#pre-won')?.addEventListener('click', () => {
    state = createPreWonState()
    resetAdvisors()
    render()
  })
  app.querySelector<HTMLButtonElement>('#pre-lost')?.addEventListener('click', () => {
    state = createPreLostState()
    resetAdvisors()
    render()
  })
}

function getStatusText(status: GameState['status']): string {
  if (status === 'won') return 'You won'
  if (status === 'lost') return 'Game over'
  return 'Playing'
}

function playDirection(direction: Direction): void {
  if (state.status !== 'playing') return
  state = playTurn(state, direction, Math.random)
  resetAdvisors()
  render()
}

function handlePointerDown(event: PointerEvent): void {
  pointerStart = {
    x: event.clientX,
    y: event.clientY
  }
}

function handlePointerUp(event: PointerEvent): void {
  if (!pointerStart) return
  const deltaX = event.clientX - pointerStart.x
  const deltaY = event.clientY - pointerStart.y
  pointerStart = null
  if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < minSwipeDistance) return
  const direction: Direction =
    Math.abs(deltaX) > Math.abs(deltaY)
      ? deltaX > 0 ? 'right' : 'left'
      : deltaY > 0 ? 'down' : 'up'
  playDirection(direction)
}

/*
Local helper functions
*/

// This is useful, because Safari struggled with painting the thinking
function waitForPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve())
    })
  })
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function resetAdvisors(): void {
  suggestedMove = null
  advisorAsked = false
  advisorThinking = false
  ollamaAsked = false
  ollamaThinking = false
  ollamaSuggestedMove = null
  ollamaStatus = ''
}

/*
Useful demo functions below to test different states like lost and won
*/

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