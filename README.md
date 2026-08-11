# DS-Portfolio

Stephen Diaba's personal portfolio homepage — a static, single-page site built with plain HTML, CSS, and JavaScript (no build tooling required).

## Features

- Responsive layout (desktop nav / mobile hamburger menu)
- Light/dark theme toggle, persisted via `localStorage`, with no flash on load
- Sticky, frosted-glass header (Apple-style blur + hairline border on scroll)
- Scroll-reveal animations on the project, client, and contact cards
- "Companies I've worked with" logo strip (grayscale, colorizes on hover)
- Contact section (email/phone/LinkedIn/GitHub cards + a message form) and a footer with social links
- SEO basics: favicon, meta description, Open Graph/Twitter card tags

## ⚠️ Action needed: contact form

The message form in the Contact section posts to a **placeholder** Formspree endpoint
(`https://formspree.io/f/YOUR_FORM_ID` in `index.html`). It won't deliver real emails until you:

1. Create a free form at [formspree.io](https://formspree.io) using `diabaseyram@gmail.com`.
2. Copy the real endpoint it gives you (looks like `https://formspree.io/f/abcd1234`).
3. Replace the placeholder in the `action` attribute of `#contact-form` in `index.html`.

Until then, submitting the form will show an inline error with a `mailto:` fallback link — it degrades gracefully, it just won't send.

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
- **Contact details / social links**: edit the `.contact-methods` cards and `.footer-social` links in `index.html` (email, phone, LinkedIn, GitHub each appear in both places).
