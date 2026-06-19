import { useState } from 'react'
import type { CombinationPuzzle } from '../data/puzzles'

/** A row of digit dials (0–9). Solved when the dials spell the code. */
export function CombinationLock({
  puzzle,
  onSolved,
  onWrong,
}: {
  puzzle: CombinationPuzzle
  onSolved: () => void
  onWrong?: () => void
}) {
  const [digits, setDigits] = useState<number[]>(() => Array(puzzle.length).fill(0))
  const [error, setError] = useState(false)

  function turn(index: number, delta: number) {
    setError(false)
    setDigits((prev) => {
      const next = [...prev]
      next[index] = (next[index] + delta + 10) % 10
      return next
    })
  }

  function submit() {
    if (digits.join('') === puzzle.solution) {
      onSolved()
    } else {
      setError(true)
      onWrong?.()
    }
  }

  return (
    <div className="puzzle puzzle--combination">
      <div className="dials">
        {digits.map((d, i) => (
          <div className="dial" key={i}>
            <button type="button" className="dial__btn" onClick={() => turn(i, 1)} aria-label="Increase digit">
              ▲
            </button>
            <span className="dial__value">{d}</span>
            <button type="button" className="dial__btn" onClick={() => turn(i, -1)} aria-label="Decrease digit">
              ▼
            </button>
          </div>
        ))}
      </div>
      {error && <p className="puzzle__error">The lock holds fast. Try another code.</p>}
      <button type="button" className="puzzle__submit" onClick={submit}>
        Try the Code
      </button>
    </div>
  )
}
