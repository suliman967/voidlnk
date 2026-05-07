/* ============================================================
   SCROLL.JS — IntersectionObserver reveal system
   ============================================================ */
(function () {
  // Trigger hero reveals immediately on load
  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      document.querySelectorAll('.hero .reveal').forEach(el => {
        el.classList.add('visible');
      });
    }, 100);
  });

  // All other reveals on scroll
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // fire once
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px'
    }
  );

  document.querySelectorAll('.reveal:not(.hero .reveal)').forEach(el => {
    observer.observe(el);
  });
})();
