import { beforeEach, describe, expect, it } from 'vitest'
import { useGameStore } from './gameStore'
import { REQUIRED_KEYS } from '../data/items'
import type { ExitHotspot } from '../types'

const store = () => useGameStore.getState()

const escapeExit: ExitHotspot = {
  id: 'gate-escape',
  type: 'exit',
  label: 'Unlock the Gate',
  icon: '🔓',
  x: 50,
  y: 70,
  targetRoomId: 'escaped',
  isEscape: true,
  requiresKeys: REQUIRED_KEYS,
  lockedMessage: 'The three locks hold fast.',
}

beforeEach(() => {
  store().resetGame()
})

describe('collectItem', () => {
  it('adds the item and consumes the hotspot', () => {
    store().collectItem('dungeon-torch', 'torch', 'Got the torch.')
    expect(store().inventory).toContain('torch')
    expect(store().collectedHotspots).toContain('dungeon-torch')
  })

  it('is a no-op if the hotspot was already collected', () => {
    store().collectItem('dungeon-torch', 'torch', 'Got the torch.')
    store().collectItem('dungeon-torch', 'torch', 'Got the torch.')
    expect(store().inventory.filter((i) => i === 'torch')).toHaveLength(1)
  })
})

describe('solvePuzzle', () => {
  it('records the puzzle and grants the reward key', () => {
    store().solvePuzzle('cell-lock', ['iron-key'])
    expect(store().solvedPuzzles).toContain('cell-lock')
    expect(store().inventory).toContain('iron-key')
  })

  it('does not grant a reward twice', () => {
    store().solvePuzzle('cell-lock', ['iron-key'])
    store().solvePuzzle('cell-lock', ['iron-key'])
    expect(store().inventory.filter((i) => i === 'iron-key')).toHaveLength(1)
  })
})

describe('openPuzzle', () => {
  it('refuses to open when a required item is missing', () => {
    store().openPuzzle('library-cipher') // needs the book
    expect(store().activePuzzleId).toBeNull()
    expect(store().message).toBeTruthy()
  })

  it('opens once the required item is held', () => {
    store().collectItem('library-book', 'book', 'Got the tome.')
    store().openPuzzle('library-cipher')
    expect(store().activePuzzleId).toBe('library-cipher')
  })
})

describe('tryExit (the castle gate)', () => {
  beforeEach(() => store().startGame())

  it('stays locked without all three keys', () => {
    store().tryExit(escapeExit)
    expect(store().phase).toBe('playing')
    expect(store().message).toBe('The three locks hold fast.')
  })

  it('wins once all three keys are held', () => {
    REQUIRED_KEYS.forEach((key, i) => store().solvePuzzle(`p${i}`, [key]))
    store().tryExit(escapeExit)
    expect(store().phase).toBe('won')
  })
})

describe('persistence shape', () => {
  it('keeps revealed hints', () => {
    store().revealHint('cell-lock')
    expect(store().hintsRevealed['cell-lock']).toBe(true)
  })
})
