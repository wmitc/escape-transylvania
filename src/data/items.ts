import type { Item, ItemId } from '../types'

/**
 * All items in the game, keyed by id. Keys (`isKey: true`) count toward
 * unlocking the final castle gate.
 */
export const ITEMS: Record<ItemId, Item> = {
  torch: {
    id: 'torch',
    name: 'Lit Torch',
    icon: '🔥',
    description: 'A guttering torch. Its light pushes back the castle gloom.',
  },
  'rusty-nail': {
    id: 'rusty-nail',
    name: 'Rusty Nail',
    icon: '🔩',
    description: 'A long, rusted nail. Thin enough to pick a crude lock.',
  },
  crowbar: {
    id: 'crowbar',
    name: 'Iron Crowbar',
    icon: '🪓',
    description: 'A heavy iron crowbar. Good for prying open what was meant to stay shut.',
  },
  book: {
    id: 'book',
    name: 'Leather Tome',
    icon: '📕',
    description: 'A cracked leather book. Strange symbols crowd its margins.',
  },
  'sheet-music': {
    id: 'sheet-music',
    name: 'Sheet Music',
    icon: '🎼',
    description: 'Sheet music titled "To Wake the Tower." Ring the bells: Dusk, Raven, Moon, Wolf.',
  },
  vial: {
    id: 'vial',
    name: 'Crimson Vial',
    icon: '🧪',
    description: 'A vial of dark crimson liquid. Best not to ask.',
  },
  'iron-key': {
    id: 'iron-key',
    name: 'Iron Key',
    icon: '🗝️',
    description: 'A heavy iron key, cold to the touch. One of three.',
    isKey: true,
  },
  'silver-key': {
    id: 'silver-key',
    name: 'Silver Key',
    icon: '🔑',
    description: 'A tarnished silver key engraved with a crescent moon.',
    isKey: true,
  },
  'bone-key': {
    id: 'bone-key',
    name: 'Bone Key',
    icon: '🦴',
    description: 'A key carved from bone. It hums faintly in your hand.',
    isKey: true,
  },
}

/**
 * The three locks on the castle gate: which key fits each, and the flag set
 * once it is inserted. The gate opens only when all three flags are set.
 */
export const KEY_HOLES: { keyItemId: ItemId; placedFlag: string }[] = [
  { keyItemId: 'iron-key', placedFlag: 'iron-set' },
  { keyItemId: 'silver-key', placedFlag: 'silver-set' },
  { keyItemId: 'bone-key', placedFlag: 'bone-set' },
]

/** The keys required to open the castle gate, in narrative order. */
export const REQUIRED_KEYS: ItemId[] = KEY_HOLES.map((h) => h.keyItemId)

/** The flags set when each key is placed; the gate opens when all are true. */
export const KEY_SET_FLAGS: string[] = KEY_HOLES.map((h) => h.placedFlag)
