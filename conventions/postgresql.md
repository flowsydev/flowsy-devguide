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

For primary and foreign key column names, keep lower `snake_case` and follow the project language strategy: English names usually use `id` as a suffix, such as `shopping_cart_id`; Spanish names usually use `id` as a prefix, such as `id_orden_despacho`. See [Data and Migrations: Relational Modeling](../technologies/backend/data-and-migrations/relational-modeling.md#primary-and-foreign-keys).

When a solution targets several engines, do not force a single naming style across all databases. Keep the logical model consistent, but let the physical names follow the engine's ordinary convention:

| Engine | Common Convention | Example Routine |
| --- | --- | --- |
| PostgreSQL | lower `snake_case` | `sales.shopping_cart_get_open_by_user_account_id` |
| MySQL / MariaDB | lower `snake_case` | `sales.shopping_cart_get_open_by_user_account_id` |
| SQL Server / Azure SQL | `PascalCase` | `Sales.ShoppingCartGetOpenByUserAccountId` |
| Oracle Database | `UPPER_SNAKE_CASE` or the established project convention | `SALES.SHOPPING_CART_GET_OPEN_BY_USER_ACCOUNT_ID` |
| Snowflake | `UPPER_SNAKE_CASE` unless quoted identifiers are intentionally used | `SALES.SHOPPING_CART_GET_OPEN_BY_USER_ACCOUNT_ID` |
| BigQuery | lower `snake_case` for datasets, tables and routines | `sales.shopping_cart_get_open_by_user_account_id` |

## Temporal Types

- Prefer `timestamp with time zone` (`timestamptz`) for all audit and event fields.
- Avoid `timestamp without time zone` in data shared between systems or regions.
- Audit columns should follow the project and domain audit model. Choose actor columns according to what can create or update records: users, applications, service accounts, integrations, devices, tenants or background processes.

Common English examples:

```sql
created_at         timestamptz NOT NULL DEFAULT now(),
created_by_user_id uuid        NOT NULL,
created_by_application_id uuid NULL,
updated_at         timestamptz NOT NULL DEFAULT now(),
updated_by_user_id uuid        NOT NULL,
updated_by_application_id uuid NULL
```

Spanish names can be appropriate when the project deliberately keeps the data model in Spanish:

```sql
creado_en              timestamptz NOT NULL DEFAULT now(),
id_usuario_creador uuid        NOT NULL,
id_aplicacion_creadora uuid     NULL,
actualizado_en         timestamptz NOT NULL DEFAULT now(),
id_usuario_actualizador uuid   NOT NULL,
id_aplicacion_actualizadora uuid NULL
```

These names are examples. Align them with the entity properties, database engine naming convention and project language strategy.

- When maintaining an event log per entity, use at least:

```sql
event_timestamp   timestamptz NOT NULL DEFAULT now(),
event_type        text        NOT NULL,
payload           jsonb       NOT NULL,
operation_context jsonb       NULL
```

These names are the database equivalent of `EventTimestamp`, `EventType`, `Payload` and `OperationContext`.

## SQL Routines (Functions and Procedures)

Design routines around **domain aggregates**, not around individual tables. A routine may read or modify several tables when those tables are part of the same aggregate boundary.

Choose one aggregate prefix strategy per database boundary:

- Prefer the full aggregate name whenever possible, such as `shopping_cart`.
- Use an abbreviation or code based on the aggregate name when the full name creates a practical problem, such as excessive length or hard-to-scan routine names. PostgreSQL identifiers are limited to 63 bytes by default, even though the internal `NAMEDATALEN` setting is commonly described as 64 bytes.
- Keep the choice consistent across the project: avoid mixing full names and abbreviations for routine prefixes unless a documented exception is needed for a specific long aggregate name.

The complete routine name, including prefix, operation and detail, must follow the target engine's naming convention. In PostgreSQL that means lower `snake_case`:

```text
[schema].[aggregate_prefix]_[operation_type]_[detail]
```

Common operation types:

| Type | Description |
| --- | --- |
| `create` | Create the aggregate root |
| `get` | Query that returns one or more records |
| `modify` | Modify an existing aggregate |
| `remove` | Remove or retire the aggregate root |
| `view` | Define a recreated view related to the aggregate |

Examples:

| Aggregate | Prefix Strategy | Routine | Description |
| --- | --- | --- | --- |
| `ShoppingCart` | Full name | `sales.shopping_cart_create` | Creates a new cart |
| `ShoppingCart` | Full name | `sales.shopping_cart_get_open_by_user_account_id` | Gets the open cart for a user |
| `ShoppingCart` | Full name | `sales.shopping_cart_modify_add_item` | Adds an item to the cart |
| `Subscription` | Full name | `billing.subscription_modify_cancel` | Cancels a subscription |
| `InventoryItem` | Full name | `inventory.inventory_item_get_available_by_sku` | Gets available inventory by SKU |
| `CustomerRewardPointsLedgerEntry` | Abbreviation or code | `loyalty.crple_get_pending_expiration_by_account_id` | Uses an abbreviation or code to keep a long routine name manageable |

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

For routine design and domain-aligned migrations, see [Migrations: Concepts](../technologies/backend/data-and-migrations/migration-concepts.md) and the [Domain-Driven Design](../discovery/domain-driven-design.md) guide.
