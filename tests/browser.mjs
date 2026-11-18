import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { publishableProjects } from '../src/data/projects.js';
import { launchBrowser, origin, settleImages } from './helpers.mjs';

const browser=await launchBrowser(), errors=[], engine=process.env.BROWSER||'chromium';
try {
  console.log('Browser:',browser.version());
  for(const locale of ['en','ar']) {
    const context=await browser.newContext({reducedMotion:'reduce',viewport:{width:1440,height:1000}});
    const page=await context.newPage();
    page.on('pageerror',error=>errors.push(error.message));
    page.on('response',response=>{if(response.status()>=400)errors.push(response.status()+' '+response.url());});
    const response=await page.goto(origin+(locale==='ar'?'/ar/':'/'));
    assert.equal(response.status(),200);assert.equal(await page.locator('html').getAttribute('lang'),locale);
    assert.equal(await page.locator('html').getAttribute('dir'),locale==='ar'?'rtl':'ltr');
    assert.equal(await page.locator('h1').count(),1);
    assert.equal(await page.locator('.portrait-frame img').evaluate(image=>image.complete&&image.naturalWidth>0),true);
    for(const width of [320,360,390,430,768,1024,1280,1440,1920]) {
      await page.setViewportSize({width,height:900});
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${locale} overflow at ${width}`);
      const bounds=await page.locator('h1').boundingBox();assert(bounds.x>=-1&&bounds.x+bounds.width<=width+1,`${locale} hero heading bounds ${width}`);
    }
    // Browser zoom reflows the layout viewport: 1280px at 200% gives 640 CSS px.
    // CSS `zoom` is deliberately avoided: it does not change media-query breakpoints.
    await page.setViewportSize({width:640,height:450});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${locale} 200% zoom overflow`);
    await page.setViewportSize({width:1440,height:1000});
    assert.equal(await page.locator('[data-menu-toggle]').isVisible(),false);
    await settleImages(page);await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
    await page.screenshot({path:`docs/redesign-${locale}-${engine}-desktop.png`,fullPage:true});
    await page.screenshot({path:`docs/redesign-${locale}-${engine}-hero.png`});
    // Every fragment links to a real target; no fake contact actions or private PDF.
    const badAnchors=await page.locator('a[href^="#"]').evaluateAll(links=>links.filter(link=>!document.getElementById(link.hash.slice(1))).map(link=>link.hash));
    assert.deepEqual(badAnchors,[]);assert.equal(await page.locator('a[href^="mailto:"],a[href$=".pdf"],a[href*="wa.me"],a[href*="linkedin.com"]').count(),0);
    assert.equal(await page.locator('#work [data-project]').count(),0);
    await page.setViewportSize({width:390,height:844});
    await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
    await page.screenshot({path:`docs/redesign-${locale}-${engine}-mobile.png`,fullPage:true});
    await page.screenshot({path:`docs/redesign-${locale}-${engine}-mobile-hero.png`});
    await page.locator('[data-menu-toggle]').click();
    assert.equal(await page.locator('#navigation').getAttribute('aria-modal'),'true');
    assert.equal(await page.locator('main').evaluate(element=>element.inert),true);
    assert.equal(await page.locator('body').evaluate(element=>getComputedStyle(element).overflow),'hidden');
    await page.keyboard.press('Shift+Tab');assert.equal(await page.evaluate(()=>document.activeElement.getAttribute('href')),'#contact');
    await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.hasAttribute('data-menu-close')),true);
    await page.keyboard.press('Escape');assert.equal(await page.locator('#navigation').isVisible(),false);
    assert.equal(await page.evaluate(()=>document.activeElement.hasAttribute('data-menu-toggle')),true);
    assert.equal(await page.locator('main').evaluate(element=>element.inert),false);
    await page.locator('[data-menu-toggle]').click();await page.locator('[data-nav][href="#services"]').click();
    assert.equal(new URL(page.url()).hash,'#services');assert.equal(await page.locator('#navigation').isVisible(),false);
    await page.locator('[data-language]').first().click();assert.equal(new URL(page.url()).hash,'#services');
    await context.close();
  }
  // No-JS on both routes: content/nav present and original media links remain useful.
  for(const route of ['/','/ar/']) {
    const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}}),page=await context.newPage();
    await page.goto(origin+route);assert(await page.locator('h1').isVisible());assert(await page.locator('#navigation').isVisible());
    assert.equal(await page.locator('.filters').first().isVisible(),false);
    const imageLink=page.locator('[data-open-project]').first();assert.equal((await page.request.get(new URL(await imageLink.getAttribute('href'),origin).href)).status(),200);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    await context.close();
  }
  const fallback=await browser.newContext({viewport:{width:1280,height:900}});
  await fallback.addInitScript(()=>{const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){if(type.startsWith('webgl'))return null;return get.call(this,type,...args);};});
  await fallback.route('**/assets/motion-*.js',route=>route.abort());
  const fallbackPage=await fallback.newPage();await fallbackPage.goto(origin+'/ar/');
  assert(await fallbackPage.locator('h1').isVisible());assert(await fallbackPage.locator('.portrait-frame img').isVisible());
  assert.equal(await fallbackPage.locator('canvas').count(),0);await fallback.close();
  assert.equal(publishableProjects([{status:'draft',permissionConfirmed:true},{status:'published',permissionConfirmed:false}]).length,0);
  async function checkBundle(directory) {
    for(const item of await readdir(directory,{withFileTypes:true})){
      const path=join(directory,item.name);
      if(item.isDirectory())await checkBundle(path);
      else if(/\.(html|js|css|json|txt)$/.test(path)){
        const text=await readFile(path,'utf8');
        for(const forbidden of ['mohamedmonsef802','01026671903','201026671903','Mohamed Monsef (2).pdf','source-assets','previous-deployed'])assert(!text.includes(forbidden),`Private data in ${path}`);
      }
    }
  }
  await checkBundle('dist');
  for(const path of ['dist/index.html','dist/ar/index.html'])assert((await readFile(path,'utf8')).includes('noindex'));
  assert.deepEqual(errors,[]);
  console.log('PASS: EN/AR, 18 widths, 200% reflow, screenshots, menu focus/Escape/scroll lock, anchors, locale/hash, no-JS/module-failure/no-WebGL fallback, draft and private-data gates.');
} finally {await browser.close();}
