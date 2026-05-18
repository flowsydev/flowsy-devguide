# C# Conventions

Coding guidelines for backend projects in C# within the Flowsy ecosystem.

## Naming

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
// Command
public record CreateShoppingCartCommand(Guid UserAccountId)
    : ApplicationRequest<CreateShoppingCartCommandResult>;

public record CreateShoppingCartCommandResult(Guid ShoppingCartId);

// Value Object
public record ShoppingCartSummary(Guid ShoppingCartId, int TotalItems, double TotalProducts, decimal TotalPrice);
```

## Naming of Commands, Queries and State

### Commands

- Name in **imperative** form: `CreateShoppingCart`, `SuspendUserAccount`, `AddItemToCart`.
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
// Example: AddItemToCart and RemoveItemFromCart share OpenShoppingCartState
public interface IOpenShoppingCartStateHandler : IStateHandler<OpenShoppingCartState, Guid>;
```

## Features Folder Structure

See [VSA: Concepts](../technologies/backend/vertical-slice-architecture/concepts.md) for the complete folder structure.

Summary of folders within a submodule:

- `Commands/` — write actions per slice.
- `Queries/` — read actions per slice.
- `Model/` — data structures shared by the module.
- `Infrastructure/` — shared infrastructure services (finders, etc.).

## Minimal APIs

HTTP processing is handled with Minimal API endpoints:

```csharp
public static class CreateShoppingCartEndpoint
{
    public static void Map(RouteGroupBuilder routeGroup)
    {
        routeGroup.MapPost("/sales/shopping-carts", async (
            CreateShoppingCartCommand command,
            IMediator mediator,
            CancellationToken cancellationToken) =>
        {
            var result = await mediator.SendAsync(command, cancellationToken);
            return Results.Ok(result);
        })
        .MapToApiVersion(1)
        .WithSummary("Create a new shopping cart.")
        .Produces<CreateShoppingCartCommandResult>()
        .Produces(StatusCodes.Status400BadRequest);
    }
}
```

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

- Name contracts by functional role: `CreateOrderRequest`, `OrderSummary`.
- Avoid generic suffixes without semantics.
- Validate input in the handler with FluentValidation.
- Include `correlationId`/`requestId` in logs and error responses.

## Conventional Commits

Source control with Git using Conventional Commits format:

| Type | Usage |
| --- | --- |
| `feat` | New functionality |
| `fix` | Bug fix |
| `docs` | Documentation |
| `refactor` | Refactoring without functional change |
| `test` | Tests |
| `chore` | Maintenance tasks |
| `style` | Code formatting |

Example: `feat(sales): add CreateShoppingCart command`

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
public Guid CreatedByUserId { get; private set; }
public Guid? CreatedByApplicationId { get; private set; }
public DateTimeOffset UpdatedAt { get; private set; }
public Guid UpdatedByUserId { get; private set; }
public Guid? UpdatedByApplicationId { get; private set; }
```

Spanish naming can be appropriate when the project deliberately keeps the domain model and code in Spanish. Properties that reference another entity keep `Id` as a prefix in Spanish, matching the relational key guidance:

```csharp
public DateTimeOffset CreadoEn { get; private set; }
public Guid IdUsuarioCreador { get; private set; }
public Guid? IdAplicacionCreadora { get; private set; }
public DateTimeOffset ActualizadoEn { get; private set; }
public Guid IdUsuarioActualizador { get; private set; }
public Guid? IdAplicacionActualizadora { get; private set; }
```

When an entity keeps its own event log, event entries should include at least `EventTimestamp`, `EventType`, `Payload` and `OperationContext`.
