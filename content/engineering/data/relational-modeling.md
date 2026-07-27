---
title: Relational Modeling
description: Business-aligned relational modeling, keys, integrity and schema design.
type: guide
audience: Data, backend and architecture people.
canonical: true
---

# Data and Migrations: Relational Modeling

Base guide for relational modeling, schema conventions, keys, integrity and operational traceability. It is part of the backend Data and Migrations section and applies to any SQL database engine.

For persistence, constraints, queries and concurrency validation, see [Relational Database Testing](/quality/systems/relational-databases). For schema evolution validation, see [Database Migration Testing](/quality/systems/database-migrations).

Read this guide from naming and identity decisions toward operational concerns: object names, keys, public identifiers, date/time semantics, audit columns, Value Objects, migration strategy and engine-specific conventions.

## Naming

Use a consistent and explicit convention for:

- Databases and schemas.
- Tables.
- Columns.
- Indexes.
- Constraints.
- Enumerated types.
- Sequences and identity objects.
- Views and materialized views.
- Routines, such as stored procedures and functions.
- Routine parameters and return objects.
- Triggers, events and scheduled jobs when the database engine supports them.

When the data model uses Spanish business names, omit articles and prepositions in database identifiers when the meaning remains clear. Prefer `pedido_cliente`, `id_pedido_cliente`, `asignacion_direccion_envio` and `ix_pedido_cliente_direccion_envio_id` over `pedido_de_cliente`, `id_pedido_de_cliente` or `asignacion_de_direccion_de_envio`.

Keep articles and prepositions in user-facing labels, reports and documentation text: "Pedido de cliente", "Asignación de dirección de envío". Preserve them in identifiers only when they are part of an official term or avoid ambiguity, such as `puesta_en_operacion` or `pago_a_proveedor`.

## Example Names and Real Artifacts

Schema names in examples such as `shopping_cart`, `pedido_cliente`, `public_id`, `id_publico`, `created_at`, `creado`, `scheduled_at_local` and `time_zone_id` are illustrative conventions. Adapt them to the project domain and database engine naming style.

Database types and functions such as `BIGINT`, `UUID`, `TIMESTAMPTZ`, `BOOLEAN`, `BIT`, `timestamp without time zone`, `clock_timestamp()`, UUID v4 and UUID v7 refer to real database concepts or common identifier strategies. Engine-specific pages explain how each engine maps those concepts.

## Primary and Foreign Keys

Primary and foreign key columns must respect the case style of the target database engine and the project language strategy. Use the position of `id` consistently:

| Case Style | English Naming | Spanish Naming |
| --- | --- | --- |
| lower `snake_case` | `{table}_id`, for example `shopping_cart_id` | `id_{tabla}`, for example `id_carrito_compra` |
| `PascalCase` | `{Table}Id`, for example `ShoppingCartId` | `Id{Tabla}`, for example `IdCarritoCompra` |

Use the shorter `id` / `Id` only when the table or ORM convention clearly scopes the identifier and the team has agreed to that style. For SQL-first schemas, prefer the explicit table-qualified form because it travels better across joins, views, reports and logs.

For foreign keys:

- If there is only one relationship to another table, use the same column name as the referenced primary key unless another name adds meaningful clarity.
- If there are two or more relationships to the same table, use descriptive column names that explain the relationship intent while preserving the language-specific `id` position.

Examples:

| Scenario | English Example | Spanish Example |
| --- | --- | --- |
| Single relationship to `user_account` / `cuenta_usuario` | `user_account_id` references `user_account.user_account_id` | `id_cuenta_usuario` references `cuenta_usuario.id_cuenta_usuario` |
| Two relationships to the same user account table | `requested_by_user_account_id`, `approved_by_user_account_id` | `id_cuenta_usuario_solicitante`, `id_cuenta_usuario_aprobadora` |
| Two address relationships | `billing_address_id`, `shipping_address_id` | `id_direccion_facturacion`, `id_direccion_envio` |
| Parent/child hierarchy in one table | `parent_category_id` | `id_categoria_padre` |

