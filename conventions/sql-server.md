# SQL Server Conventions

Naming and modeling guidelines for SQL Server and Azure SQL databases.

## General Naming

Use the naming convention adopted by the target database community. For SQL Server and Azure SQL, use clear, stable `PascalCase` identifiers that avoid unnecessary delimiters:

| Object | Convention | Example |
| --- | --- | --- |
| Databases | `PascalCase` or established environment convention | `Ecommerce` |
| Schemas | `PascalCase` or established project convention | `Sales`, `Identity` |
| Tables | `PascalCase` singular or project convention | `ShoppingCart`, `UserAccount` |
| Columns | `PascalCase` | `ShoppingCartId`, `CreatedAt` |
| Indexes | `IX_<Table>_<Columns>` | `IX_ShoppingCart_UserAccountId` |
| Primary keys | `PK_<Table>` | `PK_ShoppingCart` |
| Foreign keys | `FK_<Table>_<ReferencedTable>` | `FK_ShoppingCart_UserAccount` |
| CHECK constraints | `CK_<Table>_<Description>` | `CK_ShoppingCart_RecordStatus` |
| Stored procedures | `<Schema>.<AggregatePrefix><Operation><Detail>` | `Sales.ShoppingCartGetOpenByUserAccountId` |

For primary and foreign key column names, keep `PascalCase` and follow the project language strategy: English names usually use `Id` as a suffix, such as `ShoppingCartId`; Spanish names usually use `Id` as a prefix, such as `IdOrdenDespacho`. See [Data and Migrations: Relational Modeling](../technologies/backend/data-and-migrations/relational-modeling.md#primary-and-foreign-keys).

Avoid embedded spaces, reserved words and names that require brackets. SQL Server supports delimited identifiers, but ordinary project objects should not rely on them.

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

Design stored procedures and functions around **domain aggregates**, not around individual tables. A routine may read or modify several tables when those tables are part of the same aggregate boundary.

Choose one aggregate prefix strategy per database boundary:

- Prefer the full aggregate name whenever possible, such as `ShoppingCart`.
- Use an abbreviation or code based on the aggregate name when the full name creates a practical problem, such as excessive length, hard-to-scan routine names or an identifier limit in the target engine. For example, PostgreSQL identifiers are limited to 63 bytes by default, even though the internal `NAMEDATALEN` setting is commonly described as 64 bytes.
- Keep the choice consistent across the project: avoid mixing full names and abbreviations for routine prefixes unless a documented exception is needed for a specific long aggregate name.

The complete routine name, including prefix, operation and detail, must follow the target engine's naming convention. In SQL Server that means `PascalCase`; do not insert `_` between prefix and operation unless the project has deliberately adopted an underscore-based SQL Server convention:

```text
[Schema].[AggregatePrefix][OperationType][Detail]
```

Examples:

| Aggregate | Prefix Strategy | Routine | Description |
| --- | --- | --- | --- |
| `ShoppingCart` | Full name | `Sales.ShoppingCartCreate` | Creates a new cart |
| `ShoppingCart` | Full name | `Sales.ShoppingCartGetOpenByUserAccountId` | Gets the open cart for a user |
| `ShoppingCart` | Full name | `Sales.ShoppingCartModifyAddItem` | Adds an item to the cart |
| `Subscription` | Full name | `Billing.SubscriptionModifyCancel` | Cancels a subscription |
| `InventoryItem` | Full name | `Inventory.InventoryItemGetAvailableBySku` | Gets available inventory by SKU |
| `CustomerRewardPointsLedgerEntry` | Abbreviation or code | `Loyalty.CrpleGetPendingExpirationByAccountId` | Uses an abbreviation or code to keep a long routine name manageable |

## Temporal Types

- Prefer `datetimeoffset` for audit fields that represent instants crossing system boundaries.
- Use UTC consistently unless the domain explicitly requires a local civil time.
- Audit columns should follow the project and domain audit model. Choose actor columns according to what can create or update records: users, applications, service accounts, integrations, devices, tenants or background processes.

Common English examples:

```sql
CreatedAt              datetimeoffset(7) NOT NULL DEFAULT SYSDATETIMEOFFSET(),
CreatedByUserId        uniqueidentifier  NOT NULL,
CreatedByApplicationId uniqueidentifier  NULL,
UpdatedAt              datetimeoffset(7) NOT NULL DEFAULT SYSDATETIMEOFFSET(),
UpdatedByUserId        uniqueidentifier  NOT NULL,
UpdatedByApplicationId uniqueidentifier  NULL
```

Spanish names can be appropriate when the project deliberately keeps the data model in Spanish:

```sql
CreadoEn                 datetimeoffset(7) NOT NULL DEFAULT SYSDATETIMEOFFSET(),
IdUsuarioCreador       uniqueidentifier  NOT NULL,
IdAplicacionCreadora    uniqueidentifier  NULL,
ActualizadoEn            datetimeoffset(7) NOT NULL DEFAULT SYSDATETIMEOFFSET(),
IdUsuarioActualizador  uniqueidentifier  NOT NULL,
IdAplicacionActualizadora uniqueidentifier NULL
```

## Entity Event Logs

When maintaining an event log per entity, use at least:

```sql
EventTimestamp  datetimeoffset(7) NOT NULL DEFAULT SYSDATETIMEOFFSET(),
EventType       nvarchar(200)     NOT NULL,
Payload         nvarchar(max)     NOT NULL,
OperationContext nvarchar(max)    NULL
```

Use JSON validation patterns available to the project's SQL Server version when `Payload` or `OperationContext` contain JSON.

## Change Control

- Manage SQL Server schema changes with an explicit migration strategy.
- Keep DDL, indexes, constraints, views, procedures and seed/reference changes under source control.
- Choose the migration tool according to the owning stack: EF Core, DbUp, Flyway, Liquibase, Sqitch, Atlas or another approved approach.
- See [Database Migrations: Concepts](/technologies/backend/data-and-migrations/migration-concepts) and [Migration Tools and Strategies](/technologies/backend/data-and-migrations/tools-and-strategies).

## References

- [SQL Server Database Identifiers](https://learn.microsoft.com/en-us/sql/relational-databases/databases/database-identifiers)
- [SYSDATETIMEOFFSET](https://learn.microsoft.com/en-us/sql/t-sql/functions/sysdatetimeoffset-transact-sql)
