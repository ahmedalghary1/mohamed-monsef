import AxeBuilder from '@axe-core/playwright';
import { writeFile } from 'node:fs/promises';
import { launchBrowser, origin } from '../tests/helpers.mjs';
const browser=await launchBrowser(),report=[];
try{
  for(const route of ['/','/ar/'])for(const width of [1440,390])for(const reducedMotion of ['reduce','no-preference']){
    const context=await browser.newContext({reducedMotion,viewport:{width,height:1000}}),page=await context.newPage();
    await page.goto(origin+route);
    await page.waitForTimeout(1000);
    const states=['page',...(width===390?['menu']:[]),'dialog'];
    for(const state of states){
      if(state==='menu')await page.locator('[data-menu-toggle]').click();
      if(state==='dialog'){if(width===390)await page.keyboard.press('Escape');await page.locator('[data-open-project]').first().click();}
      const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
      const entry={route,width,reducedMotion,state,violations:result.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),incomplete:result.incomplete.map(v=>v.id)};
      report.push(entry);console.log(route,width,state,JSON.stringify(entry.violations));
    }
    await context.close();
  }
  await writeFile('docs/redesign-axe.json',JSON.stringify({browser:browser.version(),report},null,2));
  if(report.some(entry=>entry.violations.length))process.exitCode=1;
}finally{await browser.close();}
