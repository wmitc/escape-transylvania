import { useEffect, useState } from 'react'
import { useGameStore } from '../state/gameStore'

/** HUD countdown to dawn. Ticks once a second and ends the game at zero. */
export function DawnTimer() {
  const phase = useGameStore((s) => s.phase)
  const deadlineAt = useGameStore((s) => s.deadlineAt)
  const ensureTimer = useGameStore((s) => s.ensureTimer)
  const loseGame = useGameStore((s) => s.loseGame)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    ensureTimer()
  }, [ensureTimer])

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const remaining = deadlineAt == null ? null : Math.max(0, deadlineAt - now)

  useEffect(() => {
    if (phase === 'playing' && remaining === 0) loseGame()
  }, [phase, remaining, loseGame])

  if (remaining == null) return null

  const minutes = Math.floor(remaining / 60000)
  const seconds = Math.floor((remaining % 60000) / 1000)
  const low = remaining <= 5 * 60000

  return (
    <span className={`hud__timer${low ? ' is-low' : ''}`} title="Escape before dawn">
      🌙 {minutes}:{String(seconds).padStart(2, '0')} to dawn
    </span>
  )
}
