import type { PuzzleId } from '../types'
import { PUZZLES } from '../data/puzzles'
import { ITEMS } from '../data/items'
import { useGameStore } from '../state/gameStore'
import { CombinationLock } from '../puzzles/CombinationLock'
import { Cipher } from '../puzzles/Cipher'
import { Matching } from '../puzzles/Matching'
import { HintButton } from './HintButton'

/**
 * Overlay that hosts the active puzzle. Renders the right puzzle UI for the
 * puzzle's type and, on success, awards the reward item / flag and closes.
 */
export function PuzzleModal({ puzzleId }: { puzzleId: PuzzleId }) {
  const puzzle = PUZZLES[puzzleId]
  const solvePuzzle = useGameStore((s) => s.solvePuzzle)
  const closePuzzle = useGameStore((s) => s.closePuzzle)
  const setMessage = useGameStore((s) => s.setMessage)

  if (!puzzle) return null

  function handleSolved() {
    const reward = puzzle.rewardItemId ? [puzzle.rewardItemId] : []
    solvePuzzle(puzzle.id, reward, puzzle.flag)
    setMessage(puzzle.successMessage)
    closePuzzle()
  }

  const rewardItem = puzzle.rewardItemId ? ITEMS[puzzle.rewardItemId] : undefined

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={puzzle.title}>
      <div className="modal-panel">
        <button type="button" className="modal-close" onClick={closePuzzle} aria-label="Close puzzle">
          ✕
        </button>
        <h3 className="modal-title">{puzzle.title}</h3>
        <p className="modal-prompt">{puzzle.prompt}</p>

        {puzzle.type === 'combination' && <CombinationLock puzzle={puzzle} onSolved={handleSolved} />}
        {puzzle.type === 'cipher' && <Cipher puzzle={puzzle} onSolved={handleSolved} />}
        {puzzle.type === 'matching' && <Matching puzzle={puzzle} onSolved={handleSolved} />}

        <HintButton puzzleId={puzzle.id} />

        {rewardItem && (
          <p className="modal-reward">
            Reward: <span aria-hidden="true">{rewardItem.icon}</span> {rewardItem.name}
          </p>
        )}
      </div>
    </div>
  )
}
