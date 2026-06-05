# PostgreSQL Conventions

Naming and modeling guidelines for PostgreSQL databases in the Flowsy ecosystem.

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

For primary and foreign key column names, keep lower `snake_case` and follow the project language strategy: English names usually use `id` as a suffix, such as `shopping_cart_id`; Spanish names usually use `id` as a prefix, such as `id_carrito_compra`. See [Data and Migrations: Relational Modeling](../relational-modeling.md#primary-and-foreign-keys).

## Temporal Types

- Prefer `timestamp with time zone` (`timestamptz`) for all audit and event fields.
- Avoid `timestamp without time zone` in data shared between systems or regions.
- Prefer `clock_timestamp()` when a default or routine needs the actual instant when the function is invoked, not the transaction start instant.
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

- When maintaining an event log per entity, use at least:

```sql
event_timestamp   timestamptz NOT NULL DEFAULT clock_timestamp(),
event_type        text        NOT NULL,
payload           jsonb       NOT NULL,
operation_context jsonb       NULL
```

These names are the database equivalent of `EventTimestamp`, `EventType`, `Payload` and `OperationContext`.

Common PostgreSQL date and time functions:

| Function | Description | Use Case |
| --- | --- | --- |
| `clock_timestamp()` | Returns the actual current time at the moment the function is called. | Audit defaults, event timestamps and long-running routines where each call must capture the real invocation instant. |
| `statement_timestamp()` | Returns the time when the current statement started. | Logging where all rows affected by one SQL statement should share the same timestamp. |
| `transaction_timestamp()` / `now()` | Returns the time when the current transaction started. | Business operations that deliberately need one stable timestamp for the whole transaction. |
| `current_date` | Returns the current date according to the session time zone. | Date-only business values where time of day is not relevant. |

## SQL Routines (Functions and Procedures)

Use the aggregate-oriented routine design from [Migration Concepts](../migration-concepts.md#aggregate-based-routine-design). This page only defines the PostgreSQL physical naming style: lower `snake_case`, with schema qualification when the project uses schemas.

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
- See [Database Migrations: Concepts](/technologies/backend/data-and-migrations/migration-concepts) and [Migration Tools and Strategies](/technologies/backend/data-and-migrations/tools-and-strategies) for migration patterns.

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

For routine design and domain-aligned migrations, see [Migrations: Concepts](../migration-concepts.md) and the [Domain-Driven Design](/discovery/domain-driven-design) guide.
