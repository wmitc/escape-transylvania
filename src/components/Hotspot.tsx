import type { Hotspot as HotspotType } from '../types'
import { useGameStore } from '../state/gameStore'

/**
 * A single clickable region in a room scene. What a click does depends on the
 * hotspot's `type`; the matching store action handles the consequences.
 */
export function Hotspot({ hotspot }: { hotspot: HotspotType }) {
  const collectItem = useGameStore((s) => s.collectItem)
  const insertKey = useGameStore((s) => s.insertKey)
  const applyItem = useGameStore((s) => s.applyItem)
  const tryExit = useGameStore((s) => s.tryExit)
  const look = useGameStore((s) => s.look)
  const openPuzzle = useGameStore((s) => s.openPuzzle)
  const filled = useGameStore((s) =>
    hotspot.type === 'keyhole' ? !!s.flags[hotspot.placedFlag] : false,
  )

  function handleClick() {
    switch (hotspot.type) {
      case 'look':
        look(hotspot.description)
        break
      case 'item':
        collectItem(hotspot.id, hotspot.itemId, hotspot.description)
        break
      case 'puzzle':
        openPuzzle(hotspot.puzzleId)
        break
      case 'keyhole':
        insertKey(hotspot.keyItemId, hotspot.placedFlag)
        break
      case 'apply':
        applyItem(hotspot.itemId, hotspot.setsFlag, hotspot.revealMessage, hotspot.emptyDescription)
        break
      case 'exit':
        tryExit(hotspot)
        break
    }
  }

  return (
    <button
      type="button"
      className={`hotspot hotspot--${hotspot.type}${filled ? ' is-filled' : ''}`}
      style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
      onClick={handleClick}
      aria-label={hotspot.label}
      title={hotspot.label}
    >
      <span className="hotspot__label">{filled ? `${hotspot.label} ✓` : hotspot.label}</span>
    </button>
  )
}
