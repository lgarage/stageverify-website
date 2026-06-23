---
name: commit-and-push
description: >-
  Mandatory git commit and push after any change to stageverify-website.
  Use whenever files are created, edited, or deleted in this repo. Do not
  report work complete until changes are committed and pushed to origin.
---

# Commit and push (StageVerify website)

## Rule

After **any change** in this repository — code, copy, config, skills, scripts, assets — **commit and push** before telling the user the work is done.

Do not leave completed work only on disk. Do not wait for the user to ask for a commit.

## When this applies

- UI / copy / component edits
- Build, deploy, or CI config
- New or updated skills and docs
- Script or test changes
- Logo or public assets

**Skip only when:** the user explicitly says not to commit/push for that task, or there are literally no file changes.

## Protocol

### 1. Review changes

Run in parallel:

```bash
git status
git diff
git log -3 --oneline
```

### 2. Stage relevant files

- Include all intentional changes for the task
- **Never** stage secrets (`.env`, credentials, tokens)

### 3. Commit

- Match recent commit message style (short imperative subject, optional body)
- Focus on **why**, not a file list
- One logical commit per task when possible

PowerShell example:

```powershell
git add <paths>
git commit -m "fix: align site copy with product scope"
```

### 4. Push

```bash
git push origin HEAD
```

If the branch has no upstream:

```bash
git push -u origin HEAD
```

### 5. Confirm

```bash
git status
```

Report to the user: commit hash, branch, and that push succeeded.

## Git safety (required)

- Never update git config
- Never force-push to `main`/`master` without explicit user request
- Never skip hooks unless the user explicitly asks
- Never amend unless user rules allow it
- If pre-commit hook fails, fix and create a **new** commit — do not amend a failed commit

## Order with other project skills

When UI changed:

1. Build and run Playwright (`ui-playwright-verify` skill) — fix until green
2. **Session cleanup** (`session-cleanup` skill) — stop preview/dev servers
3. **Then** commit and push (this skill)
4. Optionally verify live GitHub Pages URL after deploy completes

## Related files

- `skills.md` — project skill index
- `.cursor/skills/ui-playwright-verify/SKILL.md` — runs before commit for UI work
