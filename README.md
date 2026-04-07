# desktop companion

a tiny desktop chat app powered by the hidden `buddy_react` endpoint inside claude code. hatch a companion, chat with it, watch it react. runs on claude 3.5 sonnet for free as long as you have a claude code session.

---

## requirements

- macOS (credential reading is mac-only via keychain)
- [claude code](https://claude.ai/code) installed and logged in
- node 18+

---

## auth / credentials

this app doesn't use an API key. it piggybacks on your existing claude code session.

**you need to have claude code open and logged in** before launching the companion. the app reads your oauth token from the mac keychain under the `Claude Code-credentials` entry that claude code writes when you sign in.

if the companion can't connect or throws an auth error:

1. open claude code in your terminal — `claude`
2. make sure you're logged in (`/login` if not)
3. run any command so the session is active
4. relaunch the companion app

the token lives at:
- keychain: `Claude Code-credentials` (read automatically on mac)
- or file: `~/.claude/.credentials.json`

if your token expires, just open claude code again — it refreshes the keychain entry automatically on startup.

---

## setup

```bash
npm install
npm run dev
```

first launch shows an egg. click it to hatch your companion. takes a few seconds while the model generates a name and personality.

---

## what it does

- **hatch** — rolls a random species, rarity, and stats. model picks a name and personality based on them
- **chat** — talk to your companion. it responds in character using claude 3.5 sonnet via the internal buddy endpoint
- **rehatch** — button in the top right. resets everything and rolls a new companion. asks for confirmation first

companion data is saved to `~/.config/desktop-companion/soul.json` and persists between launches.

---

## build

```bash
npm run make
```

outputs to `out/`.

---

## how it works

see [docs/blog.md](docs/blog.md) for the full writeup on the `buddy_react` endpoint discovery.
