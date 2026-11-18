import { readFileSync } from 'node:fs';
import { esc } from './experience-template.mjs';

const labels={en:{whatsapp:'Start a conversation on WhatsApp',facebook:'Connect on Facebook',facebookPage:'Facebook page',email:'Open your email app',linkedin:'Connect on LinkedIn',chat:'Chat on WhatsApp',message:'Hello Mohamed, I visited your portfolio and would like to discuss a potential project.'},ar:{whatsapp:'ابدأ محادثة عبر واتساب',facebook:'تواصل عبر فيسبوك',facebookPage:'صفحة فيسبوك',email:'افتح تطبيق البريد الإلكتروني',linkedin:'تواصل عبر لينكدإن',chat:'تواصل عبر واتساب',message:'مرحبًا محمد، تصفحت البورتفوليو الخاص بك وأرغب في مناقشة مشروع معك.'}};
const paths={facebook:'M14 22v-9h3l.5-4H14V7c0-1 .3-2 2-2h2V1.5A23 23 0 0 0 15 1c-3 0-5 2-5 5v3H7v4h3v9Z',email:'M2 4h20v16H2Zm2 2 8 7 8-7M4 18V8m16 10V8',linkedin:'M4 8h4v14H4ZM6 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm5 6h4v2c1-2 7-3 7 4v8h-4v-8c0-3-3-3-3 0v8h-4Z'};
// One licensed SVG source for every WhatsApp use; no runtime icon framework.
const whatsappIcon=readFileSync(new URL('../public/assets/brand/whatsapp.svg',import.meta.url),'utf8').trim().replace('class="bi bi-whatsapp"','aria-hidden="true" focusable="false"');
export const socialIcon=type=>type==='whatsapp'?whatsappIcon:`<svg viewBox="0 0 24 24" aria-hidden="true" fill="${type==='email'?'none':'currentColor'}"${type==='email'?' stroke="currentColor" stroke-width="1.5"':''}><path fill-rule="evenodd" d="${paths[type]}"/></svg>`;
function safeUrl(value,hosts){try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password&&hosts.includes(u.hostname)?u.href:null;}catch{return null;}}
export function contactChannels(config,lang){
 const l=labels[lang],channels=[];
 let phone=config.whatsappPhone||'';
 if(!phone&&config.whatsapp){const url=safeUrl(config.whatsapp,['wa.me']);if(url)phone=new URL(url).pathname.slice(1);}
 if(/^[1-9]\d{7,14}$/.test(phone))channels.push({type:'whatsapp',label:l.whatsapp,url:`https://wa.me/${phone}?text=${encodeURIComponent(l.message)}`});
 for(const [key,type,hosts] of [['facebook','facebook',['www.facebook.com','facebook.com']],['facebookPage','facebook',['www.facebook.com','facebook.com']],['linkedin','linkedin',['www.linkedin.com','linkedin.com']]]){const url=safeUrl(config[key],hosts);if(url)channels.push({type,label:key==='facebookPage'?l.facebookPage:l[type],url});}
 if(config.email&&/^[^\s@<>?]+@[^\s@<>?]+\.[^\s@<>?]+$/.test(config.email))channels.push({type:'email',label:l.email,url:'mailto:'+config.email});
 return channels;
}
export const renderContactRows=channels=>channels.map(c=>`<a class="contact-channel" data-channel="${c.type}" href="${esc(c.url)}"${c.type!=='email'?' target="_blank" rel="noopener noreferrer"':''}>${socialIcon(c.type)}<span>${esc(c.label)}</span><span aria-hidden="true">↗</span></a>`).join('');
export function renderFloating(channels,lang){const c=channels.find(c=>c.type==='whatsapp');return c?`<a class="floating-whatsapp" href="${esc(c.url)}" target="_blank" rel="noopener noreferrer" aria-label="${labels[lang].chat}">${socialIcon('whatsapp')}<span>${labels[lang].chat}</span></a>`:'';}
