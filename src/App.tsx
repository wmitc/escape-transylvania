import './styles/app.css'
import './styles/game.css'
import { useGameStore } from './state/gameStore'
import { IntroScreen } from './components/IntroScreen'
import { WinScreen } from './components/WinScreen'
import { Navigation } from './components/Navigation'
import { RoomScene } from './components/RoomScene'
import { Inventory } from './components/Inventory'

/**
 * Root component. Picks the screen to show based on the game phase:
 * intro → playing (the castle) → won.
 */
function App() {
  const phase = useGameStore((s) => s.phase)

  if (phase === 'intro') return <IntroScreen />
  if (phase === 'won') return <WinScreen />

  return (
    <div className="game">
      <Navigation />
      <div className="game__body">
        <RoomScene />
        <Inventory />
      </div>
    </div>
  )
}

export default App
