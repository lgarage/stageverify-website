# StageVerify — Agent skills index

Skills in this repo teach the agent project-specific workflows.

## Active skills

| Skill | Path | When to use |
|---|---|---|
| **Commit and push** | [.cursor/skills/commit-and-push/SKILL.md](.cursor/skills/commit-and-push/SKILL.md) | **Always** after any repo change — commit and push before reporting done |
| **UI Playwright verify** | [.cursor/skills/ui-playwright-verify/SKILL.md](.cursor/skills/ui-playwright-verify/SKILL.md) | **Always** after UI edits — run Playwright before commit/push |

## Default completion order

1. Make the change
2. If UI: build → preview → `npm run verify:ui` until all pass
3. **Commit and push** (required — do not skip)
4. Report done with commit hash and push confirmation

After any UI change:

1. `npm run build`
2. `npm run preview`
3. `npm run verify:ui -- http://localhost:PORT/stageverify-website`
4. Fix failures and re-run until all pass
5. Only then report ready to the user

Playwright is installed as a dev dependency. One-time browser install: `npx playwright install chromium`

## Adding skills

Add new skills under `.cursor/skills/<skill-name>/SKILL.md` and register them in this file.
