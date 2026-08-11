# DS-Portfolio

Stephen Diaba's personal portfolio homepage — a static, single-page site built with plain HTML, CSS, and JavaScript (no build tooling required).

## Features

- Responsive layout (desktop nav / mobile hamburger menu)
- Light/dark theme toggle, persisted via `localStorage`, with no flash on load
- Sticky, frosted-glass header (Apple-style blur + hairline border on scroll)
- Scroll-reveal animations on the project and client cards
- "Companies I've worked with" logo strip (grayscale, colorizes on hover)

## Project structure

```
index.html          Page markup
css/style.css        All styling, incl. light/dark theme tokens
js/script.js         Nav toggle, theme toggle, scroll header state, scroll-reveal
assets/portrait.png  Hero portrait (background removed)
assets/clients/      Client/company logos shown in the "Companies I've worked with" section
scripts/remove_bg.py Utility to cut a flat background out of a new portrait photo
```

## Running locally

No build step — just serve the folder and open it in a browser:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

(Opening `index.html` directly also works, but a local server avoids browser file:// restrictions.)

## Customizing content

- **Name, headline, experience badge, skill tags**: edit the hero section in `index.html`.
- **Projects**: edit the three cards in the `.project-grid` section of `index.html`; swap the placeholder color blocks for real project images by setting a `background-image` on `.project-thumb-N` in `css/style.css`.
- **Clients**: drop a logo into `assets/clients/` and add a matching `.client-card` block in the `.client-grid` section of `index.html`.
- **Portrait**: replace `assets/portrait.png`, or run `python scripts/remove_bg.py <input> <output>` on a new photo with a flat background to cut it out first.
