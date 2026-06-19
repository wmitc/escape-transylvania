import { describe, expect, it } from 'vitest'
import { PUZZLES } from './puzzles'
import { ITEMS } from './items'
import type { CipherPuzzle } from './puzzles'

/** Decode a Caesar cipher by shifting each letter back by `shift`. */
function caesarDecode(text: string, shift: number): string {
  return text
    .toUpperCase()
    .replace(/[A-Z]/g, (c) =>
      String.fromCharCode(((c.charCodeAt(0) - 65 - shift + 26) % 26) + 65),
    )
}

describe('puzzle data integrity', () => {
  it('every puzzle reward maps to a real item', () => {
    for (const puzzle of Object.values(PUZZLES)) {
      if (puzzle.rewardItemId) {
        expect(ITEMS[puzzle.rewardItemId], `missing item ${puzzle.rewardItemId}`).toBeDefined()
      }
    }
  })

  it('the library cipher decodes to its stated solution (shift 3)', () => {
    const cipher = PUZZLES['library-cipher'] as CipherPuzzle
    expect(caesarDecode(cipher.ciphertext, 3)).toBe(cipher.solution.toUpperCase())
  })

  it('the three required keys are each awarded by exactly one puzzle', () => {
    const rewardedKeys = Object.values(PUZZLES)
      .map((p) => p.rewardItemId)
      .filter((id): id is string => Boolean(id) && ITEMS[id!].isKey === true)
    expect(new Set(rewardedKeys).size).toBe(3)
  })

  it('ordering and sequence solutions reference defined tiles/buttons', () => {
    for (const puzzle of Object.values(PUZZLES)) {
      if (puzzle.type === 'ordering') {
        const ids = puzzle.tiles.map((t) => t.id).sort()
        expect([...puzzle.solution].sort()).toEqual(ids)
      }
      if (puzzle.type === 'sequence') {
        const ids = new Set(puzzle.buttons.map((b) => b.id))
        expect(puzzle.solution.every((id) => ids.has(id))).toBe(true)
      }
    }
  })

  it('the weighing odd barrel index is within range', () => {
    for (const puzzle of Object.values(PUZZLES)) {
      if (puzzle.type === 'weighing') {
        expect(puzzle.oddIndex).toBeGreaterThanOrEqual(0)
        expect(puzzle.oddIndex).toBeLessThan(puzzle.count)
      }
    }
  })
})
