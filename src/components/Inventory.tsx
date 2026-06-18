import { useGameStore } from '../state/gameStore'
import { ITEMS, REQUIRED_KEYS } from '../data/items'

/**
 * The player's satchel. Shows collected items (selecting one will let it be used
 * on hotspots in a later PR) and tracks how many of the three keys are held.
 */
export function Inventory() {
  const inventory = useGameStore((s) => s.inventory)
  const selectedItemId = useGameStore((s) => s.selectedItemId)
  const selectItem = useGameStore((s) => s.selectItem)
  const setMessage = useGameStore((s) => s.setMessage)

  const keysHeld = inventory.filter((id) => REQUIRED_KEYS.includes(id)).length

  return (
    <aside className="inventory" aria-label="Inventory">
      <header className="inventory__header">
        <h3>Satchel</h3>
        <span className="inventory__keys" title="Keys to the castle gate">
          🗝️ {keysHeld} / {REQUIRED_KEYS.length}
        </span>
      </header>

      {inventory.length === 0 ? (
        <p className="inventory__empty">Empty. Search the castle.</p>
      ) : (
        <ul className="inventory__list">
          {inventory.map((id) => {
            const item = ITEMS[id]
            if (!item) return null
            const selected = selectedItemId === id
            return (
              <li key={id}>
                <button
                  type="button"
                  className={`inventory__item${selected ? ' is-selected' : ''}`}
                  onClick={() => {
                    selectItem(id)
                    setMessage(selected ? null : item.description)
                  }}
                  aria-pressed={selected}
                  title={item.name}
                >
                  <span className="inventory__icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="inventory__name">{item.name}</span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </aside>
  )
}
