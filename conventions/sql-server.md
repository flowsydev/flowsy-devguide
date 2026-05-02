# SQL Server Conventions

Naming and modeling guidelines for SQL Server and Azure SQL databases.

## General Naming

Use clear, stable identifiers that avoid unnecessary delimiters:

| Object | Convention | Example |
| --- | --- | --- |
| Schemas | PascalCase or established project convention | `Sales`, `Identity` |
| Tables | PascalCase singular or project convention | `ShoppingCart`, `UserAccount` |
| Columns | PascalCase | `ShoppingCartId`, `CreatedAt` |
| Indexes | `IX_<Table>_<Columns>` | `IX_ShoppingCart_UserAccountId` |
| Primary keys | `PK_<Table>` | `PK_ShoppingCart` |
| Foreign keys | `FK_<Table>_<ReferencedTable>` | `FK_ShoppingCart_UserAccount` |
| CHECK constraints | `CK_<Table>_<Description>` | `CK_ShoppingCart_RecordStatus` |
| Stored procedures | `<Schema>.<Aggregate>_<Operation>` | `Sales.ShoppingCart_Create` |

Avoid embedded spaces, reserved words and names that require brackets. SQL Server supports delimited identifiers, but ordinary project objects should not rely on them.

## Temporal Types

- Prefer `datetimeoffset` for audit fields that represent instants crossing system boundaries.
- Use UTC consistently unless the domain explicitly requires a local civil time.
- Minimum audit columns per table:

```sql
CreatedAt       datetimeoffset(7) NOT NULL DEFAULT SYSDATETIMEOFFSET(),
CreatedByUserId uniqueidentifier  NOT NULL,
UpdatedAt       datetimeoffset(7) NOT NULL DEFAULT SYSDATETIMEOFFSET(),
UpdatedByUserId uniqueidentifier  NOT NULL
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
- See [Database Migrations: Concepts](/technologies/backend/database-migrations/concepts) and [Migration Tools and Strategies](/technologies/backend/database-migrations/tools-and-strategies).

## References

- [SQL Server Database Identifiers](https://learn.microsoft.com/en-us/sql/relational-databases/databases/database-identifiers)
- [SYSDATETIMEOFFSET](https://learn.microsoft.com/en-us/sql/t-sql/functions/sysdatetimeoffset-transact-sql)
