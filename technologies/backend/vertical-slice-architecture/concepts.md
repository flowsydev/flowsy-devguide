# VSA: Concepts

Guide for systems organized by vertical functionality rather than horizontal technical layers. Each feature traverses all layers autonomously, favoring cohesion, change independence and frictionless team collaboration.

This page is technology-agnostic. Use it to decide boundaries, responsibilities and collaboration rules before choosing a framework, language or library. The C# and Minimal API examples are implementation mappings of these concepts, not requirements of Vertical Slice Architecture.

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
- Model as a complete vertical slice: UI or client contract -> delivery boundary -> use case -> domain behavior -> persistence or integration -> events when needed.
- Design independently: command or use-case input, application handler, domain behavior, state loading strategy, validation, read model, query and integration events when the scenario requires them.
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

- [C# Minimal APIs — Complete examples](./csharp-minimal-apis.md)
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
