import { enquiry,buildEnquiry } from '../data/enquiry.js';
export function initEnquiry(){const form=document.querySelector('[data-enquiry]');if(!form)return()=>{};
 const c=enquiry[document.documentElement.lang],controller=new AbortController(),opts={signal:controller.signal},preview=form.querySelector('[data-message-preview]'),status=form.querySelector('[data-enquiry-status]');
 form.hidden=false;
 const values=()=>({services:[...form.querySelectorAll('[name=service]:checked')].map(i=>c.serviceOptions[Number(i.value)]),industry:c.industries[Number(form.elements.industry.value)],budget:c.budgets[Number(form.elements.budget.value)],details:form.elements.details.value});
 const update=()=>{preview.value=buildEnquiry(c,values());status.textContent='';};
 const valid=()=>{const v=values();if(!v.services.length||!v.details.trim()){status.textContent=c.validation;(!v.services.length?form.querySelector('[name=service]'):form.elements.details).focus();return false;}return form.reportValidity();};
 form.addEventListener('input',update,opts);form.addEventListener('change',update,opts);
 form.addEventListener('submit',event=>{event.preventDefault();if(!valid()||!/^[1-9]\d{7,14}$/.test(form.dataset.phone))return;window.open(`https://wa.me/${form.dataset.phone}?text=${encodeURIComponent(preview.value)}`,'_blank','noopener,noreferrer');},opts);
 form.querySelector('[data-copy-message]').addEventListener('click',async()=>{if(!valid())return;try{await navigator.clipboard.writeText(preview.value);status.textContent=c.copied;}catch{preview.focus();preview.select();status.textContent=c.copyFallback;}},opts);
 update();return()=>{controller.abort();form.reset();preview.value='';form.hidden=true;};
}
