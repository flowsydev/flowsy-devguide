# VSA: Concepts

Guide for systems organized by vertical functionality rather than horizontal technical layers. Each feature traverses all layers autonomously, favoring cohesion, change independence and frictionless team collaboration.

## Principles

- Each feature is implemented as an independent slice that traverses all layers (UI, logic, persistence).
- Minimize shared dependencies between slices.
- Favor controlled duplication over premature abstractions between features.
- Each slice is autonomous: it can evolve without affecting other slices.
- The code follows the business, not generic layers: the folder structure reflects the domain, not the technology.

## Contrast with Other Architectures

| Aspect | Vertical Slice | Clean Architecture | Hexagonal (Ports & Adapters) |
| --- | --- | --- | --- |
| Organization | By feature/use case | By technical layer | By ports and adapters |
| Coupling | Between layers within the slice | Between features within the layer | Between core and adapters |
| Reuse | Explicit and deliberate | Implicit through shared layer | Through defined ports |
| Navigation | One directory per feature | One directory per layer | Core + one directory per adapter |
| Testability | Per feature end-to-end | Per layer in isolation | Core without infrastructure |
| Team scalability | High: independent slices | Medium: shared layers | Medium-high: ports decouple |
| Initial complexity | Low-medium | Medium | Medium-high |

These approaches are not mutually exclusive:

- Use **Clean Architecture** to protect the domain core and organize the application layer.
- Use **Vertical Slice** within the application layer to organize use cases by feature.
- Use **Hexagonal** to isolate the domain from delivery mechanisms when multiple adapters exist (REST, gRPC, messaging, CLI).

## Recommended Strategies

### 1. Domain Exploration (Collaborative Discovery)

- **Objective**: Understand the business from its protagonists.
- Conduct [Event Storming](../../../discovery/event-storming.md) sessions with stakeholders (ideally in-person or collaborative online).
- Map key processes with non-technical participants using simple notation: commands, events, aggregates, read models, rules.
- Identify Bounded Contexts naturally (not forced).
- Establish a ubiquitous language for each context.
- **Tools**: Miro, Excalidraw, Notion, paper and post-its.
- **Roles**: Facilitator, Business, Technical.

### 2. Initial Design by Vertical Slices

- **Objective**: Do not design "the system", but a useful and complete feature end-to-end.
- Select a relevant user story or use case.
- Model as a complete vertical slice: UI → API → Command → Domain → Infra → Eventing.
- Design independently: Command + CommandHandler, Domain events, State and StateHandler, Read models and Queries, Validators, Integration events.
- **Direct benefits**: Isolates code by feature, fosters ownership per slice, avoids Git conflicts and unnecessary shared dependencies.

### 3. Modularization by Context and Feature

- Organize the solution by contextual modules (e.g. `Inventory`, `Sales`, `Security`).
- Each slice should be self-contained and not reference slices from other modules directly.

### 4. Event-Oriented Infrastructure

- Emit events from the Web API (e.g. `OrderPlaced`).
- Consume events in workers (e.g. `SendConfirmationEmail`).
- Apply the [Outbox Pattern](../event-driven-architecture/concepts.md) to guarantee reliability.
- Project events to specific read models.

### 5. Iterative Evolution + End-to-End Tests

- Start with a real and functional vertical slice (e.g. place order).
- Add new features as new slices, not modifying existing ones.
- Test end-to-end: Command → Domain → Event → Worker → Read model.

### Benefits

| Benefit | Description |
| --- | --- |
| Separation of concerns | Each slice has its own model, handler, validations and tests. |
| Lower collaboration friction | Each team works on different slices or modules without interference. |
| Controlled evolution | New rules or changes do not affect existing slices. |
| Event scalability | New reactions to an event are added without touching the source. |
| More focused tests | Each feature has its own unit and integration tests. |

## Anti-Patterns

See also: [DDD: Anti-Patterns](../../../discovery/domain-driven-design.md)

1. **Focusing on CRUD instead of behavior** — Alternative: commands with intent.
2. **Global and shared domain model** — Alternative: Bounded Contexts and slices.
3. **Skipping collaborative discovery** — Alternative: Event Storming.
4. **Designing the database first** — Alternative: design behaviors and events first.
5. **Overusing generic Helper Services** — Alternative: domain services with clear language.
6. **Too many cross-module dependencies** — Alternative: events and explicit contracts.
7. **Anemic classes without behavior** — Alternative: encapsulate rules in entities and State.
8. **Applying all DDD concepts from day 1** — Alternative: incremental and pragmatic DDD.

## Integration with MediatR / CQRS

- Use MediatR (or `Flowsy.Mediation`) to dispatch commands and queries per slice.
- Each slice defines its own request and handler.
- Separate commands (write) from queries (read) when complexity justifies it.
- HTTP endpoints can send commands and queries through `IMediator` or directly invoke their corresponding handler, according to project needs and conventions.

## Features Folder Guidelines

The `Features` folder organizes features into modules and submodules:

