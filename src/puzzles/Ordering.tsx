import { useState } from 'react'
import type { OrderingPuzzle } from '../data/puzzles'

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
 * Arrange tiles into the correct order. Move tiles up/down, then confirm.
 * Solved when the order matches the puzzle's solution.
 */
export function Ordering({
  puzzle,
  onSolved,
  onWrong,
}: {
  puzzle: OrderingPuzzle
  onSolved: () => void
  onWrong?: () => void
}) {
  const [order, setOrder] = useState<string[]>(() => {
    // Start shuffled, but never already-solved.
    let ids = puzzle.tiles.map((t) => t.id)
    do {
      ids = shuffle(ids)
    } while (ids.join() === puzzle.solution.join())
    return ids
  })
  const [error, setError] = useState(false)

  const labelOf = (id: string) => puzzle.tiles.find((t) => t.id === id)?.label ?? id

  function move(index: number, dir: -1 | 1) {
    const target = index + dir
    if (target < 0 || target >= order.length) return
    setError(false)
    setOrder((prev) => {
      const next = [...prev]
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  function confirm() {
    if (order.join() === puzzle.solution.join()) onSolved()
    else {
      setError(true)
      onWrong?.()
    }
  }

  return (
    <div className="puzzle puzzle--ordering">
      <ol className="order-list">
        {order.map((id, i) => (
          <li key={id} className="order-row">
            <span className="order-rank">{i + 1}</span>
            <span className="order-label">{labelOf(id)}</span>
            <span className="order-controls">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">
                ▲
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === order.length - 1}
                aria-label="Move down"
              >
                ▼
              </button>
            </span>
          </li>
        ))}
      </ol>
      {error && <p className="puzzle__error">The dead do not rest. That order is wrong.</p>}
      <button type="button" className="puzzle__submit" onClick={confirm}>
        Seal the Niches
      </button>
    </div>
  )
}
