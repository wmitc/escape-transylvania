import type { Room, RoomId } from '../types'
import { KEY_SET_FLAGS } from './items'

/** The starting room — where the player wakes. */
export const STARTING_ROOM_ID: RoomId = 'dungeon'

/**
 * The nine rooms of Castle Dracula and how they connect. The castle is one
 * connected map; some doors are gated (the catacomb stairs need a crowbar; the
 * gate needs all three keys) and three rooms are dark until you carry the torch.
 *
 * Progression (with cross-room dependencies):
 *  - Dungeon lockbox (needs nail)        -> Crowbar -> pries open the catacomb stairs
 *  - Catacombs ordering puzzle           -> Iron Key
 *  - Chapel riddle                       -> Tome
 *  - Library cipher (needs tome)         -> reveals the bell order
 *  - Bell Tower sequence (bell order)    -> Silver Key
 *  - Wine Cellar weighing                -> Vial -> Lab cauldron -> cabinet code
 *  - Lab combination                     -> Bone Key
 *  - Gate (iron + silver + bone)         -> escape
 */
export const ROOMS: Record<RoomId, Room> = {
  dungeon: {
    id: 'dungeon',
    name: 'The Dungeon',
    description:
      'You wake on cold straw behind iron bars. Water drips somewhere in the dark, and a ' +
      'sealed stairwell descends into deeper black. This is no way to spend an eternity.',
    background: 'radial-gradient(ellipse at 50% 30%, #2a2230 0%, #14101a 60%, #0a070d 100%)',
    hotspots: [
      { id: 'dungeon-chains', type: 'look', label: 'Iron Chains', icon: '⛓️', x: 14, y: 36,
        description: 'Manacles bolted to the wall. Whoever hung here is long gone.' },
      { id: 'dungeon-torch', type: 'item', label: 'Wall Torch', icon: '🔥', x: 82, y: 30,
        itemId: 'torch', description: 'You lift a lit torch from its bracket. The shadows retreat.' },
      { id: 'dungeon-straw', type: 'item', label: 'Pile of Straw', icon: '🌾', x: 33, y: 84,
        itemId: 'rusty-nail', description: 'Sifting the straw, your fingers find a long rusty nail.' },
      { id: 'dungeon-lock', type: 'puzzle', label: 'Cell Door Lock', icon: '🔒', x: 60, y: 55,
        puzzleId: 'cell-lock', description: 'A heavy tumbler lock holds the cell door shut.' },
      { id: 'dungeon-stairs', type: 'apply', label: 'Sealed Stairs', icon: '🪜', x: 77, y: 66,
        itemId: 'crowbar', setsFlag: 'catacombs-open',
        emptyDescription:
          'A stairwell down is boarded over with iron-banded planks. You\'d need a strong lever to pry them.',
        revealMessage: 'You jam the crowbar under the planks and heave. They splinter — the stairs are open.' },
      { id: 'dungeon-door', type: 'exit', label: 'Cell Door', icon: '🚪', x: 60, y: 35,
        targetRoomId: 'great-hall', requiresFlag: 'cell-open',
        lockedMessage: 'The cell door is locked fast. Pick the lock with something thin first.' },
      { id: 'dungeon-to-catacombs', type: 'exit', label: 'Down to the Catacombs', icon: '🕳️', x: 80, y: 82,
        targetRoomId: 'catacombs', requiresFlag: 'catacombs-open',
        lockedMessage: 'The stairwell is boarded shut. Something strong could pry it open.' },
    ],
  },

  catacombs: {
    id: 'catacombs',
    name: 'The Catacombs',
    dark: true,
    description:
      'Bone-lined tunnels stretch into the dark. Four niches hold the Count\'s long-dead ' +
      'servants, and an inscription demands they be laid to rest in the proper order.',
    background: 'radial-gradient(ellipse at 50% 40%, #21202a 0%, #100f16 60%, #06060a 100%)',
    hotspots: [
      { id: 'catacombs-inscription', type: 'look', label: 'Inscription', icon: '📜', x: 22, y: 40,
        description:
          'Carved above the niches: "The Priest was first to die. The Knight outlived the Maid. ' +
          'The Jester was buried last, and the Maid before the Knight."' },
      { id: 'catacombs-niches', type: 'puzzle', label: 'Ossuary Niches', icon: '💀', x: 55, y: 56,
        puzzleId: 'catacombs-order', description: 'Four niches, each with a sliding stone lid.' },
      { id: 'catacombs-exit', type: 'exit', label: 'Up to the Dungeon', icon: '🪜', x: 86, y: 80,
        targetRoomId: 'dungeon' },
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
      { id: 'hall-portrait', type: 'look', label: 'Portrait of the Count', icon: '🖼️', x: 50, y: 28,
        description: 'Dracula stares down, pale and amused. The eyes seem to follow you.' },
      { id: 'hall-recipe', type: 'look', label: "Alchemist's Note", icon: '📜', x: 25, y: 40,
        description:
          'A note is pinned to the wall in a spidery hand: "The cabinet\'s numbers will not ' +
          'sit on paper. Pour the crimson vial into the cauldron and read the smoke."' },
      { id: 'hall-to-dungeon', type: 'exit', label: 'Down to the Dungeon', icon: '🕳️', x: 11, y: 78,
        targetRoomId: 'dungeon' },
      { id: 'hall-to-library', type: 'exit', label: 'To the Library', icon: '📚', x: 30, y: 78,
        targetRoomId: 'library' },
      { id: 'hall-to-chapel', type: 'exit', label: 'To the Chapel', icon: '⛪', x: 50, y: 80,
        targetRoomId: 'chapel' },
      { id: 'hall-to-lab', type: 'exit', label: 'To the Alchemy Lab', icon: '⚗️', x: 70, y: 78,
        targetRoomId: 'alchemy-lab' },
      { id: 'hall-to-gate', type: 'exit', label: 'To the Castle Gate', icon: '🏰', x: 89, y: 78,
        targetRoomId: 'gate' },
    ],
  },

  library: {
    id: 'library',
    name: 'The Library',
    dark: true,
    description:
      'Towering shelves sag under centuries of forbidden books. A single volume lies open ' +
      'on a lectern, and a drawer beneath it is sealed with the Count\'s cipher.',
    background: 'radial-gradient(ellipse at 50% 40%, #2c2418 0%, #181308 60%, #0a0805 100%)',
    hotspots: [
      { id: 'library-shelves', type: 'look', label: 'Bookshelves', icon: '📚', x: 14, y: 40,
        description: 'A margin note repeats: "to read the Count\'s hand, walk each letter three steps back."' },
      { id: 'library-cipher', type: 'puzzle', label: 'Cipher Drawer', icon: '🔣', x: 50, y: 76,
        puzzleId: 'library-cipher', description: 'A locked drawer in the lectern is marked with a symbol cipher.' },
      { id: 'library-exit', type: 'exit', label: 'Back to the Great Hall', icon: '🚪', x: 89, y: 74,
        targetRoomId: 'great-hall' },
    ],
  },

  chapel: {
    id: 'chapel',
    name: 'The Chapel',
    description:
      'A desecrated chapel. Black candles gutter on a cracked altar, and a stone stair ' +
      'spirals up toward the bell tower. Words are carved deep into the altar face.',
    background: 'radial-gradient(ellipse at 50% 35%, #2a2436 0%, #161222 60%, #08060f 100%)',
    hotspots: [
      { id: 'chapel-window', type: 'look', label: 'Shattered Window', icon: '🪟', x: 50, y: 24,
        description: 'A rose window, long shattered. Moonlight falls through it onto the altar.' },
      { id: 'chapel-altar', type: 'puzzle', label: 'The Altar', icon: '⛪', x: 50, y: 54,
        puzzleId: 'chapel-riddle', description: 'A reliquary is set into the altar, sealed by a carved riddle.' },
      { id: 'chapel-to-tower', type: 'exit', label: 'Up to the Bell Tower', icon: '🔔', x: 84, y: 36,
        targetRoomId: 'bell-tower' },
      { id: 'chapel-exit', type: 'exit', label: 'Back to the Great Hall', icon: '🚪', x: 14, y: 80,
        targetRoomId: 'great-hall' },
    ],
  },

  'bell-tower': {
    id: 'bell-tower',
    name: 'The Bell Tower',
    description:
      'Wind howls through the open belfry. Four great bells hang overhead, each cast with a ' +
      'different sign. Ring them in the order the sheet music decreed.',
    background: 'radial-gradient(ellipse at 50% 30%, #1d2734 0%, #0f161f 60%, #07090d 100%)',
    hotspots: [
      { id: 'bell-wolf', type: 'bell', label: 'Wolf Bell', icon: '🐺', x: 24, y: 46,
        bellId: 'wolf', note: 55, puzzleId: 'bell-sequence' },
      { id: 'bell-moon', type: 'bell', label: 'Moon Bell', icon: '🌙', x: 41, y: 46,
        bellId: 'moon', note: 64, puzzleId: 'bell-sequence' },
      { id: 'bell-dusk', type: 'bell', label: 'Dusk Bell', icon: '🌆', x: 61, y: 46,
        bellId: 'dusk', note: 60, puzzleId: 'bell-sequence' },
      { id: 'bell-raven', type: 'bell', label: 'Raven Bell', icon: '🐦‍⬛', x: 77, y: 46,
        bellId: 'raven', note: 67, puzzleId: 'bell-sequence' },
      { id: 'tower-exit', type: 'exit', label: 'Down to the Chapel', icon: '🪜', x: 86, y: 84,
        targetRoomId: 'chapel' },
    ],
  },

  'alchemy-lab': {
    id: 'alchemy-lab',
    name: 'The Alchemy Lab',
    description:
      'Glass alembics bubble over blue flame and the air reeks of sulphur. A locked cabinet ' +
      'rattles faintly, and a trapdoor in the floor leads down to the cellar.',
    background: 'radial-gradient(ellipse at 50% 45%, #16302a 0%, #0c1c18 60%, #06100d 100%)',
    hotspots: [
      { id: 'lab-cauldron', type: 'apply', label: 'Bubbling Cauldron', icon: '🌫️', x: 28, y: 58,
        itemId: 'vial', setsFlag: 'cauldron-brewed',
        emptyDescription:
          'A cauldron froths an unhealthy green. Something could be dissolved in it — if you had the right draught.',
        revealMessage:
          'You tip the crimson vial into the cauldron. The brew flares and the smoke curls ' +
          'into figures: three bats, seven moons, a single drop — 3, 7, 1.' },
      { id: 'lab-cabinet', type: 'puzzle', label: 'Locked Cabinet', icon: '🗄️', x: 85, y: 62,
        puzzleId: 'lab-combination', description: 'A combination lock holds the cabinet shut.' },
      { id: 'lab-to-cellar', type: 'exit', label: 'Down to the Wine Cellar', icon: '🕳️', x: 50, y: 86,
        targetRoomId: 'wine-cellar' },
      { id: 'lab-exit', type: 'exit', label: 'Back to the Great Hall', icon: '🚪', x: 9, y: 74,
        targetRoomId: 'great-hall' },
    ],
  },

  'wine-cellar': {
    id: 'wine-cellar',
    name: 'The Wine Cellar',
    dark: true,
    description:
      'Rows of dusty barrels recede into the cold. A balance scale stands among them. Five ' +
      'hold the Count\'s wine and weigh the same — but one is heavier than it should be.',
    background: 'radial-gradient(ellipse at 50% 45%, #2a1d1a 0%, #170f0c 60%, #080504 100%)',
    hotspots: [
      { id: 'cellar-barrels', type: 'puzzle', label: 'The Barrels', icon: '🛢️', x: 50, y: 52,
        puzzleId: 'cellar-weighing', description: 'Six barrels and an old balance scale.' },
      { id: 'cellar-exit', type: 'exit', label: 'Up to the Alchemy Lab', icon: '🪜', x: 86, y: 82,
        targetRoomId: 'alchemy-lab' },
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
