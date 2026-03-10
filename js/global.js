/* ================================================
   NARMIN — GLOBAL JAVASCRIPT
   js/global.js
   Runs on EVERY page. Load this BEFORE any page JS.

   Handles:
     1. Inject nav + footer from /components/
     2. Mark active nav item from URL
     3. Apply nav layout (centered on index, left on others)
     4. Build nav letter spans
     5. Magnetic letter effect (nav letters)
     6. Trailing cursor ring
   ================================================ */


/* ────────────────────────────────────────────────
   UTILITY: fetch an HTML file and inject it
──────────────────────────────────────────────── */
async function injectComponent(targetSelector, filePath) {
  const target = document.querySelector(targetSelector);
  if (!target) return;
  try {
    const res  = await fetch(filePath);
    const html = await res.text();
    target.innerHTML = html;
  } catch (err) {
    console.warn(`Could not load: ${filePath}`, err);
  }
}


/* ────────────────────────────────────────────────
   INIT — runs after DOM is ready
──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {

  /* 1. Inject shared components */
  await injectComponent('#nav-mount',    'components/nav.html');
  await injectComponent('#footer-mount', 'components/footer.html');

  /* 2. Run everything that depends on injected HTML */
  applyNavLayout();
  markActiveNav();
  buildNavLetters();
  initMagneticLetters();
  initCursorRing();

  /* 3. Add bordered footer class on index page */
  const filename = getCurrentPage();
  if (filename === 'index') {
    const footer = document.querySelector('.footer');
    if (footer) footer.classList.add('footer-bordered');
  }

});


/* ────────────────────────────────────────────────
   HELPERS
──────────────────────────────────────────────── */

/* Returns current page name e.g. "about", "index" */
function getCurrentPage() {
  const path = window.location.pathname;
  return path.split('/').pop().replace('.html', '') || 'index';
}

/* Center nav on index, left-align on all other pages */
function applyNavLayout() {
  const nav      = document.querySelector('nav');
  const filename = getCurrentPage();
  if (!nav) return;
  if (filename === 'index') {
    nav.classList.add('nav-center');
  }
}

/* Add .active to the nav item matching the current page */
function markActiveNav() {
  const filename = getCurrentPage();
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.dataset.page === filename) {
      item.classList.add('active');
    }
  });
}

/* Split each nav word into individual letter <span>s */
function buildNavLetters() {
  document.querySelectorAll('.nav-word').forEach(word => {
    word.innerHTML = '';
    word.dataset.word.split('').forEach(ch => {
      const span       = document.createElement('span');
      span.className   = 'nav-letter';
      span.textContent = ch;
      word.appendChild(span);
    });
  });
}


/* ────────────────────────────────────────────────
   SHARED MOUSE POSITION
   Updated by initCursorRing, used by magnetic tick
──────────────────────────────────────────────── */
let mx = -200, my = -200;


/* ────────────────────────────────────────────────
   MAGNETIC LETTERS
   Nav letters are pulled toward the cursor
   and tinted red proportional to proximity.
──────────────────────────────────────────────── */
const RADIUS   = 90;
const STRENGTH = 0.45;
const LERP_T   = 0.085;

function lerp(a, b, t) { return a + (b - a) * t; }

function lerpColorMuted(t) {
  const r = Math.round(lerp(115, 220, t));
  const g = Math.round(lerp(115, 0,   t));
  const b = Math.round(lerp(115, 0,   t));
  return `rgb(${r},${g},${b})`;
}

/* Hero headline letters (index only) use white→red tint */
function lerpColorWhite(t) {
  const r = Math.round(lerp(255, 220, t));
  const g = Math.round(lerp(255, 0,   t));
  const b = Math.round(lerp(255, 0,   t));
  return `rgb(${r},${g},${b})`;
}

function initMagneticLetters() {
  /* Collect nav letters. Hero .char letters are added by index.js */
  const letters = [...document.querySelectorAll('.nav-letter, .hl-word .char')];
  const states  = letters.map(() => ({ x: 0, y: 0, heat: 0 }));

  (function tick() {
    letters.forEach((letter, i) => {
      const rect = letter.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = mx - cx;
      const dy   = my - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let tx = 0, ty = 0, targetHeat = 0;

      if (dist < RADIUS && dist > 0) {
        const force = Math.pow(1 - dist / RADIUS, 1.8);
        tx         = dx * force * STRENGTH;
        ty         = dy * force * STRENGTH;
        targetHeat = force;
      }

      states[i].x    = lerp(states[i].x,    tx,         LERP_T);
      states[i].y    = lerp(states[i].y,    ty,         LERP_T);
      states[i].heat = lerp(states[i].heat, targetHeat, LERP_T * 1.4);

      letter.style.transform = `translate(${states[i].x.toFixed(2)}px, ${states[i].y.toFixed(2)}px)`;

      const h     = states[i].heat;
      const isNav = letter.classList.contains('nav-letter');
      letter.style.color = h > 0.01
        ? (isNav ? lerpColorMuted(h) : lerpColorWhite(h))
        : '';
    });

    requestAnimationFrame(tick);
  })();
}


/* ────────────────────────────────────────────────
   TRAILING CURSOR RING
──────────────────────────────────────────────── */
function initCursorRing() {
  const ring = document.getElementById('cur-ring');
  if (!ring) return;

  let rx = -200, ry = -200;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
  });

  (function lerpRing() {
    rx += (mx - rx) * 0.11;
    ry += (my - ry) * 0.11;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(lerpRing);
  })();

  /*
    Page JS can call window.initRingHover(selectors)
    to register elements that expand the ring on hover.
  */
  window.initRingHover = function(selectors) {
    document.querySelectorAll(selectors).forEach(el => {
      el.addEventListener('mouseenter', () => {
        ring.style.width       = '52px';
        ring.style.height      = '52px';
        ring.style.borderColor = 'rgba(220, 0, 0, 0.4)';
      });
      el.addEventListener('mouseleave', () => {
        ring.style.width       = '36px';
        ring.style.height      = '36px';
        ring.style.borderColor = 'rgba(220, 0, 0, 0.75)';
      });
    });
  };
}
