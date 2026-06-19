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
      {/* boarded-over stairwell down to the catacombs, lower right */}
      <g>
        <path d="M214 150 l22 -42 h46 l-22 42 z" fill="#070409" stroke="#2a2030" strokeWidth="2" />
        <g stroke="#5a3f28" strokeWidth="5">
          <line x1="224" y1="146" x2="270" y2="120" />
          <line x1="220" y1="134" x2="266" y2="108" />
        </g>
        <line x1="218" y1="150" x2="274" y2="118" stroke="#3b2a1c" strokeWidth="2" />
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
      {/* grand portrait, centre */}
      <g>
        <rect x="126" y="22" width="68" height="80" rx="2" fill="#1a1018" stroke="#b8954f" strokeWidth="4" />
        <rect x="134" y="30" width="52" height="64" fill="#241526" />
        <circle cx="160" cy="54" r="13" fill="#cdbfae" />
        <path d="M147 98 q13 -40 26 0 z" fill="#11060e" />
        <path d="M150 52 q10 -16 20 0 q-10 6 -20 0 z" fill="#0c0510" />
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
      {/* altar with reliquary and black candles */}
      <g>
        <rect x="128" y="96" width="64" height="46" fill="#1c1726" stroke="#3a3252" strokeWidth="2" />
        <rect x="144" y="108" width="32" height="22" rx="1" fill="#0c0a14" stroke="#7a6a9a" strokeWidth="1.5" />
        <circle cx="160" cy="119" r="2" fill="#b8954f" />
        {[134, 186].map((x) => (
          <g key={x}>
            <rect x={x - 2} y="84" width="4" height="14" fill="#15121c" />
            <path d={`M${x} 76 q-4 5 0 9 q4 -4 0 -9 z`} fill="#f0d9a0" />
          </g>
        ))}
      </g>
      {/* spiral stair up to the tower, right */}
      <g>
        <path d="M250 150 v-86 a26 26 0 0 1 52 0 v86 z" fill="#120f1c" stroke="#2e2840" strokeWidth="2" />
        <g stroke="#2e2840" strokeWidth="3">
          {[70, 88, 106, 124, 142].map((y) => (
            <line key={y} x1="252" y1={y} x2="300" y2={y - 6} />
          ))}
        </g>
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
      {/* support beam + four bells */}
      <rect x="24" y="30" width="272" height="8" fill="#2a1d14" />
      {[
        { x: 78, s: '🐺' },
        { x: 130, s: '🌙' },
        { x: 196, s: '🌆' },
        { x: 248, s: '🐦' },
      ].map(({ x }) => (
        <g key={x}>
          <line x1={x} y1="38" x2={x} y2="58" stroke="#1a120c" strokeWidth="2" />
          <path d={`M${x - 16} 96 a16 16 0 0 1 32 0 q0 6 -4 6 h-24 q-4 0 -4 -6 z`} fill="#b8954f" stroke="#7a6326" strokeWidth="1" />
          <rect x={x - 3} y="100" width="6" height="8" fill="#7a6326" />
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
