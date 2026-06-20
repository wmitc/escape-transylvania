import { useState } from 'react'
import type { WeighingPuzzle } from '../data/puzzles'

type Pan = 'L' | 'R' | null

/**
 * Balance deduction puzzle. Load any barrels onto the left or right pan (click a
 * barrel to cycle off → left → right → off), then weigh the two groups. The
 * scale allows only a limited number of weighings, so you must reason rather
 * than test every barrel. When ready, breach the barrel you believe is odd.
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
  const [pans, setPans] = useState<Pan[]>(() => Array(puzzle.count).fill(null))
  const [weighsLeft, setWeighsLeft] = useState(puzzle.maxWeighings)
  const [result, setResult] = useState<string | null>(null)
  const [accuse, setAccuse] = useState(false)
  const [error, setError] = useState(false)

  const isOdd = (i: number) => i === puzzle.oddIndex
  const weight = (i: number) => (isOdd(i) ? (puzzle.heavier ? 1 : -1) : 0)
  const leftCount = pans.filter((p) => p === 'L').length
  const rightCount = pans.filter((p) => p === 'R').length

  function clickBarrel(i: number) {
    setError(false)
    if (accuse) {
      if (isOdd(i)) onSolved()
      else {
        setError(true)
        onWrong?.()
      }
      return
    }
    setResult(null)
    setPans((prev) => {
      const next = [...prev]
      next[i] = prev[i] === null ? 'L' : prev[i] === 'L' ? 'R' : null
      return next
    })
  }

  function weigh() {
    if (weighsLeft <= 0 || (leftCount === 0 && rightCount === 0)) return
    let sumL = 0
    let sumR = 0
    pans.forEach((p, i) => {
      if (p === 'L') sumL += weight(i)
      if (p === 'R') sumR += weight(i)
    })
    setWeighsLeft((w) => w - 1)
    setResult(
      sumL === sumR
        ? 'The scale holds level — both pans weigh the same.'
        : sumL > sumR
          ? 'The left pan sinks lower. The heavy barrel is among the left group.'
          : 'The right pan sinks lower. The heavy barrel is among the right group.',
    )
    setPans(Array(puzzle.count).fill(null))
  }

  function clearPans() {
    setResult(null)
    setPans(Array(puzzle.count).fill(null))
  }

  const outOfWeighings = weighsLeft <= 0

  return (
    <div className="puzzle puzzle--weighing">
      <div className="barrel-row">
        {Array.from({ length: puzzle.count }, (_, i) => {
          const pan = pans[i]
          return (
            <button
              key={i}
              type="button"
              className={`barrel${pan ? ' is-on-pan' : ''}${accuse ? ' is-accuse' : ''}`}
              onClick={() => clickBarrel(i)}
              title={`Barrel ${i + 1}`}
            >
              🛢️
              <span className="barrel__num">{i + 1}</span>
              {pan && <span className="barrel__pan">{pan}</span>}
            </button>
          )
        })}
      </div>

      {!accuse ? (
        <>
          <p className="weigh-pans">
            Left pan: {leftCount} &nbsp;⚖️&nbsp; Right pan: {rightCount}
            <br />
            <span className={outOfWeighings ? 'weigh-low' : ''}>
              Weighings left: {weighsLeft} / {puzzle.maxWeighings}
            </span>
          </p>
          <button
            type="button"
            className="puzzle__submit"
            onClick={weigh}
            disabled={outOfWeighings || (leftCount === 0 && rightCount === 0)}
          >
            {outOfWeighings ? 'The scale has seized' : 'Weigh'}
          </button>
          {result && <p className="weigh-result">{result}</p>}
          <div className="weigh-actions">
            <button type="button" className="hint__toggle" onClick={clearPans}>
              Clear pans
            </button>
            <button type="button" className="hint__toggle" onClick={() => setAccuse(true)}>
              Breach a barrel
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="weigh-pans">Click the barrel you believe is the heavy one.</p>
          {error && <p className="puzzle__error">Only wine pours out. Wrong barrel.</p>}
          <button type="button" className="hint__toggle" onClick={() => { setAccuse(false); setError(false) }}>
            Back to the balance
          </button>
        </>
      )}
    </div>
  )
}
