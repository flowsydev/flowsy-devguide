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
  - /engineering/backend/architecture/vertical-slice-architecture
  - /engineering/backend/dotnet/csharp
read_if_implementing:
  - /engineering/backend/dotnet/minimal-apis/feature-set-structure
  - /engineering/backend/api/http-api-design
  - /engineering/backend/dotnet/minimal-apis/
  - /quality/stacks/csharp-dotnet
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

## Decision Sequence for Agents

1. Identify the behavior and slice boundary before choosing files or libraries.
2. Apply the VSA and reliability concepts relevant to the problem.
3. Inspect the repository's actual structure and dependencies.
4. Map the decision to its C# and Minimal APIs profile without copying examples mechanically.
5. Verify the HTTP contract, persistence, effects and tests according to the change's risk.

If the repository differs from a convention here, record the finding and determine whether it is a deliberate local decision before reorganizing existing code.

## Minimum Context

- Organize work by feature or use case inside `Features/`.
- Keep each command or query as a complete behavior unit.
- Use Minimal API endpoints as a thin HTTP layer.
- Use the HTTP API design baseline for resource-oriented routes, status codes and Problem Details.
- Place business rules and state validation in the handler, state object or domain model that owns them.
- Use `record` for commands, queries, results, DTOs and read models.
- Follow the project's documented date/time strategy. Use `DateTimeOffset` or UTC `DateTime` for UTC instants, `DateTime` for canonical system time-zone values, and `DateTime` plus a time-zone identifier for per-entity local values.
- Do not expose numeric auto-increment primary keys outside backend boundaries; use `PublicId` for external contracts and explicit `Internal` variants when private IDs are required.
- Include `ILogger<T>` logging in relevant operations.
- Consult [Testing C#/.NET](/quality/stacks/csharp-dotnet) when the change requires unit, integration or end-to-end tests.

## Expected Structure

Each command or query lives in its own slice folder and defines its endpoint there. A simple command does not need a `State` file by default:

```text
📁 Features/[Module]/[Submodule]/Commands/[ActionName]/
├── 📄 [ActionName]Endpoint.cs
├── 📄 [ActionName]Command.cs
└── 📄 [ActionName]CommandValidator.cs
```

Add `[ActionName]State.cs` only when the mutation needs a `State` and concrete `StateHandler` for an explicit decision model and consistency boundary.

For queries, keep the same placement:

```text
Features/[Module]/[Submodule]/Queries/[ActionName]/
├── [ActionName]Endpoint.cs
├── [ActionName]Query.cs
└── [ActionName]QueryValidator.cs  (optional)
```

Do not create a `[FeatureSet]Endpoints.cs` aggregator. Each endpoint class exposes its own `Map(RouteGroupBuilder)` method, called at the application's route composition point.

## Implementation Rules

- Name commands in imperative form: `CreateOrder`, `AssignShipment`, `ConfirmPayment`.
- Name queries as reports, screens or reads: `OrdersPendingShipment`, `CustomerOrderHistory`.
- Validate input with FluentValidation when the project already has a validator structure.
- When error behavior changes, validate status code, content type and `application/problem+json` shape in representative integration tests.
- If the project uses a mediator, the endpoint should send the command or query to the mediator.
- If the project does not use a mediator, the endpoint can inject the handler directly.
- Prefer direct mutation in the command handler for simple single-entity changes with focused rules.
- Use `State` and a concrete `StateHandler` for complex mutations that combine multiple data sources, require an explicit consistency boundary or benefit from isolated decision-model tests.
- Keep `State` and `StateHandler` in the slice's `[ActionName]State.cs` when only one command uses them; if shared, place them in the nearest common folder.
- When using `StateHandler`, open the session/transaction in the command handler and instantiate the concrete `StateHandler` directly with those active source-of-truth objects.
- When several actions need the same decision data, share a common state object.
- Keep shared infrastructure inside the module when it has module-specific semantics. Avoid global helpers without domain meaning.
- Use `Flowsy.Mediation` or the repository's established mediation pattern when the project already uses it.
- Use `Flowsy.Db.Unity` or the repository's established data-access abstraction when present.

## References

- Naming and contracts: [C# Conventions](/engineering/backend/dotnet/csharp).
- Structure and principles: [VSA Concepts](/engineering/backend/architecture/vertical-slice-architecture).
- Complete examples: [VSA: C# with Minimal APIs](/engineering/backend/dotnet/minimal-apis/).
- Conceptual overview and available profiles: [Backend](/engineering/backend/).
- HTTP contracts and errors: [HTTP API Design](/engineering/backend/api/http-api-design).
- Testing by stack: [Testing C#/.NET](/quality/stacks/csharp-dotnet).
