# Lenguaje C#

Coding guidelines for backend projects in C# within the Flowsy ecosystem.

Business names in C# should follow the ubiquitous language chosen for the project or Bounded Context. Keep technical terms such as `record`, `class`, `interface`, `DTO`, `Minimal API`, `State`, `Handler` and framework names in English. For example, use `CrearPedidoCommandHandler` instead of `CrearPedidoManejadorComando`.

## Naming

For Spanish identifiers, omit articles and prepositions when the meaning remains clear. Prefer `PedidoCliente`, `AsignarDireccionEnvioCommand` and `IdPedidoCliente` over `PedidoDeCliente`, `AsignarDireccionDeEnvioCommand` and `IdPedidoDeCliente`. Keep articles and prepositions only when they are part of the official business term or avoid ambiguity, such as `PuestaEnOperacion` or `PagoAProveedor`.

| Element | Convention | Example |
| --- | --- | --- |
| Types, classes, records | `PascalCase` | `CreateShoppingCartCommand` |
| Interfaces | `IPascalCase` | `IShoppingCartFinder` |
| Methods and properties | `PascalCase` | `HandleAsync`, `ShoppingCartId` |
| Variables and parameters | `camelCase` | `shoppingCartId`, `cancellationToken` |
| Private fields | `_camelCase` | `_connectionHub`, `_logger` |
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

## Architecture and API Implementation References

Keep this page focused on C# naming and language-level conventions. Use the specialized backend guides for implementation structure:

- [VSA: Concepts](../vertical-slice-architecture/concepts.md) covers feature folders, slice boundaries and module structure.
- [C# with Minimal APIs](./csharp-minimal-apis.md) covers endpoint mapping, mediator usage, validation and complete examples.
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

Choose one existence-state strategy per entity:

| Alternative | English Property | Spanish Property | Type | Notes |
| --- | --- | --- | --- | --- |
| Boolean flag | `Active` | `Activo` | `bool` | Use for simple active/inactive behavior. It can often be calculated from `ActiveFrom` and `ActiveUntil`. |
| Explicit status | `RecordStatus` | `EstadoRegistro` | `enum` | Use when the entity distinguishes states such as `Active`, `SoftDeleted` and `HardDeleted`, or their Spanish equivalents `Activo`, `EliminadoLogico` and `EliminadoFisico`. |

Common English examples:

```csharp
public bool Active { get; private set; }
// or: public RecordStatus RecordStatus { get; private set; } = RecordStatus.Active;
public DateTimeOffset CreatedAt { get; private set; }
public Guid? CreatedBy { get; private set; }
public DateTimeOffset UpdatedAt { get; private set; }
public Guid? UpdatedBy { get; private set; }
public DateTimeOffset? ActiveFrom { get; private set; }
public DateTimeOffset? ActiveUntil { get; private set; }
```

Common Spanish examples:

```csharp
public bool Activo { get; private set; }
// o: public EstadoRegistro EstadoRegistro { get; private set; } = EstadoRegistro.Activo;
public DateTimeOffset Creado { get; private set; }
public Guid? IdUsuarioCreacion { get; private set; }
public DateTimeOffset Modificado { get; private set; }
public Guid? IdAplicacionModificacion { get; private set; }
public DateTimeOffset? ActivoDesde { get; private set; }
public DateTimeOffset? ActivoHasta { get; private set; }
```

Choose the data type for `CreatedBy`, `UpdatedBy`, `CreadoPor`, `Id*Creacion` and `Id*Modificacion` according to each project's requirements. A `Guid` may be appropriate for user identifiers in some systems, while others may need an integer key, a service account identifier, an external identity-provider subject or a composite actor model.

Use active-state properties such as `ActiveFrom` and `ActiveUntil` only when the entity needs to record when the record itself is active. Use domain-specific names for business validity periods, such as `AppointmentValidFrom` or `AssignmentValidUntil`.

For business validity, use `Valid` / `Vigente` when a boolean is enough, or `ValidityStatus` / `EstadoVigencia` when the domain recognizes states such as `Valid`, `Revoked` and `Expired`. `Valid` can often be calculated from `ValidFrom` and `ValidUntil`.

| Purpose | English Property | Spanish Property |
| --- | --- | --- |
| Validity start | `ValidFrom` | `VigenteDesde` |
| Validity end | `ValidUntil` | `VigenteHasta` |

Do not add every audit field mechanically to every aggregate. Apply the attributes that are convenient for each entity and add other project-specific attributes when analysis and design justify them.

## Public Identifiers

Do not expose numeric auto-increment primary keys in external API contracts, frontend models, integration events or URLs. Add a public identifier to the domain and persistence model when an entity must cross backend boundaries:

```csharp
public long Id { get; private set; }
public Guid PublicId { get; private set; }
```

Use UUID v4 when random identifiers are enough. Use UUID v7 when ordered identifiers better fit database locality, event ordering or observability requirements.

For DTOs and read models, create explicit public and internal variants:

```csharp
public record UserAccountOverview(Guid PublicId, string DisplayName, string Email);

public record UserAccountOverviewInternal(
    long Id,
    Guid PublicId,
    string DisplayName,
    string Email);
```

`Internal` / `Interno` is the recommended suffix for models used inside backend handlers, persistence code or trusted services. `Private` / `Privado` is a valid alternative when the model name should emphasize privacy classification.

When an entity keeps its own event log, event entries should include at least `EventTimestamp`, `EventType`, `Payload` and `OperationContext`.
