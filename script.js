// =============================================
// K.U.T.T.I. FAREWELL PARTY - ANIMATED INVITATION
// =============================================

(function () {
  'use strict';

  // ===== SPARKLES ON ENVELOPE SCREEN =====
  const sparklesCanvas = document.getElementById('sparkles');
  const sCtx = sparklesCanvas.getContext('2d');
  let sparkles = [];

  function resizeSparkles() {
    sparklesCanvas.width = window.innerWidth;
    sparklesCanvas.height = window.innerHeight;
  }
  resizeSparkles();
  window.addEventListener('resize', resizeSparkles);

  class Sparkle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * sparklesCanvas.width;
      this.y = Math.random() * sparklesCanvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedY = -(Math.random() * 0.3 + 0.1);
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.6 + 0.2;
      this.twinkle = Math.random() * Math.PI * 2;
      this.twinkleSpeed = Math.random() * 0.04 + 0.01;
      this.color = ['#d4a853', '#f0d48a', '#e94560', '#a87fd4', '#fff'][Math.floor(Math.random() * 5)];
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.twinkle += this.twinkleSpeed;
      if (this.y < -10 || this.x < -10 || this.x > sparklesCanvas.width + 10) this.reset();
    }
    draw() {
      const alpha = this.opacity * (0.4 + Math.sin(this.twinkle) * 0.6);
      sCtx.save();
      sCtx.globalAlpha = alpha;
      sCtx.fillStyle = this.color;

      // Draw star shape
      sCtx.beginPath();
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const outerX = this.x + Math.cos(angle) * this.size * 2;
        const outerY = this.y + Math.sin(angle) * this.size * 2;
        const innerAngle = angle + Math.PI / 4;
        const innerX = this.x + Math.cos(innerAngle) * this.size * 0.5;
        const innerY = this.y + Math.sin(innerAngle) * this.size * 0.5;
        if (i === 0) sCtx.moveTo(outerX, outerY);
        else sCtx.lineTo(outerX, outerY);
        sCtx.lineTo(innerX, innerY);
      }
      sCtx.closePath();
      sCtx.fill();
      sCtx.restore();
    }
  }

  const sparkleCount = window.innerWidth < 768 ? 50 : 100;
  for (let i = 0; i < sparkleCount; i++) sparkles.push(new Sparkle());

  function animateSparkles() {
    if (document.getElementById('envelopeScreen').classList.contains('hide')) return;
    sCtx.clearRect(0, 0, sparklesCanvas.width, sparklesCanvas.height);
    sparkles.forEach(s => { s.update(); s.draw(); });
    requestAnimationFrame(animateSparkles);
  }
  animateSparkles();

  // ===== ENVELOPE INTERACTION =====
  const envelope = document.getElementById('envelope');
  const envelopeScreen = document.getElementById('envelopeScreen');
  const mainScreen = document.getElementById('mainScreen');
  const tapHint = document.getElementById('tapHint');
  let opened = false;

  function openEnvelope() {
    if (opened) return;
    opened = true;

    envelope.style.animation = 'none';
    envelope.classList.add('opened');
    tapHint.style.opacity = '0';
    tapHint.style.transition = 'opacity 0.3s';

    // Launch confetti
    setTimeout(launchConfetti, 600);

    // Transition to main
    setTimeout(() => {
      mainScreen.classList.add('show');
      envelopeScreen.classList.add('hide');
      initParticles();
      animateHeroItems();
      initScrollObserver();
      startCountdown();
    }, 1400);
  }

  envelope.addEventListener('click', openEnvelope);

  // Also allow tap anywhere on envelope screen
  envelopeScreen.addEventListener('click', (e) => {
    if (e.target === envelopeScreen || e.target.closest('.envelope-center')) {
      openEnvelope();
    }
  });

  // ===== CONFETTI =====
  function launchConfetti() {
    const colors = ['#d4a853', '#e94560', '#764ba2', '#a87fd4', '#4ecdc4', '#ff6b6b', '#feca57', '#45b7d1', '#f0d48a'];
    const container = document.getElementById('confettiContainer');

    for (let i = 0; i < 80; i++) {
      setTimeout(() => {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + 'vw';
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];

        const size = Math.random() * 12 + 5;
        piece.style.width = size + 'px';
        piece.style.height = size * (Math.random() * 0.6 + 0.4) + 'px';

        const shapes = ['50%', '2px', '0'];
        piece.style.borderRadius = shapes[Math.floor(Math.random() * shapes.length)];
        piece.style.animationDuration = (Math.random() * 2.5 + 2) + 's';

        document.body.appendChild(piece);
        setTimeout(() => piece.remove(), 5000);
      }, i * 25);
    }
  }

  // ===== PARTICLES (main screen) =====
  const pCanvas = document.getElementById('particles');
  const pCtx = pCanvas.getContext('2d');
  let dots = [];

  function resizeParticles() {
    pCanvas.width = window.innerWidth;
    pCanvas.height = window.innerHeight;
  }

  class Dot {
    constructor() {
      this.x = Math.random() * pCanvas.width;
      this.y = Math.random() * pCanvas.height;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.r = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.3 + 0.1;
      this.color = ['#d4a853', '#a87fd4', '#e94560'][Math.floor(Math.random() * 3)];
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0) this.x = pCanvas.width;
      if (this.x > pCanvas.width) this.x = 0;
      if (this.y < 0) this.y = pCanvas.height;
      if (this.y > pCanvas.height) this.y = 0;
    }
    draw() {
      pCtx.beginPath();
      pCtx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      pCtx.fillStyle = this.color;
      pCtx.globalAlpha = this.alpha;
      pCtx.fill();
      pCtx.globalAlpha = 1;
    }
  }

  function initParticles() {
    resizeParticles();
    window.addEventListener('resize', resizeParticles);
    const count = window.innerWidth < 768 ? 35 : 70;
    for (let i = 0; i < count; i++) dots.push(new Dot());
    animateDots();
  }

  function animateDots() {
    pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
    dots.forEach(d => { d.update(); d.draw(); });

    // Lines
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          pCtx.beginPath();
          pCtx.moveTo(dots[i].x, dots[i].y);
          pCtx.lineTo(dots[j].x, dots[j].y);
          pCtx.strokeStyle = '#d4a853';
          pCtx.globalAlpha = 0.025 * (1 - dist / 100);
          pCtx.lineWidth = 0.5;
          pCtx.stroke();
          pCtx.globalAlpha = 1;
        }
      }
    }
    requestAnimationFrame(animateDots);
  }

  // ===== HERO ITEM ANIMATIONS =====
  function animateHeroItems() {
    const items = document.querySelectorAll('.anim-item');
    items.forEach(item => {
      const delay = parseInt(item.getAttribute('data-delay') || 0);
      setTimeout(() => item.classList.add('animate'), delay);
    });
  }

  // ===== SCROLL REVEAL =====
  function initScrollObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.getAttribute('data-delay') || 0);
          setTimeout(() => entry.target.classList.add('visible'), delay);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
  }

  // ===== COUNTDOWN =====
  function startCountdown() {
    const target = new Date('April 18, 2026 10:00:00').getTime();

    function tick() {
      const now = Date.now();
      const diff = Math.max(0, target - now);

      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);

      animateNumber('days', d);
      animateNumber('hours', h);
      animateNumber('minutes', m);
      animateNumber('seconds', s);
    }

    function animateNumber(id, value) {
      const el = document.getElementById(id);
      const str = String(value).padStart(2, '0');
      if (el.textContent !== str) {
        el.style.transform = 'translateY(-8px)';
        el.style.opacity = '0.3';
        setTimeout(() => {
          el.textContent = str;
          el.style.transform = 'translateY(0)';
          el.style.opacity = '1';
        }, 150);
      }
    }

    tick();
    setInterval(tick, 1000);
  }

  // ===== PARALLAX ON SCROLL =====
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        document.querySelectorAll('.fshape').forEach((s, i) => {
          s.style.transform = `translateY(${y * 0.02 * (i + 1)}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  });

})();
