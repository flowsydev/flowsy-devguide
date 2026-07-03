# Backend: General Concepts

Base guide for backend APIs and services, independent of specific language or framework.

Read this page from general design decisions toward implementation details: project design baseline, API boundaries and errors first, naming and example interpretation next, then cross-cutting modeling concerns such as date/time, Value Objects and traceability.

## Project Design Baseline

Start new backend capabilities with the [Backend Project Design Baseline](./project-design-baseline.md) when the change introduces business behavior, modifies domain rules, affects persistence boundaries, creates integration events or changes public contracts.

- Explore the domain before choosing folders, tables or frameworks.
- Design and document relevant behavior, contracts and decisions before implementation.
- Model behavior before storage structures.
- Choose the architecture style after the boundaries and risks are understood.
- Validate the capability end to end according to risk.

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
- Keep the selected domain language consistent inside each Bounded Context. For example, avoid mixing `ShoppingCart`, `pedido_cliente` and `PedidoComercial` in the same context unless the boundary and reason are documented. Prefer equivalent concepts such as `ShoppingCart` / `CarritoCompra` or `PurchaseOrder` / `PedidoCliente` when teaching language strategy.

See the language-specific convention guides: [C#](./dotnet/csharp), [Vue 3 and TypeScript](../frontend/vue/conventions).

### Example Names and Real Artifacts

Names such as `CreateOrderRequest`, `OrderSummary`, `CrearPedidoRequest`, `ResumenPedido`, `ShoppingCart`, `CarritoCompra`, `PurchaseOrder` and `PedidoCliente` are illustrative domain or contract names. They show naming intent and should be adapted to the project's ubiquitous language.

Language and ecosystem terms such as C#, TypeScript, Java, Go, `PascalCase`, `camelCase`, HTTP, OpenAPI and Problem Details refer to real technologies, formats or conventions.

## Date and Time

Treat date and time values as domain concepts, not as interchangeable strings or timestamps. Before choosing a type, classify the value:

| Concept | Meaning | Example |
| --- | --- | --- |
| Global instant | One exact point on the timeline. | `2026-07-01T16:00:00Z` |
| Local date/time | Calendar date and clock time before assigning a zone. | `2026-07-01 10:00` |
| Offset | Difference from UTC at one instant. | `-06:00` |
| Time zone | Identifier with historical and future rules. | `America/Mexico_City` |
| Date only | Calendar date without time of day. | `2026-07-01` |
| Time only | Time of day without date. | `09:00` |
| Duration | Elapsed amount of time. | `PT45M` |

Use this mental model before modeling a field:

- "Did this already happen?" Use a global instant.
- "Must this happen at a local civil time?" Store local date/time plus an explicit time-zone identifier.
- "Is this only a date?" Use a date-only type.
- "Is this only a time of day?" Use a time-only type.
- "Is this elapsed time?" Use a duration type.

Do not treat offsets and time zones as equivalent. `-06:00` is only a UTC offset for one moment; `America/Mexico_City` is a time-zone identifier with rules. If future execution, legal interpretation, branch schedules or user appointments depend on a place, persist the time-zone identifier instead of only the offset.

Technical events that already happened, such as creation, update, deletion, signing, confirmation, sending, processing or exact expiration timestamps, should be represented as global instants. Business schedules, appointments, shifts, deadlines or recurring rules tied to a location should preserve the local date/time and the time zone that gives it meaning.

### Date and Time Strategies

Choose one temporal persistence strategy per project, bounded context or database boundary. The strategy must be documented in project conventions or an ADR before implementation because it affects schema design, API contracts, tests, reports and integrations.

| Strategy | Persistence Meaning | Use When | Typical Storage |
| --- | --- | --- | --- |
| UTC Instant | Store exact instants normalized to UTC. | Audit trails, events, outbox rows, exact expirations, signatures, processing history and distributed integrations. | `timestamptz`, `datetimeoffset` normalized to UTC, `datetime2` with a strict UTC rule, or UTC `timestamp`/`datetime`. |
| Canonical System Time Zone | Store date/time without offset in the system's documented reference time zone. | The system is operationally single-zone and business users, reports, cutoffs and audit reviews reason in one official zone. | `timestamp without time zone`, `datetime2`, `datetime`, plus global configuration such as `default_time_zone_id`. |
| Per-Entity Time Zone | Store local date/time plus the zone that gives it meaning for each row or entity. | Schedules, appointments, facilities, branches, users, contracts or future local rules can belong to different zones. | Local date/time column plus `time_zone_id`. |
| Offset-Preserving | Store or transfer the offset captured by another system or legal event. | The original offset is evidence, or an external source sends a timestamp whose offset must be preserved. | `datetimeoffset`, ISO-8601 with offset, optionally plus `time_zone_id`. |
| Date-Only, Time-Only or Duration | Store a partial temporal concept instead of a date/time. | Birth dates, business dates, opening hours, daily cutoffs, SLAs and elapsed time. | `date`, `time`, duration/interval columns or equivalent language types. |

These strategies can coexist, but not silently inside the same column. A system can use canonical system time for internal operational audit, per-entity time zones for facility schedules and UTC instants for integration events. The boundary must be explicit.

### Canonical System Time Zone

Use the canonical system time-zone strategy only when the project deliberately stores internal date/time values in one reference zone. Do not describe this as "server local time" because that can sound like accidental host configuration. Prefer a documented project concept such as canonical system time, operational time, business time or another term from the project's ubiquitous language.

Example persistence model:

```sql
INSERT INTO global_config (default_time_zone_id)
VALUES ('America/Mexico_City');

-- Example row in a business table:
created_at = TIMESTAMP '2026-07-02 10:30:00'
```

In that model, `created_at` means `2026-07-02 10:30:00` in the configured canonical zone. If an entity has its own zone, the row must carry that zone explicitly and not rely on the global default:

```sql
scheduled_at_local = TIMESTAMP '2026-07-02 10:30:00'
time_zone_id       = 'America/Mexico_City'
```

For exchanges between applications, do not expose canonical-zone persistence values as offset-less technical timestamps. Convert exact instants to UTC or an explicit offset at the boundary, and include the time-zone identifier when the business meaning depends on a real zone:

```json
{
  "createdAt": "2026-07-02T16:30:00Z",
  "scheduledDateTime": "2026-07-02T10:30:00",
  "timeZoneId": "America/Mexico_City"
}
```

Applications should use one authoritative source for the current date and time. Prefer resolving "now" on the server side instead of trusting workstation clocks, browser clocks, mobile-device settings or client applications. For systems where database ordering and audit evidence matter, consider a central clock abstraction backed by the application database or another trusted time source. Keep servers synchronized with NTP, `chrony`, `systemd-timesyncd` or an equivalent infrastructure mechanism.

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
- [Backend Project Design Baseline](./project-design-baseline.md) — project-wide discovery, design, documentation and validation baseline.
- [HTTP API Design](./api-design.md) — API maturity baseline, HTTP semantics and Problem Details.
- [Error Handling](./error-handling.md) — validation flow, domain errors, infrastructure error translation and side-effect boundaries.
- [Clean Architecture](./clean-architecture/concepts.md) — code organization by layer.
- [Event-Driven Architecture](./event-driven-architecture/concepts.md) — asynchronous communication between services.
- [Event Sourcing](./event-sourcing/concepts.md) — event-based persistence.
- [Data and Migrations](./data-and-migrations/relational-modeling.md) — relational modeling, keys, integrity and schema change management.
