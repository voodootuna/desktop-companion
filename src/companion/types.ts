// Copied from buddy/types.ts — the canonical companion type system.
// Bones are deterministic (hashed from userId), soul is model-generated once.

export const RARITIES = [
  'common',
  'uncommon',
  'rare',
  'epic',
  'legendary',
] as const
export type Rarity = (typeof RARITIES)[number]

export const SPECIES = [
  'duck',
  'goose',
  'blob',
  'cat',
  'dragon',
  'octopus',
  'owl',
  'penguin',
  'turtle',
  'snail',
  'ghost',
  'axolotl',
  'capybara',
  'cactus',
  'robot',
  'rabbit',
  'mushroom',
  'chonk',
] as const
export type Species = (typeof SPECIES)[number]

export const EYES = ['·', '✦', '×', '◉', '@', '°'] as const
export type Eye = (typeof EYES)[number]

export const HATS = [
  'none',
  'crown',
  'tophat',
  'propeller',
  'halo',
  'wizard',
  'beanie',
  'tinyduck',
] as const
export type Hat = (typeof HATS)[number]

export const STAT_NAMES = [
  'DEBUGGING',
  'PATIENCE',
  'CHAOS',
  'WISDOM',
  'SNARK',
] as const
export type StatName = (typeof STAT_NAMES)[number]

// Deterministic — derived from hash(userId + salt)
export type CompanionBones = {
  rarity: Rarity
  species: Species
  eye: Eye
  hat: Hat
  shiny: boolean
  stats: Record<StatName, number>
  peakStat: StatName
}

// Model-generated once on first launch
export type CompanionSoul = {
  name: string
  personality: string
}

export type Companion = CompanionBones &
  CompanionSoul & {
    hatchedAt: number
  }

// soul + hatchedAt + optional rollSeed are persisted
// rollSeed overrides the stable userId hash so rehatches get a different species
export type StoredCompanion = CompanionSoul & { hatchedAt: number; rollSeed?: string }

export const RARITY_WEIGHTS: Record<Rarity, number> = {
  common: 60,
  uncommon: 25,
  rare: 10,
  epic: 4,
  legendary: 1,
}

export const RARITY_STARS: Record<Rarity, string> = {
  common: '★',
  uncommon: '★★',
  rare: '★★★',
  epic: '★★★★',
  legendary: '★★★★★',
}

// CSS color tokens for rarity borders/glows
export const RARITY_COLORS: Record<Rarity, string> = {
  common: '#666',
  uncommon: '#4caf50',
  rare: '#2196f3',
  epic: '#9c27b0',
  legendary: '#ff9800',
}

export const SPECIES_EMOJI: Record<Species, string> = {
  duck: '🦆',
  goose: '🪿',
  blob: '🫧',
  cat: '🐱',
  dragon: '🐉',
  octopus: '🐙',
  owl: '🦉',
  penguin: '🐧',
  turtle: '🐢',
  snail: '🐌',
  ghost: '👻',
  axolotl: '🦎',
  capybara: '🦫',
  cactus: '🌵',
  robot: '🤖',
  rabbit: '🐰',
  mushroom: '🍄',
  chonk: '🐈',
}

export const HAT_EMOJI: Record<Hat, string> = {
  none: '',
  crown: '👑',
  tophat: '🎩',
  propeller: '🌀',
  halo: '😇',
  wizard: '🧙',
  beanie: '🧢',
  tinyduck: '🐥',
}
