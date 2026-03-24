/**
 * AutoVerse — Cinematic Canvas Background
 * Simulates: Night highway, speed-streaked headlights/tail lights,
 *            neon bokeh city lights, motion-blur road lines, atmospheric glow
 * Runs at 60fps, loops seamlessly, zero assets needed.
 */
(function () {
  'use strict';

  const canvas = document.getElementById('cinematicCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, cx, cy;
  let raf;

  // ── Resize ──────────────────────────────────────────────────
  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    cx = W / 2;
    cy = H / 2;
    buildScene();
  }

  // ── Vanishing point (camera perspective) ────────────────────
  const VP = { x: 0.5, y: 0.42 }; // relative coords, updated by subtle drift

  // ── Road Lanes ──────────────────────────────────────────────
  const LANE_COLOR_DASH  = 'rgba(255,210,80,0.55)';
  const LANE_COLOR_SOLID = 'rgba(255,210,80,0.3)';
  const SHOULDER_COLOR   = 'rgba(255,255,255,0.12)';

  // Road geometry – two lanes either side
  const ROAD_EDGES = [-0.38, -0.12, 0.12, 0.38]; // relative to centre, in X fraction at horizon level
  const ROAD_SPREAD = 2.2; // how far they spread at bottom

  // ── Speed streaks (light trails) ────────────────────────────
  class LightStreak {
    constructor() { this.reset(true); }

    reset(initial = false) {
      // Start near vanishing point
      this.lane   = Math.random() < 0.6 ? 'left' : 'right'; // left = head, right = tail
      this.x0rel  = (Math.random() - 0.5) * 0.3; // relative to centre
      this.speed  = Math.random() * 0.018 + 0.006;
      this.length = Math.random() * 0.22 + 0.06;  // in progress units
      this.progress = initial ? Math.random() : 0;
      this.width  = Math.random() * 2.5 + 0.8;
      this.bright = Math.random() * 0.5 + 0.5;
      // head lights: white-blue pair; tail lights: red-orange pair
      if (this.lane === 'left') {
        this.colorA = `rgba(180,220,255,${this.bright * 0.9})`;
        this.colorB = `rgba(100,160,255,${this.bright * 0.7})`;
        this.glowColor = `rgba(100,180,255,`;
      } else {
        this.colorA = `rgba(255,90,30,${this.bright * 0.9})`;
        this.colorB = `rgba(255,50,10,${this.bright * 0.7})`;
        this.glowColor = `rgba(255,80,0,`;
      }
      this.pair   = Math.random() > 0.35; // paired lights
      this.pairOffset = (Math.random() * 0.04 + 0.02);
    }

    // Convert relative road coord → screen XY given progress (0=vp, 1=bottom)
    screenPos(xRel, progress) {
      const vpx = VP.x * W;
      const vpy = VP.y * H;
      const bx  = cx + xRel * W * ROAD_SPREAD;
      const by  = H + H * 0.05;
      return {
        x: vpx + (bx - vpx) * progress,
        y: vpy + (by - vpy) * progress,
      };
    }

    draw() {
      const p1 = Math.max(0, this.progress - this.length);
      const p2 = this.progress;
      if (p2 <= 0) return;

      const tail = this.screenPos(this.x0rel, p1);
      const head = this.screenPos(this.x0rel, p2);
      const lineW = this.width * (1 + this.progress * 4);

      // Main streak
      const grad = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(0.6, this.colorB);
      grad.addColorStop(1,   this.colorA);

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(tail.x, tail.y);
      ctx.lineTo(head.x, head.y);
      ctx.lineWidth  = lineW;
      ctx.strokeStyle = grad;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Glow halo
      ctx.beginPath();
      ctx.moveTo(tail.x, tail.y);
      ctx.lineTo(head.x, head.y);
      ctx.lineWidth   = lineW * 5;
      ctx.strokeStyle = this.glowColor + (0.06 * this.bright) + ')';
      ctx.stroke();
      ctx.restore();

      // Pair
      if (this.pair) {
        const xRel2 = this.x0rel + (this.lane === 'left' ? this.pairOffset : -this.pairOffset);
        const tail2 = this.screenPos(xRel2, p1);
        const head2 = this.screenPos(xRel2, p2);
        const grad2 = ctx.createLinearGradient(tail2.x, tail2.y, head2.x, head2.y);
        grad2.addColorStop(0, 'transparent');
        grad2.addColorStop(0.6, this.colorB);
        grad2.addColorStop(1, this.colorA);
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(tail2.x, tail2.y);
        ctx.lineTo(head2.x, head2.y);
        ctx.lineWidth   = lineW;
        ctx.strokeStyle = grad2;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.restore();
      }
    }

    update() {
      this.progress += this.speed;
      if (this.progress - this.length > 1.05) this.reset();
    }
  }

  // ── Road Dash Lines ─────────────────────────────────────────
  class DashLine {
    constructor(laneX) {
      this.laneX = laneX;
      this.reset(true);
    }

    reset(initial = false) {
      this.progress = initial ? Math.random() : 0;
      this.speed    = 0.018 + Math.random() * 0.004;
      this.dashLen  = 0.06;
    }

    screenPos(xRel, progress) {
      const vpx = VP.x * W;
      const vpy = VP.y * H;
      const bx  = cx + xRel * W * ROAD_SPREAD;
      const by  = H + H * 0.05;
      return {
        x: vpx + (bx - vpx) * progress,
        y: vpy + (by - vpy) * progress,
      };
    }

    draw() {
      // Draw multiple equally-spaced dashes
      const step = 0.14;
      for (let s = 0; s < 1; s += step) {
        const p1 = (this.progress + s) % 1;
        const p2 = Math.min(p1 + this.dashLen, p1 + 0.055);
        if (p1 > 1 || p2 > 1) continue;

        const a = this.screenPos(this.laneX, p1);
        const b = this.screenPos(this.laneX, p2);
        const alpha = Math.pow(p1, 0.5) * 0.6;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.lineWidth   = 1.5 + p1 * 5;
        ctx.strokeStyle = `rgba(255,210,80,${alpha})`;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.restore();
      }
    }

    update() {
      this.progress += this.speed;
      if (this.progress > 1) this.progress -= 1;
    }
  }

  // ── Bokeh City Lights (background) ──────────────────────────
  class BokehLight {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x    = Math.random() * W;
      this.y    = Math.random() * (H * 0.55); // top half only (city skyline)
      this.r    = Math.random() * 28 + 6;
      this.alpha = Math.random() * 0.35 + 0.05;
      this.pulseSpeed = Math.random() * 0.04 + 0.01;
      this.pulsePhase = Math.random() * Math.PI * 2;
      const palette = [
        [0, 180, 255],   // neon blue
        [255, 106, 0],   // neon orange
        [80, 220, 140],  // neon green
        [200, 80, 255],  // neon purple
        [255, 220, 80],  // warm yellow
        [255, 255, 255], // white
      ];
      this.rgb = palette[Math.floor(Math.random() * palette.length)];
      this.lifetime = Math.random() * 800 + 400;
      this.age      = initial ? Math.random() * this.lifetime : 0;
    }

    update(t) {
      this.age++;
      const pulse = Math.sin(t * this.pulseSpeed + this.pulsePhase) * 0.15 + 1;
      this.currentR = this.r * pulse;
      if (this.age > this.lifetime) this.reset();
    }

    draw(t) {
      const lifeFrac = this.age / this.lifetime;
      const fade = lifeFrac < 0.1 ? lifeFrac / 0.1 :
                   lifeFrac > 0.9 ? (1 - lifeFrac) / 0.1 : 1;
      const a = this.alpha * fade;
      if (a < 0.01) return;

      const [r, g, b] = this.rgb;
      const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.currentR);
      grad.addColorStop(0,   `rgba(${r},${g},${b},${a})`);
      grad.addColorStop(0.5, `rgba(${r},${g},${b},${a * 0.4})`);
      grad.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.currentR, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }
  }

  // ── Building Silhouettes ─────────────────────────────────────
  let buildings = [];
  function buildScene() {
    buildings = [];
    const count  = Math.ceil(W / 60) + 4;
    const minH   = H * 0.12;
    const maxH   = H * 0.38;
    let x = -80;
    for (let i = 0; i < count; i++) {
      const w = Math.random() * 50 + 30;
      const h = Math.random() * (maxH - minH) + minH;
      buildings.push({ x, w, h });
      x += w + Math.random() * 10 + 2;
    }
  }

  function drawBuildings() {
    const horizonY = VP.y * H;
    ctx.save();
    buildings.forEach(b => {
      const top = horizonY - b.h;
      // Dark silhouette
      ctx.fillStyle = 'rgba(5,8,14,0.92)';
      ctx.fillRect(b.x, top, b.w, b.h);

      // Neon window grid
      const winW = 5, winH = 5, gapX = 10, gapY = 10;
      for (let wy = top + 10; wy < horizonY - 8; wy += gapY) {
        for (let wx = b.x + 6; wx < b.x + b.w - 6; wx += gapX) {
          if (Math.random() > 0.55) {
            const isBlue   = Math.random() > 0.4;
            const a = Math.random() * 0.4 + 0.1;
            ctx.fillStyle  = isBlue
              ? `rgba(100,180,255,${a})`
              : `rgba(255,200,80,${a})`;
            ctx.fillRect(wx, wy, winW, winH);
          }
        }
      }
    });
    ctx.restore();
  }

  // ── Road Surface ─────────────────────────────────────────────
  function drawRoad() {
    const vpx = VP.x * W;
    const vpy = VP.y * H;

    // Road fill (dark asphalt)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(vpx - 20, vpy);
    ctx.lineTo(vpx + 20, vpy);
    ctx.lineTo(W * 1.5, H + 20);
    ctx.lineTo(-W * 0.5, H + 20);
    ctx.closePath();

    const roadGrad = ctx.createLinearGradient(cx, vpy, cx, H);
    roadGrad.addColorStop(0, '#05080d');
    roadGrad.addColorStop(0.3, '#080c14');
    roadGrad.addColorStop(1, '#0b111c');
    ctx.fillStyle = roadGrad;
    ctx.fill();

    // Road surface reflection (wet road neon sheen)
    const reflGrad = ctx.createLinearGradient(cx, vpy + (H - vpy) * 0.5, cx, H);
    reflGrad.addColorStop(0, 'transparent');
    reflGrad.addColorStop(0.5, 'rgba(0,120,255,0.04)');
    reflGrad.addColorStop(1, 'rgba(0,80,200,0.08)');
    ctx.fillStyle = reflGrad;
    ctx.fill();

    ctx.restore();

    // Road edges (shoulder lines)
    [-0.4, 0.4].forEach(xRel => {
      ctx.save();
      const start = { x: vpx, y: vpy };
      const end   = { x: cx + xRel * W * ROAD_SPREAD, y: H + 20 };
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.lineWidth   = 2.5;
      ctx.strokeStyle = SHOULDER_COLOR;
      ctx.stroke();
      ctx.restore();
    });
  }

  // ── Ground reflection strip ───────────────────────────────────
  function drawGroundGlow() {
    const vpx = VP.x * W;
    const vpy = VP.y * H;

    // orange glow pool (tail lights reflection)
    const og = ctx.createRadialGradient(cx * 0.55, H, 0, cx * 0.55, H, H * 0.4);
    og.addColorStop(0, 'rgba(255,80,0,0.12)');
    og.addColorStop(1, 'transparent');
    ctx.fillStyle = og;
    ctx.fillRect(0, vpy, W, H - vpy);

    // blue glow pool (head lights reflection)
    const bg = ctx.createRadialGradient(cx * 1.45, H, 0, cx * 1.45, H, H * 0.4);
    bg.addColorStop(0, 'rgba(0,150,255,0.10)');
    bg.addColorStop(1, 'transparent');
    ctx.fillStyle = bg;
    ctx.fillRect(0, vpy, W, H - vpy);
  }

  // ── Atmospheric layers ────────────────────────────────────────
  function drawAtmosphere(t) {
    // Sky gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, VP.y * H);
    skyGrad.addColorStop(0,   '#020408');
    skyGrad.addColorStop(0.5, '#040810');
    skyGrad.addColorStop(1,   '#070e1a');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, VP.y * H + 2);

    // Horizon ambient glow
    const hx = VP.x * W;
    const hy = VP.y * H;
    const horizGlow = ctx.createRadialGradient(hx, hy, 0, hx, hy, W * 0.5);
    horizGlow.addColorStop(0,   'rgba(0,100,255,0.18)');
    horizGlow.addColorStop(0.4, 'rgba(0,60,180,0.06)');
    horizGlow.addColorStop(1,   'transparent');
    ctx.fillStyle = horizGlow;
    ctx.fillRect(0, 0, W, hy + H * 0.1);

    // Orange horizon pulse (simulates distant city)
    const osc = Math.sin(t * 0.002) * 0.5 + 0.5;
    const orangeGlow = ctx.createRadialGradient(hx, hy, 0, hx, hy, W * 0.35);
    orangeGlow.addColorStop(0,   `rgba(255,80,0,${0.06 + osc * 0.04})`);
    orangeGlow.addColorStop(0.6, 'transparent');
    ctx.fillStyle = orangeGlow;
    ctx.fillRect(0, hy - H * 0.1, W, H * 0.2);
  }

  // ── Vignette ─────────────────────────────────────────────────
  function drawVignette() {
    const radial = ctx.createRadialGradient(cx, cy, H * 0.15, cx, cy, H * 0.9);
    radial.addColorStop(0,   'transparent');
    radial.addColorStop(0.6, 'rgba(0,0,0,0.15)');
    radial.addColorStop(1,   'rgba(0,0,0,0.75)');
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, W, H);
  }

  // ── Speed Lines (wind blur) ───────────────────────────────────
  function drawSpeedLines(t) {
    ctx.save();
    const count = 18;
    for (let i = 0; i < count; i++) {
      const angle  = (i / count) * Math.PI * 2;
      const dist   = H * (0.28 + Math.sin(t * 0.003 + i * 0.7) * 0.05);
      const len    = Math.random() * 140 + 40;
      const x1 = cx + Math.cos(angle) * dist;
      const y1 = cy + Math.sin(angle) * dist * 0.55;
      const x2 = cx + Math.cos(angle) * (dist + len);
      const y2 = cy + Math.sin(angle) * (dist + len) * 0.55;
      const alpha = 0.015 + Math.sin(t * 0.004 + i) * 0.01;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineWidth   = 0.5;
      ctx.strokeStyle = `rgba(180,220,255,${Math.max(0, alpha)})`;
      ctx.stroke();
    }
    ctx.restore();
  }

  // ── Particles: Stars / dust ───────────────────────────────────
  let stars = [];
  function initStars() {
    stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * W,
      y: Math.random() * VP.y * H * 0.8,
      r: Math.random() * 1.2 + 0.2,
      a: Math.random() * 0.5 + 0.1,
      flicker: Math.random() * 0.05 + 0.01,
      phase: Math.random() * Math.PI * 2,
    }));
  }

  function drawStars(t) {
    stars.forEach(s => {
      const a = s.a * (0.7 + Math.sin(t * s.flicker + s.phase) * 0.3);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,220,255,${a})`;
      ctx.fill();
    });
  }

  // ── Scene objects ─────────────────────────────────────────────
  let streaks  = [];
  let dashes   = [];
  let bokeh    = [];

  function buildSceneObjects() {
    streaks = Array.from({ length: 28 }, () => new LightStreak());
    dashes  = [-0.13, 0.13].map(x => new DashLine(x));
    bokeh   = Array.from({ length: 60 }, () => new BokehLight());
    initStars();
  }

  // ── VP drift (subtle camera sway) ────────────────────────────
  let driftT = 0;
  function updateVP() {
    driftT += 0.004;
    VP.x = 0.5 + Math.sin(driftT * 0.7) * 0.025;
    VP.y = 0.42 + Math.sin(driftT * 0.5 + 1) * 0.012;
  }

  // ── Main render loop ──────────────────────────────────────────
  let t = 0;
  function render() {
    t++;
    updateVP();

    ctx.clearRect(0, 0, W, H);

    drawAtmosphere(t);
    drawStars(t);

    // Bokeh behind buildings
    bokeh.forEach(b => { b.update(t); b.draw(t); });

    drawBuildings();
    drawRoad();
    drawGroundGlow();

    // Dash lane lines
    dashes.forEach(d => { d.update(); d.draw(); });

    // Light streaks
    streaks.forEach(s => { s.update(); s.draw(); });

    drawSpeedLines(t);
    drawVignette();

    raf = requestAnimationFrame(render);
  }

  // ── Init ──────────────────────────────────────────────────────
  window.addEventListener('resize', () => {
    cancelAnimationFrame(raf);
    resize();
    buildSceneObjects();
    render();
  });

  resize();
  buildSceneObjects();
  render();

})();
