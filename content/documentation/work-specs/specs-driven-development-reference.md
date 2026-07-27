---
title: Broad Specs-Driven Development Reference
description: Complete structure, templates and workflow examples for coordinating changes with specs; progressive pages keep the canonical path.
type: reference
audience: People who need complete template examples for specs.
canonical: false
canonicalSource: /documentation/work-specs/
---

# Specs-Driven Development

> [!IMPORTANT]
> This page is a broad non-normative reference. Follow [Work Specs](/documentation/work-specs/) for the canonical progressive path.

When working with AI agents, the spec should be treated as the main coordination artifact. The conversation does not replace documentation: it prepares it, updates it and challenges it during execution.

Specs-Driven Development favors short cycles where the team:

- makes the problem and expected outcome explicit before changing code;
- documents assumptions, constraints and decisions to reduce ambiguity between iterations;
- splits work into verifiable phases that can be reviewed or resumed without depending on the full chat context;
- preserves evidence of what was executed so changes can be audited, reproduced and corrected when needed.

This approach is especially useful when several developers and agents collaborate in the same repository. It reduces context loss, keeps important decisions out of fragile chat history and makes it easier to resume a spec without reconstructing everything from scratch.

### Suggested Spec Format

A practical way to apply this approach is to keep spec artifacts in a dedicated root folder. In most repositories, the recommended location is `docs/specs/` or `Docs/Specs/`, because `docs/` can host other support materials in addition to specs.

In repositories where the main product is documentation, such as development guides, project documentation sites or knowledge bases, a direct root such as `specs/` or `Specs/` can be used to avoid redundant nesting.

In this model, the main work unit is the `spec`: a folder that brings together the requirements, analysis, plan, execution records and summary for one concrete change or feature. Each spec should be understandable, implementable and verifiable with relative autonomy.

When several specs belong to the same line of work, they can be grouped in a common folder directly under the specs root. That grouping folder can represent a module, subdomain, initiative, feature-set or functional area. Its purpose is to organize related specs, not to introduce a rigid hierarchy.

The following examples use `docs/specs/` as the root because it is the most common convention. If a repository uses `specs/`, the internal structure remains the same.

```text
📁 docs/specs/
├── 📄 README.md
├── 📁 commerce/
│   ├── 📁 001-order-tracking/
│   │   ├── 📄 01.requirements.md
│   │   ├── 📄 02.analysis.md
│   │   ├── 📄 03.plan.md
│   │   ├── 📄 03.plan.rev-01.md
│   │   ├── 📄 04.exec.phase-01.md
│   │   ├── 📄 04.exec.phase-02.md
│   │   └── 📄 05.summary.md
│   └── 📁 002-customer-credit-validation/
│       ├── 📄 01.requirements.md
│       ├── 📄 02.analysis.md
│       ├── 📄 03.plan.md
│       ├── 📄 04.exec.phase-01.md
│       └── 📄 05.summary.md
└── 📁 identity/
    └── 📁 001-session-hardening/
        ├── 📄 01.requirements.md
        ├── 📄 02.analysis.md
        ├── 📄 03.plan.md
        ├── 📄 04.exec.phase-01.md
        └── 📄 05.summary.md
```

If the project does not need grouping folders, a spec can live directly under the specs root.

```text
📁 docs/specs/
└── 📁 001-add-account-recovery/
    ├── 📄 01.requirements.md
    ├── 📄 02.analysis.md
    ├── 📄 03.plan.md
    ├── 📄 04.exec.phase-01.md
    └── 📄 05.summary.md
```

### Naming Conventions

| Segment | Format | Example |
| --- | --- | --- |
| Common root folder | `docs/specs` or `Docs/Specs` | `docs/specs` |
| Specialized root folder | `specs` or `Specs` | `specs` |
| Grouping folder | `<slug>` | `access-control` |
| Spec | `<NNN>-<slug>` | `001-login-hardening` |
| Requirements | `01.requirements.md` | `01.requirements.md` |
| Analysis | `02.analysis.md` | `02.analysis.md` |
| Initial plan | `03.plan.md` | `03.plan.md` |
| Plan revision | `03.plan.rev-NN.md` | `03.plan.rev-01.md` |
| Execution by phase | `04.exec.phase-NN.md` | `04.exec.phase-01.md` |
| Final summary | `05.summary.md` | `05.summary.md` |

