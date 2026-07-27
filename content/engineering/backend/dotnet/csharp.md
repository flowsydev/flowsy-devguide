---
title: C# Conventions
description: Naming, types, contracts and implementation conventions for .NET backend code.
type: profile
audience: Backend C# developers.
canonical: true
canonicalSource: /engineering/backend/
---

# C# Conventions

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

## Example Names and Real Artifacts

This page mixes real C#/.NET artifacts with illustrative project names:

- Real language or framework artifacts include `record`, `class`, `interface`, `DateTimeOffset`, `DateTime`, `DateOnly`, `TimeOnly`, `TimeSpan`, `TimeProvider`, `IOptions<T>`, `IConfiguration`, `ILogger<T>`, ASP.NET Core Minimal APIs and FluentValidation.
- Sample or proposed project names include `CreateShoppingCartCommand`, `CreateShoppingCartCommandResult`, `ShoppingCartSummary`, `EmailService`, `EmailSettings`, `CreateShoppingCartCommandHandler`, `ITimeProvider`, `ITimeProviderFactory`, `DbTimeProvider`, `UserAccountOverview` and `EventTimestamp`.
- Types such as `ApplicationRequest<T>` are representative application abstractions, not required .NET or Flowsy framework types unless a consuming project defines them.

Adapt sample domain names, service names and abstractions to the project's architecture and ubiquitous language.

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

## API Contracts

- Name contracts by functional role: `CreateOrderRequest`, `OrderSummary`, `AddItemToCartRequest`, `CartSummary`.
- Avoid generic suffixes without semantics.
- Validate input in the handler with FluentValidation.
- Include `correlationId`/`requestId` in logs and error responses.

## Dates and Times

For normative temporal policy, prefer [Date and Time](/engineering/cross-cutting/date-and-time).

Choose .NET temporal types from the meaning of the value:

| Intent or Strategy | Preferred Type | Notes |
| --- | --- | --- |
| UTC instant | `DateTimeOffset` or UTC `DateTime` | Use for `CreatedAt`, `UpdatedAt`, `DeletedAt`, `SentAt`, `SignedAt`, `ConfirmedAt`, `ProcessedAt` and exact `ExpiresAt` values. Prefer `DateTimeOffset` at API and integration boundaries; allow UTC `DateTime` internally only under a documented project policy. |
| Canonical system time-zone value | `DateTime` | Use when the project deliberately stores internal values in one configured reference zone, such as `America/Mexico_City`. Treat the value as local to that canonical zone and keep the zone in project configuration. |
| Date/time local to a specific business context | `DateTime` plus time-zone identifier | Use when the value is intentionally local or civil time for an entity, place, user, branch or contract. Store a separate time-zone identifier when the place matters. |
| Offset-preserving value | `DateTimeOffset` | Use when the captured offset from an external source, legal event or integration payload is itself evidence. Remember that the offset is still not a real time-zone identifier. |
| Date only | `DateOnly` | Use for birthdays, business dates and date-only rules. |
| Time only | `TimeOnly` | Use for opening hours, daily cutoffs and recurring local times. |
| Duration | `TimeSpan` | Do not model durations as timestamps. |

Use `DateTimeOffset.UtcNow`, `TimeProvider.System.GetUtcNow()` or the project's authoritative clock abstraction for backend-generated technical timestamps. Prefer injecting `TimeProvider` in modern .NET code when logic must be testable. Avoid `DateTimeOffset.Now` and `DateTime.Now` in backend APIs, workers and containers unless the domain explicitly needs the machine's local time.

For application code, define one authoritative source of "now". In simple services this can be the injected .NET `TimeProvider`; in systems where audit ordering must match database writes, use a project-level abstraction such as `ITimeProvider` whose implementation resolves the current value from the application server, database server or another trusted source. For example, an `ITimeProviderFactory` can create a `DbTimeProvider` configured with the application's database connection options. This keeps domain logic from depending on developer laptops, browser clocks or client-device settings.

When the project uses a canonical system time-zone strategy, the clock abstraction should expose both the exact instant and the canonical local value, or expose clearly named methods so callers cannot confuse them:

```csharp
var nowInstant = timeProvider.GetCurrentInstant();
var nowInSystemTime = timeProvider.GetCurrentSystemDateTime();
var systemTimeZoneId = timeProvider.GetDefaultTimeZoneId();
```

