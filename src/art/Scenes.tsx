import type { ReactElement } from 'react'
import type { RoomId } from '../types'
import { useGameStore } from '../state/gameStore'

/** An arched doorway opening, used as the visible target for exit hotspots. */
function Archway({ cx, top = 104 }: { cx: number; top?: number }) {
  const w = 24
  return (
    <g>
      <path
        d={`M${cx - w} 180 V${top} q0 -22 ${w} -22 q${w} 0 ${w} 22 V180 z`}
        fill="#080510"
        stroke="#2a2030"
        strokeWidth="2.5"
      />
      <path
        d={`M${cx - w + 5} 180 V${top + 3} q0 -17 ${w - 5} -17 q${w - 5} 0 ${w - 5} 17 V180 z`}
        fill="#05030a"
      />
    </g>
  )
}

/**
 * A 2D spiral staircase: treads fan out from a central pole to an outer edge
 * that traces a smooth sine wave (the helix seen from the side). Treads at the
 * front of the turn (sticking out to the right) are lighter; those at the back
 * (left, partly behind the pole) are darker.
 */
function SpiralStair({ cx, baseY = 148, steps = 12 }: { cx: number; baseY?: number; steps?: number }) {
  const stepH = 7.2
  const amp = 22
  const phase = (i: number) => Math.sin(i * 0.62)
  const topY = baseY - (steps - 1) * stepH

  const back: ReactElement[] = []
  const front: ReactElement[] = []
  for (let i = 0; i < steps; i++) {
    const y = baseY - i * stepH
    const s = phase(i)
    const tipX = cx + amp * s
    const right = s >= 0
    // A wedge tread from the pole out to the rail, with a little top-face depth.
    const tread = (
      <g key={i}>
        <path
          d={`M${cx} ${y} L${tipX} ${y - 3.5} L${tipX} ${y + 0.5} L${cx} ${y + 4} Z`}
          fill={right ? '#4a4364' : '#2c2742'}
          stroke="#14111e"
          strokeWidth="0.7"
        />
        <path d={`M${cx} ${y + 4} L${tipX} ${y + 0.5} L${tipX} ${y + 2.5} L${cx} ${y + 6} Z`} fill="#14111e" />
      </g>
    )
    ;(right ? front : back).push(tread)
  }

  // Smooth outer handrail, sampled finely so it reads as one flowing helix edge.
  const samples = steps * 5
  let rail = ''
  for (let s = 0; s <= samples; s++) {
    const i = (s / samples) * (steps - 1)
    const x = (cx + amp * phase(i)).toFixed(1)
    const y = (baseY - i * stepH - 3.5).toFixed(1)
    rail += `${s === 0 ? 'M' : 'L'}${x} ${y}`
  }

  return (
    <g>
      {back}
      <rect x={cx - 2.5} y={topY - 5} width="5" height={baseY - topY + 12} fill="#39324e" stroke="#15121f" strokeWidth="1" />
      {front}
      <path d={rail} fill="none" stroke="#6a6086" strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />
    </g>
  )
}

/**
 * Hand-drawn gothic scene art, one SVG per room. These are the room
 * "backgrounds": RoomScene renders the matching scene behind the hotspots.
 * They are pure vector (no external assets) and can be swapped for real
 * artwork later by replacing the component for a room id in SCENE_ART.
 *
 * Coordinate system is 320 x 180 (16:9); scenes are sliced to fill the frame.
 */

const sceneProps = {
  viewBox: '0 0 320 180',
  preserveAspectRatio: 'xMidYMid slice',
  width: '100%',
  height: '100%',
  className: 'scene-art',
} as const

/** Repeating stone-block courses used by several rooms. */
function StoneCourses({ fill = '#000', opacity = 0.25 }: { fill?: string; opacity?: number }) {
  const rows = [16, 40, 64, 88, 112]
  return (
    <g stroke={fill} strokeWidth={1} opacity={opacity}>
      {rows.map((y, r) => (
        <g key={y}>
          <line x1={0} y1={y} x2={320} y2={y} />
          {Array.from({ length: 7 }, (_, i) => {
            const x = i * 48 + (r % 2 ? 24 : 0)
            return <line key={i} x1={x} y1={y} x2={x} y2={y + 24} />
          })}
        </g>
      ))}
    </g>
  )
}

