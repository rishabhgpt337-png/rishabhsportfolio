(function () {
  'use strict';

  const CONFIG = window.PORTFOLIO_CONFIG || {};

  /* ============================================================
     0. CUSTOM CINEMATIC PRELOADER (INITIAL ENTRY ONLY)
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
    if (!preloader || motionQuery.matches) {
      revealHeroImmediately();
      return;
    }

    let seen = false;
    try {
      seen = sessionStorage.getItem('rishabh_preloader_seen') === '1';
    } catch (e) {
      seen = false;
    }

    if (seen) {
      revealHeroImmediately();
      return;
    }

    let progress = 0;
    let ready = document.readyState === 'complete';
    const startTime = performance.now();

    const markReady = () => { ready = true; };
    if (!ready) {
      window.addEventListener('load', markReady, { once: true });
    }
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(markReady).catch(markReady);
    }

    function stepPreloader(now) {
      const elapsed = now - startTime;
      // Synchronise with real readiness; cap max wait at 1400ms so it never stalls
      const forceFinish = elapsed > 1400;
      const target = ready || forceFinish ? 100 : 88;
      const speed = ready || forceFinish ? 0.16 : 0.08;
      progress += (target - progress) * speed;

      if (target === 100 && progress > 99.2) progress = 100;
      const pct = Math.round(progress);
      if (preloaderFill) preloaderFill.style.width = `${pct}%`;
      if (preloaderPercent) preloaderPercent.textContent = `${pct}%`;

      if (progress >= 100) {
        try { sessionStorage.setItem('rishabh_preloader_seen', '1'); } catch (e) {}
        preloader.classList.add('is-exiting');
        document.body.classList.add('hero-ready');
        setTimeout(() => preloader.classList.add('is-done'), 750);
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
  let ambientAnimating = !motionQuery.matches;
  const lowPowerDevice = !finePointerQuery.matches ||
    (navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4);
  const ambientInterval = motionQuery.matches ? 0 : (lowPowerDevice ? 1000 / 30 : 0);
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
      lerp: 0.09,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.92,
      touchMultiplier: 1,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      autoRaf: false,
      autoResize: true,
      anchors: { offset: -72, duration: 1.0 },
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

  function smoothScrollTop() {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.0 });
      return;
    }
    window.scrollTo({ top: 0, behavior: motionQuery.matches ? 'auto' : 'smooth' });
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
     2. AMBIENT BLUE AURORA & BOKEH CANVAS
     ============================================================ */
  const canvas = document.getElementById('ambient-canvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  let cw = 0;
  let ch = 0;
  let dpr = 1;
  let globalScroll = 0;

  const AURORA_SCALE = 0.4;
  const auroraCanvas = document.createElement('canvas');
  const auroraCtx = auroraCanvas.getContext('2d');
  let aw = 0;
  let ah = 0;
  const bokehSprites = new Map();

  const bokehParticles = Array.from({ length: 22 }, (_, i) => ({
    x: ((i * 37.3) % 100) / 100,
    y: ((i * 23.7) % 72) / 100,
    r: 1.4 + (i % 5) * 0.85,
    vx: (i % 2 === 0 ? 1 : -1) * (0.000016 + (i % 4) * 0.000007),
    vy: -0.00001 - (i % 3) * 0.000005,
    alpha: 0.12 + (i % 5) * 0.05,
    phase: i * 0.7
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

    const rad = radius * 3.2;
    const size = Math.ceil(rad * 2) + 2;
    sprite = document.createElement('canvas');
    sprite.width = Math.ceil(size * dpr);
    sprite.height = Math.ceil(size * dpr);
    const sctx = sprite.getContext('2d');
    sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const center = size / 2;
    const grad = sctx.createRadialGradient(center, center, 0, center, center, rad);
    grad.addColorStop(0, 'rgba(170, 212, 255, 1)');
    grad.addColorStop(0.5, 'rgba(48, 128, 255, 0.35)');
    grad.addColorStop(1, 'rgba(10, 30, 80, 0)');
    sctx.fillStyle = grad;
    sctx.beginPath();
    sctx.arc(center, center, rad, 0, Math.PI * 2);
    sctx.fill();
    bokehSprites.set(key, sprite);
    return sprite;
  }

  function renderAmbient(timeMs, animate) {
    const t = timeMs * 0.00045;
    const dt = animate ? (lastAmbientTime ? clamp((timeMs - lastAmbientTime) / 16.67, 0.2, 3) : 1) : 0;

    ctx.fillStyle = '#020306';
    ctx.fillRect(0, 0, cw, ch);

    for (let i = 0; i < bokehParticles.length; i++) {
      const p = bokehParticles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.x < -0.05) p.x = 1.05;
      if (p.x > 1.05) p.x = -0.05;
      if (p.y < -0.05) p.y = 0.76;

      const px = p.x * cw;
      const py = p.y * ch;
      const pulse = 0.7 + 0.3 * Math.sin(t * 2.2 + p.phase);
      const sprite = bokehSprite(p.r);
      const drawSize = sprite.width / dpr;
      ctx.globalAlpha = p.alpha * pulse;
      ctx.drawImage(sprite, px - drawSize / 2, py - drawSize / 2, drawSize, drawSize);
    }
    ctx.globalAlpha = 1;

    const scrollShift = globalScroll * Math.PI * 2.0;
    const baseHorizon = ah * (0.56 + 0.04 * Math.sin(scrollShift * 0.5));

    auroraCtx.clearRect(0, 0, aw, ah);
    const ac = auroraCtx;
    ac.save();
    ac.filter = `blur(${(42 * AURORA_SCALE).toFixed(2)}px)`;

    const g1 = ac.createLinearGradient(0, baseHorizon - ah * 0.14, 0, ah);
    g1.addColorStop(0, 'rgba(8, 36, 108, 0.10)');
    g1.addColorStop(0.45, 'rgba(14, 64, 182, 0.48)');
    g1.addColorStop(1, 'rgba(7, 28, 86, 0.78)');
    ac.fillStyle = g1;
    ac.beginPath();
    ac.moveTo(-80 * AURORA_SCALE, ah + 80 * AURORA_SCALE);
    for (let x = -80 * AURORA_SCALE; x <= aw + 80 * AURORA_SCALE; x += 64 * AURORA_SCALE) {
      const nx = x / aw;
      const wave =
        Math.sin(nx * 3.4 + t + scrollShift * 0.45) * (ah * 0.085) +
        Math.cos(nx * 2.1 - t * 0.7 + scrollShift * 0.2) * (ah * 0.05);
      ac.lineTo(x, baseHorizon + wave);
    }
    ac.lineTo(aw + 80 * AURORA_SCALE, ah + 80 * AURORA_SCALE);
    ac.closePath();
    ac.fill();

    const g2 = ac.createRadialGradient(
      aw * (0.28 + 0.16 * Math.sin(t * 0.6 + scrollShift * 0.35)),
      ah * 0.84,
      aw * 0.04,
      aw * 0.34,
      ah * 0.86,
      aw * 0.58
    );
    g2.addColorStop(0, 'rgba(37, 117, 245, 0.44)');
    g2.addColorStop(0.55, 'rgba(16, 68, 184, 0.22)');
    g2.addColorStop(1, 'rgba(5, 18, 52, 0)');
    ac.fillStyle = g2;
    ac.fillRect(0, ah * 0.32, aw, ah * 0.72);

    ac.restore();
    ctx.drawImage(auroraCanvas, 0, 0, cw, ch);
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
     3. RESTRAINED ORBITAL PARALLAX + ACTIVE NAV + DIRECTIONAL REVEALS
     ============================================================ */
  const heroOrbitSvg = document.querySelector('.hero-orbit-svg');
  const navLinks = Array.from(document.querySelectorAll('.nav-links .nav-link'));
  const trackedSections = ['about', 'works', 'kuro', 'videos', 'contact']
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  function updateActiveNav() {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const sy = lenis ? lenis.animatedScroll : window.scrollY;
    globalScroll = clamp(sy / maxScroll, 0, 1);
    ambientDirty = true;

    if (heroOrbitSvg && !motionQuery.matches && sy < window.innerHeight * 1.2) {
      const shiftY = sy * 0.14;
      heroOrbitSvg.style.transform = `translate3d(0, ${shiftY.toFixed(1)}px, 0)`;
    }

    const mid = window.innerHeight * 0.38;
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

  // Unified IntersectionObserver for directional reveals
  const revealObserver = ('IntersectionObserver' in window && !motionQuery.matches)
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' })
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
     4. INTERACTIVE FOCUS SWITCHER (ABOUT)
     ============================================================ */
  const FOCUS_COPY = {
    web: 'Designing and shipping responsive, custom websites for brands and local businesses — from concept to live domain.',
    ai: 'Experimenting with AI tools, automated workflows, and practical integrations to make everyday business tasks faster.',
    creative: 'Editing vertical reels, landscape cuts, and visual brand presentations that give projects a clear identity.',
    ads: 'Setting up and optimising paid advertising campaigns — audience targeting, creative selection, and performance monitoring.'
  };

  const focusTabs = Array.from(document.querySelectorAll('.focus-tab'));
  const focusDetail = document.getElementById('focusDetail');
  focusTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const key = tab.dataset.focus;
      focusTabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', String(active));
      });
      if (focusDetail && FOCUS_COPY[key]) {
        focusDetail.textContent = FOCUS_COPY[key];
      }
    });
  });

  /* ============================================================
     5. VIDEO & CREATIVE SHOWCASE (RENDER + FILTER + MODAL)
     ============================================================ */
  const videoGrid = document.getElementById('videoGrid');
  const videoFilterBtns = Array.from(document.querySelectorAll('[data-video-filter]'));
  const videosData = Array.isArray(CONFIG.videos) ? CONFIG.videos : [];

  function renderVideos(filter) {
    if (!videoGrid) return;
    videoGrid.innerHTML = '';
    const filtered = filter === 'all' ? videosData : videosData.filter((v) => v.format === filter);

    filtered.forEach((item, idx) => {
      const card = document.createElement('article');
      card.className = `video-card reveal-item ${item.format === 'landscape' ? 'is-landscape' : 'is-reel'}`;
      card.dataset.reveal = 'up';
      card.dataset.stagger = String(idx % 4);
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `Preview ${item.title}`);

      const hasVideo = Boolean(item.videoSrc);
      const mediaHtml = hasVideo
        ? `<video src="${item.videoSrc}" poster="${item.poster}" muted loop playsinline preload="metadata"></video>`
        : `<img src="${item.poster}" alt="${item.title}" width="840" height="627" loading="lazy" decoding="async" />`;

      card.innerHTML = `
        <div class="video-thumb">
          ${mediaHtml}
          <span class="video-play-pill">${hasVideo ? 'Play Video' : 'Preview Slot'}</span>
        </div>
        <div class="video-card-body">
          <p class="video-format">${item.formatLabel}</p>
          <h3 class="video-title">${item.title}</h3>
          <p class="video-caption">${item.caption}</p>
        </div>
      `;

      if (hasVideo) {
        const vidEl = card.querySelector('video');
        card.addEventListener('mouseenter', () => vidEl && vidEl.play().catch(() => {}));
        card.addEventListener('mouseleave', () => {
          if (vidEl) {
            vidEl.pause();
            vidEl.currentTime = 0;
          }
        });
      }

      const openHandler = () => openVideoModal(item);
      card.addEventListener('click', openHandler);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openHandler();
        }
      });

      videoGrid.appendChild(card);
    });
    observeReveals(videoGrid);
  }

  renderVideos('all');

  videoFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      videoFilterBtns.forEach((b) => b.classList.toggle('is-active', b === btn));
      renderVideos(btn.dataset.videoFilter);
    });
  });

  /* ============================================================
     6. UNIFIED PROJECT & VIDEO MODAL
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
      link.className = 'btn-solid';
      link.textContent = project.liveLabel || 'Visit Live Project';
      modalActions.appendChild(link);
    }

    openModalBase();
  }

  function openVideoModal(videoItem) {
    modalCategory.textContent = videoItem.formatLabel;
    modalTitle.textContent = videoItem.title;
    modalDesc.textContent = videoItem.caption;
    modalList.innerHTML = '';
    modalEditable.hidden = true;
    modalActions.innerHTML = '';

    if (videoItem.videoSrc) {
      modalImg.hidden = true;
      modalVideo.hidden = false;
      modalVideo.src = videoItem.videoSrc;
      modalVideo.poster = videoItem.poster;
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
     7. MOBILE DRAWER, TOAST, CONFIG LINKS & BACK TO TOP
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
  if (whatsappCta && CONFIG.personal && CONFIG.personal.whatsappUrl) {
    whatsappCta.href = CONFIG.personal.whatsappUrl;
  }

  document.querySelectorAll('.js-placeholder-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showToast(`${link.dataset.label} placeholder — configure in js/data.js`);
    });
  });

  document.getElementById('backTopBtn').addEventListener('click', smoothScrollTop);
})();
