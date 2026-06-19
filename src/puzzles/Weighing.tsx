import { useState } from 'react'
import type { WeighingPuzzle } from '../data/puzzles'

/**
 * Balance puzzle: compare barrels two at a time to find the odd one out, then
 * switch to "breach" mode and accuse it. Accusing the wrong barrel costs time.
 */
export function Weighing({
  puzzle,
  onSolved,
  onWrong,
}: {
  puzzle: WeighingPuzzle
  onSolved: () => void
  onWrong?: () => void
}) {
  const [left, setLeft] = useState<number | null>(null)
  const [right, setRight] = useState<number | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [accuse, setAccuse] = useState(false)
  const [error, setError] = useState(false)

  const weight = (i: number) =>
    i === puzzle.oddIndex ? (puzzle.heavier ? 1 : -1) : 0

  function pick(i: number) {
    setError(false)
    if (accuse) {
      if (i === puzzle.oddIndex) onSolved()
      else {
        setError(true)
        onWrong?.()
      }
      return
    }
    setResult(null)
    if (left === null) setLeft(i)
    else if (right === null && i !== left) setRight(i)
    else {
      setLeft(i)
      setRight(null)
    }
  }

  function weigh() {
    if (left === null || right === null) return
    const d = weight(left) - weight(right)
    setResult(
      d === 0
        ? 'The balance holds level — both weigh the same.'
        : d > 0
          ? `Barrel ${left + 1} sinks lower. It is heavier.`
          : `Barrel ${right + 1} sinks lower. It is heavier.`,
    )
  }

  return (
    <div className="puzzle puzzle--weighing">
      <div className="barrel-row">
        {Array.from({ length: puzzle.count }, (_, i) => {
          const onPan = i === left ? 'L' : i === right ? 'R' : ''
          return (
            <button
              key={i}
              type="button"
              className={`barrel${onPan ? ' is-on-pan' : ''}${accuse ? ' is-accuse' : ''}`}
              onClick={() => pick(i)}
              title={`Barrel ${i + 1}`}
            >
              🛢️
              <span className="barrel__num">{i + 1}</span>
              {onPan && <span className="barrel__pan">{onPan}</span>}
            </button>
          )
        })}
      </div>

      {!accuse ? (
        <>
          <p className="weigh-pans">
            Left: {left === null ? '—' : left + 1} &nbsp;⚖️&nbsp; Right:{' '}
            {right === null ? '—' : right + 1}
          </p>
          <button
            type="button"
            className="puzzle__submit"
            onClick={weigh}
            disabled={left === null || right === null}
          >
            Weigh
          </button>
          {result && <p className="weigh-result">{result}</p>}
          <button type="button" className="hint__toggle" onClick={() => setAccuse(true)}>
            I know which — breach it
          </button>
        </>
      ) : (
        <>
          <p className="weigh-pans">Click the barrel you believe is the odd one.</p>
          {error && <p className="puzzle__error">Only wine pours out. Wrong barrel.</p>}
          <button type="button" className="hint__toggle" onClick={() => setAccuse(false)}>
            Back to the balance
          </button>
        </>
      )}
    </div>
  )
}
