---
title: Documentation Governance
description: Canonical decisions for taxonomy, routes, metadata, identifiers and thematic ownership in Flowsy DevGuide.
type: governance
audience: Authors and maintainers of the guide.
canonical: true
---

# Documentation Governance

Use this guide to decide where a page lives, which metadata it declares and which source owns a shared rule. These decisions are normative for public content under `content/`.

## Approved Taxonomy

Primary navigation is organized by reader intent:

| Area | Primary Intent |
| --- | --- |
| Foundations | Understand and model the domain. |
| Documentation | Capture knowledge and coordinate work. |
| Engineering | Design and implement solutions. |
| Quality | Design and demonstrate validation. |
| AI-Assisted Development | Collaborate with agents. |
| Conventions | Apply shared rules. |

`content/` holds public knowledge; `specs/` keeps the work record; `docs/` holds unpublished internal audits and decisions.

## Slugs and Compatibility

- Physical slugs remain in English and visible labels are written in English for this guide.
- A canonical route expresses current thematic ownership.
- When a page moves, its previous route keeps a short bridge with `redirect` and an explicit link. The bridge does not duplicate normative content.
- A previous route may be removed only when the publishing mechanism provides an equivalent, verifiable redirect.

## Frontmatter Contract

| Page Type | Required Fields | Optional Fields |
| --- | --- | --- |
| Area landing | `title`, `description`, `type: landing`, `audience`, `canonical` | `layout`, `hero`, `features` |
| Canonical guide | `title`, `description`, `type: guide`, `audience`, `canonical: true` | `related`, `status` |
| Stack profile | `title`, `description`, `type: profile`, `audience`, `canonical` | `canonicalSource`, `related` |
| Extended reference | `title`, `description`, `type: reference`, `audience`, `canonical: false` | `canonicalSource`, `related` |
| Template | `title`, `description`, `type: template`, `audience`, `canonical` | `artifactId` |
| Context guide | `title`, `description`, `type: context-guide`, `audience`, `canonical` | `requiredContext`, `related` |
| Route bridge | `title`, `description`, `type: redirect`, `redirect`, `canonical: false` | `head` |

The `canonical` field indicates documentary ownership, not exclusivity: a profile may explain local application of a rule, but it links its source and does not redefine the full policy.

## Canonical ID Catalog

IDs are stable tokens; they do not change by language, title, folder or slug.

| Discipline | Artifact | Code |
| --- | --- | --- |
| Strategy | Theme | `STR-THM` |
| Strategy | Initiative | `STR-INI` |
| Analysis | Need | `ANL-NED` |
| Analysis | Requirement | `ANL-REQ` |
| Analysis | Use Case | `ANL-UC` |
| Analysis | Business Rule | `ANL-BR` |
| Architecture | ADR | `ARC-ADR` |
| Architecture | Contract | `ARC-CTR` |
| Delivery | Epic | `DLV-EPC` |
| Delivery | PBI | `DLV-PBI` |
| Delivery | Task | `DLV-TSK` |
| Validation | Acceptance Criterion | `VAL-AC` |
| Validation | GWT Scenario | `VAL-GWT` |
| Validation | Test Case | `VAL-TST` |

Projects that consume historical codes should document their transition; existing artifacts are not silently renumbered.

## Canonical Sources

| Topic | Canonical Source | Consumer Profiles |
| --- | --- | --- |
| Ubiquitous Language | [Ubiquitous Language](/foundations/ubiquitous-language) | DDD, writing, C#, Vue, data and artifacts. |
| Artifact IDs | [Identifiers and Traceability](/documentation/project-artifacts/identifiers-and-traceability) | Templates and project examples. |
| Date and Time | [Date and Time](/engineering/cross-cutting/date-and-time) | API, C#, Vue, data, engines and testing. |
| Auditing and Validity | [Auditing and Validity](/engineering/cross-cutting/auditing-and-validity) | DDD, C#, relational modeling and engines. |
| Public Identifiers | [Public Identifiers](/engineering/cross-cutting/identifiers) | API, backend, frontend and data. |
| Errors | [Error Handling](/engineering/backend/reliability/error-handling) | API, architectures, .NET and messaging. |
| Validation and Invariants | [Validation and Domain Rules](/engineering/backend/reliability/validation-and-domain-rules) | DDD, architectures, data and testing. |
| Outbox and Reliable Delivery | [Reliable Delivery](/engineering/messaging/reliable-delivery) | EDA, .NET and Quality. |
| Testing Strategy | [Automated Testing Strategy](/quality/automated-testing-strategy) | All stacks and context guides. |
| Editorial Rules | [Writing Guidelines](/conventions/writing-guidelines) | All public and operational Markdown. |
| Agent Skills | [Context Guides](/ai-assisted-development/context-guides/) | Technical pages through brief references. |
| Dependency Safety | [Dependency Safety](/engineering/security/dependency-safety) | README and onboarding. |

## Classification of Overloaded Guides

| Original Guide | Decision | Resulting Pages |
| --- | --- | --- |
| Error Handling | Split by practice | Errors, validation, consistency and reliable delivery. |
| Domain-Driven Design | Split by concept | Bounded Contexts, entities, Aggregates and DCB. |
| C# with Minimal APIs | Split by implementation and example | Structure, endpoints, commands/queries, state and examples. |
| Vue Ecosystem | Split by implementation | Components, structure, state, contracts and Storybook. |
| Project Documentation | Split by practice | Organization, IDs and disciplinary layers. |
| Specs-Driven Development | Split by process | Overview, workflow and document reference. |
| VitePress | Split by task | Start, configuration, layouts and deployment. |
| Migration Tools | Keep a comparative reference and create a path | Selection, concepts, tools and CLI. |

## Closing Editorial Rule

Every new page must declare a primary intent and its audience. Visible changes update navigation, section maps, links, operational documentation and `CHANGELOG.md` in the same delivery.
