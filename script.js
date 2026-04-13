// =============================================
// K.U.T.T.I. FAREWELL PARTY - PREMIUM EDITION
// =============================================

(function () {
  'use strict';

  // ===== SPARKLES (Envelope Screen) =====
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
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * sparklesCanvas.width;
      this.y = Math.random() * sparklesCanvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedY = -(Math.random() * 0.25 + 0.05);
      this.speedX = (Math.random() - 0.5) * 0.2;
      this.opacity = Math.random() * 0.5 + 0.2;
      this.twinkle = Math.random() * Math.PI * 2;
      this.twinkleSpeed = Math.random() * 0.03 + 0.01;
      this.color = ['#d4a853','#f0d48a','#e94560','#a87fd4','#fff','#fff'][Math.floor(Math.random() * 6)];
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.twinkle += this.twinkleSpeed;
      if (this.y < -10 || this.x < -10 || this.x > sparklesCanvas.width + 10) {
        this.reset();
        this.y = sparklesCanvas.height + 10;
      }
    }
    draw() {
      const a = this.opacity * (0.3 + Math.sin(this.twinkle) * 0.7);
      sCtx.save();
      sCtx.globalAlpha = a;
      sCtx.fillStyle = this.color;
      // Star shape
      const s = this.size;
      sCtx.beginPath();
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const ox = this.x + Math.cos(angle) * s * 2.5;
        const oy = this.y + Math.sin(angle) * s * 2.5;
        const ia = angle + Math.PI / 4;
        const ix = this.x + Math.cos(ia) * s * 0.6;
        const iy = this.y + Math.sin(ia) * s * 0.6;
        if (i === 0) sCtx.moveTo(ox, oy);
        else sCtx.lineTo(ox, oy);
        sCtx.lineTo(ix, iy);
      }
      sCtx.closePath();
      sCtx.fill();
      // Glow
      sCtx.shadowColor = this.color;
      sCtx.shadowBlur = s * 4;
      sCtx.fill();
      sCtx.restore();
    }
  }

  const sCount = window.innerWidth < 768 ? 60 : 120;
  for (let i = 0; i < sCount; i++) sparkles.push(new Sparkle());

  function animateSparkles() {
    if (document.getElementById('envelopeScreen').classList.contains('hide')) return;
    sCtx.clearRect(0, 0, sparklesCanvas.width, sparklesCanvas.height);
    sparkles.forEach(s => { s.update(); s.draw(); });
    requestAnimationFrame(animateSparkles);
  }
  animateSparkles();

  // ===== ENVELOPE =====
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
    tapHint.style.transition = 'opacity 0.4s';

    setTimeout(launchConfetti, 700);
    setTimeout(startMusic, 900);

    setTimeout(() => {
      mainScreen.classList.add('show');
      envelopeScreen.classList.add('hide');
      initParticles();
      animateHeroItems();
      initScrollObserver();
      startCountdown();
      startTypewriter();
      document.getElementById('musicBtn').classList.add('show');
    }, 1500);
  }

  envelope.addEventListener('click', openEnvelope);
  envelopeScreen.addEventListener('click', (e) => {
    if (e.target === envelopeScreen || e.target.closest('.envelope-center')) openEnvelope();
  });

  // ===== CONFETTI =====
  function launchConfetti() {
    const colors = ['#d4a853','#f0d48a','#e94560','#764ba2','#a87fd4','#4ecdc4','#ff6b6b','#feca57','#45b7d1','#fff'];
    for (let i = 0; i < 100; i++) {
      setTimeout(() => {
        const p = document.createElement('div');
        p.className = 'confetti-piece';
        p.style.left = Math.random() * 100 + 'vw';
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        const sz = Math.random() * 12 + 5;
        p.style.width = sz + 'px';
        p.style.height = sz * (Math.random() * 0.5 + 0.3) + 'px';
        p.style.borderRadius = ['50%','2px','0','50% 0'][Math.floor(Math.random() * 4)];
        p.style.animationDuration = (Math.random() * 2.5 + 2.5) + 's';
        p.style.opacity = Math.random() * 0.5 + 0.5;
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 5500);
      }, i * 20);
    }
  }

  // ===== TYPEWRITER =====
  function startTypewriter() {
    const text = 'A celebration of memories, friendships & new beginnings';
    const el = document.getElementById('typewriter');
    let i = 0;
    function type() {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        setTimeout(type, 45);
      }
    }
    setTimeout(type, 1200);
  }

  // ===== PARTICLES (Main Screen) =====
  const pCanvas = document.getElementById('particles');
  const pCtx = pCanvas.getContext('2d');
  let dots = [];

  function resizeP() {
    pCanvas.width = window.innerWidth;
    pCanvas.height = window.innerHeight;
  }

  class Dot {
    constructor() {
      this.x = Math.random() * pCanvas.width;
      this.y = Math.random() * pCanvas.height;
      this.vx = (Math.random() - 0.5) * 0.25;
      this.vy = (Math.random() - 0.5) * 0.25;
      this.r = Math.random() * 1.8 + 0.3;
      this.alpha = Math.random() * 0.35 + 0.05;
      this.color = ['#d4a853','#a87fd4','#e94560','#fff'][Math.floor(Math.random() * 4)];
    }
    update() {
      this.x += this.vx; this.y += this.vy;
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
    resizeP();
    window.addEventListener('resize', resizeP);
    const n = window.innerWidth < 768 ? 40 : 80;
    for (let i = 0; i < n; i++) dots.push(new Dot());
    animateDots();
  }

  function animateDots() {
    pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
    dots.forEach(d => { d.update(); d.draw(); });
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          pCtx.beginPath();
          pCtx.moveTo(dots[i].x, dots[i].y);
          pCtx.lineTo(dots[j].x, dots[j].y);
          pCtx.strokeStyle = '#d4a853';
          pCtx.globalAlpha = 0.02 * (1 - dist / 110);
          pCtx.lineWidth = 0.5;
          pCtx.stroke();
          pCtx.globalAlpha = 1;
        }
      }
    }
    requestAnimationFrame(animateDots);
  }

  // ===== HERO ANIMATIONS =====
  function animateHeroItems() {
    document.querySelectorAll('.anim-item').forEach(item => {
      const d = parseInt(item.getAttribute('data-delay') || 0);
      setTimeout(() => item.classList.add('animate'), d);
    });
  }

  // ===== SCROLL REVEAL =====
  function initScrollObserver() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const d = parseInt(e.target.getAttribute('data-delay') || 0);
          setTimeout(() => e.target.classList.add('visible'), d);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    document.querySelectorAll('.scroll-reveal').forEach(el => obs.observe(el));
  }

  // ===== COUNTDOWN =====
  function startCountdown() {
    const target = new Date('April 18, 2026 10:00:00').getTime();
    function tick() {
      const diff = Math.max(0, target - Date.now());
      anim('days', Math.floor(diff / 86400000));
      anim('hours', Math.floor((diff % 86400000) / 3600000));
      anim('minutes', Math.floor((diff % 3600000) / 60000));
      anim('seconds', Math.floor((diff % 60000) / 1000));
    }
    function anim(id, val) {
      const el = document.getElementById(id);
      const s = String(val).padStart(2, '0');
      if (el.textContent !== s) {
        el.style.transform = 'translateY(-10px) scale(0.8)';
        el.style.opacity = '0.2';
        setTimeout(() => {
          el.textContent = s;
          el.style.transform = 'translateY(0) scale(1)';
          el.style.opacity = '1';
        }, 180);
      }
    }
    tick();
    setInterval(tick, 1000);
  }

  // ===== PARALLAX =====
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        document.querySelectorAll('.fshape').forEach((s, i) => {
          s.style.transform = `translateY(${y * 0.025 * (i + 1)}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  });

  // =================================================
  // ===== MUSIC ENGINE (Web Audio API Piano) =====
  // =================================================
  let audioCtx = null;
  let musicPlaying = false;
  let musicTimeout = null;
  let masterGain = null;

  // Emotional farewell chord progression
  const chords = [
    [261.63, 329.63, 392.00],  // C major
    [220.00, 261.63, 329.63],  // A minor
    [174.61, 220.00, 261.63],  // F major
    [196.00, 246.94, 293.66],  // G major
    [220.00, 261.63, 329.63],  // A minor
    [164.81, 196.00, 246.94],  // E minor
    [174.61, 220.00, 261.63],  // F major
    [196.00, 246.94, 293.66],  // G major
  ];

  // Melody over chords
  const melodies = [
    [523.25, 493.88, 523.25, 587.33],
    [523.25, 440.00, 493.88, 523.25],
    [440.00, 523.25, 493.88, 440.00],
    [493.88, 523.25, 587.33, 523.25],
    [523.25, 493.88, 440.00, 392.00],
    [440.00, 392.00, 440.00, 493.88],
    [440.00, 523.25, 493.88, 440.00],
    [493.88, 440.00, 392.00, 440.00],
  ];

  // Sub-bass notes (root of each chord, low octave)
  const bassNotes = [130.81, 110.00, 87.31, 98.00, 110.00, 82.41, 87.31, 98.00];

  function piano(freq, start, dur, vol) {
    if (!audioCtx || !masterGain) return;
    const g = audioCtx.createGain();
    g.connect(masterGain);

    [1, 2, 3, 4].forEach((h, i) => {
      const o = audioCtx.createOscillator();
      const m = audioCtx.createGain();
      o.type = i === 0 ? 'sine' : 'sine';
      o.frequency.value = freq * h;
      m.gain.value = vol * [1, 0.2, 0.06, 0.02][i];
      o.connect(m);
      m.connect(g);
      o.start(start);
      o.stop(start + dur + 0.15);
    });

    // Envelope
    g.gain.setValueAtTime(0, start);
    g.gain.linearRampToValueAtTime(1, start + 0.015);
    g.gain.exponentialRampToValueAtTime(0.35, start + dur * 0.25);
    g.gain.exponentialRampToValueAtTime(0.001, start + dur);
  }

  function pad(freq, start, dur, vol) {
    if (!audioCtx || !masterGain) return;
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = 'sine';
    o.frequency.value = freq;
    o.connect(g);
    g.connect(masterGain);
    g.gain.setValueAtTime(0, start);
    g.gain.linearRampToValueAtTime(vol, start + dur * 0.3);
    g.gain.linearRampToValueAtTime(vol * 0.6, start + dur * 0.7);
    g.gain.exponentialRampToValueAtTime(0.001, start + dur);
    o.start(start);
    o.stop(start + dur + 0.1);
  }

  function playLoop() {
    if (!musicPlaying || !audioCtx) return;
    const now = audioCtx.currentTime + 0.1;
    const cDur = 3.2;

    chords.forEach((chord, ci) => {
      const t = now + ci * cDur;

      // Arpeggiated chord
      chord.forEach((f, ni) => {
        piano(f, t + ni * 0.15, cDur * 0.8, 0.1);
      });

      // Melody
      melodies[ci].forEach((f, mi) => {
        piano(f, t + mi * (cDur / 4), cDur / 3.2, 0.065);
      });

      // Soft bass pad
      pad(bassNotes[ci], t, cDur * 0.95, 0.04);

      // Subtle high shimmer
      pad(chord[2] * 2, t + 0.5, cDur * 0.6, 0.015);
    });

    musicTimeout = setTimeout(playLoop, chords.length * cDur * 1000 - 300);
  }

  function startMusic() {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        masterGain = audioCtx.createGain();
        masterGain.gain.value = 0.55;
        masterGain.connect(audioCtx.destination);
      }
      if (audioCtx.state === 'suspended') audioCtx.resume();

      musicPlaying = true;
      document.getElementById('musicBtn').classList.add('playing');
      playLoop();
    } catch (e) {
      console.log('Audio error:', e);
    }
  }

  function stopMusic() {
    musicPlaying = false;
    document.getElementById('musicBtn').classList.remove('playing');
    if (musicTimeout) clearTimeout(musicTimeout);
    if (masterGain && audioCtx) {
      masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
      setTimeout(() => { if (masterGain) masterGain.gain.value = 0.55; }, 600);
    }
  }

  document.getElementById('musicBtn').addEventListener('click', () => {
    musicPlaying ? stopMusic() : startMusic();
  });

})();
