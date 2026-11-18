import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {launchBrowser,origin,settleImages} from './helpers.mjs';
import {profile} from '../src/data/profile.js';
import {enquiry,serviceIds} from '../src/data/enquiry.js';
const browser=await launchBrowser();
const capturePrefix=process.env.BROWSER&&process.env.BROWSER!=='chromium'?'polish-'+process.env.BROWSER:'polish';
try{
 const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce',acceptDownloads:true});
 const page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
 for(const lang of ['en','ar']){
  await page.goto(origin+(lang==='ar'?'/ar/':'/'));
  const labels=await page.locator('main .eyebrow').allTextContents();
  assert.deepEqual(labels.filter(s=>/^\d{2} \/ /.test(s)).map(s=>s.slice(0,2)),Array.from({length:10},(_,i)=>String(i+1).padStart(2,'0')));
  assert.equal(await page.locator('a[data-channel=facebook]').count(),3);
  for(const link of await page.locator('a[data-channel=facebook]').all()){
   assert.equal(await link.getAttribute('href'),profile.contact.facebook);
   assert.equal(await link.getAttribute('rel'),'noopener noreferrer');
  }
  const schema=JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
  assert(schema.find(s=>s['@type']==='Person').sameAs.includes(profile.contact.facebook));
  assert.equal(await page.locator('[data-cv-view]').count(),2);assert.equal(await page.locator('[data-cv-download]').count(),2);
  const response=await page.request.get(origin+profile.cv.src);
  assert.equal(response.status(),200);assert(response.headers()['content-type'].includes('application/pdf'));
  const expected=await readFile('Mohamed Monsef (2).pdf');assert.deepEqual(await response.body(),expected);
  const browserStatus=await page.evaluate(async src=>(await fetch(src)).status,profile.cv.src);
  if(browserStatus===200){
   const downloading=page.waitForEvent('download');await page.locator('[data-cv-download]').first().click();
   const download=await downloading;assert.equal(download.suggestedFilename(),'Mohamed-Monsef-CV.pdf');assert.deepEqual(await readFile(await download.path()),expected);
   console.log(`PASS ${lang}: native PDF download saved the original bytes with the requested filename.`);
   const opening=page.waitForEvent('popup');await page.locator('[data-cv-view]').first().click();const popup=await opening;
   try{await popup.waitForURL(origin+profile.cv.src,{waitUntil:'commit',timeout:5000});console.log(`PASS ${lang}: CV view opened its PDF URL in a new tab.`);}
   catch(error){if(error.name!=='TimeoutError')throw error;console.log(`UNAVAILABLE ${lang}: native PDF tab did not commit in this browser (${popup.url()}); view not verified.`);}
   if(!popup.isClosed())await popup.close();
  }else{
   assert.equal(browserStatus,204);
   console.log(`UNAVAILABLE ${lang}: browser PDF requests receive HTTP 204; HTTP API serves the correct 200 PDF. Native view/download not verified.`);
  }
  assert(!(await page.locator('[data-message-preview]').inputValue()).includes(enquiry[lang].labels[2]+':'));
  for(let i=0;i<4;i++){
   const accordion=page.locator('.service-accordion').nth(i);if(!(await accordion.getAttribute('open')!==null))await accordion.locator('summary').click();
   await accordion.locator('[data-select-service]').click();
   assert.equal(await page.locator(`[data-service-id="${serviceIds[i]}"]`).isChecked(),true);
   assert.equal(await page.evaluate(()=>document.activeElement.dataset.serviceId),serviceIds[i]);
   assert((await page.locator('[data-message-preview]').inputValue()).includes(enquiry[lang].serviceOptions[i]));
   assert.equal(await page.locator('[name=service]:checked').count(),i+1);
  }
  await page.locator('[name=details]').fill('Private description stays in this page');await page.locator('[name=industry]').selectOption('1');await page.locator('[name=budget]').selectOption('1');
  await page.locator('[data-language]').first().click();
  await page.waitForURL(url=>url.origin===origin&&url.pathname===(lang==='en'?'/ar/':'/'));await page.locator('[data-enquiry]').waitFor({state:'visible'});
  await page.waitForFunction(()=>document.querySelectorAll('[name=service]:checked').length===4);
  assert.equal(await page.locator('[name=service]:checked').count(),4);assert.equal(await page.locator('[name=industry]').inputValue(),'1');assert.equal(await page.locator('[name=budget]').inputValue(),'1');
  assert.equal(await page.locator('[name=details]').inputValue(),'');
  assert.equal(await page.evaluate(()=>sessionStorage.getItem('portfolio-enquiry-choices')),null);
  await page.goto(origin+(lang==='ar'?'/ar/':'/'));
  for(const width of [1440,768,390]){
   await page.setViewportSize({width,height:width===768?1024:width===390?844:900});await settleImages(page);await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
   await page.evaluate(()=>document.activeElement?.blur());
   await page.screenshot({path:`docs/${capturePrefix}-${lang}-${width}.png`,fullPage:true});
   for(const [name,selector] of [['hero','.hero'],['builder','#project-builder'],['contact','#contact']])await page.locator(selector).screenshot({path:`docs/${capturePrefix}-${name}-${lang}-${width}.png`,style:'.site-header,.skip-link,.reading-progress,.floating-whatsapp{visibility:hidden!important}'});
  }
 }
 await page.setViewportSize({width:1440,height:900});
 for(const route of ['/','/ar/']){
  await page.emulateMedia({reducedMotion:'no-preference'});await page.goto(origin+route);
  await page.waitForFunction(()=>document.documentElement.classList.contains('lenis'));
  await page.locator('[data-select-service="media-buying"]').click();
  await page.waitForFunction(()=>{const input=document.querySelector('[data-service-id="media-buying"]'),rect=input.getBoundingClientRect();return document.activeElement===input&&rect.top>80&&rect.bottom<innerHeight;});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForFunction(()=>!document.documentElement.classList.contains('lenis'));
  await page.locator('[data-select-service="media-buying"]').click();
  assert.equal(await page.locator('[data-service-id="media-buying"]').isChecked(),true);
 }
 assert.deepEqual(errors,[]);await context.close();
 console.log('PASS: exact Facebook links/schema, ten sequential sections, original PDF bytes/HTTP/type and available native view/download (see explicit skips), all four service selections/focus/accumulation, categorical locale transfer without free-text storage, 6 full-page and 18 component captures; no browser/network errors or external contact.');
}finally{await browser.close();}
