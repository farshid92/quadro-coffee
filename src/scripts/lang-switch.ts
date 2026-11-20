// Switching language (the TR/EN links) keeps the visitor where they were.
// - Desktop deck: the link carries the open panel's #id and deck.ts opens that panel.
// - Normal scrolling (phones, tablets): the spot on the page is saved for the next page, which jumps
//   straight there. The link gets no #id, so the browser does not glide down from the top.
// The menu tab that was open stays open too. Section ids are the same in both languages.
const KEY = 'qc-lang-switch';
const root = document.documentElement;
const isDeck = () => root.classList.contains('deck');
const sections = () => [...document.querySelectorAll<HTMLElement>('[data-panel]:not([hidden]), [data-section]:not([hidden])')];

interface Spot { to: string; tab?: string; id?: string; ratio?: number }

document.querySelectorAll<HTMLAnchorElement>('a[hreflang]').forEach((link) => {
  link.addEventListener('click', () => {
    const spot: Spot = { to: link.pathname, tab: document.querySelector('[role=tab][aria-selected=true]')?.id };
    if (isDeck()) {
      const id = location.hash.slice(1);
      link.hash = id && id !== 'top' ? id : '';
    } else {
      link.hash = '';
      // The section at the top of the screen, and how far into it the visitor has scrolled
      const el = sections().filter((s) => pageTop(s) <= scrollY + 1).pop();
      if (el) {
        Object.assign(spot, { id: el.id, ratio: (scrollY - pageTop(el)) / el.offsetHeight });
      }
    }
    try { sessionStorage.setItem(KEY, JSON.stringify(spot)); } catch {}
  });
});

/** Distance from the top of the page, ignoring animations that move things on screen */
function pageTop(el: HTMLElement) {
  let y = 0;
  for (let e: HTMLElement | null = el; e; e = e.offsetParent as HTMLElement | null) y += e.offsetTop;
  return y;
}

addEventListener('DOMContentLoaded', () => {
  let spot: Spot | null = null;
  try { spot = JSON.parse(sessionStorage.getItem(KEY) ?? 'null'); sessionStorage.removeItem(KEY); } catch {}
  if (spot?.to === location.pathname) {
    if (spot.tab) document.getElementById(spot.tab)?.click();
    const el = spot.id ? document.getElementById(spot.id) : null;
    if (el && !isDeck()) {
      const jump = () => {
        root.style.scrollBehavior = 'auto'; // jump, don't glide
        scrollTo(0, pageTop(el) + (spot.ratio ?? 0) * el.offsetHeight);
        root.style.scrollBehavior = '';
      };
      jump();
      // Web fonts and images can still change heights above the spot: jump again once they are in,
      // unless the visitor has started scrolling by then
      let moved = false;
      for (const ev of ['touchstart', 'wheel', 'keydown']) addEventListener(ev, () => (moved = true), { once: true, passive: true });
      const again = () => { if (!moved) jump(); };
      document.fonts?.ready.then(again);
      addEventListener('load', again, { once: true });
    }
  }
  root.classList.remove('lang-restore');
});