- Folder naming: `[ModuleName]/[SubmoduleName]/...`
- Module examples: `Inventory/Products`, `Sales/OrderPlacement`, `Security/Users`

When a module can no longer be subdivided, create the folders:

- **`Commands/`**: actions that modify domain state; named in imperative (e.g. `CreateShoppingCart`, `SuspendUserAccount`). Each action has its own folder with:
  - `COPILOT.md` — Optional. Prompts for Copilot assistance during implementation.
  - `[ActionName].specs.md` — Highly recommended. Describes the action, its business rules, use cases and scenarios. Written in natural language, directed at the entire team (devs, testers, stakeholders). Serves as: documentation, base for automated tests, validation reference and AI tool guidance.
  - `[ActionName]Command.cs` — `record Command`, `record CommandResult`, `class CommandHandler`.
  - `[ActionName]CommandValidator.cs` — command data validation.
  - `[ActionName]Endpoint.cs` — Minimal API endpoint; may include optional `record Request` and `record Response` when a structure different from Command/CommandResult is needed.
  - `[ActionName]State.cs` — `class State`, `interface IStateHandler`, `class StateHandler`.
  - When multiple actions share the same state, they are grouped in a container folder (e.g. `ModifyCart/AddItemToCart`, `ModifyCart/RemoveItemFromCart`) with a shared `[GroupName]State.cs`.
- **`Queries/`**: actions that extract information; named as report or screen titles (e.g. `AbandonedCarts`, `SuspendedUsers`). Each action has its own folder with:
  - `COPILOT.md` — Optional.
  - `[ActionName].specs.md` — Highly recommended (same purposes as in Commands).
  - `[ActionName]Query.cs` — `record Query`, `record QueryResult`, `class QueryHandler`.
  - `[ActionName]QueryValidator.cs` — Optional. Query data validation.
  - `[ActionName]Endpoint.cs` — Minimal API endpoint; may include optional `record Request` and `record Response`.
  - When multiple queries share the same state, they are grouped in a container folder with a shared `[GroupName]State.cs`.
- **`Model/`**: data structures and enums shared by the module (e.g. `CartDetail`, `CartStatus`).
- **`Infrastructure/`**: infrastructure services shared by multiple commands/queries.

## Implementation Guidelines

- Log all relevant operations using `ILogger<T>`.
- For service configuration, avoid primitive type parameters or `IConfiguration` instances directly in constructors. Use strongly-typed configuration objects registered via `IOptions<T>`.
- HTTP endpoints send commands and queries to the `IMediator` service; they never directly invoke domain logic.
- Data access within state handlers, command handlers, query handlers and notification handlers is done with `Flowsy.Db.Unity`.
- Use `record` instead of `class` for read models and Value Objects.
- Commit messages must follow [Conventional Commits](https://www.conventionalcommits.org/) format: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.

## Folder Structure

```text
Features/
├── Inventory/
│   ├── Products/
│   └── Categories/
├── Kernel/
│   ├── Infrastructure/
│   │   ├── Mail/
│   │   └── Time/
│   └── Model/
├── Sales/
│   └── OrderPlacement/
│       ├── Commands/
│       │   ├── CreateCart/
│       │   │   ├── CreateCartEndpoint.cs
│       │   │   ├── CreateCartCommand.cs
│       │   │   ├── CreateCartCommandValidator.cs
│       │   │   └── CreateCartState.cs
│       │   └── ModifyCart/
│       │       ├── AddItemToCart/
│       │       │   ├── AddItemToCartEndpoint.cs
│       │       │   ├── AddItemToCartCommand.cs
│       │       │   └── AddItemToCartCommandValidator.cs
│       │       ├── RemoveItemFromCart/
│       │       │   ├── RemoveItemFromCartEndpoint.cs
│       │       │   ├── RemoveItemFromCartCommand.cs
│       │       │   └── RemoveItemFromCartCommandValidator.cs
│       │       └── OpenShoppingCartState.cs
│       ├── Infrastructure/
│       │   ├── IShoppingCartFinder.cs
│       │   └── ShoppingCartFinder.cs
│       ├── Model/
│       │   ├── CartDetail.cs
│       │   ├── CartOverview.cs
│       │   └── CartStatus.cs
│       └── Queries/
│           └── AbandonedCarts/
│               ├── AbandonedCartsEndpoint.cs
│               ├── AbandonedCartsQuery.cs
│               └── AbandonedCartsQueryValidator.cs
└── Security/
    ├── Users/
    └── Roles/
```

## Kernel Module

The `Kernel` module is shared by the entire application:

- `Infrastructure/Mail/` — `IEmailSender`, `SmtpEmailSender`, `SendGridEmailSender`
- `Infrastructure/Time/` — `IClock`, `SystemClock`, `CloudClock`
- `Model/` — `DateRange`, `PhoneNumber`, `EmailAddress`

## Cross Reference

- [C# Minimal APIs — Complete examples](./csharp-minimal-apis.md)
- [Event Storming](../../../discovery/event-storming.md)
- [Domain-Driven Design](../../../discovery/domain-driven-design.md)
