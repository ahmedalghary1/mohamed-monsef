import assert from 'node:assert/strict';
import { chromium, firefox } from 'playwright';
const browser=await ({chromium,firefox}[process.env.BROWSER||'chromium']).launch();
const origin=process.env.TEST_URL||'http://127.0.0.1:4173';
try{
 const context=await browser.newContext({viewport:{width:1440,height:1000}}),page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
 for(const route of ['/','/ar/']){
  await page.goto(origin+route);await page.waitForTimeout(1500);if(await page.locator('[data-scene-canvas]').isVisible())assert.equal(await page.locator('[data-scene-fallback]').isVisible(),false);await page.screenshot({path:`docs/${route==='/'?'en':'ar'}-motion-hero.png`});
  const marquee=page.locator('[data-marquee]');await marquee.scrollIntoViewIfNeeded();await page.waitForTimeout(200);const toggle=page.locator('[data-marquee-toggle]');await toggle.click();assert.equal(await toggle.getAttribute('aria-pressed'),'true');assert.equal(await page.locator('[data-marquee-track]').evaluate(el=>getComputedStyle(el).animationPlayState),'paused');
  await page.mouse.move(0,0);await toggle.click();await toggle.evaluate(el=>el.blur());await page.mouse.move(0,0);await page.waitForTimeout(200);assert.equal(await marquee.evaluate(el=>el.classList.contains('is-running')),true);
  for(const index of [0,1,2,3]){await page.locator(`[data-story-step="${index}"]`).evaluate(el=>el.scrollIntoView({block:"center"}));await page.waitForTimeout(700);assert.equal(await page.locator('[data-story-counter]').textContent(),`0${index+1} / 04`);}
  await page.screenshot({path:`docs/${route==='/'?'en':'ar'}-story.png`});
  for(const width of [320,360,390,430,768,1024,1280,1440,1920]){await page.setViewportSize({width,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${route} overflow ${width}`);}
  await page.setViewportSize({width:1280,height:900});await page.locator('#creative-lab').scrollIntoViewIfNeeded();await page.waitForTimeout(600);await page.screenshot({path:`docs/${route==='/'?'en':'ar'}-lab.png`,fullPage:true});
  const opener=page.locator('[data-open-project="concept-still-form"]').first();await opener.click();const dialog=page.locator('[data-dialog="concept-still-form"]');assert(await dialog.isVisible());const video=dialog.locator('video');await video.evaluate(v=>v.play());await page.waitForTimeout(700);assert(await video.evaluate(v=>v.currentTime>0));await page.keyboard.press('Escape');assert.equal(await video.evaluate(v=>v.paused),true);assert.equal(await dialog.isVisible(),false);assert.equal(await opener.evaluate(el=>el===document.activeElement),true);
  await page.locator('.motion-preview a').click();assert.equal(await dialog.isVisible(),true);await page.keyboard.press('Escape');
  await page.emulateMedia({reducedMotion:'reduce'});await toggle.waitFor({state:'hidden'});assert.equal(await toggle.isVisible(),false);assert.equal(await page.locator('[data-marquee-track]').evaluate(el=>getComputedStyle(el).animationName),'none');await page.emulateMedia({reducedMotion:'no-preference'});await toggle.waitFor({state:'visible'});
 }
 assert.deepEqual(errors,[]);await context.close();console.log('PASS: animated ribbon pause/resume, four story states, concept/video playback and pause on close, focus restore, reduced-motion and 18 responsive checks.');
}finally{await browser.close();}
