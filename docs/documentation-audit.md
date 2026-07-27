# Documentation Audit Findings

## Executive Summary

Flowsy DevGuide has a strong base: it separates stack-agnostic concepts from stack-specific implementations in several areas, offers reading paths, uses examples suited to an open source audience and correctly keeps internal `specs/` out of the public site. The main problem is not missing content, but cumulative growth without a single thematic-ownership policy.

The result is an architecture that mixes three different axes in the same hierarchy:

1. work stages, such as discovery, delivery and validation;
2. disciplines, such as documentation, architecture and testing;
3. concrete technologies, such as VitePress, Vue, PostgreSQL and .NET.

That mix produces long pages, repeated cross-cutting topics, some contradictions and navigation that is hard to follow. The `error-handling.md` page is representative: it starts as an error guide, then also prescribes where domain rules live, transactional boundaries, Outbox, idempotency, consumer behavior and variants by architectural style.

The general recommendation is to reorganize by reader intent and establish one canonical page per cross-cutting decision. The target architecture is detailed in [Proposed Information Architecture](./proposed-information-architecture.md).

## Method and Criteria

The audit combined:

- inventory of all published pages and operational documents;
- review of headings, size, navigation paths and links;
- comparison of repeated topics across sections;
- contrast among conceptual pages, stack guides and agent context guides;
- review of the boundary among public content, repository documentation and internal `specs/`;
- baseline build with `npm run docs:build`;
- static resolution of Markdown links and frontmatter `link` fields.

Each area was evaluated with five questions:

1. Does the location match the reader's primary intent?
2. Does the page have a single documentary responsibility?
3. Is there a clear canonical source for the topic?
4. Can navigation reach the content without prior knowledge of the physical tree?
5. Are references, examples and rules consistent with the rest of the guide?

## Inventory Data

Metrics below describe the pre-migration state under Discovery, Technologies, Conventions and AI-Assisted Development.

| Metric | Result |
| --- | ---: |
| Public pages under `content/` | ~80+ |
| Internal specs under `specs/` | dozens of work lines across discovery, testing, backend and AI |
| Pages without frontmatter | majority of narrative pages |
| Longest page | `csharp-minimal-apis.md` (1,000+ lines) |
| Invalid internal links detected | layer-landing frontmatter links omitting `/layers/` |
| `npm run docs:build` result | Success, with Mermaid circular-chunk warnings |

The longest pages show where growth concentrated:

| Page | Observation |
| --- | --- |
| `technologies/backend/dotnet/csharp-minimal-apis.md` | Concepts, conventions, decisions and multiple complete examples on one page. |
| `discovery/domain-driven-design.md` | Strategic DDD, tactical DDD, DCB, VSA, lifecycle, auditing and public IDs. |
| `technologies/frontend/vue/ecosystem.md` | Vue, structure, visual design, agent skills, Pinia, composables, contracts, Storybook and testing. |
| `ai-assisted-development/specs-driven-development.md` | Full process, conventions, templates and relationship to durable documentation. |
| `discovery/documentation/layers/index.md` | Documentary model, folders, languages, IDs, traceability and audiences. |
| `technologies/backend/data-and-migrations/tools-and-strategies.md` | Cross-cutting criteria and recipes for several tools. |
| `content/index.md` | Home, adoption, structure and traceability mixed into one surface. |
| `discovery/documentation/static-site-generators/vitepress.md` | Start, configuration, structure, custom components, plugins and deployment. |

Length alone is not a defect, but in these cases it coincides with clear shifts of intent and audience inside a single page.

## Priority Findings

### H-01 — Broken Links on Layer Landings

**Priority:** High

**Type:** Proven defect

Strategy, Analysis, Architecture, Delivery and Validation landings link templates without the `/layers/` segment. For example:

- declared path: `/discovery/documentation/analysis/templates/need`;
- real path: `/discovery/documentation/layers/analysis/templates/need`.

The problem appears in both `actions` and `features`, producing many invalid declarations toward unique destinations. VitePress build does not fail on these frontmatter links, so the current build alone does not cover navigation integrity.

