# Portfolio Template

A single-file, dark editorial portfolio template. No build step, no dependencies to install — open `index.html` or deploy the folder as-is.

## Customize

Everything lives in `index.html`. Search for `[` to find every placeholder and replace it with your own content.

- `[YOUR_NAME]`, `[YOUR_TITLE_HERE]`, `[YOUR_LOCATION]` — identity
- `[YOUR_EMAIL_HERE]`, `[SOCIAL_ONE]` … — contact links and `mailto:`
- `[PROJECT_HEADING]`, `[IMAGE_PLACEHOLDER]` — six work cards
- `[SERVICE_ONE_TITLE]` … — services
- `[YOUR_META_DESCRIPTION]`, `<title>` — SEO

Media frames use CSS aspect ratios and placeholders. To add real images, replace the `.frame__label` span with an `<img>` or set a `background-image` on the frame.

## Deploy

GitHub Pages: push to `main`, then **Settings → Pages → Deploy from branch → main / root**.

Or host any static server, e.g. `python -m http.server`.

## Notes

- Fonts: Inter Tight + JetBrains Mono (Google Fonts).
- Smooth scrolling: Lenis 1.3.27 (CDN), with a native fallback.
- Respects `prefers-reduced-motion`; custom cursor and magnetic effects are pointer-fine only.
