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

    // Start music after user tap (this enables AudioContext)
    setTimeout(startMusic, 800);

    // Transition to main
    setTimeout(() => {
      mainScreen.classList.add('show');
      envelopeScreen.classList.add('hide');
      initParticles();
      animateHeroItems();
      initScrollObserver();
      startCountdown();
      document.getElementById('musicBtn').classList.add('show');
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

  // ============================================
  // ===== BACKGROUND MUSIC (Web Audio API) =====
  // ============================================
  let audioCtx = null;
  let musicPlaying = false;
  let loopTimer = null;
  let masterGain = null;
  let reverbGain = null;

  // Note frequencies
  const N = {
    C3:130.81, D3:146.83, E3:164.81, F3:174.61, G3:196.00, A3:220.00, B3:246.94,
    C4:261.63, D4:293.66, E4:329.63, F4:349.23, G4:392.00, A4:440.00, B4:493.88,
    C5:523.25, D5:587.33, E5:659.25
  };

  // Chord progression: C - Am - F - G (emotional, farewell feel)
  const progression = [
    { chord: [N.C3, N.C4, N.E4, N.G4],      melody: [N.E5, N.D5, N.C5, N.E5] },
    { chord: [N.A3, N.C4, N.E4, N.A4],       melody: [N.C5, N.B4, N.A4, N.C5] },
    { chord: [N.F3, N.F4, N.A4, N.C5],       melody: [N.A4, N.C5, N.D5, N.C5] },
    { chord: [N.G3, N.G4, N.B4, N.D5],       melody: [N.B4, N.D5, N.C5, N.B4] },
    { chord: [N.C3, N.C4, N.E4, N.G4],       melody: [N.C5, N.E5, N.D5, N.C5] },
    { chord: [N.E3, N.E4, N.G4, N.B4],       melody: [N.E5, N.D5, N.B4, N.E5] },
    { chord: [N.F3, N.F4, N.A4, N.C5],       melody: [N.C5, N.A4, N.C5, N.D5] },
    { chord: [N.G3, N.G4, N.B4, N.D5],       melody: [N.D5, N.B4, N.G4, N.A4] },
  ];

  function playTone(freq, startTime, duration, volume, type) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    // Add slight vibrato for warmth
    const vibrato = audioCtx.createOscillator();
    const vibratoGain = audioCtx.createGain();
    vibrato.frequency.value = 5;
    vibratoGain.gain.value = 1.5;
    vibrato.connect(vibratoGain);
    vibratoGain.connect(osc.frequency);
    vibrato.start(startTime);
    vibrato.stop(startTime + duration + 0.2);

    osc.connect(gain);
    gain.connect(masterGain);

    // Piano-like ADSR envelope
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(volume * 0.5, startTime + 0.08);
    gain.gain.exponentialRampToValueAtTime(volume * 0.25, startTime + duration * 0.5);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);

    // Add 2nd harmonic for richness
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, startTime);
    osc2.connect(gain2);
    gain2.connect(masterGain);
    gain2.gain.setValueAtTime(0, startTime);
    gain2.gain.linearRampToValueAtTime(volume * 0.15, startTime + 0.01);
    gain2.gain.exponentialRampToValueAtTime(0.001, startTime + duration * 0.7);
    osc2.start(startTime);
    osc2.stop(startTime + duration + 0.05);
  }

  function playSection() {
    if (!musicPlaying || !audioCtx) return;

    const now = audioCtx.currentTime + 0.05;
    const beatLen = 2.8; // seconds per chord

    progression.forEach((bar, i) => {
      const barStart = now + i * beatLen;

      // Arpeggiated chord (notes staggered)
      bar.chord.forEach((freq, j) => {
        playTone(freq, barStart + j * 0.1, beatLen * 0.85, 0.08, 'sine');
      });

      // Melody notes
      bar.melody.forEach((freq, j) => {
        const noteStart = barStart + j * (beatLen / 4) + 0.05;
        playTone(freq, noteStart, beatLen / 4.5, 0.06, 'triangle');
      });

      // Soft bass
      playTone(bar.chord[0] * 0.5, barStart, beatLen * 0.9, 0.04, 'sine');
    });

    const totalLen = progression.length * beatLen;
    loopTimer = setTimeout(playSection, (totalLen - 0.3) * 1000);
  }

  function startMusic() {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }

      // Resume context (required after user gesture)
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      if (!masterGain) {
        masterGain = audioCtx.createGain();
        masterGain.gain.value = 0.5;
        masterGain.connect(audioCtx.destination);
      }

      musicPlaying = true;
      document.getElementById('musicBtn').classList.add('playing');
      playSection();
    } catch (err) {
      console.log('Music error:', err);
    }
  }

  function stopMusic() {
    musicPlaying = false;
    document.getElementById('musicBtn').classList.remove('playing');
    if (loopTimer) {
      clearTimeout(loopTimer);
      loopTimer = null;
    }
    // Fade out
    if (masterGain && audioCtx) {
      masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.4);
      setTimeout(() => {
        if (masterGain) masterGain.gain.value = 0.5;
      }, 500);
    }
  }

  // Toggle button
  document.getElementById('musicBtn').addEventListener('click', function () {
    if (musicPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  });

})();