**Suggestion:** fix these links first and add automated validation of Markdown paths and frontmatter `link` fields.

### H-02 — Two Incompatible Documentary Identifier Systems

**Priority:** High

**Type:** Contradiction

`discovery/documentation/layers/index.md` discusses translated prefixes by domain language, while templates mainly use English codes such as `STR-THM`, `ANL-NED`, `ARC-ADR`, `DLV-PBI`, `VAL-AC` and `TST` without declaring that the code must change with language.

That contradicts the stated goal of stable, location-independent IDs. An ID should not change when a folder, title or slug is translated.

**Suggestion:** choose one catalog of non-translatable canonical codes. Keep stable neutral codes in IDs; translate only labels, titles, folders and slugs.

### H-03 — Contradictions and Drift in Vue Guidance

**Priority:** High

**Type:** Contradiction and drift

Related problems:

1. `vue/conventions.md` reads as if adapters are mandatory; `vue/ecosystem.md` correctly clarifies that not every response needs a ViewModel. One page feels obligatory; the other, contextual.
2. The context guide `frontend-vue-feature-set.md` still proposes `navigation/`, while modular architecture and the changelog establish `routing/`.
3. The same guide uses `state/` in a Vue-specific structure, while stack pages use `stores/` for the physical Pinia artifact.

**Suggestion:** convert UI/API adaptation policy into one canonical decision table, update the context guide and keep only the operational summary there.

### H-04 — `error-handling.md` Mixes Four Responsibilities

**Priority:** High

**Type:** Thematic mixing

| Current Content | Recommended Ownership |
| --- | --- |
| Error categories, failure translation and sanitization | Error Handling |
| Validate before changing state and where invariants live | Application Validation and Domain Rules |
| Transactions, Outbox, idempotency and side effects | Transactional Consistency and Reliable Delivery |
| Consumer retries, duplicates and DLQ | Messaging Resilience |
| HTTP mapping and Problem Details | HTTP API Design |
| Detail by VSA, Clean Architecture, EDA and Event Sourcing | Each architecture page, via summary and canonical link |

The page can keep a cross-cutting view of errors, but should not be the primary source for Outbox, message consistency or general domain-rule placement.

**Suggestion:** keep taxonomy, propagation, translation and exposure in error handling; extract validation/invariants and consistency/side effects to their own pages.

### H-05 — DDD Is Coupled to VSA and Contains Data Conventions

**Priority:** High

**Type:** Thematic mixing

`domain-driven-design.md` starts as a conceptual introduction, then:

- prescribes `State` and `StateHandler` as the implementation of rules and DCB;
- defines Feature, module, submodule and vertical slice as “implementation concepts” of DDD;
- incorporates record lifecycle, audit attributes, business validity and public identifiers;
- adds event-log fields per entity.

Those sections shift from discovery and modeling audiences to VSA implementation, persistence and contracts. They also make DDD appear to require particular Flowsy stack conventions.

**Suggestion:** split DDD into overview, strategic design, tactical modeling and consistency boundaries. Move `State`/`StateHandler` mapping to VSA; move auditing, validity and identifiers to a cross-cutting data and contracts guide.

### H-06 — Home Page Works as an Adoption Manual

**Priority:** High

**Type:** Navigation and thematic mixing

`content/index.md` is overloaded. After the home surface it includes ubiquitous language, solution structure, onboarding and traceability from requirements to implementation.

A reader who only needs to choose a guide must walk through adoption and solution-design material that belongs on dedicated pages.

**Suggestion:** keep purpose, audience, entry path and cards on Home. Extract “Adopting the DevGuide” and related onboarding into Documentation.

### H-07 — Documentation Lives under Discovery and Mixes Method with Tooling

**Priority:** High

**Type:** Information architecture

`discovery/documentation/` groups:

- a full project-documentation system by discipline;
- templates for strategy, analysis, architecture, delivery and validation;
- static site generators;
- an extensive VitePress guide.

Delivery, architecture or repository documentation is not a sub-activity of discovery. VitePress is a publishing tool, not a discovery technique.

