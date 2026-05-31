# Data and Migrations: Tools and Strategies

Different migration tools use different models. Choose the tool that fits the project's stack, deployment model and review needs, then keep its conventions isolated from general database conventions.

All folder trees and command examples in this page are reference implementations. Adapt paths, casing, file extensions, package layout and generated artifacts to the selected tool, repository conventions, language, framework and deployment process.

## Selection Criteria

| Criterion | What to Consider |
| --- | --- |
| Ownership | Is the schema owned by one application, several services or a platform team? |
| Source of Truth | Is the schema defined by SQL, ORM models, changelogs, plan files or desired state definitions? |
| Rollback Model | Does the tool support rollback, revert, undo scripts, generated down migrations or roll-forward only? |
| Reviewability | Can reviewers see the exact SQL that will run in production? |
| Repeatable Objects | How does the tool manage views, functions, procedures, reference data or permissions? |
| CI/CD Fit | Can the tool validate, plan, apply and report status in pipelines? |
| Database Support | Does it support the target database engines used by the project? |

## Aggregate Operation Vocabulary

Use a stable operation vocabulary for routines, views and recreated database objects. The vocabulary should describe operations over **domain aggregates**, not isolated table-level actions.

### Language Strategy

Choose one language strategy per project, or per bounded context when the system is intentionally multilingual, and keep it consistent across migration tools. Align routine, view, table and column names with the domain model and data model language chosen by the team.

| Strategy | When to Choose It | Example | Trade-Off |
| --- | --- | --- | --- |
| Technical English operators | The project uses English tooling, mixed-language teams or wants compact cross-stack conventions. | `shopping_cart_modify_add_item`, `carrito_compra_modify_add_item` | Operators stay short and familiar, but Spanish domain names can read as mixed-language identifiers. |
| Domain-language operators | The project keeps domain model, data model and documentation in a language other than English. | `carrito_compra_modificar_agregar_articulo` | Names read naturally in the project language, but the team must maintain a disciplined glossary. |

Document the chosen strategy in project conventions or an ADR. If the domain model uses Spanish while infrastructure code uses English, make the boundary explicit so scripts do not drift into accidental mixed-language naming.

### Recommended Operators

| Technical English | Spanish Equivalent | Use | Rationale |
| --- | --- | --- | --- |
| `create` | `crear` | Create the aggregate root. | Clear and common; no abbreviation needed. |
| `get` | `obtener` | Return data or read models without changing state. | `get` is already short; `obtener` keeps Spanish naming explicit. |
| `modify` | `modificar` | Change the state of an existing aggregate. | Covers adding/removing internal items, assigning, confirming, canceling or changing status. |
| `remove` | `eliminar` | Remove or retire the aggregate root. | Reserve it for aggregate-level removal; internal removals are aggregate modifications. |
| `view` | `vista` | Define a recreated database view. | More explicit than `vw`, especially when teams mix database engines or languages. |

Use `remove` / `eliminar` for removal of the aggregate root. Removing an item, relationship or value inside the aggregate is a `modify` / `modificar` operation because it changes the state of an existing aggregate.

### Query Naming

| Pattern | Use | Example |
| --- | --- | --- |
| `get_by_<key>` | Direct lookup by identifier or natural key. | `shopping_cart_get_by_id` |
| `get_<result>_by_<criteria>` | The returned state or read model matters. | `shopping_cart_get_open_by_user_account_id` |
| `get_<result>` | The result is self-explanatory and criteria are not part of the public routine name. | `invoice_get_pending_payment` |

## Evolve and Flyway

Use when the team wants SQL-first migrations with versioned scripts and repeatable scripts.

### Migration Model

- Versioned migrations are applied once, in version order, and are tracked with checksums.
- Repeatable migrations are re-applied when their checksum changes.
- Evolve and Flyway both use `V...` and `R...` file naming conventions.

### Choosing Script Type

