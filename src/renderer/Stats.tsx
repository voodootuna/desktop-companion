import type { Companion } from '../companion/types.js'
import { STAT_NAMES, RARITY_COLORS } from '../companion/types.js'

const ABBR: Record<string, string> = {
  DEBUGGING: 'DBG',
  PATIENCE:  'PAT',
  CHAOS:     'CHA',
  WISDOM:    'WIS',
  SNARK:     'SNK',
}

type Props = { companion: Companion }

export default function Stats({ companion }: Props) {
  const color = RARITY_COLORS[companion.rarity]

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 5,
      padding: '4px 0',
    }}>
      {STAT_NAMES.map(name => {
        const val = companion.stats[name]
        const isPeak = name === companion.peakStat
        const barFill = Math.round(val / 10) // 0–10 segments

        return (
          <div key={name} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
          }}>
            {/* Label */}
            <span style={{
              fontSize: 9,
              fontFamily: "'SF Mono', 'Fira Code', monospace",
              color: isPeak ? color : '#444',
              letterSpacing: 0.5,
              width: 24,
              textAlign: 'right',
              fontWeight: isPeak ? 700 : 400,
            }}>
              {ABBR[name]}
            </span>

            {/* Bar */}
            <div style={{
              display: 'flex',
              gap: 1,
            }}>
              {Array.from({ length: 10 }, (_, i) => (
                <div key={i} style={{
                  width: 3,
                  height: 6,
                  borderRadius: 1,
                  background: i < barFill
                    ? isPeak ? color : '#333'
                    : '#1a1a1a',
                  boxShadow: isPeak && i < barFill ? `0 0 3px ${color}88` : 'none',
                }} />
              ))}
            </div>

            {/* Value */}
            <span style={{
              fontSize: 9,
              fontFamily: "'SF Mono', 'Fira Code', monospace",
              color: isPeak ? color : '#333',
              width: 16,
            }}>
              {val}
            </span>
          </div>
        )
      })}
    </div>
  )
}
