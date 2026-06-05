# Data and Migrations: Migration Concepts

Guide for managing database changes in a reproducible, traceable and reviewable way. A migration strategy should make it possible to understand what changed, apply changes consistently across environments and validate that the database reached the expected state.

This page is intentionally tool-agnostic. File naming such as `V*.sql` or `R__*.sql` belongs to specific tools like Evolve or Flyway; other tools use changelogs, generated migration classes, plan files, declarative schema state or custom script journals.

## Principles

- Every schema change must be reproducible through a documented migration strategy.
- Avoid untraceable manual changes in shared environments.
- Database changes are code: keep them in the repository, review them in Pull Requests and validate them in CI when possible.
- Choose one migration strategy per database boundary and document how it is executed.
- Test migration forward. Add rollback, revert or recovery guidance when the selected tool and operational flow support it.
- Preserve evidence for risky changes: command executed, database state, migration result and relevant test output.

## Migration Strategy Types

| Strategy | How It Works | Good Fit | Watch Out For |
| --- | --- | --- | --- |
| Versioned SQL Scripts | Ordered scripts are applied once and tracked by metadata. | Teams that want explicit SQL and predictable review. | Tool-specific naming and checksum rules. |
| Repeatable SQL Artifacts | Re-runnable scripts recreate views, routines or reference data when content changes. | Database objects whose definition should live in one source file. | Scripts must be idempotent or safely replaceable. |
| Changelog / Changeset | A changelog records ordered changesets with metadata. | Teams that need labels, contexts, preconditions or multiple file formats. | Requires disciplined changeset ownership and rollback policy. |
| ORM-Generated Migrations | Code-first model changes generate migration code. | Application-owned schemas where the ORM is the source of schema evolution. | Generated SQL still needs review for safety and performance. |
| Plan-Based Change Management | A plan file declares changes, dependencies, deploy, revert and verify scripts. | Teams that want native SQL with explicit dependency and verification flow. | More ceremony; requires learning the tool model. |
| Declarative / Desired State | Desired schema is compared with current state and a plan is generated. | Platform or DevOps teams that want schema drift detection and generated plans. | Generated plans must be reviewed before production execution. |

## Recommended Repository Structure

Choose a base folder for database scripts according to the repository organization, language, framework and casing conventions. `Resources/Databases/...` is a good fit for many .NET repositories, but it is a recommendation, not a universal requirement.

Also choose the language of schemas, aggregate folders and script names according to the project's domain and data model language. The folder structure can use English examples such as `sales/shopping-cart` or Spanish examples such as `ventas/pedido-cliente`; the important part is consistency within the database boundary.

Use the same logical structure even when folder casing changes:

| Project Style | Example Base Path | When It Fits |
| --- | --- | --- |
| .NET / PascalCase repository folders | `Resources/Databases/Ecommerce/` | The repository already uses folders such as `src/`, `Resources/`, `Tests/` or PascalCase project boundaries. |
| Java, Python, Node.js or lowercase repository folders | `resources/databases/ecommerce/` | The repository convention favors lowercase paths for resources, packages or deployable assets. |
| Framework-imposed resources folder | `src/main/resources/databases/ecommerce/` | The framework expects application resources under a specific source tree, such as Maven or Gradle projects. |
| Platform or infrastructure repository | `database/ecommerce/` or `db/ecommerce/` | The repository is dedicated to database, infrastructure or deployment assets. |

After choosing the base path, use a structure that separates migration-managed artifacts from occasional operational scripts:

```text
📁 Resources/Databases/
└── 📁 Ecommerce/                              ← Database or connection key
    ├── 📁 Migrations/                        ← Tool-managed migration files
    │   ├── 📁 Versioned/                     ← Ordered one-time changes, if the tool supports them
    │   └── 📁 Repeatable/                    ← Re-runnable objects, if the tool supports them
    │       └── 📁 sales/                     ← Database schema
    │           └── 📁 shopping-cart/         ← Domain aggregate
    ├── 📁 Operations/                        ← Occasional administrative or cleanup scripts
    │   ├── 📄 create_database_ecommerce.sql
    │   ├── 📄 create_user_ecommerce_app.sql
    │   ├── 📄 grant_ecommerce_app_permissions.sql
    │   └── 📄 close_abandoned_carts.sql
    └── 📁 Queries/                           ← Occasional diagnostic or support queries
        ├── 📄 report_daily_checkout_summary.sql
        ├── 📄 stats_abandoned_carts_by_channel.sql
        └── 📄 find_open_cart_by_user_account_id.sql
```

The `Versioned/` and `Repeatable/` folder names are recommendations for repositories using script-oriented tools. Adapt their casing and spelling to the project convention, such as `versioned/` and `repeatable/` in lowercase repositories, and adapt the structure when the selected tool imposes different folders, such as Liquibase changelogs, EF Core migration classes or Sqitch `deploy/`, `revert/` and `verify/` folders.

Use a `{DatabaseOrConnectionKey}` level when a service has multiple databases or connection profiles. The key should match the logical connection configured by the application, such as `Ecommerce`, `Identity` or `Reporting`, and should follow the same folder naming style chosen for the project, such as `Ecommerce` or `ecommerce`.

`Operations/` and `Queries/` are intentionally outside automatic migration execution. They hold reviewed scripts that a developer or operator runs intentionally under the repository's operational process.

Use `Operations/` for intentional administrative actions that do not represent schema evolution managed by the migration tool, such as creating the database, creating the associated application user, granting permissions, rotating operational metadata or running controlled cleanup scripts.

Use `Queries/` for diagnostic, support, statistics or reporting SQL that should be versioned with the project but should not become a migrated routine or view, such as ad hoc reconciliation queries, custom support reports or analysis scripts for incidents.

## Repeatable SQL Artifact Organization

When the selected tool supports repeatable SQL scripts, group them by database schema and then by aggregate or domain concept:

```text
📁 Migrations/
    └── 📁 Repeatable/
        └── 📁 sales/
            └── 📁 shopping-cart/
                ├── 📄 R__shopping_cart_create.sql
                ├── 📄 R__shopping_cart_get_open_by_user_account_id.sql
                ├── 📄 R__shopping_cart_modify_add_item.sql
                ├── 📄 R__shopping_cart_modify_remove_item.sql
                ├── 📄 R__shopping_cart_get_checkout_summary.sql
                └── 📄 R__shopping_cart_view_abandoned_carts.sql
```

Folder names may use repository-friendly slugs such as `shopping-cart`, while SQL object names inside the scripts must follow the database engine convention.

For Evolve/Flyway-style repeatable scripts, use descriptive names that show the aggregate operation, but do not depend on file explorer order to communicate lifecycle. Alphabetical order changes with language choices such as `create/get/modify/remove/view` versus `crear/obtener/modificar/eliminar/vista`, and numeric prefixes can make routine names less natural. Other tools can preserve the same grouping intent using their own structure, such as Liquibase changesets or Sqitch deploy/revert/verify scripts.

## Aggregate-Based Routine Design

SQL routines should be designed around **domain aggregates**, following the same Bounded Contexts identified in DDD modeling:

- A domain module (`Sales`, `Inventory`) can correspond to a database schema.
- Routines for an aggregate (for example, `ShoppingCart`) should use the full aggregate name whenever possible, or a predictable aggregate abbreviation when the full name creates a practical problem.
- Use this aggregate-prefix convention only for routines. Views should follow the same object naming convention as tables.

Choose one prefix strategy per database boundary:

- Prefer the full aggregate name whenever possible, such as `shopping_cart` or `ShoppingCart`.
- Use an abbreviation or code based on the aggregate name when the full name creates a practical problem, such as excessive length, hard-to-scan routine names or an identifier limit in the target database engine. PostgreSQL identifiers are limited to 63 bytes by default, even though the internal `NAMEDATALEN` setting is commonly described as 64 bytes.
- Keep the prefix strategy consistent across the project. Do not mix full aggregate names and abbreviations for routine prefixes unless a documented exception is needed for a specific long aggregate name.