**Suggestion:** promote Documentation to a top-level section. Keep project artifacts, repository documentation, work specs and publishing tools there.

### H-08 — Specs-Driven Development Is Classified as AI-Only

**Priority:** Medium-High

**Type:** Inconsistent location

The specs structure coordinates requirements, analysis, plan, execution and close-out. It is useful for people, automation and agents, and the content itself treats it as operational repository documentation. Living only under AI-Assisted Development makes it look inapplicable outside that context and separates it artificially from repository documentation.

**Suggestion:** move the canonical guide to Documentation. Keep under AI only the context guide that explains how agents consume it.

### H-09 — Cross-Cutting Topics Repeat without a Single Owner

**Priority:** Medium-High

**Type:** Duplication and drift risk

Main cases:

- date and time across Backend, HTTP API, C#, Vue, relational modeling, three engines and testing;
- example names versus real artifacts across several technical pages plus Writing Guidelines;
- error handling across Backend, API, VSA, Clean Architecture, EDA, Event Sourcing and Minimal APIs;
- testing inside Vue Ecosystem and in the full Testing section;
- Outbox in error handling, EDA and Background Services.

Not every repetition is wrong: each stack needs a local mapping. The problem is that several pages restate the full conceptual decision, so it is unclear which text is normative.

**Suggestion:** define one conceptual canonical guide and application profiles per stack. Each profile should explain only types, APIs, constraints and examples for its technology.

### H-10 — Engine-Specific Pages Repeat Common Policy

**Priority:** Medium

**Type:** Structural duplication

PostgreSQL, SQL Server and MySQL/MariaDB repeat the same sequence: naming, temporal semantics, provider mapping, auditing, date functions, logs, routines and change control. Some of that repetition helps isolated lookup, but conceptual policy should live in Relational Modeling.

**Suggestion:** keep only real differences of types, functions, precision, constraints, DDL and tools on each engine page. Use a central comparative matrix for shared decisions.

### H-11 — Vue Guide Contains Agent Policy

**Priority:** Medium

**Type:** Misplaced fragment

“Recommended Skills for Vue” inside `vue/ecosystem.md` prescribes agent skill installation and configuration. That information does not describe Vue or its runtime ecosystem.

**Suggestion:** move the list to the Vue context guide under AI-Assisted Development. The technical page may keep a short reference if needed.

### H-12 — Dependency Safety Is Not Repository Documentation

**Priority:** Medium

**Type:** Misplaced fragment

A large portion of `repository-documentation.md` covers supply-chain safety procedures for NPM, NuGet and related ecosystems. That is dependency security and safe onboarding, not an editorial README convention.

**Suggestion:** create an Engineering Security area. Under repository documentation, keep only what to link from the README.

### H-13 — Event Storming Maps Too Directly to VSA

**Priority:** Medium

**Type:** Conceptual coupling

`event-storming.md` asserts that outcomes “map directly” to VSA and equates aggregates with `[ActionName]State.cs` and policies with workers. Event Storming discovers the domain; choosing VSA, a worker or a `State` representation is later and contextual.

**Suggestion:** reframe the mapping as possible design and implementation destinations and move stack-specific detail to the VSA guide.

### H-14 — Global Navigation without Landings for Important Areas

**Priority:** Medium

**Type:** Navigation

Backend has no `index.md`; top access goes to `backend/concepts`. Data and Migrations also lack their own landing. The Technologies map omits pages visible in the sidebar, such as Backend Design Baseline and Error Handling. A single sidebar shows every site section even when the reader is inside one area.

**Suggestion:** create landings per main area, make each map exhaustive and use contextual sidebars by route prefix.

### H-15 — Inconsistent Editorial Metadata

**Priority:** Medium-Low

**Type:** Governance

Most narrative pages lack frontmatter, while others declare `title`, `description` or specialized agent metadata. That does not prevent builds, but produces uneven criteria for search, previews, automation and maintenance.

**Suggestion:** define a minimum contract per page type. For narrative pages: `title`, `description` and, if adopted, `owner` or `canonical_topic`. For templates: artifact type and status. For context guides: keep their specialized schema.

