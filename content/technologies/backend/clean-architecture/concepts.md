# Clean Architecture: Concepts

Guide for systems organized in concentric layers with dependencies pointing toward the center (domain).

This page is technology-agnostic. Use it to decide dependency direction, responsibility boundaries and domain protection rules before choosing frameworks, packages or deployment style.

## Principles

- **Dependency rule**: inner layers do not know about outer layers.
- The domain is the core and does not depend on frameworks, databases or UI.
- Interfaces are defined in inner layers and implemented in outer layers (dependency inversion).
- Clearly separate business policies from delivery mechanisms.

## Layers

### Domain

- Entities, value objects, aggregates and domain events.
- Invariant business rules.
- No external dependencies.

### Application

- Use cases (commands, queries, handlers).
- Port interfaces (repositories, external services).
- Application logic orchestration.
- Depends only on Domain.

### Infrastructure

- Implementation of ports defined in Application.
- Persistence (ORM, migrations).
- HTTP clients, messaging, external services.
- Depends on Application and Domain.

### Presentation

- Controllers, endpoints, middleware.
- Input/output DTO mapping.
- Depends on Application.

## Suggested Folder Structure

This structure is logical. In a real implementation it may become folders, packages, projects, modules or namespaces depending on the stack. Adapt names, casing, file extensions and grouping rules to the conventions of the project, language and framework.

```text
📁 src/
├── 📁 Domain/
│   ├── 📁 Entities/
│   ├── 📁 ValueObjects/
│   ├── 📁 Events/
│   └── 📁 Interfaces/
├── 📁 Application/
│   ├── 📁 UseCases/
│   │   └── 📁 CreateOrder/
│   │       ├── 📄 CreateOrderCommand
│   │       └── 📄 CreateOrderHandler
│   └── 📁 Interfaces/
│       └── 📄 OrderRepositoryPort
├── 📁 Infrastructure/
│   ├── 📁 Persistence/
│   │   └── 📁 Repositories/
│   │       └── 📄 OrderRepositoryAdapter
│   └── 📁 ExternalServices/
└── 📁 Presentation/
    ├── 📁 Controllers/
    │   └── 📄 OrdersController
    └── 📁 DTOs/
```

## Implementation Mapping

| Concept | C# / .NET | Java / Spring | TypeScript / Node |
| --- | --- | --- | --- |
| Domain | Class library, namespace or module without framework dependencies. | Package/module with entities, value objects and domain services. | Package/folder with domain model and pure functions/classes. |
| Application | Use-case handlers, commands, queries and port interfaces. | Application services, command/query handlers and ports. | Use-case functions/classes and port interfaces. |
| Infrastructure | EF Core, Dapper, SQL gateway, HTTP clients or message adapters. | JPA, JDBC, HTTP clients or message adapters. | ORM, query builder, HTTP clients or message adapters. |
| Presentation | Controllers, Minimal API endpoints, middleware or workers. | Controllers, message listeners or CLI adapters. | Route handlers, controllers, message consumers or CLI adapters. |

## Contrast with Vertical Slice Architecture

| Aspect | Clean Architecture | Vertical Slice |
| --- | --- | --- |
| Organization | By technical layer | By feature/use case |
| Coupling | Between features within the layer | Between layers within the slice |
| Reuse | Implicit through shared layer | Explicit and deliberate |
| Testability | Per layer in isolation | Per feature end-to-end |

These approaches are not mutually exclusive:

- Use **Clean Architecture** to protect the domain core and organize the application layer.
- Use **Vertical Slice** within the application layer to organize use cases by feature.
- See [Vertical Slice Architecture](../vertical-slice-architecture/concepts.md) for details on combining both approaches.

## Conventions

- Do not reference infrastructure projects from the domain.
- Register dependencies via injection, module wiring or equivalent composition mechanism at the application boundary.
- Keep use cases focused: one handler per command/query.
- Validate input at the boundary (Presentation) and business rules in Domain.
