# Backend: General Concepts

Base guide for backend APIs and services, independent of specific language or framework.

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

## API Contracts

- Version APIs when there is a risk of breaking changes.
- Validate input at the boundary (controller/handler) with consistent errors.
- Standardize error structure to facilitate observability and support.

## Traceability

- Include `correlationId`/`requestId` in logs and error responses.
- Log relevant business events with operational context.

## Related Guides

- [Vertical Slice Architecture](./vertical-slice-architecture/concepts.md) — code organization by feature.
- [Clean Architecture](./clean-architecture/concepts.md) — code organization by layer.
- [Event-Driven Architecture](./event-driven-architecture/concepts.md) — asynchronous communication between services.
- [Event Sourcing](./event-sourcing/concepts.md) — event-based persistence.
- [Database Migrations](./database-migrations/concepts.md) — schema change management.
