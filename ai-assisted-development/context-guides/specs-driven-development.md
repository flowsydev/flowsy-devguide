---
title: Specs-Driven Development
context_guide: specs-driven-development
description: Minimum context for coordinating work with specs when developers and AI agents collaborate.
intent:
  - create a work spec
  - analyze a requirement before implementation
  - plan execution phases
  - record validation evidence
  - summarize completed work
applies_when:
  - the task mentions docs/specs
  - the task requires traceable analysis, planning or execution
  - multiple phases or agents collaborate on the same change
read_first:
  - /ai-assisted-development/specs-driven-development.md
read_if_implementing:
  - /discovery/documentation/
related_guides:
  - backend-vsa-minimal-api
  - frontend-vue-feature-set
  - postgres-migrations
  - project-documentation-artifact
validation:
  - check that each executed phase has evidence
  - check that the plan includes unit, integration and end-to-end tests when the case requires them
  - check that each phase documents a representative sample of test output when tests are executed
  - check that the final summary allows context to be resumed without reading the full history
avoid:
  - executing phases without approval when the team flow requires prior review
  - duplicating formal project documentation inside the spec
  - leaving important decisions only in chat history
---

# Specs-Driven Development

Use this context guide when the task requires coordinating analysis, planning, execution and closure of a change with enough traceability for humans and agents.

## Minimum Context

- A spec represents one verifiable objective, not a full initiative.
- Use `docs/specs/` or the consuming repository's equivalent path.
- Split specs by grouping folder when several belong to the same subdomain, module or functional area.
- Use numbered files to preserve the logical reading order.
- Use `05.summary.md` as the quick entry point for resuming context.
- Promote durable knowledge to formal project documentation when applicable.

## Expected Structure

```text
📁 docs/specs/
└── 📁 commerce/
    └── 📁 001-order-tracking/
        ├── 📄 01.requirements.md
        ├── 📄 02.analysis.md
        ├── 📄 03.plan.md
        ├── 📄 04.exec.phase-01.md
        └── 📄 05.summary.md
```

## Implementation Rules

- `01.requirements.md` establishes objective, problem, scope and acceptance criteria.
- `02.analysis.md` documents current state, constraints, alternatives and proposed approach.
- `03.plan.md` turns analysis into executable and verifiable phases.
- `03.plan.rev-NN.md` records meaningful adjustments without overwriting the initial plan.
- `04.exec.phase-NN.md` documents execution, changes, evidence and validation for each phase.
- `05.summary.md` consolidates outcome, validation, adjustments and remaining work.
- When possible, the plan should include unit, integration and end-to-end tests that evidence exercised logic, relevant integrations and critical flows, according to the case.
- Execution and closure documents should include a representative sample of test output when tests were run.
- To decide the expected testing level and evidence, consult [Testing](/technologies/testing/).
- If a decision, requirement, contract or criterion emerges with permanent value, link it from the spec and document it in the corresponding disciplinary layer.

## References

- Spec workflow and templates: [Specs-Driven Development](/ai-assisted-development/specs-driven-development.md).
- Testing and evidence: [Testing](/technologies/testing/).
- Durable formal documentation: [Project Documentation](/discovery/documentation/).
- Context guide router: [Agent Context Routing](/ai-assisted-development/agent-routing.md).
