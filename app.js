// FreeRide Racing permanent Telegram launcher: one entry, two isolated games.
// No EA files, server credentials, Telegram IDs, or browser saves are stored here.
(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  const bot='https://t.me/freeride_team_bot';
  const params=new URLSearchParams(location.hash.slice(1));
  const rawTicket=params.get('ticket')||'';
  const rawAccess=params.get('access')||'';
  const ticketPattern=/^[A-Za-z0-9_-]{30,280}\.[A-Za-z0-9_-]{43}$/;
  const accessPattern=/^[A-Za-z0-9_-]{32,80}$/;
  const ticket=ticketPattern.test(rawTicket)?rawTicket:'';
  // Legacy admin mode is kept for established private tests; never shown in UI.
  const legacy=accessPattern.test(rawAccess)?rawAccess:'';
  if(location.hash)history.replaceState(null,'',location.pathname+location.search);
  const tg=window.Telegram?.WebApp;
  try{tg?.ready?.();tg?.expand?.();}catch{}
  let u2Origin='';
  function toast(message){
    const el=$('toast');el.textContent=message;el.hidden=false;
  }
  function toTelegram(start){
    const url=bot+'?start='+encodeURIComponent(start);
    try{
      if(typeof tg?.openTelegramLink==='function'){
        tg.openTelegramLink(url);return;
      }
      if(typeof window.TelegramWebviewProxy?.postEvent==='function'){
        window.TelegramWebviewProxy.postEvent('web_app_open_tg_link',
          JSON.stringify({path:'/freeride_team_bot?start='+start}));return;
      }
    }catch{}
    const a=document.createElement('a');
    a.href=url;a.rel='noopener noreferrer';a.target='_blank';a.click();
    toast('Если бот не открылся, перейди в @freeride_team_bot через Telegram.');
  }
  function openChrome(url){
    try{
      if(typeof window.TelegramWebviewProxy?.postEvent==='function'){
        window.TelegramWebviewProxy.postEvent('web_app_open_link',
          JSON.stringify({url,try_browser:'chrome'}));return;
      }
      if(typeof tg?.openLink==='function'){
        tg.openLink(url,{try_instant_view:false});return;
      }
    }catch{}
    const a=document.createElement('a');
    a.href=url;a.rel='noopener noreferrer';a.target='_blank';a.click();
    toast('Если браузер не открылся, разреши запуск внешних ссылок в Telegram.');
  }
  function u2LaunchUrl(){
    if(!u2Origin||(!ticket&&!legacy))return null;
    const u=new URL('/',u2Origin);
    if(ticket)u.searchParams.set('fr_ticket',ticket);
    else u.searchParams.set('fr_access',legacy);
    return u.href;
  }
  function setU2(){
    const ready=Boolean(ticket||legacy);
    $('play-u2').disabled=false;
    $('play-u2').firstChild.textContent=ready?'ЗАПУСТИТЬ UNDERGROUND 2 ':'ПОЛУЧИТЬ ДОСТУП К U2 ';
    $('u2-status').textContent=ready
      ? 'Личный одноразовый пропуск получен. Нажми «Запустить» до истечения 2 минут.'
      : u2Origin
        ? 'Личный пропуск выдаёт @freeride_team_bot после проверки участия в команде.'
        : 'Ссылка на сервер пока недоступна. Можно запросить доступ через бота.';
    $('u2-status').classList.toggle('offline',!u2Origin);
  }
  async function loadBridge(){
    try{
      const r=await fetch('./bridge.json?fresh='+Date.now(),{cache:'no-store',signal:AbortSignal.timeout(8000)});
      if(!r.ok)throw Error('Bridge unavailable');
      const cfg=await r.json(),u=new URL(cfg.tunnel);
      if(cfg.state!=='testing'||u.protocol!=='https:'||u.username||u.password||
         u.pathname!=='/'||u.search||u.hash||
         !/^[a-z0-9-]+\.trycloudflare\.com$/i.test(u.hostname))
        throw Error('Invalid game bridge');
      u2Origin=u.origin;
    }catch{u2Origin='';}
    setU2();
  }
  $('play-u2').addEventListener('click',()=>{
    const url=u2LaunchUrl();
    if(url)openChrome(url);
    else toTelegram('nfsplay');
  });
  $('play-mw').addEventListener('click',()=>{
    // MW owner-only gateway only accepts signed Telegram Web App initData.
    // A public static page must NOT supply a UID or reuse an access key.
    // The verified bot issues an owner-restricted WebApp button instead.
    toTelegram('mwplay');
  });
  setU2();void loadBridge();
})();
