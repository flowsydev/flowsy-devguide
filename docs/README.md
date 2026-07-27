# Documentation Architecture Audit

This directory keeps the internal diagnosis and decisions that produced the current architecture of Flowsy DevGuide. Implemented public content lives under `content/`; executable work-line specs live under `specs/documentation-architecture/`.

## Documents

- [Audit Findings](./documentation-audit.md): coverage, proven defects, thematic mixing, contradictions and review by area.
- [Proposed Information Architecture](./proposed-information-architecture.md): principles, target tree, relocation map and ownership of cross-cutting topics.
- [Documentation Migration Plan](./documentation-migration-plan.md): phases, prior decisions, acceptance criteria and controls to preserve links and traceability.
- [Technical Debt](./technical-debt.md): non-blocking follow-ups recorded at close-out.

## Reviewed Scope

- Published Markdown pages under `content/`.
- Top navigation and contextual sidebars defined in `.vitepress/config.ts`.
- Internal documents under `specs/`, kept out of the public site through `srcDir: './content'`.
- Operational repository documents: `README.md`, `AGENTS.md` and `CHANGELOG.md`.
- Current VitePress build and static resolution of internal links.

## Delivery Status

- The proposed architecture is implemented under `content/`.
- Previous routes are retained as compatibility bridges.
- Foundations, Documentation, Engineering, Quality, AI-Assisted Development and Conventions are the current public areas.
- `npm run docs:validate` checks links, anchors, navigation frontmatter and page coverage.
- `npm run docs:build` completes successfully; the preexisting Mermaid circular-chunk warning is recorded as technical debt.
