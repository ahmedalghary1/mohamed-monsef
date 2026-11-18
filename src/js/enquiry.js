import { enquiry, buildEnquiry, serviceIds } from '../data/enquiry.js';

import { scrollToSection } from './scroll.js';

export function initEnquiry(){
 const form=document.querySelector('[data-enquiry]');
 if(!form)return()=>{};
 const c=enquiry[document.documentElement.lang],controller=new AbortController(),opts={signal:controller.signal};
 const preview=form.querySelector('[data-message-preview]'),status=form.querySelector('[data-enquiry-status]');
 const choices=[...form.querySelectorAll('[name=service]')];
 const optional=(name,items)=>form.elements[name].value===''?undefined:items[Number(form.elements[name].value)];
 const values=()=>({services:choices.filter(i=>i.checked).map(i=>c.serviceOptions[Number(i.value)]),industry:optional('industry',c.industries),budget:optional('budget',c.budgets),details:form.elements.details.value});
 const update=()=>{preview.value=buildEnquiry(c,values());status.textContent='';};
 const valid=()=>{
  const v=values();
  if(!v.services.length||!v.details.trim()){status.textContent=c.validation;(!v.services.length?choices[0]:form.elements.details).focus();return false;}
  return form.reportValidity();
 };
 form.hidden=false;
 // Carry only categorical choices across a deliberate locale navigation, once.
 // Free text and the generated enquiry are never persisted.
 const transferKey='portfolio-enquiry-choices';
 try{
  const saved=JSON.parse(sessionStorage.getItem(transferKey)||'null');sessionStorage.removeItem(transferKey);
  if(saved?.expires>Date.now()&&saved.expires<Date.now()+301000){
   choices.forEach(input=>{input.checked=Array.isArray(saved.services)&&saved.services.includes(input.dataset.serviceId);});
   for(const name of ['industry','budget'])if([...form.elements[name].options].some(option=>option.value===saved[name]))form.elements[name].value=saved[name];
  }
 }catch{ /* Storage is optional; normal input works without it. */ }
 document.querySelectorAll('[data-language], [data-language-menu]').forEach(link=>link.addEventListener('click',()=>{
  try{sessionStorage.setItem(transferKey,JSON.stringify({services:choices.filter(i=>i.checked).map(i=>i.dataset.serviceId),industry:form.elements.industry.value,budget:form.elements.budget.value,expires:Date.now()+300000}));}catch{ /* No persistence required. */ }
 },opts));
 document.addEventListener('click',event=>{
  const trigger=event.target.closest('[data-select-service]');
  if(!trigger||!serviceIds.includes(trigger.dataset.selectService))return;
  event.preventDefault();
  // Lenis also handles anchors on window; this action owns its navigation.
  event.stopPropagation();
  const input=choices.find(choice=>choice.dataset.serviceId===trigger.dataset.selectService);
  input.checked=true;update();status.textContent=c.selected;
  if(location.hash!=='#project-builder')history.pushState(null,'',location.pathname+location.search+'#project-builder');
  scrollToSection(form.closest('section'));
  input.focus({preventScroll:true});
 },opts);
 form.addEventListener('input',update,opts);form.addEventListener('change',update,opts);
 form.addEventListener('reset',()=>queueMicrotask(update),opts);
 form.addEventListener('submit',event=>{
  event.preventDefault();if(!valid()||!/^[1-9]\d{7,14}$/.test(form.dataset.phone))return;
  window.open(`https://wa.me/${form.dataset.phone}?text=${encodeURIComponent(preview.value)}`,'_blank','noopener,noreferrer');
 },opts);
 form.querySelector('[data-copy-message]').addEventListener('click',async()=>{
  if(!valid())return;
  try{await navigator.clipboard.writeText(preview.value);status.textContent=c.copied;}
  catch{preview.focus();preview.select();status.textContent=c.copyFallback;}
 },opts);
 update();return()=>{controller.abort();form.reset();preview.value='';form.hidden=true;};
}
