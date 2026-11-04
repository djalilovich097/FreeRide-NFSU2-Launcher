# FreeRide Racing Launcher

> **Security freeze (2026-11-05):** see [FREERIDE_RACING_FREEZE_20261105.md](FREERIDE_RACING_FREEZE_20261105.md). Legacy operator password links are no longer accepted; use Telegram's one-time U2 ticket or signed MW WebApp.

**Permanent entry:** https://djalilovich097.github.io/FreeRide-NFSU2-Launcher/

As of 2026-11-04, the existing public GitHub Pages launcher is the **single FreeRide Racing entrypoint** for Need for Speed Underground 2 and Most Wanted (2005). The original repository name is retained so existing URLs and U2 ticket links do not break.

## How it works

1. From @freeride_team_bot, open **FreeRide Racing** via `/racing` or `/start racing`. The group announcement links to the same page.
2. Choose **Underground 2**: the launcher requests `/start nfsplay` if no ticket is present. The bot checks FreeRide Team membership and sends a 120-second one-use ticket via `#ticket` on the same launcher. The launcher strips the fragment from the address bar, opens the U2 HTTPS identity gateway in Chrome, and the gateway redeems it.
3. Choose **Most Wanted**: the launcher requests `/start mwplay`. The same bot checks the existing owner-only MW allowlist and sends a Telegram `WebAppInfo` button on the current MW HTTPS gateway. Telegram-signed `initData` authenticates the user. Non-owners are informed that MW remains a private preview.

**Privacy:** this public repository stores no game assets, player saves, Telegram bot tokens, access keys, user IDs, database content, or provider credentials. U2 and MW keep separate servers, authorization systems, save schemas and per-user profiles.

## Technical layout

- `index.html`, `styles.css`: mobile-first two-card game selection.
- `app.js`: Telegram WebApp/deep-link and Chrome opening logic, compatible with U2 `#ticket` only. Old `#access` operator links are stripped and rejected.
- `bridge.json`: U2's current *public* Cloudflare Quick Tunnel origin only. The existing watchdog/refresh script in private `FreeRide-NFSU2-Web` validates 401 on protected WASM before updating the hostname. It must continue to work with the old repository path.
- MW public origin is validated by the bot on its private machine, not stored on this static page.

## Tests and rollback

- Mobile 390px and desktop 1360px Chrome render, no horizontal overflow; both cards and bot deep links tested.
- U2 fragment-based ticket and external Chrome bridge tested with synthetic tokens; no real ticket is committed.
- Bot owner gate, invalid gateway URL rejection, both private and group launcher keyboards, `/start racing` tested separately in `FreeRideBot`.
- Rollback: restore previous GitHub Pages `main` commit. Existing U2 launcher URLs and direct game URLs stay valid; no server/game save migration is performed.

## Scope

The Racing launcher is a navigation UI, **not a combined game engine**. It does not unify rankings, underlying game databases, or MW access rights. NFSU2 rankings continue through `/nfsrank` and `/nfsonline`. MW multiplayer is not claimed to exist.

Both games depend on their existing Windows hosts and temporary Cloudflare URLs; the launcher itself remains available when those hosts are offline. Long-term, move each gateway behind a stable owned domain.
