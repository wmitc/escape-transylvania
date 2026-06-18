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
  book: {
    id: 'book',
    name: 'Leather Tome',
    icon: '📕',
    description: 'A cracked leather book. Strange symbols crowd its margins.',
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

/** The keys required to open the castle gate, in narrative order. */
export const REQUIRED_KEYS: ItemId[] = ['iron-key', 'silver-key', 'bone-key']
