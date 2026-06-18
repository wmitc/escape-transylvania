import './styles/app.css'

/**
 * Root component. For the bootstrap this is just the gothic title shell — the
 * actual game engine (rooms, inventory, puzzles) is added in later PRs.
 */
function App() {
  return (
    <div className="app-shell">
      <main className="title-card">
        <p className="kicker">A Point-and-Click Escape Room</p>
        <h1 className="title">
          Escape <span className="title-accent">Transylvania</span>
        </h1>
        <p className="tagline">
          Night has fallen over Castle Dracula, and the doors have locked behind you.
          Search the shadows, solve the Count's puzzles, and find the keys before dawn —
          or remain his guest forever.
        </p>
        <button className="enter-button" type="button" disabled>
          Enter the Castle — coming soon
        </button>
        <p className="footnote">Bootstrap build · the castle awaits its rooms</p>
      </main>
    </div>
  )
}

export default App
