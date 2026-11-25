(function () {
  'use strict';

  const CONFIG = window.PORTFOLIO_CONFIG || {};

  /* ============================================================
     0. CUSTOM CINEMATIC PRELOADER (EVERY PAGE LOAD / REFRESH)
     ============================================================ */
  const preloader = document.getElementById('preloader');
  const preloaderFill = document.getElementById('preloaderFill');
  const preloaderPercent = document.getElementById('preloaderPercent');
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');

  function revealHeroImmediately() {
    document.body.classList.add('hero-ready');
    if (preloader) preloader.classList.add('is-done');
  }

  function runPreloader() {
    if (!preloader) {
      revealHeroImmediately();
      return;
    }

    let progress = 0;
    let finished = false;
    let ready = document.readyState === 'complete';
    const startTime = performance.now();

    const markReady = () => { ready = true; };
    if (!ready) {
      window.addEventListener('load', markReady, { once: true });
    }
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(markReady).catch(markReady);
    }

    function finishPreloader() {
      if (finished) return;
      finished = true;
      if (preloaderFill) preloaderFill.style.width = '100%';
      if (preloaderPercent) preloaderPercent.textContent = '100%';
      preloader.classList.add('is-exiting');
      document.body.classList.add('hero-ready');
      setTimeout(() => preloader.classList.add('is-done'), 600);
    }

    // Safety timer so background/throttled tabs never stall on the preloader
    setTimeout(finishPreloader, 1800);

    function stepPreloader() {
      if (finished) return;
      const elapsed = performance.now() - startTime;
      const minDisplayDone = elapsed >= 400;
      const forceFinish = elapsed >= 1100;
      const target = (ready && minDisplayDone) || forceFinish ? 100 : 88;
      const speed = (ready && minDisplayDone) || forceFinish ? 0.24 : 0.11;
      progress += (target - progress) * speed;

      if (target === 100 && progress > 99) progress = 100;
      const pct = Math.round(progress);
      if (preloaderFill) preloaderFill.style.width = `${pct}%`;
      if (preloaderPercent) preloaderPercent.textContent = `${pct}%`;

      if (progress >= 100) {
        finishPreloader();
        return;
      }
      requestAnimationFrame(stepPreloader);
    }

    requestAnimationFrame(stepPreloader);
  }

  runPreloader();

  /* ============================================================
     1. SINGLE FRAME DRIVER + LENIS SMOOTH SCROLL
     ============================================================ */
  let lenis = null;
  let lenisPausedByUi = false;
  let masterRafId = 0;
  let ambientDirty = true;
  let ambientAnimating = true;
  const lowPowerDevice = !finePointerQuery.matches ||
    (navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4);
  const ambientInterval = lowPowerDevice || motionQuery.matches ? 1000 / 30 : 0;
  let lastAmbientTime = 0;

  function requestFrame() {
    if (!masterRafId && !document.hidden) {
      masterRafId = requestAnimationFrame(masterFrame);
    }
  }

  function stopMasterLoop() {
    if (masterRafId) cancelAnimationFrame(masterRafId);
    masterRafId = 0;
  }

  function masterFrame(time) {
    masterRafId = 0;
    if (document.hidden) return;

    if (lenis && !lenis.isStopped) lenis.raf(time);

    if (ambientAnimating || ambientDirty) {
      const due = ambientDirty || !ambientInterval || time - lastAmbientTime >= ambientInterval;
      if (due) {
        renderAmbient(time, ambientAnimating);
        lastAmbientTime = time;
        ambientDirty = false;
      }
    }

    if (ambientAnimating || (lenis && lenis.isScrolling) || ambientDirty) {
      requestFrame();
    }
  }

  function canUseLenis() {
    return typeof window.Lenis === 'function' && !motionQuery.matches && finePointerQuery.matches;
  }

  function initLenis() {
    if (lenis || !canUseLenis()) return;
    lenis = new window.Lenis({
      lerp: 0.085,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.95,
      touchMultiplier: 1,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      autoRaf: false,
      autoResize: true,
      anchors: { offset: -72, duration: 1.05 },
      prevent: (node) => !!(node && node.closest && node.closest('[data-lenis-prevent]')),
      respectReducedMotion: true
    });
    lenis.on('scroll', updateActiveNav);
    requestFrame();
  }

  function destroyLenis() {
    if (lenis) {
      lenis.destroy();
      lenis = null;
    }
  }

  function setLenisPaused(paused) {
    lenisPausedByUi = paused;
    if (!lenis) return;
    if (paused) lenis.stop();
    else lenis.start();
  }

  function smoothScrollTo(target) {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return;
    if (lenis) {
      lenis.scrollTo(el, { offset: -72, duration: 1.0 });
      return;
    }
    el.scrollIntoView({ behavior: motionQuery.matches ? 'auto' : 'smooth', block: 'start' });
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopMasterLoop();
      if (lenis) lenis.stop();
      return;
    }
    if (lenis && !lenisPausedByUi) lenis.start();
    ambientDirty = true;
    requestFrame();
  });

  /* ============================================================
     2. DYNAMIC BLUE RIBBONS, STARFIELD & INTERACTIVE CURSOR GLOW
     ============================================================ */
  const canvas = document.getElementById('ambient-canvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  let cw = 0;
  let ch = 0;
  let dpr = 1;
  let globalScroll = 0;

  let pointerX = 0.5;
  let pointerY = 0.4;
  let targetPointerX = 0.5;
  let targetPointerY = 0.4;

  if (finePointerQuery.matches && !motionQuery.matches) {
    window.addEventListener('pointermove', (e) => {
      targetPointerX = e.clientX / Math.max(1, window.innerWidth);
      targetPointerY = e.clientY / Math.max(1, window.innerHeight);
    }, { passive: true });
  }

  const AURORA_SCALE = 0.45;
  const auroraCanvas = document.createElement('canvas');
  const auroraCtx = auroraCanvas.getContext('2d');
  let aw = 0;
  let ah = 0;
  const bokehSprites = new Map();

  // Crisp twinkling starfield + drifting light motes
  const stars = Array.from({ length: 42 }, (_, i) => ({
    x: ((i * 37.7 + 13) % 100) / 100,
    y: ((i * 29.3 + 7) % 100) / 100,
    r: 1.1 + (i % 4) * 0.65,
    vx: (i % 2 === 0 ? 1 : -1) * (0.00012 + (i % 5) * 0.00004),
    vy: -0.00008 - (i % 3) * 0.00005,
    alpha: 0.25 + (i % 5) * 0.11,
    phase: i * 0.85
  }));

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  function computeCanvasDpr() {
    const native = Math.min(window.devicePixelRatio || 1, 2);
    const pixelBudget = 2300000;
    const cssPixels = Math.max(1, window.innerWidth * window.innerHeight);
    return clamp(Math.min(native, Math.sqrt(pixelBudget / cssPixels)), 1, native);
  }

  function resizeCanvas() {
    const nextW = window.innerWidth;
    const nextH = window.innerHeight;
    const nextDpr = computeCanvasDpr();
    if (nextW === cw && nextH === ch && nextDpr === dpr) return;
    cw = nextW;
    ch = nextH;
    dpr = nextDpr;
    canvas.width = Math.floor(cw * dpr);
    canvas.height = Math.floor(ch * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    aw = Math.max(1, Math.floor(cw * AURORA_SCALE));
    ah = Math.max(1, Math.floor(ch * AURORA_SCALE));
    auroraCanvas.width = aw;
    auroraCanvas.height = ah;
    bokehSprites.clear();
  }

  function bokehSprite(radius) {
    const key = radius.toFixed(2);
    let sprite = bokehSprites.get(key);
    if (sprite) return sprite;

    const rad = radius * 3.4;
    const size = Math.ceil(rad * 2) + 2;
    sprite = document.createElement('canvas');
    sprite.width = Math.ceil(size * dpr);
    sprite.height = Math.ceil(size * dpr);
    const sctx = sprite.getContext('2d');
    sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const center = size / 2;
    const grad = sctx.createRadialGradient(center, center, 0, center, center, rad);
    grad.addColorStop(0, 'rgba(215, 236, 255, 1)');
    grad.addColorStop(0.45, 'rgba(58, 138, 255, 0.48)');
    grad.addColorStop(1, 'rgba(8, 24, 68, 0)');
    sctx.fillStyle = grad;
    sctx.beginPath();
    sctx.arc(center, center, rad, 0, Math.PI * 2);
    sctx.fill();
    bokehSprites.set(key, sprite);
    return sprite;
  }

  function renderAmbient(timeMs, animate) {
    const t = timeMs * 0.0008;
    const dt = animate ? (lastAmbientTime ? clamp((timeMs - lastAmbientTime) / 16.67, 0.2, 3) : 1) : 0;

    pointerX += (targetPointerX - pointerX) * 0.06;
    pointerY += (targetPointerY - pointerY) * 0.06;

    // Deep midnight void
    ctx.fillStyle = '#020306';
    ctx.fillRect(0, 0, cw, ch);

    // Flowing electric-blue silk ribbons on offscreen blurred canvas
    const scrollPhase = globalScroll * Math.PI * 3.0;
    auroraCtx.clearRect(0, 0, aw, ah);
    const ac = auroraCtx;
    ac.save();
    ac.filter = `blur(${(34 * AURORA_SCALE).toFixed(2)}px)`;

    // Ribbon 1: Sweeping diagonal cobalt wave
    const g1 = ac.createLinearGradient(0, 0, aw, ah);
    g1.addColorStop(0, 'rgba(12, 48, 140, 0.12)');
    g1.addColorStop(0.5, 'rgba(32, 108, 248, 0.52)');
    g1.addColorStop(1, 'rgba(8, 32, 98, 0.16)');
    ac.strokeStyle = g1;
    ac.lineWidth = Math.max(18, ah * 0.14);
    ac.beginPath();
    const y1Start = ah * (0.74 + 0.08 * Math.sin(t * 0.6 + scrollPhase * 0.4));
    const y1End = ah * (0.28 + 0.08 * Math.cos(t * 0.5 - scrollPhase * 0.3));
    ac.moveTo(-aw * 0.1, y1Start);
    ac.bezierCurveTo(
      aw * 0.3, ah * (0.42 + 0.12 * Math.sin(t * 0.7)),
      aw * 0.68, ah * (0.78 + 0.1 * Math.cos(t * 0.55)),
      aw * 1.1, y1End
    );
    ac.stroke();

    // Ribbon 2: Secondary luminous cerulean arc
    const g2 = ac.createLinearGradient(aw, 0, 0, ah);
    g2.addColorStop(0, 'rgba(72, 152, 255, 0.42)');
    g2.addColorStop(0.5, 'rgba(22, 82, 214, 0.34)');
    g2.addColorStop(1, 'rgba(6, 20, 62, 0.08)');
    ac.strokeStyle = g2;
    ac.lineWidth = Math.max(12, ah * 0.09);
    ac.beginPath();
    ac.moveTo(-aw * 0.08, ah * (0.26 + 0.09 * Math.cos(t * 0.5)));
    ac.bezierCurveTo(
      aw * 0.36, ah * (0.72 + 0.1 * Math.sin(t * 0.6 + scrollPhase * 0.25)),
      aw * 0.72, ah * (0.34 + 0.1 * Math.cos(t * 0.65)),
      aw * 1.08, ah * (0.76 + 0.07 * Math.sin(t * 0.45))
    );
    ac.stroke();

    // Soft interactive pointer halo
    const pxA = pointerX * aw;
    const pyA = pointerY * ah;
    const pg = ac.createRadialGradient(pxA, pyA, 0, pxA, pyA, aw * 0.34);
    pg.addColorStop(0, 'rgba(56, 138, 255, 0.28)');
    pg.addColorStop(1, 'rgba(10, 30, 80, 0)');
    ac.fillStyle = pg;
    ac.fillRect(0, 0, aw, ah);

    ac.restore();
    ctx.drawImage(auroraCanvas, 0, 0, cw, ch);

    // Crisp twinkling starfield & drifting motes
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      if (s.x < -0.02) s.x = 1.02;
      if (s.x > 1.02) s.x = -0.02;
      if (s.y < -0.02) s.y = 1.02;

      const sx = s.x * cw;
      const sy = s.y * ch;
      const pulse = 0.55 + 0.45 * Math.sin(t * 2.4 + s.phase);
      const sprite = bokehSprite(s.r);
      const drawSize = sprite.width / dpr;
      ctx.globalAlpha = s.alpha * pulse;
      ctx.drawImage(sprite, sx - drawSize / 2, sy - drawSize / 2, drawSize, drawSize);
    }
    ctx.globalAlpha = 1;
  }

  resizeCanvas();
  initLenis();
  requestFrame();

  if (typeof motionQuery.addEventListener === 'function') {
    motionQuery.addEventListener('change', () => {
      ambientAnimating = !motionQuery.matches;
      ambientDirty = true;
      if (motionQuery.matches) destroyLenis();
      else initLenis();
      requestFrame();
    });
    finePointerQuery.addEventListener('change', (e) => {
      if (e.matches) initLenis();
      else destroyLenis();
      requestFrame();
    });
  }

  window.addEventListener('resize', () => {
    resizeCanvas();
    ambientDirty = true;
    requestFrame();
  }, { passive: true });

  /* ============================================================
     3. ORBITAL PARALLAX + ACTIVE NAV + DIRECTIONAL REVEALS
     ============================================================ */
  const heroOrbitSvg = document.querySelector('.hero-orbit-svg');
  const navLinks = Array.from(document.querySelectorAll('.nav-links .nav-link'));
  const trackedSections = ['works', 'kuro', 'videos', 'advertising', 'ai', 'contact']
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  function updateActiveNav() {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const sy = lenis ? lenis.animatedScroll : window.scrollY;
    globalScroll = clamp(sy / maxScroll, 0, 1);
    ambientDirty = true;

    if (heroOrbitSvg && !motionQuery.matches && sy < window.innerHeight * 1.2) {
      const shiftY = sy * 0.16;
      heroOrbitSvg.style.transform = `translate3d(0, ${shiftY.toFixed(1)}px, 0)`;
    }

    const mid = window.innerHeight * 0.42;
    let activeId = '';
    for (let i = 0; i < trackedSections.length; i++) {
      const rect = trackedSections[i].getBoundingClientRect();
      if (rect.top <= mid && rect.bottom >= mid * 0.4) {
        activeId = trackedSections[i].id;
      }
    }
    navLinks.forEach((a) => a.classList.toggle('active', a.dataset.section === activeId));
  }

  window.addEventListener('scroll', () => {
    if (!lenis) updateActiveNav();
  }, { passive: true });

  const revealObserver = ('IntersectionObserver' in window && !motionQuery.matches)
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' })
    : null;

  function observeReveals(root = document) {
    const items = Array.from(root.querySelectorAll('.reveal-item'));
    items.forEach((el) => {
      if (el.dataset.stagger) {
        el.style.setProperty('--stagger', el.dataset.stagger);
      }
      if (revealObserver) {
        revealObserver.observe(el);
      } else {
        el.classList.add('is-visible');
      }
    });
  }

  observeReveals(document);

  /* ============================================================
     3B. SELECTED WORK STAGE INDICATORS
     ============================================================ */
  const workCards = Array.from(document.querySelectorAll('#workStageGrid .work-card'));
  const workDots = Array.from(document.querySelectorAll('[data-work-dot]'));
  const workPrevBtn = document.getElementById('workPrevBtn');
  const workNextBtn = document.getElementById('workNextBtn');
  let featuredWorkIndex = 1;

  function setFeaturedWork(idx) {
    if (!workCards.length) return;
    featuredWorkIndex = (idx + workCards.length) % workCards.length;
    workCards.forEach((c, i) => c.classList.toggle('is-featured', i === featuredWorkIndex));
    workDots.forEach((d, i) => d.classList.toggle('is-active', i === featuredWorkIndex));
  }

  workDots.forEach((dot) => {
    dot.addEventListener('click', () => setFeaturedWork(Number(dot.dataset.workDot) || 0));
  });
  if (workPrevBtn) workPrevBtn.addEventListener('click', () => setFeaturedWork(featuredWorkIndex - 1));
  if (workNextBtn) workNextBtn.addEventListener('click', () => setFeaturedWork(featuredWorkIndex + 1));

  /* ============================================================
     4. VIDEO & CREATIVE SHOWCASE
        - Desktop: Autoplay muted on viewport entry + single unmute toggle
        - Mobile: Tap-to-play with original audio, paused initially, zero pre-buffering
     ============================================================ */
  const videoGrid = document.getElementById('videoGrid');
  const videoFilterBtns = Array.from(document.querySelectorAll('[data-video-filter]'));
  const videosData = Array.isArray(CONFIG.videos) ? CONFIG.videos : [];
  const mobileViewportQuery = window.matchMedia('(max-width: 767px)');
  const coarsePointerQuery = window.matchMedia('(hover: none) and (pointer: coarse)');

  function isMobileVideoMode() {
    return mobileViewportQuery.matches || coarsePointerQuery.matches;
  }

  let currentVideoFilter = 'all';
  let currentMobileMode = isMobileVideoMode();
  let activeUnmutedCard = null;
  let activeMobileCard = null;

  function muteCard(card) {
    if (!card) return;
    const vid = card.querySelector('.video-player');
    if (vid) vid.muted = true;
    card.classList.remove('is-unmuted');
    card.setAttribute('aria-pressed', 'false');
    if (activeUnmutedCard === card) activeUnmutedCard = null;
  }

  function toggleCardSound(card) {
    const vid = card.querySelector('.video-player');
    if (!vid) return;

    if (card.classList.contains('is-unmuted')) {
      muteCard(card);
      return;
    }

    if (activeUnmutedCard && activeUnmutedCard !== card) {
      muteCard(activeUnmutedCard);
    }

    vid.muted = false;
    card.classList.add('is-unmuted');
    card.setAttribute('aria-pressed', 'true');
    activeUnmutedCard = card;

    if (vid.paused) {
      vid.play().then(() => card.classList.add('is-playing')).catch(() => {
        vid.muted = true;
        card.classList.remove('is-unmuted');
        vid.play().then(() => card.classList.add('is-playing')).catch(() => {});
      });
    }
  }

  function stopMobileCard(card, resetTime) {
    if (!card) return;
    const vid = card.querySelector('.video-player');
    card.classList.remove('is-playing', 'is-buffering');
    card.setAttribute('aria-pressed', 'false');
    if (vid) {
      vid.pause();
      if (resetTime) {
        try { vid.currentTime = 0; } catch (e) {}
      }
    }
    if (activeMobileCard === card) activeMobileCard = null;
  }

  function toggleMobileCard(card) {
    const vid = card.querySelector('.video-player');
    if (!vid) return;

    if (activeMobileCard === card && !vid.paused) {
      stopMobileCard(card, false);
      return;
    }

    if (activeMobileCard && activeMobileCard !== card) {
      stopMobileCard(activeMobileCard, false);
    }

    // Ensure playsInline / webkit-playsinline + synchronous play() in user gesture for iOS Safari
    vid.playsInline = true;
    vid.setAttribute('playsinline', '');
    vid.setAttribute('webkit-playsinline', 'true');
    if (!vid.getAttribute('src') && vid.dataset.src) {
      vid.setAttribute('src', vid.dataset.src);
    }
    vid.muted = false;
    vid.defaultMuted = false;
    vid.loop = false;
    activeMobileCard = card;
    card.setAttribute('aria-pressed', 'true');
    card.classList.add('is-buffering');

    try {
      const p = vid.play();
      if (p && typeof p.then === 'function') {
        p.then(() => {
          card.classList.remove('is-buffering');
          if (activeMobileCard === card && !vid.paused) {
            card.classList.add('is-playing');
          }
        }).catch(() => {
          // If unmuted autoplay-policy check rejects on WebKit edge case, retry muted
          vid.muted = true;
          const retry = vid.play();
          if (retry && typeof retry.then === 'function') {
            retry.then(() => {
              card.classList.remove('is-buffering');
              card.classList.add('is-playing');
            }).catch(() => stopMobileCard(card, false));
          } else {
            stopMobileCard(card, false);
          }
        });
      } else {
        card.classList.remove('is-buffering');
        card.classList.add('is-playing');
      }
    } catch (err) {
      stopMobileCard(card, false);
    }
  }

  function playCardMuted(card) {
    const vid = card.querySelector('.video-player');
    if (!vid) return;
    if (!vid.getAttribute('src') && vid.dataset.src) {
      vid.setAttribute('src', vid.dataset.src);
    }
    if (card !== activeUnmutedCard) vid.muted = true;
    const p = vid.play();
    if (p && typeof p.then === 'function') {
      p.then(() => card.classList.add('is-playing')).catch(() => {});
    } else {
      card.classList.add('is-playing');
    }
  }

  function pauseDesktopCard(card) {
    const vid = card.querySelector('.video-player');
    if (!vid) return;
    vid.pause();
    if (card.classList.contains('is-unmuted')) {
      muteCard(card);
    }
  }

  // Progressive background preparation for upcoming desktop videos
  const desktopPrewarmObserver = ('IntersectionObserver' in window)
    ? new IntersectionObserver((entries) => {
        if (isMobileVideoMode()) return;
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const vid = entry.target.querySelector('.video-player');
          if (vid) {
            if (!vid.getAttribute('src') && vid.dataset.src) {
              vid.setAttribute('src', vid.dataset.src);
            }
            if (vid.preload === 'none') vid.preload = 'metadata';
          }
          desktopPrewarmObserver.unobserve(entry.target);
        });
      }, { rootMargin: '450px 0px' })
    : null;

  const videoViewportObserver = ('IntersectionObserver' in window)
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const card = entry.target;
          const mobileMode = card.classList.contains('is-mobile-mode');
          if (mobileMode) {
            // Mobile: NEVER autoplay; only pause if scrolling away from a playing reel
            if (!entry.isIntersecting) {
              stopMobileCard(card, false);
            }
          } else if (entry.isIntersecting) {
            playCardMuted(card);
          } else {
            pauseDesktopCard(card);
          }
        });
      }, { threshold: 0.25 })
    : null;

  function buildVideoCard(item, idx, mobileMode) {
    const card = document.createElement('article');
    const isLandscape = item.format === 'landscape';
    card.className = `video-card reveal-item ${isLandscape ? 'is-landscape' : 'is-reel'}${mobileMode ? ' is-mobile-mode' : ''}`;
    card.dataset.reveal = 'up';
    card.dataset.stagger = String(idx % 4);
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-pressed', 'false');
    card.setAttribute(
      'aria-label',
      mobileMode ? `${item.title} — tap to play` : `${item.title} — tap to toggle sound`
    );

    const posterSrc = item.poster || '';
    const hasVideo = Boolean(item.videoSrc);
    let videoElHtml = '';
    if (hasVideo) {
      if (mobileMode) {
        // iOS Safari & mobile: keep src present with preload="none" so 0 bytes buffer upfront
        // while allowing synchronous vid.play() inside the tap gesture.
        videoElHtml = `<video class="video-player" src="${item.videoSrc}"${posterSrc ? ` poster="${posterSrc}"` : ''} playsinline webkit-playsinline="true" x-webkit-airplay="allow" preload="none"></video>`;
      } else {
        const preloadMode = idx < 4 ? 'metadata' : 'none';
        videoElHtml = `<video class="video-player" src="${item.videoSrc}"${posterSrc ? ` poster="${posterSrc}"` : ''} muted loop playsinline webkit-playsinline="true" preload="${preloadMode}"></video>`;
      }
    }

    card.innerHTML = `
      <div class="video-frame">
        ${posterSrc ? `<img class="video-poster" src="${posterSrc}" alt="${item.title}" loading="lazy" decoding="async" />` : ''}
        ${videoElHtml}
        <span class="video-mobile-play" aria-hidden="true">
          <svg viewBox="0 0 24 24"><polygon points="6 4 20 12 6 20 6 4"></polygon></svg>
        </span>
        <span class="video-sound-badge" aria-hidden="true">
          <svg class="icon-sound-off" viewBox="0 0 24 24">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <line x1="22" y1="9" x2="16" y2="15"></line>
            <line x1="16" y1="9" x2="22" y2="15"></line>
          </svg>
          <svg class="icon-sound-on" viewBox="0 0 24 24">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
          </svg>
        </span>
      </div>
      <div class="video-meta">
        <h3 class="video-title">${item.title}</h3>
        <p class="video-desc">${item.caption || ''}</p>
      </div>
    `;

    if (hasVideo) {
      const vidEl = card.querySelector('.video-player');
      vidEl.playsInline = true;
      vidEl.addEventListener('playing', () => {
        card.classList.remove('is-buffering');
        card.classList.add('is-playing');
      });
      vidEl.addEventListener('waiting', () => {
        if (mobileMode && activeMobileCard === card) card.classList.add('is-buffering');
      });
      vidEl.addEventListener('error', () => {
        card.classList.remove('is-buffering', 'is-playing');
        if (mobileMode && activeMobileCard === card) {
          stopMobileCard(card, false);
          showToast('Video could not load — tap to retry');
        }
      });

      if (mobileMode) {
        vidEl.addEventListener('ended', () => stopMobileCard(card, true));
        card.addEventListener('click', () => toggleMobileCard(card));
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMobileCard(card);
          }
        });
      } else {
        card.addEventListener('click', () => toggleCardSound(card));
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleCardSound(card);
          }
        });
        if (desktopPrewarmObserver) desktopPrewarmObserver.observe(card);
      }

      if (videoViewportObserver) {
        videoViewportObserver.observe(card);
      } else if (!mobileMode) {
        playCardMuted(card);
      }
    }

    return card;
  }

  function renderVideos(filter) {
    if (!videoGrid) return;
    currentVideoFilter = filter;
    const mobileMode = isMobileVideoMode();
    currentMobileMode = mobileMode;

    if (videoViewportObserver) {
      videoGrid.querySelectorAll('.video-card').forEach((c) => videoViewportObserver.unobserve(c));
    }
    if (desktopPrewarmObserver) {
      videoGrid.querySelectorAll('.video-card').forEach((c) => desktopPrewarmObserver.unobserve(c));
    }
    activeUnmutedCard = null;
    activeMobileCard = null;
    videoGrid.innerHTML = '';

    const filtered = filter === 'all' ? videosData : videosData.filter((v) => v.format === filter);
    const landscapeItems = filtered.filter((v) => v.format === 'landscape');
    const reelItems = filtered.filter((v) => v.format !== 'landscape');

    if (landscapeItems.length) {
      const landscapeWrap = document.createElement('div');
      landscapeWrap.className = 'video-landscape-grid';
      landscapeItems.forEach((item, idx) => landscapeWrap.appendChild(buildVideoCard(item, idx, mobileMode)));
      videoGrid.appendChild(landscapeWrap);
    }

    if (reelItems.length) {
      const reelsWrap = document.createElement('div');
      reelsWrap.className = 'video-reels-grid';
      reelItems.forEach((item, idx) => reelsWrap.appendChild(buildVideoCard(item, idx, mobileMode)));
      videoGrid.appendChild(reelsWrap);
    }

    observeReveals(videoGrid);
    if (lenis && typeof lenis.resize === 'function') lenis.resize();
  }

  renderVideos('all');

  const handleVideoModeChange = () => {
    const nextMode = isMobileVideoMode();
    if (nextMode !== currentMobileMode) {
      renderVideos(currentVideoFilter);
    }
  };
  if (typeof mobileViewportQuery.addEventListener === 'function') {
    mobileViewportQuery.addEventListener('change', handleVideoModeChange);
    coarsePointerQuery.addEventListener('change', handleVideoModeChange);
  }

  videoFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      videoFilterBtns.forEach((b) => b.classList.toggle('is-active', b === btn));
      renderVideos(btn.dataset.videoFilter);
    });
  });

  /* ============================================================
     5. UNIFIED PROJECT & VIDEO MODAL
     ============================================================ */
  const modal = document.getElementById('detailModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalImg = document.getElementById('modalImg');
  const modalVideo = document.getElementById('modalVideo');
  const modalCategory = document.getElementById('modalCategory');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalList = document.getElementById('modalList');
  const modalEditable = document.getElementById('modalEditable');
  const modalActions = document.getElementById('modalActions');
  let lastFocusedEl = null;

  function openModalBase() {
    lastFocusedEl = document.activeElement;
    modal.classList.add('open');
    setLenisPaused(true);
    modalCloseBtn.focus();
  }

  function closeDetailModal() {
    if (!modal.classList.contains('open')) return;
    modal.classList.remove('open');
    if (modalVideo && !modalVideo.hidden) {
      modalVideo.pause();
      modalVideo.removeAttribute('src');
    }
    setLenisPaused(false);
    if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') {
      lastFocusedEl.focus();
      lastFocusedEl = null;
    }
  }

  function openProjectModal(projectId) {
    const project = CONFIG.projects && CONFIG.projects[projectId];
    if (!project) return;

    modalVideo.hidden = true;
    modalImg.hidden = false;
    modalImg.src = project.image;
    modalImg.alt = project.imageAlt || project.title;

    modalCategory.textContent = project.category;
    modalTitle.textContent = project.title;
    modalDesc.textContent = project.summary;

    modalList.innerHTML = '';
    (project.highlights || []).forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      modalList.appendChild(li);
    });

    if (Array.isArray(project.editableFields) && project.editableFields.length) {
      modalEditable.hidden = false;
      modalEditable.innerHTML = project.editableFields
        .map((f) => `<div><strong>${f.label}:</strong> ${f.value}</div>`)
        .join('');
    } else {
      modalEditable.hidden = true;
      modalEditable.innerHTML = '';
    }

    modalActions.innerHTML = '';
    if (project.liveUrl) {
      const link = document.createElement('a');
      link.href = project.liveUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.className = 'btn-white';
      link.textContent = project.liveLabel || 'Visit Live Project';
      modalActions.appendChild(link);
    }

    openModalBase();
  }

  function openVideoModal(videoItem) {
    modalCategory.textContent = videoItem.format === 'landscape' ? 'Landscape Film · 16:9' : 'Vertical Reel · 9:16';
    modalTitle.textContent = videoItem.title;
    modalDesc.textContent = videoItem.caption;
    modalList.innerHTML = '';
    modalActions.innerHTML = '';

    if (videoItem.videoSrc) {
      modalEditable.hidden = true;
      modalImg.hidden = true;
      modalVideo.hidden = false;
      modalVideo.src = videoItem.videoSrc;
      if (videoItem.poster) modalVideo.poster = videoItem.poster;
      else modalVideo.removeAttribute('poster');
      modalVideo.play().catch(() => {});
    } else {
      modalVideo.hidden = true;
      modalImg.hidden = false;
      modalImg.src = videoItem.poster;
      modalImg.alt = videoItem.title;
      modalEditable.hidden = false;
      modalEditable.innerHTML = '<strong>Video Slot Ready:</strong> Add your <code>.mp4</code> path in <code>js/data.js</code> under <code>PORTFOLIO_CONFIG.videos</code> to enable playback here.';
    }

    openModalBase();
  }

  document.querySelectorAll('.js-open-project').forEach((btn) => {
    btn.addEventListener('click', () => openProjectModal(btn.dataset.projectId));
  });

  modalCloseBtn.addEventListener('click', closeDetailModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeDetailModal();
  });

  /* ============================================================
     6. MOBILE DRAWER, TOAST & CONFIG LINKS
     ============================================================ */
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');

  function closeMobileDrawer() {
    if (!mobileDrawer.classList.contains('open')) return;
    mobileDrawer.classList.remove('open');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    setLenisPaused(false);
  }

  mobileMenuBtn.addEventListener('click', () => {
    const open = mobileDrawer.classList.toggle('open');
    mobileMenuBtn.setAttribute('aria-expanded', String(open));
    setLenisPaused(open);
  });

  mobileDrawer.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      closeMobileDrawer();
      if (href && href.startsWith('#')) {
        e.preventDefault();
        smoothScrollTo(href);
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (mobileDrawer.classList.contains('open') &&
      !mobileDrawer.contains(e.target) &&
      !mobileMenuBtn.contains(e.target)) {
      closeMobileDrawer();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (modal.classList.contains('open')) closeDetailModal();
    else if (mobileDrawer.classList.contains('open')) closeMobileDrawer();
  });

  const toastEl = document.getElementById('toast');
  let toastTimer = null;
  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2600);
  }

  const whatsappCta = document.getElementById('whatsappCta');
  const floatingWhatsapp = document.getElementById('floatingWhatsapp');
  if (CONFIG.personal && CONFIG.personal.whatsappUrl) {
    if (whatsappCta) whatsappCta.href = CONFIG.personal.whatsappUrl;
    if (floatingWhatsapp) floatingWhatsapp.href = CONFIG.personal.whatsappUrl;
  }

  document.querySelectorAll('.js-placeholder-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showToast(`${link.dataset.label} placeholder — configure in js/data.js`);
    });
  });
})();
