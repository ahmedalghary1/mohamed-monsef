// Offline asset build: a silent six-second programmed composition, not generated video.
import { chromium } from 'playwright';
import { writeFile } from 'node:fs/promises';
const browser=await chromium.launch();
try{
 const page=await browser.newPage();await page.goto(process.env.ASSET_ORIGIN||'http://127.0.0.1:5173/');
 const encoded=await page.evaluate(async()=>{
  const image=new Image();image.src='/assets/images/concepts/bottle.webp';await image.decode();
  const canvas=document.createElement('canvas');canvas.width=960;canvas.height=640;const ctx=canvas.getContext('2d');
  const stream=canvas.captureStream(30);const recorder=new MediaRecorder(stream,{mimeType:'video/webm;codecs=vp9',videoBitsPerSecond:1200000});const chunks=[];
  const done=new Promise(resolve=>{recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};recorder.onstop=resolve;});
  const draw=t=>{const scale=1.02+.05*Math.sin(t*Math.PI);ctx.save();ctx.translate(480,320);ctx.scale(scale,scale);ctx.drawImage(image,-480,-320,960,640);ctx.restore();ctx.strokeStyle='rgba(232,245,247,.65)';ctx.lineWidth=1;const inset=36+8*Math.sin(t*Math.PI*2);const length=48+32*t;for(const [x,y,sx,sy] of [[inset,inset,1,1],[960-inset,inset,-1,1],[inset,640-inset,1,-1],[960-inset,640-inset,-1,-1]]){ctx.beginPath();ctx.moveTo(x,y+sy*length);ctx.lineTo(x,y);ctx.lineTo(x+sx*length,y);ctx.stroke();}};
  draw(0);recorder.start();const start=performance.now();await new Promise(resolve=>{const frame=now=>{const t=Math.min(1,(now-start)/6000);draw(t);if(t<1)requestAnimationFrame(frame);else resolve();};requestAnimationFrame(frame);});recorder.stop();await done;stream.getTracks().forEach(track=>track.stop());
  const buffer=await new Blob(chunks,{type:'video/webm'}).arrayBuffer();let binary='';for(const byte of new Uint8Array(buffer))binary+=String.fromCharCode(byte);return btoa(binary);
 });
 await writeFile('public/assets/videos/still-form.webm',Buffer.from(encoded,'base64'));console.log('Saved six-second silent motion study.');
}finally{await browser.close();}
