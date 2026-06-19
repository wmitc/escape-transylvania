import { useEffect } from 'react'
import { useGameStore } from '../state/gameStore'
import { setMusicEnabled } from '../audio/music'

/**
 * Bridges the persisted `soundOn` preference to the audio engine. Renders
 * nothing. The engine only makes sound after a user gesture (handled inside it).
 */
export function MusicController() {
  const soundOn = useGameStore((s) => s.soundOn)

  useEffect(() => {
    setMusicEnabled(soundOn)
  }, [soundOn])

  return null
}
