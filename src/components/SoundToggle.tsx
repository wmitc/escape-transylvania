import { useGameStore } from '../state/gameStore'

/** Button that toggles the background music on/off. */
export function SoundToggle({ className = 'hud__sound' }: { className?: string }) {
  const soundOn = useGameStore((s) => s.soundOn)
  const toggleSound = useGameStore((s) => s.toggleSound)

  return (
    <button
      type="button"
      className={className}
      onClick={toggleSound}
      aria-pressed={soundOn}
      aria-label={soundOn ? 'Turn music off' : 'Turn music on'}
      title={soundOn ? 'Music: on' : 'Music: off'}
    >
      {soundOn ? '🔊' : '🔇'}
    </button>
  )
}
