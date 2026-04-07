import { callBuddyReact } from './buddy.js'
import type { Companion } from './companion/types.js'

export type Message = {
  id: string
  role: 'user' | 'companion'
  content: string
}

const history: Message[] = []

export function resetHistory(): void {
  history.length = 0
}

function buildTranscript(newMessage: string): string {
  const newEntry = `User: ${newMessage}`
  const lines = history.map(m =>
    `${m.role === 'user' ? 'User' : 'Companion'}: ${m.content}`
  )

  // Pack from newest, stay under 4800 chars (leave room for new message)
  const packed: string[] = []
  let budget = 4800 - newEntry.length
  for (const line of [...lines].reverse()) {
    if (budget - line.length - 1 < 0) break
    packed.unshift(line)
    budget -= line.length + 1
  }
  return [...packed, newEntry].join('\n')
}

export async function sendMessage(text: string, companion: Companion): Promise<string | null> {
  const transcript = buildTranscript(text)
  history.push({ id: `${Date.now()}-u`, role: 'user', content: text })

  const recentReplies = history
    .filter(m => m.role === 'companion')
    .slice(-3)
    .map(m => m.content)

  const reply = await callBuddyReact({
    name: companion.name,
    personality: companion.personality,
    species: companion.species,
    rarity: companion.rarity,
    stats: companion.stats,
    transcript,
    reason: 'turn',
    recent: recentReplies,
    addressed: true,
  })

  if (reply) {
    history.push({ id: `${Date.now()}-c`, role: 'companion', content: reply })
  }

  return reply
}
