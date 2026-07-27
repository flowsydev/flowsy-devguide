# Documentation Migration Plan

## Purpose

Apply the proposed architecture without losing traceability, silently breaking links or mixing content corrections with mass moves. The plan prioritizes integrity before relocation.

This document does not authorize phase execution by itself. Each phase must be reviewed and approved before changing `content/` or `.vitepress/config.ts`.

## Required Prior Decisions

Resolve these decisions before moving files:

1. **Primary taxonomy:** confirm Foundations, Documentation, Engineering, Quality, AI-Assisted Development and Conventions.
2. **Slugs:** keep physical routes in English technical slugs; visible labels in English Title Case.
3. **Documentary IDs:** choose one catalog of non-translatable canonical codes.
4. **Route compatibility:** select redirects or bridge pages for existing URLs.
5. **Minimum frontmatter:** define required metadata per page type.
6. **VitePress scope:** decide whether the guide teaches general VitePress, this DevGuide's configuration, or both on separate pages.
7. **Security location:** confirm an Engineering Security section before extracting Dependency Safety.

## Phase 1 — Integrity without Reorganization

### Objective

Remove proven defects without changing public routes.

### Proposed Changes

- Fix frontmatter links that omit `/layers/`.
- Remove consecutive duplicates in Testing and the Vue context guide.
- Change `navigation/` to `routing/` in the Vue context guide.
- Align `state/` and `stores/` as conceptual responsibility versus physical Pinia folder.
- Resolve the contradiction between mandatory and contextual UI/API contract adaptation.
- Complete the current Technologies map with Backend Design Baseline and Error Handling.
- Add automated checking of Markdown links and frontmatter links.

### Acceptance Criteria

- No published internal link resolves to a nonexistent route.
- The Vue context guide matches Modular Architecture and Vue Ecosystem.
- Duplicate examples no longer appear.
- `npm run docs:build` completes successfully.
- Additional link validation completes without errors.

## Phase 2 — Governance and Canonical Sources

### Objective

Define thematic ownership before moving content.

### Proposed Changes

- Publish a canonical-source matrix for language, date/time, errors, validation, Outbox, testing, IDs and editorial rules.
- Unify the ID catalog across the layers guide, templates and home.
- Define minimum frontmatter per page type.
- Add an explicit reference to the canonical source on repeating pages.
- Classify each section as concept, practice, implementation or example.

### Acceptance Criteria

- Each cross-cutting topic has a single owner page.
- No template contradicts the ID catalog.
- Each long page has a recorded decision: keep, split or move.
- The team can identify where to update a policy without searching several sections.

## Phase 3 — Landings and Contextual Navigation

### Objective

Improve navigation before large-scale moves.

### Proposed Changes

- Create missing current landings for Backend, Data and Messaging.
- Convert the global sidebar into contextual sidebars by prefix.
- Reduce the top bar to primary sections.
- Make section maps exhaustive.
- Add task-oriented reading paths on each landing.

### Acceptance Criteria

- Every public page is reachable from its section landing.
- The sidebar shows only the active section context.
- Backend, Data and Messaging have their own entry points.
- A person can choose a path by intent without knowing file names.

## Phase 4 — Promotion of Documentation and Quality

### Objective

Fix the two main hierarchy problems.

### Proposed Changes

- Promote Project Documentation to a top-level section.
- Move Static Site Generators under Documentation > Tooling.
- Move Repository Documentation under Documentation > Repositories.
- Move the canonical Specs-Driven Development guide under Documentation > Work Specs.
- Promote Testing to top-level Quality.
- Keep context guides under AI with links to the new canonical sources.

### Compatibility

- Preserve previous routes through redirects or bridge pages.
- Update `.vitepress/config.ts`, landings, links and context guides in the same phase.
- Record moves in `CHANGELOG.md`.

### Acceptance Criteria

- Documentation and Quality are reachable from the top bar.
- No duplicated pages exist between old and new routes except explicit bridges.
- Historical links continue to resolve or show a clear redirect.
- Internal `specs/` remain excluded from the build.

## Phase 5 — Engineering Reorganization

### Objective

Separate Backend, Data, Messaging and Frontend under a coherent implementation architecture.

### Proposed Changes

- Create Engineering as the landing for technical solutions.
- Promote Data and Migrations out of Backend.
- Group EDA, Event Sourcing and reliable delivery under Messaging.
- Keep Backend for design baseline, architectures, APIs, reliability and .NET.
- Keep Frontend with Modular Architecture → Vue progression.
- Create Cross-Cutting for date/time, auditing/validity and identifiers.

### Acceptance Criteria

- Data and Messaging do not require entering through Backend first.
- Engine-specific pages link a common policy and focus on real differences.
- Backend has a clear path from conceptual design to .NET implementation.
- Frontend keeps one recommended physical structure per stack.

## Phase 6 — Split Overloaded Pages

### Objective

Reduce intent shifts inside a single page.

### Recommended Order

1. `error-handling.md`.
2. `domain-driven-design.md`.
3. `csharp-minimal-apis.md`.
4. `vue/ecosystem.md`.
5. `documentation/layers/index.md`.
6. `specs-driven-development.md`.
7. `vitepress.md`.
8. `tools-and-strategies.md`.

