import { useGameStore } from '../state/gameStore'
import { ROOMS } from '../data/rooms'
import type { Hotspot as HotspotType } from '../types'
import { Hotspot } from './Hotspot'
import { PuzzleModal } from './PuzzleModal'
import { SCENE_ART } from '../art/Scenes'

/** Hotspots the player should currently see: collected items vanish, solved
 * puzzles vanish, and flag-gated items stay hidden until their flag is set. */
function visibleHotspots(
  hotspots: HotspotType[],
  collected: string[],
  solvedPuzzles: string[],
  flags: Record<string, boolean>,
): HotspotType[] {
  return hotspots.filter((h) => {
    if (h.type === 'item') {
      if (collected.includes(h.id)) return false
      if (h.requiresFlag && !flags[h.requiresFlag]) return false
    }
    if (h.type === 'puzzle' && solvedPuzzles.includes(h.puzzleId)) return false
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
  const solvedPuzzles = useGameStore((s) => s.solvedPuzzles)
  const flags = useGameStore((s) => s.flags)
  const message = useGameStore((s) => s.message)
  const activePuzzleId = useGameStore((s) => s.activePuzzleId)

  const inventory = useGameStore((s) => s.inventory)

  const room = ROOMS[currentRoomId]
  const SceneArt = SCENE_ART[currentRoomId]
  // A dark room stays black until the torch is carried; only exits are usable.
  const isDark = !!room.dark && !inventory.includes('torch')
  const hotspots = visibleHotspots(room.hotspots, collectedHotspots, solvedPuzzles, flags).filter(
    (h) => !isDark || h.type === 'exit',
  )

  return (
    <section className="scene-wrap" aria-label={room.name}>
      <div className={`scene${isDark ? ' scene--dark' : ''}`} style={{ background: room.background }}>
        {SceneArt && <SceneArt />}
        {isDark && <p className="scene-dark-note">Pitch black. You need a light to see in here.</p>}
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
      {activePuzzleId && <PuzzleModal puzzleId={activePuzzleId} />}
    </section>
  )
}
