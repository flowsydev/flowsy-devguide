# VSA: Concepts

Guide for systems organized by vertical functionality rather than horizontal technical layers. Each feature traverses all layers autonomously, favoring cohesion, change independence and frictionless team collaboration.

This page is technology-agnostic. Use it to decide slice boundaries, responsibilities and collaboration rules before choosing a framework, language or library. The C# and Minimal API examples are implementation mappings of these concepts, not requirements of Vertical Slice Architecture.

This page assumes the project has already applied the [Backend Project Design Baseline](../project-design-baseline.md): domain exploration, collaborative discovery, behavior-first design, relevant documentation and risk-based validation. Vertical Slice Architecture organizes those decisions by feature or use case; it is not a replacement for project discovery and design.

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

## Vertical Slice Design Workflow

### 1. Initial Design by Vertical Slices

- **Objective**: Do not design "the system", but a useful and complete feature end-to-end.
- Select a relevant user story or use case.
- Model as a complete vertical slice: UI or client contract -> delivery boundary -> use case -> domain behavior -> persistence or integration -> events when needed.
- Design independently: command or use-case input, application handler, domain behavior, state loading strategy, validation, read model, query and integration events when the scenario requires them.
- **Direct benefits**: Isolates code by feature, fosters ownership per slice, avoids Git conflicts and unnecessary shared dependencies.

### 2. Modularization by Context and Feature

- Organize the solution by contextual modules (e.g. `Inventory`, `Sales`, `Security`).
- Each slice should be self-contained and not reference slices from other modules directly.

### 3. Event-Oriented Infrastructure

- Emit events from the Web API (e.g. `OrderPlaced`).
- Consume events in workers (e.g. `SendConfirmationEmail`).
- Apply the [Outbox Pattern](../event-driven-architecture/concepts.md) to guarantee reliability.
- Project events to specific read models.

### 4. Iterative Evolution and End-to-End Tests

- Start with a real and functional vertical slice (e.g. place order).
- Add new features as new slices, not modifying existing ones.
- Test end-to-end: Command -> Domain -> Event -> Worker -> Read model.

### Benefits

| Benefit | Description |
| --- | --- |
| Separation of concerns | Each slice has its own model, handler, validations and tests. |
| Lower collaboration friction | Each team works on different slices or modules without interference. |
| Controlled evolution | New rules or changes do not affect existing slices. |
| Event scalability | New reactions to an event are added without touching the source. |
| More focused tests | Each feature has its own unit and integration tests. |

## Slice-Specific Anti-Patterns

