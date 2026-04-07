const EGG_FRAMES = [
  [
    '   .---.   ',
    '  /     \\  ',
    ' |       | ',
    ' |       | ',
    '  \\     /  ',
    '   `---\'   ',
  ],
  [
    '   .---.   ',
    '  /     \\  ',
    ' |  . .  | ',
    ' |       | ',
    '  \\     /  ',
    '   `---\'   ',
  ],
  [
    '   .---.   ',
    '  /     \\  ',
    ' |       | ',
    ' |  \\_/  | ',
    '  \\     /  ',
    '   `---\'   ',
  ],
]

const CRACKING_FRAMES = [
  [
    '   .---.   ',
    '  / /|\\ \\  ',
    ' | / | \\ | ',
    ' |   |   | ',
    '  \\     /  ',
    '   `---\'   ',
  ],
  [
    '  .-/ \\-.  ',
    ' / /   \\ \\ ',
    '| /     \\ |',
    '|/   *   \\|',
    ' \\       / ',
    '  `-----\'  ',
  ],
]

const KEYFRAMES = `
@keyframes egg-wobble {
  0%, 100% { transform: rotate(0deg); }
  20%       { transform: rotate(-4deg); }
  40%       { transform: rotate(4deg); }
  60%       { transform: rotate(-2deg); }
  80%       { transform: rotate(2deg); }
}
@keyframes egg-glow {
  0%, 100% { text-shadow: 0 0 4px #ffffff22; }
  50%       { text-shadow: 0 0 12px #ffffff44; }
}
`

type Props = {
  cracking?: boolean
  onClick: () => void
}

import { useState, useEffect } from 'react'

export default function Egg({ cracking = false, onClick }: Props) {
  const [tick, setTick] = useState(0)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const ms = cracking ? 180 : 900
    const id = setInterval(() => setTick(t => t + 1), ms)
    return () => clearInterval(id)
  }, [cracking])

  const frames = cracking ? CRACKING_FRAMES : EGG_FRAMES
  const lines = frames[tick % frames.length]!

  return (
    <>
      <style>{KEYFRAMES}</style>
      <div
        onClick={cracking ? undefined : onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
          cursor: cracking ? 'default' : 'pointer',
          // @ts-expect-error electron-specific css property
          WebkitAppRegion: 'no-drag',
          animation: cracking
            ? 'egg-wobble 0.3s ease-in-out infinite'
            : hovered
            ? 'egg-wobble 0.6s ease-in-out infinite'
            : 'none',
        }}
      >
        <pre style={{
          fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace",
          fontSize: 14,
          lineHeight: 1.4,
          color: cracking ? '#e8d5a3' : hovered ? '#fff' : '#888',
          margin: 0,
          whiteSpace: 'pre',
          userSelect: 'none',
          animation: 'egg-glow 2s ease-in-out infinite',
          transition: 'color 0.2s',
        }}>
          {lines.join('\n')}
        </pre>
        <div style={{
          fontSize: 11,
          color: cracking ? '#666' : hovered ? '#aaa' : '#444',
          letterSpacing: 1,
          transition: 'color 0.2s',
        }}>
          {cracking ? 'hatching…' : 'click to hatch'}
        </div>
      </div>
    </>
  )
}
