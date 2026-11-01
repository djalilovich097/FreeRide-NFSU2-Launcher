// Minimal FreeRide NFSU2 launcher: no manual key entry.
// A Telegram bot verifies FreeRide Team membership and issues a 2-minute ticket.
// Legacy admin access key in URL fragment is retained for diagnostics only.
(() => {
 'use strict';
 const start=document.getElementById('launch'),copy=document.getElementById('copy');
 const status=document.getElementById('service-status'),message=document.getElementById('message');
 const bot='https://t.me/freeride_team_bot?start=nfsplay';
 const params=new URLSearchParams(location.hash.slice(1));
 const issued=params.get('ticket')||'';
 const legacy=params.get('access')||'';
 const hasTicket=/^[A-Za-z0-9_-]{30,280}\.[A-Za-z0-9_-]{43}$/.test(issued);
 const hasLegacy=/^[A-Za-z0-9_-]{32,80}$/.test(legacy);
 let upstream='',ticket=hasTicket?issued:'',access=hasLegacy?legacy:'';
 if(location.hash)history.replaceState(null,'',location.pathname+location.search);
 function say(t){message.textContent=t;}
 function browserOpen(url){
  const b=window.TelegramWebviewProxy;
  if(b&&typeof b.postEvent==='function'){
   b.postEvent('web_app_open_link',JSON.stringify({url,try_browser:'chrome'}));return true;
  }
  const tg=window.Telegram?.WebApp;
  if(tg?.openLink){tg.openLink(url,{try_instant_view:false});return true;}
  return false;
 }
 function openTelegramBot(){
  const tg=window.Telegram?.WebApp;
  if(tg&&typeof tg.openTelegramLink==='function'){
    tg.openTelegramLink(bot);return;
  }
  const bridge=window.TelegramWebviewProxy;
  if(bridge&&typeof bridge.postEvent==='function'){
    bridge.postEvent('web_app_open_tg_link',JSON.stringify({path:'/freeride_team_bot?start=nfsplay'}));
    return;
  }
  location.href=bot;
 }
 function launchUrl(){
  if(!upstream)return null;
  if(!ticket&&!access)return null;
  const u=new URL(upstream);u.pathname='/';
  if(ticket)u.searchParams.set('fr_ticket',ticket);
  else u.searchParams.set('fr_access',access);
  return u.toString();
 }
 function render(){
  const tokenReady=Boolean(ticket||access);
  start.disabled=!upstream;
  copy.disabled=!(upstream&&tokenReady);
  start.querySelector('span').textContent=tokenReady?'ЗАПУСТИТЬ NFSU2':'ПОЛУЧИТЬ ДОСТУП ЧЕРЕЗ TELEGRAM';
 }
 async function findServer(){
  try{
   const r=await fetch('./bridge.json?v='+Date.now(),{cache:'no-store'});
   if(!r.ok)throw Error();
   const conf=await r.json(),candidate=new URL(conf.tunnel);
   if(candidate.protocol!=='https:'||candidate.username||candidate.password||
      candidate.pathname!=='/'||candidate.search||candidate.hash||
      !/^[a-z0-9-]+\.trycloudflare\.com$/i.test(candidate.hostname)||
      conf.state!=='testing')throw Error();
   upstream=candidate.origin;status.classList.remove('offline');
   status.textContent=ticket?'Личный пропуск получен. Нажми «Запустить» до истечения двух минут.':
     'Сервер настроен. Вход через бота FreeRide, без ручного ключа.';
  }catch{
   upstream='';status.classList.add('offline');
   status.textContent='Тестовый сервер недоступен. Попробуй позже.';
  }render();
 }
 start.addEventListener('click',()=>{
  if(!upstream)return;
  const url=launchUrl();
  if(!url){
   openTelegramBot();
   say('Получить личный пропуск можно через @freeride_team_bot.');
   return;
  }
  try{if(browserOpen(url)){say('Открываем игру в Chrome…');return;}}catch{}
  const a=document.createElement('a');
  a.href=url;a.rel='noopener noreferrer';a.target='_blank';a.click();
  say('Если Chrome не открылся, скопируй временную ссылку.');
 });
 copy.addEventListener('click',async()=>{
  const url=launchUrl();if(!url)return;
  try{await navigator.clipboard.writeText(url);say('Временная ссылка для Chrome скопирована. Не пересылай её другим.');}
  catch{say('Не получилось скопировать ссылку.');}
 });
 window.Telegram?.WebApp?.ready?.();
 render();void findServer();
})();
