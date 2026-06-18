import { useGameStore } from '../state/gameStore'

/** The title screen. Begins (or resumes) the game. */
export function IntroScreen() {
  const startGame = useGameStore((s) => s.startGame)
  const inventory = useGameStore((s) => s.inventory)
  const hasProgress = inventory.length > 0

  return (
    <div className="app-shell">
      <main className="title-card">
        <p className="kicker">A Point-and-Click Escape Room</p>
        <h1 className="title">
          Escape <span className="title-accent">Transylvania</span>
        </h1>
        <p className="tagline">
          Night has fallen over Castle Dracula, and the doors have locked behind you.
          Search the shadows, solve the Count's puzzles, and find the three keys before
          dawn — or remain his guest forever.
        </p>
        <button className="enter-button" type="button" onClick={startGame}>
          {hasProgress ? 'Continue Your Escape' : 'Enter the Castle'}
        </button>
        <p className="footnote">Click objects to inspect them · find items · escape</p>
      </main>
    </div>
  )
}
