(function () {
      'use strict';

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
      const ctx = canvas.getContext('2d');
      let cw = 0;
      let ch = 0;
      let dpr = Math.min(window.devicePixelRatio || 1, 2);
      let globalScroll = 0;

      const bokehParticles = Array.from({ length: 28 }, (_, i) => ({
        x: ((i * 37.3) % 100) / 100,
        y: ((i * 23.7) % 72) / 100,
        r: 1.4 + (i % 5) * 0.9,
        vx: (i % 2 === 0 ? 1 : -1) * (0.000018 + (i % 4) * 0.000008),
        vy: -0.000012 - (i % 3) * 0.000006,
        alpha: 0.14 + (i % 5) * 0.06,
        phase: i * 0.7
      }));

      function resizeCanvas() {
        cw = window.innerWidth;
        ch = window.innerHeight;
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.floor(cw * dpr);
        canvas.height = Math.floor(ch * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      function renderAmbient(timeMs) {
        const t = timeMs * 0.00045;
        ctx.clearRect(0, 0, cw, ch);

        // Deep obsidian void
        ctx.fillStyle = '#020306';
        ctx.fillRect(0, 0, cw, ch);

        // Subtle floating bokeh motes in the upper void
        for (let i = 0; i < bokehParticles.length; i++) {
          const p = bokehParticles[i];
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < -0.05) p.x = 1.05;
          if (p.x > 1.05) p.x = -0.05;
          if (p.y < -0.05) p.y = 0.76;

          const px = p.x * cw;
          const py = p.y * ch;
          const pulse = 0.7 + 0.3 * Math.sin(t * 2.2 + p.phase);
          const rad = p.r * 3.2;
          const grad = ctx.createRadialGradient(px, py, 0, px, py, rad);
          grad.addColorStop(0, `rgba(170, 212, 255, ${(p.alpha * pulse).toFixed(3)})`);
          grad.addColorStop(0.5, `rgba(48, 128, 255, ${(p.alpha * 0.35 * pulse).toFixed(3)})`);
          grad.addColorStop(1, 'rgba(10, 30, 80, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(px, py, rad, 0, Math.PI * 2);
          ctx.fill();
        }

        // Organic undulating cinematic BLUE aurora wave (controlled, refined glow)
        // Shifts gently with scroll progress for continuous film feel
        const scrollShift = globalScroll * Math.PI * 2.4;
        const baseHorizon = ch * (0.52 + 0.04 * Math.sin(scrollShift * 0.5));

        ctx.save();
        ctx.filter = 'blur(42px)';

        // Layer 1: Deep midnight sapphire body
        const g1 = ctx.createLinearGradient(0, baseHorizon - ch * 0.14, 0, ch);
        g1.addColorStop(0, 'rgba(8, 36, 108, 0.12)');
        g1.addColorStop(0.45, 'rgba(14, 64, 182, 0.58)');
        g1.addColorStop(1, 'rgba(7, 28, 86, 0.88)');
        ctx.fillStyle = g1;
        ctx.beginPath();
        ctx.moveTo(-80, ch + 80);
        for (let x = -80; x <= cw + 80; x += 64) {
          const nx = x / cw;
          const wave =
            Math.sin(nx * 3.4 + t + scrollShift * 0.45) * (ch * 0.095) +
            Math.cos(nx * 2.1 - t * 0.7 + scrollShift * 0.2) * (ch * 0.055);
          ctx.lineTo(x, baseHorizon + wave);
        }
        ctx.lineTo(cw + 80, ch + 80);
        ctx.closePath();
        ctx.fill();

        // Layer 2: Luminous cerulean / royal cobalt ribbon (left & right swells matching 00:02-00:19)
        const g2 = ctx.createRadialGradient(
          cw * (0.24 + 0.18 * Math.sin(t * 0.6 + scrollShift * 0.35)),
          ch * 0.84,
          cw * 0.04,
          cw * 0.32,
          ch * 0.86,
          cw * 0.62
        );
        g2.addColorStop(0, 'rgba(46, 134, 255, 0.54)');
        g2.addColorStop(0.5, 'rgba(20, 82, 214, 0.28)');
        g2.addColorStop(1, 'rgba(5, 18, 52, 0)');
        ctx.fillStyle = g2;
        ctx.beginPath();
        ctx.moveTo(-80, ch + 80);
        for (let x = -80; x <= cw + 80; x += 64) {
          const nx = x / cw;
          const wave =
            Math.sin(nx * 4.2 - t * 0.9 + scrollShift * 0.6) * (ch * 0.085) +
            Math.sin(nx * 1.8 + t * 0.4) * (ch * 0.05);
          ctx.lineTo(x, baseHorizon + ch * 0.07 + wave);
        }
        ctx.lineTo(cw + 80, ch + 80);
        ctx.closePath();
        ctx.fill();

        // Layer 3: Controlled ice-blue crest highlight on right/bottom swell
        const g3 = ctx.createRadialGradient(
          cw * (0.78 - 0.14 * Math.cos(t * 0.5 + scrollShift * 0.4)),
          ch * 0.78,
          cw * 0.03,
          cw * 0.76,
          ch * 0.8,
          cw * 0.48
        );
        g3.addColorStop(0, 'rgba(92, 168, 255, 0.42)');
        g3.addColorStop(0.55, 'rgba(26, 98, 232, 0.18)');
        g3.addColorStop(1, 'rgba(4, 14, 42, 0)');
        ctx.fillStyle = g3;
        ctx.fillRect(0, ch * 0.32, cw, ch * 0.72);

        ctx.restore();
        requestAnimationFrame(renderAmbient);
      }

      requestAnimationFrame(renderAmbient);

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

      function sectionProgress(el) {
        const rect = el.getBoundingClientRect();
        const scrollable = el.offsetHeight - window.innerHeight;
        if (scrollable <= 0) return 0;
        return clamp(-rect.top / scrollable, 0, 1);
      }

      function updateScrollScenes() {
        const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        globalScroll = clamp(window.scrollY / maxScroll, 0, 1);
        const isDesktop = window.innerWidth > 1024;

        // Active section highlight for nav + rail
        const sections = [
          { id: 'hero', el: heroSec },
          { id: 'about', el: aboutSec },
          { id: 'services', el: servicesSec },
          { id: 'impact', el: impactSec },
          { id: 'works', el: worksSec },
          { id: 'contact', el: contactSec }
        ];
        let activeId = 'hero';
        const mid = window.innerHeight * 0.45;
        for (let i = 0; i < sections.length; i++) {
          const r = sections[i].el.getBoundingClientRect();
          if (r.top <= mid && r.bottom >= mid * 0.4) {
            activeId = sections[i].id;
          }
        }
        navLinks.forEach((a) => a.classList.toggle('active', a.dataset.section === activeId));
        railDots.forEach((d) => d.classList.toggle('active', d.dataset.target === activeId));

        if (!isDesktop) {
          // Ensure counters show final values cleanly on mobile/tablet
          counterEls.forEach((el) => {
            el.textContent = el.dataset.countTarget + (el.dataset.countSuffix || '');
          });
          [tileTL, tileTR, tileBL, tileBR].forEach((t) => {
            t.style.transform = 'translate3d(0,0,0)';
            t.style.opacity = '1';
          });
          return;
        }

        // --- SCENE 1: HERO EXIT CHOREOGRAPHY ---
        const pHero = sectionProgress(heroSec);
        const heroScale = 1 + pHero * 0.1;
        const heroY = -pHero * 64;
        const heroOp = clamp(1 - pHero * 1.15, 0, 1);
        heroStage.style.transform = `translate3d(0, ${heroY.toFixed(1)}px, 0) scale(${heroScale.toFixed(3)})`;
        heroStage.style.opacity = heroOp.toFixed(3);

        // --- SCENE 2: ABOUT + VERTICAL PERSPECTIVE REEL (01 -> 05) ---
        const pAbout = sectionProgress(aboutSec);
        const activeFloat = pAbout * (reelCards.length - 1);
        const activeIdx = Math.round(activeFloat);
        aboutLeft.style.transform = `translate3d(0, ${((0.5 - pAbout) * 26).toFixed(1)}px, 0)`;

        reelCards.forEach((card, idx) => {
          const diff = idx - activeFloat;
          const absD = Math.abs(diff);
          const yOffset = diff * 144;
          const scale = clamp(1.06 - absD * 0.13, 0.72, 1.06);
          const xOffset = absD * 18;
          const opacity = clamp(1 - absD * 0.34, 0.16, 1);
          card.style.transform = `translate3d(${xOffset.toFixed(1)}px, ${yOffset.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
          card.style.opacity = opacity.toFixed(3);
          card.style.zIndex = String(20 - Math.round(absD * 4));
          card.classList.toggle('is-active', idx === activeIdx);
        });

        // --- SCENE 3: SERVICES "Discover" SPATIAL PARALLAX ---
        const pServices = sectionProgress(servicesSec);
        const centeredS = (pServices - 0.5) * 2; // -1 to +1
        discoverWord.style.transform = `translate3d(0, ${(-centeredS * 28).toFixed(1)}px, 0) scale(${(1 + Math.abs(centeredS) * 0.04).toFixed(3)})`;
        discoverWord.style.opacity = clamp(1 - Math.max(0, Math.abs(centeredS) - 0.78) * 3.2, 0.15, 1).toFixed(3);

        discoverItems.forEach((item) => {
          const depth = parseFloat(item.dataset.parallax) || 0;
          const dy = -centeredS * depth * 1.45;
          item.style.transform = `translate3d(0, ${dy.toFixed(1)}px, 0)`;
        });

        // --- SCENE 4: IMPACT STAGGERED METRIC CARDS + LIVE COUNTERS ---
        const pImpact = sectionProgress(impactSec);
        const centeredI = (pImpact - 0.5) * 2;
        impactItems.forEach((item) => {
          const depth = parseFloat(item.dataset.parallax) || 0;
          const dy = -centeredI * depth * 1.35;
          item.style.transform = `translate3d(0, ${dy.toFixed(1)}px, 0)`;
        });

        // Scrub counters from 10% to 100% of target over first half of scene (matching 00:09 -> 00:12)
        const countRatio = clamp(pImpact * 2.1 + 0.12, 0.12, 1);
        const easedCount = 1 - Math.pow(1 - countRatio, 3);
        counterEls.forEach((el) => {
          const target = parseInt(el.dataset.countTarget, 10);
          const suffix = el.dataset.countSuffix || '';
          const current = Math.max(1, Math.round(target * easedCount));
          el.textContent = current + suffix;
        });

        // --- SCENE 5: HORIZONTAL FILMSTRIP + SELECTED 2026 WORKS ---
        const pWorks = sectionProgress(worksSec);
        const maxTrackShift = Math.max(0, filmstripTrack.scrollWidth - window.innerWidth + 100);
        const totalShift = clamp(pWorks * maxTrackShift + stripManualOffset, 0, maxTrackShift);
        filmstripTrack.style.transform = `translate3d(${-totalShift.toFixed(1)}px, 0, 0)`;
        worksLockup.style.transform = `translate3d(0, ${((0.5 - pWorks) * 22).toFixed(1)}px, 0)`;

        // --- SCENE 6: 4-TILE ASSEMBLING 2x2 MARK (00:17 - 00:19) ---
        const cRect = contactSec.getBoundingClientRect();
        const assembleProgress = clamp((window.innerHeight - cRect.top) / (window.innerHeight * 0.72), 0, 1);
        const easedA = 1 - Math.pow(1 - assembleProgress, 3);
        const spread = (1 - easedA) * 58;
        tileTL.style.transform = `translate3d(${(-spread).toFixed(1)}px, ${(-spread).toFixed(1)}px, 0)`;
        tileTR.style.transform = `translate3d(${(spread).toFixed(1)}px, ${(-spread).toFixed(1)}px, 0)`;
        tileBL.style.transform = `translate3d(${(-spread).toFixed(1)}px, ${(spread).toFixed(1)}px, 0)`;
        tileBR.style.transform = `translate3d(${(spread).toFixed(1)}px, ${(spread).toFixed(1)}px, 0)`;
      }

      let ticking = false;
      function onScrollOrResize() {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(() => {
            updateScrollScenes();
            ticking = false;
          });
        }
      }

      window.addEventListener('scroll', onScrollOrResize, { passive: true });
      window.addEventListener('resize', onScrollOrResize);
      updateScrollScenes();

      /* ============================================================
         4. INTERACTIVE CONTROLS (RAIL, FILMSTRIP, MODAL, FORM, MENU)
         ============================================================ */
      railDots.forEach((dot) => {
        dot.addEventListener('click', () => {
          const target = document.getElementById(dot.dataset.target);
          if (target) target.scrollIntoView({ behavior: 'smooth' });
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
          updateScrollScenes();
        }
      });

      stripNext.addEventListener('click', () => {
        if (window.innerWidth <= 1024) {
          filmstripWrap.scrollBy({ left: 280, behavior: 'smooth' });
        } else {
          stripManualOffset = Math.min(420, stripManualOffset + 260);
          updateScrollScenes();
        }
      });

      // Mobile drawer
      const mobileMenuBtn = document.getElementById('mobileMenuBtn');
      const mobileDrawer = document.getElementById('mobileDrawer');
      mobileMenuBtn.addEventListener('click', () => {
        const open = mobileDrawer.classList.toggle('open');
        mobileMenuBtn.setAttribute('aria-expanded', String(open));
      });
      mobileDrawer.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
          mobileDrawer.classList.remove('open');
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
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
      }

      function closeDetailModal() {
        modal.classList.remove('open');
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
        contactSec.scrollIntoView({ behavior: 'smooth' });
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
      document.getElementById('backTopBtn').addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    })();
