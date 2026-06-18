import { useGameStore } from '../state/gameStore'
import { ROOMS } from '../data/rooms'

/** Top HUD bar: shows where the player is and offers a restart. */
export function Navigation() {
  const currentRoomId = useGameStore((s) => s.currentRoomId)
  const resetGame = useGameStore((s) => s.resetGame)

  const room = ROOMS[currentRoomId]

  function handleRestart() {
    if (window.confirm('Restart from the beginning? Your progress will be lost.')) {
      resetGame()
    }
  }

  return (
    <header className="hud">
      <span className="hud__brand">🦇 Escape Transylvania</span>
      <span className="hud__location" aria-live="polite">
        {room.name}
      </span>
      <button type="button" className="hud__restart" onClick={handleRestart}>
        Restart
      </button>
    </header>
  )
}