| Use | When to Choose It | Typical Content |
| --- | --- | --- |
| Versioned script `V...` | The change must run once and then remain immutable. | Schemas, tables, columns, constraints, indexes, data corrections and other structural changes. |
| Repeatable script `R...` | The object can be safely recreated whenever its definition changes. | Routines, views and other replaceable objects implemented with `DROP` + `CREATE`, `CREATE OR REPLACE` or an equivalent idempotent pattern. |

Repeatable scripts should hold definitions whose desired final state is more important than the history of each edit. Keep destructive data changes, one-time backfills and table evolution in versioned scripts.

### Naming Rules

For versioned scripts:

- Use `VYYYY_MM_NNN__description.sql` when release review benefits from visible year, month and sequence.
- Use `VNNN__description.sql` when a simple global sequence is enough for the database boundary.
- Use `VYYYYMMDDHHMM__description.sql` or `VYYYY_MM_DD_NNN__description.sql` when parallel teams need timestamp-like ordering.

For repeatable routines, views and other recreated objects, apply the aggregate operation vocabulary and start from the target database engine convention:

- Use `R__{aggregate_prefix}_{operation}.sql` for script file names when the target database engine uses `snake_case`.
- Adapt separator and casing when the target database engine uses another naming style.
- Prefer the full aggregate name as the routine prefix whenever possible.
- Use an abbreviation or code based on the aggregate name only when the full name creates a practical problem, such as excessive length or identifier limits.
- Keep one prefix strategy across the project, and document any exception for a specific long aggregate name.

| Case Style | Engine Examples | Routine Name Example | Repeatable File Example |
| --- | --- | --- | --- |
| lower `snake_case` | PostgreSQL, MySQL, MariaDB, BigQuery | `sales.shopping_cart_get_open_by_user_account_id` | `R__shopping_cart_get_open_by_user_account_id.sql` |
| `PascalCase` | SQL Server, Azure SQL | `Sales.ShoppingCartGetOpenByUserAccountId` | `R__ShoppingCartGetOpenByUserAccountId.sql` |
| `UPPER_SNAKE_CASE` | Oracle Database, Snowflake | `SALES.SHOPPING_CART_GET_OPEN_BY_USER_ACCOUNT_ID` | `R__SHOPPING_CART_GET_OPEN_BY_USER_ACCOUNT_ID.sql` |
| Abbreviation or code for a long aggregate | Engine-specific exception | `loyalty.crple_get_pending_expiration_by_account_id` | `R__crple_get_pending_expiration_by_account_id.sql` |

PostgreSQL identifiers are limited to 63 bytes by default, even though the internal `NAMEDATALEN` setting is commonly described as 64 bytes. That is a good example of when an abbreviation or code can be justified.

Recommended structure:

The paths below use a .NET-friendly `Resources/Databases/...` base folder. Keep the same logical layout with the base path and folder casing chosen by the project, such as `resources/databases/...` in lowercase repositories.
Do not rely on file explorer ordering to communicate routine lifecycle. Keep script names descriptive and group them by schema and aggregate; lexical order will vary by language, operation vocabulary and optional tooling conventions.

```text
📁 Resources/Databases/
└── 📁 Ecommerce/
    └── 📁 Migrations/
        ├── 📁 Versioned/
        │   ├── 📄 V2024_01_001__create_schema_sales.sql
        │   ├── 📄 V2024_01_002__create_table_shopping_cart.sql
        │   └── 📄 V2024_01_003__create_table_shopping_cart_item.sql
        └── 📁 Repeatable/
            ├── 📁 sales/
            │   ├── 📁 shopping-cart/
            │   │   ├── 📄 R__shopping_cart_create.sql
            │   │   ├── 📄 R__shopping_cart_get_open_by_user_account_id.sql
            │   │   ├── 📄 R__shopping_cart_modify_add_item.sql
            │   │   ├── 📄 R__shopping_cart_modify_remove_item.sql
            │   │   ├── 📄 R__shopping_cart_get_checkout_summary.sql
            │   │   └── 📄 R__shopping_cart_view_abandoned_carts.sql
            │   └── 📁 sales-order/
            │       ├── 📄 R__sales_order_create.sql
            │       ├── 📄 R__sales_order_get_by_customer_id.sql
            │       └── 📄 R__sales_order_modify_confirm.sql
            ├── 📁 billing/
            │   ├── 📁 invoice/
            │   │   ├── 📄 R__invoice_create.sql
            │   │   ├── 📄 R__invoice_get_pending_payment.sql
            │   │   └── 📄 R__invoice_modify_mark_as_paid.sql
            │   └── 📁 subscription/
            │       ├── 📄 R__subscription_create.sql
            │       ├── 📄 R__subscription_get_active_by_account_id.sql
            │       ├── 📄 R__subscription_modify_cancel.sql
            │       └── 📄 R__subscription_remove.sql
            ├── 📁 inventory/
            │   └── 📁 inventory-item/
            │       ├── 📄 R__inventory_item_create.sql
            │       ├── 📄 R__inventory_item_get_available_by_sku.sql
            │       └── 📄 R__inventory_item_modify_reserve.sql
            └── 📁 loyalty/
                └── 📁 customer-reward-points-ledger-entry/
                    ├── 📄 R__crple_get_pending_expiration_by_account_id.sql
                    └── 📄 R__crple_modify_expire_points.sql
```

