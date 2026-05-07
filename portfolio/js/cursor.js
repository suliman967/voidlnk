/* ============================================================
   CURSOR.JS — custom cursor tracking
   ============================================================ */
(function () {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;

  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches ||
                        navigator.maxTouchPoints > 0 ||
                        'ontouchstart' in window;
  if (isTouchDevice) {
    cursor.style.display = 'none';
    follower.style.display = 'none';
    document.body.style.cursor = 'auto';
    return;
  }

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;
  let raf;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Smooth follower with lerp
  function lerp(a, b, t) { return a + (b - a) * t; }
  function animateFollower() {
    followerX = lerp(followerX, mouseX, 0.1);
    followerY = lerp(followerY, mouseY, 0.1);
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    raf = requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover state on interactive elements
  const hoverTargets = 'a, button, .service-card, .case-study, .btn, .arrow-link';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor--hover');
      follower.classList.add('cursor-follower--hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor--hover');
      follower.classList.remove('cursor-follower--hover');
    });
  });

  // Hide when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    follower.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    follower.style.opacity = '1';
  });
})();
