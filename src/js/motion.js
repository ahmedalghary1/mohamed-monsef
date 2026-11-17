import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
export function initMotion(){
 gsap.registerPlugin(ScrollTrigger);const media=gsap.matchMedia();
 media.add('(prefers-reduced-motion: no-preference)',()=>{
  const opening=gsap.timeline({defaults:{ease:'power3.out',clearProps:'all'}});
  opening.from('[data-hero-line]',{y:24,opacity:0,duration:.8,stagger:.12}).from('.hero-intro,.hero-body,.hero-actions,.scroll-cue',{y:12,opacity:0,duration:.55,stagger:.07},'-.45');
  gsap.from('.hero-art',{scale:.94,opacity:0,duration:1.1,ease:'power3.out',clearProps:'all'});
  gsap.to('.hero-art',{y:-20,rotation:-3,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:.6}});
  document.querySelectorAll('[data-reveal-heading]').forEach(el=>gsap.from(el,{y:18,opacity:.2,duration:.65,ease:'power3.out',clearProps:'all',scrollTrigger:{trigger:el,start:'top 92%',once:true}}));
  document.querySelectorAll('.concept-cover').forEach(el=>gsap.from(el,{clipPath:'inset(0% 0% 12% 0%)',y:20,duration:.8,ease:'power3.out',clearProps:'all',scrollTrigger:{trigger:el,start:'top 92%',once:true}}));
 });
 media.add('(prefers-reduced-motion: no-preference) and (min-width: 761px)',()=>{
  const story=document.querySelector('[data-story]'),diagrams=gsap.utils.toArray('[data-diagram]'),counter=document.querySelector('[data-story-counter]'),steps=[...document.querySelectorAll('[data-story-step]')];
  const setStage=index=>{steps.forEach((step,i)=>step.toggleAttribute('data-active',i===index));gsap.to(diagrams,{opacity:i=>i===index?1:0,scale:i=>i===index?1:.96,duration:.35,overwrite:true,ease:'power2.out'});counter.textContent=`0${index+1} / 04`;};
  steps.forEach((step,i)=>ScrollTrigger.create({trigger:step,start:'top 55%',end:'bottom 55%',onEnter:()=>setStage(i),onEnterBack:()=>setStage(i)}));
  gsap.to('[data-story-progress]',{scaleX:1,ease:'none',scrollTrigger:{trigger:story,start:'top 50%',end:'bottom 70%',scrub:true}});
  return()=>{steps.forEach(step=>step.removeAttribute('data-active'));counter.textContent='01 / 04';};
 });
 media.add('(prefers-reduced-motion: no-preference) and (pointer: fine) and (min-width: 761px)',()=>{
  const lenis=new Lenis({autoRaf:false,anchors:{offset:-100}});lenis.on('scroll',ScrollTrigger.update);const tick=time=>lenis.raf(time*1000);gsap.ticker.add(tick);gsap.ticker.lagSmoothing(0);
  return()=>{gsap.ticker.remove(tick);lenis.destroy();gsap.ticker.lagSmoothing(500,33);};
 });
 return()=>media.revert();
}
