---
name: rule-97b
description: >-
  Mandatory 97b orchestration for stageverify-website. Grok orchestrates only.
  On UX/UI, ChatGPT Sol writes the specific edit prompt, composer-2.5 edits,
  Sol verifies, and they iterate until Sol is sure it is right.
---

# 97b rule (StageVerify website)

## Roles

- **Grok** orchestrates. Grok does not write the edit prompt, does not edit product code, and does not approve look.
- **ChatGPT Sol** (`gpt-5.6-sol-high`) is the assigner on UX/UI. Sol tells Cursor what to edit, writes the specific prompt for composer-2.5, verifies the result, and iterates until Sol is sure it is right.
- **composer-2.5** is the editor for marketing-site UI/copy jobs.

## UX/UI loop

1. Grok classifies the job as UX/UI and gives Sol the local page.
2. Sol decides what to edit and writes the specific composer-2.5 prompt.
3. Grok hands that prompt to composer-2.5. Composer edits.
4. Sol verifies that composer did it right.
5. If not, Sol writes the next prompt. Repeat until Sol approves.

## Hard stops

- Do not let Grok write or “improve” Sol’s edit prompt.
- Do not let composer-2.5 self-approve.
- Do not let Grok silently rewrite the implementation.
- Do not skip Sol on a UX/UI update.

## Related

- `PROJECT_STATUS/MODEL_DOSSIER.md`
- `skills.md`
