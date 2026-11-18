export function initExperience() {
  const controller = new AbortController();
  const progress = document.querySelector('[data-reading-progress]');
  let frame = 0;
  const update = () => {
    frame = 0;
    const max = document.documentElement.scrollHeight-innerHeight;
    progress.style.transform = `scaleX(${max>0?Math.min(1,Math.max(0,scrollY/max)):0})`;
  };
  const request = () => { if(!frame) frame=requestAnimationFrame(update); };
  window.addEventListener('scroll',request,{signal:controller.signal,passive:true});
  window.addEventListener('resize',request,{signal:controller.signal});
  const resize=new ResizeObserver(request);resize.observe(document.body);update();
  return () => {controller.abort();resize.disconnect();cancelAnimationFrame(frame);progress.style.removeProperty('transform');};
}
