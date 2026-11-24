# PORTfolio — Creative Agency Portfolio Website

Complete, dependency-free production website built with semantic HTML, modern CSS, and vanilla JavaScript.

## Project Structure

- `index.html` — Main entry point (links to `css/styles.css`, `js/main.js`, and `assets/`)
- `css/styles.css` — Full design system, typography, fluted-glass surfaces, and responsive rules
- `js/main.js` — Atmospheric blue aurora/bokeh canvas engine, 6-scene scroll choreography, modals, and inquiry form logic
- `assets/` — 5 optimized dark-studio editorial images
- `standalone/index.html` — Single-file self-contained build (all CSS, JS, and images embedded)

## Run Locally

Open `index.html` directly in your browser, or start a local dev server:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

Or with Node.js:

```bash
npx serve .
```

## Push to Your GitHub Repository

```bash
git clone https://github.com/rishabhgpt337-png/rishabhsportfolio.git
cd rishabhsportfolio
# Copy index.html, css/, js/, assets/, and README.md into this folder
git add .
git commit -m "Rebuild portfolio website"
git push origin main
```

To publish live on GitHub Pages: open your repository **Settings -> Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`, and save.