Names such as `ITimeProvider`, `DbTimeProvider`, `GetCurrentInstant` and `GetCurrentSystemDateTime` are proposed project abstractions, not .NET framework APIs. Adapt them to the project's ubiquitous language.

Remember these limits:

- `DateTimeOffset` stores a date/time plus offset; it does not store `America/Mexico_City`, `Europe/Madrid` or another real time zone.
- `DateTimeOffset.ToUniversalTime()` uses the offset already carried by the value; it does not consult the machine time zone.
- `DateTime.Kind` can be `Utc`, `Local` or `Unspecified`. Treat `Unspecified` carefully because conversions can behave differently across development machines, CI, containers and production.
- Databases and providers often do not preserve `DateTime.Kind`; values may be read back as `Unspecified`.

Prefer explicit construction and parsing:

```csharp
var creationInstant = DateTimeOffset.UtcNow;
var creationInstantUtc = DateTime.UtcNow;
var creationInSystemTime = new DateTime(2026, 7, 2, 10, 30, 0, DateTimeKind.Unspecified);
var defaultTimeZoneId = "America/Mexico_City";
var scheduledLocalTime = new DateTime(2026, 7, 1, 10, 0, 0, DateTimeKind.Unspecified);
var scheduledTimeZoneId = "America/Mexico_City";

var exactInstant = new DateTimeOffset(2026, 7, 1, 16, 0, 0, TimeSpan.Zero);
var localWithOffset = new DateTimeOffset(2026, 7, 1, 10, 0, 0, TimeSpan.FromHours(-6));
```

Avoid parsing strings without offset when the field represents a global instant. Prefer `2026-07-01T16:00:00Z` or `2026-07-01T10:00:00-06:00`; avoid `2026-07-01T10:00:00` for exact instants.

## Audit Properties

For normative audit and validity policy, prefer [Auditing and Validity](/engineering/cross-cutting/auditing-and-validity).

Auditable entities should expose the audit properties required by the project and domain. These examples are recommendations to evaluate, not mandatory attributes for every aggregate. Choose the actor fields according to requirements analysis and what can actually create or change the aggregate: a user, application, service account, integration, device, tenant or background process.

Choose one existence-state strategy per entity:

| Alternative | English Property | Spanish Property | Type | Notes |
| --- | --- | --- | --- | --- |
| Boolean flag | `Active` | `Activo` | `bool` | Use for simple active/inactive behavior. It can often be calculated from `ActiveFrom` and `ActiveUntil`. |
| Explicit status | `RecordStatus` | `EstadoRegistro` | `enum` | Use when the entity distinguishes states such as `Active`, `SoftDeleted` and `HardDeleted`, or their Spanish equivalents `Activo`, `EliminadoLogico` and `EliminadoFisico`. |

Common English examples:

These examples use `DateTimeOffset` because they model UTC or offset-aware instants. If the project uses UTC `DateTime` or canonical system time, adapt the temporal types and names according to that documented strategy.

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

For normative public-identifier policy, prefer [Public Identifiers](/engineering/cross-cutting/identifiers).

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

## Framework Services

### IOptions\<T\>

Avoid primitive parameters or `IConfiguration` injected directly into constructors. Use the `IOptions<T>` pattern:

```csharp
// Correct
public class EmailService(IOptions<EmailSettings> options) { ... }

// Avoid
public class EmailService(string smtpHost, int port) { ... }
```

### ILogger\<T\>

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

## Architecture and API Implementation References

Keep this page focused on C# naming and language-level conventions. Use the specialized backend guides for implementation structure:

- [VSA: Concepts](/engineering/backend/architecture/vertical-slice-architecture) covers feature folders, slice boundaries and module structure.
- [C# with Minimal APIs](/engineering/backend/dotnet/minimal-apis/) covers endpoint mapping, mediator usage, validation and complete examples.
- [HTTP API Design](/engineering/backend/api/http-api-design) covers routes, status codes, Problem Details and OpenAPI conventions.

## Source Control Reference

Use [Source Control with Git](/conventions/source-control/git.md) for branch, pull request, changelog and Conventional Commits guidance. Keep commit examples aligned with the selected project language and bounded context.
