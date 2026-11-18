import { initNavigation } from './navigation.js';
import { initGallery } from './gallery.js';
import { initWorkflow } from './workflow.js';
import { initExperience } from './experience.js';

const cleanups = [initNavigation(), initGallery(), initExperience(), initWorkflow()];
let active = true;
let motionCleanup = () => {}, generation = 0;
const enhancedMotion = matchMedia('(prefers-reduced-motion: no-preference) and (pointer: fine) and (min-width: 761px)');
async function updateMotion() {
  const current = ++generation;
  motionCleanup(); motionCleanup = () => {};
  if (!active || !enhancedMotion.matches) return;
  try {
    const { initMotion } = await import('./motion.js');
    if (active && enhancedMotion.matches && current === generation) motionCleanup = initMotion();
  } catch { /* Static content and native scrolling remain available. */ }
}
enhancedMotion.addEventListener('change', updateMotion);
const timer = setTimeout(updateMotion, 150);
window.addEventListener('pagehide', () => {
  active = false;
  clearTimeout(timer);
  enhancedMotion.removeEventListener('change', updateMotion);
  motionCleanup();
  cleanups.forEach(cleanup => cleanup());
}, { once: true });
window.addEventListener('pageshow', event => {
  if (event.persisted) location.reload();
});