- The slug uses kebab-case and describes the grouping folder or spec briefly.
- The spec is numbered within its grouping folder with leading zeroes.
- Numeric prefixes in files establish the logical reading order.
- Not every spec needs plan revisions or multiple execution phases, but keeping the naming convention preserves consistency.
- If a phase needs incidents, corrections or follow-up notes, record that context in the corresponding `04.exec.phase-NN.md` file or create a new phase when the work has its own substance.
- Start with a simple structure. Introduce grouping folders when several specs share the same functional area or subdomain and the root folder becomes hard to scan.

### Spec Location

Use `docs/specs/` or `Docs/Specs/` when the repository is primarily an application, service, library, platform or technical component, and the `docs/` folder can also contain architecture notes, operations documents, troubleshooting guides, runbooks or user guides.

Use `specs/` or `Specs/` when the repository is primarily documentary, such as a development guide, project documentation site or knowledge base. In these cases, specs are part of the editorial workflow and do not need to be nested under another documentation folder.

Once the root is chosen, keep the same internal structure of grouping folders, specs and numbered documents.

### Basic Subdivision Rule

A spec should cover one verifiable objective.

Split a spec into several specs when any of these conditions applies:

- it requires separate approvals;
- it can be delivered in increments with independent value;
- it mixes several functional or technical goals that are only loosely coupled;
- its analysis, plan or execution can no longer be reasonably understood as one unit.

As a practical rule: if a spec starts looking like an initiative or roadmap, turn it into a grouping folder and decompose it into smaller specs.

It is also useful to create grouping folders when several specs belong to the same related area and the volume of work is no longer easy to navigate in a flat structure.

### Document Types

#### `01.requirements.md`

Defines what is needed, why it is needed and which criteria determine whether the work is complete. Its purpose is to establish the objective before discussing implementation.

Suggested minimum structure:

```markdown
# <Spec Name>

## Objective

Brief description of the expected outcome.

## Problem or Need

Situation that motivates the spec.

## Scope

What is included and what is intentionally out of scope.

## Acceptance Criteria

Conditions that must be met for the solution to be considered correct.
```

#### `02.analysis.md`

Documents the current state, constraints, findings and alternatives considered. Its purpose is to separate understanding the problem from planning and execution.

Even when the analysis describes work that later matches one or more plan phases, that content does not replace execution documentation. If a phase exists in the plan, it must later be recorded in its own `04.exec.phase-NN.md` file, even when it covers discovery, inventory, initial verification or other activities already described in the analysis.

Suggested minimum structure:

```markdown
# Analysis - <Spec Name>

## Current State

How the system or process works today.

## Findings and Constraints

Technical limitations, dependencies, risks or relevant considerations.

## Alternatives Considered

Options evaluated and the reason they were selected or discarded.

## Proposed Approach

Chosen direction as the basis for planning execution.
```

#### `03.plan.md`

Describes the initial work plan by phases. Its purpose is to turn analysis into an executable and reviewable sequence before making changes.

Suggested minimum structure:

```markdown
# Plan - <Spec Name>

## General Strategy

Summary of the implementation approach.

## Phases

### Phase 1
Concrete steps to execute.

### Phase 2
Concrete steps to execute.

## Planned Validations

Tests, reviews or evidence expected by phase. When possible, the plan should include unit, integration and end-to-end tests that produce clear evidence of exercised logic, relevant integrations and validated critical flows, according to the needs of each case.
```

> [!WARNING] Important
> Do not execute any phase of the plan without prior review and approval from the responsible developer. The existence of analysis or a detailed plan is not authorization to execute it.

#### `03.plan.rev-NN.md`