function DungeonScene() {
  const opened = useGameStore((s) => !!s.flags['catacombs-open'])
  return (
    <svg {...sceneProps}>
      <defs>
        <linearGradient id="dg-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#26202e" />
          <stop offset="1" stopColor="#0a0710" />
        </linearGradient>
        <radialGradient id="dg-moon" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#e8eefc" />
          <stop offset="0.6" stopColor="#9fb0cc" />
          <stop offset="1" stopColor="#3a4a6a" />
        </radialGradient>
      </defs>
      <rect width="320" height="180" fill="url(#dg-wall)" />
      <StoneCourses fill="#000" opacity={0.3} />
      {/* moonlit barred window, high on the wall */}
      <g>
        <path d="M150 14 q22 -20 44 0 v34 h-44 z" fill="#0c1226" stroke="#3a3340" strokeWidth="3" />
        <circle cx="172" cy="34" r="13" fill="url(#dg-moon)" />
        <g stroke="#1b2440" strokeWidth="3">
          <line x1="161" y1="14" x2="161" y2="48" />
          <line x1="172" y1="8" x2="172" y2="48" />
          <line x1="183" y1="14" x2="183" y2="48" />
          <line x1="150" y1="31" x2="194" y2="31" />
        </g>
      </g>
      {/* hanging chains on the left */}
      <g stroke="#4a4150" strokeWidth="2.5" fill="none" opacity="0.9">
        <path d="M44 0 q4 14 0 28 q-4 14 0 28 q4 14 0 26" />
        <path d="M70 0 q-4 12 0 24 q4 12 0 24" />
      </g>
      <circle cx="44" cy="84" r="4" fill="none" stroke="#4a4150" strokeWidth="2.5" />
      {/* iron cell gate, centre */}
      <g>
        <rect x="120" y="56" width="92" height="104" fill="#0a0812" />
        <g stroke="#5a5260" strokeWidth="4">
          {[128, 146, 164, 182, 200].map((x) => (
            <line key={x} x1={x} y1="56" x2={x} y2="160" />
          ))}
          <line x1="120" y1="80" x2="212" y2="80" />
          <line x1="120" y1="120" x2="212" y2="120" />
        </g>
        <rect x="118" y="52" width="96" height="8" fill="#3a3340" />
        {/* lock plate */}
        <rect x="185" y="96" width="14" height="18" rx="2" fill="#2a2230" stroke="#7a6a3a" strokeWidth="1.5" />
        <circle cx="192" cy="103" r="2.4" fill="#0a0812" />
      </g>
      {/* torch on the right wall */}
      <g>
        <rect x="246" y="40" width="6" height="34" fill="#3b2a1c" />
        <path d="M249 24 q-9 8 -4 16 q9 -2 8 -10 q4 8 -1 14 q11 -3 9 -16 q-7 4 -7 -2 q-3 5 -5 -2 z" fill="#e8a04a" />
        <path d="M249 28 q-5 6 -2 11 q6 -2 4 -8 q3 5 0 9 q6 -3 5 -10 q-5 3 -6 -1 z" fill="#f7d97a" />
      </g>
      {/* stairwell down to the catacombs, lower right.
          Sealed: boarded over with planks. Opened: planks splintered aside,
          revealing descending stone steps into the dark. */}
      <g>
        <path d="M214 150 l22 -42 h46 l-22 42 z" fill="#070409" stroke="#2a2030" strokeWidth="2" />
        {opened ? (
          <>
            {/* descending steps into the black */}
            <g fill="#15121b" stroke="#2a2030" strokeWidth="1">
              <path d="M218 148 l40 0 l-3 6 l-40 0 z" />
              <path d="M222 140 l40 0 l-3 6 l-40 0 z" />
              <path d="M226 132 l40 0 l-3 6 l-40 0 z" />
              <path d="M230 124 l40 0 l-3 6 l-40 0 z" />
            </g>
            {/* the two pried-off planks, splintered aside */}
            <g stroke="#5a3f28" strokeWidth="5" strokeLinecap="round">
              <line x1="206" y1="150" x2="232" y2="166" transform="rotate(-18 206 150)" />
              <line x1="270" y1="118" x2="296" y2="112" transform="rotate(20 270 118)" />
            </g>
          </>
        ) : (
          <>
            <g stroke="#5a3f28" strokeWidth="5">
              <line x1="224" y1="146" x2="270" y2="120" />
              <line x1="220" y1="134" x2="266" y2="108" />
            </g>
            <line x1="218" y1="150" x2="274" y2="118" stroke="#3b2a1c" strokeWidth="2" />
          </>
        )}
      </g>
      {/* straw and floor */}
      <rect x="0" y="152" width="320" height="28" fill="#0a0710" />
      <g stroke="#7a6326" strokeWidth="2" opacity="0.8">
        {Array.from({ length: 16 }, (_, i) => {
          const x = 70 + i * 5
          return <line key={i} x1={x} y1="160" x2={x + (i % 3) - 1} y2="150" />
        })}
      </g>
    </svg>
  )
}

