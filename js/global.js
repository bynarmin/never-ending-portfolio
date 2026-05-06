/* ================================================
   NARMIN — GLOBAL JAVASCRIPT
   Nav and footer are inlined directly — no fetch(),
   works whether opened via file:// or a server.
   ================================================ */

  // GLOBAL 

const NAV_HTML = `
<nav id="nav">
  <div class="nav-left">
    <a class="nav-item" data-page="index" href="index.html">
      <div class="nav-word" data-word="HOME"></div>
    </a>
    <a class="nav-item" data-page="about" href="about.html">
      <div class="nav-word" data-word="ABOUT"></div>
    </a>
    <a class="nav-item" data-page="contact" href="mailto:design@bynarmin.it">
      <div class="nav-word" data-word="CONTACT"></div>
    </a>
  </div>
</nav>`;

const FOOTER_HTML = `
<footer class="footer">
  <div class="footer-love">Made with love by <em>Narmin</em></div>
  <div class="footer-socials">
    <a href="https://www.linkedin.com/in/narmin-ahmadzadeh/" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="LinkedIn">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="3"/>
        <path d="M7 10v7M7 7v.01M12 10v7M12 13a3 3 0 0 1 6 0v4"/>
      </svg>
    </a>
    <a href="mailto:design@bynarmin.it" class="social-link" aria-label="Email">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="m2 7 10 7 10-7"/>
      </svg>
    </a>
  </div>
</footer>`;

document.addEventListener('DOMContentLoaded', () => {
  const navMount    = document.querySelector('#nav-mount');
  const footerMount = document.querySelector('#footer-mount');
  if (navMount)    navMount.innerHTML    = NAV_HTML;
  if (footerMount) footerMount.innerHTML = FOOTER_HTML;

  applyNavLayout();
  markActiveNav();
  buildNavLetters();
  initMagneticLetters();
  initCursorRing();

  if (getCurrentPage() === 'index') {
    const footer = document.querySelector('.footer');
    if (footer) footer.classList.add('footer-bordered');
  }
});

function getCurrentPage() {
  const file = window.location.pathname.split('/').pop().replace('.html', '');
  return file || 'index';
}

function applyNavLayout() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  if (getCurrentPage() === 'index' || getCurrentPage() === 'about' || getCurrentPage() === 'website-redesign') nav.classList.add('nav-center');
}

function markActiveNav() {
  const page = getCurrentPage();
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === page);
  });
}

function buildNavLetters() {
  document.querySelectorAll('.nav-word').forEach(word => {
    word.innerHTML = '';
    word.dataset.word.split('').forEach(ch => {
      const span = document.createElement('span');
      span.className = 'nav-letter';
      span.textContent = ch;
      word.appendChild(span);
    });
  });
}

let mx = -200, my = -200;
const RADIUS = 90, STRENGTH = 0.45, LERP_T = 0.085;
function lerp(a, b, t) { return a + (b - a) * t; }
function lerpColorMuted(t) { return `rgb(${Math.round(lerp(120,220,t))},${Math.round(lerp(120,0,t))},${Math.round(lerp(120,0,t))})`; }
function lerpColorWhite(t) { return `rgb(${Math.round(lerp(230,220,t))},${Math.round(lerp(230,0,t))},${Math.round(lerp(230,0,t))})`; }

function initMagneticLetters() {
  const letters = [...document.querySelectorAll('.nav-letter, .hl-word .char')];
  const states  = letters.map(() => ({ x: 0, y: 0, heat: 0 }));
  (function tick() {
    letters.forEach((letter, i) => {
      const rect = letter.getBoundingClientRect();
      const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
      const dx = mx - cx, dy = my - cy;
      const dist = Math.sqrt(dx*dx + dy*dy);
      let tx = 0, ty = 0, targetHeat = 0;
      if (dist < RADIUS && dist > 0) {
        const force = Math.pow(1 - dist / RADIUS, 1.8);
        tx = dx * force * STRENGTH; ty = dy * force * STRENGTH; targetHeat = force;
      }
      states[i].x    = lerp(states[i].x,    tx,         LERP_T);
      states[i].y    = lerp(states[i].y,    ty,         LERP_T);
      states[i].heat = lerp(states[i].heat, targetHeat, LERP_T * 1.4);
      letter.style.transform = `translate(${states[i].x.toFixed(2)}px,${states[i].y.toFixed(2)}px)`;
      const h = states[i].heat;
      letter.style.color = h > 0.01 ? (letter.classList.contains('nav-letter') ? lerpColorMuted(h) : lerpColorWhite(h)) : '';
    });
    requestAnimationFrame(tick);
  })();
}

function initCursorRing() {
  const ring = document.getElementById('cur-ring');
  if (!ring) return;
  let rx = -200, ry = -200;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  (function lerpRing() {
    rx += (mx - rx) * 0.11; ry += (my - ry) * 0.11;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(lerpRing);
  })();
  window.initRingHover = function(selectors) {
    document.querySelectorAll(selectors).forEach(el => {
      el.addEventListener('mouseenter', () => { ring.style.width='52px'; ring.style.height='52px'; ring.style.borderColor='rgba(220,0,0,0.4)'; });
      el.addEventListener('mouseleave', () => { ring.style.width='36px'; ring.style.height='36px'; ring.style.borderColor='rgba(220,0,0,0.75)'; });
    });
  };
}