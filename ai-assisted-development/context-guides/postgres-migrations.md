---
title: PostgreSQL and Migrations
context_guide: postgres-migrations
description: Minimum context for agents changing PostgreSQL schemas, routines and migration scripts.
intent:
  - create PostgreSQL migration
  - modify SQL routines
  - validate schema changes
  - update database tooling
applies_when:
  - the task modifies database schema
  - the task changes tables, indexes, constraints, routines or seed data
  - the task mentions a migration tool such as Evolve, Flyway, Liquibase, DbUp, EF Core, Sqitch, Atlas or flwdb
read_first:
  - /conventions/postgresql.md
  - /technologies/backend/database-migrations/concepts.md
read_if_implementing:
  - /technologies/backend/database-migrations/tools-and-strategies.md
  - /technologies/backend/database-migrations/cli.md
  - /technologies/testing/database-migrations.md
  - /technologies/testing/postgresql.md
related_guides:
  - backend-vsa-minimal-api
  - specs-driven-development
validation:
  - migration build or validation command used by the repository
  - clean database migration run
  - upgrade run from an existing database when relevant
avoid:
  - destructive changes without an explicit rollout decision
  - unreviewed repeatable scripts that rewrite production routines unexpectedly
  - tests that only check script execution without asserting resulting schema or data behavior
---

# PostgreSQL and Migrations

Use this guide when changing tables, indexes, constraints, routines, seed data or migration tooling.

## Minimum Context

- Identify the database tool in use: Evolve, Flyway, Liquibase, DbUp, EF Core, Sqitch, Atlas, `flwdb` or a project-specific wrapper.
- Review the selected tool's structure and naming before adding files.
- Identify affected schemas, tables, indexes, constraints, routines and seed data.
- Check rollout constraints: data volume, downtime tolerance, backward compatibility and rollback expectations.
- Check whether application code, API contracts or reports depend on the changed database shape.
- Consult [Testing Database Migrations](/technologies/testing/database-migrations.md) and [PostgreSQL Testing](/technologies/testing/postgresql.md) when the change affects schema behavior or stored routines.

## Expected Structure

Follow the repository's migration layout. Common patterns include:

```text
📁 Resources/Databases/
└── 📁 Ecommerce/
    ├── 📁 Migrations/
    │   ├── 📁 Versioned/
    │   │   ├── 📄 create_schema_sales.sql
    │   │   └── 📄 create_table_shopping_cart.sql
    │   └── 📁 Repeatable/
    │       └── 📁 sales/
    │           └── 📁 shopping-cart/
    │               ├── 📄 create_cart.sql
    │               └── 📄 get_open_by_user_account_id.sql
    ├── 📁 Operations/
    │   └── 📄 close_abandoned_carts.sql
    └── 📁 Queries/
        └── 📄 find_open_cart_by_user_account_id.sql
```

## Implementation Rules

- Keep migration artifacts deterministic and idempotent only when the chosen tool expects idempotency.
- Treat destructive changes as explicit rollout decisions.
- Add constraints and indexes intentionally; document performance or data-integrity assumptions when needed.
- Keep repeatable routines and views under `Migrations/Repeatable/{schema}/{aggregate}/`, aligned with naming and schema conventions.
- Keep occasional administrative scripts in `Operations/` and diagnostic/support queries in `Queries/`; do not treat them as automatic migrations.
- Prefer additive changes when supporting zero-downtime or staged releases.
- Separate schema evolution from large data backfills unless the project has an established safe pattern for both.
- Validate the result with a clean database and, when relevant, with an upgraded database that already contains previous migrations.
- Assert the resulting schema, constraints, indexes, routines and representative data behavior in tests when the risk justifies it.
- Capture representative validation output in the spec or change record when migrations are part of planned work.

## References

- Conventions: [PostgreSQL](/conventions/postgresql.md).
- Migration concepts: [Database Migrations](/technologies/backend/database-migrations/concepts.md).
- Tooling: [Migration Tools and Strategies](/technologies/backend/database-migrations/tools-and-strategies.md) and [flwdb CLI](/technologies/backend/database-migrations/cli.md).
- Testing: [Database Migrations](/technologies/testing/database-migrations.md), [PostgreSQL](/technologies/testing/postgresql.md) and [Integration Tests](/technologies/testing/integration-tests.md).
- Evidence: [Evidence and Reporting](/technologies/testing/evidence-and-reporting.md).
