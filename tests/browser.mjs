import assert from 'node:assert/strict';
import { chromium, firefox, webkit } from 'playwright';
import { publishableProjects } from '../src/data/projects.js';
import { readFile } from 'node:fs/promises';
const browser=await ({chromium,firefox,webkit}[process.env.BROWSER || 'chromium']).launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
const origin=process.env.TEST_URL||'http://127.0.0.1:4173';
const errors=[];
try{
for(const locale of ['en','ar']){
 const page=await browser.newPage({reducedMotion:'reduce'});page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
 await page.goto(origin+(locale==='ar'?'/ar/':'/'));assert.equal(await page.locator('html').getAttribute('lang'),locale);assert.equal(await page.locator('h1').count(),1);
 for(const width of [320,360,390,430,768,1024,1280,1440,1920]){await page.setViewportSize({width,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${locale} ${width} overflow`);}
 await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:`docs/${locale}-desktop.png`,fullPage:true});assert.equal(await page.locator('[data-menu-toggle]').isVisible(),false);
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:`docs/${locale}-mobile.png`,fullPage:true});await page.locator('[data-menu-toggle]').click();assert.equal(await page.locator('#navigation').isVisible(),true);await page.keyboard.press('Escape');assert.equal(await page.locator('#navigation').isVisible(),false);
 await page.locator('[data-menu-toggle]').click();await page.locator('[data-nav][href="#services"]').click();assert.equal(new URL(page.url()).hash,'#services');assert.equal(await page.locator('#navigation').isVisible(),false);
 await page.locator('[data-language]').click();assert.equal(new URL(page.url()).hash,'#services');
 assert.equal(await page.locator('a[href^="mailto:"],a[href$=".pdf"],[data-project]').count(),0);await page.close();
}
for(const javaScriptEnabled of [false,true]){
 const context=await browser.newContext({javaScriptEnabled,viewport:{width:1280,height:900}});
 if(javaScriptEnabled)await context.addInitScript(()=>{const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){if(type==='webgl2'||type==='webgl')return null;return get.call(this,type,...args);};});
 const page=await context.newPage();await page.goto(origin+'/ar/');await page.waitForTimeout(1000);assert.equal(await page.locator('[data-scene-fallback]').isVisible(),true);assert.equal(await page.locator('h1').isVisible(),true);if(!javaScriptEnabled)assert.equal(await page.locator('#navigation').isVisible(),true);await context.close();
}
const context=await browser.newContext({viewport:{width:1280,height:900}});const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.goto(origin);await page.waitForTimeout(1500);await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(200);assert.equal(await page.locator('[data-scene-fallback]').isVisible(),true);await context.close();
assert.equal(publishableProjects([{status:'draft',permissionConfirmed:true},{status:'published',permissionConfirmed:false}]).length,0);
for(const file of ['dist/index.html','dist/ar/index.html']){const content=await readFile(file,'utf8');assert(!content.includes('mohamedmonsef802'));assert(!content.includes('01026671903'));assert(content.includes('noindex'));}
const fixture=await browser.newPage();await fixture.setContent('<div data-gallery><button data-filter="all" aria-pressed="true">All</button><button data-filter="image" aria-pressed="false">Images</button><p data-results aria-live="polite"></p><article data-project data-type="campaign"><a href="#" data-open-project="one">Open</a></article><article data-project data-type="image">Image</article><dialog data-dialog="one"><button data-close>Close</button><video></video></dialog></div>');
await fixture.addScriptTag({content:(await readFile('src/js/gallery.js','utf8')).replace('export function','function')+';initGallery();'});
await fixture.locator('[data-filter="image"]').click();assert.equal(await fixture.locator('[data-project]:visible').count(),1);assert.equal(await fixture.locator('[data-filter="image"]').getAttribute('aria-pressed'),'true');await fixture.locator('[data-filter="all"]').click();await fixture.locator('[data-open-project]').click();assert.equal(await fixture.locator('dialog').isVisible(),true);await fixture.keyboard.press('Escape');assert.equal(await fixture.locator('dialog').isVisible(),false);assert.equal(await fixture.evaluate(()=>document.activeElement.hasAttribute('data-open-project')),true);await fixture.close();
assert.deepEqual(errors,[]);console.log('PASS: both locales, 18 viewport checks, menus/Escape/anchors, language/hash, private gating, no-JS/no-WebGL/reduced-motion and draft exclusion.');
}finally{await browser.close();}
