import { useState, useEffect, useCallback } from 'react'
import type { Companion } from '../companion/types.js'
import { RARITY_COLORS } from '../companion/types.js'
import Sprite, { type SpriteState } from './Sprite.js'
import Chat, { type Message } from './Chat.js'
import Input from './Input.js'
import Egg from './Egg.js'
import Stats from './Stats.js'

type ElectronAPI = {
  getCompanion(): Promise<Companion | null>
  hatch(): Promise<Companion | null>
  rehatch(): Promise<Companion | null>
  sendMessage(text: string): Promise<string | null>
  onHatched(cb: (c: Companion) => void): () => void
  onError(cb: (msg: string) => void): () => void
}

declare global {
  interface Window { electronAPI: ElectronAPI }
}

type Status = 'egg' | 'cracking' | 'ready' | 'rehatching' | 'confirm-rehatch'

export default function App() {
  const [companion, setCompanion] = useState<Companion | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [spriteState, setSpriteState] = useState<SpriteState>('idle')
  const [status, setStatus] = useState<Status>('egg')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const api = window.electronAPI
    api.getCompanion().then(c => {
      if (c) { setCompanion(c); setStatus('ready') }
      else setStatus('egg')
    })

    const unsubs = [
      api.onHatched(c => {
        setCompanion(c)
        setStatus('ready')
        setMessages([{ id: 'hatch', role: 'companion', content: `hi! i'm ${c.name}` }])
      }),
      api.onError(msg => { setError(msg); setStatus('egg') }),
    ]
    return () => unsubs.forEach(u => u())
  }, [])

  const handleHatch = useCallback(async () => {
    setStatus('cracking')
    await window.electronAPI.hatch()
    // companion:hatched event handles the rest
  }, [])

  const handleRehatch = useCallback(async () => {
    if (status === 'ready') { setStatus('confirm-rehatch'); return }
    if (status === 'confirm-rehatch') {
      setCompanion(null)
      setMessages([])
      setStatus('rehatching')
      await window.electronAPI.rehatch()
    }
  }, [status])

  const cancelRehatch = useCallback(() => {
    setStatus('ready')
  }, [])

  const handleSend = useCallback(async (text: string) => {
    if (!companion) return
    setMessages(prev => [...prev, { id: `u-${Date.now()}`, role: 'user', content: text }])
    setSpriteState('thinking')
    const reply = await window.electronAPI.sendMessage(text)
    if (reply) {
      setMessages(prev => [...prev, { id: `c-${Date.now()}`, role: 'companion', content: reply }])
      setSpriteState('talking')
      setTimeout(() => setSpriteState('idle'), 2000)
    } else {
      setSpriteState('idle')
    }
  }, [companion])

  const color = companion ? RARITY_COLORS[companion.rarity] : '#444'
  const isEggState = status === 'egg' || status === 'cracking'
  const isHatching = status === 'cracking' || status === 'rehatching'

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{
        height: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: `1px solid ${color}22`,
        flexShrink: 0,
        position: 'relative',
        // @ts-expect-error electron-specific css property
        WebkitAppRegion: 'drag',
        background: `radial-gradient(ellipse at 50% 100%, ${color}11 0%, transparent 70%)`,
      }}>

        {/* Rehatch button — top right */}
        {(status === 'ready' || status === 'confirm-rehatch') && (
          <div style={{ position: 'absolute', top: 12, right: 14, display: 'flex', gap: 6, alignItems: 'center' }}>
            {status === 'confirm-rehatch' && (
              <button onClick={cancelRehatch} style={btnStyle('#444', '#aaa')}>cancel</button>
            )}
            <button
              onClick={handleRehatch}
              title="Rehatch companion"
              style={btnStyle(status === 'confirm-rehatch' ? '#c0392b' : '#222', status === 'confirm-rehatch' ? '#fff' : '#555')}
            >
              {status === 'confirm-rehatch' ? 'sure?' : '↺'}
            </button>
          </div>
        )}

        {/* Content */}
        {isEggState || status === 'rehatching' ? (
          <Egg cracking={isHatching} onClick={handleHatch} />
        ) : companion ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Sprite companion={companion} state={spriteState} />
            <Stats companion={companion} />
          </div>
        ) : error ? (
          <div style={{ color: '#c0392b', fontSize: 12, padding: 16, textAlign: 'center' }}>{error}</div>
        ) : null}
      </div>

      {/* Chat */}
      {companion && status === 'ready' ? (
        <Chat messages={messages} companion={companion} />
      ) : (
        <div style={{ flex: 1 }} />
      )}

      {/* Input */}
      {companion && status === 'ready' && (
        <Input companion={companion} disabled={spriteState === 'thinking'} onSend={handleSend} />
      )}
    </div>
  )
}

function btnStyle(bg: string, fg: string): React.CSSProperties {
  return {
    background: bg,
    color: fg,
    border: 'none',
    borderRadius: 6,
    padding: '3px 8px',
    fontSize: 12,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'background 0.15s, color 0.15s',
  }
}
