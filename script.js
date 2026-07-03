// ============================================
// FIELD CANVAS — animated NDVI-style noise field
// ============================================
(function fieldCanvas() {
  const canvas = document.getElementById('fieldCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let w, h, cols, rows, cellSize = 26;
  let t = 0;

  const palette = ['#3c2a19', '#6b4527', '#8a6a35', '#b5893f', '#d3a24c', '#8a9a4f', '#6b8e4e', '#4f6b3a'];

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    w = canvas.width = rect.width;
    h = canvas.height = rect.height;
    cols = Math.ceil(w / cellSize) + 1;
    rows = Math.ceil(h / cellSize) + 1;
  }

  function noise(x, y, t) {
    return (
      Math.sin(x * 0.15 + t) * Math.cos(y * 0.12 - t * 0.7) +
      Math.sin((x + y) * 0.08 + t * 0.5)
    ) / 2;
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const n = noise(i, j, t);
        const idx = Math.floor(((n + 1) / 2) * (palette.length - 1));
        ctx.fillStyle = palette[Math.max(0, Math.min(palette.length - 1, idx))];
        ctx.globalAlpha = 0.55;
        ctx.fillRect(i * cellSize, j * cellSize, cellSize - 2, cellSize - 2);
      }
    }
    // dark gradient overlay for legibility of text on top
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, 'rgba(20,18,14,0.35)');
    grad.addColorStop(0.6, 'rgba(20,18,14,0.55)');
    grad.addColorStop(1, 'rgba(20,18,14,0.92)');
    ctx.globalAlpha = 1;
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }

  function loop() {
    t += 0.006;
    draw();
    if (!reduceMotion) requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { resize(); draw(); });
  resize();
  if (reduceMotion) {
    draw();
  } else {
    requestAnimationFrame(loop);
  }
})();

// ============================================
// LAYER NAV — sidebar + topbar act as scroll nav
// with active-layer highlighting via IntersectionObserver
// ============================================
(function layerNav() {
  const layers = document.querySelectorAll('.layer');
  const topLinks = document.querySelectorAll('.topbar__link');
  const sections = ['sobre-mi', 'proyectos', 'stack', 'contacto']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  function goTo(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  layers.forEach(layer => {
    layer.addEventListener('click', () => goTo(layer.dataset.target));
  });
  topLinks.forEach(link => {
    link.addEventListener('click', () => goTo(link.dataset.nav));
  });

  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          layers.forEach(l => l.classList.toggle('is-active', l.dataset.target === id));
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

    sections.forEach(sec => observer.observe(sec));
  }
})();

// ============================================
// STATUS BAR — live fake lat/lon readout on mousemove
// bounding box roughly around Corrientes, AR
// ============================================
(function statusCoords() {
  const el = document.getElementById('statusCoords');
  if (!el) return;

  const bounds = { latMin: -27.55, latMax: -27.40, lonMin: -58.90, lonMax: -58.75 };

  function update(clientX, clientY) {
    const fx = clientX / window.innerWidth;
    const fy = clientY / window.innerHeight;
    const lat = bounds.latMax - fy * (bounds.latMax - bounds.latMin);
    const lon = bounds.lonMin + fx * (bounds.lonMax - bounds.lonMin);
    el.textContent = `LAT ${lat.toFixed(5)} · LON ${lon.toFixed(5)}`;
  }

  window.addEventListener('mousemove', (e) => update(e.clientX, e.clientY));
})();

// ============================================
// CV EXPORT BUTTON — placeholder hook.
// Replace href target below with a hosted CV file/link.
// ============================================
(function cvButton() {
  const btn = document.getElementById('cvBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    window.open('https://docs.google.com/document/d/1RIg4hJcXpaS64cxuAKWCAhXzGpiZWMkYvgTGkM6fd_4/export?format=pdf', '_blank');
  });
})();