See also [Backend Project Design Baseline: General Anti-Patterns](../project-design-baseline.md#general-anti-patterns) and [DDD: Anti-Patterns](../../../discovery/domain-driven-design.md).

1. **Creating a shared model for every slice**: keep models close to the behavior and promote shared concepts only when the boundary is stable.
2. **Using slices as thin CRUD folders**: make each slice own a meaningful use case with input, behavior, validation and persistence decisions.
3. **Adding too many cross-module dependencies**: use events, explicit contracts or application-level orchestration.
4. **Abstracting handlers, validators or state loaders too early**: allow controlled duplication until real repetition appears across stable behaviors.
5. **Letting delivery adapters own business rules**: keep protocol mapping at the boundary and domain decisions inside the use case or model.

## Commands, Queries and Dispatching

Vertical Slice Architecture does not require a specific mediator, framework or transport. A slice can be invoked from an HTTP endpoint, message consumer, scheduled job, CLI command or UI action. The important decision is that the use case owns its input, behavior, validation and persistence boundary.

- Define one clear entry point per behavior: command, query, use case, action or request handler, depending on the stack.
- Separate commands (write) from queries (read) when complexity, consistency or performance justifies it.
- Use a mediator, dispatcher or direct handler invocation according to project needs. The mediator is an implementation detail, not the architecture itself.
- Keep delivery concerns at the boundary: HTTP status codes, message acknowledgements, CLI output and UI mapping should not contain domain rules.

## Feature Organization Guidelines

Organize code by module, submodule and behavior. The folder names, package names or file names depend on the stack, but the hierarchy should help the team find a complete use case without jumping across unrelated technical layers.

- Module examples: `Inventory/Products`, `Sales/OrderPlacement`, `Security/Users`.
- Command examples: `CreateShoppingCart`, `AddItemToCart`, `SuspendUserAccount`.
- Query examples: `AbandonedCarts`, `SuspendedUsers`, `OrderPlacementSummary`.

Each behavior should define the artifacts it needs, usually:

| Artifact | Purpose | Stack-Agnostic Guidance |
| --- | --- | --- |
| Specification | Business scenarios, rules and acceptance criteria. | Prefer natural language that can guide tests and AI-assisted implementation. |
| Delivery adapter | HTTP route, message consumer, CLI command or UI action. | Translate transport input/output without owning domain behavior. |
| Command or query | Intent and input contract for the use case. | Name commands in imperative form and queries as the information they return. |
| Handler or use case | Application flow and transaction boundary. | Coordinate state loading, domain behavior, persistence and events. |
| State loader | Data and history required to decide correctly. | Keep it scoped to the behavior; do not load an entire model by habit. |
| Validator | Input and precondition validation. | Separate data-shape validation from domain invariants. |
| Read model | Response or reporting model. | Optimize for the consumer when it does not distort the domain model. |

## Error Handling in a Slice

Each slice should make failure ownership explicit:

- delivery adapters bind input and map known outcomes to the protocol;
- validators reject malformed input and simple preconditions before any state change;
- handlers load decision data, call domain behavior and own the consistency boundary;
- `State`, aggregates or value objects enforce domain invariants;
- infrastructure adapters translate provider-specific failures into application errors.

Do not publish messages, send emails or call external services before the slice has validated the command and persisted the intended mutation. When persistence must trigger integration events, prefer an outbox so the state change and event record commit together.

See [Error Handling](../error-handling.md) for the full validation, transaction and infrastructure-error guidance.

## Implementation Mapping

The same slice can be implemented in different stacks:

| Concept | C# / Minimal APIs | Java / Spring | TypeScript / Node |
| --- | --- | --- | --- |
| Delivery adapter | `Endpoint` | `Controller` | Route handler or controller |
| Use-case input | `Command` / `Query` record | Request DTO or command object | Type/interface or command object |
| Handler | `CommandHandler` / `QueryHandler` | Application service or handler | Use-case function or handler class |
| State loader | `StateHandler` | Repository/query service | Repository/query service |
| Validation | FluentValidation validator | Bean Validation or custom validator | Schema validator or custom validator |
| Persistence | Database library, ORM or SQL gateway | Repository, ORM or SQL gateway | Repository, ORM or SQL gateway |

Use the stack-specific guides when you need concrete naming, files, libraries or code:

- [C# Minimal APIs — Complete examples](../dotnet/csharp-minimal-apis.md)
- [C# Conventions](../dotnet/csharp.md)

## Example Logical Structure

This tree shows intent, not a mandatory physical layout. Adapt folder names, file extensions, casing and package/module boundaries to the project's language, framework and repository conventions.

```text
📁 Features/
├── 📁 Inventory/
│   ├── 📁 Products/
│   └── 📁 Categories/
├── 📁 Kernel/
│   ├── 📁 Infrastructure/
│   │   ├── 📁 Mail/
│   │   └── 📁 Time/
│   └── 📁 Model/
├── 📁 Sales/
│   └── 📁 OrderPlacement/
│       ├── 📁 Commands/
│       │   ├── 📁 CreateCart/
│       │   │   ├── 📄 CreateCart.specs
│       │   │   ├── 📄 CreateCartAdapter
│       │   │   ├── 📄 CreateCartCommand
│       │   │   ├── 📄 CreateCartHandler
│       │   │   ├── 📄 CreateCartValidator
│       │   │   └── 📄 CreateCartState
│       │   └── 📁 ModifyCart/
│       │       ├── 📁 AddItemToCart/
│       │       │   ├── 📄 AddItemToCartAdapter
│       │       │   ├── 📄 AddItemToCartCommand
│       │       │   └── 📄 AddItemToCartHandler
│       │       ├── 📁 RemoveItemFromCart/
│       │       │   ├── 📄 RemoveItemFromCartAdapter
│       │       │   ├── 📄 RemoveItemFromCartCommand
│       │       │   └── 📄 RemoveItemFromCartHandler
│       │       └── 📄 OpenShoppingCartState
│       ├── 📁 Infrastructure/
│       │   ├── 📄 ShoppingCartFinderPort
│       │   └── 📄 ShoppingCartFinderAdapter
│       ├── 📁 Model/
│       │   ├── 📄 CartDetail
│       │   ├── 📄 CartOverview
│       │   └── 📄 CartStatus
│       └── 📁 Queries/
│           └── 📁 AbandonedCarts/
│               ├── 📄 AbandonedCartsAdapter
│               ├── 📄 AbandonedCartsQuery
│               └── 📄 AbandonedCartsHandler
└── 📁 Security/
    ├── 📁 Users/
    └── 📁 Roles/
```

## Kernel Module

The `Kernel` module is shared by the entire application:

- `Infrastructure/Mail/` — `IEmailSender`, `SmtpEmailSender`, `SendGridEmailSender`
- `Infrastructure/Time/` — `IClock`, `SystemClock`, `CloudClock`
- `Model/` — `DateRange`, `PhoneNumber`, `EmailAddress`

## Cross Reference

- [Event Storming](../../../discovery/event-storming.md)
- [Domain-Driven Design](../../../discovery/domain-driven-design.md)
