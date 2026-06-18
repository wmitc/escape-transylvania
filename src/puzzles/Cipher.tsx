import { useState } from 'react'
import type { CipherPuzzle } from '../data/puzzles'

/** Shows enciphered text and accepts the decoded word (case-insensitive). */
export function Cipher({ puzzle, onSolved }: { puzzle: CipherPuzzle; onSolved: () => void }) {
  const [answer, setAnswer] = useState('')
  const [error, setError] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (answer.trim().toUpperCase() === puzzle.solution.toUpperCase()) {
      onSolved()
    } else {
      setError(true)
    }
  }

  return (
    <form className="puzzle puzzle--cipher" onSubmit={submit}>
      <p className="cipher__text" aria-label="Enciphered text">
        {puzzle.ciphertext}
      </p>
      <input
        className="cipher__input"
        type="text"
        value={answer}
        onChange={(e) => {
          setAnswer(e.target.value)
          setError(false)
        }}
        placeholder="Decoded word"
        autoFocus
        autoComplete="off"
        spellCheck={false}
      />
      {error && <p className="puzzle__error">That is not the word. Read the cipher again.</p>}
      <button type="submit" className="puzzle__submit">
        Decode
      </button>
    </form>
  )
}
