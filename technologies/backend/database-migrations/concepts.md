# Database Migrations: Concepts

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

Use a structure that separates migration-managed artifacts from occasional operational scripts:

```text
📁 Resources/Databases/
└── 📁 Ecommerce/                              ← Database or connection key
    ├── 📁 Migrations/                        ← Tool-managed migration files
    │   ├── 📁 Versioned/                     ← Ordered one-time changes, if the tool supports them
    │   └── 📁 Repeatable/                    ← Re-runnable objects, if the tool supports them
    │       └── 📁 sales/                     ← Database schema
    │           └── 📁 shopping-cart/         ← Domain aggregate
    ├── 📁 Operations/                        ← Occasional administrative or cleanup scripts
    │   └── 📄 close_abandoned_carts.sql
    └── 📁 Queries/                           ← Occasional diagnostic or support queries
        └── 📄 find_open_cart_by_user_account_id.sql
```

The `Versioned/` and `Repeatable/` folder names are recommendations for repositories using script-oriented tools. Adapt them when the selected tool imposes a different structure, such as Liquibase changelogs, EF Core migration classes or Sqitch `deploy/`, `revert/` and `verify/` folders.

Use `Resources/Databases/{DatabaseOrConnectionKey}` when a service has multiple databases or connection profiles. The key should match the logical connection configured by the application, such as `Ecommerce`, `Identity` or `Reporting`.

`Operations/` and `Queries/` are intentionally outside automatic migration execution. They hold reviewed scripts that a developer or operator runs intentionally under the repository's operational process.

## Repeatable SQL Artifact Organization

When the selected tool supports repeatable SQL scripts, group them by database schema and then by aggregate or domain concept:

```text
📁 Migrations/
    └── 📁 Repeatable/
        └── 📁 sales/
            └── 📁 shopping-cart/
                ├── 📄 R__shpcrt_create.sql
                ├── 📄 R__shpcrt_get_open_by_user_account_id.sql
                ├── 📄 R__shpcrt_mut_add_item.sql
                ├── 📄 R__shpcrt_mut_remove_item.sql
                └── 📄 R__shpcrt_vw_abandoned_carts.sql
```

For Evolve/Flyway-style repeatable scripts, order files by aggregate lifecycle and usage:

1. The routine that creates the aggregate: `R__shpcrt_create.sql`.
2. Routines that return aggregate read models: `R__shpcrt_get_*.sql`.
3. Routines that mutate the aggregate: `R__shpcrt_mut_*.sql`.
4. Views required by the aggregate: `R__shpcrt_vw_*.sql`.

This order makes the folder easier to scan: creation first, reads second, mutations third and derived views last. Other tools can preserve the same intent using their own structure, such as Liquibase changesets or Sqitch deploy/revert/verify scripts.

## Aggregate-Based Routine Design

SQL routines should be designed around **domain aggregates**, following the same Bounded Contexts identified in DDD modeling:

- A domain module (`Sales`, `Inventory`) can correspond to a database schema.
- Routines for an aggregate (for example, `ShoppingCart`) should be named with a predictable aggregate abbreviation.
- Use this aggregate-prefix convention only for routines. Views should follow the same object naming convention as tables.

```text
[schema].[aggregate_abbreviation]_[operation_type]_[detail]
```

Examples for the `ShoppingCart` aggregate in the `sales` schema:

| Routine | Description |
| --- | --- |
| `sales.shpcrt_create` | Creates a new cart |
| `sales.shpcrt_get_open_by_user_account_id` | Gets the open cart for a user |
| `sales.shpcrt_mut_add_item` | Adds an item to the cart |
| `sales.shpcrt_mut_remove_item` | Removes an item from the cart |

Views over the aggregate can still live next to the aggregate's repeatable scripts, but the database object should use table-style naming. For example, the file `R__shpcrt_vw_abandoned_carts.sql` can define a view named `sales.abandoned_shopping_cart`.

## Schema Integrity

Every table creation script should include the keys, constraints and audit fields required by the domain:

```sql
-- Primary key
shopping_cart_id uuid PRIMARY KEY,

-- Audit columns
created_at         timestamptz NOT NULL DEFAULT now(),
created_by_user_id uuid        NOT NULL,
updated_at         timestamptz NOT NULL DEFAULT now(),
updated_by_user_id uuid        NOT NULL,
record_status      text        NOT NULL DEFAULT 'Active',

-- Constraints
CONSTRAINT ck_shopping_cart_record_status
    CHECK (record_status IN ('Active', 'SoftDeleted', 'HardDeleted'))
```

Adapt data types and defaults to the target database engine.

## Cross Reference

- [Migration Tools and Strategies](./tools-and-strategies.md) — tool-specific models and naming.
- [flwdb CLI](./cli.md) — Flowsy CLI usage with Evolve-style `V*` and `R__*` scripts.
- [PostgreSQL Conventions](../../../conventions/postgresql.md) — PostgreSQL-specific naming and modeling.
- [SQL Server Conventions](../../../conventions/sql-server.md) — SQL Server-specific naming and modeling.
- [MySQL and MariaDB Conventions](../../../conventions/mysql-mariadb.md) — MySQL/MariaDB-specific naming and modeling.
- [Domain-Driven Design](../../../discovery/domain-driven-design.md) — aggregate design that gives rise to routines.
