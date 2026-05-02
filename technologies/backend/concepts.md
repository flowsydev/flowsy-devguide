# Backend: General Concepts

Base guide for backend APIs and services, independent of specific language or framework.

## HTTP API Design

Start API work with [HTTP API Design](./api-design.md) when the change affects routes, methods, status codes, error responses or OpenAPI contracts. That guide defines the practical API maturity baseline, RFC 9457 Problem Details conventions and C# exception-handler mapping recommended for HTTP APIs.

- Version APIs when there is a risk of breaking changes.
- Validate input at the boundary with consistent errors.
- Standardize error structure to facilitate observability and support.
- Follow the HTTP API design baseline for resource-oriented contracts, HTTP semantics, status codes and Problem Details.

## Design Conventions

- Name contracts by functional role (`CreateOrderRequest`, `OrderSummary`).
- Avoid generic suffixes that add no semantics.
- Establish consistent naming rules per language:
  - **C#**: `PascalCase` for types and `camelCase` for variables/parameters.
  - **TypeScript/JavaScript**: `PascalCase` types/classes, `camelCase` functions.
  - **Java**: `PascalCase` classes, `camelCase` members.
  - **Go**: exported names in `PascalCase`, internal in `camelCase`.

See the language-specific convention guides: [C#](../../conventions/csharp.md), [TypeScript](../../conventions/typescript.md).

## Date and Time

- Persist instants in UTC.
- Include timezone in external contracts (ISO-8601 offset).
- Avoid ambiguous temporal types without timezone.

## Value Objects

- Model concepts without identity as Value Objects.
- Encapsulate validation, parsing and normalization in the object itself.
- Avoid propagating primitive strings when the domain requires invariants.

See [DDD principles](../../discovery/domain-driven-design.md) for more context on Value Objects.

## Traceability

- Include `correlationId`/`requestId` in logs and error responses.
- Log relevant business events with operational context.

## Related Guides

- [Vertical Slice Architecture](./vertical-slice-architecture/concepts.md) — code organization by feature.
- [HTTP API Design](./api-design.md) — API maturity baseline, HTTP semantics and Problem Details.
- [Clean Architecture](./clean-architecture/concepts.md) — code organization by layer.
- [Event-Driven Architecture](./event-driven-architecture/concepts.md) — asynchronous communication between services.
- [Event Sourcing](./event-sourcing/concepts.md) — event-based persistence.
- [Database Migrations](./database-migrations/concepts.md) — schema change management.
