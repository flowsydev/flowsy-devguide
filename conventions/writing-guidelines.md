---
title: Writing Guidelines
description: Editorial rules for project documentation artifacts, repositories and navigation.
---

# Writing Guidelines

These guidelines apply to documentation artifacts produced inside projects, documentation sites and code repositories. Use them when writing `README.md`, `AGENTS.md`, guides in `docs/`, specs, ADRs, acceptance criteria, use cases, PBIs, navigation labels and documentation templates.

## Base Rules

- Write in clear English by default for Flowsy repositories but use Spanish for concepts that are intrinsically Mexican and legal/business-specific, such as CURP or RFC.
- Choose documentation language according to the needs of every project.
- Choose the language of the domain model, data model and examples according to the project context and team agreements. A Flowsy guide may be written in English while a consuming project deliberately models its domain in Spanish, Portuguese or another language.
- When a project decides to use Spanish, write in careful Spanish, with accents, opening punctuation marks (`¿`, `¡`) and correct punctuation.
- Translate `feature` to Spanish as `característica`, not as `capacidad`.
- Keep proper names, acronyms and technical terms in their original form when translating them would reduce precision.
- Use a clear, direct and useful voice for technical and business audiences.
- Avoid unnecessary jargon when a simpler term is precise enough.

## Titles and Navigation

Write titles, headings and navigation text in Title Case:

- Capitalize major words;
- Keep short articles, prepositions and conjunctions lowercase;
- Capitalize a word when it is the first word of the title;
- Respect proper names, acronyms and technical terms.

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

## Domain and Data Model Language

Treat the language of the model as a design decision, not as a side effect of the documentation language.

| Decision | Guideline |
| --- | --- |
| Domain model language | Use the language that best supports collaboration with domain experts and keeps the ubiquitous language clear. |
| Data model language | Align table, column, routine and event names with the domain language and the database engine naming convention. |
| Mixed-language projects | Define where English technical terms are acceptable and where domain terms must remain in the business language. |
| Team agreement | Document the chosen language strategy in project conventions, ADRs or repository instructions. |

Examples:

| Strategy | Domain Example | Data Model Example |
| --- | --- | --- |
| English model | `ShoppingCart`, `CreatedByUserId` | `shopping_cart`, `created_by_user_id` |
| Spanish model | `OrdenDespacho`, `IdUsuarioCreador` | `orden_despacho`, `id_usuario_creador` |

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
