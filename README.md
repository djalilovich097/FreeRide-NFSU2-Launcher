# FreeRide NFSU2 · public launcher for a private game

> **LIVE 2026-11-02:** the protected game uses a **server-verified Telegram ID** for account-specific careers, automatic encrypted cross-device Cloud Saves and an exclusive game session (one playing device per Telegram identity, with safe expiry after a lost connection). `Emil097` was recovered into the actual Telegram-bound vault, and the native Online name claim was transferred after confirming both legacy/new credentials. The launcher itself is ONLY the public GitHub Pages entry, not an alternative game server or a storage service. **Full operations and code now live in one private `FreeRide-NFSU2-Web` repository**, including the former Racing Hub service and Supabase mirror.
>
> Full source, test evidence, backup and next-chat handoff are in the **PRIVATE** game repository: [FreeRide NFSU2 current handoff](https://github.com/djalilovich097/FreeRide-NFSU2-Web/blob/freeride/telegram-source-port/docs/FREERIDE_NFSU2_HANDOFF_20261102.md). The static launcher intentionally hosts no game code/WASM/EA files.

**Public GitHub Pages landing only.** No game data, Telegram bot token, launch key, WASM, EA assets, passwords, or player information is hosted in this repository.

- `index.html`, `styles.css`, `app.js`: original static launcher for FreeRide.
- `bridge.json`: current, **public** Cloudflare Quick Tunnel hostname. It is NOT a credential; protected game content remains behind a separate access gateway.
- **New normal entry:** `https://t.me/freeride_team_bot?start=nfsplay` checks membership in FreeRide Team and issues a 120-second one-time ticket to a private Telegram chat.
- **No manual key input.** The ticket arrives at `https://djalilovich097.github.io/FreeRide-NFSU2-Launcher/#ticket=<signed-ticket>`; the fragment is stripped from the launcher address bar. On explicit click the launcher opens `<tunnel>/?fr_ticket=<ticket>` via the Telegram Chrome bridge.
- An operator-only legacy `#access=<secret>` fragment still works for existing smoke tests, but is not displayed or required by normal users.
- On Android this launches external Chrome. This is a launch hub, **not a cross-origin-isolation workaround for the game inside Telegram WebView**.
- If the Windows game computer or quick tunnel goes offline, the permanent page still loads but the launch cannot reach the game. Update `bridge.json` when the quick tunnel hostname changes (commit via owner account only).

## Security
Never put the shared gateway secret into `bridge.json`, GitHub, or public messages. Each player gets a one-time HMAC ticket after a Telegram group-membership check. Ticket URLs are private and expire rapidly; gateway still protects every WASM/game resource request. Keep game assets off public GitHub.

## Future
By owner decision 2026-11-01, keep FREE Cloudflare Quick Tunnel while the game has few players. A permanent game origin would improve browser save continuity later, but is not required now.
