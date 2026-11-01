# FreeRide NFSU2 · stable private launcher

**Public GitHub Pages landing only.** No game data, Telegram bot token, launch key, WASM, EA assets, passwords, or player information is hosted in this repository.

- `index.html`, `styles.css`, `app.js`: original static launcher for FreeRide.
- `bridge.json`: current, **public** Cloudflare Quick Tunnel hostname. It is NOT a credential; protected game content remains behind a separate access gateway.
- A private invite has format `https://djalilovich097.github.io/FreeRide-NFSU2-Launcher/#access=<secret>`. The **fragment** is not sent to GitHub, not stored in this repository, and is stripped from browser history as soon as the page loads.
- The GitHub Pages page shows a key-entry field when opened without an invite and cannot access any game files. On explicit click it opens `<tunnel>/?fr_access=<secret>` via Telegram openLink/Android bridge or Chrome.
- On Android this launches external Chrome. This is a launch hub, **not a cross-origin-isolation workaround for the game inside Telegram WebView**.
- If the Windows game computer or quick tunnel goes offline, the permanent page still loads but the launch cannot reach the game. Update `bridge.json` when the quick tunnel hostname changes (commit via owner account only).

## Security
Never put the secret token in `bridge.json`, commit messages or public GitHub Pages URLs in query parameters. Do not share the private QR in a Telegram group. The resource gateway independently checks authorization for every request, and neither this page nor its public source includes copyrighted game resources.

## Future
Replace the quick tunnel with a stable named Cloudflare tunnel after confirming ownership of a domain and configuring a Cloudflare account. The landing can be retired or repointed without changing the Mini App URL.
