# Desktop Companion

A tiny desktop chat app powered by the hidden `buddy_react` endpoint inside Claude Code. Hatch a companion, chat with it, watch it react. Runs on Claude 3.5 Sonnet for free as long as you have a Claude Code session.

---

## Requirements

- macOS (credential reading is mac-only via keychain)
- [Claude Code](https://claude.ai/code) installed and logged in
- Node 18+

---

## Auth / Credentials

This app doesn't use an API key. It piggybacks on your existing Claude Code session.

**You need to have Claude Code open and logged in** before launching the companion. The app reads your OAuth token from the Mac keychain under the `Claude Code-credentials` entry that Claude Code writes when you sign in.

If the companion can't connect or throws an auth error:

1. Open Claude Code in your terminal — `claude`
2. Make sure you're logged in (`/login` if not)
3. Run any command so the session is active
4. Relaunch the companion app

The token lives at:
- Keychain: `Claude Code-credentials` (read automatically on Mac)
- Or file: `~/.claude/.credentials.json`

If your token expires, just open Claude Code again — it refreshes the keychain entry automatically on startup.

---

## Setup

```bash
npm install
npm run dev
```

First launch shows an egg. Click it to hatch your companion. Takes a few seconds while the model generates a name and personality.

---

## What it does

- **Hatch** — rolls a random species, rarity, and stats. Model picks a name and personality based on them
- **Chat** — talk to your companion. It responds in character using Claude 3.5 Sonnet via the internal buddy endpoint
- **Rehatch** — button in the top right. Resets everything and rolls a new companion. Asks for confirmation first

Companion data is saved to `~/.config/desktop-companion/soul.json` and persists between launches.

---

## Build

```bash
npm run make
```

Outputs to `out/`.

---

## How it works

The companion uses an undocumented Anthropic endpoint — `buddy_react` — that Claude Code uses internally for its own companion feature. No SDK, no API key. It reads your existing Claude Code OAuth token from the Mac keychain and makes requests directly to the same endpoint Claude Code uses. The `personality` field acts as the system prompt, the `transcript` is the conversation context, and the response is the companion's reply.