Constraint names should follow the target database engine convention, such as `fk_shopping_cart_user_account`, `FK_ShoppingCart_UserAccount`, `fk_carrito_compra_cuenta_usuario` or `FK_CarritoCompra_CuentaUsuario`.

## Audit and Schema Integrity

For normative guidance on audit, existence and validity, prefer [Auditing and Validity](/engineering/cross-cutting/auditing-and-validity). The sections below keep complementary SQL examples.

Table designs should include the keys, constraints and audit fields required by the domain. The fields below are examples proposed by the guide; each team must design the final attributes and columns from the project's requirements, threat model, compliance needs and actor model. A human user, application, integration, device or automated process may be the source of a change.

English naming keeps `id` as a suffix for attributes and columns that reference another entity:

```sql
-- Primary key
shopping_cart_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
public_id        UUID   NOT NULL,

-- Audit columns
created_at        TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
created_by        UUID        NULL,
updated_at        TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
updated_by        UUID        NULL,
active            BOOLEAN     NOT NULL DEFAULT TRUE,
-- or: record_status TEXT NOT NULL DEFAULT 'Active',
active_from       TIMESTAMPTZ NULL,
active_until      TIMESTAMPTZ NULL,

-- Constraints
CONSTRAINT uq_shopping_cart_public_id UNIQUE (public_id)
-- If record_status is used:
-- CONSTRAINT ck_shopping_cart_record_status
--     CHECK (record_status IN ('Active', 'SoftDeleted', 'HardDeleted'))
```

Spanish naming keeps `id` as a prefix for attributes and columns that reference another entity:

```sql
id_carrito_compra BIGINT      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
id_publico        UUID        NOT NULL,
creado            TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
creado_por        UUID        NULL,
modificado        TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
modificado_por    UUID        NULL,
activo            BOOLEAN     NOT NULL DEFAULT TRUE,
-- o: estado_registro TEXT NOT NULL DEFAULT 'Activo',
activo_desde      TIMESTAMPTZ NULL,
activo_hasta      TIMESTAMPTZ NULL,

CONSTRAINT uq_carrito_compra_id_publico UNIQUE (id_publico)
-- Si se usa estado_registro:
-- CONSTRAINT ck_carrito_compra_estado_registro
--     CHECK (estado_registro IN ('Activo', 'EliminadoLogico', 'EliminadoFisico'))
```

Adapt data types, nullability, defaults and status values to the target database engine and domain requirements. Determine the data types for `created_by`, `updated_by`, `creado_por` and `modificado_por` according to each project's actor model. Use `uuid` only when it matches the identity strategy; other projects may need integer keys, external identity-provider subjects, service-account identifiers or another actor representation.

Use one of these alternatives for the record existence state:

| Alternative | English Column | Spanish Column | Type | Notes |
| --- | --- | --- | --- | --- |
| Boolean flag | `active` | `activo` | `BOOLEAN` / `BIT` | Simple active/inactive state. In many schemas it can be calculated from `active_from` and `active_until`. |
| Explicit status | `record_status` | `estado_registro` | Enum, lookup or constrained text | Use when the record needs values such as `Active`, `SoftDeleted` and `HardDeleted`, or their Spanish equivalents `Activo`, `EliminadoLogico` and `EliminadoFisico`. |

Active-state columns such as `active_from`, `active_until`, `activo_desde` and `activo_hasta` do not apply to every table. Add them only when analysis and design show that the entity needs to record the period in which the record itself is active, such as catalog records, configuration records, reference data, published policies or rows that use soft deletion with historical traceability.

Business validity periods should use domain-specific names to avoid confusion with `RecordStatus` / `EstadoRegistro`. Use `valid` / `vigente` when a boolean is enough and can often be calculated from `valid_from` / `valid_until` or `vigente_desde` / `vigente_hasta`. Use `validity_status` / `estado_vigencia` when the domain needs values such as `Valid`, `Revoked` or `Expired`.

