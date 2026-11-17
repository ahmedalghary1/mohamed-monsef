import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
const browser=await chromium.launch();let failed=false;
for(const route of ['/','/ar/']) { const context=await browser.newContext({reducedMotion:'reduce'});const page=await context.newPage();await page.goto('http://127.0.0.1:4173'+route);const r=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();console.log(route,JSON.stringify(r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))));failed ||= r.violations.length>0;await context.close(); }
await browser.close();if(failed)process.exitCode=1;
