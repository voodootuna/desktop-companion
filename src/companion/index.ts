import { roll, rollWithSeed } from './bones.js'
import { loadSoul, saveSoul, stableUserId, generateSoul } from './soul.js'
import type { Companion } from './types.js'

export type { Companion, CompanionBones, CompanionSoul, StoredCompanion } from './types.js'
export { roll, rollWithSeed } from './bones.js'
export { loadSoul, saveSoul, deleteSoul } from './soul.js'

export function getCompanion(): Companion | null {
  const soul = loadSoul()
  if (!soul) return null
  const { bones } = soul.rollSeed ? rollWithSeed(soul.rollSeed) : roll(stableUserId())
  return { ...soul, ...bones }
}

export async function hatchCompanion(): Promise<Companion> {
  const seed = `hatch-${Date.now()}-${Math.random().toString(36).slice(2)}`
  const { bones } = rollWithSeed(seed)
  const soul = await generateSoul(bones)
  saveSoul({ ...soul, rollSeed: seed })
  return { ...soul, ...bones }
}