| Purpose | English Column | Spanish Column |
| --- | --- | --- |
| Validity state flag | `valid` | `vigente` |
| Validity state enum | `validity_status` | `estado_vigencia` |
| Validity start | `valid_from` | `vigente_desde` |
| Validity end | `valid_until` | `vigente_hasta` |

Examples with domain-specific names: `appointment_valid_from` / `appointment_valid_until`, `assignment_valid_from` / `assignment_valid_until`, `role_grant_valid_from` / `role_grant_valid_until`, `nombramiento_vigente_desde` / `nombramiento_vigente_hasta`, `asignacion_vigente_desde` / `asignacion_vigente_hasta` or `rol_vigente_desde` / `rol_vigente_hasta`.

The guide does not recommend using every audit, status or validity column in every table. Apply only the fields that fit each entity and add other project-specific fields when the domain, compliance or operational design requires them.

## Primary Key Data Types

Choose primary key types from access patterns, scale, integration needs, storage cost and operational constraints. Avoid treating one type as universally correct.

| Type | Recommended When | Advantages | Trade-Offs |
| --- | --- | --- | --- |
| `uuid` / GUID | IDs are generated outside the database, records are created by distributed services or identifiers cross service boundaries. | Globally unique, easy to generate before insert, useful for offline and distributed workflows. | Larger indexes than integers, less readable, random UUIDs can fragment B-tree indexes unless the database engine or UUID version mitigates it. |
| Sequential UUID / ordered GUID | The project needs UUID semantics but wants better index locality. | Keeps distributed generation benefits while reducing random insert cost. | Requires explicit generation strategy and database/provider support; ordering may leak creation patterns. |
| `bigint` identity / sequence | A single database owns ID generation and high insert throughput matters. | Compact, fast indexes, simple ordering and easy operational debugging. | Harder to merge across systems, can expose record volume, usually requires database roundtrip before ID is known. |
| `int` identity / sequence | Small bounded catalogs or internal tables with clearly limited growth. | Compact and familiar. | Easy to outgrow; avoid for aggregates that may grow for years. |
| Natural key | The business identifier is stable, short and truly immutable. | Expressive and avoids an extra surrogate key in simple reference tables. | Business identifiers often change; wide or mutable natural keys make foreign keys and updates costly. |
| Composite key | The row only exists within a parent scope, such as join tables or localized values. | Enforces domain uniqueness directly and avoids artificial identifiers. | Wider foreign keys, more verbose queries and harder references from other aggregates. |

## Public Identifiers

For normative public-identifier policy, prefer [Public Identifiers](/engineering/cross-cutting/identifiers). The section below keeps complementary column examples.

Do not expose numeric auto-increment primary keys outside backend applications, trusted internal jobs or controlled operational tooling. External APIs, URLs, frontend models and integration contracts should use public identifiers instead.

| Purpose | English Column | Spanish Column | Recommended Type | Notes |
| --- | --- | --- | --- | --- |
| Public identifier | `public_id` | `id_publico` | UUID v4 or UUID v7 | Use v4 for random public IDs. Use v7 when ordered UUIDs better fit index locality, event ordering or operational analysis. |

Keep `public_id` / `id_publico` unique and immutable. The private primary key can still be used for joins and backend persistence, while the public ID becomes the stable identifier in external contracts.

## Date and Time

For normative temporal policy, prefer [Date and Time](/engineering/cross-cutting/date-and-time). The section below keeps complementary column mapping.

Use column types and names that express the meaning of the value:

| Need | Column Intent | Example Names |
| --- | --- | --- |
| Technical audit or event timestamp | Global instant | `created_at`, `updated_at`, `signed_at`, `processed_at`, `expires_at` |
| Local business appointment or schedule | Local date/time plus time zone | `scheduled_at_local`, `time_zone_id` |
| Date-only business value | Date without time | `business_date`, `birth_date`, `settlement_date` |
| Time-only rule | Time of day | `opening_time`, `cutoff_time` |
| Duration | Elapsed amount of time | `processing_duration`, `session_duration` |

Choose and document the temporal persistence strategy per database boundary:

