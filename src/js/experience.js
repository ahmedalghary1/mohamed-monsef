export function initExperience(){
 const controller=new AbortController(),options={signal:controller.signal};
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),ribbon=document.querySelector('[data-marquee]'),button=ribbon.querySelector('[data-marquee-toggle]');
 const ar=document.documentElement.lang==='ar';let paused=false,visible=false,frame=0;
 ribbon.classList.add('marquee-ready');
 const sync=()=>{ribbon.classList.toggle('is-running',!paused&&!reduced.matches&&visible&&!document.hidden);button.hidden=reduced.matches;button.setAttribute('aria-pressed',String(paused));button.textContent=paused?(ar?'تشغيل الحركة':'Resume movement'):(ar?'إيقاف الحركة':'Pause movement');};
 const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();});observer.observe(ribbon);
 button.addEventListener('click',()=>{paused=!paused;sync();},options);reduced.addEventListener('change',sync,options);document.addEventListener('visibilitychange',sync,options);sync();
 const progress=document.querySelector('[data-reading-progress]');
 const update=()=>{frame=0;const max=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${max>0?Math.min(1,Math.max(0,scrollY/max)):0})`;};
 const request=()=>{if(!frame)frame=requestAnimationFrame(update);};
 window.addEventListener('scroll',request,{...options,passive:true});window.addEventListener('resize',request,options);const resize=new ResizeObserver(request);resize.observe(document.body);update();
 return()=>{controller.abort();observer.disconnect();resize.disconnect();cancelAnimationFrame(frame);ribbon.classList.remove('marquee-ready','is-running');button.hidden=true;progress.style.removeProperty('transform');};
}
