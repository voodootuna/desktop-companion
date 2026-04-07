import { useEffect, useRef } from 'react'
import type { Companion } from '../companion/types.js'
import { RARITY_COLORS } from '../companion/types.js'

export type Message = {
  id: string
  role: 'user' | 'companion'
  content: string
}

type Props = {
  messages: Message[]
  companion: Companion
}

export default function Chat({ messages, companion }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const color = RARITY_COLORS[companion.rarity]

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      padding: '12px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}>
      {messages.map(msg => (
        <div key={msg.id} style={{
          display: 'flex',
          justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
        }}>
          <div style={{
            maxWidth: '80%',
            padding: '8px 12px',
            borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
            background: msg.role === 'user' ? '#1e1e1e' : 'transparent',
            border: msg.role === 'companion' ? `1px solid ${color}44` : '1px solid #2a2a2a',
            color: msg.role === 'companion' ? color : '#e0e0e0',
            fontSize: 13,
            lineHeight: 1.5,
            fontFamily: 'inherit',
            boxShadow: msg.role === 'companion' ? `0 0 12px ${color}22` : 'none',
          }}>
            {msg.content}
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
