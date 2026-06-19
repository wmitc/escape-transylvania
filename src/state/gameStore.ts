import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ExitHotspot, HotspotId, ItemId, PuzzleId, RoomId } from '../types'
import { ITEMS } from '../data/items'
import { STARTING_ROOM_ID } from '../data/rooms'
import { PUZZLES } from '../data/puzzles'

/** Which top-level screen the game is on. */
export type GamePhase = 'intro' | 'playing' | 'won' | 'lost'

/** How long the player has to escape before dawn. */
export const DAWN_MS = 30 * 60 * 1000
/** Time lost for a wrong answer on a lock. */
export const WRONG_ANSWER_PENALTY_SEC = 60

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
  /** Bell ids rung so far in the current attempt (bell-tower sequence). */
  bellsRung: string[]
  /** Epoch ms when dawn breaks and the game is lost; null until the game starts. */
  deadlineAt: number | null
  /** Whether background music is on. */
  soundOn: boolean
  /** Transient feedback line shown to the player. */
  message: string | null

  // --- actions ---
  startGame: () => void
  ensureTimer: () => void
  penalizeTime: (seconds: number, message: string) => void
  loseGame: () => void
  toggleSound: () => void
  enterRoom: (roomId: RoomId) => void
  collectItem: (hotspotId: HotspotId, itemId: ItemId, description: string) => void
  ringBell: (bellId: string, puzzleId: PuzzleId) => void
  insertKey: (keyItemId: ItemId, placedFlag: string) => void
  applyItem: (
    itemId: ItemId,
    setsFlag: string,
    revealMessage: string,
    emptyDescription: string,
  ) => void
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
  bellsRung: [] as string[],
  deadlineAt: null as number | null,
  soundOn: true,
  message: null as string | null,
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...initialState,

      startGame: () => set({ phase: 'playing', message: null, deadlineAt: Date.now() + DAWN_MS }),

      // Start the countdown if it isn't running (covers resumed/older saves).
      ensureTimer: () =>
        set((state) =>
          state.phase === 'playing' && state.deadlineAt == null
            ? { deadlineAt: Date.now() + DAWN_MS }
            : state,
        ),

      penalizeTime: (seconds, message) =>
        set((state) => ({
          deadlineAt: state.deadlineAt == null ? state.deadlineAt : state.deadlineAt - seconds * 1000,
          message,
        })),

      loseGame: () => set({ phase: 'lost', message: null, activePuzzleId: null }),

      toggleSound: () => set((state) => ({ soundOn: !state.soundOn })),

      enterRoom: (roomId) =>
        set({ currentRoomId: roomId, message: null, selectedItemId: null, bellsRung: [] }),

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

      // Ring a bell. Correct bells advance the sequence; a wrong one resets it.
      // Completing the order solves the puzzle and grants its reward.
      ringBell: (bellId, puzzleId) =>
        set((state) => {
          const puzzle = PUZZLES[puzzleId]
          if (!puzzle || puzzle.type !== 'sequence') return state
          if (state.solvedPuzzles.includes(puzzleId)) {
            return { message: 'The bells hang silent — their work is done.' }
          }
          const labelOf = (id: string) =>
            puzzle.buttons.find((b) => b.id === id)?.label ?? id

          if (bellId !== puzzle.solution[state.bellsRung.length]) {
            return { message: 'A sour note rings out — the bells fall silent and reset.', bellsRung: [] }
          }

          const rung = [...state.bellsRung, bellId]
          if (rung.length < puzzle.solution.length) {
            return {
              bellsRung: rung,
              message: `${labelOf(bellId)} tolls… (${rung.length}/${puzzle.solution.length})`,
            }
          }
          // Completed in the right order.
          const reward = puzzle.rewardItemId ? [puzzle.rewardItemId] : []
          const newItems = reward.filter((id) => !state.inventory.includes(id))
          return {
            bellsRung: [],
            solvedPuzzles: [...state.solvedPuzzles, puzzleId],
            inventory: [...state.inventory, ...newItems],
            flags: puzzle.flag ? { ...state.flags, [puzzle.flag]: true } : state.flags,
            message: puzzle.successMessage,
          }
        }),

      // Insert a key into its keyhole. The matching key must be SELECTED in the
      // satchel first; once placed it leaves the satchel and sets the flag.
      insertKey: (keyItemId, placedFlag) =>
        set((state) => {
          const key = ITEMS[keyItemId]
          if (state.flags[placedFlag]) {
            return { message: `The ${key?.name ?? 'key'} is already set in the lock.` }
          }
          if (state.selectedItemId !== keyItemId) {
            return {
              message: state.selectedItemId
                ? `The ${ITEMS[state.selectedItemId]?.name ?? 'item'} doesn't fit this lock.`
                : 'Select the right key from your satchel, then click the lock.',
            }
          }
          if (!state.inventory.includes(keyItemId)) {
            return { message: `You don't have the ${key?.name ?? 'right key'}.` }
          }
          return {
            inventory: state.inventory.filter((i) => i !== keyItemId),
            flags: { ...state.flags, [placedFlag]: true },
            selectedItemId: null,
            message: `You set the ${key?.name ?? 'key'} into the lock. It turns with a heavy clunk.`,
          }
        }),

      // Use a one-shot item on a hotspot (e.g. pour the vial into the cauldron).
      // The item must be SELECTED first; it is then consumed and sets a flag.
      // Re-inspecting after applying shows the reveal again.
      applyItem: (itemId, setsFlag, revealMessage, emptyDescription) =>
        set((state) => {
          if (state.flags[setsFlag]) return { message: revealMessage }
          if (state.selectedItemId !== itemId) {
            return {
              message: state.selectedItemId
                ? `The ${ITEMS[state.selectedItemId]?.name ?? 'item'} does nothing here.`
                : emptyDescription,
            }
          }
          if (!state.inventory.includes(itemId)) return { message: emptyDescription }
          return {
            inventory: state.inventory.filter((i) => i !== itemId),
            flags: { ...state.flags, [setsFlag]: true },
            selectedItemId: null,
            message: revealMessage,
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
        // Some puzzles can't be attempted without the right item SELECTED (e.g.
        // select the tome, then click the cipher). The item is not consumed.
        if (puzzle.requiresItemId) {
          if (state.selectedItemId !== puzzle.requiresItemId) {
            set({
              message: state.selectedItemId
                ? `The ${ITEMS[state.selectedItemId]?.name ?? 'item'} is no use here.`
                : puzzle.requiresItemMessage ?? 'You need the right item selected to attempt this.',
            })
            return
          }
          if (!state.inventory.includes(puzzle.requiresItemId)) {
            set({ message: puzzle.requiresItemMessage ?? 'You are missing something needed here.' })
            return
          }
        }
        set({ activePuzzleId: puzzleId, message: null, selectedItemId: null })
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

      // Selecting an item shows what it is / what it says (so notes and the
      // sheet music can be read); the satchel footer shows the "click to use" hint.
      selectItem: (itemId) =>
        set((state) => {
          const deselect = state.selectedItemId === itemId
          const item = itemId ? ITEMS[itemId] : undefined
          return {
            selectedItemId: deselect ? null : itemId,
            message: deselect || !item ? null : item.description,
          }
        }),

      setFlag: (flag, value = true) =>
        set((state) => ({ flags: { ...state.flags, [flag]: value } })),

      setMessage: (message) => set({ message }),

      hasKey: (itemId) => get().inventory.includes(itemId),

      // Reset progress but keep the sound preference.
      resetGame: () => set((state) => ({ ...initialState, soundOn: state.soundOn })),
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
        deadlineAt: state.deadlineAt,
        soundOn: state.soundOn,
      }),
    },
  ),
)
