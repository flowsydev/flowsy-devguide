---
title: Backend VSA with Minimal APIs
context_guide: backend-vsa-minimal-api
description: Minimum context for agents implementing backend slices in C# with Minimal APIs.
intent:
  - create a Minimal API endpoint
  - implement a command or query
  - organize code under Features
  - decide whether a command needs State and StateHandler
applies_when:
  - the task modifies C# backend code
  - the task mentions Vertical Slice Architecture
  - the task creates or changes endpoints, commands, queries, handlers or state
read_first:
  - /technologies/backend/dotnet/csharp
  - /technologies/backend/vertical-slice-architecture/concepts.md
read_if_implementing:
  - /technologies/backend/api-design.md
  - /technologies/backend/dotnet/csharp-minimal-apis.md
  - /technologies/backend/concepts.md
  - /technologies/testing/csharp-dotnet.md
related_guides:
  - postgres-migrations
  - specs-driven-development
validation:
  - dotnet build
  - relevant unit, integration or end-to-end tests from the project
avoid:
  - concentrating business logic in endpoints
  - creating generic services when the logic belongs to the slice
  - sharing mutable models between modules without a clear reason
---

# Backend VSA with Minimal APIs

Use this guide when implementing or modifying a backend feature organized as a vertical slice.

## Minimum Context

- Organize work by feature or use case inside `Features/`.
- Keep each command or query as a complete behavior unit.
- Use Minimal API endpoints as a thin HTTP layer.
- Use the HTTP API design baseline for resource-oriented routes, status codes and Problem Details.
- Place business rules and state validation in the handler, state object or domain model that owns them.
- Use `record` for commands, queries, results, DTOs and read models.
- Use `DateTimeOffset` for auditable timestamps and persist instants in UTC.
- Do not expose numeric auto-increment primary keys outside backend boundaries; use `PublicId` for external contracts and explicit `Internal` variants when private IDs are required.
- Include `ILogger<T>` logging in relevant operations.
- Consult [Testing C#/.NET](/technologies/testing/csharp-dotnet.md) when the change requires unit, integration or end-to-end tests.

## Expected Structure

Keep each slice cohesive. A simple command does not need a `State` file by default:

```text
📁 Features/[Module]/[Submodule]/Commands/[ActionName]/
├── 📄 [ActionName]Endpoint.cs
├── 📄 [ActionName]Command.cs
└── 📄 [ActionName]CommandValidator.cs
```

Add `[ActionName]State.cs` only when the mutation needs a `State` and concrete `StateHandler` for an explicit decision model and consistency boundary.

For queries, use `Queries/[ActionName]/` with `Query`, `QueryResult`, `QueryHandler` and validator when applicable.

## Implementation Rules

- Name commands in imperative form: `CreateOrder`, `AssignShipment`, `ConfirmPayment`.
- Name queries as reports, screens or reads: `OrdersPendingShipment`, `CustomerOrderHistory`.
- Validate input with FluentValidation when the project already has a validator structure.
- When error behavior changes, validate status code, content type and `application/problem+json` shape in representative integration tests.
- If the project uses a mediator, the endpoint should send the command or query to the mediator.
- If the project does not use a mediator, the endpoint can inject the handler directly.
- Prefer direct mutation in the command handler for simple single-entity changes with focused rules.
- Use `State` and a concrete `StateHandler` for complex mutations that combine multiple data sources, require an explicit consistency boundary or benefit from isolated decision-model tests.
- When using `StateHandler`, open the session/transaction in the command handler and instantiate the concrete `StateHandler` directly with those active source-of-truth objects.
- When several actions need the same decision data, share a common state object.
- Keep shared infrastructure inside the module when it has module-specific semantics. Avoid global helpers without domain meaning.
- Use `Flowsy.Mediation` or the repository's established mediation pattern when the project already uses it.
- Use `Flowsy.Db.Unity` or the repository's established data-access abstraction when present.

## References

- Naming and contracts: [C# Conventions](/technologies/backend/dotnet/csharp).
- Structure and principles: [VSA Concepts](/technologies/backend/vertical-slice-architecture/concepts.md).
- Complete examples: [VSA: C# with Minimal APIs](/technologies/backend/dotnet/csharp-minimal-apis.md).
- Backend baseline and traceability: [Backend Concepts](/technologies/backend/concepts.md).
- HTTP contracts and errors: [HTTP API Design](/technologies/backend/api-design.md).
- Testing by stack: [Testing C#/.NET](/technologies/testing/csharp-dotnet.md).