The complete routine name, including prefix, operation and detail, must follow the target database engine's object naming convention. If the database engine convention does not use underscores, do not add an underscore only to separate the prefix from the operation.

The patterns below are pseudocode for naming decisions. Adapt separators, casing, schema qualification and reserved words to the target database engine and to the project's documented conventions.

```text
[schema].[aggregate_abbreviation]_[operation_type]_[detail]
[Schema].[AggregateName][OperationType][Detail]
```

Common database engine conventions:

| Engine | Common Convention | Example Routine |
| --- | --- | --- |
| PostgreSQL | lower `snake_case` | `sales.shopping_cart_get_open_by_user_account_id` |
| MySQL / MariaDB | lower `snake_case` | `sales.shopping_cart_get_open_by_user_account_id` |
| SQL Server / Azure SQL | `PascalCase` | `Sales.ShoppingCartGetOpenByUserAccountId` |
| Oracle Database | `UPPER_SNAKE_CASE` or the established project convention | `SALES.SHOPPING_CART_GET_OPEN_BY_USER_ACCOUNT_ID` |
| Snowflake | `UPPER_SNAKE_CASE` unless quoted identifiers are intentionally used | `SALES.SHOPPING_CART_GET_OPEN_BY_USER_ACCOUNT_ID` |
| BigQuery | lower `snake_case` for datasets, tables and routines | `sales.shopping_cart_get_open_by_user_account_id` |

Examples for the `ShoppingCart` aggregate in the `sales` schema:

| Engine | Prefix Strategy | Routine | Description |
| --- | --- | --- | --- |
| PostgreSQL | Full name | `sales.shopping_cart_get_open_by_user_account_id` | Gets the open cart for a user |
| PostgreSQL | Full name | `sales.shopping_cart_modify_add_item` | Adds an item to the cart |
| MySQL / MariaDB | Full name | `shopping_cart_modify_add_item` | Adds an item to the cart |
| MySQL / MariaDB | Full name | `shopping_cart_modify_remove_item` | Removes an item from the cart |
| SQL Server | Full name | `Sales.ShoppingCartModifyAddItem` | Adds an item to the cart |
| SQL Server | Full name | `Sales.ShoppingCartGetOpenByUserAccountId` | Gets the open cart for a user |
| Oracle Database | Full name | `SALES.SHOPPING_CART_MODIFY_REMOVE_ITEM` | Removes an item from the cart |
| Snowflake | Full name | `SALES.SHOPPING_CART_GET_OPEN_BY_USER_ACCOUNT_ID` | Gets the open cart for a user |
| PostgreSQL | Abbreviation or code | `loyalty.crple_get_pending_expiration_by_account_id` | Uses an abbreviation or code for the long `CustomerRewardPointsLedgerEntry` aggregate |

Views over the aggregate can still live next to the aggregate's repeatable scripts, but the database object should use table-style naming. For example, the file `R__shopping_cart_view_abandoned_carts.sql` can define a PostgreSQL view named `sales.abandoned_shopping_cart`.

## Cross Reference

- [Data and Migrations: Relational Modeling](./relational-modeling.md) — relational schema design, primary keys, foreign keys and audit columns.
- [Migration Tools and Strategies](./tools-and-strategies.md) — tool-specific models and naming.
- [flwdb CLI](./cli.md) — Flowsy CLI usage with Evolve-style `V*` and `R__*` scripts.
- [PostgreSQL Conventions](./database-engines/postgresql.md) — PostgreSQL-specific naming and modeling.
- [SQL Server Conventions](./database-engines/sql-server.md) — SQL Server-specific naming and modeling.
- [MySQL and MariaDB Conventions](./database-engines/mysql-mariadb.md) — MySQL/MariaDB-specific naming and modeling.
- [Domain-Driven Design](../../../discovery/domain-driven-design.md) — aggregate design that gives rise to routines.
