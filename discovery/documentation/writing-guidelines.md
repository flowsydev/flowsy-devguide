---
title: Writing Guidelines
description: Editorial rules for project documentation artifacts, repositories and navigation.
---

# Writing Guidelines

These guidelines apply to documentation artifacts produced inside projects, documentation sites and code repositories. Use them when writing `README.md`, `AGENTS.md`, guides in `docs/`, specs, ADRs, acceptance criteria, use cases, PBIs, navigation labels and documentation templates.

## Base Rules

- Write in clear English by default for Flowsy repositories.
- Keep proper names, acronyms and technical terms in their original form when translating them would reduce precision.
- Use Spanish only for concepts that are intrinsically Mexican or legal/business-specific, such as CURP or RFC.
- Use a clear, direct and useful voice for technical and business audiences.
- Avoid unnecessary jargon when a simpler term is precise enough.

## Titles and Navigation

Write titles, headings and navigation text in Title Case:

- capitalize major words;
- keep short articles, prepositions and conjunctions lowercase unless they start the title;
- respect proper names, acronyms and technical terms.

Examples:

```text
Project Documentation
Repository Agent Instructions
Specs-Driven Development
Acceptance Criteria
PostgreSQL and Migrations
```

## Terminology

Use consistent terms across business documentation, technical documentation and agent instructions.

| Concept | Recommended Term |
| --- | --- |
| Product capability delivered to users | feature |
| Formalized need or expected behavior | requirement |
| Domain constraint or policy | business rule |
| Conditions for acceptance | acceptance criteria |
| Actor-centered backlog expression | user story |

When a technical term is more recognizable in English, keep it in English, especially for patterns, frameworks, libraries or formats.

## Emojis

Use emojis only when they add visual, semantic or didactic value. In folder trees, they can improve readability when they help distinguish element types.

Avoid using them as repetitive decoration or when they distract from the content.

## Repository Files

In code repositories, apply these guidelines also to:

- `README.md`;
- `AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md` and equivalent instructions;
- `CHANGELOG.md`;
- documentation under `docs/`;
- specs under `docs/specs/`;
- ADRs, contracts, operations guides and support documentation.

For repository-specific application, see [Repository Documentation](/conventions/repository-documentation).
