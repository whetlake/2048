export const BOARD_SIZE = 4

// An open space is better because there are more choices for merge
export const EMPTY_CELL_WEIGHT = 100

// Rewards progress toward larger tiles
export const MAX_TILE_WEIGHT = 2

// Reward boards that still have several moves available for multiple directions
export const VALID_MOVE_WEIGHT = 50

// Penalizes large jumps between neighboring tiles, so similar values stay grouped
// e.g. 128, 16, 64 would be penalized against 128, 64, 16
export const SMOOTHNESS_WEIGHT = 25

// Rewards keeping the largest tile anchored in a corner, game heuristic
export const CORNER_MAX_TILE_WEIGHT = 100