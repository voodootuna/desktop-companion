import { execSync } from 'child_process'
import { readFileSync } from 'fs'
import { homedir } from 'os'
import { join } from 'path'

// Credential file paths Claude Code may use
const CREDENTIAL_PATHS = [
  join(homedir(), '.claude', '.credentials.json'),
  join(homedir(), '.config', 'claude', '.credentials.json'),
]

function readFromFile(): string | null {
  for (const p of CREDENTIAL_PATHS) {
    try {
      const raw = readFileSync(p, 'utf8')
      const json = JSON.parse(raw)
      const token =
        json.claudeAiOauthToken ??
        json.oauthToken ??
        json.apiKey ??
        json.ANTHROPIC_API_KEY ??
        null
      if (typeof token === 'string' && token.length > 0) return token
    } catch {
      // file missing or malformed — try next
    }
  }
  return null
}

function extractToken(raw: string): string | null {
  const trimmed = raw.trim()
  if (!trimmed) return null
  if (!trimmed.startsWith('{')) return trimmed
  try {
    const json = JSON.parse(trimmed)
    return (
      json?.claudeAiOauth?.accessToken ??
      json?.claudeAiOauthToken ??
      json?.oauthToken ??
      json?.apiKey ??
      null
    )
  } catch {
    return trimmed
  }
}

function readFromKeychain(): string | null {
  if (process.platform !== 'darwin') return null
  const services = ['Claude Code-credentials', 'claude', 'claude.ai', 'anthropic']
  for (const svc of services) {
    try {
      const raw = execSync(
        `security find-generic-password -s "${svc}" -w 2>/dev/null`,
        { encoding: 'utf8', timeout: 2000 },
      )
      const token = extractToken(raw)
      if (token) return token
    } catch {
      // not found — try next
    }
  }
  return null
}

export function readClaudeCodeTokens(): string | null {
  return (
    process.env['ANTHROPIC_API_KEY'] ?? readFromFile() ?? readFromKeychain()
  )
}
