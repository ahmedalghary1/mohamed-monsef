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
 assert.equal(await page.locator('.floating-whatsapp,.contact-channel').count(),0);
 assert.equal(await page.locator('.service-accordion').count(),4);
 await page.locator('.service-accordion').nth(1).locator('summary').click();assert.notEqual(await page.locator('.service-accordion').nth(1).getAttribute('open'),null);
 for(const width of [1440,768,390]){
  await page.setViewportSize({width,height:1000});await settleImages(page);await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
  await page.screenshot({path:`docs/refinement-${lang}-${width}.png`,fullPage:true});
 }
}
assert.deepEqual(errors,[]);console.log('PASS: localized contact URL generation, invalid/missing channel gating, six-stage selection, service accordions, EN/AR desktop/tablet/mobile captures and no console errors.');
}finally{await browser.close();}
