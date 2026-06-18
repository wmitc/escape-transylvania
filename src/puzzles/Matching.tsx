import { useState } from 'react'
import type { MatchingPuzzle } from '../data/puzzles'

/** Shuffle a copy of an array (Fisher–Yates). */
function shuffle<T>(arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/**
 * Connect each left token to its correct right token. Pick a left, then a right;
 * correct pairs lock in. Solved when every pair is matched.
 */
export function Matching({ puzzle, onSolved }: { puzzle: MatchingPuzzle; onSolved: () => void }) {
  // Shuffle the right column once so the answer isn't just "same row".
  const [rights] = useState(() => shuffle(puzzle.pairs.map((p) => p.right)))
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
  const [matched, setMatched] = useState<Record<string, string>>({})
  const [error, setError] = useState(false)

  const isMatchedLeft = (left: string) => left in matched
  const isMatchedRight = (right: string) => Object.values(matched).includes(right)

  function pickRight(right: string) {
    if (!selectedLeft || isMatchedRight(right)) return
    const correct = puzzle.pairs.some((p) => p.left === selectedLeft && p.right === right)
    if (!correct) {
      setError(true)
      setSelectedLeft(null)
      return
    }
    const next = { ...matched, [selectedLeft]: right }
    setMatched(next)
    setSelectedLeft(null)
    setError(false)
    if (Object.keys(next).length === puzzle.pairs.length) onSolved()
  }

  return (
    <div className="puzzle puzzle--matching">
      <div className="match-grid">
        <ul className="match-col">
          {puzzle.pairs.map((p) => (
            <li key={p.left}>
              <button
                type="button"
                className={`match-token${selectedLeft === p.left ? ' is-selected' : ''}${
                  isMatchedLeft(p.left) ? ' is-matched' : ''
                }`}
                disabled={isMatchedLeft(p.left)}
                onClick={() => {
                  setSelectedLeft(p.left)
                  setError(false)
                }}
              >
                {p.left}
              </button>
            </li>
          ))}
        </ul>
        <ul className="match-col">
          {rights.map((right) => (
            <li key={right}>
              <button
                type="button"
                className={`match-token${isMatchedRight(right) ? ' is-matched' : ''}`}
                disabled={isMatchedRight(right)}
                onClick={() => pickRight(right)}
              >
                {right}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {error && <p className="puzzle__error">Those omens do not belong together.</p>}
      <p className="puzzle__progress">
        {Object.keys(matched).length} / {puzzle.pairs.length} matched
      </p>
    </div>
  )
}
