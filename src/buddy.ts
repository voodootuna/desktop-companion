import { readClaudeCodeTokens } from './auth.js'
import { logPrompt } from './log.js'

const BASE_API_URL = 'https://api.anthropic.com'

let cachedOrgUuid: string | null = null

export async function getOrgUuid(): Promise<string | null> {
  if (cachedOrgUuid) return cachedOrgUuid
  const token = readClaudeCodeTokens()
  if (!token) return null
  try {
    const res = await fetch(`${BASE_API_URL}/api/oauth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) return null
    const data = await res.json() as { organization?: { uuid?: string } }
    cachedOrgUuid = data.organization?.uuid ?? null
    return cachedOrgUuid
  } catch {
    return null
  }
}

export interface BuddyReactParams {
  name: string
  personality: string
  species: string
  rarity: string
  stats: Record<string, number>
  transcript: string
  reason: string
  recent: string[]
  addressed: boolean
}

export async function callBuddyReact(params: BuddyReactParams): Promise<string | null> {
  const token = readClaudeCodeTokens()
  if (!token) return null

  const orgUuid = await getOrgUuid()
  if (!orgUuid) return null

  const body = {
    name: params.name.slice(0, 32),
    personality: params.personality.slice(0, 200),
    species: params.species,
    rarity: params.rarity,
    stats: params.stats,
    transcript: params.transcript.slice(0, 5000),
    reason: params.reason,
    recent: params.recent.slice(0, 3).map(r => r.slice(0, 200)),
    addressed: params.addressed,
  }

  const url = `${BASE_API_URL}/api/organizations/${orgUuid}/claude_code/buddy_react`

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'anthropic-beta': 'ccr-byoc-2025-07-29',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10_000),
  })

  if (!res.ok) {
    console.error('[buddy] HTTP error:', res.status, await res.text().catch(() => ''))
    return null
  }

  const data = await res.json() as { reaction?: string }
  const reaction = data.reaction?.trim() || null

  logPrompt('buddy_react', JSON.stringify(body), reaction ?? '(null)')
  return reaction
}
