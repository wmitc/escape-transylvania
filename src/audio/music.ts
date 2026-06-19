/**
 * Procedural gothic background music — synthesised with the Web Audio API, so
 * there are no audio files to ship or license. A low pipe-organ drone plays
 * under a slow minor-key chord progression, with a warm low-pass filter.
 *
 * Browsers block audio until a user gesture, so an AudioContext is created
 * lazily and resumed on the first pointer interaction. `setMusicEnabled` is the
 * only thing the app calls.
 */

let ctx: AudioContext | null = null
let master: GainNode | null = null
let drone: OscillatorNode | null = null
let timer: ReturnType<typeof setInterval> | null = null
let enabled = false
let step = 0
let gestureHooked = false

/** Overall volume — kept low so it stays ambient. */
const TARGET_VOL = 0.16
/** Seconds each chord is held. */
const CHORD_SEC = 4.8

/** A slow D-minor progression (MIDI note numbers): Dm – Gm – A – Dm. */
const PROGRESSION: number[][] = [
  [50, 53, 57],
  [43, 46, 50],
  [45, 49, 52],
  [50, 53, 57],
]

const midiToFreq = (m: number) => 440 * Math.pow(2, (m - 69) / 12)

function ensure() {
  if (ctx) return
  const AC: typeof AudioContext | undefined =
    window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AC) return

  ctx = new AC()
  master = ctx.createGain()
  master.gain.value = 0

  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 1100
  master.connect(filter).connect(ctx.destination)

  // Continuous low organ drone on D2.
  drone = ctx.createOscillator()
  drone.type = 'sine'
  drone.frequency.value = midiToFreq(38)
  const droneGain = ctx.createGain()
  droneGain.gain.value = 0.35
  drone.connect(droneGain).connect(master)
  drone.start()

  if (!gestureHooked) {
    gestureHooked = true
    window.addEventListener('pointerdown', () => {
      if (enabled && ctx && ctx.state !== 'running') void ctx.resume()
    })
  }
}

/** Play one chord with soft organ-like voices and a gentle swell. */
function playChord(notes: number[]) {
  if (!ctx || !master || ctx.state !== 'running') return
  const t = ctx.currentTime
  for (const note of notes) {
    for (const [type, detune] of [['triangle', -4], ['sine', 4]] as const) {
      const osc = ctx.createOscillator()
      osc.type = type
      osc.frequency.value = midiToFreq(note + 12)
      osc.detune.value = detune
      const g = ctx.createGain()
      g.gain.setValueAtTime(0, t)
      g.gain.linearRampToValueAtTime(0.05, t + 1.4) // swell in
      g.gain.linearRampToValueAtTime(0, t + CHORD_SEC + 0.6) // fade out
      osc.connect(g).connect(master)
      osc.start(t)
      osc.stop(t + CHORD_SEC + 0.8)
    }
  }
}

function tick() {
  playChord(PROGRESSION[step % PROGRESSION.length])
  step += 1
}

/** Play a single bell-like tone at the given MIDI note (one-shot sound effect). */
export function playBell(note: number) {
  try {
    ensure()
    if (!ctx) return
    void ctx.resume()
    const t = ctx.currentTime
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.3, t + 0.005)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.8)
    g.connect(ctx.destination) // independent of the music bus, so the bell rings clearly
    for (const [mult, gain] of [[1, 1], [2, 0.4], [3, 0.18]] as const) {
      const o = ctx.createOscillator()
      o.type = 'sine'
      o.frequency.value = midiToFreq(note) * mult
      const og = ctx.createGain()
      og.gain.value = gain
      o.connect(og).connect(g)
      o.start(t)
      o.stop(t + 1.9)
    }
  } catch {
    // ignore audio failures
  }
}

/** Turn the music on or off. Safe to call before any user gesture. */
export function setMusicEnabled(on: boolean) {
  enabled = on
  try {
    if (on) {
      ensure()
      if (!ctx || !master) return
      void ctx.resume()
      master.gain.cancelScheduledValues(ctx.currentTime)
      master.gain.linearRampToValueAtTime(TARGET_VOL, ctx.currentTime + 1.5)
      if (timer == null) {
        tick()
        timer = setInterval(tick, CHORD_SEC * 1000)
      }
    } else {
      if (ctx && master) {
        master.gain.cancelScheduledValues(ctx.currentTime)
        master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8)
      }
      if (timer != null) {
        clearInterval(timer)
        timer = null
      }
    }
  } catch {
    // Web Audio unavailable or blocked — fail silently.
  }
}
