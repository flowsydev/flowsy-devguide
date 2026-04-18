# Clean Architecture: Concepts

Guide for systems organized in concentric layers with dependencies pointing toward the center (domain).

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

```text
src/
  Domain/
    Entities/
    ValueObjects/
    Events/
    Interfaces/
  Application/
    UseCases/
      CreateOrder/
        CreateOrderCommand.cs
        CreateOrderHandler.cs
    Interfaces/
      IOrderRepository.cs
  Infrastructure/
    Persistence/
      AppDbContext.cs
      Repositories/
        OrderRepository.cs
    ExternalServices/
  Presentation/
    Controllers/
      OrdersController.cs
    DTOs/
```

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
- Register dependencies via injection at the composition root (`Program.cs` or equivalent).
- Keep use cases focused: one handler per command/query.
- Validate input at the boundary (Presentation) and business rules in Domain.
