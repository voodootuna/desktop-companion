import { useState, useRef } from 'react'
import type { Companion } from '../companion/types.js'
import { RARITY_COLORS } from '../companion/types.js'

type Props = {
  companion: Companion
  disabled: boolean
  onSend: (text: string) => void
}

export default function Input({ companion, disabled, onSend }: Props) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const color = RARITY_COLORS[companion.rarity]

  function submit() {
    const text = value.trim()
    if (!text || disabled) return
    setValue('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    onSend(text)
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  function onInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setValue(e.target.value)
    // Auto-grow textarea
    const el = e.target
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`
  }

  return (
    <div style={{
      padding: '10px 12px',
      borderTop: '1px solid #1e1e1e',
      display: 'flex',
      gap: 8,
      alignItems: 'flex-end',
    }}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={onInput}
        onKeyDown={onKeyDown}
        disabled={disabled}
        placeholder={disabled ? '…' : `ask ${companion.name} something`}
        rows={1}
        style={{
          flex: 1,
          background: '#141414',
          border: `1px solid ${disabled ? '#222' : '#2a2a2a'}`,
          borderRadius: 10,
          color: '#e0e0e0',
          fontSize: 13,
          padding: '8px 12px',
          resize: 'none',
          outline: 'none',
          fontFamily: 'inherit',
          lineHeight: 1.5,
          transition: 'border-color 0.2s',
        }}
        onFocus={e => { e.target.style.borderColor = `${color}66` }}
        onBlur={e => { e.target.style.borderColor = '#2a2a2a' }}
      />
      <button
        onClick={submit}
        disabled={disabled || !value.trim()}
        style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          border: 'none',
          background: disabled || !value.trim() ? '#1a1a1a' : color,
          color: disabled || !value.trim() ? '#444' : '#000',
          fontSize: 16,
          cursor: disabled || !value.trim() ? 'default' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'background 0.2s, color 0.2s',
        }}
      >
        ↑
      </button>
    </div>
  )
}
