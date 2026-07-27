---
title: Identifiers and Traceability
description: Canonical catalog and rules for relating artifacts without depending on language, title or folder.
type: guide
audience: People who create, review or automate project artifacts.
canonical: true
---

# Identifiers and Traceability

A documentation ID is a stable token. It is not translated and does not change when the artifact changes its title, language, folder or slug.

| Discipline | Codes |
| --- | --- |
| Strategy | `STR-THM`, `STR-INI` |
| Analysis | `ANA-NED`, `ANA-REQ`, `ANA-UC`, `ANA-BR` |
| Architecture | `ARC-ADR`, `ARC-CTR` |
| Delivery | `DLV-EPC`, `DLV-PBI`, `DLV-TSK` |
| Validation | `VAL-AC`, `VAL-GWT`, `VAL-TST` |

## Format

Combine an optional context code, the canonical code and a consecutive number: `COM-ARC-ADR-001`. Relationships are expressed with the ID and a resolvable link.

Projects with historical IDs document an equivalence table before migrating. Do not reuse a retired ID or turn the number into a priority meaning.

When the project's ubiquitous language is Spanish, adapt discipline and artifact-type prefix segments to their Spanish equivalents while keeping the numeric segment language-independent. See [Disciplinary Layers](./layers/#language-alignment) for bilingual folder and ID examples.

[Documentation Governance](/conventions/documentation-governance) keeps the normative catalog; templates under [Disciplinary Layers](./layers/) apply it.
