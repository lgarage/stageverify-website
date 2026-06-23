---
name: session-cleanup
description: >-
  Clean up after agent sessions in stageverify-website. Use when finishing a
  task, after running preview/dev servers, after generating temp artifacts, or
  when the user asks to kill unused terminals or clean up the workspace.
---

# Session cleanup (StageVerify website)

## Rule

Before reporting a task complete — and whenever you start background servers or generate temp files — **clean up your mess**.

Do not leave a trail of preview servers, dev servers, or unneeded artifacts.

## When this applies

- You ran `npm run preview` or `npm run dev` in the background
- You generated local-only screenshots, preview PNGs, or one-off scripts
- You created `scripts/__pycache__/` or other accidental cache dirs
- The user asks to kill terminals, stop servers, or tidy the repo
- A session ends after verification/build work

## Cleanup checklist

### 1. Stop background servers

Kill stale **stageverify-website** preview/dev processes when verification is done.

PowerShell (Windows):

```powershell
Get-CimInstance Win32_Process -Filter "Name = 'node.exe'" |
  Where-Object {
    $_.CommandLine -match 'stageverify-website' -and
    ($_.CommandLine -match 'preview|astro dev|astro preview')
  } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
```

Do **not** kill unrelated node processes in other projects.

Only keep a preview server running if the user explicitly asked to leave it up.

### 2. Remove accidental artifacts

| Artifact | Action |
|---|---|
| `scripts/__pycache__/` | Delete if created |
| `public/ui-preview/` | Already gitignored; OK to leave locally or delete |
| One-off scripts (e.g. `capture-*.mjs`) | Delete unless committed intentionally |
| Temp preview servers on ports 4321–4340 | Stop processes (see above) |

Do **not** delete committed preview assets under `public/favicon-preview/`.

### 3. Do not commit junk

Never stage:

- `scripts/__pycache__/`
- `public/ui-preview/` (gitignored)
- `.env` or secrets

## Order with other project skills

1. Build → verify (ui-playwright-verify)
2. **Session cleanup** (this skill)
3. Commit and push (commit-and-push) — only for intentional repo changes

## Related files

- `skills.md` — project skill index
- `.gitignore` — ignored local artifacts (`public/ui-preview/`)
