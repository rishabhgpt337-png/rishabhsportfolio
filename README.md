# PORTfolio — Creative Agency Portfolio Website

Complete, dependency-free production website built with semantic HTML, modern CSS, and vanilla JavaScript. Smooth scrolling is handled by a vendored copy of [Lenis](https://github.com/darkroomengineering/lenis), so the deployed site has no runtime dependency on a CDN or a build step.

## Project Structure

- `index.html` — Main entry point (links to `css/`, `js/`, and `assets/`)
- `css/styles.css` — Full design system, typography, fluted-glass surfaces, and responsive rules
- `css/lenis.css` — Lenis 1.3.28 styles plus the local smooth-scroll overrides
- `js/main.js` — Lenis smooth-scroll engine, atmospheric blue aurora/bokeh canvas, 6-scene scroll choreography, modals, and inquiry form logic
- `js/vendor/lenis.min.js` — Lenis 1.3.28 UMD build, vendored from npm (MIT)
- `assets/` — 5 optimized dark-studio editorial images + SVG favicon
- `standalone/index.html` — Single-file self-contained build (all CSS, JS, and images embedded)

## Smooth Scrolling (Lenis)

`js/main.js` boots Lenis at the top of the IIFE. `autoRaf: false` hands its
ticking to a single `masterFrame()` driver that also advances the scroll
choreography and the aurora canvas — one rAF callback per frame instead of
three competing loops. Tuning is aimed at laptop trackpads:

| Setting | Value | Why |
| --- | --- | --- |
| `lerp` | `0.09` | Responsive on the first wheel tick, still glides on high-refresh panels |
| `wheelMultiplier` | `0.92` | Finer trackpad increments, no overshoot at the end of a fling |
| `syncTouch` | `false` | Native touch scrolling stays untouched on touchscreens / hybrid laptops |
| `anchors` | `{ offset: 0, duration: 1.05 }` | Nav links ease instead of jumping |
| `autoRaf` | `false` | Ticked by the shared frame driver, pausable on tab hide / modal open |

Behavioural guards:

- Lenis only initialises for `(hover: hover) and (pointer: fine)`; phones and
  reduced-motion users get plain native scrolling. Both media queries are
  watched live, so plugging in a mouse or toggling reduced motion switches
  modes without a reload.
- `html { scroll-behavior: smooth }` from the base stylesheet is neutralised
  under `html.lenis` — the two easing systems otherwise fight.
- Modal and mobile drawer freezes are routed through `setLenisPaused()`, and
  the modal card is marked `data-lenis-prevent` so its own scroll area keeps
  native wheel behaviour.
- Rail dots, the "Inquire" jump, and back-to-top all go through the same
  `smoothScrollTo()` / `smoothScrollTop()` helpers and fall back to
  `scrollIntoView` / `scrollTo` when Lenis is off.

## Performance Notes

These preserve the existing design, content and animation timing — they only
change how the browser is asked to draw it.

- **One frame driver.** Lenis, the six scroll scenes and the ambient canvas are
  advanced by the same `requestAnimationFrame` callback. Lenis' `scroll` event
  only sets a dirty flag; the scene writes happen in the following frame after
  `lenis.raf()`, so the DOM is never a frame behind and no frame schedules two
  rounds of callbacks. Hidden tabs stop the loop entirely and resume on return.
- **No forced layout on scroll.** Section geometry, viewport height and the
  filmstrip width are measured once per resize, font load and body resize (via
  `ResizeObserver`) and cached. Per-frame work uses the cached numbers plus
  Lenis' float `animatedScroll`, which also removes 1px quantisation jitter.
  `writeStyle()` skips writes when the value has not changed, and all movement
  stays on `transform` / `opacity`.
- **Cheaper aurora, identical look.** The blurred wave is rasterised into a
  0.4-scale offscreen canvas and upscaled, the bokeh motes use five cached
  gradient sprites instead of ~28 gradients per frame, and the canvas context
  is opaque so the compositor skips alpha blending. Touch / low-core devices
  cap the aurora at 30fps with time-based drift; reduced motion renders one
  static frame and stops the loop.
- **Assets.** All 20 below-fold editorial images are `loading="lazy"`,
  `decoding="async"` and carry explicit `width`/`height`, so they neither block
  first paint nor shift layout when they arrive. The aurora backing store is
  budgeted at ~2.3M pixels (≈1918×1198 on a 1440p retina laptop) rather than
  raw DPR, and resizing no-ops when viewport and DPR are unchanged.

A local headless-Chrome run over the same scroll path measured desktop p95
frame time at 17.4ms (was 66.6ms), frames over 24ms at 13 (was 81), and forced
layouts at 31 (was 203). The Android-sized run measured p95 17.1ms (was 34ms)
with zero forced layouts (was 11).

## Run Locally

Open `index.html` directly in your browser, or start a local dev server:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

Or with npm (no install required for the site itself):

```bash
npm start          # python -m http.server 8000
# or
npx serve .
```

## Updating Lenis

The deployed site uses the vendored file; npm is only needed to refresh it.

```bash
npm install              # installs lenis from package.json
npm run vendor:lenis     # copies dist/lenis.min.js -> js/vendor/lenis.min.js
```

`css/lenis.css` is maintained by hand (upstream rules + local overrides); update
its header version if you bump the package.

## Push to Your GitHub Repository

```bash
git clone https://github.com/rishabhgpt337-png/rishabhsportfolio.git
cd rishabhsportfolio
# Copy index.html, css/, js/, assets/, scripts/, package.json, and README.md into this folder
git add .
git commit -m "Add Lenis smooth scrolling and laptop performance tuning"
git push origin main
```

To publish live on GitHub Pages: open your repository **Settings -> Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`, and save.
