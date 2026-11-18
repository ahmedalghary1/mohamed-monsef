import { esc } from './experience-template.mjs';
export function renderComparison(pair,lang,id,asset){
 if(!pair?.permissionConfirmed||!pair.before?.src||!pair.after?.src)return '';
 const c=lang==='ar'?{before:'قبل',after:'بعد',label:'مقارنة الصورة الأصلية والنتيجة الإبداعية'}:{before:'Before',after:'After',label:'Compare the original image and creative result'};
 return `<figure class="image-comparison" data-comparison><div class="comparison-images" style="--comparison-position:50%"><img src="${asset(pair.before.src)}" alt="${esc(pair.before.alt[lang])}" width="${pair.width}" height="${pair.height}" loading="lazy"><img class="comparison-after" src="${asset(pair.after.src)}" alt="${esc(pair.after.alt[lang])}" width="${pair.width}" height="${pair.height}" loading="lazy"><span class="comparison-before-label">${c.before}</span><span class="comparison-after-label">${c.after}</span></div><figcaption><label for="comparison-${esc(id)}">${c.label}</label><input id="comparison-${esc(id)}" type="range" min="0" max="100" value="50" data-comparison-range></figcaption></figure>`;
}