### Split Criteria

Split when at least one condition holds:

- the primary audience changes;
- the page shifts from concept to recipe or complete example;
- a reader may need one section without needing the others;
- a different canonical source exists for part of the content;
- the sidebar needs to link a recurring internal intent directly;
- the content exceeds roughly 300 lines and contains several autonomous H2 sections.

Line count is a signal, not an automatic rule.

### Acceptance Criteria

- Each new page declares purpose and reading path.
- Sub-area landings order the resulting pages.
- The same normative block is not duplicated across pages.
- Complete examples remain reachable from the rules they illustrate.

## Phase 7 — Consolidate Cross-Cutting Topics

### Objective

Prevent future drift without losing stack-specific orientation.

### Proposed Changes

#### Date and Time

- Extract conceptual model and strategies to a cross-cutting guide.
- Keep formats and contractual semantics in API only.
- Keep types, clock APIs and providers in C# only.
- Keep parsing, presentation and JavaScript precision in Vue only.
- Keep storage and engine-specific functions in data only.
- Keep verifiable scenarios and risks in testing only.

#### Errors and Reliability

- Establish canonical pages for errors, validation/invariants and transactional consistency.
- Keep HTTP mapping in API.
- Keep retries, duplicates, ordering and DLQ in Messaging.
- Keep short responsibility tables in architectures.

#### Outbox

- Make Messaging > Reliable Delivery the canonical source.
- EDA explains when to apply it.
- Background Services show only the .NET implementation.
- Testing explains how to demonstrate its behavior.

#### Example Names

- Keep the full rule in Writing Guidelines.
- Replace repeated sections with a short note and specific examples when they add value.

### Acceptance Criteria

- A cross-cutting policy change requires editing one conceptual page and, only if mapping changes, the affected profiles.
- Each stack profile links the canonical policy.
- Profiles do not contradict each other.

## Phase 8 — Operational Documentation and Close-Out

### Objective

Synchronize the repository with the finally published architecture.

### Proposed Changes

- Update `README.md` with `content/`, real sections and valid links.
- Update `AGENTS.md` with current on-demand context paths.
- Update `CHANGELOG.md` with visible moves and new routes.
- Review historical references in specs only when they act as live links; do not rewrite historical records for aesthetics.
- Add a short guide for contributing new content under the approved taxonomy.
- Review Mermaid `manualChunks` in a separate technical task.

### Acceptance Criteria

- README, AGENTS, VitePress config and the physical tree describe the same structure.
- Build and link validation complete successfully.
- No orphan public pages remain.
- `git diff` contains no accidental changes in `.vitepress/dist/` or historical specs.

## Link Compatibility Strategy

### General Rule

Do not move a public page without first preparing its compatibility path.

### Options

| Option | Recommended Use | Risk |
| --- | --- | --- |
| Hosting-supported redirect | Stable public route with deployment control. | Platform-dependent. |
| Bridge page with canonical link | VitePress without an available redirect mechanism. | Adds temporary files. |
| Vite/VitePress alias or rewrite | Centralized, verifiable rules. | Requires build and hosting tests. |
| Keep slug and change navigation only | Low-risk first stage. | Physical structure does not yet reflect taxonomy. |

Recommended start: change navigation and landings first, keep slugs in the first migration and move physically after validating the model with readers. Flowsy adopts host-independent bridge pages (`type: redirect` + `redirect` + explicit link).

## Risk Matrix

| Risk | Probability | Impact | Mitigation |
| --- | --- | --- | --- |
| Break saved links or references from other repositories | High | High | Bridges, route inventory and gradual changes. |
| Duplicate content during transition | Medium | High | Declared canonical page and bridges without copying detail. |
| Mix semantic fixes with moves | High | Medium | Separate phases and commits by intent. |
| Change IDs used by consuming projects | Medium | High | External inventory and canonical catalog before editing templates. |
| Leave config, landings or README stale | High | Medium | Single checklist for navigation and operational docs. |
| Create too many tiny pages | Medium | Medium | Split by real intent, not only by length. |
| Lose context from extended examples | Low | Medium | Example landings and bidirectional links. |
| Keep contradictions in context guides | Medium | High | Validate each summary against its canonical source. |

## Recommended Validation per Phase

1. `git diff --check`.
2. Markdown and frontmatter link validator.
3. `npm run docs:build`.
4. Inventory of pages reachable from navigation.
5. Manual review of landings, sidebar, breadcrumbs and return links.
6. Search for old routes in `content/`, `.vitepress/config.ts`, `README.md`, `AGENTS.md` and context guides.
7. Search for affected canonical terms, such as artifact codes, `routing/`, `stores/` and section names.

## Recommended Change Unit

Each change set should cover one coherent intent, for example:

- fix link integrity;
- unify documentary IDs;
- promote Quality in navigation;
- move Documentation to a main section;
- split Error Handling;
- split DDD;
- consolidate Date and Time.

Do not run the entire migration in one change: that would hinder content review, bridge verification and navigation regression detection.

## Expected Outcome

After migration, a reader finds one canonical source per decision, navigates only relevant context and clearly distinguishes foundations, documentation, implementation, quality, AI collaboration and conventions. Operational documents and context guides reflect the same architecture without duplicating detail.
