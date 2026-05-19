# C# Conventions

Coding guidelines for backend projects in C# within the Flowsy ecosystem.

Business names in C# should follow the ubiquitous language chosen for the project or Bounded Context. Keep technical terms such as `record`, `class`, `interface`, `DTO`, `Minimal API`, `State`, `Handler` and framework names in English. For example, use `CrearPedidoCommandHandler` instead of `CrearPedidoManejadorComando`.

## Naming

For Spanish identifiers, omit articles and prepositions when the meaning remains clear. Prefer `OrdenDespacho`, `AsignarTerminalDespachoCommand` and `IdOrdenDespacho` over `OrdenDeDespacho`, `AsignarTerminalDeDespachoCommand` and `IdOrdenDeDespacho`. Keep articles and prepositions only when they are part of the official business term or avoid ambiguity, such as `PuestaEnOperacion` or `PagoAProveedor`.

| Element | Convention | Example |
| --- | --- | --- |
| Types, classes, records | `PascalCase` | `CreateShoppingCartCommand` |
| Interfaces | `IPascalCase` | `IShoppingCartFinder` |
| Methods and properties | `PascalCase` | `HandleAsync`, `ShoppingCartId` |
| Variables and parameters | `camelCase` | `shoppingCartId`, `cancellationToken` |
| Private fields | `_camelCase` | `_stateHandler`, `_connectionHub` |
| Constants | `PascalCase` | `MaxCartItems` |

## `record` Types

Use `record` instead of `class` for:

- Commands and results: `record CreateShoppingCartCommand(Guid UserAccountId)`.
- Queries and query results.
- Value Objects and read models.
- Request/response DTOs in endpoints.

`record` types are immutable by default, favor domain expressiveness and facilitate value comparison.

```csharp
public record CreateShoppingCartCommand(Guid UserAccountId)
    : ApplicationRequest<CreateShoppingCartCommandResult>;

public record CreateShoppingCartCommandResult(Guid ShoppingCartId);

public record ShoppingCartSummary(Guid ShoppingCartId, int TotalItems, double TotalProducts, decimal TotalPrice);
```

## Naming of Commands, Queries and State

### Commands

- Name in **imperative** form using the selected business language: `CreateShoppingCart`, `SuspendUserAccount`, `AddItemToCart`.
- Files:
  - `[ActionName]Command.cs` — `record Command`, `record CommandResult`, `class CommandHandler`.
  - `[ActionName]CommandValidator.cs` — validation with FluentValidation.
  - `[ActionName]Endpoint.cs` — Minimal API endpoint.
  - `[ActionName]State.cs` — `class State`, `interface IStateHandler`, `class StateHandler`.

### Queries

- Name as **report or screen titles**: `AbandonedCarts`, `SuspendedUsers`.
- Files:
  - `[ActionName]Query.cs` — `record Query`, `record QueryResult`, `class QueryHandler`.
  - `[ActionName]QueryValidator.cs` — optional.
  - `[ActionName]Endpoint.cs` — Minimal API endpoint.

### State

- The `State` encapsulates the entities needed to execute a command.
- When multiple actions operate on the same aggregate, they share a common `State`:

```csharp
// AddItemToCart and RemoveItemFromCart share OpenShoppingCartState
public interface IOpenShoppingCartStateHandler : IStateHandler<OpenShoppingCartState, Guid>;
```

## Architecture and API Implementation References

Keep this page focused on C# naming and language-level conventions. Use the specialized backend guides for implementation structure:

- [VSA: Concepts](../vertical-slice-architecture/concepts.md) covers feature folders, slice boundaries and module structure.
- [C# with Minimal APIs](../vertical-slice-architecture/csharp-minimal-apis.md) covers endpoint mapping, mediator usage, validation and complete examples.
- [HTTP API Design](../api-design.md) covers routes, status codes, Problem Details and OpenAPI conventions.

## IOptions\<T\>

Avoid primitive parameters or `IConfiguration` injected directly into constructors. Use the `IOptions<T>` pattern:

```csharp
// Correct
public class EmailService(IOptions<EmailSettings> options) { ... }

// Avoid
public class EmailService(string smtpHost, int port) { ... }
```

## ILogger\<T\>

Log all relevant operations:

```csharp
public class CreateShoppingCartCommandHandler
{
    private readonly ILogger<CreateShoppingCartCommandHandler> _logger;

    public async Task<CreateShoppingCartCommandResult> HandleAsync(...)
    {
        _logger.LogInformation("Creating cart for user {UserId}", request.UserAccountId);
        // ...
    }
}
```

## API Contracts

- Name contracts by functional role: `CreateOrderRequest`, `OrderSummary`, `AddItemToCartRequest`, `CartSummary`.
- Avoid generic suffixes without semantics.
- Validate input in the handler with FluentValidation.
- Include `correlationId`/`requestId` in logs and error responses.

## Source Control Reference

Use [Source Control with Git](/conventions/source-control/git.md) for branch, pull request, changelog and Conventional Commits guidance. Keep commit examples aligned with the selected project language and bounded context.

## Dates and Times

- Persist instants in UTC.
- Use `DateTimeOffset` for auditable timestamps.
- Include timezone in external contracts (ISO-8601 offset).
- Avoid `DateTime` without timezone in shared data.

## Audit Properties

Auditable entities should expose the audit properties required by the project and domain. These examples are recommendations to evaluate, not mandatory attributes for every aggregate. Choose the actor fields according to requirements analysis and what can actually create or change the aggregate: a user, application, service account, integration, device, tenant or background process.

Common English examples:

```csharp
public DateTimeOffset CreatedAt { get; private set; }
public Guid? CreatedBy { get; private set; }
public DateTimeOffset UpdatedAt { get; private set; }
public Guid? UpdatedBy { get; private set; }
public string RecordStatus { get; private set; } = "Active";
public DateTimeOffset? ActiveFrom { get; private set; }
public DateTimeOffset? ActiveUntil { get; private set; }
```

Choose the data type for `CreatedBy` and `UpdatedBy` according to each project's requirements. A `Guid` may be appropriate for user identifiers in some systems, while others may need an integer key, a service account identifier, an external identity-provider subject or a composite actor model.

Use active-state properties such as `ActiveFrom` and `ActiveUntil` only when the entity needs to record when the record itself is active. Use domain-specific names for business validity periods, such as `AppointmentValidFrom` or `AssignmentValidUntil`.

Do not add every audit field mechanically to every aggregate. Apply the attributes that are convenient for each entity and add other project-specific attributes when analysis and design justify them.

When an entity keeps its own event log, event entries should include at least `EventTimestamp`, `EventType`, `Payload` and `OperationContext`.
