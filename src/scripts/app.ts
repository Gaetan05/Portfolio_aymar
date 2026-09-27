/**
 * Global interaction layer — progressive enhancement only.
 * Everything here hooks onto data-attributes, so pages stay plain HTML.
 *
 *   data-intro            element animates in once the page is ready
 *   data-split            text reveals line by line when scrolled into view
 *   data-words            words brighten as you scroll through (manifesto)
 *   data-parallax="0.2"   element drifts at a different speed
 *   data-magnetic         element leans toward the cursor
 *   data-cursor="Label"   custom cursor grows and shows a label on hover
 *   data-count            number counts up when visible
 *   data-clock="Europe/Paris"  live clock
 *   data-copy="text"      copies text to clipboard + toast
 *   data-marquee          infinite marquee, reacts to scroll velocity
 *   data-progress         reading progress bar
 *   data-theme-toggle     toggles light / dark
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const $$ = <T extends Element = HTMLElement>(s: string, ctx: ParentNode = document) => [...ctx.querySelectorAll<T & Element>(s)] as T[];

/* ───────────── Smooth scroll ───────────── */
let lenis: Lenis | null = null;
if (!reduced) {
  lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1, anchors: { offset: -80 } });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
(window as any).__lenis = lenis;

/* ───────────── Theme ───────────── */
$$('[data-theme-toggle]').forEach((b) =>
  b.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    const apply = () => {
      root.dataset.theme = next;
      try {
        localStorage.setItem('theme', next);
      } catch {}
      window.dispatchEvent(new CustomEvent('themechange'));
    };
    // Circular reveal from the button, where supported.
    const d = document as any;
    if (d.startViewTransition && !reduced) {
      const r = b.getBoundingClientRect();
      root.style.setProperty('--vt-x', `${r.left + r.width / 2}px`);
      root.style.setProperty('--vt-y', `${r.top + r.height / 2}px`);
      root.classList.add('theme-vt');
      d.startViewTransition(apply).finished.finally(() => root.classList.remove('theme-vt'));
    } else apply();
  }),
);

/* ───────────── Cursor ───────────── */
if (fine && !reduced) {
  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.innerHTML = '<span class="cursor-dot"></span><span class="cursor-label"></span>';
  document.body.append(cursor);
  const label = cursor.querySelector<HTMLElement>('.cursor-label')!;
  const xTo = gsap.quickTo(cursor, 'x', { duration: 0.45, ease: 'power3' });
  const yTo = gsap.quickTo(cursor, 'y', { duration: 0.45, ease: 'power3' });
  let shown = false;
  window.addEventListener(
    'pointermove',
    (e) => {
      if (!shown) {
        gsap.set(cursor, { x: e.clientX, y: e.clientY });
        cursor.classList.add('on');
        shown = true;
      }
      xTo(e.clientX);
      yTo(e.clientY);
    },
    { passive: true },
  );
  document.addEventListener('pointerleave', () => cursor.classList.remove('on'));
  document.addEventListener('pointerenter', () => shown && cursor.classList.add('on'));
  document.addEventListener('pointerover', (e) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>('[data-cursor], a, button, [role="button"], input, label');
    cursor.classList.toggle('hover', !!t);
    const text = t?.dataset.cursor ?? '';
    label.textContent = text;
    cursor.classList.toggle('has-label', !!text);
  });
  window.addEventListener('pointerdown', () => cursor.classList.add('down'));
  window.addEventListener('pointerup', () => cursor.classList.remove('down'));
}

/* ───────────── Magnetic ───────────── */
if (fine && !reduced) {
  $$('[data-magnetic]').forEach((el) => {
    const strength = Number(el.dataset.magnetic) || 0.35;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.4)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.4)' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    });
    el.addEventListener('pointerleave', () => (xTo(0), yTo(0)));
  });
}

/* ───────────── Clocks ───────────── */
const clocks = $$('[data-clock]');
if (clocks.length) {
  const tick = () =>
    clocks.forEach((c) => {
      const tz = c.dataset.clock || undefined;
      try {
        c.textContent = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: tz }).format(new Date());
      } catch {
        c.textContent = new Date().toLocaleTimeString('en-GB');
      }
    });
  tick();
  setInterval(tick, 1000);
}

/* ───────────── Copy to clipboard ───────────── */
function toast(msg: string) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.setAttribute('role', 'status');
  t.textContent = msg;
  document.body.append(t);
  gsap.fromTo(t, { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6, ease: 'expo.out' });
  gsap.to(t, { yPercent: 120, opacity: 0, delay: 2, duration: 0.5, ease: 'expo.in', onComplete: () => t.remove() });
}
$$('[data-copy]').forEach((b) =>
  b.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(b.dataset.copy!);
      toast('Copied to clipboard ✓');
    } catch {
      location.href = `mailto:${b.dataset.copy}`;
    }
  }),
);

/* ───────────── Reading progress ───────────── */
$$('[data-progress]').forEach((bar) => {
  gsap.to(bar, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: 'main', start: 'top top', end: 'bottom bottom', scrub: true } });
});

/* ───────────── Grid overlay easter egg (press G) ───────────── */
document.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() !== 'g' || e.metaKey || e.ctrlKey || /INPUT|TEXTAREA/.test((e.target as HTMLElement).tagName)) return;
  let g = document.querySelector('.grid-overlay');
  if (g) return g.remove();
  g = document.createElement('div');
  g.className = 'grid-overlay pad grid12';
  g.innerHTML = Array.from({ length: 12 }, () => '<span></span>').join('');
  document.body.append(g);
});

