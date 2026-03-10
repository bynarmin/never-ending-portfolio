/* ================================================
   NARMIN — INDEX (HOME) PAGE JAVASCRIPT
   js/index.js
   Page-specific only. global.js handles nav,
   footer, cursor, and magnetic letters.
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────────
     1. BUILD HERO HEADLINE LETTER SPANS
     Splits each .hl-word into individual .char
     spans so the magnetic effect in global.js
     can target them.
     Must run before global.js's magneticTick
     collects '.hl-word .char' — both are
     DOMContentLoaded listeners so order matters.
     index.js is loaded AFTER global.js in HTML,
     so global.js fires first. We rebuild the
     letter list after a microtask to be safe.
  ────────────────────────────────────────────── */
  document.querySelectorAll('.hl-word').forEach(el => {
    const text = el.getAttribute('data-text');
    el.innerHTML = text.split('').map(ch =>
      `<span class="char">${ch === ' ' ? '&nbsp;' : ch}</span>`
    ).join('');
  });


  /* ──────────────────────────────────────────────
     2. CURSOR RING — hover targets for this page
  ────────────────────────────────────────────── */
  setTimeout(() => {
    if (window.initRingHover) {
      window.initRingHover('.skill-row, .project-row');
    }
  }, 150);


  /* ──────────────────────────────────────────────
     3. STAGGER — SKILL ROWS
     Fade + slide in from left with cascading delay.
  ────────────────────────────────────────────── */
  document.querySelectorAll('.skill-row').forEach((el, i) => {
    el.style.opacity   = '0';
    el.style.transform = 'translateX(-12px)';
    requestAnimationFrame(() => {
      el.style.transition = `
        opacity      0.5s ${0.65 + i * 0.09}s ease,
        transform    0.5s ${0.65 + i * 0.09}s ease,
        color        0.2s,
        padding-left 0.25s ease
      `;
      el.style.opacity   = '1';
      el.style.transform = 'none';
    });
  });


  /* ──────────────────────────────────────────────
     4. STAGGER — PROJECT ROWS
     Fade + slide up with cascading delay.
  ────────────────────────────────────────────── */
  document.querySelectorAll('.project-row').forEach((el, i) => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = `
      opacity   0.55s ${0.05 + i * 0.09}s ease,
      transform 0.55s ${0.05 + i * 0.09}s ease
    `;
    setTimeout(() => {
      el.style.opacity   = '1';
      el.style.transform = 'none';
    }, 50);
  });

});
