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

For primary and foreign key column names, keep `PascalCase` and follow the project language strategy: English names usually use `Id` as a suffix, such as `ShoppingCartId`; Spanish names usually use `Id` as a prefix, such as `IdCarritoCompra`. See [Data and Migrations: Relational Modeling](../relational-modeling.md#primary-and-foreign-keys).

Avoid embedded spaces, reserved words and names that require brackets. SQL Server supports delimited identifiers, but ordinary project objects should not rely on them.

## SQL Routines

Use the aggregate-oriented routine design from [Migration Concepts](../migration-concepts.md#aggregate-based-routine-design). This page only defines the SQL Server physical naming style: `PascalCase`, with schema qualification when the project uses schemas. Do not insert `_` between prefix and operation unless the project has deliberately adopted an underscore-based SQL Server convention.

```text
[Schema].[AggregatePrefix][OperationType][Detail]
```

Examples:

- `Sales.ShoppingCartCreate`
- `Sales.ShoppingCartGetOpenByUserAccountId`
- `Sales.ShoppingCartModifyAddItem`

## Temporal Types

- Prefer `datetimeoffset` for audit fields that represent instants crossing system boundaries.
- Use UTC consistently unless the domain explicitly requires local date/time values.
- Prefer `SYSUTCDATETIME()` for UTC audit defaults when the offset is not needed in storage, or `SYSDATETIMEOFFSET()` when preserving the system offset is required.
- Audit columns should follow the project and domain audit model. Choose actor columns according to what can create or update records: users, applications, service accounts, integrations, devices, tenants or background processes.

Common English examples:

```sql
CreatedAt              datetimeoffset(7) NOT NULL DEFAULT TODATETIMEOFFSET(SYSUTCDATETIME(), '+00:00'),
CreatedBy              uniqueidentifier  NULL,
UpdatedAt              datetimeoffset(7) NOT NULL DEFAULT TODATETIMEOFFSET(SYSUTCDATETIME(), '+00:00'),
UpdatedBy              uniqueidentifier  NULL,
Active                 bit               NOT NULL DEFAULT 1,
-- or: RecordStatus nvarchar(40) NOT NULL DEFAULT 'Active',
ActiveFrom             datetimeoffset(7) NULL,
ActiveUntil            datetimeoffset(7) NULL,
PublicId               uniqueidentifier  NOT NULL
```

Spanish names can be appropriate when the project deliberately keeps the data model in Spanish:

```sql
Creado        datetimeoffset(7) NOT NULL DEFAULT TODATETIMEOFFSET(SYSUTCDATETIME(), '+00:00'),
CreadoPor     uniqueidentifier  NULL,
Modificado    datetimeoffset(7) NOT NULL DEFAULT TODATETIMEOFFSET(SYSUTCDATETIME(), '+00:00'),
ModificadoPor uniqueidentifier  NULL,
Activo        bit               NOT NULL DEFAULT 1,
-- o: EstadoRegistro nvarchar(40) NOT NULL DEFAULT 'Activo',
ActivoDesde    datetimeoffset(7) NULL,
ActivoHasta    datetimeoffset(7) NULL,
IdPublico      uniqueidentifier  NOT NULL
```

Choose the data type for `CreatedBy`, `UpdatedBy`, `CreadoPor` and `ModificadoPor` according to the project's actor model and identity requirements.
Use `Active` / `Activo` for simple existence state, or `RecordStatus` / `EstadoRegistro` when the record needs states such as `Active`, `SoftDeleted` and `HardDeleted`. Add active-state columns such as `ActiveFrom`, `ActiveUntil`, `ActivoDesde` and `ActivoHasta` only when analysis and design show that the entity needs to record when the record itself is active.
Use `Valid` / `Vigente` for simple business validity, or `ValidityStatus` / `EstadoVigencia` when the domain needs states such as `Valid`, `Revoked` and `Expired`. Use domain-specific validity names when they add clarity, such as `AssignmentValidFrom` or `AsignacionVigenteDesde`.
Do not expose numeric auto-increment primary keys outside backend boundaries. Add `PublicId` / `IdPublico` with UUID v4 or v7 when records must be referenced from APIs, frontend models or integration contracts.

Common SQL Server date and time functions:

| Function | Description | Use Case |
| --- | --- | --- |
| `SYSUTCDATETIME()` | Returns the current system date and time in UTC with high precision. | Preferred UTC audit defaults and event timestamps. |
| `SYSDATETIMEOFFSET()` | Returns the current system date and time with the system time-zone offset. | Values that must preserve the server offset as part of the stored instant. |
| `SYSDATETIME()` | Returns the current system date and time without offset. | Local server diagnostics where offset and UTC normalization are not required. |
| `GETUTCDATE()` / `GETDATE()` | Older, lower-precision functions. | Legacy schemas; avoid for new audit columns when high precision is needed. |

## Entity Event Logs

When maintaining an event log per entity, use at least:

```sql
EventTimestamp  datetimeoffset(7) NOT NULL DEFAULT TODATETIMEOFFSET(SYSUTCDATETIME(), '+00:00'),
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
- [SYSUTCDATETIME](https://learn.microsoft.com/en-us/sql/t-sql/functions/sysutcdatetime-transact-sql)
- [SYSDATETIMEOFFSET](https://learn.microsoft.com/en-us/sql/t-sql/functions/sysdatetimeoffset-transact-sql)
