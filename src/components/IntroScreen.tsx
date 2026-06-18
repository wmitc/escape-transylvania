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
        <ul className="howto">
          <li>🔍 Click objects in each room to inspect and collect them.</li>
          <li>🧩 Solve a puzzle in three rooms to earn the iron, silver, and bone keys.</li>
          <li>🚪 Unlock the castle gate with all three keys to escape.</li>
        </ul>
        <button className="enter-button" type="button" onClick={startGame}>
          {hasProgress ? 'Continue Your Escape' : 'Enter the Castle'}
        </button>
        <p className="footnote">
          {hasProgress
            ? 'Your progress is saved in this browser.'
            : 'Stuck on a puzzle? A hint is always one click away.'}
        </p>
      </main>
    </div>
  )
}
