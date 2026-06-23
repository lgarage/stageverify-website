---
name: ui-playwright-verify
description: >-
  Mandatory Playwright UI verification after any marketing-site UI edit.
  Use when changing Astro components, CSS, copy layout, logos, or sections on
  stageverify-website. Never mark UI work ready until verify-ui passes.
---

# UI Playwright verification (StageVerify website)

## Rule

After **every UI edit** to this site, run Playwright checks **before** telling the user the work is ready.

Do not skip because the build passed. `npm run build` does not catch layout, copy, anchor, or responsive issues.

## When this applies

- Section components (`src/components/sections/**`)
- Layout / header / footer
- Logo, hero mockup, tokens, global CSS
- Copy that affects visible headings or CTAs
- Any change that could affect mobile/tablet/desktop layout

## Protocol

### 1. Build production output

```bash
npm run build
npm run preview
npm run verify:ui -- http://localhost:PORT/stageverify-website
```

Playwright is a dev dependency (`npm install` includes it). One-time browser install:

```bash
npx playwright install chromium
```

### 3. Fix failures before reporting ready

If any check fails:

1. Fix the issue
2. Rebuild and re-run the verifier
3. Repeat until **zero failures**

### 4. Report to the user

Include in the completion summary:

- Verifier command used
- Pass/fail counts per viewport (mobile, tablet, desktop)
- Any issues found and fixed

Only say **ready** when all checks pass.

### 5. Commit and push

Follow [.cursor/skills/commit-and-push/SKILL.md](../commit-and-push/SKILL.md). Do not report UI work complete until changes are pushed.

## What the verifier checks

| Check | Why |
|---|---|
| Page loads (200) | Broken deploy or base path |
| Exact H1 headline | Approved copy must not drift |
| Exact description in body | Approved copy must not drift |
| Single H1 | SEO / accessibility |
| No horizontal scroll | Mobile polish |
| All 6 section IDs + H2 headings | Structure intact |
| Header logo visible | Brand regression |
| Hero mockup visible | Sales page credibility |
| Feature descriptions present | Not title-only cards |
| Favicon links + fill metrics | Tab icon loads and fills square (not tiny padded mark) |
| Request Demo → `#demo` (desktop) | CTA behavior |

Extend `scripts/verify-ui.mjs` when new critical UI behavior is added.

## Live site (optional)

After push to GitHub Pages, optionally re-run against production:

```bash
node scripts/verify-ui.mjs https://lgarage.github.io/stageverify-website
```

## Related files

- `scripts/verify-ui.mjs` — smoke test script
- `skills.md` — project skill index
