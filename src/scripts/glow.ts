// Desktop only: a soft glow follows the mouse across the panel background.
// It trails the pointer slightly (eased over time) and fades out when the mouse leaves the window.
// The look is in global.css (html.deck .panel::before).
export function initGlow() {
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const calm = matchMedia('(prefers-reduced-motion: reduce)');
  if (!fine.matches || calm.matches) return;

  const root = document.documentElement;
  let x = innerWidth / 2, y = innerHeight / 2; // where the glow is drawn
  let tx = x, ty = y;                          // where the mouse is
  let frame = 0;
  let last = 0;

  // Eases towards the mouse by time, not per frame, so it trails the same on 60 Hz and 120 Hz screens
  const draw = (now: number) => {
    const k = last ? 1 - Math.exp(-(now - last) / 90) : 0.2;
    last = now;
    x += (tx - x) * k;
    y += (ty - y) * k;
    root.style.setProperty('--glow-x', `${x.toFixed(1)}px`);
    root.style.setProperty('--glow-y', `${y.toFixed(1)}px`);
    frame = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(draw) : 0;
    if (!frame) last = 0;
  };

  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    tx = e.clientX;
    ty = e.clientY;
    root.style.setProperty('--glow-on', '1');
    if (!frame) frame = requestAnimationFrame(draw);
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => root.style.setProperty('--glow-on', '0'));
}
