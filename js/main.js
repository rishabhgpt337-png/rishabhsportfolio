(function () {
      'use strict';

      /* ============================================================
         0. SINGLE FRAME DRIVER + LENIS (laptop / fine-pointer tuned)
         ============================================================ */
      const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      const finePointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');

      let lenis = null;
      let lenisPausedByUi = false;
      let masterRafId = 0;
      let sceneDirty = true;
      let ambientDirty = true;
      let ambientAnimating = !motionQuery.matches;
      const lowPowerDevice = !finePointerQuery.matches ||
        (navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4);
      // Soft, already-blurred aurora: 30fps on touch / low-core devices is
      // indistinguishable from 60fps but halves its fill cost there.
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

      // One rAF for Lenis, the scene timeline and the aurora. No competing
      // loops, no second round of callbacks in the same frame.
      function masterFrame(time) {
        masterRafId = 0;
        if (document.hidden) return;

        if (lenis && !lenis.isStopped) lenis.raf(time);

        if (sceneDirty) {
          updateScrollScenes();
          sceneDirty = false;
          ambientDirty = true; // aurora tracks the same scroll value
        }

        if (ambientAnimating || ambientDirty) {
          const due = ambientDirty || !ambientInterval || time - lastAmbientTime >= ambientInterval;
          if (due) {
            renderAmbient(time, ambientAnimating);
            lastAmbientTime = time;
            ambientDirty = false;
          }
        }

        if (ambientAnimating || (lenis && lenis.isScrolling) || sceneDirty || ambientDirty) {
          requestFrame();
        }
      }

      function canUseLenis() {
        return typeof window.Lenis === 'function' && !motionQuery.matches && finePointerQuery.matches;
      }

      function initLenis() {
        if (lenis || !canUseLenis()) return;

        lenis = new window.Lenis({
          // Trackpad damping: reacts on the first wheel tick, then glides.
          // 0.09 keeps a 90-120Hz laptop panel from feeling floaty.
          lerp: 0.09,
          smoothWheel: true,
          syncTouch: false,          // native touch scrolling on hybrid laptops
          wheelMultiplier: 0.92,     // finer trackpad increments, no overshoot
          touchMultiplier: 1,
          orientation: 'vertical',
          gestureOrientation: 'vertical',
          autoRaf: false,            // the single frame driver above ticks it
          autoResize: true,
          anchors: { offset: 0, duration: 1.05 },
          prevent: (node) => !!(node && node.closest && node.closest('[data-lenis-prevent]')),
          respectReducedMotion: true
        });

        // Only flag work here; the actual write happens in masterFrame after
        // lenis.raf(), so the scroll-linked DOM is never a frame behind.
        lenis.on('scroll', () => { sceneDirty = true; });
        requestFrame();
      }

      function destroyLenis() {
        if (lenis) {
          lenis.destroy();
          lenis = null;
        }
      }

      // Modal / drawer control: freeze the page without fighting the scroll position.
      function setLenisPaused(paused) {
        lenisPausedByUi = paused;
        if (!lenis) return;
        if (paused) lenis.stop();
        else lenis.start();
      }

      function smoothScrollTo(target, options) {
        const el = typeof target === 'string' ? document.querySelector(target) : target;
        if (!el) return;
        if (lenis) {
          lenis.scrollTo(el, { offset: 0, duration: 1.05, ...options });
          return;
        }
        el.scrollIntoView({
          behavior: motionQuery.matches ? 'auto' : 'smooth',
          block: 'start'
        });
      }

      function smoothScrollTop() {
        if (lenis) {
          lenis.scrollTo(0, { duration: 1.05 });
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
        sceneDirty = true;
        requestFrame();
      });

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
          sceneDirty = true;
          requestFrame();
        });
      }

      /* ============================================================
         1. STRUCTURED AGENCY DATA (SERVICES & CASE STUDIES)
         ============================================================ */
      const SERVICES_DATA = {
        'brand-direction': {
          eyebrow: '01 / Creative Direction',
          title: 'Creative Direction & Visual Identity',
          img: 'assets/editorial-01.jpg',
          desc: 'We establish unmistakable visual languages, art direction systems, and editorial guidelines that unify every frame, webpage, and campaign asset.',
          bullets: [
            'Art direction & photographic lighting bibles',
            'Typography hierarchy, motion principles & color architecture',
            'Campaign key visuals & luxury brand guidelines'
          ],
          metric: 'Outcome: Cohesive brand recognition across digital, film, and social channels.',
          serviceChip: 'Creative Direction'
        },
        'web-dev': {
          eyebrow: '02 / Website Development',
          title: 'Flagship Website Development',
          img: 'assets/editorial-02.jpg',
          desc: 'Bespoke, high-performance websites engineered with scroll-driven choreography, tactile surfaces, and conversion-focused architecture.',
          bullets: [
            'Custom responsive frontend engineering & interactive motion',
            'Editorial e-commerce, agency portfolios & SaaS launch platforms',
            'Core Web Vitals optimization, SEO structure & analytics'
          ],
          metric: 'Outcome: Sub-second load budgets paired with cinema-grade interaction.',
          serviceChip: 'Website Development'
        },
        'production': {
          eyebrow: '03 / Production & Post',
          title: 'Professional Shooting & Video Editing',
          img: 'assets/editorial-03.jpg',
          desc: 'Studio-lit commercial shoots, product cinematography, and razor-sharp editorial post-production engineered for both hero screens and social feeds.',
          bullets: [
            'Cinema-camera studio & on-location commercial shooting',
            'Rhythmic offline/online video editing & sound design',
            'Color grading, motion graphics & multi-aspect delivery'
          ],
          metric: 'Outcome: High-retention visual storytelling that elevates perceived brand value.',
          serviceChip: 'Professional Shooting'
        },
        'marketing': {
          eyebrow: '04 / Growth & Channels',
          title: 'Digital Marketing, Ads & Social Media',
          img: 'assets/editorial-04.jpg',
          desc: 'Performance-driven paid advertising and full-scale social media management that turn editorial creative into measurable pipeline and audience growth.',
          bullets: [
            'Paid media strategy across Meta, YouTube, Google & LinkedIn',
            'Always-on social media management, calendars & community',
            'Creative A/B testing, attribution & weekly performance sprints'
          ],
          metric: 'Outcome: 98% client retention backed by compounding ROAS and organic reach.',
          serviceChip: 'Digital Marketing & Advertising'
        },
        'brand-solutions': {
          eyebrow: '05 / Narrative & 360° Launch',
          title: 'Scriptwriting & Complete Brand Solutions',
          img: 'assets/editorial-05.jpg',
          desc: 'From the first line of a commercial script to the final deployment of a full digital ecosystem, we orchestrate end-to-end brand launches.',
          bullets: [
            'Commercial scriptwriting, brand manifestos & storyboard arcs',
            'Integrated website, film, social & paid launch choreography',
            'Dedicated creative partner for ongoing brand evolution'
          ],
          metric: 'Outcome: Zero handoff friction between strategy, script, film, and web.',
          serviceChip: 'Complete Digital Brand Solutions'
        }
      };

      const PROJECTS_DATA = {
        'aether': {
          eyebrow: 'Archive (A type 127) / Flagship Web',
          title: 'Aether Light Labs',
          img: 'assets/editorial-03.jpg',
          desc: 'Designed and engineered a scroll-driven architectural lighting showcase combining interactive luminance previews with minimalist editorial typography.',
          bullets: [
            'Scope: Website Development & Creative Direction',
            'Delivered interactive 6-scene product narrative & spec library',
            'Result: +64% architect sample requests within 60 days'
          ],
          metric: 'Featured Recognition: Digital Craft Showcase 2026',
          serviceChip: 'Website Development'
        },
        'noir': {
          eyebrow: 'Archive (B type 128) / Commercial Film',
          title: 'Noir Atelier Launch Film',
          img: 'assets/editorial-05.jpg',
          desc: 'Scripted, shot, and edited a moody 90-second launch film plus 12 vertical cutdowns using chiaroscuro lighting and bespoke sound design.',
          bullets: [
            'Scope: Scriptwriting, Professional Shooting & Video Editing',
            'Shot on cinema primes with custom cobalt rim-light setup',
            'Result: 2.4M organic & paid views with 41% completion rate'
          ],
          metric: 'Deliverables: 1 Hero Film + 12 Social Cutdowns + Still Key Art',
          serviceChip: 'Video Editing'
        },
        'solis': {
          eyebrow: 'Archive (C type 129) / Growth Campaign',
          title: 'Solis Audio Global Campaign',
          img: 'assets/editorial-04.jpg',
          desc: 'Full-funnel digital advertising and creative testing engine for a flagship wireless audio release across four international markets.',
          bullets: [
            'Scope: Digital Marketing & Advertising, Creative Direction',
            'Produced 24 modular ad hooks paired with custom landing pages',
            'Result: 4.3x blended return on ad spend during launch month'
          ],
          metric: 'Channels: Meta, YouTube, Display & Conversion Landing System',
          serviceChip: 'Digital Marketing & Advertising'
        },
        'kinetix': {
          eyebrow: 'Archive (D type 129) / Digital Platform',
          title: 'Kinetix Interactive Flagship',
          img: 'assets/editorial-02.jpg',
          desc: 'Rebuilt a B2B robotics brand from the ground up with a tactile dark-mode web platform, product films, and modular design system.',
          bullets: [
            'Scope: Website Development & Complete Digital Brand Solutions',
            'Engineered fluid responsive architecture with 99 Lighthouse score',
            'Result: 2.8x increase in qualified enterprise demo bookings'
          ],
          metric: 'Timeline: 8 Weeks from Brand Strategy to Global Deployment',
          serviceChip: 'Complete Digital Brand Solutions'
        },
        'monolith': {
          eyebrow: 'Archive (E type 130) / Social & Identity',
          title: 'Monolith Maison',
          img: 'assets/editorial-01.jpg',
          desc: 'Always-on social media direction, editorial reels, and scripted founder stories transforming a boutique design house into a category leader.',
          bullets: [
            'Scope: Social Media Management, Scriptwriting & Video Editing',
            'Established weekly editorial cadence & signature visual grading',
            'Result: +185% follower growth and 3.1x inbound inquiries in 90 days'
          ],
          metric: 'Retainer: Ongoing Social, Production & Brand Stewardship',
          serviceChip: 'Social Media Management'
        }
      };

      /* ============================================================
         2. AMBIENT CINEMATIC BLUE AURORA & BOKEH CANVAS ENGINE
         ============================================================ */
      const canvas = document.getElementById('ambient-canvas');
      // The canvas is fully opaque (the void is painted every frame), so an
      // opaque context lets the compositor skip per-pixel alpha blending.
      const ctx = canvas.getContext('2d', { alpha: false });
      let cw = 0;
      let ch = 0;
      let dpr = 1;
      let globalScroll = 0;

      // The aurora is a 42px-blurred layer: rasterising it at reduced size and
      // upscaling gives the same soft field for a fraction of the blur cost.
      const AURORA_SCALE = 0.4;
      const auroraCanvas = document.createElement('canvas');
      const auroraCtx = auroraCanvas.getContext('2d');
      let aw = 0;
      let ah = 0;
      const bokehSprites = new Map();

      const bokehParticles = Array.from({ length: 28 }, (_, i) => ({
        x: ((i * 37.3) % 100) / 100,
        y: ((i * 23.7) % 72) / 100,
        r: 1.4 + (i % 5) * 0.9,
        vx: (i % 2 === 0 ? 1 : -1) * (0.000018 + (i % 4) * 0.000008),
        vy: -0.000012 - (i % 3) * 0.000006,
        alpha: 0.14 + (i % 5) * 0.06,
        phase: i * 0.7
      }));

      // The aurora is a full-viewport blurred layer, so it is fill-rate bound.
      // Cap the backing store by a pixel budget: a 1440p retina laptop would
      // otherwise push ~4M pixels through blur(42px) every frame for a soft,
      // low-detail background where the extra density is invisible.
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
        // Sprites are rasterised at the main canvas' density; rebuild if DPR
        // changed (e.g. moving the window to another monitor).
        bokehSprites.clear();
      }

      resizeCanvas();

      // Five radii, one cached gradient each, instead of 28 gradients per frame.
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
        // Time-based drift keeps the same speed at 60fps, 30fps or on a
        // throttled low-power device instead of slowing the motes down.
        const dt = animate ? (lastAmbientTime ? clamp((timeMs - lastAmbientTime) / 16.67, 0.2, 3) : 1) : 0;
        ctx.clearRect(0, 0, cw, ch);

        // Deep obsidian void
        ctx.fillStyle = '#020306';
        ctx.fillRect(0, 0, cw, ch);

        // Subtle floating bokeh motes in the upper void
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

        // Organic undulating cinematic BLUE aurora wave (controlled, refined glow)
        // Shifts gently with scroll progress for continuous film feel
        const scrollShift = globalScroll * Math.PI * 2.4;
        const baseHorizon = ah * (0.52 + 0.04 * Math.sin(scrollShift * 0.5));

        auroraCtx.clearRect(0, 0, aw, ah);
        const ac = auroraCtx;
        ac.save();
        // Canvas filter lengths are in backing-store pixels, so scale the
        // radius to keep the upscaled result identical to the original blur.
        ac.filter = `blur(${(42 * AURORA_SCALE / dpr).toFixed(2)}px)`;

        // Layer 1: Deep midnight sapphire body
        const g1 = ac.createLinearGradient(0, baseHorizon - ah * 0.14, 0, ah);
        g1.addColorStop(0, 'rgba(8, 36, 108, 0.12)');
        g1.addColorStop(0.45, 'rgba(14, 64, 182, 0.58)');
        g1.addColorStop(1, 'rgba(7, 28, 86, 0.88)');
        ac.fillStyle = g1;
        ac.beginPath();
        ac.moveTo(-80 * AURORA_SCALE, ah + 80 * AURORA_SCALE);
        for (let x = -80 * AURORA_SCALE; x <= aw + 80 * AURORA_SCALE; x += 64 * AURORA_SCALE) {
          const nx = x / aw;
          const wave =
            Math.sin(nx * 3.4 + t + scrollShift * 0.45) * (ah * 0.095) +
            Math.cos(nx * 2.1 - t * 0.7 + scrollShift * 0.2) * (ah * 0.055);
          ac.lineTo(x, baseHorizon + wave);
        }
        ac.lineTo(aw + 80 * AURORA_SCALE, ah + 80 * AURORA_SCALE);
        ac.closePath();
        ac.fill();

        // Layer 2: Luminous cerulean / royal cobalt ribbon (left & right swells matching 00:02-00:19)
        const g2 = ac.createRadialGradient(
          aw * (0.24 + 0.18 * Math.sin(t * 0.6 + scrollShift * 0.35)),
          ah * 0.84,
          aw * 0.04,
          aw * 0.32,
          ah * 0.86,
          aw * 0.62
        );
        g2.addColorStop(0, 'rgba(46, 134, 255, 0.54)');
        g2.addColorStop(0.5, 'rgba(20, 82, 214, 0.28)');
        g2.addColorStop(1, 'rgba(5, 18, 52, 0)');
        ac.fillStyle = g2;
        ac.beginPath();
        ac.moveTo(-80 * AURORA_SCALE, ah + 80 * AURORA_SCALE);
        for (let x = -80 * AURORA_SCALE; x <= aw + 80 * AURORA_SCALE; x += 64 * AURORA_SCALE) {
          const nx = x / aw;
          const wave =
            Math.sin(nx * 4.2 - t * 0.9 + scrollShift * 0.6) * (ah * 0.085) +
            Math.sin(nx * 1.8 + t * 0.4) * (ah * 0.05);
          ac.lineTo(x, baseHorizon + ah * 0.07 + wave);
        }
        ac.lineTo(aw + 80 * AURORA_SCALE, ah + 80 * AURORA_SCALE);
        ac.closePath();
        ac.fill();

        // Layer 3: Controlled ice-blue crest highlight on right/bottom swell
        const g3 = ac.createRadialGradient(
          aw * (0.78 - 0.14 * Math.cos(t * 0.5 + scrollShift * 0.4)),
          ah * 0.78,
          aw * 0.03,
          aw * 0.76,
          ah * 0.8,
          aw * 0.48
        );
        g3.addColorStop(0, 'rgba(92, 168, 255, 0.42)');
        g3.addColorStop(0.55, 'rgba(26, 98, 232, 0.18)');
        g3.addColorStop(1, 'rgba(4, 14, 42, 0)');
        ac.fillStyle = g3;
        ac.fillRect(0, ah * 0.32, aw, ah * 0.72);

        ac.restore();
        ctx.drawImage(auroraCanvas, 0, 0, cw, ch);
      }

      // The ambient loop lives in the single master frame driver at the top;
      // this canvas only exposes renderAmbient() and resizeCanvas() to it.

      /* ============================================================
         3. SCROLL-DRIVEN CINEMATIC TIMELINE ENGINE
         ============================================================ */
      const heroSec = document.getElementById('hero');
      const heroStage = document.getElementById('heroStage');
      const aboutSec = document.getElementById('about');
      const aboutLeft = document.getElementById('aboutLeft');
      const reelCards = Array.from(document.querySelectorAll('#reelStack .reel-card'));
      const servicesSec = document.getElementById('services');
      const discoverWord = document.getElementById('discoverWord');
      const discoverItems = Array.from(document.querySelectorAll('#discoverStage [data-parallax]'));
      const impactSec = document.getElementById('impact');
      const impactItems = Array.from(document.querySelectorAll('#impactStage [data-parallax]'));
      const counterEls = Array.from(document.querySelectorAll('[data-count-target]'));
      const worksSec = document.getElementById('works');
      const filmstripTrack = document.getElementById('filmstripTrack');
      const worksLockup = document.getElementById('worksLockup');
      const contactSec = document.getElementById('contact');
      const tileTL = document.getElementById('tileTL');
      const tileTR = document.getElementById('tileTR');
      const tileBL = document.getElementById('tileBL');
      const tileBR = document.getElementById('tileBR');
      const navLinks = Array.from(document.querySelectorAll('.nav-pill .nav-link'));
      const railDots = Array.from(document.querySelectorAll('.rail-dot'));

      let stripManualOffset = 0;

      function clamp(val, min, max) {
        return Math.max(min, Math.min(max, val));
      }

      // Geometry was previously read with getBoundingClientRect()/offsetHeight
      // between style writes, forcing a synchronous layout every scroll frame.
      // Measure once per resize/font load instead; only the scroll value
      // changes per frame now.
      let geom = null;
      let lastActiveId = '';
      let lastMobileMode = null;
      const counterData = counterEls.map((el) => ({
        el,
        target: parseInt(el.dataset.countTarget, 10),
        suffix: el.dataset.countSuffix || '',
        last: ''
      }));
      const parallaxDepth = new WeakMap();
      discoverItems.concat(impactItems).forEach((item) => {
        parallaxDepth.set(item, parseFloat(item.dataset.parallax) || 0);
      });

      const styleCache = new WeakMap();
      function writeStyle(el, prop, value) {
        let cached = styleCache.get(el);
        if (!cached) {
          cached = Object.create(null);
          styleCache.set(el, cached);
        }
        if (cached[prop] !== value) {
          el.style[prop] = value;
          cached[prop] = value;
        }
      }

      function measureGeometry() {
        resizeCanvas();
        const vh = window.innerHeight;
        const sy = window.scrollY;
        const sections = [heroSec, aboutSec, servicesSec, impactSec, worksSec, contactSec].map((el) => {
          const r = el.getBoundingClientRect();
          return {
            id: el.id,
            top: r.top + sy,
            height: r.height,
            scrollable: r.height - vh
          };
        });
        geom = {
          vh,
          maxScroll: Math.max(1, document.documentElement.scrollHeight - vh),
          isDesktop: window.innerWidth > 1024,
          sections,
          stripMax: Math.max(0, filmstripTrack.scrollWidth - window.innerWidth + 100)
        };
        sceneDirty = true;
        ambientDirty = true;
        requestFrame();
      }

      function sectionProgress(section, scrollY) {
        if (section.scrollable <= 0) return 0;
        return clamp(-(section.top - scrollY) / section.scrollable, 0, 1);
      }

      function setCounterText(counter, text) {
        if (counter.last === text) return;
        counter.el.textContent = text;
        counter.last = text;
      }

      function updateScrollScenes() {
        if (!geom) return;
        const g = geom;
        // Lenis exposes a float scroll position; using it instead of the
        // integer window.scrollY removes 1px quantisation jitter per frame.
        const sy = lenis ? lenis.animatedScroll : window.scrollY;
        globalScroll = clamp(sy / g.maxScroll, 0, 1);

        const mid = g.vh * 0.45;
        let activeId = 'hero';
        for (let i = 0; i < g.sections.length; i++) {
          const s = g.sections[i];
          const top = s.top - sy;
          if (top <= mid && top + s.height >= mid * 0.4) activeId = s.id;
        }
        if (activeId !== lastActiveId) {
          navLinks.forEach((a) => a.classList.toggle('active', a.dataset.section === activeId));
          railDots.forEach((d) => d.classList.toggle('active', d.dataset.target === activeId));
          lastActiveId = activeId;
        }

        if (!g.isDesktop) {
          // Ensure counters show final values cleanly on mobile/tablet, once.
          if (lastMobileMode !== false) {
            counterData.forEach((c) => setCounterText(c, c.target + c.suffix));
            [tileTL, tileTR, tileBL, tileBR].forEach((t) => {
              writeStyle(t, 'transform', 'translate3d(0,0,0)');
              writeStyle(t, 'opacity', '1');
            });
            lastMobileMode = false;
          }
          return;
        }
        lastMobileMode = true;

        // --- SCENE 1: HERO EXIT CHOREOGRAPHY ---
        const pHero = sectionProgress(g.sections[0], sy);
        const heroScale = 1 + pHero * 0.1;
        const heroY = -pHero * 64;
        const heroOp = clamp(1 - pHero * 1.15, 0, 1);
        writeStyle(heroStage, 'transform', `translate3d(0, ${heroY.toFixed(1)}px, 0) scale(${heroScale.toFixed(3)})`);
        writeStyle(heroStage, 'opacity', heroOp.toFixed(3));

        // --- SCENE 2: ABOUT + VERTICAL PERSPECTIVE REEL (01 -> 05) ---
        const pAbout = sectionProgress(g.sections[1], sy);
        const activeFloat = pAbout * (reelCards.length - 1);
        const activeIdx = Math.round(activeFloat);
        writeStyle(aboutLeft, 'transform', `translate3d(0, ${((0.5 - pAbout) * 26).toFixed(1)}px, 0)`);

        reelCards.forEach((card, idx) => {
          const diff = idx - activeFloat;
          const absD = Math.abs(diff);
          const yOffset = diff * 144;
          const scale = clamp(1.06 - absD * 0.13, 0.72, 1.06);
          const xOffset = absD * 18;
          const opacity = clamp(1 - absD * 0.34, 0.16, 1);
          writeStyle(card, 'transform', `translate3d(${xOffset.toFixed(1)}px, ${yOffset.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`);
          writeStyle(card, 'opacity', opacity.toFixed(3));
          writeStyle(card, 'zIndex', String(20 - Math.round(absD * 4)));
          const isActive = idx === activeIdx;
          if (card.classList.contains('is-active') !== isActive) card.classList.toggle('is-active', isActive);
        });

        // --- SCENE 3: SERVICES "Discover" SPATIAL PARALLAX ---
        const pServices = sectionProgress(g.sections[2], sy);
        const centeredS = (pServices - 0.5) * 2; // -1 to +1
        writeStyle(discoverWord, 'transform', `translate3d(0, ${(-centeredS * 28).toFixed(1)}px, 0) scale(${(1 + Math.abs(centeredS) * 0.04).toFixed(3)})`);
        writeStyle(discoverWord, 'opacity', clamp(1 - Math.max(0, Math.abs(centeredS) - 0.78) * 3.2, 0.15, 1).toFixed(3));

        discoverItems.forEach((item) => {
          const dy = -centeredS * parallaxDepth.get(item) * 1.45;
          writeStyle(item, 'transform', `translate3d(0, ${dy.toFixed(1)}px, 0)`);
        });

        // --- SCENE 4: IMPACT STAGGERED METRIC CARDS + LIVE COUNTERS ---
        const pImpact = sectionProgress(g.sections[3], sy);
        const centeredI = (pImpact - 0.5) * 2;
        impactItems.forEach((item) => {
          const dy = -centeredI * parallaxDepth.get(item) * 1.35;
          writeStyle(item, 'transform', `translate3d(0, ${dy.toFixed(1)}px, 0)`);
        });

        // Scrub counters from 10% to 100% of target over first half of scene (matching 00:09 -> 00:12)
        const countRatio = clamp(pImpact * 2.1 + 0.12, 0.12, 1);
        const easedCount = 1 - Math.pow(1 - countRatio, 3);
        counterData.forEach((c) => {
          setCounterText(c, Math.max(1, Math.round(c.target * easedCount)) + c.suffix);
        });

        // --- SCENE 5: HORIZONTAL FILMSTRIP + SELECTED 2026 WORKS ---
        const pWorks = sectionProgress(g.sections[4], sy);
        const totalShift = clamp(pWorks * g.stripMax + stripManualOffset, 0, g.stripMax);
        writeStyle(filmstripTrack, 'transform', `translate3d(${-totalShift.toFixed(1)}px, 0, 0)`);
        writeStyle(worksLockup, 'transform', `translate3d(0, ${((0.5 - pWorks) * 22).toFixed(1)}px, 0)`);

        // --- SCENE 6: 4-TILE ASSEMBLING 2x2 MARK (00:17 - 00:19) ---
        const contactTop = g.sections[5].top - sy;
        const assembleProgress = clamp((g.vh - contactTop) / (g.vh * 0.72), 0, 1);
        const easedA = 1 - Math.pow(1 - assembleProgress, 3);
        const spread = (1 - easedA) * 58;
        writeStyle(tileTL, 'transform', `translate3d(${(-spread).toFixed(1)}px, ${(-spread).toFixed(1)}px, 0)`);
        writeStyle(tileTR, 'transform', `translate3d(${(spread).toFixed(1)}px, ${(-spread).toFixed(1)}px, 0)`);
        writeStyle(tileBL, 'transform', `translate3d(${(-spread).toFixed(1)}px, ${(spread).toFixed(1)}px, 0)`);
        writeStyle(tileBR, 'transform', `translate3d(${(spread).toFixed(1)}px, ${(spread).toFixed(1)}px, 0)`);
      }

      // Native scrolling only exists when Lenis is off (touch / reduced motion).
      window.addEventListener('scroll', () => {
        if (lenis) return;
        sceneDirty = true;
        requestFrame();
      }, { passive: true });

      let resizeTick = false;
      window.addEventListener('resize', () => {
        if (resizeTick) return;
        resizeTick = true;
        requestAnimationFrame(() => {
          resizeTick = false;
          measureGeometry();
        });
      }, { passive: true });

      if (document.fonts && document.fonts.ready) document.fonts.ready.then(measureGeometry);
      window.addEventListener('load', measureGeometry, { once: true });
      if (typeof ResizeObserver === 'function') {
        let lastBodyHeight = 0;
        new ResizeObserver((entries) => {
          const h = Math.round(entries[0].contentRect.height);
          if (h === lastBodyHeight) return;
          lastBodyHeight = h;
          measureGeometry();
        }).observe(document.body);
      }

      measureGeometry();


      /* ============================================================
         4. INTERACTIVE CONTROLS (RAIL, FILMSTRIP, MODAL, FORM, MENU)
         ============================================================ */
      railDots.forEach((dot) => {
        dot.addEventListener('click', () => {
          const target = document.getElementById(dot.dataset.target);
          if (target) smoothScrollTo(target);
        });
      });

      const stripPrev = document.getElementById('stripPrev');
      const stripNext = document.getElementById('stripNext');
      const filmstripWrap = document.getElementById('filmstripWrap');

      stripPrev.addEventListener('click', () => {
        if (window.innerWidth <= 1024) {
          filmstripWrap.scrollBy({ left: -280, behavior: 'smooth' });
        } else {
          stripManualOffset = Math.max(-420, stripManualOffset - 260);
          sceneDirty = true;
          requestFrame();
        }
      });

      stripNext.addEventListener('click', () => {
        if (window.innerWidth <= 1024) {
          filmstripWrap.scrollBy({ left: 280, behavior: 'smooth' });
        } else {
          stripManualOffset = Math.min(420, stripManualOffset + 260);
          sceneDirty = true;
          requestFrame();
        }
      });

      // Mobile drawer
      const mobileMenuBtn = document.getElementById('mobileMenuBtn');
      const mobileDrawer = document.getElementById('mobileDrawer');
      mobileMenuBtn.addEventListener('click', () => {
        const open = mobileDrawer.classList.toggle('open');
        mobileMenuBtn.setAttribute('aria-expanded', String(open));
        setLenisPaused(open);
      });
      mobileDrawer.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
          mobileDrawer.classList.remove('open');
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
          setLenisPaused(false);
        });
      });

      // Modal for Services & Projects
      const modal = document.getElementById('detailModal');
      const modalCloseBtn = document.getElementById('modalCloseBtn');
      const modalImg = document.getElementById('modalImg');
      const modalEyebrow = document.getElementById('modalEyebrow');
      const modalTitle = document.getElementById('modalTitle');
      const modalDesc = document.getElementById('modalDesc');
      const modalList = document.getElementById('modalList');
      const modalMetric = document.getElementById('modalMetric');
      const modalInquiryBtn = document.getElementById('modalInquiryBtn');
      let currentModalServiceChip = '';

      function openDetailModal(type, id) {
        const data = type === 'project' ? PROJECTS_DATA[id] : SERVICES_DATA[id];
        if (!data) return;
        modalImg.src = data.img;
        modalImg.alt = data.title;
        modalEyebrow.textContent = data.eyebrow;
        modalTitle.textContent = data.title;
        modalDesc.textContent = data.desc;
        modalList.innerHTML = '';
        data.bullets.forEach((b) => {
          const li = document.createElement('li');
          li.textContent = b;
          modalList.appendChild(li);
        });
        modalMetric.textContent = data.metric;
        currentModalServiceChip = data.serviceChip || '';
        modal.classList.add('open');
        setLenisPaused(true);
      }

      function closeDetailModal() {
        if (!modal.classList.contains('open')) return;
        modal.classList.remove('open');
        setLenisPaused(false);
      }

      document.querySelectorAll('[data-modal-type]').forEach((el) => {
        el.addEventListener('click', () => openDetailModal(el.dataset.modalType, el.dataset.modalId));
        el.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openDetailModal(el.dataset.modalType, el.dataset.modalId);
          }
        });
      });

      modalCloseBtn.addEventListener('click', closeDetailModal);
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeDetailModal();
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) closeDetailModal();
      });

      // Toast helper
      const toastEl = document.getElementById('toast');
      let toastTimer = null;
      function showToast(msg) {
        toastEl.textContent = msg;
        toastEl.classList.add('show');
        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2600);
      }

      // Service chips toggle
      const chipBtns = Array.from(document.querySelectorAll('#serviceChips .service-chip'));
      chipBtns.forEach((chip) => {
        chip.addEventListener('click', () => chip.classList.toggle('selected'));
      });

      modalInquiryBtn.addEventListener('click', () => {
        closeDetailModal();
        if (currentModalServiceChip) {
          chipBtns.forEach((c) => {
            if (c.dataset.service === currentModalServiceChip) c.classList.add('selected');
          });
        }
        smoothScrollTo(contactSec);
        showToast('Scope pre-selected in the inquiry brief');
      });

      // Copy email with safe fallback
      const copyEmailBtn = document.getElementById('copyEmailBtn');
      copyEmailBtn.addEventListener('click', () => {
        const email = 'STUDIO@AZUREFOLIO.CO';
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(email).then(() => showToast('Email copied to clipboard')).catch(() => fallbackCopy(email));
        } else {
          fallbackCopy(email);
        }
      });

      function fallbackCopy(text) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand('copy');
          showToast('Email copied to clipboard');
        } catch (err) {
          showToast('STUDIO@AZUREFOLIO.CO');
        }
        document.body.removeChild(ta);
      }

      // Contact form submission
      const contactForm = document.getElementById('contactForm');
      const formStatus = document.getElementById('formStatus');
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('clientName').value.trim();
        const email = document.getElementById('clientEmail').value.trim();
        const brief = document.getElementById('clientBrief').value.trim();
        const selectedServices = chipBtns.filter((c) => c.classList.contains('selected')).map((c) => c.dataset.service);

        if (!name || !email || !email.includes('@') || !brief) {
          formStatus.textContent = 'Please complete your name, a valid email address, and a short project brief.';
          formStatus.classList.add('visible');
          return;
        }

        const scopeLabel = selectedServices.length ? selectedServices.join(', ') : 'General Creative Inquiry';
        formStatus.textContent = `Thank you, ${name}. Your brief for ${scopeLabel} has been logged — our creative director will reply to ${email} within 24 hours.`;
        formStatus.classList.add('visible');
        contactForm.reset();
        showToast('Project inquiry received');
      });

      // Back to top
      document.getElementById('backTopBtn').addEventListener('click', smoothScrollTop);
    })();
