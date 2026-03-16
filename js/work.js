/* ================================================
   NARMIN — WORK PAGE JAVASCRIPT
   js/work.js  —  solo per le pagine work/
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* Cursor ring hover targets */
  setTimeout(() => {
    if (window.initRingHover) {
      window.initRingHover('.work-next-link, .work-strategy-card, .project-row');
    }
  }, 150);

  /* Fade in sections on scroll */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'none';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.work-section, .work-img-full, .work-img-grid').forEach((el, i) => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.65s ${i * 0.05}s ease, transform 0.65s ${i * 0.05}s ease`;
    observer.observe(el);
  });

});
