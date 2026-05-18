# MySQL and MariaDB Conventions

Naming and modeling guidelines for MySQL and MariaDB databases.

## General Naming

Use the naming convention adopted by the target database community. For MySQL and MariaDB, use lower `snake_case` identifiers to avoid case-sensitivity surprises across operating systems and server settings:

| Object | Convention | Example |
| --- | --- | --- |
| Databases | lower `snake_case` | `ecommerce` |
| Schemas | lower `snake_case` when the engine or tool uses schema-like grouping | `sales`, `identity` |
| Tables | lower `snake_case` | `shopping_cart`, `user_account` |
| Columns | lower `snake_case` | `shopping_cart_id`, `created_at` |
| Indexes | `ix_<table>_<columns>` | `ix_shopping_cart_user_account_id` |
| Foreign keys | `fk_<table>_<referenced_table>` | `fk_shopping_cart_user_account` |
| CHECK constraints | `ck_<table>_<description>` | `ck_shopping_cart_record_status` |
| Routines | `<aggregate_prefix>_<operation>_<detail>` | `shopping_cart_get_open_by_user_account_id` |

For primary and foreign key column names, keep lower `snake_case` and follow the project language strategy: English names usually use `id` as a suffix, such as `shopping_cart_id`; Spanish names usually use `id` as a prefix, such as `id_orden_despacho`. See [Data and Migrations: Relational Modeling](../technologies/backend/data-and-migrations/relational-modeling.md#primary-and-foreign-keys).

Avoid reserved words, spaces and names that require backticks. MySQL and MariaDB support quoted identifiers, but ordinary project objects should remain unquoted.

When a solution targets several engines, do not force a single naming style across all databases. Keep the logical model consistent, but let the physical names follow the engine's ordinary convention:

| Engine | Common Convention | Example Routine |
| --- | --- | --- |
| PostgreSQL | lower `snake_case` | `sales.shopping_cart_get_open_by_user_account_id` |
| MySQL / MariaDB | lower `snake_case` | `sales.shopping_cart_get_open_by_user_account_id` |
| SQL Server / Azure SQL | `PascalCase` | `Sales.ShoppingCartGetOpenByUserAccountId` |
| Oracle Database | `UPPER_SNAKE_CASE` or the established project convention | `SALES.SHOPPING_CART_GET_OPEN_BY_USER_ACCOUNT_ID` |
| Snowflake | `UPPER_SNAKE_CASE` unless quoted identifiers are intentionally used | `SALES.SHOPPING_CART_GET_OPEN_BY_USER_ACCOUNT_ID` |
| BigQuery | lower `snake_case` for datasets, tables and routines | `sales.shopping_cart_get_open_by_user_account_id` |

## SQL Routines

Design routines around **domain aggregates**, not around individual tables. A routine may read or modify several tables when those tables are part of the same aggregate boundary.

Choose one aggregate prefix strategy per database boundary:

- Prefer the full aggregate name whenever possible, such as `shopping_cart`.
- Use an abbreviation or code based on the aggregate name when the full name creates a practical problem, such as excessive length, hard-to-scan routine names or an identifier limit in the target engine. For example, PostgreSQL identifiers are limited to 63 bytes by default, even though the internal `NAMEDATALEN` setting is commonly described as 64 bytes.
- Keep the choice consistent across the project: avoid mixing full names and abbreviations for routine prefixes unless a documented exception is needed for a specific long aggregate name.

The complete routine name, including prefix, operation and detail, must follow the target engine's naming convention. In MySQL and MariaDB that means lower `snake_case`:

```text
[aggregate_prefix]_[operation_type]_[detail]
```

Examples:

| Aggregate | Prefix Strategy | Routine | Description |
| --- | --- | --- | --- |
| `ShoppingCart` | Full name | `shopping_cart_create` | Creates a new cart |
| `ShoppingCart` | Full name | `shopping_cart_get_open_by_user_account_id` | Gets the open cart for a user |
| `ShoppingCart` | Full name | `shopping_cart_modify_add_item` | Adds an item to the cart |
| `Subscription` | Full name | `subscription_modify_cancel` | Cancels a subscription |
| `InventoryItem` | Full name | `inventory_item_get_available_by_sku` | Gets available inventory by SKU |
| `CustomerRewardPointsLedgerEntry` | Abbreviation or code | `crple_get_pending_expiration_by_account_id` | Uses an abbreviation or code to keep a long routine name manageable |

## Temporal Types

- Use `timestamp` or `datetime` consistently according to the project storage policy.
- Store auditable instants in UTC.
- Audit columns should follow the project and domain audit model. Choose actor columns according to what can create or update records: users, applications, service accounts, integrations, devices, tenants or background processes.

Common English examples:

```sql
created_at         timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
created_by_user_id char(36)  NOT NULL,
created_by_application_id char(36) NULL,
updated_at         timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
updated_by_user_id char(36)  NOT NULL,
updated_by_application_id char(36) NULL
```

Spanish names can be appropriate when the project deliberately keeps the data model in Spanish:

```sql
creado_en                   timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
id_usuario_creador       char(36)  NOT NULL,
id_aplicacion_creadora    char(36)  NULL,
actualizado_en              timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
id_usuario_actualizador  char(36)  NOT NULL,
id_aplicacion_actualizadora char(36) NULL
```

Adjust identity types when the project uses binary UUIDs, numeric identifiers or different actor identifiers.

## Entity Event Logs

When maintaining an event log per entity, use at least:

```sql
event_timestamp   timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
event_type        varchar(200) NOT NULL,
payload           json NOT NULL,
operation_context json NULL
```

## Change Control

- Manage MySQL or MariaDB schema changes with an explicit migration strategy.
- Keep DDL, indexes, constraints, routines, views and seed/reference changes under source control.
- Choose the migration tool according to the owning stack and database support: Flyway, Liquibase, Sqitch, Atlas, DbUp, EF Core or another approved approach.
- See [Database Migrations: Concepts](/technologies/backend/data-and-migrations/migration-concepts) and [Migration Tools and Strategies](/technologies/backend/data-and-migrations/tools-and-strategies).

## References

- [MySQL Language Structure](https://dev.mysql.com/doc/en/language-structure.html)
- [MariaDB Identifier Names](https://mariadb.com/docs/server/reference/sql-structure/sql-language-structure/identifier-names)
