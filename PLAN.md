# 2048 - Implementation Plan

## Goal

Build a minimal browser-based 2048 game with tested game logic and a simple UI where the user can request a suggested next move.

## Assumptions

- The board will be 4 x 4, as in traditional 2048 game
- The initial board starts with 2 to 4 random `2` tiles
- A new tile appears only after a valid move
- A tile can merge only once per move
- New tiles are 90% of the time `2` and 10% of the time `4`. The choice will be random.
- The game is won when `2048` appears
- The game is lost when no valid moves remain

## Technical decisions

- TypeScript
- Vite
- Vitest
- HTML/CSS

Alternatives like Python and Docker were also considered. A TypeScript browser app was chosen because it keeps delivery simple. The finished game can run as static files in a modern browser, without a backend service or container runtime.

## Architecture

The UI should be separate from the game layer. The game layer needs to cover the following:

- movement behaviour
- merge behaviour
- spawning of `2` and `4`
- score calculation
- win/loss detection

The UI renders the state and passes player decisions into the game layer.

## Testing Strategy

- Testing will focus on the game rules first.
- Movement tests will use structured before/after fixtures without random tile generation.
- Spawning tests will verify that new tiles are only placed in empty cells and only after a valid move.
- The random choice of cell and tile value should be controlled in tests so the results are predictable.
- Game state tests will cover scoring, win detection, and loss detection.
- The offline move advisor will be tested with deterministic boards.
- The external AI advisor will be optional. Automated tests will cover prompt building, response parsing, and fallback behavior with mocked responses. A separate integration test can verify a real provider call using an API key from a local `.env` file.

## Task Breakdown

1. Capture scope and assumptions
2. Scaffold the project
3. Add test tooling
4. Implement and test movement and merge rules
5. Add game state, spawning, score, win, and loss logic
6. Build the browser UI
7. Add the offline move advisor
8. Add optional external AI advisor
9. Finalize README and project checks
