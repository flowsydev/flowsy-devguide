---
title: Platform Guidance
description: How to adapt the AI-assisted development principles to common agent platforms.
---

# Platform Guidance

The same collaboration principles apply across tools, but each platform stores context and permissions differently.

## GitHub Copilot

- Use repository instructions to describe project conventions, commands and terminology.
- Keep prompts explicit about scope, expected output and validation.
- Prefer small, reviewable edits when working inside the IDE.

## Anthropic Claude / Claude Code

- Use project instructions, memory files and subagents to organize context.
- Reserve subagents for bounded work that can proceed independently.
- Ask for changed files, assumptions and validation results in final responses.

## OpenAI Codex

- Use `AGENTS.md` for repository rules, commands and safety constraints.
- Use skills for reusable focused workflows.
- Keep tool approvals scoped to the command family needed for the current task.

## Equivalent Tools

For other assistants, preserve the same operating model: scoped context, explicit boundaries, least privilege, reviewable diffs and verified outcomes.
