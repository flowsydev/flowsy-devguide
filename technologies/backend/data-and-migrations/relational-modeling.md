# Data and Migrations: Relational Modeling

Base guide for relational modeling, schema conventions, keys, integrity and operational traceability. It is part of the backend Data and Migrations section and applies to any SQL engine.

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
- Triggers, events and scheduled jobs when the engine supports them.

## Primary and Foreign Keys

Primary and foreign key columns must respect the case style of the target database engine and the project language strategy. Use the position of `id` consistently:

| Case Style | English Naming | Spanish Naming |
| --- | --- | --- |
| lower `snake_case` | `{table}_id`, for example `shopping_cart_id` | `id_{tabla}`, for example `id_orden_despacho` |
| `PascalCase` | `{Table}Id`, for example `ShoppingCartId` | `Id{Tabla}`, for example `IdOrdenDespacho` |

Use the shorter `id` / `Id` only when the table or ORM convention clearly scopes the identifier and the team has agreed to that style. For SQL-first schemas, prefer the explicit table-qualified form because it travels better across joins, views, reports and logs.

For foreign keys:

- If there is only one relationship to another table, use the same column name as the referenced primary key unless another name adds meaningful clarity.
- If there are two or more relationships to the same table, use descriptive column names that explain the relationship intent while preserving the language-specific `id` position.

Examples:

| Scenario | English Example | Spanish Example |
| --- | --- | --- |
| Single relationship to `user_account` / `usuario` | `user_account_id` references `user_account.user_account_id` | `id_usuario` references `usuario.id_usuario` |
| Two relationships to the same user table | `created_by_user_id`, `approved_by_user_id` | `id_usuario_creador`, `id_usuario_aprobador` |
| Two address relationships | `billing_address_id`, `shipping_address_id` | `id_direccion_facturacion`, `id_direccion_envio` |
| Parent/child hierarchy in one table | `parent_category_id` | `id_categoria_padre` |

Constraint names should follow the target engine convention, such as `fk_shopping_cart_user_account`, `FK_ShoppingCart_UserAccount`, `fk_orden_despacho_usuario` or `FK_OrdenDespacho_Usuario`.

## Audit and Schema Integrity

Table designs should include the keys, constraints and audit fields required by the domain. The fields below are examples proposed by the guide; each team must design the final attributes and columns from the project's requirements, threat model, compliance needs and actor model. A human user, application, integration, device or automated process may be the source of a change.

English naming keeps `id` as a suffix for attributes and columns that reference another entity:

```sql
-- Primary key
shopping_cart_id uuid PRIMARY KEY,

-- Audit columns
created_at                timestamptz NOT NULL DEFAULT now(),
created_by_user_id        uuid        NULL,
created_by_application_id uuid        NULL,
updated_at                timestamptz NOT NULL DEFAULT now(),
updated_by_user_id        uuid        NULL,
updated_by_application_id uuid        NULL,
record_status             text        NOT NULL DEFAULT 'Active',

-- Constraints
CONSTRAINT ck_shopping_cart_record_status
    CHECK (record_status IN ('Active', 'SoftDeleted', 'HardDeleted'))
```

Spanish naming keeps `id` as a prefix for attributes and columns that reference another entity:

```sql
id_orden_despacho        uuid        PRIMARY KEY,
creado_en                timestamptz NOT NULL DEFAULT now(),
id_usuario_creador       uuid        NULL,
id_aplicacion_creadora   uuid        NULL,
actualizado_en           timestamptz NOT NULL DEFAULT now(),
id_usuario_actualizador  uuid        NULL,
id_aplicacion_actualizadora uuid     NULL,
estado_registro          text        NOT NULL DEFAULT 'Activo',

CONSTRAINT ck_orden_despacho_estado_registro
    CHECK (estado_registro IN ('Activo', 'EliminadoSuave', 'EliminadoDefinitivo'))
```

Adapt data types, nullability, defaults and status values to the target database engine and domain requirements.

## Date and Time

- Use a database type that preserves the intended instant or civil time semantics.
- Persist auditable instants in UTC.
- Store local civil time only when the domain explicitly needs it, such as schedules, local deadlines or legal time windows.
- Convert to user-facing time zones in the presentation layer or reporting layer.

## Value Object Modeling

- Use atomic columns for simple data with frequent queries.
- Use structured or semi-structured storage for composite values only when it provides real flexibility and the engine supports safe querying and validation.
- Define domain validations, required fields and referential relationships in the schema whenever the engine supports them.

See [Domain-Driven Design](../../../discovery/domain-driven-design.md) for more context on Value Objects.

## Migration Strategy

- Every schema modification must be reproducible via versioned migrations.
- Avoid untraceable manual changes in shared environments.
- Test migrations forward and rollback when the engine allows it.

See [Migration Concepts](./migration-concepts.md) and [Migration Tools and Strategies](./tools-and-strategies.md) for the migration guidance in this same Data and Migrations section.

## Integrity and Performance

- Define explicit primary keys and foreign keys.
- Index based on actual query patterns.
- Review execution plans for critical queries.

## Engine-Specific Conventions

- [PostgreSQL Conventions](../../../conventions/postgresql.md)
- [SQL Server Conventions](../../../conventions/sql-server.md)
- [MySQL and MariaDB Conventions](../../../conventions/mysql-mariadb.md)
