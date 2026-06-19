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

describe('openPuzzle (select the item, then click the puzzle)', () => {
  it('refuses to open when the required item is not selected', () => {
    store().collectItem('library-book', 'book', 'Got the tome.') // held but not selected
    store().openPuzzle('library-cipher')
    expect(store().activePuzzleId).toBeNull()
  })

  it('opens once the required item is selected', () => {
    store().collectItem('library-book', 'book', 'Got the tome.')
    store().selectItem('book')
    store().openPuzzle('library-cipher')
    expect(store().activePuzzleId).toBe('library-cipher')
  })

  it('the dungeon lockbox needs the rusty nail selected', () => {
    store().collectItem('dungeon-straw', 'rusty-nail', 'Got the nail.')
    store().openPuzzle('cell-lock')
    expect(store().activePuzzleId).toBeNull() // held but not selected
    store().selectItem('rusty-nail')
    store().openPuzzle('cell-lock')
    expect(store().activePuzzleId).toBe('cell-lock')
  })
})

describe('applyItem (select the vial, then click the cauldron)', () => {
  it('does nothing when the vial is not selected', () => {
    store().collectItem('lab-vial', 'vial', 'Got the vial.') // held but not selected
    store().applyItem('vial', 'cauldron-brewed', 'reveal 371', 'you need a draught')
    expect(store().flags['cauldron-brewed']).toBeFalsy()
  })

  it('consumes the vial when selected and reveals the clue', () => {
    store().collectItem('lab-vial', 'vial', 'Got the vial.')
    store().selectItem('vial')
    store().applyItem('vial', 'cauldron-brewed', 'reveal 371', 'you need a draught')
    expect(store().flags['cauldron-brewed']).toBe(true)
    expect(store().inventory).not.toContain('vial')
    expect(store().message).toBe('reveal 371')
  })
})

describe('insertKey (select the key, then click the lock)', () => {
  it('prompts to select a key when none is selected', () => {
    store().solvePuzzle('p', ['iron-key']) // held but not selected
    store().insertKey('iron-key', 'iron-set')
    expect(store().flags['iron-set']).toBeFalsy()
    expect(store().message).toMatch(/select/i)
  })

  it('moves a selected key from the satchel into the lock', () => {
    store().solvePuzzle('p', ['iron-key'])
    store().selectItem('iron-key')
    store().insertKey('iron-key', 'iron-set')
    expect(store().flags['iron-set']).toBe(true)
    expect(store().inventory).not.toContain('iron-key')
  })

  it('will not re-insert a key already set', () => {
    store().solvePuzzle('p', ['iron-key'])
    store().selectItem('iron-key')
    store().insertKey('iron-key', 'iron-set')
    store().insertKey('iron-key', 'iron-set')
    expect(store().message).toMatch(/already set/i)
  })
})

describe('ringBell (bell tower)', () => {
  it('a wrong bell resets the sequence', () => {
    store().ringBell('wolf', 'bell-sequence') // order is dusk, raven, moon, wolf
    expect(store().bellsRung).toEqual([])
    expect(store().solvedPuzzles).not.toContain('bell-sequence')
  })

  it('ringing the correct order grants the silver key', () => {
    for (const b of ['dusk', 'raven', 'moon', 'wolf']) store().ringBell(b, 'bell-sequence')
    expect(store().solvedPuzzles).toContain('bell-sequence')
    expect(store().inventory).toContain('silver-key')
    expect(store().bellsRung).toEqual([])
  })
})

describe('sound preference', () => {
  it('toggles and survives a reset', () => {
    expect(store().soundOn).toBe(true)
    store().toggleSound()
    expect(store().soundOn).toBe(false)
    store().startGame()
    store().resetGame()
    expect(store().soundOn).toBe(false) // preference kept across reset
  })
})

describe('the dawn timer', () => {
  it('starts the countdown when the game starts', () => {
    store().startGame()
    expect(store().deadlineAt).toBeGreaterThan(Date.now())
  })

  it('a wrong answer subtracts time', () => {
    store().startGame()
    const before = store().deadlineAt!
    store().penalizeTime(60, 'ouch')
    expect(store().deadlineAt).toBe(before - 60_000)
  })

  it('loseGame ends the game', () => {
    store().startGame()
    store().loseGame()
    expect(store().phase).toBe('lost')
  })

  it('resetting clears the deadline', () => {
    store().startGame()
    store().resetGame()
    expect(store().deadlineAt).toBeNull()
    expect(store().phase).toBe('intro')
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
      store().selectItem(keyItemId)
      store().insertKey(keyItemId, placedFlag)
    })
    store().tryExit(escapeExit)
    expect(store().phase).toBe('won')
  })
})
