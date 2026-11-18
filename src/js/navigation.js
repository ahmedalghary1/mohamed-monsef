export function initNavigation() {
  const controller = new AbortController(), options = { signal: controller.signal };
  const toggle = document.querySelector('[data-menu-toggle]');
  const nav = document.getElementById('navigation');
  const closer = nav.querySelector('[data-menu-close]');
  const menuHeading = nav.querySelector('.mobile-menu-heading');
  const backdrop = document.querySelector('[data-menu-backdrop]');
  const small = matchMedia('(max-width:760px)');
  const background = [...document.querySelectorAll('main, .site-footer, .header-inner > .brand, .header-actions')];
  const previousInert = background.map(element => element.inert);
  let open = false;

  function setOpen(value, restoreFocus = false) {
    open = value && small.matches;
    toggle.setAttribute('aria-expanded', String(open));
    nav.toggleAttribute('data-collapsed', small.matches && !open);
    nav.toggleAttribute('data-drawer', open);
    menuHeading.hidden = !open;
    nav.querySelector('.mobile-menu-extras').hidden = !open;
    backdrop.hidden = !open;
    document.body.toggleAttribute('data-menu-open', open);
    background.forEach((element, index) => { element.inert = open || previousInert[index]; });
    if (open) { nav.setAttribute('role', 'dialog'); nav.setAttribute('aria-modal', 'true'); closer.focus(); }
    else { nav.removeAttribute('role'); nav.removeAttribute('aria-modal'); if (restoreFocus) toggle.focus(); }
    document.dispatchEvent(new Event('portfolio:overlay'));
  }
  toggle.hidden = false;
  setOpen(false);
  toggle.addEventListener('click', () => setOpen(!open), options);
  closer.addEventListener('click', () => setOpen(false, true), options);
  backdrop.addEventListener('click', () => setOpen(false, true), options);
  small.addEventListener('change', () => setOpen(false), options);
  nav.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link || !open) return;
    setOpen(false);
    if(link.origin!==location.origin||link.pathname!==location.pathname||!link.hash)return;
    const target = document.getElementById(link.hash.slice(1));
    if (target) {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      target.addEventListener('blur', () => target.removeAttribute('tabindex'), { ...options, once: true });
    }
  }, options);
  document.addEventListener('keydown', event => {
    if (!open) return;
    if (event.key === 'Escape') { event.preventDefault(); setOpen(false, true); }
    if (event.key === 'Tab') {
      const focusable = [...nav.querySelectorAll('a, button')].filter(element=>element.getClientRects().length);
      const first = focusable[0], last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  }, options);
  document.querySelectorAll('[data-language], [data-language-menu]').forEach(link => link.addEventListener('click', () => {
    link.hash = document.getElementById(location.hash.slice(1)) ? location.hash : '';
    try { localStorage.setItem('portfolio-language', link.lang); } catch { /* Storage is optional. */ }
  }, options));

  const header = document.querySelector('[data-header]');
  const headerObserver = new IntersectionObserver(([entry]) => header.toggleAttribute('data-scrolled', !entry.isIntersecting), { threshold: .95 });
  headerObserver.observe(document.getElementById('home'));
  const links = [...nav.querySelectorAll('[data-nav]')];
  const sectionMap = new Map([['creative-lab', 'work'], ['campaign-experience', 'work'], ['ai-motion', 'work'], ['story', 'services']]);
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => a.boundingClientRect.top-b.boundingClientRect.top);
    if (!visible.length) return;
    const id = sectionMap.get(visible[0].target.id) || visible[0].target.id;
    links.forEach(link => { if (link.hash === '#'+id) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current'); });
  }, { rootMargin: '-15% 0px -50% 0px' });
  [...links.map(link => document.getElementById(link.hash.slice(1))), ...[...sectionMap.keys()].map(id=>document.getElementById(id))].filter(Boolean).forEach(section=>observer.observe(section));
  return () => {
    setOpen(false); controller.abort(); observer.disconnect(); headerObserver.disconnect();
    toggle.hidden = true; nav.removeAttribute('data-collapsed'); header.removeAttribute('data-scrolled');
  };
}
