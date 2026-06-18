import type { ItemId, PuzzleId } from '../types'

/**
 * Puzzle definitions. Each puzzle is plain data describing its type, its
 * solution, and what solving it grants. The matching React component reads this
 * to render and validate the puzzle, so adding a puzzle is mostly editing data.
 */

export type PuzzleType = 'combination' | 'cipher' | 'matching'

interface PuzzleBase {
  id: PuzzleId
  type: PuzzleType
  title: string
  /** Shown at the top of the puzzle panel. */
  prompt: string
  /** Item granted on solve (usually a key). */
  rewardItemId?: ItemId
  /** Flag set on solve (e.g. to open a door). */
  flag?: string
  /** Item the player must hold to attempt this puzzle. */
  requiresItemId?: ItemId
  /** Shown when the required item is missing. */
  requiresItemMessage?: string
  /** Narration shown after solving. */
  successMessage: string
  /** Optional hint text (revealed by the hint system in a later PR). */
  hint: string
}

/** Enter a fixed numeric code. */
export interface CombinationPuzzle extends PuzzleBase {
  type: 'combination'
  /** Number of digits. */
  length: number
  /** The correct code, e.g. "371". */
  solution: string
}

/** Decode a Caesar-shifted word and type the plaintext. */
export interface CipherPuzzle extends PuzzleBase {
  type: 'cipher'
  /** The enciphered text shown to the player. */
  ciphertext: string
  /** The correct decoded answer (compared case-insensitively). */
  solution: string
}

/** Connect each left token to its correct right token. */
export interface MatchingPuzzle extends PuzzleBase {
  type: 'matching'
  pairs: { left: string; right: string }[]
}

export type Puzzle = CombinationPuzzle | CipherPuzzle | MatchingPuzzle

export const PUZZLES: Record<PuzzleId, Puzzle> = {
  // Dungeon — match each omen to its companion to spring the iron lockbox.
  'cell-lock': {
    id: 'cell-lock',
    type: 'matching',
    title: 'The Iron Lockbox',
    prompt:
      'A lockbox sits in the straw, its lid etched with omens. Match each omen to its ' +
      'companion to release the catch.',
    pairs: [
      { left: '🦇', right: '🌙' },
      { left: '🕷️', right: '🕸️' },
      { left: '⚰️', right: '💀' },
    ],
    rewardItemId: 'iron-key',
    successMessage: 'The catch springs open. Inside lies a cold Iron Key.',
    hint: 'Think of what each creature or omen belongs with: the bat with the night sky...',
  },

  // Library — decode the Count's cipher using the tome (shift each letter back by 3).
  'library-cipher': {
    id: 'library-cipher',
    type: 'cipher',
    title: 'The Cipher Lectern',
    prompt:
      "A drawer in the lectern is sealed by a word in the Count's cipher. The tome says " +
      'each letter has been shifted three places forward in the alphabet. Decode it:',
    ciphertext: 'EORRG',
    solution: 'BLOOD',
    requiresItemId: 'book',
    requiresItemMessage: 'The cipher is meaningless without the key. Perhaps a book explains it.',
    rewardItemId: 'silver-key',
    successMessage: 'The drawer slides open, revealing a tarnished Silver Key.',
    hint: 'Shift each letter back by three: E→B, O→L ... what five-letter word does the Count crave?',
  },

  // Alchemy Lab — read the recipe scrawled on the cauldron, then dial the code.
  'lab-combination': {
    id: 'lab-combination',
    type: 'combination',
    title: 'The Locked Cabinet',
    prompt:
      'A three-dial combination lock holds the cabinet shut. The alchemist must have ' +
      'written the numbers down somewhere — perhaps elsewhere in the castle.',
    length: 3,
    solution: '371',
    rewardItemId: 'bone-key',
    successMessage: 'The lock clicks apart. A Bone Key hums faintly within.',
    hint: 'The alchemist\'s note in the Great Hall reads "three bats, seven moons, a single drop." → 3, 7, 1.',
  },
}
