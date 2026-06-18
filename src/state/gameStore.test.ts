import { beforeEach, describe, expect, it } from 'vitest'
import { useGameStore } from './gameStore'
import { REQUIRED_KEYS, KEY_HOLES, KEY_SET_FLAGS } from '../data/items'
import type { ExitHotspot } from '../types'

const store = () => useGameStore.getState()

const escapeExit: ExitHotspot = {
  id: 'gate-escape',
  type: 'exit',
  label: 'Open the Gate',
  icon: '🔓',
  x: 50,
  y: 84,
  targetRoomId: 'escaped',
  isEscape: true,
  requiresFlags: KEY_SET_FLAGS,
  lockedMessage: 'The doors hold fast. Set all three keys first.',
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

  it('the dungeon lockbox needs the rusty nail', () => {
    store().openPuzzle('cell-lock')
    expect(store().activePuzzleId).toBeNull()
    store().collectItem('dungeon-straw', 'rusty-nail', 'Got the nail.')
    store().openPuzzle('cell-lock')
    expect(store().activePuzzleId).toBe('cell-lock')
  })
})

describe('applyItem (pour the vial into the cauldron)', () => {
  it('does nothing useful without the vial', () => {
    store().applyItem('vial', 'cauldron-brewed', 'reveal 371', 'you need a draught')
    expect(store().flags['cauldron-brewed']).toBeFalsy()
    expect(store().message).toBe('you need a draught')
  })

  it('consumes the vial and reveals the clue', () => {
    store().collectItem('lab-vial', 'vial', 'Got the vial.')
    store().applyItem('vial', 'cauldron-brewed', 'reveal 371', 'you need a draught')
    expect(store().flags['cauldron-brewed']).toBe(true)
    expect(store().inventory).not.toContain('vial')
    expect(store().message).toBe('reveal 371')
  })
})

describe('insertKey', () => {
  it("won't insert a key you don't hold", () => {
    store().insertKey('iron-key', 'iron-set')
    expect(store().flags['iron-set']).toBeFalsy()
    expect(store().message).toMatch(/don't have/i)
  })

  it('moves a held key from the satchel into the lock', () => {
    store().solvePuzzle('p', ['iron-key'])
    store().insertKey('iron-key', 'iron-set')
    expect(store().flags['iron-set']).toBe(true)
    expect(store().inventory).not.toContain('iron-key')
  })

  it('will not re-insert a key already set', () => {
    store().solvePuzzle('p', ['iron-key'])
    store().insertKey('iron-key', 'iron-set')
    store().insertKey('iron-key', 'iron-set')
    expect(store().message).toMatch(/already set/i)
  })
})

describe('tryExit (the castle gate)', () => {
  beforeEach(() => store().startGame())

  it('stays locked until every key is set in its keyhole', () => {
    // Holding the keys is not enough anymore — they must be inserted.
    REQUIRED_KEYS.forEach((key, i) => store().solvePuzzle(`p${i}`, [key]))
    store().tryExit(escapeExit)
    expect(store().phase).toBe('playing')
    expect(store().message).toMatch(/hold fast/i)
  })

  it('wins once all three keys are set', () => {
    KEY_HOLES.forEach(({ keyItemId, placedFlag }, i) => {
      store().solvePuzzle(`p${i}`, [keyItemId])
      store().insertKey(keyItemId, placedFlag)
    })
    store().tryExit(escapeExit)
    expect(store().phase).toBe('won')
  })
})
