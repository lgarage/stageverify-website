# StageVerify — Agent skills index

Skills in this repo teach the agent project-specific workflows.

## Active skills

| Skill | Path | When to use |
|---|---|---|
| **UI Playwright verify** | [.cursor/skills/ui-playwright-verify/SKILL.md](.cursor/skills/ui-playwright-verify/SKILL.md) | **Always** after UI edits — run Playwright before saying work is ready |

## UI verification (required)

After any UI change:

1. `npm run build`
2. `npm run preview`
3. `npm run verify:ui -- http://localhost:PORT/stageverify-website`
4. Fix failures and re-run until all pass
5. Only then report ready to the user

Playwright is installed as a dev dependency. One-time browser install: `npx playwright install chromium`

## Adding skills

Add new skills under `.cursor/skills/<skill-name>/SKILL.md` and register them in this file.