### H-16 — Mechanical Duplicates in Testing and Context Guides

**Priority:** Low, with immediate fix recommended

**Type:** Editorial defect

Consecutive duplicates appear in Testing pages and in `frontend-vue-feature-set.md`.

**Suggestion:** fix them with the first integrity phase, without waiting for full reorganization.

### H-17 — Operational Repository Documentation Is Out of Date

**Priority:** Medium-High

**Type:** Drift

`README.md` and `AGENTS.md` describe folders inconsistently with `srcDir: './content'` and with the evolving taxonomy. Relative links and area tables lag the published tree.

**Suggestion:** update operational documents after approving the target architecture, so they are not corrected twice.

### H-18 — Build Does Not Validate Full Navigation

**Priority:** Medium

**Type:** Quality control

`npm run docs:build` succeeds even with invalid frontmatter links. It also reports circular-chunk warnings from Mermaid `manualChunks`.

**Suggestion:** complement the build with link validation and, in a separate site-architecture task, review the `manualChunks` strategy. The bundling warning does not block this audit, but should be recorded as technical debt.

## Review by Area

| Current Area | Assessment | Recommended Action |
| --- | --- | --- |
| Home | Useful entry, overloaded with onboarding and solution design. | Reduce to orientation; move adoption to dedicated pages. |
| AI-Assisted Development | Good short guides and progressive reading. Mixes general specs process with stack-specific skills. | Keep routing and context guides; move canonical specs guide; centralize skills here. |
| Discovery | Ubiquitous Language, techniques, Event Storming and DDD form a coherent path. | Keep as Foundations; decouple VSA implementation from DDD and Event Storming. |
| Project Documentation | Discipline model and traceability are solid. | Promote to main section, unify IDs and fix links. |
| VitePress | Practical and detailed, but not Discovery. | Move to Documentation > Tooling; separate general VitePress from DevGuide-specific detail. |
| Backend General | Good conceptual progression, but no landing and repeated cross-cutting topics. | Create index, set canonical owners and separate reliability. |
| Backend Architectures | VSA and Clean Architecture are locatable and comparable. | Keep; reduce duplication and link canonical pages. |
| Events and Messaging | EDA/Event Sourcing split is useful; Outbox and resilience repeat. | Create Messaging landing and a canonical reliable-delivery guide. |
| Data and Migrations | Broad coverage, currently under Backend, with engine repetition. | Promote to Engineering Data with its own landing. |
| .NET | Practical guides; Minimal APIs too long; Background Services mix base pattern with Kafka and Outbox. | Split by intent and separate complete examples. |
| Frontend | Good agnostic → Vue split, with local contradictions. | Keep model; unify UI/API contracts, structures and terminology. |
| Testing | One of the best-structured areas: strategy, levels, stacks and systems. | Promote to Quality, fix duplicates and keep stack profiles. |
| Conventions | Writing and Git are coherent; repository documentation contains dependency safety. | Keep global rules; move repository docs to Documentation and supply-chain to Security. |
| Internal Specs | Separation from the public build is well documented. | Keep out of navigation; do not mix historical records with canonical content. |
| README and AGENTS | Useful, but misaligned with `srcDir` and current taxonomy. | Update at the end of structural migration. |

## Aspects Worth Preserving

- The `section-home` pattern for landings with clear paths.
- Distinction between conceptual pages and stack-specific pages.
- Short agent context guides and progressive reading.
- Separation of `specs/` as unpublished internal documentation.
- Testing taxonomy by strategy, level, stack and system type.
- Artifact templates as directly navigable pages.
- Examples that fit a general open source audience and Flowsy naming (`Flowsy`, `flowsydev`, `flw`/`flw-`, `Flowsy.*`, `flwdb`).
- The rule of linking canonical detail instead of copying it across documents.

## Conclusion

Reorganization does not require discarding current content. Most of it can be preserved if defects are fixed first, thematic ownership is defined and each block moves to an intent-based section. The most important change is to stop treating Documentation and Quality as secondary branches of Discovery or Technologies and make them primary site routes.
