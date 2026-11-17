export function initGallery(){
 const cleanups=[...document.querySelectorAll('[data-gallery]')].map(initGalleryRoot);
 return()=>cleanups.forEach(fn=>fn());
}
function initGalleryRoot(root){

 const controller=new AbortController(),options={signal:controller.signal};
 root.addEventListener('click',e=>{
 const filter=e.target.closest('[data-filter]');if(filter){let count=0;root.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===filter)));root.querySelectorAll('[data-project]').forEach(p=>{p.hidden=filter.dataset.filter!=='all'&&filter.dataset.filter!==p.dataset.type;if(!p.hidden)count++;});const status=root.querySelector('[data-results]');status.textContent=`${count} ${document.documentElement.lang==='ar'?'مشروع معروض':'projects shown'}`;}
 const opener=e.target.closest('[data-open-project]');if(opener){const dialog=[...root.querySelectorAll('dialog')].find(d=>d.dataset.dialog===opener.dataset.openProject);if(dialog){e.preventDefault();root.querySelectorAll('video').forEach(v=>v.pause());dialog.showModal();}}
 if(e.target.closest('[data-close]'))e.target.closest('dialog').close();
 },options);
 root.querySelectorAll('dialog').forEach(d=>{
 d.addEventListener('close',()=>d.querySelectorAll('video').forEach(v=>v.pause()),options);
 d.querySelectorAll('video').forEach(video=>video.addEventListener('play',()=>{document.querySelectorAll('video').forEach(other=>{if(other!==video)other.pause();});},options));
 });
 return()=>{root.querySelectorAll('dialog[open]').forEach(d=>d.close());controller.abort();};
}
