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
  is opaque so the compositor skips alpha blending. The aurora runs at the
  full display refresh rate on every device — no frame-rate cap or reduced
  animation path for touch screens — and time-based drift keeps its speed
  identical at any refresh rate. Reduced motion renders one static frame and
  stops the loop.
- **Cheaper film grain.** The full-viewport grain now composites normally at a
  tuned opacity instead of using `mix-blend-mode: overlay`. A pixel diff over
  four scroll positions measured an average change below 0.45/255 per channel
  (no pixel differed by more than 4 except a handful of lazy images), while a
  five-run interleaved headless benchmark cut median desktop p95 frame time
  from 33.4ms to 17.1ms. The blur on the nav pill and glass cards is unchanged.
- **Assets.** All 20 below-fold editorial images are `loading="lazy"`,
  `decoding="async"` and carry explicit `width`/`height`, so they neither block
  first paint nor shift layout when they arrive. The aurora backing store is
  budgeted at ~2.3M pixels (≈1918×1198 on a 1440p retina laptop) rather than
  raw DPR, and resizing no-ops when viewport and DPR are unchanged.

A local headless-Chrome run over the same scroll path measured desktop p95
frame time at 17.4ms (was 66.6ms), frames over 24ms at 13 (was 81), and forced
layouts at 31 (was 203). A later five-run interleaved A/B against the original
overlay blend measured median desktop p95 17.1ms versus 33.4ms, with seven
frames over 24ms per run versus fourteen. Scrolling through the full page
produced CLS of 0.0008 on desktop, 0.0021 on Android and 0.0008 on tablet.

## Animation on Every Screen

All six scroll scenes run on desktop, tablet and phone. Stacked layouts are
not pinned like the desktop sections, so `sectionProgress()` maps each section
across its full viewport traverse (top entering the bottom of the screen to
bottom leaving the top) instead of returning 0 for short sections. The hero
uses its own one-screen exit on stacked layouts, and the contact tiles use the
same contact-entry progress on every width. The mobile reel uses smaller
scale/offset steps because its cards are in a list rather than a layered
stack; they still scale, shift, fade and change the active card in sync with
scroll. The responsive `!important` rules that forced `transform: none` and
`opacity: 1` were removed, and `#hero` is clipped so its exit scale cannot
create horizontal overflow.

On touch widths the filmstrip keeps its native horizontal swipe while the
scroll timeline adds a clamped offset, so manual and scroll-driven movement
never push the last frame out of view. Lenis remains fine-pointer only; native
touch scrolling stays untouched. Reduced motion stops ambient drift and
smooth scrolling but, as on desktop, keeps the scroll-linked choreography.

Verified in headless Chrome at 1440×900 (fine pointer), 768×1024 and 390×844
(coarse pointer), plus a 390×844 reduced-motion profile: every scene element
produced multiple distinct transform/opacity states while scrolling, counters
scrubbed through intermediate values, no element was left hidden in an
offscreen section, and the full nav/modal/form/drawer interaction suite passed
with zero console errors. Real iOS Safari was not available in this
environment; iOS was emulated at iPhone size in Chrome.

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
