---
title: Agent Context Routing
description: How to select the smallest useful context guide for an AI-assisted development task.
---

# Agent Context Routing

Context routing helps agents read the right guide for the task without loading the entire DevGuide every time.

## General Rule

1. Identify the primary intent of the task.
2. Select a single initial context guide.
3. Read the references marked as required.
4. Open complete examples only when implementing or fixing code in that technology.
5. Record relevant assumptions and validations in the final response or corresponding spec.

## Routing Matrix

| Task Intent | Initial Context Guide | Read When the Task Mentions |
| --- | --- | --- |
| Implement C# backend with Vertical Slice Architecture | [Backend VSA with Minimal APIs](./context-guides/backend-vsa-minimal-api.md) | Minimal APIs, commands, queries, handlers, state, `Features/`, CQRS, MediatR |
| Design or revise HTTP API contracts, status codes or error responses | [Backend VSA with Minimal APIs](./context-guides/backend-vsa-minimal-api.md) | HTTP API, Problem Details, RFC 9457, status codes, OpenAPI |
| Implement Vue frontend | [Frontend Vue Feature-Set](./context-guides/frontend-vue-feature-set.md) | Vue, component, composable, Pinia, store, feature-set, Storybook, frontend tests |
| Create or change PostgreSQL artifacts | [PostgreSQL and Migrations](./context-guides/postgres-migrations.md) | migration, table, column, routine, function, procedure, view, Evolve, Flyway, flwdb |
| Design or adjust automated tests | [Quality](/quality/) | unit, integration, end-to-end, Vitest, xUnit, Playwright, Testcontainers |
| Create or adjust agent instructions | [Repository Agent Instructions](./context-guides/repository-agent-instructions.md) | `AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md`, agent instructions |
| Document requirements, architecture, delivery or validation | [Project Documentation](./context-guides/project-documentation-artifact.md) | need, requirement, use case, business rule, ADR, contract, PBI, acceptance criteria, GWT |
| Coordinate work with specs for agents | [Specs-Driven Development](./context-guides/specs-driven-development.md) | `docs/specs`, requirements, analysis, plan, execution, summary, phases, evidence |

## Common Combinations

| Scenario | Recommended Order |
| --- | --- |
| Backend feature with endpoint, persistence and migration | Backend VSA with Minimal APIs → PostgreSQL and Migrations |
| Vue screen that consumes an existing API | Frontend Vue Feature-Set → Project Documentation when a PBI or criteria exists |
| Change requested by a spec | Specs-Driven Development → context guide for the affected technology |
| Prepare a repository for agent work | Repository Agent Instructions → primary technology context guide |
| Document a technical decision during implementation | Specs-Driven Development → Project Documentation |
| Add behavior with business validation | Project Documentation → Backend VSA with Minimal APIs |

## Progressive Reading Criteria

1. Read the routing page.
2. Read the one context guide that matches the task.
3. Open the referenced DevGuide sections only when the task needs more detail.
4. Inspect repository-local instructions and existing code before changing files.
5. Validate with commands that already exist in the repository.

## Limits

Do not use routing as a substitute for engineering judgment. If the repository conflicts with a generic guide, prefer the repository's established pattern unless it is clearly broken or unsafe.
