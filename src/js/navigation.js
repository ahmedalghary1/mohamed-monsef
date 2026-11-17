export function initNavigation(){
 const toggle=document.querySelector('[data-menu-toggle]'),nav=document.querySelector('#navigation'),small=matchMedia('(max-width:760px)'),controller=new AbortController(),options={signal:controller.signal};
 const setOpen=open=>{toggle.setAttribute('aria-expanded',String(open));nav.toggleAttribute('data-collapsed',small.matches&&!open);};
 toggle.hidden=false;setOpen(false);
 toggle.addEventListener('click',()=>setOpen(toggle.getAttribute('aria-expanded')!=='true'),options);
 nav.addEventListener('click',e=>{if(e.target.closest('a')){setOpen(false);if(small.matches)toggle.focus();}},options);
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true'){setOpen(false);toggle.focus();}},options);
 small.addEventListener('change',()=>setOpen(false),options);
 const language=document.querySelector('[data-language]');language.addEventListener('click',()=>{language.hash=location.hash;},options);
 const links=[...document.querySelectorAll('[data-nav]')];
 const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){const target=entry.target.id==='creative-lab'?'work':entry.target.id==='story'?'services':entry.target.id;links.forEach(a=>{if(a.hash===`#${target}`)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}},{rootMargin:'-15% 0px -55% 0px'});
 links.forEach(a=>observer.observe(document.querySelector(a.hash)));
 ['creative-lab','story'].forEach(id=>{const el=document.getElementById(id);if(el)observer.observe(el);});
 return()=>{controller.abort();observer.disconnect();toggle.hidden=true;nav.removeAttribute('data-collapsed');};
}
