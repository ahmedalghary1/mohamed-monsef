import { initNavigation } from './navigation.js';
import { initGallery } from './gallery.js';
import { initExperience } from './experience.js';
const cleanups=[initNavigation(),initGallery(),initExperience()];let active=true;
const motion=matchMedia('(prefers-reduced-motion: no-preference) and (pointer: fine) and (min-width: 761px)');
let sceneCleanup=()=>{};let sceneGeneration=0;
async function updateScene(){const generation=++sceneGeneration;sceneCleanup();sceneCleanup=()=>{};if(!motion.matches||!active)return;try{const {initHeroScene}=await import('./hero-scene.js');if(active&&motion.matches&&generation===sceneGeneration)sceneCleanup=initHeroScene();}catch{/* Static SVG remains visible. */}}
motion.addEventListener('change',updateScene);
const enhance=()=>{import('./motion.js').then(({initMotion})=>{if(active)cleanups.push(initMotion());}).catch(()=>{});updateScene();};
const timer=setTimeout(enhance,250);
window.addEventListener('pagehide',()=>{active=false;clearTimeout(timer);motion.removeEventListener('change',updateScene);sceneCleanup();cleanups.forEach(fn=>fn());},{once:true});
window.addEventListener('pageshow',e=>{if(e.persisted)location.reload();});
