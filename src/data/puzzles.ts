import type { ItemId, PuzzleId } from '../types'

/**
 * Puzzle definitions. Each puzzle is plain data describing its type, its
 * solution, and what solving it grants. The matching React component reads this
 * to render and validate the puzzle, so adding a puzzle is mostly editing data.
 */

export type PuzzleType =
  | 'combination'
  | 'cipher'
  | 'matching'
  | 'ordering'
  | 'riddle'
  | 'sequence'
  | 'weighing'

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

/** Arrange tiles into the correct order using the clues in the prompt. */
export interface OrderingPuzzle extends PuzzleBase {
  type: 'ordering'
  /** Tiles to arrange (shown shuffled). */
  tiles: { id: string; label: string }[]
  /** The correct ordering, top to bottom, as tile ids. */
  solution: string[]
}

/** Answer a riddle by typing the solution (compared case-insensitively). */
export interface RiddlePuzzle extends PuzzleBase {
  type: 'riddle'
  riddle: string
  solution: string
}

/** Press the buttons in the correct order. */
export interface SequencePuzzle extends PuzzleBase {
  type: 'sequence'
  buttons: { id: string; label: string }[]
  /** Correct press order, as button ids. */
  solution: string[]
}

/** Use a balance to find the one odd-weight barrel, then accuse it. */
export interface WeighingPuzzle extends PuzzleBase {
  type: 'weighing'
  /** Number of barrels (labelled 1..count). */
  count: number
  /** Index (0-based) of the odd barrel. */
  oddIndex: number
  /** True if the odd barrel is heavier than the rest. */
  heavier: boolean
}

export type Puzzle =
  | CombinationPuzzle
  | CipherPuzzle
  | MatchingPuzzle
  | OrderingPuzzle
  | RiddlePuzzle
  | SequencePuzzle
  | WeighingPuzzle

export const PUZZLES: Record<PuzzleId, Puzzle> = {
  // Dungeon — pick the four-pin tumbler lock with the nail. The code is the
  // prisoner's tally scratched on the cell wall (count the clusters).
  'cell-lock': {
    id: 'cell-lock',
    type: 'combination',
    title: 'The Cell Door Lock',
    prompt:
      'A four-pin tumbler lock holds the cell door. Rake each pin to the right depth (0–9). ' +
      'The depths must be written somewhere — a prisoner does not forget the way out.',
    length: 4,
    solution: '2413',
    requiresItemId: 'rusty-nail',
    requiresItemMessage:
      'The lock is jammed tight. You need something thin to rake the pins — a nail, perhaps.',
    flag: 'cell-open',
    rewardItemId: 'crowbar',
    successMessage:
      'The fourth pin gives with a click and the cell door swings open — and a crowbar that ' +
      'braced it clatters to the floor.',
  },

  // Catacombs — order the dead by the clues carved above the niches; opens the relic niche.
  'catacombs-order': {
    id: 'catacombs-order',
    type: 'ordering',
    title: 'The Ossuary Niches',
    prompt:
      'Four of the Count\'s servants lie here. An inscription decrees the order they must rest in:\n' +
      '"The Priest was first to die. The Knight outlived the Maid. The Jester was buried last, ' +
      'and the Maid before the Knight." Arrange them, first to last.',
    tiles: [
      { id: 'priest', label: '⛪ Priest' },
      { id: 'maid', label: '🌹 Maid' },
      { id: 'knight', label: '⚔️ Knight' },
      { id: 'jester', label: '🃏 Jester' },
    ],
    solution: ['priest', 'maid', 'knight', 'jester'],
    rewardItemId: 'iron-key',
    successMessage: 'The niches grind into place and one swings open — an Iron Key rests inside.',
  },

  // Chapel — answer the altar's riddle to open the reliquary (yields the tome).
  'chapel-riddle': {
    id: 'chapel-riddle',
    type: 'riddle',
    title: 'The Altar Riddle',
    prompt: 'Words are carved into the desecrated altar:',
    riddle:
      'I am drunk by the dead and feared by the living, the Count\'s only wine, the river ' +
      'of giving. One word — what am I?',
    solution: 'blood',
    rewardItemId: 'book',
    successMessage: 'The reliquary clicks open. Within rests a cracked leather tome.',
  },

  // Library — decode the Count's cipher (needs the tome); reveals the bell-ringing order.
  'library-cipher': {
    id: 'library-cipher',
    type: 'cipher',
    title: 'The Cipher Lectern',
    prompt:
      "A drawer in the lectern is sealed by a phrase in the Count's cipher. The tome says " +
      'each letter has been shifted three places forward in the alphabet. Decode it:',
    ciphertext: 'WKH FRXQW',
    solution: 'THE COUNT',
    requiresItemId: 'book',
    requiresItemMessage: 'The cipher is meaningless without the key. Perhaps a tome explains it.',
    rewardItemId: 'sheet-music',
    successMessage:
      'The drawer slides open onto a sheet of music. You pocket it — the bell tower will want this.',
  },

  // Bell Tower — ring the bells in the order learned from the library's sheet music.
  'bell-sequence': {
    id: 'bell-sequence',
    type: 'sequence',
    title: 'The Four Bells',
    prompt:
      'Four bells hang in the tower. Ring them in the order the sheet music decreed ' +
      '(found in the library).',
    buttons: [
      { id: 'wolf', label: '🐺 Wolf' },
      { id: 'moon', label: '🌙 Moon' },
      { id: 'dusk', label: '🌆 Dusk' },
      { id: 'raven', label: '🐦‍⬛ Raven' },
    ],
    solution: ['dusk', 'raven', 'moon', 'wolf'],
    rewardItemId: 'silver-key',
    successMessage: 'The bells peal in harmony. Something drops from the belfry — a Silver Key.',
  },

  // Wine Cellar — find the one barrel that isn't wine using the balance; it hides the vial.
  'cellar-weighing': {
    id: 'cellar-weighing',
    type: 'weighing',
    title: 'The Odd Barrel',
    prompt:
      'Six barrels line the wall. Five hold wine and weigh the same; one is heavier — filled ' +
      'with something else. Use the balance to find the heavy barrel, then breach it.',
    count: 6,
    oddIndex: 3,
    heavier: true,
    rewardItemId: 'vial',
    successMessage: 'You stave in the heavy barrel. Nestled in sand is a crimson vial.',
  },

  // Alchemy Lab — pour the crimson vial into the cauldron to reveal the code, then dial it.
  'lab-combination': {
    id: 'lab-combination',
    type: 'combination',
    title: 'The Locked Cabinet',
    prompt:
      'A three-dial combination lock holds the cabinet shut. The numbers appear only in ' +
      'the cauldron\'s brew — once the crimson vial is poured in.',
    length: 3,
    solution: '371',
    rewardItemId: 'bone-key',
    successMessage: 'The lock clicks apart. A Bone Key hums faintly within.',
  },
}
