---
title: flwdb CLI
description: Flowsy database CLI (Flowsy.Cli.Db) for Evolve-style migrations.
type: profile
audience: Backend and platform people running database migrations.
canonical: true
canonicalSource: /engineering/data/migrations/tools-and-strategies
---

# flwdb CLI

Use this page as the Flowsy CLI reference for projects that run database migrations through `flwdb`. For broader comparison with other tools, see [Migration Tools and Strategies](./tools-and-strategies).

## Basic Usage

`flwdb` runs migrations from the command line and is suitable for local development, CI/CD pipelines and controlled environment initialization.

`flwdb` uses Evolve internally for migration execution. That means Flowsy projects can use the Evolve-style `V*` and `R*` SQL script model while keeping the developer-facing command surface consistent with Flowsy tooling.

Package registry: [NuGet](https://www.nuget.org/packages/Flowsy.Cli.Db)

```bash
flwdb migrate \
  --connection "Host=localhost;Database=ecommerce;Username=app;Password=secret" \
  --location "./Resources/Databases/Ecommerce/Migrations"
```

The `--location` value should point to the migration folder chosen by the project. `Resources/Databases/Ecommerce/Migrations` is a .NET-friendly example; projects that use lowercase resource paths can use an equivalent path such as `resources/databases/ecommerce/migrations`.

For CI/CD environments, use the pipeline's environment variables or secret management mechanism as the source for command arguments. `flwdb` does not read options from environment variables by itself, but the CI/CD shell can expand those variables when invoking the tool.

```bash
flwdb migrate \
  --connection "$ECOMMERCE_DB_CONNECTION" \
  --location "./Resources/Databases/Ecommerce/Migrations"
```

## Script Convention

Because `flwdb` delegates migration execution to Evolve, use Evolve-style `V*` and `R*` naming. Keep this convention in migration-tool documentation rather than in database-engine conventions. Adapt folder names and casing to the repository convention:

```text
Resources/Databases/{DatabaseOrConnectionKey}/Migrations/Versioned/
  → V...__description.sql

Resources/Databases/{DatabaseOrConnectionKey}/Migrations/Repeatable/{schema}/{aggregate}/
  → R__description.sql

resources/databases/{database-or-connection-key}/migrations/versioned/
  → V...__description.sql

resources/databases/{database-or-connection-key}/migrations/repeatable/{schema}/{aggregate}/
  → R__description.sql
```

Choose the versioned script format that provides the most value for the project, and keep one consistent style per database boundary. Recommended options:

- `VYYYY_MM_NNN__description.sql`
  Use it when the year, month and sequence improve ordering and release review.
  Example: `V2026_05_001__create_schema_sales.sql`

- `VNNN__description.sql`
  Use it when a simple global sequence is enough.
  Example: `V001__create_schema_sales.sql`

- `VMAJOR_MINOR_PATCH_NNN__description.sql`
  Use it when scripts are grouped by product or package version.
  Example: `V1_4_0_001__add_cart_status.sql`

- `VYYYYMMDDHHMM__description.sql`
  Use it when timestamp-like ordering is useful for distributed teams.
  Example: `V202605021430__add_cart_status.sql`

- `VYYYY_MM_DD_NNN__description.sql`
  Use it when daily sequencing helps coordinate many parallel migrations.
  Example: `V2026_05_02_001__add_cart_status.sql`

For repeatable scripts, group files by schema and aggregate. Use descriptive operation names, but do not depend on file explorer ordering to communicate lifecycle because lexical order changes with the project language and operation vocabulary.

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

Prefer the full aggregate name, such as `shopping_cart`, whenever possible. Use an abbreviation or code based on the aggregate name, such as `crple` for `CustomerRewardPointsLedgerEntry`, when the full name creates a practical problem, such as excessive length or a database engine identifier limit. PostgreSQL identifiers are limited to 63 bytes by default, even though the internal `NAMEDATALEN` setting is commonly described as 64 bytes. Keep the prefix strategy consistent across the project, documenting any exception for a specific long aggregate name. The SQL routine created by the script must follow the target database engine convention: lower `snake_case` for PostgreSQL and MySQL, `PascalCase` for SQL Server, `UPPER_SNAKE_CASE` for database engines or projects that use uppercase unquoted identifiers, and so on. Do not add `_` between prefix and operation when the selected convention does not use underscores.

Keep `Operations/` and `Queries/` outside automatic migration execution.

## Related Tools

- [Evolve](https://evolve-db.netlify.app/)
- [Flyway](https://documentation.red-gate.com/flyway)
- [Liquibase](https://www.liquibase.com/)
- [DbUp](https://dbup.readthedocs.io/)
- [EF Core Migrations](https://learn.microsoft.com/en-us/ef/core/managing-schemas/migrations/)
- [Sqitch](https://sqitch.org/)
- [Atlas](https://atlasgo.io/)

## Cross Reference

- [Migration Concepts](./concepts)
- [Data and Migrations: Relational Modeling](../relational-modeling)
- [Migration Tools and Strategies](./tools-and-strategies)
- [PostgreSQL Conventions](../database-engines/postgresql)
