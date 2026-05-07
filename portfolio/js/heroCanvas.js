/* ============================================================
   THREE-SCENE.JS — premium 3D wave ribbon scene
   CUSTOMIZE: colors, speed, wireframe look via constants below
   ============================================================ */
(function () {
  if (typeof THREE === 'undefined') return;

  function init() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    const section = document.getElementById('hero');

    // ── CUSTOMIZE: scene parameters ──────────────────────────────
    const isMobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 600;
    const PARAMS = {
      particleCount : 3200,      // number of particles
      spread        : 15,        // XZ spread radius
      waveSpeed     : 0.0006,    // animation speed
      waveAmplitude : 1.6,       // vertical wave height
      waveFrequency : 0.55,      // wave tightness
      colorA        : 0xc9a96e,  // gold (accent)
      colorB        : 0x3d2e1a,  // dark gold
      particleSize  : 0.025,     // dot size
      mouseStrength : isMobile ? 0 : 0.6, // disable on mobile
    };

    // ── RENDERER ─────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      precision: 'highp',
      powerPreference: 'high-performance',
    });
    renderer.setClearColor(0x000000, 0);

    // ── SCENE & CAMERA ────────────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.set(0, 1.5, 10);
    camera.lookAt(0, 0, 0);

    // ── PARTICLES ─────────────────────────────────────────────────
    const positions = new Float32Array(PARAMS.particleCount * 3);
    const colors    = new Float32Array(PARAMS.particleCount * 3);
    const cA = new THREE.Color(PARAMS.colorA);
    const cB = new THREE.Color(PARAMS.colorB);

    for (let i = 0; i < PARAMS.particleCount; i++) {
      const i3 = i * 3;
      positions[i3]     = (Math.random() - 0.5) * PARAMS.spread;
      positions[i3 + 1] = 0;
      positions[i3 + 2] = (Math.random() - 0.5) * PARAMS.spread;

      const t = Math.random();
      const c = cB.clone().lerp(cA, t);
      colors[i3]     = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size:         PARAMS.particleSize,
      vertexColors: true,
      transparent:  true,
      opacity:      0.75,
      depthWrite:   false,
      blending:     THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // ── MOUSE TRACKING ────────────────────────────────────────────
    let mouseX = 0, mouseY = 0;
    if (!isMobile && section) {
      section.addEventListener('mousemove', (e) => {
        const rect = section.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        mouseX = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
        mouseY = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
      });
    }

    function getDisplaySize() {
      const parent = canvas.parentElement;
      let width = parent ? parent.clientWidth : canvas.clientWidth;
      let height = parent ? parent.clientHeight : canvas.clientHeight;

      if (width <= 0 || height <= 0) {
        const rect = canvas.getBoundingClientRect();
        width = rect.width || width || window.innerWidth;
        height = rect.height || height || window.innerHeight;
      }

      return {
        width: Math.max(1, Math.round(width)),
        height: Math.max(1, Math.round(height)),
      };
    }

    function resize() {
      const { width, height } = getDisplaySize();
      const pixelRatio = Math.min(Math.max(window.devicePixelRatio || 1, 1), 2);
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });

    // ── ANIMATION LOOP ────────────────────────────────────────────
    let t = 0;
    const pos = geometry.attributes.position;

    function animate() {
      requestAnimationFrame(animate);
      t += PARAMS.waveSpeed;

      for (let i = 0; i < PARAMS.particleCount; i++) {
        const i3 = i * 3;
        const x  = pos.array[i3];
        const z  = pos.array[i3 + 2];
        pos.array[i3 + 1] =
          Math.sin(x * PARAMS.waveFrequency + t) *
          Math.cos(z * PARAMS.waveFrequency + t * 0.7) *
          PARAMS.waveAmplitude;
      }
      pos.needsUpdate = true;

      camera.position.x += (mouseX * PARAMS.mouseStrength - camera.position.x) * 0.04;
      camera.position.y += (-mouseY * PARAMS.mouseStrength + 1.5 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      points.rotation.y += 0.0003;
      renderer.render(scene, camera);
    }

    animate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
