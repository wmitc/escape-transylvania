import { useState } from 'react'
import type { SequencePuzzle } from '../data/puzzles'

/**
 * Press the buttons in the correct order. Each correct press advances; a wrong
 * press resets the run and reports it. Solved when the full order is matched.
 */
export function Sequence({
  puzzle,
  onSolved,
  onWrong,
}: {
  puzzle: SequencePuzzle
  onSolved: () => void
  onWrong?: () => void
}) {
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(false)

  function press(id: string) {
    if (id === puzzle.solution[progress]) {
      const next = progress + 1
      setError(false)
      if (next === puzzle.solution.length) {
        setProgress(0)
        onSolved()
      } else {
        setProgress(next)
      }
    } else {
      setProgress(0)
      setError(true)
      onWrong?.()
    }
  }

  return (
    <div className="puzzle puzzle--sequence">
      <div className="bell-row">
        {puzzle.buttons.map((b) => (
          <button key={b.id} type="button" className="bell" onClick={() => press(b.id)}>
            {b.label}
          </button>
        ))}
      </div>
      <p className="puzzle__progress">
        Rung: {progress} / {puzzle.solution.length}
      </p>
      {error && <p className="puzzle__error">A sour note rings out. The sequence resets.</p>}
    </div>
  )
}
