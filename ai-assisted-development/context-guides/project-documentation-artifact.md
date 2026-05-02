---
title: Project Documentation
context_guide: project-documentation-artifact
description: Minimum context for agents creating or updating durable project documentation artifacts.
intent:
  - create project documentation artifact
  - update needs, requirements or rules
  - document ADRs or contracts
  - write acceptance criteria or test cases
applies_when:
  - the task creates or updates durable project documentation
  - the task mentions needs, requirements, use cases, ADRs, contracts, PBIs or validation artifacts
  - the task asks for traceability between discovery, delivery and validation
read_first:
  - /discovery/documentation/
  - /discovery/documentation/writing-guidelines.md
read_if_implementing:
  - /conventions/repository-documentation.md
related_guides:
  - specs-driven-development
  - repository-agent-instructions
validation:
  - verify artifact ID format and links
  - verify the chosen artifact matches the purpose
  - verify terminology is consistent with the project domain
avoid:
  - duplicating the same content across several artifacts
  - mixing implementation notes into durable product documentation without a clear reason
  - writing generic placeholders that do not help future readers
---

# Project Documentation

Use this guide when creating or updating needs, requirements, use cases, business rules, ADRs, contracts, PBIs, tasks, acceptance criteria or test cases.

## Minimum Context

- Identify the artifact type before writing: need, requirement, use case, business rule, ADR, contract, epic, PBI, task, acceptance criteria, GWT scenario or test case.
- Review existing IDs, naming conventions and traceability links.
- Use the domain terms already present in the project documentation.
- Keep the audience clear: business, product, architecture, delivery, validation or repository contributors.
- Use the writing guidelines for durable Markdown documentation.

## Artifact Selection

| Need | Artifact |
| --- | --- |
| Strategic direction or investment theme | Theme or Initiative |
| Business need, requirement or rule | Need, Requirement or Business Rule |
| Actor interaction with preconditions and outcomes | Use Case |
| Technical decision or integration contract | ADR or Contract |
| Backlog decomposition | Epic, PBI or Task |
| Verification expectation | Acceptance Criteria, GWT Scenario or Test Case |

## Implementation Rules

- Keep each artifact focused on one purpose.
- Use stable IDs that do not depend on folder paths.
- Link related artifacts instead of duplicating long explanations.
- Distinguish needs from requirements: needs explain the problem or opportunity; requirements describe what the solution must satisfy.
- Promote reusable rules, decisions and contracts to their own artifact when they affect multiple flows or teams.
- Keep implementation execution details in specs; keep durable product and design knowledge in project documentation.
- Use English for Flowsy artifacts unless the domain concept requires Spanish.
- Keep examples generic or open-source-friendly unless the project defines a specific domain.

## References

- Documentation model: [Project Documentation](/discovery/documentation/).
- Writing rules: [Writing Guidelines](/discovery/documentation/writing-guidelines.md).
- Repository docs: [Repository Documentation](/conventions/repository-documentation.md).
- Validation documentation: [Validation](/discovery/documentation/validation/).
- Specs execution records: [Specs-Driven Development](/ai-assisted-development/specs-driven-development.md).
