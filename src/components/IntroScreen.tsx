import { useGameStore } from '../state/gameStore'
import { SoundToggle } from './SoundToggle'

/** The title screen. Begins (or resumes) the game. */
export function IntroScreen() {
  const startGame = useGameStore((s) => s.startGame)
  const inventory = useGameStore((s) => s.inventory)
  const hasProgress = inventory.length > 0

  return (
    <div className="app-shell">
      <SoundToggle className="corner-sound" />
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
          <li>🔍 Click objects to inspect them; click a satchel item to select it, then click where to use it.</li>
          <li>🧩 Solve the castle's puzzles to earn the three keys to the gate.</li>
          <li>🌙 Escape before dawn — wrong answers on a lock cost you precious minutes.</li>
        </ul>
        <button className="enter-button" type="button" onClick={startGame}>
          {hasProgress ? 'Continue Your Escape' : 'Enter the Castle'}
        </button>
        <p className="footnote">
          {hasProgress
            ? 'Your progress is saved in this browser.'
            : 'Every clue you need is hidden in the castle. Explore carefully.'}
        </p>
      </main>
    </div>
  )
}
