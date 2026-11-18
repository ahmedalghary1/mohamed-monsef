import assert from 'node:assert/strict';
import { spawn, execFileSync } from 'node:child_process';
import { launchBrowser } from './helpers.mjs';

const taskEnv={...process.env,SITE_BASE:'/portfolio/'};
const runBuild=env=>{
  execFileSync(process.execPath,['scripts/generate.mjs'],{env,stdio:'pipe'});
  execFileSync(process.execPath,['node_modules/vite/bin/vite.js','build'],{env,stdio:'pipe'});
};
let server,browser;
try{
  runBuild(taskEnv);
  server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4174'],{env:taskEnv,stdio:'pipe',windowsHide:true});
  await new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>reject(Error('Base-path preview did not start')),15000);
    server.stdout.on('data',data=>{if(data.toString().includes('4174')){clearTimeout(timer);resolve();}});
    server.once('error',reject);
  });
  browser=await launchBrowser();
  const page=await browser.newPage({reducedMotion:'reduce',viewport:{width:390,height:844}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));page.on('response',response=>{if(response.status()>=400)errors.push(response.status()+' '+response.url());});
  for(const route of ['/portfolio/','/portfolio/ar/']){
    const response=await page.goto('http://127.0.0.1:4174'+route);assert.equal(response.status(),200);
    assert.equal(await page.locator('.portrait-frame img').evaluate(image=>image.naturalWidth>0),true);
    await page.locator('[data-language]').first().click();assert(new URL(page.url()).pathname.startsWith('/portfolio/'));
    assert.equal(await page.locator('h1').count(),1);
  }
  assert.deepEqual(errors,[]);console.log('PASS: /portfolio/ and /portfolio/ar/ direct requests, assets and language links.');
}finally{
  if(browser)await browser.close();if(server)server.kill();
  const rootEnv={...process.env,SITE_BASE:'/'};runBuild(rootEnv);
  console.log('Restored root-path generated HTML and production build.');
}
