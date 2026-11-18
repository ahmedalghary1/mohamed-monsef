export function initWorkflow(){
 const root=document.querySelector('[data-workflow]');if(!root)return()=>{};
 const controller=new AbortController(),buttons=[...root.querySelectorAll('[data-stage]')],nodes=[...root.querySelectorAll('[data-stage-node]')];
 const select=index=>{buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));nodes.forEach((n,i)=>n.toggleAttribute('data-active',i===index));root.querySelector('[data-stage-title]').textContent=buttons[index].querySelector('strong').textContent;root.querySelector('[data-stage-description]').textContent=buttons[index].querySelector('span:last-child').textContent;};
 buttons.forEach((b,i)=>{b.disabled=false;b.addEventListener('click',()=>select(i),{signal:controller.signal});});
 select(0);root.setAttribute('data-enhanced','');
 const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting)select(Number(entry.target.dataset.stage));},{rootMargin:'-25% 0px -45% 0px'});
 buttons.forEach(b=>observer.observe(b));
 return()=>{controller.abort();observer.disconnect();root.removeAttribute('data-enhanced');buttons.forEach(b=>{b.disabled=true;});};
}
