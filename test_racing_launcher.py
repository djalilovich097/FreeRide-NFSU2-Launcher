"""No real tickets, no Telegram credentials, disposable Chrome UI smoke."""
import json
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).parent
JS=r"""window.testEvents=[];
window.TelegramWebviewProxy={postEvent(name,payload){
 window.testEvents.push({name,...JSON.parse(payload)});
}};"""
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
 def end_headers(self):
  self.send_header("Cache-Control","no-store")
  super().end_headers()

def run():
 server=ThreadingHTTPServer(("127.0.0.1",0),partial(Quiet,directory=str(ROOT)))
 runner=Thread(target=server.serve_forever,daemon=True);runner.start()
 url=f"http://127.0.0.1:{server.server_port}/"
 try:
  with sync_playwright() as p:
   browser=p.chromium.launch(
    executable_path=r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    headless=True,args=["--disable-background-networking"])
   try:
    ctx=browser.new_context(viewport={"width":390,"height":844})
    ctx.add_init_script(JS)
    ctx.route("https://telegram.org/**",lambda route:route.abort())
    page=ctx.new_page()
    page.goto(url,wait_until="domcontentloaded")
    page.wait_for_function("document.getElementById('u2-status').textContent.includes('Личный пропуск')")
    assert page.locator(".game-card").count()==3
    assert page.locator("#play-u2").is_enabled()
    assert page.locator("#play-mw").is_enabled()
    assert page.locator("h1").inner_text().startswith("НОЧЬ В БЭЙВЬЮ.")
    assert page.evaluate("document.documentElement.scrollWidth<=innerWidth"),"Horizontal overflow on mobile"
    page.locator("#play-u2").click()
    event=page.evaluate("window.testEvents.at(-1)")
    assert event["name"]=="web_app_open_tg_link",event
    assert event["path"]=="/freeride_team_bot?start=nfsplay",event
    page.locator("#play-mw").click()
    event=page.evaluate("window.testEvents.at(-1)")
    assert event["name"]=="web_app_open_tg_link"
    assert event["path"]=="/freeride_team_bot?start=mwplay"
    print("RACING_MOBILE_SINGLE_LAUNCHER_BOTH_BOT_PATHS_PASS",flush=True)
    page.screenshot(path=str(ROOT/"qa-racing-mobile.png"),full_page=True)

    hubpage=ctx.new_page()
    hubpage.route("**/hub/",lambda route:route.fulfill(
        status=200,content_type="text/html",body="<title>Racing Hub QA</title>"))
    hubpage.goto(url,wait_until="domcontentloaded")
    hubpage.locator("#open-hub").wait_for(state="visible")
    hubpage.wait_for_function("!document.getElementById('open-hub').disabled")
    hubpage.locator("#open-hub").click()
    hubpage.wait_for_url("**/hub/")
    target=json.loads((ROOT/"bridge.json").read_text(encoding="utf8"))["tunnel"]+"hub/"
    assert hubpage.url==target,hubpage.url
    hubpage.close()
    print("RACING_HUB_THIRD_CARD_ROUTE_PASS",flush=True)

    ticket="A"*48+"."+"B"*43
    page.goto("about:blank")
    page.goto(url+"#ticket="+ticket,wait_until="domcontentloaded")
    page.wait_for_timeout(650)
    assert 'одноразовый' in page.locator('#u2-status').inner_text(),page.locator('#u2-status').inner_text()
    assert "#" not in page.url,"Sensitive launch token stayed in address"
    page.locator("#play-u2").click()
    event=page.evaluate("window.testEvents.at(-1)")
    assert event["name"]=="web_app_open_link" and event["try_browser"]=="chrome",event
    assert event["url"].endswith("/?fr_ticket="+ticket),event
    expected=json.loads((ROOT/"bridge.json").read_text(encoding="utf8"))["tunnel"]
    assert event["url"].startswith(expected),event
    print("RACING_U2_EXISTING_TICKET_CHROME_BRIDGE_PASS",flush=True)

    # A legacy admin #access fragment must NEVER become ?fr_access in a
    # game URL; it is not proof of Telegram identity.
    page.goto("about:blank")
    page.goto(url+"#access="+"A"*43,wait_until="domcontentloaded")
    page.wait_for_timeout(500)
    assert "#" not in page.url
    page.locator("#play-u2").click()
    event=page.evaluate("window.testEvents.at(-1)")
    assert event["name"]=="web_app_open_tg_link",event
    assert event["path"]=="/freeride_team_bot?start=nfsplay",event
    print("RACING_LEGACY_OPERATOR_LINK_REJECTED_PASS",flush=True)

    ctx2=browser.new_context(viewport={"width":1360,"height":860})
    ctx2.route("https://telegram.org/**",lambda route:route.abort())
    wide=ctx2.new_page();wide.goto(url,wait_until="domcontentloaded")
    assert wide.locator(".game-card").count()==3
    assert wide.evaluate("document.documentElement.scrollWidth<=innerWidth"),"Desktop horizontal overflow"
    wide.screenshot(path=str(ROOT/"qa-racing-desktop.png"),full_page=True)
    print("RACING_DESKTOP_RENDER_PASS",flush=True)
    ctx.close();ctx2.close()
   finally:browser.close()
 finally:server.shutdown();server.server_close()
if __name__=="__main__":run()
