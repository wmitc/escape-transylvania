import { useGameStore } from '../state/gameStore'
import { ITEMS, REQUIRED_KEYS, KEY_SET_FLAGS } from '../data/items'

/**
 * The player's satchel. Click an item to select it, then click the object in the
 * scene you want to use it on. Also tracks how many of the keys are held.
 */
export function Inventory() {
  const inventory = useGameStore((s) => s.inventory)
  const selectedItemId = useGameStore((s) => s.selectedItemId)
  const selectItem = useGameStore((s) => s.selectItem)
  const flags = useGameStore((s) => s.flags)

  // Count keys obtained, whether still carried or already set in the gate.
  const keysHeld =
    inventory.filter((id) => REQUIRED_KEYS.includes(id)).length +
    KEY_SET_FLAGS.filter((f) => flags[f]).length

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
                  onClick={() => selectItem(id)}
                  aria-pressed={selected}
                  title={item.description}
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

      {selectedItemId && ITEMS[selectedItemId] ? (
        <p className="inventory__hint">
          {ITEMS[selectedItemId].icon} Selected — click the object in the scene to use it.
        </p>
      ) : (
        <p className="inventory__save">Progress saves automatically.</p>
      )}
    </aside>
  )
}