/* ───────────── Scroll-driven motion ───────────── */
function initScroll() {
  if (reduced) return;

  // Line-by-line reveals
  $$('[data-split]').forEach((el) => {
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.lines, {
          yPercent: 110,
          rotate: 2,
          duration: 1.2,
          stagger: 0.08,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        }),
    });
  });

  // Words that light up while scrolling
  $$('[data-words]').forEach((el) => {
    // Words may already be wrapped server-side (.w); otherwise split them here.
    const words = el.querySelectorAll('.w').length ? [...el.querySelectorAll('.w')] : SplitText.create(el, { type: 'words', wordsClass: 'w' }).words;
    gsap.fromTo(
      words,
      { opacity: 0.14 },
      { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true } },
    );
  });

  // Generic fade-up
  $$('[data-rise]').forEach((el) => {
    gsap.from(el, {
      y: 40,
      opacity: 0,
      duration: 1.2,
      ease: 'expo.out',
      delay: Number(el.dataset.rise) || 0,
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
    });
  });

  // Staggered children
  $$('[data-stagger]').forEach((el) => {
    gsap.from(el.children, {
      y: 50,
      opacity: 0,
      duration: 1.1,
      stagger: 0.07,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  // Parallax
  $$('[data-parallax]').forEach((el) => {
    const speed = Number(el.dataset.parallax) || 0.2;
    gsap.fromTo(
      el,
      { yPercent: -speed * 50 },
      { yPercent: speed * 50, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } },
    );
  });

  // Image / cover unveil (clip-path wipe)
  $$('[data-unveil]').forEach((el) => {
    gsap.fromTo(
      el,
      { clipPath: 'inset(0 0 100% 0)' },
      { clipPath: 'inset(0 0 0% 0)', duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: el, start: 'top 85%', once: true } },
    );
  });

  // Counters
  $$('[data-count]').forEach((el) => {
    const end = Number(el.textContent) || 0;
    const obj = { v: 0 };
    el.textContent = '0';
    gsap.to(obj, {
      v: end,
      duration: 1.8,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: () => (el.textContent = String(Math.round(obj.v)).padStart(2, '0')),
    });
  });

  // Rules that draw themselves
  $$('[data-draw]').forEach((el) => {
    gsap.from(el, { scaleX: 0, transformOrigin: 'left', duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: el, start: 'top 95%', once: true } });
  });
}

/* ───────────── Marquees (velocity-reactive) ───────────── */
function initMarquees() {
  $$('[data-marquee]').forEach((m) => {
    const track = m.querySelector<HTMLElement>('.marquee-track');
    if (!track) return;
    // Duplicate content until wide enough for a seamless loop.
    const base = track.innerHTML;
    while (track.scrollWidth < window.innerWidth * 2.2) track.insertAdjacentHTML('beforeend', base);
    track.insertAdjacentHTML('beforeend', track.innerHTML);
    if (reduced) return;
    const dir = m.dataset.marquee === 'reverse' ? 1 : -1;
    const speed = Number(m.dataset.speed) || 60; // px/s
    let x = 0;
    let boost = 0;
    const half = () => track.scrollWidth / 2;
    lenis?.on('scroll', (l: Lenis) => (boost = gsap.utils.clamp(-12, 12, l.velocity)));
    gsap.ticker.add((_, dt) => {
      boost *= 0.92;
      x += dir * (speed * (dt / 1000)) * (1 + Math.abs(boost) * 0.35) * (boost < -0.5 ? -1 : 1);
      const w = half();
      if (x <= -w) x += w;
      if (x > 0) x -= w;
      track.style.transform = `translate3d(${x}px,0,0) skewX(${-boost * 0.6}deg)`;
    });
  });
}

/* ───────────── Intro (preloader → page) ───────────── */
async function intro() {
  const loader = document.querySelector<HTMLElement>('.preloader');
  let seen = false;
  try {
    seen = sessionStorage.getItem('seen') === '1';
    sessionStorage.setItem('seen', '1');
  } catch {}

  await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1200))]);

  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

  if (loader && !seen && !reduced) {
    const count = loader.querySelector<HTMLElement>('.pl-count');
    const obj = { v: 0 };
    tl.to(obj, { v: 100, duration: 1.3, ease: 'power2.inOut', onUpdate: () => count && (count.textContent = String(Math.round(obj.v)).padStart(3, '0')) })
      .to(loader.querySelectorAll('.pl-word'), { yPercent: -110, duration: 0.7, stagger: 0.05, ease: 'expo.in' }, '-=0.25')
      .to(loader, { clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'expo.inOut' }, '-=0.2')
      .set(loader, { display: 'none' });
  } else if (loader) {
    loader.style.display = 'none';
  }

  const items = $$('[data-intro]');
  if (reduced) {
    root.classList.add('ready');
    return;
  }
  const lines: Element[] = [];
  items.forEach((el) => {
    if (el.dataset.intro === 'lines') {
      const s = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'split-line' });
      lines.push(...s.lines);
    }
  });
  gsap.set(lines, { yPercent: 115 });
  const others = items.filter((el) => el.dataset.intro !== 'lines');
  gsap.set(others, { opacity: 0, y: 24 });
  root.classList.add('ready');
  tl.to(lines, { yPercent: 0, duration: 1.4, stagger: 0.09 }, loader && !seen ? '-=0.55' : 0.05).to(
    others,
    { opacity: 1, y: 0, duration: 1.2, stagger: 0.06 },
    '<0.35',
  );
  window.dispatchEvent(new CustomEvent('app:intro', { detail: { timeline: tl } }));
}

/* ───────────── Boot ───────────── */
intro().then(() => {
  initScroll();
  initMarquees();
  ScrollTrigger.refresh();
});

export { gsap, ScrollTrigger, lenis, reduced, fine };