| Strategy | Meaning in Storage | Example Columns | Good Fit |
| --- | --- | --- | --- |
| UTC instant | Value is an exact instant normalized to UTC. | `created_at_utc`, `processed_at_utc`, `event_timestamp_utc` | Distributed systems, event streams, external integrations and exact ordering across systems. |
| Canonical system time zone | Value is stored without offset in the system's configured reference zone. | `created_at`, `processed_at`, `closed_at` plus `global_config.default_time_zone_id` | Single-zone operations where reports, cutoffs and audit review are expressed in one official business zone. |
| Per-entity time zone | Value is local to a row, place or business object and the row stores the zone. | `scheduled_at_local`, `time_zone_id` | Facilities, appointments, users, contracts, branches or future local rules that may use different zones. |
| Offset-preserving | Value preserves the offset received from another source. | `signed_at`, `source_offset` or an engine type such as `datetimeoffset` | Legal evidence, imported events and external signatures where the captured offset matters. |
| Partial temporal value | Value is not a complete date/time. | `business_date`, `opening_time`, `processing_duration` | Date-only rules, time-of-day rules and elapsed durations. |

Do not mix UTC, canonical-zone and per-entity local semantics in the same column. If a schema uses canonical system time, keep the reference zone explicit and stable:

```sql
CREATE TABLE global_config (
    default_time_zone_id text NOT NULL
);

-- Example value: America/Mexico_City
```

Use names from the project's ubiquitous language. `global_config` and `default_time_zone_id` are illustrative names; a project may prefer `system_settings`, `operational_time_zone_id`, `business_time_zone_id` or another documented term.

Persist auditable instants in UTC when the project chooses the UTC instant strategy. When the project chooses canonical system time, store audit values in the configured canonical zone and convert them at system boundaries. In either case, avoid mixing different meanings in the same column. Use database functions that return the intended notion of current time. For PostgreSQL examples, use `clock_timestamp()` when each call must capture the actual invocation instant; use a transaction-stable function only when the business rule deliberately needs one timestamp for the whole transaction.

When the database is the application's authoritative clock, keep that decision explicit in the application architecture. Application code can resolve "now" through a central service that queries the database or another trusted server-side source, rather than trusting client clocks or scattered calls to local system time.

Store local date/time values by row only when the domain needs them, such as appointments, schedules, local deadlines, branch hours or legal time windows. If the local value depends on a place, store the IANA time-zone identifier in a separate column:

```sql
scheduled_at_local timestamp without time zone NOT NULL,
time_zone_id       text                        NOT NULL
```

Use suffixes consistently:

- `_at` for instants.
- `_date` for dates.
- `_time` for times of day.
- `_local` for local date/time values.
- `_utc` only when the team intentionally wants the storage policy visible in the name.
- `_system` or another project-specific suffix only when the team wants to make canonical system time visible.

Avoid vague names such as `date`, `datetime` or `timestamp` without business context. Convert to user-facing time zones in the presentation or reporting layer.

## Value Object Modeling

- Use atomic columns for simple data with frequent queries.
- Use structured or semi-structured storage for composite values only when it provides real flexibility and the database engine supports safe querying and validation.
- Define domain validations, required fields and referential relationships in the schema whenever the database engine supports them.

See [Domain-Driven Design](/foundations/domain-modeling/domain-driven-design-reference) for more context on Value Objects.

## Migration Strategy

- Every schema modification must be reproducible via versioned migrations.
- Avoid untraceable manual changes in shared environments.
- Test migrations forward and rollback when the database engine allows it.

See [Migration Concepts](/engineering/data/migrations/concepts) and [Migration Tools and Strategies](./migrations/tools-and-strategies) for the migration guidance in this same Data and Migrations section.

## Integrity and Performance

- Define explicit primary keys and foreign keys.
- Index based on actual query patterns.
- Review execution plans for critical queries.

## Engine-Specific Conventions

- [PostgreSQL Conventions](./database-engines/postgresql)
- [SQL Server Conventions](./database-engines/sql-server)
- [MySQL and MariaDB Conventions](./database-engines/mysql-mariadb)
