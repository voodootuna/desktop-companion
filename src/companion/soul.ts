import { readFileSync, writeFileSync, mkdirSync, unlinkSync } from 'fs'
import { homedir } from 'os'
import { join, dirname } from 'path'
import { createHash } from 'crypto'
import { callBuddyReact } from '../buddy.js'
import type { CompanionBones, StoredCompanion } from './types.js'

const CONFIG_DIR = join(homedir(), '.config', 'desktop-companion')
const SOUL_PATH = join(CONFIG_DIR, 'soul.json')

export function loadSoul(): StoredCompanion | null {
  try {
    const raw = readFileSync(SOUL_PATH, 'utf8')
    return JSON.parse(raw) as StoredCompanion
  } catch {
    return null
  }
}

export function deleteSoul(): void {
  try { unlinkSync(SOUL_PATH) } catch { /* already gone */ }
}

export function saveSoul(soul: StoredCompanion): void {
  mkdirSync(dirname(SOUL_PATH), { recursive: true })
  writeFileSync(SOUL_PATH, JSON.stringify(soul, null, 2), 'utf8')
}

export function stableUserId(): string {
  const user = process.env['USER'] ?? process.env['USERNAME'] ?? 'anon'
  return createHash('sha256').update(user).digest('hex').slice(0, 16)
}

export async function generateSoul(bones: CompanionBones): Promise<StoredCompanion> {
  // Use buddy_react with reason 'hatch' — same endpoint Claude Code uses
  // The personality field becomes the system prompt; we ask it to return JSON
  const hatchPersonality = `You generate companion identities. Reply with JSON only: {"name":"<one word, max 12 chars>","personality":"<one sentence, imperative, max 160 chars>"}`

  const transcript = `Species: ${bones.species}, Rarity: ${bones.rarity}, Peak stat: ${bones.peakStat}`

  const reaction = await callBuddyReact({
    name: 'companion',
    personality: hatchPersonality,
    species: bones.species,
    rarity: bones.rarity,
    stats: bones.stats,
    transcript,
    reason: 'hatch',
    recent: [],
    addressed: false,
  })

  if (!reaction) throw new Error('buddy_react hatch returned null — is Claude Code logged in?')

  // Strip markdown code fences if present
  const stripped = reaction.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
  const json = JSON.parse(stripped) as { name: string; personality: string }

  return {
    name: json.name,
    personality: json.personality,
    hatchedAt: Date.now(),
  }
}
