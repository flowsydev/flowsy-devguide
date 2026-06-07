# Data and Migrations: Relational Modeling

Base guide for relational modeling, schema conventions, keys, integrity and operational traceability. It is part of the backend Data and Migrations section and applies to any SQL database engine.

For persistence, constraints, queries and concurrency validation, see [Relational Database Testing](../../testing/database/relational-databases.md). For schema evolution validation, see [Database Migration Testing](../../testing/database/migrations.md).

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

Do not expose numeric auto-increment primary keys outside backend applications, trusted internal jobs or controlled operational tooling. External APIs, URLs, frontend models and integration contracts should use public identifiers instead.

| Purpose | English Column | Spanish Column | Recommended Type | Notes |
| --- | --- | --- | --- | --- |
| Public identifier | `public_id` | `id_publico` | UUID v4 or UUID v7 | Use v4 for random public IDs. Use v7 when ordered UUIDs better fit index locality, event ordering or operational analysis. |

Keep `public_id` / `id_publico` unique and immutable. The private primary key can still be used for joins and backend persistence, while the public ID becomes the stable identifier in external contracts.

## Date and Time

- Use a database type that preserves the intended instant or local date/time semantics.
- Persist auditable instants in UTC.
- Prefer database functions that return the actual invocation instant for audit and event defaults. For PostgreSQL examples, use `clock_timestamp()` instead of `now()` when each call must capture the real current time.
- Store local date/time values only when the domain explicitly needs them, such as schedules, local deadlines or legal time windows.
- Convert to user-facing time zones in the presentation layer or reporting layer.

## Value Object Modeling

- Use atomic columns for simple data with frequent queries.
- Use structured or semi-structured storage for composite values only when it provides real flexibility and the database engine supports safe querying and validation.
- Define domain validations, required fields and referential relationships in the schema whenever the database engine supports them.

See [Domain-Driven Design](../../../discovery/domain-driven-design.md) for more context on Value Objects.

## Migration Strategy

- Every schema modification must be reproducible via versioned migrations.
- Avoid untraceable manual changes in shared environments.
- Test migrations forward and rollback when the database engine allows it.

See [Migration Concepts](./migration-concepts.md) and [Migration Tools and Strategies](./tools-and-strategies.md) for the migration guidance in this same Data and Migrations section.

## Integrity and Performance

- Define explicit primary keys and foreign keys.
- Index based on actual query patterns.
- Review execution plans for critical queries.

## Engine-Specific Conventions

- [PostgreSQL Conventions](./database-engines/postgresql.md)
- [SQL Server Conventions](./database-engines/sql-server.md)
- [MySQL and MariaDB Conventions](./database-engines/mysql-mariadb.md)
