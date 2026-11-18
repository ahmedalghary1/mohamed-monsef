import { workflow } from '../src/data/workflow.js';
import { concepts } from '../src/data/concepts.js';
import { content } from '../src/data/content.js';
import { readFileSync } from 'node:fs';
export const esc = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
export const lines = value => esc(value).replace(/\n/g, '<br>');
const brand = JSON.parse(readFileSync(new URL('../src/data/brand.json', import.meta.url), 'utf8'));
export const monogram = `<svg class="brand-symbol" viewBox="${brand.viewBox.join(' ')}" fill="currentColor" aria-hidden="true" focusable="false">${brand.polygons.map(points=>`<polygon points="${points.map(point=>point.join(',')).join(' ')}"/>`).join('')}</svg>`;
export const brandName = name => `<span class="brand-name">${name.split(' ').map(part=>`<span>${esc(part)}</span>`).join(' ')}</span>`;
// Small inline Lucide icons (ISC license in assets/brand). No runtime dependency.
const iconPaths = {
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  'chart-no-axes-combined': '<path d="M3 3v18h18M8 16v-3m5 3V8m5 8v-5M4 9l4-4 5 3 6-5"/>',
  image: '<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-4-4L7 21"/>',
  clapperboard: '<path d="m4 11 4-8m4 8 4-8m4 8 2-4M2 11h20v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z"/><path d="m2 11-.4-3a2 2 0 0 1 1.7-2.2L19 3a2 2 0 0 1 2.3 1.6L22 8Z"/>',
  building: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/>',
  'shopping-bag': '<path d="m6 2-3 4v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4ZM3 6h18M16 10a4 4 0 0 1-8 0"/>',
  sprout: '<path d="M7 20h10M12 20v-7M12 13C6 13 3 10 3 5c6 0 9 3 9 8ZM12 13c0-6 3-9 9-9 0 6-3 9-9 9Z"/>'
};
export const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name] || iconPaths.target}</svg>`;
export const heading = (label, title, intro = '') => `<div class="section-heading"><p class="eyebrow">${esc(label)}</p><h2 data-reveal-heading>${lines(title)}</h2>${intro ? `<p class="section-intro">${esc(intro)}</p>` : ''}</div>`;
export function renderExpertise(lang) {
  return `<div class="expertise-strip"><ul class="container">${content[lang].expertise.map(s => `<li><bdi>${esc(s)}</bdi></li>`).join('')}</ul></div>`;
}
export function renderStory(lang) {
 const c=workflow[lang];
 return `<section id="story" class="section workflow-section" data-workflow><div class="container">${heading(c.label,c.title)}<div class="workflow-layout"><div class="workflow-visual"><svg viewBox="0 0 600 340" fill="none" aria-hidden="true"><path class="workflow-connection" d="M100 85H300H500V255H300H100V85"/><path class="workflow-return" d="M85 255H45V45H555V295H100"/>${[[100,85],[300,85],[500,85],[500,255],[300,255],[100,255]].map(([x,y],i)=>`<g data-stage-node="${i}"><circle cx="${x}" cy="${y}" r="32"/><text x="${x}" y="${y+6}" text-anchor="middle">0${i+1}</text></g>`).join('')}</svg><div class="workflow-caption" role="status" aria-live="polite"><h3 data-stage-title>${esc(c.stages[0][0])}</h3><p data-stage-description>${esc(c.stages[0][1])}</p></div><p class="workflow-loop">&#8635; ${esc(c.loop)}</p></div><ol class="workflow-stages">${c.stages.map((stage,i)=>`<li><button type="button" disabled data-stage="${i}" aria-pressed="${i===0}"><span class="step-number">0${i+1}</span><strong>${esc(stage[0])}</strong><span>${esc(stage[1])}</span></button></li>`).join('')}</ol></div></div></section>`;
}
export function mediaStatus(c) {
  return `<p class="media-status" data-media-status role="status" data-loading="${esc(c.mediaLoading)}" data-error="${esc(c.mediaError)}" data-timeout="${esc(c.mediaTimeout)}" hidden></p>`;
}
export function dialogNavigation(c) {
  return `<div class="dialog-navigation"><button type="button" data-previous aria-label="${esc(c.previous)}">← <span>${esc(c.previous)}</span></button><button type="button" data-next aria-label="${esc(c.next)}"><span>${esc(c.next)}</span> →</button></div>`;
}
export function renderLab(lang, asset) {
  const c = content[lang];
  return `<section id="creative-lab" class="section concept-lab container" data-gallery>
    <div class="lab-heading">${heading(c.labLabel,c.labTitle,c.labIntro)}<p class="concept-disclosure">${esc(c.disclosure)}</p></div>
    <div class="gallery-toolbar"><div class="filters" hidden>${Object.entries(c.filters).filter(([id])=>id==='all'||concepts.some(p=>p.categories.includes(id))).map(([id,label]) => `<button type="button" data-filter="${id}" aria-pressed="${id==='all'}">${esc(label)}</button>`).join('')}</div><p class="result-count" data-results aria-live="polite" data-result-label="${esc(c.results)}" hidden></p></div>
    <div class="concept-gallery">${concepts.map((p,i) => `<article class="concept-item" data-project data-type="${p.categories.join(' ')}">
      <a class="concept-cover" data-open-project="concept-${p.id}" href="${asset('/assets/images/concepts/'+p.image+'.webp')}"><img src="${asset('/assets/images/concepts/'+p.image+'.webp')}" srcset="${asset('/assets/images/concepts/'+p.image+'-640.webp')} 640w, ${asset('/assets/images/concepts/'+p.image+'.webp')} 1280w" sizes="(max-width: 600px) 92vw, (max-width: 1000px) 46vw, ${i===0?'55vw':'35vw'}" alt="${esc(p.summary[lang])}" width="1280" height="853" loading="lazy"><span class="image-index" aria-hidden="true">0${i+1}</span><span class="concept-open">${esc(c.view)} <span aria-hidden="true">↗</span></span></a>
      <div class="concept-meta"><div><p class="eyebrow">${esc(p.category[lang])}</p><h3>${esc(p.title[lang])}</h3></div><span aria-hidden="true">↗</span></div><p class="concept-notice">${esc(c.notice)}</p>
      <dialog class="project-dialog" data-dialog="concept-${p.id}" aria-labelledby="title-${p.id}" data-lenis-prevent><button class="dialog-close" type="button" data-close autofocus>${esc(c.close)} <span aria-hidden="true">×</span></button><p class="concept-notice">${esc(c.notice)}</p><h2 id="title-${p.id}">${esc(p.title[lang])}</h2>${mediaStatus(c)}<img src="${asset('/assets/images/concepts/'+p.image+'.webp')}" alt="${esc(p.summary[lang])}" width="1280" height="853" loading="lazy"><p>${esc(p.summary[lang])}</p><div class="dialog-details"><div><h3>${esc(c.objective)}</h3><p>${esc(p.objective[lang])}</p></div><div><h3>${esc(c.attribution)}</h3><p>${esc(p.role[lang])}</p></div></div><a class="text-link" href="${asset('/assets/images/concepts/'+p.image+'.webp')}">${esc(c.openMedia)} ↗</a>${dialogNavigation(c)}</dialog>
    </article>`).join('')}</div>
  </section>`;
}
export function renderMotion(lang, asset) {
  const c=content[lang];
  return `<section id="ai-motion" class="section motion-section" data-gallery><div class="container motion-layout"><div class="motion-copy">${heading(c.motionLabel,c.motionTitle,c.motionIntro)}<p class="motion-note">${esc(c.motionNote)}</p></div><div class="motion-feature"><a class="motion-poster" data-open-project="motion-study" href="${asset('/assets/videos/still-form.mp4')}"><img src="${asset('/assets/images/concepts/bottle.webp')}" srcset="${asset('/assets/images/concepts/bottle-640.webp')} 640w, ${asset('/assets/images/concepts/bottle.webp')} 1280w" sizes="(max-width: 760px) 92vw, 60vw" width="1280" height="853" loading="lazy" alt="${esc(c.motionCaption)}"><span class="play-control"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m9 5 11 7-11 7Z"/></svg><span>${esc(c.watch)}</span></span><span class="motion-duration" aria-hidden="true">00:06</span></a><div class="motion-caption"><p>${esc(c.motionCaption)}</p><span>${esc(c.motionType)}</span></div></div></div>
    <dialog class="project-dialog motion-dialog" data-dialog="motion-study" aria-labelledby="motion-title" data-lenis-prevent><button class="dialog-close" data-close type="button" autofocus>${esc(c.close)} ×</button><p class="eyebrow">${esc(c.motionType)}</p><h2 id="motion-title">${esc(c.motionCaption)}</h2><p>${esc(c.motionNote)}</p>${mediaStatus(c)}<video controls playsinline preload="none" width="960" height="640" poster="${asset('/assets/images/concepts/bottle.webp')}" aria-label="${esc(c.watch)}"><source src="${asset('/assets/videos/still-form.mp4')}" type="video/mp4"><source src="${asset('/assets/videos/still-form.webm')}" type="video/webm"></video><a class="text-link" href="${asset('/assets/videos/still-form.mp4')}">${esc(c.openMedia)} ↗</a></dialog>
  </section>`;
}