function GreatHallScene() {
  return (
    <svg {...sceneProps}>
      <defs>
        <linearGradient id="gh-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a2a1e" />
          <stop offset="1" stopColor="#0e0a08" />
        </linearGradient>
        <linearGradient id="gh-banner" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a0263a" />
          <stop offset="1" stopColor="#5a1420" />
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill="url(#gh-wall)" />
      {/* five archway passages — one per exit (dungeon, library, chapel, lab, gate) */}
      <Archway cx={35} />
      <Archway cx={95} />
      <Archway cx={160} />
      <Archway cx={225} />
      <Archway cx={285} />
      {/* grand portrait of the Count — a pale, red-eyed, fanged vampire */}
      <g>
        <rect x="126" y="22" width="68" height="80" rx="2" fill="#1a1018" stroke="#b8954f" strokeWidth="4" />
        <rect x="134" y="30" width="52" height="64" fill="#1b1226" />
        {/* high pointed vampire cape collar rising behind the head */}
        <path d="M138 94 L141 49 L157 80 Z" fill="#08060e" />
        <path d="M182 94 L179 49 L163 80 Z" fill="#08060e" />
        {/* cloaked shoulders */}
        <path d="M137 94 Q160 78 183 94 Z" fill="#0c0914" />
        {/* pale face */}
        <ellipse cx="160" cy="58" rx="11" ry="14" fill="#d7cfc0" />
        {/* gaunt cheek shadow */}
        <path d="M151 60 Q160 69 169 60 Q160 63 151 60 Z" fill="#b9ad9c" opacity="0.6" />
        {/* black hair, slicked back to a widow's peak */}
        <path d="M148 53 Q149 41 160 40 Q171 41 172 53 Q166 47 160 51 Q154 47 148 53 Z" fill="#09090e" />
        {/* sinister angled brows */}
        <path d="M152 53.5 L158 55.5" stroke="#09090e" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M168 53.5 L162 55.5" stroke="#09090e" strokeWidth="1.2" strokeLinecap="round" />
        {/* glowing red eyes */}
        <ellipse cx="155.6" cy="57.4" rx="1.9" ry="1.3" fill="#e23b2a" />
        <ellipse cx="164.4" cy="57.4" rx="1.9" ry="1.3" fill="#e23b2a" />
        <circle cx="155.6" cy="57.4" r="0.6" fill="#5a0c0c" />
        <circle cx="164.4" cy="57.4" r="0.6" fill="#5a0c0c" />
        {/* nose */}
        <path d="M160 58 L158.6 63 L161.4 63 Z" fill="#bfb3a2" />
        {/* mouth with bared fangs */}
        <path d="M155 66 Q160 68.5 165 66" stroke="#5a1518" strokeWidth="1" fill="none" />
        <path d="M157.2 66.4 L158.1 69.4 L159 66.4 Z" fill="#f4f0e6" />
        <path d="M161 66.4 L161.9 69.4 L162.8 66.4 Z" fill="#f4f0e6" />
      </g>
      {/* two hanging banners with a crest */}
      {[70, 250].map((x) => (
        <g key={x}>
          <path d={`M${x - 15} 12 h30 v60 l-15 11 l-15 -11 z`} fill="url(#gh-banner)" />
          <path d={`M${x} 34 l6 6 l-6 6 l-6 -6 z`} fill="#e8c987" opacity="0.85" />
        </g>
      ))}
      {/* wall sconces flanking the portrait */}
      {[100, 220].map((x) => (
        <g key={x}>
          <rect x={x - 1.5} y="60" width="3" height="12" fill="#b8954f" />
          <path d={`M${x} 52 q-4 5 0 9 q4 -4 0 -9 z`} fill="#f7d97a" />
        </g>
      ))}
      {/* pinned alchemist's note on the wall (the lab combination clue) */}
      <g transform="rotate(-4 88 70)">
        <rect x="76" y="56" width="24" height="30" fill="#d8c8a8" stroke="#b8a888" strokeWidth="1" />
        <circle cx="88" cy="58" r="2" fill="#8b1e2d" />
        <g stroke="#6a5a3a" strokeWidth="1" opacity="0.7">
          <line x1="80" y1="64" x2="96" y2="64" />
          <line x1="80" y1="69" x2="96" y2="69" />
          <line x1="80" y1="74" x2="92" y2="74" />
          <line x1="80" y1="79" x2="96" y2="79" />
        </g>
      </g>
      {/* checkered floor */}
      <g>
        <rect x="0" y="160" width="320" height="20" fill="#1a120c" />
        {Array.from({ length: 16 }, (_, i) => (
          <rect key={i} x={i * 20} y="160" width="20" height="20" fill={i % 2 ? '#241710' : '#0e0908'} />
        ))}
      </g>
    </svg>
  )
}

