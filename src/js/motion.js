import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { registerSectionScroll } from './scroll.js';

export function initMotion() {
  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
    const opening = gsap.timeline({defaults:{ease:'power3.out',clearProps:'all'}});
    opening.from('[data-hero-line]',{y:20,opacity:0,duration:.65,stagger:.1})
      .from('.hero-name,.hero-intro,.hero-actions',{y:12,opacity:0,duration:.5,stagger:.06},'-.4');
    gsap.from('[data-hero-portrait]',{y:20,opacity:0,duration:.75,ease:'power3.out',clearProps:'all'});
    document.querySelectorAll('[data-reveal-heading]').forEach(element=>gsap.from(element,{y:18,duration:.6,ease:'power3.out',clearProps:'all',scrollTrigger:{trigger:element,start:'top 95%',once:true}}));
    document.querySelectorAll('.concept-cover img').forEach(element=>gsap.from(element,{scale:1.025,duration:.7,ease:'power3.out',clearProps:'all',scrollTrigger:{trigger:element,start:'top 95%',once:true}}));
    gsap.from('.workflow-connection',{strokeDashoffset:1200,duration:1,ease:'none',scrollTrigger:{trigger:'#story',start:'top 80%',end:'bottom 60%',scrub:true}});
  });
  media.add('(prefers-reduced-motion: no-preference) and (pointer: fine) and (min-width: 761px)', () => {
    const lenis = new Lenis({autoRaf:false,anchors:{offset:-100}});
    const removeSectionScroll = registerSectionScroll(target=>{
      // Native focus/automation can move the page before Lenis receives scroll.
      // Measure the actual document position rather than its cached animation.
      const padding=parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)||0;
      const margin=parseFloat(getComputedStyle(target).scrollMarginTop)||0;
      lenis.scrollTo(target.getBoundingClientRect().top+window.scrollY-padding-margin);
    });
    lenis.on('scroll',ScrollTrigger.update);
    const tick = time => lenis.raf(time*1000);
    gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0);
    const syncOverlay = () => { if(document.querySelector('dialog[open]')||document.body.hasAttribute('data-menu-open'))lenis.stop();else lenis.start(); };
    document.addEventListener('portfolio:overlay',syncOverlay);syncOverlay();
    return () => {removeSectionScroll();document.removeEventListener('portfolio:overlay',syncOverlay);gsap.ticker.remove(tick);lenis.destroy();gsap.ticker.lagSmoothing(500,33);};
  });
  return () => media.revert();
}
