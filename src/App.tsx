import './styles/app.css'
import './styles/game.css'
import { useGameStore } from './state/gameStore'
import { IntroScreen } from './components/IntroScreen'
import { WinScreen } from './components/WinScreen'
import { LoseScreen } from './components/LoseScreen'
import { Navigation } from './components/Navigation'
import { RoomScene } from './components/RoomScene'
import { Inventory } from './components/Inventory'
import { MusicController } from './components/MusicController'

/**
 * Root component. Picks the screen to show based on the game phase:
 * intro → playing (the castle) → won / lost.
 */
function App() {
  const phase = useGameStore((s) => s.phase)

  return (
    <>
      <MusicController />
      {phase === 'intro' && <IntroScreen />}
      {phase === 'won' && <WinScreen />}
      {phase === 'lost' && <LoseScreen />}
      {phase === 'playing' && (
        <div className="game">
          <Navigation />
          <div className="game__body">
            <RoomScene />
            <Inventory />
          </div>
        </div>
      )}
    </>
  )
}

export default App