> [!info] ℹ️ flwdb
> When convenient for the team and the project, use the [flwdb CLI](./cli.md) for running Evolve/Flyway-style migrations.

## Liquibase

Use when the team needs changelogs, changesets, preconditions, contexts, labels or multiple changelog formats.

Liquibase organizes changes in changelog files. A changelog contains ordered changesets, and changesets are the units Liquibase tracks as executed in `DATABASECHANGELOG`.

Naming guidance:

- Name changelog files by scope, such as `changelog.yaml`, `changelog-root.yaml` or `changelog-ecommerce.yaml`.
- Name changeset files with an ordered prefix and clear action, such as `2024-01-001-create-schema-sales.yaml`.
- Keep changeset ids stable, descriptive and unique per author/file combination.
- Keep large SQL bodies in `.sql` files when that improves reviewability, and reference them from the changelog.
- Apply the aggregate operation vocabulary when naming SQL files that define recreated routines, views or other replaceable objects.

Recommended structure:

```text
📁 Resources/Databases/
└── 📁 Ecommerce/
    └── 📁 Liquibase/
        ├── 📄 changelog.yaml
        ├── 📁 changesets/
        │   ├── 📄 2024-01-001-create-schema-sales.yaml
        │   └── 📄 2024-01-002-create-shopping-cart.yaml
        └── 📁 sql/
            └── 📁 sales/
                └── 📁 shopping-cart/
                    ├── 📄 create_cart.sql
                    └── 📄 get_open_by_user_account_id.sql
```

Keep each changeset focused. Use preconditions when execution depends on database state, and define rollback when the operational model expects it.

## DbUp

Use when a .NET application wants to execute embedded or file-based scripts and track them in a journal table.

DbUp tracks executed scripts in a journal table by default. It can also use a `NullJournal` for idempotent scripts that should run every time, such as objects recreated with `CREATE OR REPLACE`.

Naming guidance:

- Use sortable names for journaled scripts, such as `2024-01-001-create-schema-sales.sql` or `001-create-schema-sales.sql`.
- Keep journaled scripts immutable once they may have run in a shared environment.
- Use clear folders such as `Once/` and `Everytime/` when the project mixes journaled and idempotent scripts.
- Name idempotent scripts by object or aggregate behavior, such as `view_abandoned_carts.sql` or `get_open_by_user_account_id.sql`.
- Apply the aggregate operation vocabulary to idempotent scripts that recreate routines, views or other replaceable objects.

Recommended structure:

```text
📁 Resources/Databases/
└── 📁 Ecommerce/
    └── 📁 DbUp/
        ├── 📁 Once/
        │   ├── 📄 2024-01-001-create-schema-sales.sql
        │   └── 📄 2024-01-002-create-shopping-cart.sql
        └── 📁 Everytime/
            └── 📁 sales/
                └── 📁 shopping-cart/
                    ├── 📄 create_cart.sql
                    └── 📄 view_abandoned_carts.sql
```

