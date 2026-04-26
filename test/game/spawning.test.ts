import { describe, expect, test } from 'vitest'
import { getEmptyPositions, positionToCoordinates, spawnTile, spawnRandomTile } from '../../src/game/spawning'
import { fakeRandomSequence } from '../helpers/fakeRandomSequence'

describe('getEmptyPositions', () => {
    test('returns zero-based positions for empty cells', () => {
        const board = [
            [2, null, 4, null],
            [null, 2, 4, 8],
            [2, 4, null, 8],
            [2, 4, 8, 16]
        ]
        expect(getEmptyPositions(board)).toEqual([1,3,4,10])
    })
    test('returns empty array when board is full', () => {
        const board = [
            [2, 4, 2, 4],
            [2, 2, 2, 2],
            [4, 4, 4, 4],
            [8, 8, 8, 8]
        ]
        expect(getEmptyPositions(board)).toEqual([])    
    })
    test('returns every position when board is empty', () => {
        const board = [
            [null, null, null, null],
            [null, null, null, null],
            [null, null, null, null],
            [null, null, null, null]
        ]
        expect(getEmptyPositions(board)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])
    })
})

expect(positionToCoordinates(0)).toEqual({ row: 0, column: 0})
expect(positionToCoordinates(5)).toEqual({ row: 1, column: 1})
expect(positionToCoordinates(8)).toEqual({ row: 2, column: 0})
expect(positionToCoordinates(10)).toEqual({ row: 2, column: 2})
expect(positionToCoordinates(13)).toEqual({ row: 3, column: 1})
expect(positionToCoordinates(15)).toEqual({ row: 3, column: 3})

test('spawns a tile at a zero-based position', () => {
  const board = [
    [2, null, 4, null],
    [null, 2, 4, 8],
    [2, 4, null, 8],
    [2, 4, 8, 16],
  ]
  expect(spawnTile(board, 10, 2)).toEqual([
    [2, null, 4, null],
    [null, 2, 4, 8],
    [2, 4, 2, 8],
    [2, 4, 8, 16],
  ])
})

test('does not mutate the original board', () => {
  const board = [
    [2, null, 4, null],
    [null, 2, 4, 8],
    [2, 4, null, 8],
    [2, 4, 8, 16],
  ]
  spawnTile(board, 10, 2)
  expect(board[2][2]).toBe(null)
})

test('throws when spawning on an occupied cell', () => {
  const board = [
    [2, null, 4, null],
    [null, 2, 4, 8],
    [2, 4, null, 8],
    [2, 4, 8, 16],
  ]
  expect(() => spawnTile(board, 0, 2)).toThrow('Cannot spawn tile on occupied cell')
  expect(spawnTile(board, 10, 4)[2][2]).toBe(4)
})

describe('spawnRandomTile', () => {
  test('spawns a random 2 in an empty cell', () => {
    const board = [
      [2, null, 4, null],
      [null, 2, 4, 8],
      [2, 4, null, 8],
      [2, 4, 8, 16],
    ]
    const random = fakeRandomSequence([0, 0.5])
    expect(spawnRandomTile(board, random)).toEqual([
      [2, 2, 4, null],
      [null, 2, 4, 8],
      [2, 4, null, 8],
      [2, 4, 8, 16],
    ])
  })
  test('spawns a random 4 in an empty cell', () => {
    const board = [
      [2, null, 4, null],
      [null, 2, 4, 8],
      [2, 4, null, 8],
      [2, 4, 8, 16],
    ]
    const random = fakeRandomSequence([0.99, 0.95])
    expect(spawnRandomTile(board, random)).toEqual([
      [2, null, 4, null],
      [null, 2, 4, 8],
      [2, 4, 4, 8],
      [2, 4, 8, 16],
    ])
  })
  test('does not spawn when no empty cells exist', () => {
    const board = [
      [2, 4, 2, 4],
      [2, 2, 2, 2],
      [4, 4, 4, 4],
      [8, 8, 8, 8],
    ]
    expect(spawnRandomTile(board, fakeRandomSequence([0, 0.5]))).toEqual(board)
  })
})
