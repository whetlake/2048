# 2048

A TypeScript implementation of 2048.

The main version runs in the browser. The project also includes tests for the game rules, a small CLI version with autoplay, and two ways to ask for a suggested move (two independent advisors).

## Play online

The game is available on GitHub Pages:

https://whetlake.github.io/2048/

## Requirements

- Node.js 24+
- pnpm

## Run locally for development

Clone the repository:

```bash
git clone https://github.com/whetlake/2048.git
cd 2048
```

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Vite prints a local URL, usually `http://localhost:5173`.

## How to play

Use the arrow keys on desktop.

On mobile, swipe on the board to move tiles.

The goal is to create a `2048` tile. The game ends when `2048` is reached or when no valid moves remain.

## Tests

Run the test suite:

```bash
pnpm test
```

The tests focus on the game rules: movement, merging, spawning, scoring, win/loss detection, and advisor behaviour (system prompt checks). All tests should pass.

## Build

Create a production build:

```bash
pnpm build
```

The project builds to static files and does not require a backend service to run.

Preview the production build locally:

```bash
pnpm preview
```

`pnpm dev` is for development. It serves the source files and updates quickly while editing.

`pnpm preview` serves the finished `dist` build. Use it to check the same files that would be deployed as a static site.

## CLI mode

The game can also be played in the terminal:

```bash
pnpm cli
```

There is also an autoplay mode for checking how the offline advisor plays:

```bash
pnpm cli -- --auto
```

## Move advisors

The browser UI has two advisor options.

The offline advisor uses an expectimax-style search. It is the offline AI option that searches possible moves and random tile outcomes, then chooses the move with the best expected board score. The score is based on a few practical 2048 heuristics: keeping empty cells available, taking useful merge points, keeping several move directions open, avoiding large jumps between neighbouring tiles, and favouring boards where the largest tile stays in a corner. It works without credentials or network access.

In my local autoplay testing around a dozen times, this advisor won about 80% of the time. Hence this is only a quick check of the current heuristic, not a guarantee.

The Ollama advisor can be used with a locally running model. It requires Ollama to be running and a model to be downloaded or otherwise available locally. No credentials are included in the project.

In testing, I often saw `qwen2-math` disagree with the expectimax advisor. I left both options visible because it is useful to compare a deterministic game search against a general local language model.

To try the Ollama advisor:

1. Install Ollama
2. Pull a local model
3. Start Ollama
4. Enter the local Ollama endpoint and model name in the UI
5. Ask for a suggestion

Example endpoint:

```text
http://localhost:11434
```

Example model:

```text
qwen2-math
```

Available local models can be checked with:

```bash
ollama list
```

When using the GitHub Pages version, Ollama must allow the Pages origin because the browser app is served from `https://whetlake.github.io` while Ollama runs on `http://localhost:11434`.

On macOS, this can be set with:

```bash
launchctl setenv OLLAMA_ORIGINS "https://whetlake.github.io"
```

After changing this setting, fully quit and restart the Ollama app. Restarting only the `ollama serve` process may not be enough if the menu bar app is still running.

For local development with `pnpm dev`, this is usually not needed because Ollama allows localhost origins by default.

## Technical choices

TypeScript was used because it keeps installation and local running simple while still giving type safety for the board, moves, game state, and advisor logic. The browser-first approach keeps the project portable across operating systems and does not require a backend service, Docker, or a local Python runtime.

Vite was used because the project only needs a small development setup and a static production build.

Vitest was used for rule-focused tests. Movement tests use fixture data so before/after board states are easy to read and extend.

For the AI requirement, the offline advisor was built first because it is deterministic, testable, and does not need credentials. Ollama is included as a local language model option.
