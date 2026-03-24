/* ═══════════════════════════════════════════════════════════════
   AutoVerse — Hero JavaScript
   Features: Canvas particles, gauge animation, counter, navbar scroll,
             ticker duplication, hamburger menu
═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── Canvas Particle System ─────────────────────────────────
  const canvas = document.getElementById('heroCanvas');
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], mouseX = 0, mouseY = 0;

  const COLORS = [
    'rgba(0,180,255,',
    'rgba(0,102,255,',
    'rgba(255,106,0,',
  ];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x    = Math.random() * W;
      this.y    = initial ? Math.random() * H : H + 10;
      this.vx   = (Math.random() - 0.5) * 0.4;
      this.vy   = -(Math.random() * 0.6 + 0.2);
      this.size = Math.random() * 2.5 + 0.5;
      this.colorBase = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.alpha = 0;
      this.targetAlpha = Math.random() * 0.6 + 0.1;
      this.life  = 0;
      this.maxLife = Math.random() * 200 + 150;
      // Connection threshold
      this.connRadius = Math.random() * 120 + 60;
    }

    update() {
      // Slight drift toward cursor
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 250) {
        this.vx += dx / dist * 0.008;
        this.vy += dy / dist * 0.008;
      }

      this.vx *= 0.99;
      this.vy *= 0.99;

      this.x += this.vx;
      this.y += this.vy;
      this.life++;

      // Fade in / out
      if (this.life < 40) {
        this.alpha = (this.life / 40) * this.targetAlpha;
      } else if (this.life > this.maxLife - 40) {
        this.alpha = ((this.maxLife - this.life) / 40) * this.targetAlpha;
      } else {
        this.alpha = this.targetAlpha;
      }

      if (this.life >= this.maxLife || this.y < -10 || this.x < -10 || this.x > W + 10) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
      gradient.addColorStop(0, this.colorBase + this.alpha + ')');
      gradient.addColorStop(1, this.colorBase + '0)');
      ctx.fillStyle = gradient;
      ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.fillStyle = this.colorBase + (this.alpha * 1.5) + ')';
      ctx.arc(this.x, this.y, this.size * 0.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const threshold = (particles[i].connRadius + particles[j].connRadius) / 2;
        if (dist < threshold) {
          const opacity = (1 - dist / threshold) * 0.12;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0,180,255,${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function drawHUDLines() {
    // Horizontal scan lines that drift slowly
    const time = Date.now() / 1000;
    for (let i = 0; i < 3; i++) {
      const y = ((time * 30 * (i + 1) * 0.7) % H);
      const grad = ctx.createLinearGradient(0, y, W, y);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(0.4, `rgba(0,180,255,0.03)`);
      grad.addColorStop(0.6, `rgba(0,180,255,0.05)`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, y - 0.5, W, 1);
    }
  }

  function initParticles() {
    particles = [];
    const count = Math.min(Math.floor(W * H / 8000), 100);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawHUDLines();
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => {
    resize();
    initParticles();
  });

  window.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  resize();
  initParticles();
  animate();

  // ─── Animated Gauge Dials ────────────────────────────────────
  const CIRCUMFERENCE = 2 * Math.PI * 80; // r=80 → ≈502.65
  const ARC_FRACTION  = 0.75; // 270° sweep

  function setGauge(fillEl, valEl, percent, maxVal) {
    const offset = CIRCUMFERENCE - (percent * ARC_FRACTION * CIRCUMFERENCE);
    fillEl.style.strokeDashoffset = offset;
    const displayVal = Math.round(percent * maxVal);
    valEl.textContent = displayVal;
  }

  function animateGauges() {
    const leftFill  = document.getElementById('gaugeLeftFill');
    const rightFill = document.getElementById('gaugeRightFill');
    const leftVal   = document.getElementById('gaugeLeftVal');
    const rightVal  = document.getElementById('gaugeRightVal');

    if (!leftFill || !rightFill) return;

    // Start animation sequence
    setTimeout(() => {
      // Needle jumps to ~80% speed and ~65% RPM
      setGauge(leftFill,  leftVal,  0.78, 260);   // 260 km/h max
      setGauge(rightFill, rightVal, 0.62, 8);      // 8K RPM max
    }, 800);

    // Then simulate a driving pulse
    let t = 0;
    setInterval(() => {
      t += 0.035;
      const speedVar = 0.78 + Math.sin(t * 0.7) * 0.08;
      const rpmVar   = 0.62 + Math.sin(t * 1.1 + 1) * 0.12;
      setGauge(leftFill,  leftVal,  Math.max(0.1, Math.min(1, speedVar)), 260);
      setGauge(rightFill, rightVal, Math.max(0.1, Math.min(1, rpmVar)),   8);
    }, 60);
  }

  animateGauges();

  // ─── Navbar Scroll Effect ────────────────────────────────────
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  });

  // ─── Counter Animation (Stats Bar) ──────────────────────────
  function animateCounter(el, target, duration = 2000) {
    const start   = performance.now();
    const startVal = 0;
    const easeOut = t => 1 - Math.pow(1 - t, 3);

    function tick(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const current  = Math.floor(easeOut(progress) * (target - startVal) + startVal);
      el.textContent = current.toLocaleString('en-IN');
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString('en-IN');
    }
    requestAnimationFrame(tick);
  }

  const statsBar = document.getElementById('stats-bar');
  let countersStarted = false;

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !countersStarted) {
      countersStarted = true;
      document.querySelectorAll('.stat-num').forEach(el => {
        const target = parseInt(el.dataset.target, 10);
        animateCounter(el, target);
      });
      observer.disconnect();
    }
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  if (statsBar) {
    observer.observe(statsBar);
  } else {
    document.querySelectorAll('.stat-num').forEach(el => {
      animateCounter(el, parseInt(el.dataset.target, 10));
    });
  }

  // ─── Ticker: duplicate items for seamless loop ───────────────
  const tickerItems = document.getElementById('tickerItems');
  if (tickerItems) {
    tickerItems.innerHTML += tickerItems.innerHTML;
  }

  // ─── Hamburger Menu ─────────────────────────────────────────
  const hamburger  = document.getElementById('hamburger');
  const navLinks   = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('nav-open');
      hamburger.setAttribute('aria-expanded', open);
    });
  }

  // ─── Scroll Cue click ────────────────────────────────────────
  const scrollCue = document.getElementById('scroll-cue');
  if (scrollCue) {
    scrollCue.addEventListener('click', () => {
      const statsSection = document.getElementById('stats-bar');
      if (statsSection) {
        statsSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // ─── Page entry: stagger floating-stat chips ────────────────
  document.querySelectorAll('.floating-stat').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    setTimeout(() => {
      el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      el.style.opacity = '1';
      el.style.transform = '';
    }, 1000 + i * 300);
  });

})();
