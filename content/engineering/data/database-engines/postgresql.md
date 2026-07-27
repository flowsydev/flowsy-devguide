---
title: PostgreSQL Conventions
description: Naming and modeling guidelines for PostgreSQL in the Flowsy ecosystem.
type: profile
audience: People designing or operating PostgreSQL schemas.
canonical: true
canonicalSource: /engineering/data/relational-modeling
---

# PostgreSQL Conventions

Naming and modeling guidelines for PostgreSQL databases in the Flowsy ecosystem.

PostgreSQL object names in this page are examples unless explicitly described as PostgreSQL syntax or built-in behavior. Types and functions such as `timestamptz`, `timestamp without time zone`, `jsonb`, `clock_timestamp()`, `statement_timestamp()` and `transaction_timestamp()` are real PostgreSQL artifacts.

## General Naming

Use the naming convention adopted by the target database community. For PostgreSQL, use lower `snake_case` consistently and explicitly for all database objects:

| Object | Convention | Example |
| --- | --- | --- |
| Databases | lower `snake_case` | `ecommerce` |
| Schemas | lower `snake_case` | `sales`, `identity` |
| Tables | `snake_case` | `shopping_cart`, `user_account` |
| Columns | `snake_case` | `shopping_cart_id`, `created_at` |
| Indexes | `ix_[table]_[columns]` | `ix_shopping_cart_user_account_id` |
| FK constraints | `fk_[table]_[reference]` | `fk_cart_item_shopping_cart` |
| CHECK constraints | `ck_[table]_[description]` | `ck_cart_item_quantity_positive` |
| Enumerated types | `snake_case` | `record_status` |

