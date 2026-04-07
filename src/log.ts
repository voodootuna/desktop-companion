import { appendFileSync, mkdirSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'

const LOG_DIR = join(homedir(), '.config', 'desktop-companion')
const LOG_PATH = join(LOG_DIR, 'prompts.log')

export function logPrompt(tag: string, prompt: string, reply: string) {
  const entry = [
    `\n--- ${tag} ${new Date().toISOString()} ---`,
    `PROMPT:\n${prompt}`,
    `REPLY:\n${reply}`,
  ].join('\n')

  console.log(entry)

  try {
    mkdirSync(LOG_DIR, { recursive: true })
    appendFileSync(LOG_PATH, entry + '\n', 'utf8')
  } catch (err) {
    console.error('[log] failed to write log file:', err)
  }
}