function LibraryScene() {
  return (
    <svg {...sceneProps}>
      <defs>
        <linearGradient id="lib-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2c2418" />
          <stop offset="1" stopColor="#0a0805" />
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill="url(#lib-wall)" />
      {/* tall bookshelf on the left */}
      {[8].map((bx) => (
        <g key={bx}>
          <rect x={bx} y="10" width="64" height="150" fill="#241a10" stroke="#3b2a1c" strokeWidth="3" />
          {[18, 46, 74, 102, 130].map((sy) => (
            <g key={sy}>
              <rect x={bx + 4} y={sy + 18} width="56" height="3" fill="#3b2a1c" />
              {Array.from({ length: 8 }, (_, i) => {
                const colors = ['#6a2230', '#3a5a3a', '#5a4a8a', '#7a6326', '#883322']
                return (
                  <rect
                    key={i}
                    x={bx + 5 + i * 7}
                    y={sy + (i % 3) - 2}
                    width="5.5"
                    height={20 - (i % 3) * 2}
                    fill={colors[(i + sy) % colors.length]}
                  />
                )
              })}
            </g>
          ))}
        </g>
      ))}
      {/* doorway out, on the right */}
      <Archway cx={286} />
      {/* a short wall shelf above the doorway keeps the library feel */}
      <g>
        <rect x="238" y="58" width="68" height="4" fill="#3b2a1c" />
        {Array.from({ length: 9 }, (_, i) => {
          const colors = ['#6a2230', '#3a5a3a', '#5a4a8a', '#7a6326', '#883322']
          return (
            <rect key={i} x={242 + i * 7} y={40 + (i % 3)} width="5.5" height={18 - (i % 3) * 2}
              fill={colors[(i + 2) % colors.length]} />
          )
        })}
      </g>
      {/* arched window with moonlight, centre-back */}
      <path d="M138 18 q22 -22 44 0 v54 h-44 z" fill="#11203a" stroke="#3b2a1c" strokeWidth="3" />
      <g stroke="#243a5a" strokeWidth="2">
        <line x1="160" y1="10" x2="160" y2="72" />
        <line x1="138" y1="44" x2="182" y2="44" />
      </g>
      {/* lectern with open tome, a locked drawer, and a candle */}
      <g>
        <path d="M150 150 l20 0 l8 -34 l-36 0 z" fill="#3b2a1c" stroke="#5a3f28" strokeWidth="2" />
        {/* locked drawer (the cipher) */}
        <rect x="151" y="130" width="18" height="12" rx="1" fill="#2a1d12" stroke="#5a3f28" strokeWidth="1.5" />
        <circle cx="160" cy="136" r="1.6" fill="#b8954f" />
        {/* sloped reading surface + open book */}
        <path d="M140 112 l40 0 l-4 10 l-32 0 z" fill="#5a3f28" />
        <path d="M141 113 q19 -6 19 0 q0 -6 19 0 l-3 7 q-16 -5 -16 0 q0 -5 -16 0 z" fill="#d8c8a8" />
        <line x1="160" y1="111" x2="160" y2="120" stroke="#3b2a1c" strokeWidth="1.5" />
        {/* candle */}
        <rect x="186" y="108" width="4" height="12" fill="#e8d9b0" />
        <path d="M188 100 q-4 5 0 9 q4 -4 0 -9 z" fill="#f7d97a" />
      </g>
      {/* floor */}
      <rect x="0" y="160" width="320" height="20" fill="#0a0805" />
    </svg>
  )
}

