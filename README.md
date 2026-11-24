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

`js/main.js` boots Lenis at the top of the IIFE and drives it from one manual
rAF loop (`autoRaf: false`) so it can be paused. Tuning is aimed at laptop
trackpads:

| Setting | Value | Why |
| --- | --- | --- |
| `lerp` | `0.09` | Responsive on the first wheel tick, still glides on high-refresh panels |
| `wheelMultiplier` | `0.92` | Finer trackpad increments, no overshoot at the end of a fling |
| `syncTouch` | `false` | Native touch scrolling stays untouched on touchscreens / hybrid laptops |
| `anchors` | `{ offset: 0, duration: 1.05 }` | Nav links ease instead of jumping |
| `autoRaf` | `false` | One loop, pausable on tab hide and while a modal is open |

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

## Laptop Performance Notes

- The aurora canvas sizes its backing store against a ~2.3M-pixel budget
  instead of a flat `devicePixelRatio` cap, so a 1440p retina laptop renders
  about 1918×1198 instead of 2880×1800 for a fully blurred background — a large
  drop in per-frame fill cost with no visible difference.
- Canvas and Lenis loops stop completely on `visibilitychange` (hidden tab) and
  resume on return.
- Canvas resizing is rAF-throttled, and `resizeCanvas()` no-ops when the
  viewport and DPR are unchanged.
- Scene transforms are written directly from Lenis' `scroll` event (one frame
  fresher than a deferred window handler); the native `scroll` listener is only
  used when Lenis is inactive.

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