For primary and foreign key column names, keep lower `snake_case` and follow the project language strategy: English names usually use `id` as a suffix, such as `shopping_cart_id`; Spanish names usually use `id` as a prefix, such as `id_carrito_compra`. See [Data and Migrations: Relational Modeling](../relational-modeling#primary-and-foreign-keys).

## Temporal Types

### Storage Semantics

- Prefer `timestamp with time zone` (`timestamptz`) for audit fields, event fields and values that represent global instants.
- Understand that `timestamptz` does not store the original time zone or offset. PostgreSQL normalizes the instant and renders it according to the session time zone.
- Use `timestamp without time zone` for canonical system time-zone values and local business date/time values that should not be interpreted as UTC by themselves.
- For scheduled events tied to a place, store the local date/time and a separate time-zone identifier, such as `scheduled_at_local timestamp without time zone` plus `time_zone_id text`.
- Avoid `time with time zone` for business schedules unless the domain has a rare, explicit reason. It often creates more confusion than value because it carries an offset without a date or real time-zone rules.

| Strategy | PostgreSQL Type | Example |
| --- | --- | --- |
| UTC instant | `timestamptz` | `created_at timestamptz NOT NULL DEFAULT clock_timestamp()` |
| Canonical system time zone | `timestamp without time zone` plus global zone configuration | `created_at timestamp without time zone NOT NULL` and `global_config.default_time_zone_id = 'America/Mexico_City'` |
| Per-entity time zone | `timestamp without time zone` plus row zone | `scheduled_at_local timestamp without time zone NOT NULL`, `time_zone_id text NOT NULL` |
| Date-only / time-only | `date`, `time without time zone` | `business_date date NOT NULL`, `cutoff_time time NOT NULL` |

### Language and Provider Mapping

PostgreSQL temporal types do not map to every language in the same way. Treat the table below as a starting point and verify the exact behavior of the driver, ORM and version used by the project.

| PostgreSQL Type | Meaning | .NET / Npgsql | Java / JDBC | Python / Psycopg | Node.js / node-postgres |
| --- | --- | --- | --- | --- | --- |
| `timestamptz` | Exact instant. PostgreSQL normalizes it and does not preserve the original zone or offset. | UTC `DateTime`, `DateTimeOffset` with UTC offset, or NodaTime `Instant`. | `OffsetDateTime` or `Instant`-oriented application type. | Time-zone-aware `datetime`. | JavaScript `Date` for instants; watch precision and process time-zone assumptions. |
| `timestamp without time zone` | Date/time without offset. Use for canonical system time or local values. | `DateTime`, usually `Unspecified` for local/canonical values. | `LocalDateTime`. | Naive `datetime`. | Prefer string/custom parser for canonical or local values; `Date` represents an instant and can reinterpret the value. |
| `date` | Calendar date only. | `DateOnly`. | `LocalDate`. | `date`. | String or date-only library type. |
| `time without time zone` | Time of day only. | `TimeOnly` or `TimeSpan` according to the provider. | `LocalTime`. | `time`. | String or time-only library type. |
| `interval` | Duration or calendar-aware amount of time. | `TimeSpan` for simple durations; NodaTime types for richer semantics. | `Duration`, `Period` or framework-specific type according to meaning. | `timedelta` for simple durations. | String or duration library type. |

PostgreSQL `timestamptz` is not a complete equivalent of .NET `DateTimeOffset`. With modern Npgsql, UTC `DateTime` values map naturally to `timestamptz`, local or unspecified `DateTime` values map naturally to `timestamp without time zone`, and `DateTimeOffset` values written to `timestamptz` should represent UTC offsets.

ORMs such as Entity Framework Core, Hibernate, SQLAlchemy, Prisma and Drizzle usually build on the database driver behavior. Use converters, type handlers or explicit parsers when the default mapping loses the project's temporal meaning. Keep provider and ORM behavior covered by integration tests when temporal mapping matters.

### Audit and Domain Columns

- Audit columns should follow the project and domain audit model. Choose actor columns according to what can create or update records: users, applications, service accounts, integrations, devices, tenants or background processes.

Common English examples:

```sql
created_at         TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
created_by         UUID        NULL,
updated_at         TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
updated_by         UUID        NULL,
active             BOOLEAN     NOT NULL DEFAULT TRUE,
-- or: record_status TEXT NOT NULL DEFAULT 'Active',
active_from        TIMESTAMPTZ NULL,
active_until       TIMESTAMPTZ NULL,
public_id          UUID        NOT NULL
```

Spanish names can be appropriate when the project deliberately keeps the data model in Spanish:

```sql
creado         TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
creado_por     UUID        NULL,
modificado     TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
modificado_por UUID        NULL,
activo         BOOLEAN     NOT NULL DEFAULT TRUE,
-- o: estado_registro TEXT NOT NULL DEFAULT 'Activo',
activo_desde TIMESTAMPTZ NULL,
activo_hasta TIMESTAMPTZ NULL,
id_publico   UUID        NOT NULL
```

These names are examples. Align them with the entity properties, database engine naming convention and project language strategy. Determine the data types for `created_by`, `updated_by`, `creado_por` and `modificado_por` according to each project's actor model and identity requirements.
Use `active` / `activo` for simple existence state, or `record_status` / `estado_registro` when the record needs states such as `Active`, `SoftDeleted` and `HardDeleted`. Active-state columns such as `active_from`, `active_until`, `activo_desde` and `activo_hasta` are optional and should be added only when analysis and design show that the entity needs to record when the record itself is active.

Use `valid` / `vigente` for simple business validity, or `validity_status` / `estado_vigencia` when the domain needs states such as `Valid`, `Revoked` and `Expired`. Use domain-specific validity names when they add clarity, such as `assignment_valid_from` or `asignacion_vigente_desde`.

Do not expose numeric auto-increment primary keys outside backend boundaries. Add `public_id` / `id_publico` with UUID v4 or v7 when records must be referenced from APIs, frontend models or integration contracts.

### Entity Event Logs

When maintaining an event log per entity, use at least:

```sql
event_timestamp   timestamptz NOT NULL DEFAULT clock_timestamp(),
event_type        text        NOT NULL,
payload           jsonb       NOT NULL,
operation_context jsonb       NULL
```

These names are the database equivalent of `EventTimestamp`, `EventType`, `Payload` and `OperationContext`.

### Date and Time Functions

Common PostgreSQL date and time functions:

Prefer `clock_timestamp()` when a default or routine needs the actual instant when the function is invoked, not the transaction start instant.

| Function | Description | Use Case |
| --- | --- | --- |
| `clock_timestamp()` | Returns the actual current time at the moment the function is called. | Audit defaults, event timestamps and long-running routines where each call must capture the real invocation instant. |
| `statement_timestamp()` | Returns the time when the current statement started. | Logging where all rows affected by one SQL statement should share the same timestamp. |
| `transaction_timestamp()` / `now()` | Returns the time when the current transaction started. | Business operations that deliberately need one stable timestamp for the whole transaction. |
| `current_date` | Returns the current date according to the session time zone. | Date-only business values where time of day is not relevant. |

## SQL Routines (Functions and Procedures)

Use the aggregate-oriented routine design from [Migration Concepts](/engineering/data/migrations/concepts#aggregate-based-routine-design). This page only defines the PostgreSQL physical naming style: lower `snake_case`, with schema qualification when the project uses schemas.

```text
[schema].[aggregate_prefix]_[operation_type]_[detail]
```

Examples:

- `sales.shopping_cart_create`
- `sales.shopping_cart_get_open_by_user_account_id`
- `sales.shopping_cart_modify_add_item`

## Views

```text
[schema].[descriptive_view_name]
```

Views should follow the same naming convention as tables. Use descriptive names and avoid routine-style aggregate prefixes for the database object name.

Example: `sales.abandoned_shopping_cart`

## Change Control

- Manage PostgreSQL schema changes with an explicit migration strategy.
- Keep schema changes, routines, views, constraints and indexes under source control.
- Use the selected migration tool's naming and folder rules instead of defining tool-specific file formats in PostgreSQL conventions.
- See [Database Migrations: Concepts](/engineering/data/migrations/concepts) and [Migration Tools and Strategies](/engineering/data/migrations/tools-and-strategies) for migration patterns.

## Value Object Modeling

- Use atomic columns for simple data with frequent queries.
- Use `jsonb` for composite structures when it provides real flexibility.
- Define explicit constraints in the schema:

```sql
ALTER TABLE shopping_cart_item
    ADD CONSTRAINT ck_cart_item_quantity_positive CHECK (quantity > 0);
```

## Integrity and Performance

- Define explicit primary keys (`uuid` or `bigint`) and foreign keys, using the agreed language-specific `id` prefix or suffix consistently.
- Index based on actual query patterns, not preventively.
- Review execution plans (`EXPLAIN ANALYZE`) for critical queries.
- Use `NOT NULL` on columns required by the domain.

## Cross Reference

For routine design and domain-aligned migrations, see [Migrations: Concepts](/engineering/data/migrations/concepts) and the [Domain-Driven Design](/foundations/domain-modeling/domain-driven-design-reference) guide.
