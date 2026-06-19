import { useGameStore } from '../state/gameStore'

/** Shown when dawn breaks before the player escapes. */
export function LoseScreen() {
  const resetGame = useGameStore((s) => s.resetGame)

  return (
    <div className="app-shell">
      <main className="title-card">
        <p className="kicker">Dawn Breaks</p>
        <h1 className="title">
          Too <span className="title-accent">Late</span>
        </h1>
        <p className="tagline">
          The first grey light spills through the windows and the castle stirs. A cold hand
          settles on your shoulder. The Count has risen, and you are still inside his walls.
          Your escape is over — for now.
        </p>
        <button className="enter-button" type="button" onClick={resetGame}>
          Try Again
        </button>
        <p className="footnote">🦇 The night is yours to attempt once more</p>
      </main>
    </div>
  )
}
