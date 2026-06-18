import type { ReactElement } from 'react'
import type { RoomId } from '../types'

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
      {/* straw and floor */}
      <rect x="0" y="150" width="320" height="30" fill="#0a0710" />
      <g stroke="#7a6326" strokeWidth="2" opacity="0.8">
        {Array.from({ length: 18 }, (_, i) => {
          const x = 60 + i * 5
          return <line key={i} x1={x} y1="158" x2={x + (i % 3) - 1} y2="148" />
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
      {/* arched alcoves along the back wall */}
      <g fill="#120d0a" stroke="#2a1d12" strokeWidth="2">
        {[20, 250].map((x) => (
          <path key={x} d={`M${x} 70 q25 -34 50 0 v70 h-50 z`} />
        ))}
      </g>
      {/* grand portrait, centre */}
      <g>
        <rect x="126" y="28" width="68" height="86" rx="2" fill="#1a1018" stroke="#b8954f" strokeWidth="4" />
        <rect x="134" y="36" width="52" height="70" fill="#241526" />
        <circle cx="160" cy="62" r="14" fill="#cdbfae" />
        <path d="M146 110 q14 -42 28 0 z" fill="#11060e" />
        <path d="M150 60 q10 -16 20 0 q-10 6 -20 0 z" fill="#0c0510" />
      </g>
      {/* two hanging banners with a crest */}
      {[70, 250].map((x) => (
        <g key={x}>
          <path d={`M${x - 16} 18 h32 v74 l-16 12 l-16 -12 z`} fill="url(#gh-banner)" />
          <path d={`M${x} 44 l7 7 l-7 7 l-7 -7 z`} fill="#e8c987" opacity="0.85" />
        </g>
      ))}
      {/* candelabra */}
      {[40, 280].map((x) => (
        <g key={x}>
          <rect x={x - 2} y="120" width="4" height="40" fill="#b8954f" />
          <rect x={x - 14} y="116" width="28" height="5" rx="2" fill="#b8954f" />
          {[-12, 0, 12].map((dx) => (
            <g key={dx}>
              <rect x={x + dx - 1.5} y="104" width="3" height="14" fill="#e8d9b0" />
              <path d={`M${x + dx} 96 q-4 5 0 9 q4 -4 0 -9 z`} fill="#f7d97a" />
            </g>
          ))}
        </g>
      ))}
      {/* pinned alchemist's note on the wall (the lab combination clue) */}
      <g transform="rotate(-4 96 112)">
        <rect x="84" y="98" width="24" height="30" fill="#d8c8a8" stroke="#b8a888" strokeWidth="1" />
        <circle cx="96" cy="100" r="2" fill="#8b1e2d" />
        <g stroke="#6a5a3a" strokeWidth="1" opacity="0.7">
          <line x1="88" y1="106" x2="104" y2="106" />
          <line x1="88" y1="111" x2="104" y2="111" />
          <line x1="88" y1="116" x2="100" y2="116" />
          <line x1="88" y1="121" x2="104" y2="121" />
        </g>
      </g>
      {/* checkered floor */}
      <g>
        <rect x="0" y="150" width="320" height="30" fill="#1a120c" />
        {Array.from({ length: 16 }, (_, i) => (
          <rect key={i} x={i * 20} y="150" width="20" height="30" fill={i % 2 ? '#241710' : '#0e0908'} />
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
      {/* tall bookshelves left and right */}
      {[8, 248].map((bx) => (
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
      {/* arched window with moonlight, centre-back */}
      <path d="M138 18 q22 -22 44 0 v54 h-44 z" fill="#11203a" stroke="#3b2a1c" strokeWidth="3" />
      <g stroke="#243a5a" strokeWidth="2">
        <line x1="160" y1="10" x2="160" y2="72" />
        <line x1="138" y1="44" x2="182" y2="44" />
      </g>
      {/* lectern with open tome and a candle */}
      <g>
        <path d="M150 150 l20 0 l8 -34 l-36 0 z" fill="#3b2a1c" stroke="#5a3f28" strokeWidth="2" />
        <path d="M140 112 l40 0 l-4 10 l-32 0 z" fill="#5a3f28" />
        <path d="M141 113 q19 -6 19 0 q0 -6 19 0 l-3 7 q-16 -5 -16 0 q0 -5 -16 0 z" fill="#d8c8a8" />
        <line x1="160" y1="111" x2="160" y2="120" stroke="#3b2a1c" strokeWidth="1.5" />
        {/* candle */}
        <rect x="186" y="108" width="4" height="12" fill="#e8d9b0" />
        <path d="M188 100 q-4 5 0 9 q4 -4 0 -9 z" fill="#f7d97a" />
      </g>
      {/* floor */}
      <rect x="0" y="156" width="320" height="24" fill="#0a0805" />
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
      {/* alembic / flasks on a table, centre */}
      <g>
        <rect x="150" y="120" width="70" height="6" fill="#3b2a1c" />
        <path d="M170 96 l0 12 l-7 12 a9 9 0 0 0 14 0 l-7 -12 l0 -12 z" fill="#aef0c8" opacity="0.55" stroke="#cfeede" strokeWidth="1.2" />
        <path d="M196 100 l0 9 l-9 11 h18 l-9 -11 l0 -9 z" fill="#e8c987" opacity="0.5" stroke="#f0d9a0" strokeWidth="1.2" />
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
    </svg>
  )
}

function GateScene() {
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
        {/* three keyholes: iron, silver, bone */}
        {[
          { x: 132, c: '#8a8a8a' },
          { x: 160, c: '#d8d8e0' },
          { x: 188, c: '#e8e0c8' },
        ].map(({ x, c }) => (
          <g key={x}>
            <circle cx={x} cy="118" r="5" fill="#0a0608" stroke={c} strokeWidth="1.5" />
            <rect x={x - 1.5} y="118" width="3" height="8" fill="#0a0608" />
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

/** Maps each room id to its scene art. Swap an entry to replace a room's art. */
export const SCENE_ART: Record<RoomId, () => ReactElement> = {
  dungeon: DungeonScene,
  'great-hall': GreatHallScene,
  library: LibraryScene,
  'alchemy-lab': AlchemyLabScene,
  gate: GateScene,
}
