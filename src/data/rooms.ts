import type { Room, RoomId } from '../types'
import { REQUIRED_KEYS } from './items'

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
      { id: 'dungeon-straw', type: 'item', label: 'Pile of Straw', icon: '🌾', x: 35, y: 78,
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
      { id: 'hall-portrait', type: 'look', label: 'Portrait of the Count', icon: '🖼️', x: 50, y: 22,
        description: 'Dracula stares down, pale and amused. The eyes seem to follow you.' },
      { id: 'hall-recipe', type: 'look', label: "Alchemist's Note", icon: '📜', x: 24, y: 40,
        description:
          'A note is pinned to the wall in a spidery hand: "For the cabinet — three bats, ' +
          'seven moons, a single drop of blood."' },
      { id: 'hall-to-dungeon', type: 'exit', label: 'Down to the Dungeon', icon: '🕳️', x: 14, y: 70,
        targetRoomId: 'dungeon' },
      { id: 'hall-to-library', type: 'exit', label: 'To the Library', icon: '📚', x: 38, y: 60,
        targetRoomId: 'library' },
      { id: 'hall-to-lab', type: 'exit', label: 'To the Alchemy Lab', icon: '⚗️', x: 62, y: 60,
        targetRoomId: 'alchemy-lab' },
      { id: 'hall-to-gate', type: 'exit', label: 'To the Castle Gate', icon: '🏰', x: 86, y: 70,
        targetRoomId: 'gate' },
    ],
  },

  library: {
    id: 'library',
    name: 'The Library',
    description:
      'Towering shelves sag under centuries of forbidden books. Dust hangs in the ' +
      'candlelight, and one volume lies open on a lectern.',
    background: 'radial-gradient(ellipse at 50% 40%, #2c2418 0%, #181308 60%, #0a0805 100%)',
    hotspots: [
      { id: 'library-shelves', type: 'look', label: 'Bookshelves', icon: '📚', x: 20, y: 35,
        description: 'A margin note repeats: "to read the Count\'s hand, walk each letter three steps back."' },
      { id: 'library-book', type: 'item', label: 'Open Tome', icon: '📕', x: 50, y: 60,
        itemId: 'book', description: 'You take the leather tome. Its margins crawl with cipher symbols.' },
      { id: 'library-cipher', type: 'puzzle', label: 'Cipher Lectern', icon: '🔣', x: 72, y: 45,
        puzzleId: 'library-cipher', description: 'A locked drawer in the lectern is marked with a symbol cipher.' },
      { id: 'library-exit', type: 'exit', label: 'Back to the Great Hall', icon: '🚪', x: 86, y: 78,
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
      { id: 'lab-cauldron', type: 'look', label: 'Bubbling Cauldron', icon: '🌫️', x: 28, y: 55,
        description:
          'A cauldron froths an unhealthy green; bubbles pop into little screaming shapes. ' +
          'The recipe that once hung here is gone.' },
      { id: 'lab-vial', type: 'item', label: 'Crimson Vial', icon: '🧪', x: 50, y: 38,
        itemId: 'vial', description: 'You pocket a vial of dark crimson liquid. It is warm.' },
      { id: 'lab-cabinet', type: 'puzzle', label: 'Locked Cabinet', icon: '🗄️', x: 74, y: 50,
        puzzleId: 'lab-combination', description: 'A combination lock holds the cabinet shut.' },
      { id: 'lab-exit', type: 'exit', label: 'Back to the Great Hall', icon: '🚪', x: 86, y: 80,
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
      { id: 'gate-doors', type: 'look', label: 'The Great Doors', icon: '🚪', x: 50, y: 45,
        description: 'Three keyholes — iron, silver, and bone — gleam in the torchlight.' },
      { id: 'gate-escape', type: 'exit', label: 'Unlock the Gate', icon: '🔓', x: 50, y: 70,
        targetRoomId: 'escaped', isEscape: true, requiresKeys: REQUIRED_KEYS,
        lockedMessage: 'The three locks hold fast. You need the iron, silver, and bone keys.' },
      { id: 'gate-exit', type: 'exit', label: 'Back to the Great Hall', icon: '↩️', x: 86, y: 82,
        targetRoomId: 'great-hall' },
    ],
  },
}
