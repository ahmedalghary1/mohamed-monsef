import assert from 'node:assert/strict';
import { launchBrowser, origin } from './helpers.mjs';
const browser=await launchBrowser(),errors=[];
try{
  console.log('Browser:',browser.version());
  const context=await browser.newContext({viewport:{width:1440,height:1000}}),page=await context.newPage();
  page.on('pageerror',error=>errors.push(error.message));
  page.on('response',response=>{if(response.status()>=400)errors.push(response.status()+' '+response.url());});
  for(const route of ['/','/ar/']) {
    await page.goto(origin+route);await page.waitForTimeout(1000);
    const lab=page.locator('#creative-lab');await lab.scrollIntoViewIfNeeded();
    const expected={all:3,image:3,ad:3,product:2,property:1,concept:3};
    for(const [type,count] of Object.entries(expected)){
      const button=lab.locator(`[data-filter="${type}"]`);await button.click();
      assert.equal(await button.getAttribute('aria-pressed'),'true');assert.equal(await lab.locator('[data-project]:visible').count(),count);
      assert((await lab.locator('[data-results]').textContent()).startsWith(String(count)));
    }
    await lab.locator('[data-filter="all"]').click();
    const opener=lab.locator('[data-open-project]').first();await opener.click();
    let dialog=lab.locator('dialog[open]');assert.equal(await dialog.getAttribute('data-dialog'),'concept-still-form');
    await dialog.locator('[data-next]').click();assert.equal(await lab.locator('dialog[open]').getAttribute('data-dialog'),'concept-quiet-spaces');
    await lab.locator('dialog[open] [data-previous]').click();assert.equal(await lab.locator('dialog[open]').getAttribute('data-dialog'),'concept-still-form');
    await page.keyboard.press(route==='/'?'ArrowRight':'ArrowLeft');assert.equal(await lab.locator('dialog[open]').getAttribute('data-dialog'),'concept-quiet-spaces');
    await page.keyboard.press('Escape');assert.equal(await lab.locator('dialog[open]').count(),0);assert.equal(await opener.evaluate(element=>element===document.activeElement),true);
    // A filtered gallery cycles only its visible items.
    await lab.locator('[data-filter="property"]').click();await lab.locator('[data-open-project="concept-quiet-spaces"]').click();
    assert.equal(await lab.locator('dialog[open] .dialog-navigation').isVisible(),false);
    await lab.locator('dialog[open] [data-close]').click();await lab.locator('[data-filter="all"]').click();
    await page.locator('[data-open-project="motion-study"]').click();
    const motion=page.locator('[data-dialog="motion-study"]'),video=motion.locator('video');
    assert(await motion.isVisible());assert.equal(await video.getAttribute('preload'),'none');
    if(!process.env.SKIP_MEDIA_PLAYBACK){
      const playback=await video.evaluate(element=>Promise.race([element.play().then(()=>true),new Promise(resolve=>setTimeout(()=>resolve(false),8000))]));
      assert.equal(playback,true,'Video playback did not start within 8 seconds');
      await page.waitForTimeout(600);assert(await video.evaluate(element=>element.currentTime>0));
    }else console.log('SKIP: native media playback — explicit environment limitation; no playback success asserted.');
    await page.keyboard.press('Escape');
    if(!process.env.SKIP_MEDIA_PLAYBACK)assert.equal(await video.evaluate(element=>element.paused),true);
    await page.waitForFunction(()=>!document.body.hasAttribute('data-dialog-open'));
    assert.equal(await page.locator('body').getAttribute('data-dialog-open'),null);
    // Native scrolling inside the dialog, with Lenis active outside it.
    await opener.click();await lab.locator('dialog[open]').evaluate(element=>{element.scrollTop=300;});
    assert(await lab.locator('dialog[open]').evaluate(element=>element.scrollTop>0));await page.keyboard.press('Escape');
    await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(100);
    assert.equal(await page.locator('html').evaluate(element=>element.classList.contains('lenis')),false);
    assert.equal(await page.locator('h1').evaluate(element=>getComputedStyle(element).opacity),'1');
    await page.emulateMedia({reducedMotion:'no-preference'});
  }
  assert.deepEqual(errors,[]);await context.close();
  // A real failed media response must show a useful message, with original link intact.
  const failure=await browser.newContext({reducedMotion:'reduce'}),p=await failure.newPage();
  await p.route('**/architecture*.webp',route=>route.abort());await p.goto(origin);
  await p.locator('[data-open-project="concept-quiet-spaces"]').click();
  const message=p.locator('dialog[open] [data-media-status]');await message.waitFor({state:'visible'});
  await p.waitForFunction(()=>{const e=document.querySelector('dialog[open] [data-media-status]');return e.textContent===e.dataset.error;});
  assert(await p.locator('dialog[open] a[href$="architecture.webp"]').isVisible());await failure.close();
  console.log('PASS: EN/AR category counts, dialog previous/next and RTL arrows, filtered navigation, Escape/focus restore, '+(process.env.SKIP_MEDIA_PLAYBACK?'media playback explicitly skipped':'real video playback/pause')+', dialog scrolling, reduced-motion and media failure feedback.');
}finally{await browser.close();}
