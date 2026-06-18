import { useGameStore } from '../state/gameStore'

/** Shown when the player unlocks the gate and escapes. */
export function WinScreen() {
  const resetGame = useGameStore((s) => s.resetGame)

  return (
    <div className="app-shell">
      <main className="title-card">
        <p className="kicker">You Have Escaped</p>
        <h1 className="title">
          Free at <span className="title-accent">Last</span>
        </h1>
        <p className="tagline">
          The three locks fall away and the great doors groan open. Cold night air
          rushes in as you flee across the drawbridge into the forest. Behind you, a
          single candle gutters out in the highest tower. You have escaped Transylvania —
          this time.
        </p>
        <button className="enter-button" type="button" onClick={resetGame}>
          Play Again
        </button>
        <p className="footnote">🦇 Thank you for playing</p>
      </main>
    </div>
  )
}
