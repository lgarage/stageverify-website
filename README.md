# StageVerify Marketing Website

Standalone public sales page for StageVerify — material staging and pickup verification for trade contractors.

This is a static marketing site only. No backend, auth, database, CMS, or connection to the StageVerify platform app.

## Stack

- [Astro](https://astro.build/) 6
- [Tailwind CSS](https://tailwindcss.com/) 4
- TypeScript

## Prerequisites

- Node.js **22.12.0** or later

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) in your browser.

## Build

```bash
npm run build
```

Static output is written to `dist/`.

## Preview production build

```bash
npm run preview
```

## Project structure

```
src/
├── components/
│   ├── layout/       # Header, Footer
│   ├── sections/     # Page sections (Hero, Problem, etc.)
│   └── ui/           # Reusable UI (Button, Card, Logo, HeroMockup)
├── data/site.ts      # Copy and navigation constants
├── layouts/          # BaseLayout
├── pages/index.astro # Single-page site
└── styles/
    ├── global.css    # Tailwind + base styles
    └── tokens.css    # Brand color CSS variables
public/
└── images/           # Logo and static assets
```

## Brand colors

All brand colors live in `src/styles/tokens.css` and are wired into Tailwind via `src/styles/global.css`. Update the CSS variables there when final brand values are ready.

## Logo

Brand assets in `public/images/`:

| File | Use |
|---|---|
| `svlogo_full.png` | Header and footer (served from `logos/svlogo_full.png`) |
| `stageverify-icon.png` | App icon / Apple touch icon |
| `favicon.svg` | Browser tab favicon |

Source file: `logos/svlogo_full.png`. The header version makes **Stage** white for dark backgrounds; icon and **Verify** keep brand colors. Regenerate after updating the source:

```bash
python scripts/prepare-logo.py
```

## Deployment

Not configured in this milestone. The `dist/` folder can be deployed to any static host (Cloudflare Pages, Netlify, Vercel, etc.) when ready.

Target domain: **stageverify.com**
