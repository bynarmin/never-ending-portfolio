/* ================================================
   NARMIN — ABOUT PAGE JS
   Page-load reveal transition + hover targets
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────────
     1. PAGE REVEAL — right column fades + slides in,
        sections stagger in after it
  ────────────────────────────────────────────── */
  const right = document.querySelector('.about-right');
  const left  = document.querySelector('.about-left');

  /* Left portrait fades in */
  if (left) {
    left.style.opacity  = '0';
    left.style.transition = 'opacity 1s 0.1s ease';
    requestAnimationFrame(() => {
      setTimeout(() => { left.style.opacity = '1'; }, 30);
    });
  }

  /* Right column base reveal */
  if (right) {
    requestAnimationFrame(() => {
      setTimeout(() => { right.classList.add('revealed'); }, 30);
    });
  }

  /* Stagger sections inside right column */
  const staggerItems = document.querySelectorAll('.ar-section, .ar-bottom');
  staggerItems.forEach((el, i) => {
    el.style.transition = `
      opacity   0.65s ${0.25 + i * 0.12}s ease,
      transform 0.65s ${0.25 + i * 0.12}s cubic-bezier(0.16, 1, 0.3, 1)
    `;
    requestAnimationFrame(() => {
      setTimeout(() => { el.classList.add('revealed'); }, 30);
    });
  });


  /* ──────────────────────────────────────────────
     2. CURSOR RING — hover targets
  ────────────────────────────────────────────── */
  setTimeout(() => {
    if (window.initRingHover) {
      window.initRingHover('.ar-exp-item, .ar-edu-item, .ar-list-item, .ar-link');
    }
  }, 200);

});