function AlchemyLabScene() {
  return (
    <svg {...sceneProps}>
      <defs>
        <linearGradient id="lab-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#163028" />
          <stop offset="1" stopColor="#06100d" />
        </linearGradient>
        <radialGradient id="lab-glow" cx="0.5" cy="0.6" r="0.6">
          <stop offset="0" stopColor="#7fe0a0" stopOpacity="0.9" />
          <stop offset="1" stopColor="#7fe0a0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height="180" fill="url(#lab-wall)" />
      <StoneCourses fill="#000" opacity={0.22} />
      {/* doorway out, lower left */}
      <Archway cx={28} />
      {/* shelf of bottles, upper left */}
      <g>
        <rect x="20" y="46" width="96" height="5" fill="#3b2a1c" />
        {[24, 42, 60, 78, 96].map((x, i) => {
          const colors = ['#c0392b', '#4caf6a', '#5a4a8a', '#e8c987', '#3aa0c0']
          return (
            <g key={x}>
              <rect x={x} y={30 - (i % 2) * 4} width="12" height={16 + (i % 2) * 4} rx="2" fill={colors[i]} opacity="0.85" />
              <rect x={x + 3} y={26 - (i % 2) * 4} width="6" height="6" fill="#2a2230" />
            </g>
          )
        })}
      </g>
      {/* big cauldron with green glow, lower-left/centre */}
      <ellipse cx="90" cy="118" rx="60" ry="34" fill="url(#lab-glow)" />
      <g>
        <path d="M60 104 a30 24 0 0 0 60 0 z" fill="#1b1410" stroke="#000" strokeWidth="2" />
        <ellipse cx="90" cy="104" rx="30" ry="9" fill="#2f7d4a" />
        <ellipse cx="90" cy="103" rx="24" ry="6" fill="#7fe0a0" opacity="0.7" />
        <rect x="56" y="140" width="68" height="6" rx="3" fill="#0a0a0a" />
        {/* bubbles */}
        <circle cx="80" cy="98" r="3" fill="#bff5d0" opacity="0.8" />
        <circle cx="98" cy="95" r="2" fill="#bff5d0" opacity="0.7" />
        <circle cx="90" cy="92" r="2.4" fill="#bff5d0" opacity="0.6" />
      </g>
      {/* alembic / flasks + the crimson vial on a table, centre */}
      <g>
        <rect x="146" y="120" width="78" height="6" fill="#3b2a1c" />
        {/* crimson vial (the collectable) */}
        <path d="M154 102 l0 9 l-5 9 a7 7 0 0 0 10 0 l-5 -9 l0 -9 z" fill="#c0392b" opacity="0.75" stroke="#e0796e" strokeWidth="1.1" />
        <rect x="153" y="99" width="6" height="4" fill="#2a2230" />
        <path d="M178 96 l0 12 l-7 12 a9 9 0 0 0 14 0 l-7 -12 l0 -12 z" fill="#aef0c8" opacity="0.55" stroke="#cfeede" strokeWidth="1.2" />
        <path d="M204 100 l0 9 l-9 11 h18 l-9 -11 l0 -9 z" fill="#e8c987" opacity="0.5" stroke="#f0d9a0" strokeWidth="1.2" />
      </g>
      {/* locked cabinet, right */}
      <g>
        <rect x="240" y="64" width="64" height="92" rx="2" fill="#241a10" stroke="#3b2a1c" strokeWidth="3" />
        <line x1="272" y1="66" x2="272" y2="154" stroke="#3b2a1c" strokeWidth="2" />
        <rect x="265" y="104" width="14" height="14" rx="2" fill="#2a2230" stroke="#7a6a3a" strokeWidth="1.5" />
        <circle cx="272" cy="111" r="2.2" fill="#0a0812" />
      </g>
      {/* floor */}
      <rect x="0" y="150" width="320" height="30" fill="#06100d" />
      {/* open trapdoor down to the cellar, centre floor */}
      <g>
        <rect x="138" y="150" width="44" height="26" fill="#040807" stroke="#0c1c18" strokeWidth="2" />
        <path d="M138 150 l-14 -10 l44 0 l14 10 z" fill="#163028" stroke="#0c1c18" strokeWidth="1.5" />
        <g stroke="#0a1512" strokeWidth="1.5">
          <line x1="146" y1="156" x2="146" y2="174" />
          <line x1="160" y1="156" x2="160" y2="174" />
          <line x1="174" y1="156" x2="174" y2="174" />
        </g>
      </g>
    </svg>
  )
}

function GateScene() {
  const flags = useGameStore((s) => s.flags)
  // Each keyhole, its rim colour, the inserted-key colour, and whether it's set.
  const holes = [
    { x: 132, rim: '#8a8a8a', key: '#9a9aa0', set: !!flags['iron-set'] },
    { x: 160, rim: '#d8d8e0', key: '#dadae2', set: !!flags['silver-set'] },
    { x: 188, rim: '#e8e0c8', key: '#ece3cf', set: !!flags['bone-set'] },
  ]
  const allSet = holes.every((h) => h.set)

  return (
    <svg {...sceneProps}>
      <defs>
        <linearGradient id="gt-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1c2740" />
          <stop offset="1" stopColor="#090b12" />
        </linearGradient>
        <radialGradient id="gt-moon" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#f2f5ff" />
          <stop offset="0.7" stopColor="#b9c6e0" />
          <stop offset="1" stopColor="#5a6a8a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height="180" fill="url(#gt-sky)" />
      {/* full moon behind the arch */}
      <circle cx="160" cy="40" r="60" fill="url(#gt-moon)" />
      <circle cx="160" cy="40" r="26" fill="#eef2ff" />
      <circle cx="150" cy="34" r="4" fill="#cfd8ee" opacity="0.6" />
      <circle cx="168" cy="46" r="3" fill="#cfd8ee" opacity="0.5" />
      {/* stone arch framing the doors */}
      <path d="M70 180 v-86 a90 90 0 0 1 180 0 v86 h-22 v-84 a68 68 0 0 0 -136 0 v84 z" fill="#1c1722" stroke="#2e2438" strokeWidth="2" />
      {/* the great iron-banded doors */}
      <g>
        <path d="M96 180 v-78 a64 64 0 0 1 128 0 v78 z" fill="#2a1d14" />
        {/* centre seam — glows with moonlight once all keys are set */}
        {allSet && <rect x="157" y="42" width="6" height="138" fill="url(#gt-moon)" opacity="0.7" />}
        <line x1="160" y1="40" x2="160" y2="180" stroke="#160f0a" strokeWidth="3" />
        {/* iron bands */}
        <g fill="#4a4150">
          <rect x="96" y="92" width="128" height="7" />
          <rect x="96" y="128" width="128" height="7" />
          <rect x="96" y="164" width="128" height="7" />
        </g>
        {/* studs */}
        <g fill="#6a6270">
          {[108, 150, 172, 214].map((x) =>
            [96, 132, 168].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="2" />),
          )}
        </g>
        {/* three keyholes; a key appears in each once inserted */}
        {holes.map(({ x, rim, key, set }) => (
          <g key={x}>
            <circle cx={x} cy="118" r="5" fill="#0a0608" stroke={rim} strokeWidth="1.5" />
            <rect x={x - 1.5} y="118" width="3" height="8" fill="#0a0608" />
            {set && (
              <g>
                <circle cx={x} cy="118" r="9" fill={key} opacity="0.2" />
                <circle cx={x} cy="110" r="4" fill="none" stroke={key} strokeWidth="2.5" />
                <rect x={x - 1} y="113" width="2" height="10" fill={key} />
                <rect x={x - 4} y="120" width="4" height="2" fill={key} />
              </g>
            )}
          </g>
        ))}
      </g>
      {/* flanking torches */}
      {[58, 262].map((x) => (
        <g key={x}>
          <rect x={x - 3} y="96" width="6" height="40" fill="#3b2a1c" />
          <path d={`M${x} 80 q-9 8 -4 16 q9 -2 8 -10 q4 8 -1 14 q11 -3 9 -16 q-7 4 -7 -2 q-3 5 -5 -2 z`} fill="#e8a04a" />
        </g>
      ))}
    </svg>
  )
}

function CatacombsScene() {
  return (
    <svg {...sceneProps}>
      <defs>
        <linearGradient id="cat-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#262430" />
          <stop offset="1" stopColor="#0a0a10" />
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill="url(#cat-wall)" />
      {/* vaulted bone tunnel */}
      <path d="M0 70 q160 -70 320 0 v110 h-320 z" fill="#15141d" />
      {/* stacked skulls texture along the top */}
      <g fill="#cfc8b8" opacity="0.5">
        {Array.from({ length: 12 }, (_, i) => (
          <circle key={i} cx={18 + i * 26} cy={26 + (i % 2) * 6} r="6" />
        ))}
      </g>
      {/* inscription plaque, left */}
      <g>
        <rect x="44" y="58" width="44" height="34" rx="2" fill="#1b1a24" stroke="#3a3850" strokeWidth="2" />
        <g stroke="#5a5870" strokeWidth="1.5" opacity="0.8">
          <line x1="50" y1="66" x2="82" y2="66" />
          <line x1="50" y1="72" x2="82" y2="72" />
          <line x1="50" y1="78" x2="78" y2="78" />
          <line x1="50" y1="84" x2="82" y2="84" />
        </g>
      </g>
      {/* four niches with skulls */}
      <g>
        {[140, 168, 196, 224].map((x) => (
          <g key={x}>
            <path d={`M${x} 118 v-20 a8 8 0 0 1 16 0 v20 z`} fill="#08070c" stroke="#33313f" strokeWidth="1.5" />
            <circle cx={x + 8} cy="104" r="5.5" fill="#d8d2c2" />
            <circle cx={x + 6} cy="103" r="1.2" fill="#0a0a0a" />
            <circle cx={x + 10} cy="103" r="1.2" fill="#0a0a0a" />
          </g>
        ))}
      </g>
      {/* stairs up, right */}
      <g>
        <path d="M256 150 l22 -42 h34 v42 z" fill="#08070c" stroke="#33313f" strokeWidth="2" />
        <g stroke="#3a3850" strokeWidth="3">
          <line x1="262" y1="148" x2="300" y2="126" />
          <line x1="266" y1="136" x2="304" y2="116" />
        </g>
      </g>
      <rect x="0" y="150" width="320" height="30" fill="#070710" />
    </svg>
  )
}

function ChapelScene() {
  return (
    <svg {...sceneProps}>
      <defs>
        <linearGradient id="ch-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a2436" />
          <stop offset="1" stopColor="#0a0810" />
        </linearGradient>
        <radialGradient id="ch-rose" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#cdd8f0" />
          <stop offset="1" stopColor="#3a4668" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height="180" fill="url(#ch-wall)" />
      {/* rose window with moonlight */}
      <circle cx="160" cy="42" r="34" fill="url(#ch-rose)" />
      <circle cx="160" cy="42" r="24" fill="#10162c" stroke="#3a3656" strokeWidth="2" />
      <g stroke="#3a3656" strokeWidth="2">
        <line x1="136" y1="42" x2="184" y2="42" />
        <line x1="160" y1="18" x2="160" y2="66" />
        <line x1="143" y1="25" x2="177" y2="59" />
        <line x1="177" y1="25" x2="143" y2="59" />
      </g>
      {/* desecrated altar: stepped stone, blood-red runner, carved cross,
          reliquary, chalice, skull, and dripping black candles */}
      <g>
        {/* stepped stone base */}
        <rect x="118" y="138" width="84" height="9" fill="#15121f" stroke="#2a2438" strokeWidth="1" />
        <rect x="125" y="130" width="70" height="9" fill="#1b1626" stroke="#2e2840" strokeWidth="1" />
        {/* altar body + overhanging table slab */}
        <rect x="130" y="100" width="60" height="31" fill="#221b30" stroke="#3a3252" strokeWidth="1.5" />
        <rect x="126" y="93" width="68" height="8" rx="1" fill="#2c2440" stroke="#3a3252" strokeWidth="1" />
        {/* carved inverted cross + worn riddle lines on the front face */}
        <g stroke="#473c5e" strokeWidth="2" strokeLinecap="round">
          <line x1="160" y1="105" x2="160" y2="126" />
          <line x1="153" y1="120" x2="167" y2="120" />
        </g>
        <g stroke="#352f49" strokeWidth="1" opacity="0.85">
          <line x1="134" y1="108" x2="146" y2="108" />
          <line x1="134" y1="113" x2="145" y2="113" />
          <line x1="134" y1="118" x2="146" y2="118" />
          <line x1="174" y1="108" x2="186" y2="108" />
          <line x1="175" y1="113" x2="186" y2="113" />
          <line x1="174" y1="118" x2="185" y2="118" />
        </g>
        {/* blood-red altar runner draped over the slab, gold-trimmed */}
        <path d="M149 93 H171 V129 L165.5 135 L160 129 L154.5 135 L149 129 Z" fill="#5a1420" stroke="#7c1d2b" strokeWidth="0.8" />
        <path d="M151 96 H169" stroke="#b8954f" strokeWidth="1" opacity="0.7" />
        {/* reliquary with a peaked lid (the riddle target) */}
        <g>
          <rect x="150" y="83" width="20" height="11" fill="#0c0a14" stroke="#b8954f" strokeWidth="1.3" />
          <path d="M150 83 L160 77 L170 83 Z" fill="#1a1426" stroke="#b8954f" strokeWidth="1.1" />
          <circle cx="160" cy="89" r="1.5" fill="#b8954f" />
        </g>
        {/* chalice, left */}
        <g fill="#8a7340">
          <path d="M137 89 q4.5 6 9 0 z" />
          <rect x="140.7" y="89" width="1.6" height="5" />
          <rect x="138" y="94" width="7" height="1.8" rx="0.6" />
        </g>
        {/* skull, right */}
        <g>
          <circle cx="182" cy="89" r="3.6" fill="#d8d2c2" />
          <rect x="179.4" y="91" width="5.2" height="3.4" rx="1.2" fill="#d8d2c2" />
          <circle cx="180.7" cy="89" r="0.9" fill="#0c0a0a" />
          <circle cx="183.3" cy="89" r="0.9" fill="#0c0a0a" />
          <line x1="182" y1="91" x2="182" y2="93.5" stroke="#0c0a0a" strokeWidth="0.6" />
        </g>
        {/* two black candles with wax drips + warm flames */}
        {[133, 187].map((x) => (
          <g key={x}>
            <rect x={x - 2} y="80" width="4" height="13" fill="#15121c" />
            <path d={`M${x - 2} 86 q-1.5 4 0 7`} stroke="#3a3550" strokeWidth="1" fill="none" />
            <path d={`M${x} 72 q-4 5 0 9 q4 -4 0 -9 z`} fill="#f0d9a0" />
            <path d={`M${x} 75 q-2 3 0 5 q2 -2 0 -5 z`} fill="#e8784a" />
          </g>
        ))}
      </g>
      {/* spiral staircase up to the tower, right */}
      <g>
        <path d="M246 150 v-82 a30 30 0 0 1 60 0 v82 z" fill="#17131f" stroke="#2c2740" strokeWidth="2" />
        <SpiralStair cx={276} baseY={148} steps={12} />
      </g>
      <rect x="0" y="152" width="320" height="28" fill="#080610" />
    </svg>
  )
}

function BellTowerScene() {
  return (
    <svg {...sceneProps}>
      <defs>
        <linearGradient id="bt-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a2740" />
          <stop offset="1" stopColor="#0a0d18" />
        </linearGradient>
        <radialGradient id="bt-moon" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#f2f5ff" />
          <stop offset="1" stopColor="#8aa0c8" stopOpacity="0" />
        </radialGradient>
        {/* dusk sign: deep indigo sky deepening to a warm orange horizon */}
        <linearGradient id="bt-dusk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#241f47" />
          <stop offset="0.55" stopColor="#5a2f55" />
          <stop offset="1" stopColor="#c25a2e" />
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill="url(#bt-sky)" />
      {/* open belfry arches showing the night sky + moon */}
      <circle cx="60" cy="58" r="22" fill="url(#bt-moon)" />
      <circle cx="60" cy="58" r="11" fill="#eef2ff" />
      <g fill="#0c1020" stroke="#23304c" strokeWidth="3">
        <path d="M16 150 v-70 a30 30 0 0 1 60 0 v70 z" opacity="0.0" />
      </g>
      {/* stone pillars framing the open arches */}
      <g fill="#161a28">
        <rect x="0" y="0" width="24" height="180" />
        <rect x="296" y="0" width="24" height="180" />
        <rect x="150" y="0" width="20" height="180" />
      </g>
      {/* heavy wooden support beam */}
      <rect x="24" y="28" width="272" height="9" rx="1" fill="#2a1d14" stroke="#1a120c" strokeWidth="1" />
      {/* four cast bells hung from ropes on the beam, each engraved with its sign.
          Dusk is a drawn medallion (no emoji reads clearly as "dusk"). */}
      {[
        { x: 78, sign: '🐺' },
        { x: 130, sign: '🌙' },
        { x: 196, sign: 'dusk' as const },
        { x: 248, sign: '🐦‍⬛' },
      ].map(({ x, sign }) => (
        <g key={x}>
          {/* twisted rope from the beam down to the yoke */}
          <path d={`M${x - 1.4} 37 q-2.5 9 0 18`} fill="none" stroke="#6a5536" strokeWidth="1.4" />
          <path d={`M${x + 1.4} 37 q2.5 9 0 18`} fill="none" stroke="#8a7048" strokeWidth="1.4" />
          {/* yoke bar + headstock pins */}
          <rect x={x - 11} y="54" width="22" height="4" rx="1.5" fill="#3b2a1c" />
          <circle cx={x - 9} cy="56" r="1.6" fill="#1a120c" />
          <circle cx={x + 9} cy="56" r="1.6" fill="#1a120c" />
          {/* crown loop joining bell to yoke */}
          <path d={`M${x - 3} 58 a3 3 0 0 1 6 0`} fill="none" stroke="#7a6326" strokeWidth="2" />
          {/* bell body */}
          <path
            d={`M${x - 19} 100 C${x - 24} 84 ${x - 16} 64 ${x - 9} 60 L${x - 9} 57
                Q${x} 54 ${x + 9} 57 L${x + 9} 60 C${x + 16} 64 ${x + 24} 84 ${x + 19} 100
                Q${x} 106 ${x - 19} 100 Z`}
            fill="#b8954f"
            stroke="#7a6326"
            strokeWidth="1.2"
          />
          {/* shading highlight for volume */}
          <path d={`M${x - 11} 98 C${x - 15} 84 ${x - 9} 66 ${x - 4} 61`} fill="none" stroke="#e8c987" strokeWidth="1.6" opacity="0.5" />
          {/* engraved sign on the bell face */}
          {sign === 'dusk' ? (
            <g>
              {/* dusk medallion: setting sun under a deepening sky */}
              <rect x={x - 9} y="75" width="18" height="15" rx="2.5" fill="url(#bt-dusk)" stroke="#3a2c14" strokeWidth="0.8" />
              <circle cx={x} cy="87" r="4.6" fill="#ef6a2c" />
              <rect x={x - 9} y="86.5" width="18" height="3.5" rx="0" fill="#1c1626" />
              <line x1={x - 9} y1="86.5" x2={x + 9} y2="86.5" stroke="#7a3a22" strokeWidth="0.7" />
              <circle cx={x - 5} cy="79" r="0.8" fill="#e6e9f5" />
              <circle cx={x + 5} cy="78" r="0.6" fill="#cdd2e8" />
            </g>
          ) : (
            <text x={x} y="82" fontSize="15" textAnchor="middle" dominantBaseline="middle">{sign}</text>
          )}
          {/* hollow mouth + clapper */}
          <ellipse cx={x} cy="100" rx="17" ry="3.6" fill="#4a3a1a" />
          <circle cx={x} cy="102" r="2.6" fill="#3a2c14" />
        </g>
      ))}
      <rect x="0" y="150" width="320" height="30" fill="#0a0d18" />
    </svg>
  )
}

function WineCellarScene() {
  return (
    <svg {...sceneProps}>
      <defs>
        <linearGradient id="wc-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a1d1a" />
          <stop offset="1" stopColor="#0a0604" />
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill="url(#wc-wall)" />
      {/* brick vault arch */}
      <path d="M0 64 q160 -56 320 0 v116 h-320 z" fill="#1c1310" />
      <StoneCourses fill="#000" opacity={0.25} />
      {/* a rack of barrels along the back */}
      <g>
        {[40, 92, 144, 232, 284].map((x) => (
          <g key={x}>
            <ellipse cx={x} cy="92" rx="20" ry="24" fill="#3b2a1c" stroke="#241a10" strokeWidth="2" />
            <ellipse cx={x} cy="92" rx="12" ry="22" fill="#4a3520" />
            <line x1={x - 20} y1="92" x2={x + 20} y2="92" stroke="#241a10" strokeWidth="2" />
            <line x1={x - 18} y1="80" x2={x + 18} y2="80" stroke="#241a10" strokeWidth="1.5" />
            <line x1={x - 18} y1="104" x2={x + 18} y2="104" stroke="#241a10" strokeWidth="1.5" />
          </g>
        ))}
      </g>
      {/* balance scale, centre-front */}
      <g stroke="#6a5a3a" strokeWidth="2" fill="#8a7340">
        <rect x="158" y="96" width="4" height="44" />
        <line x1="134" y1="100" x2="186" y2="100" />
        <path d="M134 100 l-8 12 h16 z" fill="#5a4a24" />
        <path d="M186 100 l-8 12 h16 z" fill="#5a4a24" />
        <rect x="150" y="140" width="20" height="6" />
      </g>
      <rect x="0" y="152" width="320" height="28" fill="#0a0604" />
    </svg>
  )
}

/** Maps each room id to its scene art. Swap an entry to replace a room's art. */
export const SCENE_ART: Record<RoomId, () => ReactElement> = {
  dungeon: DungeonScene,
  catacombs: CatacombsScene,
  'great-hall': GreatHallScene,
  library: LibraryScene,
  chapel: ChapelScene,
  'bell-tower': BellTowerScene,
  'alchemy-lab': AlchemyLabScene,
  'wine-cellar': WineCellarScene,
  gate: GateScene,
}
