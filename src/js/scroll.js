// One owner for programmatic section navigation, with a native fallback.
let enhancedScroll = null;

export function registerSectionScroll(handler) {
  enhancedScroll = handler;
  return () => { if (enhancedScroll === handler) enhancedScroll = null; };
}

export function scrollToSection(target) {
  if (enhancedScroll) enhancedScroll(target);
  else target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
}
