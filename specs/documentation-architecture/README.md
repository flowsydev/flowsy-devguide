# Documentation Architecture Migration

This group turns the [Documentation Migration Plan](../../docs/documentation-migration-plan.md) into executable, verifiable specs. Each spec corresponds to a plan phase and should be reviewed and approved before generating execution records.

## Execution Order

| Order | Spec | Expected Result | Dependencies |
| ---: | --- | --- | --- |
| 1 | [001 — Document Integrity](./001-document-integrity/01.requirements.md) | Consistent links, examples and context guides without moving routes. | None. |
| 2 | [002 — Canonical Governance](./002-canonical-governance/01.requirements.md) | Approved taxonomy, IDs, metadata and thematic ownership. | 001. |
| 3 | [003 — Contextual Navigation](./003-contextual-navigation/01.requirements.md) | Complete landings and sidebars by section. | 002. |
| 4 | [004 — Promote Documentation and Quality](./004-promote-documentation-quality/01.requirements.md) | Documentation and Quality as primary areas. | 002 and 003. |
| 5 | [005 — Reorganize Engineering](./005-reorganize-engineering/01.requirements.md) | Backend, Data, Messaging and Frontend with clear ownership. | 002, 003 and 004. |
| 6 | [006 — Split Overloaded Pages](./006-split-overloaded-pages/01.requirements.md) | Long pages split by intent and audience. | 004 and 005. |
| 7 | [007 — Consolidate Cross-Cutting Topics](./007-consolidate-cross-cutting-topics/01.requirements.md) | One canonical source per cross-cutting topic and stack profiles. | 002 and 006. |
| 8 | [008 — Sync Operational Documentation](./008-sync-operational-documentation/01.requirements.md) | README, AGENTS, navigation and final documentation synchronized. | 001 through 007. |

## Base References

- [Audit Findings](../../docs/documentation-audit.md)
- [Proposed Information Architecture](../../docs/proposed-information-architecture.md)
- [Documentation Migration Plan](../../docs/documentation-migration-plan.md)

## Execution Rule

Explicit approval to implement the approved specs authorized sequential execution. Each folder keeps requirements, analysis, plan, a condensed `04.exec.md` execution record and a closing `05.summary.md`.

## Execution Status

| Spec | Status | Close-Out |
| --- | --- | --- |
| 001 — Document Integrity | Executed | [Summary](./001-document-integrity/05.summary.md) |
| 002 — Canonical Governance | Executed | [Summary](./002-canonical-governance/05.summary.md) |
| 003 — Contextual Navigation | Executed | [Summary](./003-contextual-navigation/05.summary.md) |
| 004 — Documentation and Quality | Executed | [Summary](./004-promote-documentation-quality/05.summary.md) |
| 005 — Engineering Reorganization | Executed | [Summary](./005-reorganize-engineering/05.summary.md) |
| 006 — Page Splits | Executed | [Summary](./006-split-overloaded-pages/05.summary.md) |
| 007 — Cross-Cutting Topics | Executed | [Summary](./007-consolidate-cross-cutting-topics/05.summary.md) |
| 008 — Operational Sync | Executed | [Summary](./008-sync-operational-documentation/05.summary.md) |

Interactive visual review covered representative landings, global navigation, contextual sidebars and bridge pages on desktop and mobile viewports.
