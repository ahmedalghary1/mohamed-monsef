import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { launchBrowser,origin,settleImages } from './helpers.mjs';
import { renderComparison } from '../scripts/comparison-template.mjs';
import { enquiry } from '../src/data/enquiry.js';
const browser=await launchBrowser();try{
 const page=await browser.newPage({reducedMotion:'reduce'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 for(const lang of ['en','ar']){
  await page.goto(origin+(lang==='ar'?'/ar/':'/'));
  await page.locator('[data-copy-message]').click();assert.equal(await page.locator('[data-enquiry-status]').textContent(),enquiry[lang].validation);
  await page.locator('[name=service]').nth(0).check();await page.locator('[name=service]').nth(2).check();await page.locator('[name=industry]').selectOption('1');
  await page.locator('[name=details]').fill('<script>literal enquiry</script> & product launch');
  const preview=await page.locator('[data-message-preview]').inputValue();assert(preview.includes(enquiry[lang].serviceOptions[2]));assert(preview.includes('<script>literal enquiry</script>'));
  await page.evaluate(()=>{window.open=(url)=>{window.testDestination=url;return null;};Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.testCopied=text;}}});});
  await page.locator('[data-enquiry] button[type=submit]').click();const url=new URL(await page.evaluate(()=>window.testDestination));assert.equal(url.pathname,'/201026671903');assert.equal(url.searchParams.get('text'),preview);
  await page.locator('[data-copy-message]').click();await page.waitForFunction(()=>Boolean(window.testCopied));assert.equal(await page.evaluate(()=>window.testCopied),preview);
  assert.equal(await page.locator('[data-comparison]').count(),0);
  await page.locator('[data-enquiry]').evaluate(f=>{f.reset();f.dispatchEvent(new Event('input',{bubbles:true}));});
  for(const width of [1440,768,390]){await page.setViewportSize({width,height:1000});await settleImages(page);await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.screenshot({path:`docs/final-${lang}-${width}.png`,fullPage:true});await page.screenshot({path:`docs/final-hero-${lang}-${width}.png`});}
  await page.goto(origin+(lang==='ar'?'/ar/':'/')+'#project=concept-still-form');await page.locator('[data-dialog="concept-still-form"]').waitFor({state:'visible'});await page.reload();await page.locator('[data-dialog="concept-still-form"]').waitFor({state:'visible'});await page.keyboard.press('Escape');
  await page.goto(origin+(lang==='ar'?'/ar/404.html':'/404.html'));assert.equal(await page.locator('h1').textContent(),'404');assert.equal(await page.locator('html').getAttribute('lang'),lang);
 }
 // Synthetic range fixture stays out of production; no invented comparison is published.
 const image={src:'/assets/images/concepts/bottle.webp',alt:{en:'Test image',ar:'صورة اختبار'}};
 assert.equal(renderComparison({before:image,after:image},'en','fixture',s=>origin+s),'');
 await page.setContent('<html lang="en"><head><link rel="icon" href="'+origin+'/favicon.svg"></head><body>'+renderComparison({permissionConfirmed:true,before:image,after:image,width:1280,height:853},'en','fixture',s=>origin+s)+'</body></html>');
 await page.addStyleTag({path:'src/styles/final.css'});await page.addScriptTag({content:(await readFile('src/js/comparison.js','utf8')).replace('export function','function')+';initComparisons();'});
 await page.locator('[data-comparison-range]').focus();await page.keyboard.press('ArrowRight');assert.equal(await page.locator('[data-comparison-range]').inputValue(),'51');assert.equal(await page.locator('.comparison-images').evaluate(e=>e.style.getPropertyValue('--comparison-position')),'51%');
 assert.deepEqual(errors,[]);console.log('PASS: bilingual builder validation/preview/copy/encoded WhatsApp without external navigation, shared dialog URLs/reload, native comparison keyboard and permission gate, localized 404 and six visual captures.');
}finally{await browser.close();}