Keep journaled scripts immutable once they may have run in a shared environment.

## EF Core Migrations

Use when the application owns the schema and the EF Core model is the primary source of schema evolution.

EF Core adds migrations after model changes and stores migration files in source control. Generated migrations should still be reviewed because the generated SQL can have operational impact.

Naming guidance:

- Let EF Core generate the timestamp prefix and use a concise PascalCase migration name, such as `CreateShoppingCart`.
- Prefer names that describe the business or schema change, not the implementation detail that happened in the model.
- Keep the generated model snapshot with the migration; do not hand-edit it unless the project has a clear review path for that change.
- Generate SQL scripts for deployment review when database operators need the exact SQL.

Recommended structure:

```text
📁 src/
└── 📁 Ecommerce.Infrastructure/
    └── 📁 Persistence/
        ├── 📁 Migrations/
        │   ├── 📄 20240101010101_CreateShoppingCart.cs
        │   └── 📄 EcommerceDbContextModelSnapshot.cs
        └── 📄 EcommerceDbContext.cs
```

Use SQL scripts generated from EF migrations in deployment pipelines when reviewers or operators need to inspect the exact database changes.

## Sqitch

Use when the team wants database-native scripts with explicit deploy, revert and verify phases plus dependency-aware planning.

Sqitch uses a plan file and change scripts. It does not require numbered migration filenames; changes are coordinated through the plan.

Naming guidance:

- Name changes by intent and object, such as `create_shopping_cart` or `add_cart_status`.
- Keep matching script names under `deploy/`, `revert/` and `verify/` so the plan is easy to audit.
- Use the plan file for ordering and dependencies instead of encoding sequence numbers in file names.
- Prefer small changes that can be deployed, reverted and verified independently.
- Use the aggregate operation vocabulary for changes that define recreated aggregate routines or views.

Recommended structure:

```text
📁 Resources/Databases/
└── 📁 Ecommerce/
    └── 📁 Sqitch/
        ├── 📄 sqitch.plan
        ├── 📁 deploy/
        │   └── 📄 create_shopping_cart.sql
        ├── 📁 revert/
        │   └── 📄 create_shopping_cart.sql
        └── 📁 verify/
            └── 📄 create_shopping_cart.sql
```

Use verify scripts to prove the expected database objects exist and behave as intended.

## Atlas

Use when the team wants a declarative or versioned DevOps workflow for database schemas.

Atlas supports declarative workflows, where desired schema state is compared against the current database, and versioned workflows, where migration plans are generated and applied.

Naming guidance:

- In declarative workflows, name schema files by database, service or bounded context, such as `ecommerce.sql`.
- In versioned workflows, keep generated migration file names sortable, commonly timestamp-based, and commit `atlas.sum` with them.
- Review generated migration names and content before applying them to shared environments.
- Keep hand-written SQL and generated plans in separate folders when both are used.

Recommended structure:

```text
📁 Resources/Databases/
└── 📁 Ecommerce/
    └── 📁 Atlas/
        ├── 📄 atlas.hcl
        ├── 📁 schema/
        │   └── 📄 ecommerce.sql
        └── 📁 migrations/
            ├── 📄 20240101010101.sql
            └── 📄 atlas.sum
```

Review generated plans before applying them to shared or production environments.

## References

- [Evolve Concepts](https://evolve-db.netlify.app/concepts/)
- [Flyway Versioned Migrations](https://documentation.red-gate.com/flyway/flyway-concepts/migrations/versioned-migrations)
- [Flyway Repeatable Migrations](https://documentation.red-gate.com/fd/repeatable-migrations-273973335.html)
- [Liquibase Core Concepts](https://www.liquibase.org/get-started/core-usage/liquibase-core-concepts-author-database-changes)
- [DbUp Journaling](https://dbup.readthedocs.io/en/latest/more-info/journaling/)
- [EF Core Migrations](https://learn.microsoft.com/en-us/ef/core/managing-schemas/migrations/managing)
- [Sqitch Manual](https://sqitch.org/docs/manual/sqitch/)
- [Atlas Documentation](https://atlasgo.io/docs)
