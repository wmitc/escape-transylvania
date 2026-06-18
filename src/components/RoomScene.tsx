import { useGameStore } from '../state/gameStore'
import { ROOMS } from '../data/rooms'
import type { Hotspot as HotspotType } from '../types'
import { Hotspot } from './Hotspot'

/** Hotspots the player should currently see (collected items vanish; flag-gated
 * items stay hidden until their flag is set). */
function visibleHotspots(
  hotspots: HotspotType[],
  collected: string[],
  flags: Record<string, boolean>,
): HotspotType[] {
  return hotspots.filter((h) => {
    if (h.type === 'item') {
      if (collected.includes(h.id)) return false
      if (h.requiresFlag && !flags[h.requiresFlag]) return false
    }
    return true
  })
}

/**
 * Renders the current room: its placeholder-art background, the description, the
 * positioned hotspots, and the latest feedback message.
 */
export function RoomScene() {
  const currentRoomId = useGameStore((s) => s.currentRoomId)
  const collectedHotspots = useGameStore((s) => s.collectedHotspots)
  const flags = useGameStore((s) => s.flags)
  const message = useGameStore((s) => s.message)

  const room = ROOMS[currentRoomId]
  const hotspots = visibleHotspots(room.hotspots, collectedHotspots, flags)

  return (
    <section className="scene-wrap" aria-label={room.name}>
      <div className="scene" style={{ background: room.background }}>
        {hotspots.map((h) => (
          <Hotspot key={h.id} hotspot={h} />
        ))}
      </div>
      <div className="scene-text">
        <h2 className="scene-title">{room.name}</h2>
        <p className="scene-desc">{room.description}</p>
        <p className="scene-message" role="status">
          {message ?? ' '}
        </p>
      </div>
    </section>
  )
}
