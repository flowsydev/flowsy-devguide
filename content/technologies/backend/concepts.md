# Backend: General Concepts

Base guide for backend APIs and services, independent of specific language or framework.

## HTTP API Design

Start API work with [HTTP API Design](./api-design.md) when the change affects routes, methods, status codes, error responses or OpenAPI contracts. That guide defines the practical API maturity baseline, RFC 9457 Problem Details conventions and boundary error-mapping guidance for HTTP APIs.

- Version APIs when there is a risk of breaking changes.
- Validate input at the boundary with consistent errors.
- Standardize error structure to facilitate observability and support.
- Follow the HTTP API design baseline for resource-oriented contracts, HTTP semantics, status codes and Problem Details.

## Error Handling

Use [Error Handling](./error-handling.md) when a change affects validation flow, domain errors, transaction boundaries, infrastructure failure translation, retries, idempotency or side effects. That guide defines where errors should be detected, how domain rules differ from persistence safeguards and how infrastructure-specific failures stay behind adapters.

- Validate what can be known before changing durable state.
- Keep domain rules in application and domain code.
- Use database constraints and concurrency controls as safeguards, not as the only rule expression.
- Translate provider-specific errors at infrastructure or delivery boundaries.
- Test representative failure paths, including conflicts and side-effect reliability.

## Design Conventions

- Name contracts by functional role (`CreateOrderRequest`, `OrderSummary` or `CrearPedidoRequest`, `ResumenPedido`).
- Avoid generic suffixes that add no semantics.
- Choose the language of domain contracts, commands, events and persistence models according to the project's ubiquitous language and team agreements. English examples in this guide are illustrative, not a requirement for every consuming project.
- Establish consistent naming rules per language:
  - **C#**: `PascalCase` for types and `camelCase` for variables/parameters.
  - **TypeScript/JavaScript**: `PascalCase` types/classes, `camelCase` functions.
  - **Java**: `PascalCase` classes, `camelCase` members.
  - **Go**: exported names in `PascalCase`, internal in `camelCase`.
- Keep the selected domain language consistent inside each Bounded Context. For example, avoid mixing `ShoppingCart`, `orden_despacho` and `PedidoComercial` in the same context unless the boundary and reason are documented. Prefer equivalent concepts such as `ShoppingCart` / `CarritoCompra` or `DispatchOrder` / `OrdenDespacho` when teaching language strategy.

See the language-specific convention guides: [C#](./dotnet/csharp), [Vue 3 and TypeScript](../frontend/vue/conventions).

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
- [Error Handling](./error-handling.md) — validation flow, domain errors, infrastructure error translation and side-effect boundaries.
- [Clean Architecture](./clean-architecture/concepts.md) — code organization by layer.
- [Event-Driven Architecture](./event-driven-architecture/concepts.md) — asynchronous communication between services.
- [Event Sourcing](./event-sourcing/concepts.md) — event-based persistence.
- [Data and Migrations](./data-and-migrations/relational-modeling.md) — relational modeling, keys, integrity and schema change management.
