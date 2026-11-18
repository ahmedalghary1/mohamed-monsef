import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { siteConfig } from '../src/data/site-config.js';

for(const locale of ['en','ar']) {
  const path=locale==='ar'?'dist/ar/index.html':'dist/index.html';
  const html=await readFile(path,'utf8');
  assert(html.includes(`lang="${locale}"`));
  assert(html.includes(siteConfig.preview?'noindex, nofollow':'index, follow'));
  if(siteConfig.domain){
    const url=siteConfig.domain+(locale==='ar'?'/ar/':'/');
    for(const marker of [`rel="canonical" href="${url}"`,'hreflang="ar"','hreflang="en"','og:image','WebSite','social-preview.png'])assert(html.includes(marker),`${path} missing ${marker}`);
  }
  assert(!html.includes('mailto:'));assert(!html.includes('Mohamed Monsef (2).pdf'));
}
if(siteConfig.domain){
  const sitemap=await readFile('dist/sitemap.xml','utf8');
  assert(sitemap.includes(siteConfig.domain+'/ar/'));
}
await Promise.all(['social-preview.png','monogram.svg'].map(name=>access('dist/assets/brand/'+name)));
await access('dist/assets/videos/still-form.mp4');await access('dist/assets/videos/still-form.webm');
console.log('PASS: locale metadata, canonical/hreflang/OG/schema/sitemap, real brand/media assets and preview contact/CV gates.');
