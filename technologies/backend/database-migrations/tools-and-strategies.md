# Migration Tools and Strategies

Different migration tools use different models. Choose the tool that fits the project's stack, deployment model and review needs, then keep its conventions isolated from general database conventions.

## Selection Criteria

| Criterion | What to Consider |
| --- | --- |
| Ownership | Is the schema owned by one application, several services or a platform team? |
| Source of Truth | Is the schema defined by SQL, ORM models, changelogs, plan files or desired state definitions? |
| Rollback Model | Does the tool support rollback, revert, undo scripts, generated down migrations or roll-forward only? |
| Reviewability | Can reviewers see the exact SQL that will run in production? |
| Repeatable Objects | How does the tool manage views, functions, procedures, reference data or permissions? |
| CI/CD Fit | Can the tool validate, plan, apply and report status in pipelines? |
| Database Support | Does it support the target engines used by the project? |

## Evolve and Flyway

Use when the team wants SQL-first migrations with versioned scripts and repeatable scripts.

Official model:

- Versioned migrations are applied once, in version order, and are tracked with checksums.
- Repeatable migrations are re-applied when their checksum changes.
- Evolve and Flyway both use `V...` and `R...` file naming conventions.

Naming guidance:

- Use `VYYYY_MM_NNN__description.sql` when release review benefits from visible year, month and sequence.
- Use `VNNN__description.sql` when a simple global sequence is enough for the database boundary.
- Use `VYYYYMMDDHHMM__description.sql` or `VYYYY_MM_DD_NNN__description.sql` when parallel teams need timestamp-like ordering.
- Use `R__{aggregate_prefix}_{operation}.sql` for repeatable routines and views, grouped by schema and aggregate. Prefer `create`, then `get_*`, then `mut_*`, then `vw_*` files so review follows the aggregate lifecycle.

Recommended structure:

```text
📁 Resources/Databases/
└── 📁 Ecommerce/
    └── 📁 Migrations/
        ├── 📁 Versioned/
        │   ├── 📄 V2024_01_001__create_schema_sales.sql
        │   ├── 📄 V2024_01_002__create_table_shopping_cart.sql
        │   └── 📄 V2024_01_003__create_table_shopping_cart_item.sql
        └── 📁 Repeatable/
            └── 📁 sales/
                └── 📁 shopping-cart/
                    ├── 📄 R__shpcrt_create.sql
                    ├── 📄 R__shpcrt_get_open_by_user_account_id.sql
                    ├── 📄 R__shpcrt_mut_add_item.sql
                    ├── 📄 R__shpcrt_mut_remove_item.sql
                    └── 📄 R__shpcrt_vw_abandoned_carts.sql
```

Use [flwdb CLI](./cli.md) for the Flowsy command that runs Evolve-style migrations.

## Liquibase

Use when the team needs changelogs, changesets, preconditions, contexts, labels or multiple changelog formats.

Liquibase organizes changes in changelog files. A changelog contains ordered changesets, and changesets are the units Liquibase tracks as executed in `DATABASECHANGELOG`.

Naming guidance:

- Name changelog files by scope, such as `changelog.yaml`, `changelog-root.yaml` or `changelog-ecommerce.yaml`.
- Name changeset files with an ordered prefix and clear action, such as `2024-01-001-create-schema-sales.yaml`.
- Keep changeset ids stable, descriptive and unique per author/file combination.
- Keep large SQL bodies in `.sql` files when that improves reviewability, and reference them from the changelog.

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
