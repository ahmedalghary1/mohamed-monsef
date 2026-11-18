import lighthouse from 'lighthouse';
import { writeFile } from 'node:fs/promises';
import { launchBrowser, origin } from '../tests/helpers.mjs';

// Playwright owns browser teardown; Lighthouse connects to its local CDP port.
const prefix=process.env.REPORT_PREFIX||'redesign';
if(!/^[a-z0-9-]+$/.test(prefix))throw Error('Invalid report prefix');
const browser=await launchBrowser({args:['--remote-debugging-port=9223']});
const summary=[];
try {
  for(const locale of ['en','ar']) {
    const {lhr,report}=await lighthouse(origin+(locale==='ar'?'/ar/':'/'),{port:9223,output:'json',onlyCategories:['performance','accessibility','best-practices','seo'],maxWaitForLoad:30000});
    await writeFile(`docs/lighthouse-${prefix}-${locale}.json`,report);
    const row={locale,version:lhr.lighthouseVersion,browser:browser.version(),fetchTime:lhr.fetchTime,categories:Object.fromEntries(Object.entries(lhr.categories).map(([key,value])=>[key,Math.round(value.score*100)])),metrics:Object.fromEntries(['first-contentful-paint','largest-contentful-paint','cumulative-layout-shift','total-blocking-time','speed-index','total-byte-weight'].map(key=>[key,{value:lhr.audits[key].numericValue,display:lhr.audits[key].displayValue}])),environment:lhr.environment,config:lhr.configSettings};
    summary.push(row);console.log(JSON.stringify(row,null,2));
  }
  await writeFile(`docs/${prefix}-performance.json`,JSON.stringify(summary,null,2));
} finally {await browser.close();}
