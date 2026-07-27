---
title: Repository Agent Instructions
context_guide: repository-agent-instructions
description: Minimum context for creating or updating AGENTS.md, CLAUDE.md, copilot-instructions.md or equivalent repository instructions.
intent:
  - create AGENTS.md
  - create CLAUDE.md
  - update repository instructions
  - reduce agent context
  - document commands for agents
applies_when:
  - the task mentions AGENTS.md, CLAUDE.md, copilot-instructions.md or agent instructions
  - the task asks to improve AI agent instructions
  - a project needs to align commands, constraints or terminology for assistants
read_first:
  - /ai-assisted-development/
read_if_implementing:
  - /ai-assisted-development/agent-routing.md
related_guides:
  - specs-driven-development
  - project-documentation-artifact
  - repository-documentation
validation:
  - verify that declared commands exist
  - check that generic or redundant instructions are removed
  - confirm generated or sensitive paths are explicit
avoid:
  - turning the file into a long architecture manual
  - duplicating extensive technical documentation
  - including universal rules the agent should already follow
---

# Repository Agent Instructions

Use this context guide when creating, reviewing or compacting files such as `AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md` or equivalent repository instructions.

## Minimum Context

- Treat the file as a brief operating sheet, not as the project's constitution.
- Include only repository-specific instructions that an agent cannot infer with confidence.
- Prefer commands, paths, restrictions and local terminology over generic engineering advice.
- Keep content short and easy to scan; as a practical target, aim for about 50-60 lines or less when possible.
- Link extensive guides as context on demand instead of copying them into the file.
- Apply the writing guidelines for Markdown files in the repository.

## Recommended Structure

```markdown
# AGENTS.md

## Repo
Two or three lines about the project and its main folders.

## Specific Rules
Language, terminology, local conventions and rules that are not inferable.

## Commands
Setup, minimum validation and interactive review commands when applicable.

## Context on Demand
Internal references the agent should open only if the task requires them.

## Care
Secrets, generated paths, permissions, sensitive actions or files that should not be edited.
```

## Implementation Rules

- Verify `package.json`, scripts, pipelines or local documentation before declaring commands.
- Use Title Case headings and clear English by default.
- Distinguish installation, minimum validation and interactive commands.
- State when not to use a common command if it does not provide signal, for example `npm test` without an implemented test suite.
- Mention generated artifacts such as `dist/`, `coverage/`, `.vitepress/dist/` or generated clients only if they exist in the project.
- If the site or app publishes Markdown, exclude internal instructions from the public build when applicable.
- Check that internal references are stable links or paths and explain when to consult them.

## Suggested Release Instructions

When the repository uses `CHANGELOG.md`, semantic versioning, commits and Git tags to prepare releases, add an explicit section to `AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md` or the equivalent file. These actions modify history and may publish changes, so they must always have explicit approval from the responsible developer before execution.

Recommended example:

```markdown
## Release Preparation and Publishing

- When receiving an explicit instruction to prepare the local repository for publishing, confirm developer approval before continuing. After approval:
  1. Update the `package.json`, `*.csproj`, `pom.xml` or equivalent file with the appropriate version.
  2. Move the `[Unreleased]` entries in `CHANGELOG.md` to a new versioned section with the appropriate version and today's date.
  3. Create a detailed commit in the predominant language of the repository's documentation following the Conventional Commits format.
  4. Create the corresponding git tag.
- Phrases that may trigger local release preparation include: "prepara el repo para publicar", "deja lista la versión", "actualiza el changelog, haz commit y tag", "prepara la versión para subir", "prepare the repo to publish", "make the release ready", "update changelog, commit and tag".
- When receiving an explicit instruction to publish changes to the remote repository, confirm developer approval before continuing. After approval, run `git push` and then `git push --tags`.
- Phrases that may trigger remote publishing include: "publica los cambios", "sube la versión y sus tags", "publish the changes", "push the release", "push to remote".
- Do not create commits, tags or pushes by inference. If the intent is unclear, ask before acting.
```

Adapt the text to the repository's real flow. If the project uses another versioning scheme, protected branches, mandatory Pull Requests or publication pipelines, document those conditions instead of assuming a direct release from a local branch.

## Anti-Patterns

- Long essays that duplicate the whole DevGuide.
- Generic advice that does not mention repository commands.
- Contradictory instructions between `AGENTS.md`, `CLAUDE.md`, README and real scripts.
- Obsolete rules about commands, folders or tools that no longer exist.
- Hidden release behavior triggered by vague words like "finish".
- Instructions that allow destructive git operations without approval.
- Sensitive context, secrets, tokens, credentials or production data.

## References

- General guidance: [AI-Assisted Development](/ai-assisted-development/).
- Context guide router: [Agent Context Routing](/ai-assisted-development/agent-routing.md).
- Local documentation: [Repository Documentation](/documentation/repositories/).
- Writing rules: [Writing Guidelines](/conventions/writing-guidelines).
- Specs: [Specs-Driven Development](/documentation/work-specs/).
