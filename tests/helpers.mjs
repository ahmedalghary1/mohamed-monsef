import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { chromium, firefox, webkit } from 'playwright';

export const origin=process.env.TEST_URL||'http://127.0.0.1:4173';
export async function launchBrowser(extra = {}) {
  const name=process.env.BROWSER||'chromium', type={chromium,firefox,webkit}[name];
  let executablePath=process.env.BROWSER_PATH||process.env.CHROME_PATH;
  if (!executablePath && !existsSync(type.executablePath())) {
    const cache=join(process.env.LOCALAPPDATA||'', 'ms-playwright');
    const folder=readdirSync(cache).filter(item=>item.startsWith(name+'-')).sort().at(-1);
    if(folder)executablePath=join(cache,folder,...({chromium:['chrome-win64','chrome.exe'],firefox:['firefox','firefox.exe'],webkit:['Playwright.exe']}[name]));
  }
  return type.launch({headless:true,...(executablePath?{executablePath}:{}),...extra});
}
export async function settleImages(page) {
  for (const image of await page.locator('main img:visible').all()) await image.scrollIntoViewIfNeeded();
  await page.evaluate(()=>Promise.all([...document.querySelectorAll('main img')].filter(image=>!image.closest('dialog')).map(image=>image.decode().catch(()=>{}))));
  await page.evaluate(()=>document.fonts.ready);
}
