import { profile } from '../src/data/profile.js';
import assert from 'node:assert/strict';
import { contactChannels,renderFloating,renderContactRows } from '../scripts/contact-template.mjs';
import { launchBrowser,origin,settleImages } from './helpers.mjs';
assert.deepEqual(contactChannels({},'en'),[]);
assert.deepEqual(contactChannels({whatsappPhone:'0123',facebook:'javascript:alert(1)',linkedin:'https://untrusted.invalid'},'ar'),[]);
const fixture={whatsappPhone:'12025550100',facebook:'https://www.facebook.com/example',facebookPage:'https://www.facebook.com/example-page',email:'test@example.invalid',linkedin:'https://www.linkedin.com/in/example'};
for(const lang of ['en','ar']){
 const channels=contactChannels(fixture,lang);assert.equal(channels.length,5);
 const url=new URL(channels[0].url);assert.equal(url.pathname,'/12025550100');assert.equal(url.searchParams.get('text').startsWith(lang==='en'?'Hello Mohamed':'مرحبًا محمد'),true);
 assert(renderContactRows(channels).includes('noopener noreferrer'));assert(renderFloating(channels,lang).includes('aria-label'));
}
const browser=await launchBrowser();try{
const page=await browser.newPage({reducedMotion:'reduce'}),errors=[];
page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
for(const lang of ['en','ar']){
 await page.goto(origin+(lang==='ar'?'/ar/':'/'));await page.locator('[data-stage="5"]').click();
 assert.equal(await page.locator('[data-stage="5"]').getAttribute('aria-pressed'),'true');
 assert.equal(await page.locator('[data-stage-node="5"]').getAttribute('data-active'),'');
 const actual=contactChannels(profile.contact,lang);assert.equal(await page.locator('.contact-channel').count(),actual.length*3-(actual.some(c=>c.type==='whatsapp')?1:0));assert.equal(await page.locator('.floating-whatsapp').count(),actual.some(c=>c.type==='whatsapp')?1:0);
 assert.equal(await page.locator('.service-accordion').count(),4);
 await page.locator('.service-accordion').nth(1).locator('summary').click();assert.notEqual(await page.locator('.service-accordion').nth(1).getAttribute('open'),null);
 for(const width of [1440,768,390]){
  await page.setViewportSize({width,height:1000});await settleImages(page);await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
  if(width===1440){const covers=page.locator('#creative-lab .concept-cover');assert((await covers.nth(0).boundingBox()).width>(await covers.nth(1).boundingBox()).width*1.2,'Featured image must retain its full-width composition even with hidden dialog status nodes');}
  await page.screenshot({path:`docs/refinement-${lang}-${width}.png`,fullPage:true});
 }
}
assert.deepEqual(errors,[]);console.log('PASS: localized contact URL generation, invalid/missing channel gating, six-stage selection, service accordions, EN/AR desktop/tablet/mobile captures and no console errors.');
// Local synthetic contacts exercise UI visibility without navigating to third parties.
await page.setContent('<!doctype html><html lang="ar" dir="rtl"><head><link rel="icon" href="'+origin+'/favicon.svg"></head><body>'+renderFloating(contactChannels(fixture,'ar'),'ar')+'</body></html>');
await page.addStyleTag({path:'src/styles/tokens.css'});await page.addStyleTag({path:'src/styles/refinement.css'});
assert.equal(await page.locator('.floating-whatsapp').isVisible(),true);
await page.locator('body').evaluate(body=>body.setAttribute('data-menu-open',''));
assert.equal(await page.locator('.floating-whatsapp').isVisible(),false);
await page.locator('body').evaluate(body=>{body.removeAttribute('data-menu-open');body.setAttribute('data-dialog-open','');});
assert.equal(await page.locator('.floating-whatsapp').isVisible(),false);
console.log('PASS: floating WhatsApp is hidden under menu and media overlays; no message sent.');
}finally{await browser.close();}
