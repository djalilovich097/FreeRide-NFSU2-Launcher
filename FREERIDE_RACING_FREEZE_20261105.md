# FreeRide Racing: stable launcher, security freeze 2026-11-05

## Current permanent entry
https://djalilovich097.github.io/FreeRide-NFSU2-Launcher/

The old GitHub repository name is retained for URL compatibility. **The launcher now has three cards**: U2, MW and the Racing Hub. Hub is read-only NFSU2 server status, real ranking data and invitations; it is served from the validated current U2 HTTPS tunnel at `/hub/` without extra monthly cost. The product is **FreeRide Racing**: one Telegram launcher, two independent games. Public GitHub Pages contains HTML/CSS/JS and a temporary public U2 gateway hostname only. It does NOT contain game files, tickets, private access keys, career ZIPs or Telegram user data.

## Launch contract
- /racing in @freeride_team_bot opens this page; two cards route to U2 or MW.
- U2: /start nfsplay from bot -> group-member check -> 120-second one-time signed ticket -> launcher #ticket -> private Chrome gateway. The JS erases the ticket fragment after reading.
- MW: /start mwplay -> private bot owner allowlist -> WebApp button -> signed Telegram initData, bound account cookie -> optional one-time Chrome handoff. Unlisted users are not granted MW.
- **Legacy #access operator passwords are no longer accepted by either the launcher or game gateway.** Existing links must be replaced by new Telegram tickets.
- U2 and MW have different game engines, OPFS save locations, cloud encryption roots, Supabase schemas, Windows services and gameplay leases. No accidental cross-game save imports.

## Operational constraints
- Public static launcher can load while the private game PCs are off. A working launcher is NOT proof that either game gateway is online.
- Quick Tunnel game URLs are temporary and must be refreshed through validated bridge.json/watchdog. Do not embed private credentials in bridge.json.
- Both games are test integrations with EA intellectual-property considerations; do not broaden public redistribution without reviewing rights and actual game-asset hosting model.
- Use separate Chrome profiles on a shared machine, since local OPFS files are readable to anyone controlling that browser profile.
- Frozen project: keep existing saves/backups, no new game features or migrations until the user explicitly resumes.

## Verification
- Chrome mobile and desktop two-card layout, one-use U2 ticket route, old #access fragment rejection, MW bot deep-link, no horizontal overflow and no sensitive token in the address bar.
- Live HTTPS must serve the new versioned app.js and bridge.json. Only authorized game gateway users may request WASM/assets.
- Future updates require backups, isolated tests, live acceptance on Telegram + Chrome, and release notes in the respective game/bot repositories.

Related: FreeRide-NFSMW-Web / FREERIDE_RACING_SECURITY_FREEZE_20261105.md, FreeRide-NFSU2-Web / FREERIDE_RACING_SECURITY_FREEZE_20261105.md, FreeRideBot / docs/FREERIDE_RACING_FREEZE_20261105.md.

## Где старые исходники лаунчера после уборки

Архивные worktrees `FreeRide-Racing-Freeze-20261105` и `FreeRide-Racing-Launcher-Lab` перемещены в `C:\Users\FreeRide\FreeRide-Archive\Git-Worktrees\Launcher` через `git worktree move`. Основной репозиторий `FreeRide-NFSU2-Launcher` и GitHub Pages остались на своих местах. Поиск прежних абсолютных путей: `FreeRide-Archive\MOVE_MANIFEST_20261105.json`.
