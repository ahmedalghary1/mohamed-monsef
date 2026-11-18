export function initGallery() {
  const cleanups = [...document.querySelectorAll('[data-gallery]')].map(initGalleryRoot);
  return () => cleanups.forEach(cleanup => cleanup());
}

function initGalleryRoot(root) {
  const controller = new AbortController(), options = { signal: controller.signal };
  const dialogs = [...root.querySelectorAll('dialog')];
  const filters = root.querySelector('.filters'), status = root.querySelector('[data-results]');
  const mediaTimers = new Map();
  let sessionOpener = null;
  let returnHash = '';
  const notifyOverlay = () => {
    document.body.toggleAttribute('data-dialog-open', Boolean(document.querySelector('dialog[open]')));
    document.dispatchEvent(new Event('portfolio:overlay'));
  };
  function updateMedia(dialog) {
    const message = dialog.querySelector('[data-media-status]');
    if (!message) return;
    const images = [...dialog.querySelectorAll('img')];
    const failed = images.some(image => image.complete && image.naturalWidth === 0);
    const loading = images.some(image => !image.complete);
    message.hidden = !failed && !loading;
    message.textContent = failed ? message.dataset.error : message.dataset.loading;
  }
  function showDialog(dialog, opener) {
    if (!dialog) return;
    if (opener) {sessionOpener = opener;if(!location.hash.startsWith('#project='))returnHash=location.hash;}
    document.querySelectorAll('video').forEach(video => video.pause());
    dialogs.forEach(other => { if (other.open) other.close(); });
    dialog.showModal(); dialog.scrollTop = 0; updateMedia(dialog); notifyOverlay();
    history.replaceState(null,'',location.pathname+location.search+'#project='+encodeURIComponent(dialog.dataset.dialog));
  }
  function navigate(dialog, direction) {
    const available = dialogs.filter(candidate => {
      const project = candidate.closest('[data-project]');
      return !project || !project.hidden;
    });
    if (available.length > 1) showDialog(available[(available.indexOf(dialog)+direction+available.length)%available.length]);
  }
  if (filters) filters.hidden = false;
  if (status) status.hidden = false;
  function applyFilter(value) {
    root.querySelectorAll('[data-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter===value)));
    let count=0;
    root.querySelectorAll('[data-project]').forEach(project => {
      project.hidden = value!=='all' && !project.dataset.type.split(' ').includes(value);
      if (!project.hidden) count++;
    });
    if (status) status.textContent = `${count} ${status.dataset.resultLabel || (document.documentElement.lang==='ar'?'مشروعات معروضة':'projects shown')}`;
    root.querySelectorAll('.dialog-navigation').forEach(navigation=>{navigation.hidden=count<2;});
  }
  if (filters) applyFilter('all');
  root.addEventListener('click', event => {
    const filter = event.target.closest('[data-filter]');
    if (filter) applyFilter(filter.dataset.filter);
    const opener = event.target.closest('[data-open-project]');
    if (opener) { const dialog=dialogs.find(candidate=>candidate.dataset.dialog===opener.dataset.openProject); if(dialog){event.preventDefault();showDialog(dialog,opener);} }
    const dialog=event.target.closest('dialog');
    if (!dialog) return;
    if (event.target.closest('[data-close]')) dialog.close();
    if (event.target.closest('[data-previous]')) navigate(dialog,-1);
    if (event.target.closest('[data-next]')) navigate(dialog,1);
  }, options);
  dialogs.forEach(dialog => {
    dialog.addEventListener('close', () => {
      dialog.querySelectorAll('video').forEach(video=>{video.pause();clearTimeout(mediaTimers.get(video));mediaTimers.delete(video);});
      notifyOverlay();
      if (!dialogs.some(other=>other.open)) {
        if(location.hash==='#project='+encodeURIComponent(dialog.dataset.dialog))history.replaceState(null,'',location.pathname+location.search+returnHash);
        if(sessionOpener?.isConnected)sessionOpener.focus({preventScroll:true});
      }
    }, options);
    dialog.addEventListener('keydown', event => {
      if (event.target.closest('video')) return;
      if (event.key==='ArrowRight' || event.key==='ArrowLeft') { event.preventDefault(); const rtl=document.documentElement.dir==='rtl';navigate(dialog,(event.key==='ArrowRight')!==rtl?1:-1); }
    }, options);
    dialog.querySelectorAll('img').forEach(image => {
      image.addEventListener('load',()=>updateMedia(dialog),options);
      image.addEventListener('error',()=>updateMedia(dialog),options);
    });
    dialog.querySelectorAll('video').forEach(video => {
      const sources = [...video.querySelectorAll('source')], failedSources = new Set();
      const setVideoMessage = state => {
        const message=dialog.querySelector('[data-media-status]');
        if(message){message.hidden=!state;message.textContent=state==='error'?message.dataset.error:message.dataset.loading;}
      };
      const clearMediaTimer = () => {clearTimeout(mediaTimers.get(video));mediaTimers.delete(video);};
      video.addEventListener('play',()=>document.querySelectorAll('video').forEach(other=>{if(other!==video)other.pause();}),options);
      video.addEventListener('error',()=>{clearMediaTimer();setVideoMessage('error');},options);
      video.addEventListener('loadstart',()=>{
        clearMediaTimer();setVideoMessage('loading');
        mediaTimers.set(video,setTimeout(()=>{
          mediaTimers.delete(video);
          if(video.readyState<2){const message=dialog.querySelector('[data-media-status]');if(message){message.hidden=false;message.textContent=message.dataset.timeout;}}
        },8000));
      },options);
      video.addEventListener('loadeddata',()=>{clearMediaTimer();setVideoMessage(null);},options);
      video.addEventListener('playing',()=>{clearMediaTimer();setVideoMessage(null);},options);
      sources.forEach(source=>source.addEventListener('error',()=>{failedSources.add(source);if(failedSources.size===sources.length)setVideoMessage('error');},options));
    });
    if (dialogs.length===1) dialog.querySelector('.dialog-navigation')?.setAttribute('hidden','');
  });
  const openFromHash=()=>{if(!location.hash.startsWith('#project='))return;let id;try{id=decodeURIComponent(location.hash.slice(9));}catch{return;}const dialog=dialogs.find(d=>d.dataset.dialog===id);if(dialog&&!dialog.open){const opener=[...root.querySelectorAll('[data-open-project]')].find(a=>a.dataset.openProject===id);showDialog(dialog,opener);}};
  window.addEventListener('hashchange',openFromHash,options);openFromHash();
  return () => {
    mediaTimers.forEach(timer=>clearTimeout(timer));mediaTimers.clear();
    controller.abort(); dialogs.forEach(dialog=>{dialog.querySelectorAll('video').forEach(video=>video.pause());if(dialog.open)dialog.close();});
    notifyOverlay(); if(filters)filters.hidden=true; if(status)status.hidden=true;
    root.querySelectorAll('[data-project]').forEach(project=>{project.hidden=false;});
  };
}
