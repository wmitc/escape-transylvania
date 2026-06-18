import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ExitHotspot, HotspotId, ItemId, PuzzleId, RoomId } from '../types'
import { ITEMS } from '../data/items'
import { STARTING_ROOM_ID } from '../data/rooms'
import { PUZZLES } from '../data/puzzles'

/** Which top-level screen the game is on. */
export type GamePhase = 'intro' | 'playing' | 'won'

interface GameState {
  phase: GamePhase
  currentRoomId: RoomId
  /** Item ids the player is carrying. */
  inventory: ItemId[]
  /** Hotspot ids that have been consumed (e.g. items already picked up). */
  collectedHotspots: HotspotId[]
  solvedPuzzles: PuzzleId[]
  /** Arbitrary game flags (unlocked doors, triggered events, ...). */
  flags: Record<string, boolean>
  /** Item currently selected for "use on hotspot" interactions. */
  selectedItemId: ItemId | null
  /** Puzzle whose panel is currently open, if any. */
  activePuzzleId: PuzzleId | null
  /** Transient feedback line shown to the player. */
  message: string | null

  // --- actions ---
  startGame: () => void
  enterRoom: (roomId: RoomId) => void
  collectItem: (hotspotId: HotspotId, itemId: ItemId, description: string) => void
  insertKey: (keyItemId: ItemId, placedFlag: string) => void
  tryExit: (exit: ExitHotspot) => void
  look: (description: string) => void
  openPuzzle: (puzzleId: PuzzleId) => void
  closePuzzle: () => void
  solvePuzzle: (puzzleId: PuzzleId, rewardItemIds?: ItemId[], flag?: string) => void
  selectItem: (itemId: ItemId | null) => void
  setFlag: (flag: string, value?: boolean) => void
  setMessage: (message: string | null) => void
  hasKey: (itemId: ItemId) => boolean
  resetGame: () => void
}

const initialState = {
  phase: 'intro' as GamePhase,
  currentRoomId: STARTING_ROOM_ID,
  inventory: [] as ItemId[],
  collectedHotspots: [] as HotspotId[],
  solvedPuzzles: [] as PuzzleId[],
  flags: {} as Record<string, boolean>,
  selectedItemId: null as ItemId | null,
  activePuzzleId: null as PuzzleId | null,
  message: null as string | null,
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...initialState,

      startGame: () => set({ phase: 'playing', message: null }),

      enterRoom: (roomId) => set({ currentRoomId: roomId, message: null, selectedItemId: null }),

      collectItem: (hotspotId, itemId, description) =>
        set((state) => {
          if (state.collectedHotspots.includes(hotspotId)) return state
          const item = ITEMS[itemId]
          return {
            inventory: state.inventory.includes(itemId)
              ? state.inventory
              : [...state.inventory, itemId],
            collectedHotspots: [...state.collectedHotspots, hotspotId],
            message: description || `You picked up the ${item?.name ?? itemId}.`,
          }
        }),

      // Insert a key into its keyhole. The key must be in the inventory; once
      // placed it leaves the satchel and sets the keyhole's flag.
      insertKey: (keyItemId, placedFlag) =>
        set((state) => {
          const key = ITEMS[keyItemId]
          if (state.flags[placedFlag]) {
            return { message: `The ${key?.name ?? 'key'} is already set in the lock.` }
          }
          if (!state.inventory.includes(keyItemId)) {
            return { message: `You don't have the ${key?.name ?? 'right key'} yet.` }
          }
          return {
            inventory: state.inventory.filter((i) => i !== keyItemId),
            flags: { ...state.flags, [placedFlag]: true },
            selectedItemId: state.selectedItemId === keyItemId ? null : state.selectedItemId,
            message: `You set the ${key?.name ?? 'key'} into the lock. It turns with a heavy clunk.`,
          }
        }),

      tryExit: (exit) => {
        const state = get()

        if (exit.requiresFlag && !state.flags[exit.requiresFlag]) {
          set({ message: exit.lockedMessage ?? 'It will not budge.' })
          return
        }
        if (exit.requiresFlags && !exit.requiresFlags.every((f) => state.flags[f])) {
          set({ message: exit.lockedMessage ?? 'It is locked.' })
          return
        }
        if (exit.requiresKeys && !exit.requiresKeys.every((k) => state.inventory.includes(k))) {
          set({ message: exit.lockedMessage ?? 'It is locked.' })
          return
        }

        if (exit.isEscape) {
          set({ phase: 'won', message: null })
          return
        }
        get().enterRoom(exit.targetRoomId)
      },

      look: (description) => set({ message: description }),

      openPuzzle: (puzzleId) => {
        const state = get()
        const puzzle = PUZZLES[puzzleId]
        if (!puzzle) return
        if (state.solvedPuzzles.includes(puzzleId)) {
          set({ message: 'You have already solved this.' })
          return
        }
        // Some puzzles can't be attempted without the right item in hand.
        if (puzzle.requiresItemId && !state.inventory.includes(puzzle.requiresItemId)) {
          set({ message: puzzle.requiresItemMessage ?? 'You are missing something needed here.' })
          return
        }
        set({ activePuzzleId: puzzleId, message: null })
      },

      closePuzzle: () => set({ activePuzzleId: null }),

      solvePuzzle: (puzzleId, rewardItemIds = [], flag) =>
        set((state) => {
          if (state.solvedPuzzles.includes(puzzleId)) return state
          const newItems = rewardItemIds.filter((id) => !state.inventory.includes(id))
          return {
            solvedPuzzles: [...state.solvedPuzzles, puzzleId],
            inventory: [...state.inventory, ...newItems],
            flags: flag ? { ...state.flags, [flag]: true } : state.flags,
          }
        }),

      selectItem: (itemId) =>
        set((state) => ({ selectedItemId: state.selectedItemId === itemId ? null : itemId })),

      setFlag: (flag, value = true) =>
        set((state) => ({ flags: { ...state.flags, [flag]: value } })),

      setMessage: (message) => set({ message }),

      hasKey: (itemId) => get().inventory.includes(itemId),

      resetGame: () => set({ ...initialState }),
    }),
    {
      name: 'escape-transylvania-save',
      // Persist progress, not transient UI bits (selected item / message).
      partialize: (state) => ({
        phase: state.phase,
        currentRoomId: state.currentRoomId,
        inventory: state.inventory,
        collectedHotspots: state.collectedHotspots,
        solvedPuzzles: state.solvedPuzzles,
        flags: state.flags,
      }),
    },
  ),
)
