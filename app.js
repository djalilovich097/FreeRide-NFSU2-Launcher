// Public, original-code launcher only. NEVER bundle NFSU2 assets, access
// tokens or Telegram initData into the GitHub Pages repository.
(() => {
  'use strict';
  const access = document.getElementById('access');
  const start = document.getElementById('launch');
  const copy = document.getElementById('copy');
  const status = document.getElementById('service-status');
  const message = document.getElementById('message');
  let upstream = '';
  let invited = '';
  const rKey = /^[A-Za-z0-9_-]{32,80}$/;

  const rawFragment = new URLSearchParams(location.hash.substring(1)).get('access') || '';
  if (rKey.test(rawFragment)) {
    invited = rawFragment;
    // Fragment is never sent to GitHub Pages, and is removed from address bar.
    history.replaceState(null, '', location.pathname);
  }

  function currentKey() {
    const raw = access.value.trim() || invited;
    if (rKey.test(raw)) return raw;
    try {
      const url = new URL(raw);
      const key = url.searchParams.get('fr_access') || '';
      return rKey.test(key) ? key : '';
    } catch { return ''; }
  }
  function setMessage(text) { message.textContent = text; }
  function updateControls() {
    start.disabled = copy.disabled = !(upstream && currentKey());
    if (!access.value && invited) access.placeholder = 'Код из приглашения получен ✓';
  }
  access.addEventListener('input', () => {
    invited = '';
    updateControls();
    setMessage('');
  });

  // Intentionally never persist the bearer token to localStorage / GitHub.
  function gameUrl() {
    if (!upstream) return '';
    const key = currentKey();
    if (!key) return '';
    const u = new URL(upstream);
    u.pathname = '/';
    u.searchParams.set('fr_access', key);
    return u.toString();
  }
  async function loadServer() {
    try {
      const resp = await fetch('./bridge.json?nocache=' + Date.now(), {cache:'no-store'});
      if (!resp.ok) throw Error('Сервер не настроен');
      const config = await resp.json();
      const candidate = new URL(config.tunnel);
      if (candidate.protocol !== 'https:' || candidate.username || candidate.password ||
          candidate.pathname !== '/' || candidate.search || candidate.hash ||
          !/^[a-z0-9-]+\.trycloudflare\.com$/i.test(candidate.hostname) ||
          config.state !== 'testing') throw Error('Недопустимый адрес тестового сервера');
      upstream = candidate.origin;
      status.textContent = 'Тестовый адрес получен. Для запуска нужен приватный ключ.';
      status.classList.remove('offline');
      updateControls();
    } catch {
      upstream = '';
      status.textContent = 'Тестовый сервер сейчас недоступен. Попробуй позже.';
      status.classList.add('offline');
      updateControls();
    }
  }

  // Use the real Telegram native bridge, but NEVER leak Telegram launch params.
  function tryTelegramBrowser(url) {
    const tg = window.Telegram && window.Telegram.WebApp;
    if (tg && typeof tg.openLink === 'function') {
      tg.openLink(url, {try_instant_view:false});
      return true;
    }
    const bridge = window.TelegramWebviewProxy;
    if (bridge && typeof bridge.postEvent === 'function') {
      bridge.postEvent('web_app_open_link', JSON.stringify({url,try_browser:'chrome'}));
      return true;
    }
    return false;
  }
  start.addEventListener('click', () => {
    const url = gameUrl();
    if (!url) {setMessage('Введи ключ доступа из приглашения.');return;}
    try {
      if (tryTelegramBrowser(url)) {
        setMessage('Открываем игру во внешнем браузере…');
        return;
      }
    } catch {
      // Browser fallback still requires a trusted user gesture.
    }
    const link = document.createElement('a');
    link.href = url;
    link.rel = 'noreferrer noopener';
    link.target = '_blank';
    link.click();
    setMessage('Если Chrome не открылся, используй кнопку копирования.');
  });
  copy.addEventListener('click', async () => {
    const url = gameUrl();
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setMessage('Ссылка для Chrome скопирована. Никому не пересылай ключ доступа.');
    } catch { setMessage('Не удалось скопировать ссылку. Открой в Chrome вручную.'); }
  });

  window.Telegram?.WebApp?.ready?.();
  updateControls();
  void loadServer();
})();
