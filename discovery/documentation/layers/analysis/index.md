---
layout: section-home

hero:
  name: "Analysis"
  text: "Needs, rules and behavior"
  tagline: Artifacts to understand the problem, capture domain constraints and specify how the system should behave.
  actions:
    - theme: brand
      text: View Need
      link: /discovery/documentation/layers/analysis/templates/need
    - theme: alt
      text: View Requirement
      link: /discovery/documentation/layers/analysis/templates/requirement
    - theme: alt
      text: View Use Case
      link: /discovery/documentation/layers/analysis/templates/use-case

features:
  - icon: 💡
    title: Need
    details: Problem or opportunity from the business or stakeholder perspective.
    link: /discovery/documentation/layers/analysis/templates/need
  - icon: 📋
    title: Requirement
    details: What the system must do or comply with, including constraints and NFRs.
    link: /discovery/documentation/layers/analysis/templates/requirement
  - icon: 👥
    title: Use Case
    details: Structured interactions between actors and the system to achieve an objective.
    link: /discovery/documentation/layers/analysis/templates/use-case
  - icon: 📏
    title: Business Rule
    details: Domain conditions that apply regardless of the interface or implementation.
    link: /discovery/documentation/layers/analysis/templates/business-rule
---

# Analysis / Requirements

Artifacts for understanding the problem, formalizing needs, specifying expected behavior and documenting domain rules.

## Purpose

Answer the questions:

- What does the business or user need?
- What must the system do?
- What rules, constraints or conditions apply?
- How do actors interact with the system?

## Artifacts

| Artifact | Description | Value | When to use | When to omit |
| --- | --- | --- | --- | --- |
| **Need** | Description of the problem or opportunity from the business or stakeholder perspective | Documents the origin and justification of the work | There is a business problem requiring analysis before jumping to solutions | The team already understands the problem and can work directly with requirements |
| **Requirement** | Usable representation of a need: functional, non-functional, regulatory, integration or security | Formalizes what the system must do or comply with | There are rules, contracts, NFRs, compliance or relevant ambiguity | The team can work with a lightweight backlog and low risk |
| **Use Case** | Structured description of an interaction between actor and system to achieve an objective | Clarifies complex flows with actors, preconditions, variants and exceptions | There are multiple actors, variants, permissions, auditing or exceptions | The change is simple and has no conversational complexity |
| **Business Rule** | Domain condition that applies regardless of the interface or implementation | Documents constraints that govern business logic | There are conditions affecting multiple artifacts or flows | The rule is trivial and is better expressed as an acceptance criterion |

::: tip User Story vs. Use Case
They do not form a mandatory hierarchy. The user story serves for backlog and incremental planning. The use case serves for functional analysis. A use case can inform multiple stories; a complex story can reference one or more use cases; a simple story may not need a use case.
:::

## Need vs. Requirement

Needs and requirements are related, but they should not be treated as the same artifact.

### Need

A need describes the problem, opportunity or expected improvement from the stakeholder or business perspective. It explains why the work matters before prescribing what the system must do.

Good needs are useful when the team is still exploring the problem space, comparing alternatives or deciding whether a solution is worth building.

### Requirement

A requirement describes a condition the solution must satisfy. It can be functional, non-functional, regulatory, security-related, integration-related or operational.

Good requirements are specific enough to guide design, implementation and validation. They should be necessary, clear, feasible and verifiable.

### Practical Rule

Use a need when the question is "what problem or opportunity are we addressing?" Use a requirement when the question is "what must the solution do or comply with?"

### Relationship Between Them

One need can produce several requirements. One requirement can support several needs. Keep the relationship explicit through stable IDs and links instead of duplicating the same explanation in multiple artifacts.

## Templates

- [Need](./templates/need) — Template for documenting a business need.
- [Requirement](./templates/requirement) — Template for documenting a requirement.
- [Use Case](./templates/use-case) — Template for documenting a use case.
- [Business Rule](./templates/business-rule) — Template for documenting a business rule.

## Collaboration Tools

- **Jira**: Requirements as custom fields or linked documents.
- **Azure Boards**: Work items of type Requirement with acceptance fields.
- **Confluence / SharePoint**: Complementary documentation for use cases and business rules.

## References

- [BABOK — Use Cases and Scenarios (IIBA)](https://www.iiba.org/knowledgehub/business-analysis-body-of-knowledge-babok-guide/10-techniques/10-47-use-cases-and-scenarios/) — Definitions of requirement, use case, user story and acceptance criteria as separate techniques.
- [SEBoK — Stakeholder Needs Definition (INCOSE)](https://sebokwiki.org/wiki/Stakeholder_Needs_Definition) — Separation between stakeholder needs and system requirements.
- [INCOSE Guide to Writing Requirements](https://www.incose.org/docs/default-source/working-groups/requirements-wg/guidetowritingrequirements/incose_rwg_gtwr_v4_summary_sheet.pdf) — Requirements quality: necessity, clarity, completeness, feasibility, verifiability, consistency.
- [PMI — Business Analysis](https://www.pmi.org/standards/business-analysis) — Use cases as analysis and communication tools.
- [OMG — UML](https://www.omg.org/spec/UML/2.5.1/About-UML) — UML as a modeling language for use case diagrams.
