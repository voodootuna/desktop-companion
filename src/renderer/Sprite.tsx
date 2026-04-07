import { useState, useEffect } from 'react'
import type { Companion } from '../companion/types.js'
import { RARITY_COLORS } from '../companion/types.js'
import { renderSprite, renderBlink, IDLE_SEQUENCE } from './sprites.js'

export type SpriteState = 'idle' | 'thinking' | 'talking'

type Props = {
  companion: Companion
  state: SpriteState
}

const TICK_MS = 500


export default function Sprite({ companion, state }: Props) {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), TICK_MS)
    return () => clearInterval(id)
  }, [])

  const color = RARITY_COLORS[companion.rarity]

  // Determine which sprite frame to render
  let lines: string[]
  if (state === 'thinking') {
    // Alternate between frame 0 and blink while thinking
    lines = tick % 4 < 3 ? renderSprite(companion, 0) : renderBlink(companion)
  } else if (state === 'talking') {
    // Cycle frames fast while talking
    lines = renderSprite(companion, tick % 3)
  } else {
    // Idle: follow the IDLE_SEQUENCE (same as original)
    const seqFrame = IDLE_SEQUENCE[tick % IDLE_SEQUENCE.length]!
    lines = seqFrame === -1 ? renderBlink(companion) : renderSprite(companion, seqFrame)
  }

  // Float offset: 0 or -1px alternating slowly (matches original float feel)
  const floatOffset = Math.sin(tick * 0.4) * 2

  // Shiny glow pulse
  const glowOpacity = companion.shiny ? 0.4 + 0.4 * Math.abs(Math.sin(tick * 0.3)) : 0.3

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6,
      transform: `translateY(${floatOffset.toFixed(1)}px)`,
      transition: 'transform 0.4s ease-in-out',
    }}>
      {/* ASCII sprite */}
      <pre style={{
        fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace",
        fontSize: 13,
        lineHeight: 1.35,
        color: '#c8c8c8',
        textShadow: companion.shiny ? `0 0 8px gold` : `0 0 6px ${color}${Math.round(glowOpacity * 255).toString(16).padStart(2, '0')}`,
        margin: 0,
        letterSpacing: 0,
        userSelect: 'none',
        whiteSpace: 'pre',
      }}>
        {lines.join('\n')}
      </pre>

      {/* Name tag */}
      <div style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: 2,
        color,
        textShadow: `0 0 8px ${color}`,
        textTransform: 'uppercase',
        opacity: 0.9,
      }}>
        {companion.name}
      </div>

      {/* Thinking dots */}
      {state === 'thinking' && (
        <div style={{
          fontSize: 11,
          color: '#444',
          letterSpacing: 4,
          animation: 'none',
        }}>
          {['·', '·', '·'].map((d, i) => (
            <span key={i} style={{
              opacity: (tick + i) % 3 === 0 ? 1 : 0.2,
              transition: 'opacity 0.3s',
            }}>{d}</span>
          ))}
        </div>
      )}
    </div>
  )
}
