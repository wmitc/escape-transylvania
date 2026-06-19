import { useState } from 'react'
import type { RiddlePuzzle } from '../data/puzzles'

/** Shows a riddle and accepts the one-word answer (case-insensitive). */
export function Riddle({
  puzzle,
  onSolved,
  onWrong,
}: {
  puzzle: RiddlePuzzle
  onSolved: () => void
  onWrong?: () => void
}) {
  const [answer, setAnswer] = useState('')
  const [error, setError] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (answer.trim().toLowerCase() === puzzle.solution.toLowerCase()) {
      onSolved()
    } else {
      setError(true)
      onWrong?.()
    }
  }

  return (
    <form className="puzzle puzzle--riddle" onSubmit={submit}>
      <p className="riddle__text">{puzzle.riddle}</p>
      <input
        className="cipher__input"
        type="text"
        value={answer}
        onChange={(e) => {
          setAnswer(e.target.value)
          setError(false)
        }}
        placeholder="Your answer"
        autoFocus
        autoComplete="off"
        spellCheck={false}
      />
      {error && <p className="puzzle__error">The altar stays shut. That is not the answer.</p>}
      <button type="submit" className="puzzle__submit">
        Speak the Word
      </button>
    </form>
  )
}
