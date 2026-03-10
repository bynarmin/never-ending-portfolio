/* ================================================
   NARMIN — ABOUT PAGE JAVASCRIPT
   js/about.js
   Page-specific only. global.js handles nav,
   footer, cursor, and magnetic letters.
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────────
     1. CURSOR RING — hover targets for this page
  ────────────────────────────────────────────── */
  setTimeout(() => {
    if (window.initRingHover) {
      window.initRingHover(
        '.work-entry, .exp-item, .sidebar-item, .skill-tag, .lang-row'
      );
    }
  }, 150);


  /* ──────────────────────────────────────────────
     2. STAGGER — WORK ENTRIES
  ────────────────────────────────────────────── */
  document.querySelectorAll('.work-entry').forEach((el, i) => {
    el.style.opacity   = '0';
    el.style.transform = 'translateX(-10px)';
    el.style.transition = `
      opacity      0.5s ${0.2 + i * 0.1}s ease,
      transform    0.5s ${0.2 + i * 0.1}s ease,
      padding-left 0.3s ease,
      background   0.3s ease
    `;
    setTimeout(() => {
      el.style.opacity   = '1';
      el.style.transform = 'none';
    }, 50);
  });


  /* ──────────────────────────────────────────────
     3. STAGGER — EXPERTISE ITEMS
  ────────────────────────────────────────────── */
  document.querySelectorAll('.exp-item').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transition = `
      opacity      0.4s ${0.35 + i * 0.07}s ease,
      color        0.2s,
      padding-left 0.25s ease
    `;
    setTimeout(() => {
      el.style.opacity = '1';
    }, 50);
  });


  /* ──────────────────────────────────────────────
     4. STAGGER — SKILL TAGS
  ────────────────────────────────────────────── */
  document.querySelectorAll('.skill-tag').forEach((el, i) => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(8px)';
    el.style.transition = `
      opacity      0.45s ${0.1 + i * 0.05}s ease,
      transform    0.45s ${0.1 + i * 0.05}s ease,
      color        0.2s,
      border-color 0.2s,
      background   0.2s
    `;
    setTimeout(() => {
      el.style.opacity   = '1';
      el.style.transform = 'none';
    }, 80);
  });

});