Records the result of reviewing the plan before execution or between phases. A review can produce one of three outcomes: meaningful changes to the plan, pending questions or definitions in actionable form, or a conclusion that the plan is ready for approval and execution. Its purpose is to preserve traceability without overwriting the initial plan.

Suggested minimum structure:

```markdown
# Plan Review NN - <Spec Name>

## Reason for the Review

What caused this plan review.

## Plan Adjustments

Modified, added, removed or reordered phases. Omit if not applicable.

## Pending Questions or Definitions

Questions or definitions that must be resolved before continuing. Include the answer or decision once resolved. Omit if not applicable.

## Review Conclusion

Declare whether the plan is ready to request approval and proceed with execution, or whether blockers remain.
```

#### `04.exec.phase-NN.md`

Records the actual execution of each phase, including changes made, evidence, validations and observations. Its purpose is to leave a verifiable record of what was done and how it was checked.

Every planned phase that is executed must have its own `04.exec.phase-NN.md` file. Do not omit this record just because part of the content was anticipated in `02.analysis.md` or summarized in another artifact.

Suggested minimum structure:

```markdown
# Execution Phase NN - <Spec Name>

## Phase Objective

What the phase aimed to achieve.

## Changes Made

Modified files, applied decisions or executed actions.

## Evidence and Validation

Commands, tests, results or reviews performed. When tests are executed, include a representative sample of the output to show the exercised logic and observed results.

## Generated Artifacts

Files created or updated and their purpose.

## Notes

Deviations, incidents or decisions made during the phase.
```

#### `05.summary.md`

Consolidates the overall picture of the spec when it is completed or when a relevant cycle is closed. It should summarize the requirements, analysis, plan and execution so developers and AI agents can quickly understand the result without rereading the full documentary history.

Suggested minimum structure:

```markdown
# Summary - <Spec Name>

## Original Objective

Brief statement of what the spec intended to solve.

## Executed Solution

Description of the implemented or documented solution.

## Completed Phases

List of executed phases and their result.

## Relevant Plan Adjustments

Meaningful changes introduced through plan reviews or during execution.

## Validation Result

Tests, reviews or evidence that support the outcome.

## Remaining Work or Next Steps

Pending items, known limitations or recommended follow-up work.
```

### Workflow by Spec

1. Capture the problem, expected result, scope and acceptance criteria in `01.requirements.md`.
2. Analyze the current state, constraints, alternatives and proposed approach in `02.analysis.md`.
3. Create `03.plan.md` when the work needs review, coordination or phased execution.
4. If the plan changes before or during execution, document the change in `03.plan.rev-NN.md`.
5. Execute each approved phase and record the real outcome in `04.exec.phase-NN.md`.
6. Validate the result with the appropriate tests, builds, reviews or manual checks.
7. Close the cycle with `05.summary.md`, including validation result and remaining work.

Specs can be lightweight. A small change may have short documents. A risky change needs more explicit analysis, validation and evidence. The important point is that the spec remains aligned with the actual work.

### Note for AI Agents

AI agents should use specs as shared working memory, not as paperwork after the fact.

- If the user asks for requirements, analysis or a plan, create or update the corresponding spec documents and stop where review is expected.
- If the user requests plan review before implementation, do not start execution until the plan is approved.
- If the approved plan changes because of a new finding, document the change before continuing.
- If a phase is executed, create the corresponding `04.exec.phase-NN.md` file with factual evidence.
- Do not hide uncertainty. Record assumptions, decisions, limitations and validation gaps clearly.
- Do not copy long logs. Include representative output and point to generated artifacts when needed.

### Relationship With Project Documentation

Specs describe work execution. Durable product knowledge should move into project documentation, ADRs, contracts or repository guides when it remains useful after the change is complete.

For example:

- a spec can document how an API contract was introduced;
- the stable API contract itself should live in the project documentation or contract folder;
- the spec summary can link to the contract and explain how it was implemented, validated and reviewed.

This keeps specs useful as execution records without turning them into the only source of truth for product, architecture or operational knowledge.
