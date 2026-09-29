---
title: Agent Context Routing
description: How to select the smallest useful context guide for an AI-assisted development task.
---

# Agent Context Routing

Context routing helps agents read the right context guide, stack profile or canonical source without loading the entire DevGuide every time.

## General Rule

1. Identify the primary intent of the task.
2. Select a single initial source.
3. Read the references marked as required.
4. Open complete examples only when implementing or fixing code in that technology.
5. Record relevant assumptions and validations in the final response or corresponding spec.

## Routing Matrix

| Task Intent | Initial Source | Read When the Task Mentions |
| --- | --- | --- |
| Implement C# backend with Vertical Slice Architecture | [Backend VSA with Minimal APIs](./context-guides/backend-vsa-minimal-api.md) | Minimal APIs, commands, queries, handlers, state, `Features/`, CQRS, MediatR |
| Implement Python backend with Vertical Slice Architecture | [VSA with FastAPI and PostgreSQL](/engineering/backend/python/vertical-slice-architecture) | FastAPI, Pydantic, SQLAlchemy, SQLModel, Psycopg, Alembic, `APIRouter` |
| Design a backend before choosing a stack | [Backend](/engineering/backend/) | architecture, boundaries, API, validation, errors, consistency, transactions |
| Design or revise HTTP API contracts, status codes or error responses | [HTTP API Design](/engineering/backend/api/http-api-design) | HTTP API, Problem Details, RFC 9457, status codes, OpenAPI |
| Design frontend structure or contracts before choosing a framework | [Frontend](/engineering/frontend/) | modular architecture, feature-set, UI/API contract, ViewModel, adapter |
| Implement frontend contracts or models with TypeScript | [TypeScript for Frontend](/engineering/frontend/typescript) | TypeScript, strict typing, DTO, ViewModel, date and time |
| Implement Vue frontend | [Frontend Vue Feature-Set](./context-guides/frontend-vue-feature-set.md) | Vue, component, composable, Pinia, store, feature-set, Storybook, frontend tests |
| Create or change PostgreSQL artifacts | [PostgreSQL and Migrations](./context-guides/postgres-migrations.md) | migration, table, column, routine, function, procedure, view, Evolve, Flyway, flwdb |
| Design or adjust automated tests | [Quality](/quality/) | unit, integration, end-to-end, Vitest, xUnit, Playwright, Testcontainers |
| Create or adjust agent instructions | [Repository Agent Instructions](./context-guides/repository-agent-instructions.md) | `AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md`, agent instructions |
| Document requirements, architecture, delivery or validation | [Project Documentation](./context-guides/project-documentation-artifact.md) | need, requirement, use case, business rule, ADR, contract, PBI, acceptance criteria, GWT |
| Coordinate work with specs for agents | [Specs-Driven Development](./context-guides/specs-driven-development.md) | `docs/specs`, requirements, analysis, plan, execution, summary, phases, evidence |

## Common Combinations

| Scenario | Recommended Order |
| --- | --- |
| C# backend feature with endpoint, persistence and migration | Backend VSA with Minimal APIs → PostgreSQL and Migrations |
| Python backend feature with endpoint, persistence and migration | VSA with FastAPI and PostgreSQL → PostgreSQL and Migrations |
| Vue screen that consumes an existing API | Frontend Vue Feature-Set → Project Documentation when a PBI or criteria exists |
| Frontend design before choosing a framework | Frontend → Modular Architecture or UI/API Contracts according to the decision |
| Change requested by a spec | Specs-Driven Development → context guide for the affected technology |
| Prepare a repository for agent work | Repository Agent Instructions → primary technology context guide |
| Document a technical decision during implementation | Specs-Driven Development → Project Documentation |
| Add behavior with business validation | Project Documentation → backend profile for the selected stack |

## Progressive Reading Criteria

1. Read the routing page.
2. Read the one initial source that matches the task.
3. Open the referenced DevGuide sections only when the task needs more detail.
4. Inspect repository-local instructions and existing code before changing files.
5. Validate with commands that already exist in the repository.

Separate conceptual decisions from implementation mapping: read the technology-independent source first, then the stack profile when the task requires code.

## Limits

Do not use routing as a substitute for engineering judgment. If the repository conflicts with a generic guide, prefer the repository's established pattern unless it is clearly broken or unsafe.
