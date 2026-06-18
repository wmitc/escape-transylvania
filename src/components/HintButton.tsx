import { useGameStore } from '../state/gameStore'
import { PUZZLES } from '../data/puzzles'
import type { PuzzleId } from '../types'

/**
 * Reveals a puzzle's hint on demand. Once revealed, the hint stays visible (and
 * is remembered across refreshes) so a stuck player is never re-blocked.
 */
export function HintButton({ puzzleId }: { puzzleId: PuzzleId }) {
  const revealed = useGameStore((s) => !!s.hintsRevealed[puzzleId])
  const revealHint = useGameStore((s) => s.revealHint)
  const puzzle = PUZZLES[puzzleId]

  if (!puzzle?.hint) return null

  if (revealed) {
    return (
      <p className="hint hint--revealed">
        <span className="hint__label">Hint:</span> {puzzle.hint}
      </p>
    )
  }

  return (
    <button type="button" className="hint__button" onClick={() => revealHint(puzzleId)}>
      Need a hint?
    </button>
  )
}
