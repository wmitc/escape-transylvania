import type { Room, RoomId } from '../types'
import { KEY_SET_FLAGS } from './items'

/** The starting room — where the player wakes. */
export const STARTING_ROOM_ID: RoomId = 'dungeon'

/**
 * The five rooms of Castle Dracula and how they connect. Inter-room doors are
 * open so the castle is fully explorable; only the final gate is gated (it needs
 * all three keys). Puzzle hotspots are wired here — their interactive UIs arrive
 * in a later PR.
 *
 * Backgrounds are placeholder CSS gradients; real room art can be dropped into
 * `public/assets/` and referenced here later without touching the components.
 */
export const ROOMS: Record<RoomId, Room> = {
  dungeon: {
    id: 'dungeon',
    name: 'The Dungeon',
    description:
      'You wake on cold straw behind iron bars. Water drips somewhere in the dark. ' +
      'This is no way to spend an eternity — find a way out.',
    background: 'radial-gradient(ellipse at 50% 30%, #2a2230 0%, #14101a 60%, #0a070d 100%)',
    hotspots: [
      { id: 'dungeon-chains', type: 'look', label: 'Iron Chains', icon: '⛓️', x: 18, y: 40,
        description: 'Manacles bolted to the wall. Whoever hung here is long gone.' },
      { id: 'dungeon-torch', type: 'item', label: 'Wall Torch', icon: '🔥', x: 80, y: 30,
        itemId: 'torch', description: 'You lift a lit torch from its bracket. The shadows retreat.' },
      { id: 'dungeon-straw', type: 'item', label: 'Pile of Straw', icon: '🌾', x: 33, y: 84,
        itemId: 'rusty-nail', description: 'Sifting the straw, your fingers find a long rusty nail.' },
      { id: 'dungeon-lock', type: 'puzzle', label: 'Cell Lock', icon: '🔒', x: 60, y: 55,
        puzzleId: 'cell-lock', description: 'The cell door is held by a crude pin lock.' },
      { id: 'dungeon-door', type: 'exit', label: 'Cell Door', icon: '🚪', x: 60, y: 35,
        targetRoomId: 'great-hall' },
    ],
  },

  'great-hall': {
    id: 'great-hall',
    name: 'The Great Hall',
    description:
      'A vast hall of guttering candelabra and threadbare banners. Corridors lead off ' +
      'in every direction, and a portrait of the Count watches your every step.',
    background: 'radial-gradient(ellipse at 50% 20%, #3a2a1e 0%, #1c1410 55%, #0c0908 100%)',
    hotspots: [
      { id: 'hall-portrait', type: 'look', label: 'Portrait of the Count', icon: '🖼️', x: 50, y: 30,
        description: 'Dracula stares down, pale and amused. The eyes seem to follow you.' },
      { id: 'hall-recipe', type: 'look', label: "Alchemist's Note", icon: '📜', x: 28, y: 39,
        description:
          'A note is pinned to the wall in a spidery hand: "The cabinet\'s numbers will not ' +
          'sit on paper. Pour the crimson vial into the cauldron and read the smoke."' },
      { id: 'hall-to-dungeon', type: 'exit', label: 'Down to the Dungeon', icon: '🕳️', x: 12, y: 76,
        targetRoomId: 'dungeon' },
      { id: 'hall-to-library', type: 'exit', label: 'To the Library', icon: '📚', x: 36, y: 76,
        targetRoomId: 'library' },
      { id: 'hall-to-lab', type: 'exit', label: 'To the Alchemy Lab', icon: '⚗️', x: 64, y: 76,
        targetRoomId: 'alchemy-lab' },
      { id: 'hall-to-gate', type: 'exit', label: 'To the Castle Gate', icon: '🏰', x: 88, y: 76,
        targetRoomId: 'gate' },
    ],
  },

  library: {
    id: 'library',
    name: 'The Library',
    dark: true,
    description:
      'Towering shelves sag under centuries of forbidden books. Dust hangs in the ' +
      'candlelight, and one volume lies open on a lectern.',
    background: 'radial-gradient(ellipse at 50% 40%, #2c2418 0%, #181308 60%, #0a0805 100%)',
    hotspots: [
      { id: 'library-shelves', type: 'look', label: 'Bookshelves', icon: '📚', x: 14, y: 40,
        description: 'A margin note repeats: "to read the Count\'s hand, walk each letter three steps back."' },
      { id: 'library-book', type: 'item', label: 'Open Tome', icon: '📕', x: 50, y: 63,
        itemId: 'book', description: 'You take the leather tome. Its margins crawl with cipher symbols.' },
      { id: 'library-cipher', type: 'puzzle', label: 'Cipher Drawer', icon: '🔣', x: 50, y: 76,
        puzzleId: 'library-cipher', description: 'A locked drawer in the lectern is marked with a symbol cipher.' },
      { id: 'library-exit', type: 'exit', label: 'Back to the Great Hall', icon: '🚪', x: 89, y: 74,
        targetRoomId: 'great-hall' },
    ],
  },

  'alchemy-lab': {
    id: 'alchemy-lab',
    name: 'The Alchemy Lab',
    description:
      'Glass alembics bubble over blue flame and the air reeks of sulphur. A locked ' +
      'cabinet rattles faintly, as if something inside wants out.',
    background: 'radial-gradient(ellipse at 50% 45%, #16302a 0%, #0c1c18 60%, #06100d 100%)',
    hotspots: [
      { id: 'lab-cauldron', type: 'apply', label: 'Bubbling Cauldron', icon: '🌫️', x: 28, y: 58,
        itemId: 'vial', setsFlag: 'cauldron-brewed',
        emptyDescription:
          'A cauldron froths an unhealthy green. Something could be dissolved in it — if you had the right draught.',
        revealMessage:
          'You tip the crimson vial into the cauldron. The brew flares and the smoke curls ' +
          'into figures: three bats, seven moons, a single drop — 3, 7, 1.' },
      { id: 'lab-vial', type: 'item', label: 'Crimson Vial', icon: '🧪', x: 49, y: 61,
        itemId: 'vial', description: 'You pocket a vial of dark crimson liquid. It is warm.' },
      { id: 'lab-cabinet', type: 'puzzle', label: 'Locked Cabinet', icon: '🗄️', x: 85, y: 62,
        puzzleId: 'lab-combination', description: 'A combination lock holds the cabinet shut.' },
      { id: 'lab-exit', type: 'exit', label: 'Back to the Great Hall', icon: '🚪', x: 9, y: 74,
        targetRoomId: 'great-hall' },
    ],
  },

  gate: {
    id: 'gate',
    name: 'The Castle Gate',
    description:
      'The great doors of the castle, banded in iron and bound by three ancient locks. ' +
      'Beyond them: the night, the forest, and freedom.',
    background: 'radial-gradient(ellipse at 50% 60%, #20242e 0%, #10131a 60%, #07090d 100%)',
    hotspots: [
      { id: 'gate-doors', type: 'look', label: 'The Great Doors', icon: '🚪', x: 50, y: 38,
        description:
          'Iron-banded doors set with three keyholes — iron, silver, and bone. Select a ' +
          'key from your satchel, then set it into its lock.' },
      { id: 'gate-hole-iron', type: 'keyhole', label: 'Iron Keyhole', icon: '🔑', x: 41, y: 66,
        keyItemId: 'iron-key', placedFlag: 'iron-set' },
      { id: 'gate-hole-silver', type: 'keyhole', label: 'Silver Keyhole', icon: '🔑', x: 50, y: 66,
        keyItemId: 'silver-key', placedFlag: 'silver-set' },
      { id: 'gate-hole-bone', type: 'keyhole', label: 'Bone Keyhole', icon: '🔑', x: 59, y: 66,
        keyItemId: 'bone-key', placedFlag: 'bone-set' },
      { id: 'gate-escape', type: 'exit', label: 'Open the Gate', icon: '🔓', x: 50, y: 84,
        targetRoomId: 'escaped', isEscape: true, requiresFlags: KEY_SET_FLAGS,
        lockedMessage: 'The doors hold fast. Set all three keys — iron, silver, and bone — into their locks first.' },
      { id: 'gate-exit', type: 'exit', label: 'Back to the Great Hall', icon: '↩️', x: 11, y: 86,
        targetRoomId: 'great-hall' },
    ],
  },
}
