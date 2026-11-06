// Full-screen panel deck with a curved wipe between panels (desktop only).
//
// Each [data-panel] becomes a fixed full-screen layer. One wheel step, swipe, arrow key, nav link
// or dot moves one panel: the old content blurs out, the next panel's colour rises from the bottom
// as a huge circle (clip-path), and its content fades in with wide letter-spacing settling down.
//
// It only switches on when the screen is large enough, the user hasn't asked for reduced motion,
// and every panel fits on one screen. Otherwise the page scrolls normally (see global.css).

const QUERY = '(min-width: 1024px) and (min-height: 620px) and (prefers-reduced-motion: no-preference)';
const WIPE_MS = 1150;
const OUT_MS = 380;
const IN_MS = 800;
const WIPE_EASE = 'cubic-bezier(.77,0,.18,1)';
const IN_EASE = 'cubic-bezier(.2,.7,.2,1)';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const pad = (n: number) => String(n).padStart(2, '0');

export function initDeck() {
  const root = document.documentElement;
  const panels = [...document.querySelectorAll<HTMLElement>('[data-panel]:not([hidden])')];
  if (panels.length < 2) return;

  const media = matchMedia(QUERY);
  const countEl = document.querySelector('[data-deck-count]');
  const totalEl = document.querySelector('[data-deck-total]');
  const listEl = document.querySelector('[data-deck-list]');

  let on = false;
  let index = 0;
  let busy = false;
  let cooldownUntil = 0;
  let running: Animation[] = [];

  panels.forEach((panel, i) => panel.style.setProperty('--i', String(i)));

  // Progress dots
  if (totalEl) totalEl.textContent = pad(panels.length);
  const dots = panels.map((panel, i) => {
    const li = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', panel.dataset.label ?? pad(i + 1));
    button.className = 'group flex h-6 w-6 items-center justify-center';
    button.innerHTML = '<span class="block h-1.5 w-1.5 rounded-full bg-current opacity-40 transition-all duration-500 group-hover:opacity-100 group-aria-[current=true]:h-5 group-aria-[current=true]:opacity-100"></span>';
    button.addEventListener('click', () => go(i));
    li.append(button);
    listEl?.append(li);
    return button;
  });

  /** Two circles with the same centre far below the screen: one just under the bottom edge, one covering it all. */
  function circles() {
    const w = innerWidth;
    const h = innerHeight;
    const r0 = Math.max(w * 0.75, h);
    const cy = h + r0;
    const r1 = Math.hypot(w / 2, cy) + 4;
    return { hidden: `circle(${r0}px at 50% ${cy}px)`, full: `circle(${r1}px at 50% ${cy}px)` };
  }

  const panelIndexOf = (el: Element | null) => {
    if (!el) return -1;
    const own = el.closest('[data-panel]');
    if (own) return panels.indexOf(own as HTMLElement);
    const inside = el.querySelector('[data-panel]');
    return inside ? panels.indexOf(inside as HTMLElement) : -1;
  };

  const fits = () => panels.every((panel) => {
    const inner = panel.querySelector<HTMLElement>('.panel-inner');
    return !inner || inner.scrollHeight <= inner.clientHeight + 2;
  });

  function track(animation: Animation) {
    running.push(animation);
    return animation;
  }

  function stopAll() {
    running.forEach((a) => a.cancel());
    running = [];
  }

  /** Panels up to the current one are uncovered; later ones wait clipped just below the screen. */
  function layout() {
    const { hidden } = circles();
    panels.forEach((panel, i) => { panel.style.clipPath = i <= index ? '' : hidden; });
  }

  function setActive(i: number) {
    index = i;
    root.dataset.tone = panels[i].dataset.tone;
    if (countEl) countEl.textContent = pad(i + 1);
    dots.forEach((dot, d) => dot.setAttribute('aria-current', String(d === i)));
    // The first panel keeps a clean URL: writing #top during page load would make the browser
    // treat it as a deep link and start keyboard focus there, skipping the header.
    const id = i === 0 ? '' : panels[i].id;
    history.replaceState(null, '', id ? `#${id}` : location.pathname + location.search);
  }

  function contentOut(panel: HTMLElement, direction: number) {
    panel.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el, i) => {
      track(el.animate(
        [
          { opacity: 1, filter: 'blur(0)', transform: 'translateY(0)' },
          { opacity: 0, filter: 'blur(8px)', transform: `translateY(${-24 * direction}px)` },
        ],
        { duration: OUT_MS, delay: i * 30, easing: 'ease-in', fill: 'forwards' },
      ));
    });
  }

  function contentIn(panel: HTMLElement, delay: number) {
    panel.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el, i) => {
      const spaced = el.dataset.reveal === 'spaced';
      const from: Keyframe = spaced
        ? { opacity: 0, filter: 'blur(6px)', letterSpacing: '0.55em' }
        : { opacity: 0, filter: 'blur(6px)', transform: 'translateY(36px)' };
      const to: Keyframe = spaced
        ? { opacity: 1, filter: 'blur(0)', letterSpacing: getComputedStyle(el).letterSpacing }
        : { opacity: 1, filter: 'blur(0)', transform: 'translateY(0)' };
      // fill: 'backwards' keeps the element hidden during its delay, then hands back to the stylesheet.
      el.animate([from, to], { duration: IN_MS, delay: delay + i * 90, easing: IN_EASE, fill: 'backwards' });
    });
  }

  async function go(target: number) {
    if (!on || busy || target === index || target < 0 || target >= panels.length) return;
    busy = true;
    const from = index;
    const forward = target > from;
    const { hidden, full } = circles();

    contentOut(panels[from], forward ? 1 : -1);
    await wait(OUT_MS * 0.6);
    setTimeout(() => setActive(target), WIPE_MS * 0.45);

    if (forward) {
      // The target rises over everything; panels skipped on the way are uncovered after it lands.
      const panel = panels[target];
      panel.style.clipPath = '';
      contentIn(panel, WIPE_MS * 0.55);
      await track(panel.animate([{ clipPath: hidden }, { clipPath: full }], { duration: WIPE_MS, easing: WIPE_EASE })).finished.catch(() => {});
      for (let i = from + 1; i < target; i++) panels[i].style.clipPath = '';
    } else {
      // Skipped panels are hidden first (they sit under the current one), then the current one sinks away.
      for (let i = target + 1; i < from; i++) panels[i].style.clipPath = hidden;
      const panel = panels[from];
      contentIn(panels[target], WIPE_MS * 0.4);
      await track(panel.animate([{ clipPath: full }, { clipPath: hidden }], { duration: WIPE_MS, easing: WIPE_EASE, fill: 'forwards' })).finished.catch(() => {});
      panel.style.clipPath = hidden;
    }

    stopAll();
    busy = false;
    cooldownUntil = performance.now() + 250;
  }

  function enable() {
    // Start on the panel in the URL hash, or on the one the user had scrolled to.
    // (The head script may already have switched to deck mode; then there is no scroll position to read.)
    const target = location.hash ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;
    const fromHash = panelIndexOf(target);
    const fromScroll = root.classList.contains('deck') ? -1 : panels.findLastIndex((p) => p.getBoundingClientRect().top <= innerHeight / 2);
    root.classList.add('deck');
    if (!fits()) {
      root.classList.remove('deck', 'deck-booting');
      target?.scrollIntoView({ behavior: 'instant' });
      return;
    }
    on = true;
    window.scrollTo(0, 0);
    index = fromHash >= 0 ? fromHash : Math.max(fromScroll, 0);
    layout();
    setActive(index);
    root.classList.remove('deck-booting');
  }

  function disable() {
    on = false;
    busy = false;
    stopAll();
    root.classList.remove('deck');
    delete root.dataset.tone;
    panels.forEach((panel) => { panel.style.clipPath = ''; });
    panels[index].scrollIntoView({ behavior: 'instant' });
  }

  function refresh() {
    if (media.matches && !on) enable();
    else if (!media.matches && on) disable();
    else if (on && !busy) {
      if (fits()) layout();
      else disable();
    }
  }

  // ----- Input -----
  addEventListener('wheel', (e) => {
    if (!on || e.ctrlKey) return;
    e.preventDefault();
    const now = performance.now();
    // Trackpads keep sending events after a flick; wait for them to stop before the next step.
    if (busy || now < cooldownUntil) {
      if (!busy) cooldownUntil = now + 180;
      return;
    }
    if (Math.abs(e.deltaY) > 8) go(index + Math.sign(e.deltaY));
  }, { passive: false });

  let touchY: number | null = null;
  addEventListener('touchstart', (e) => { touchY = e.touches[0].clientY; }, { passive: true });
  addEventListener('touchend', (e) => {
    if (!on || touchY === null) return;
    const dy = touchY - e.changedTouches[0].clientY;
    if (Math.abs(dy) > 40) go(index + Math.sign(dy));
    touchY = null;
  });

  addEventListener('keydown', (e) => {
    if (!on || e.altKey || e.ctrlKey || e.metaKey) return;
    const el = e.target as HTMLElement;
    if (el.closest('input, textarea, select, [contenteditable]')) return;
    const onControl = !!el.closest('a, button');
    const steps: Record<string, number> = { ArrowDown: 1, PageDown: 1, ArrowUp: -1, PageUp: -1 };
    if (e.key in steps) go(index + steps[e.key]);
    else if (e.key === ' ' && !onControl) go(index + (e.shiftKey ? -1 : 1));
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(panels.length - 1);
    else return;
    e.preventDefault();
  });

  // In-page links (#menu, #aksam, #iletisim, skip link) move the deck instead of scrolling.
  document.addEventListener('click', (e) => {
    if (!on) return;
    const link = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link) return;
    const target = panelIndexOf(document.getElementById(decodeURIComponent(link.hash.slice(1))));
    if (target < 0) return;
    e.preventDefault();
    go(target);
  });

  // Tabbing into a panel that isn't on screen brings it on screen.
  document.addEventListener('focusin', (e) => {
    if (!on) return;
    const target = panelIndexOf(e.target as Element);
    if (target >= 0 && target !== index) go(target);
  });

  let resizeTimer = 0;
  addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(refresh, 150);
  });
  media.addEventListener('change', refresh);

  // Start now (the head script may already be showing the right panel), and check the fit
  // again once the web fonts have loaded, since they change text size.
  refresh();
  document.fonts.ready.then(refresh);
}
