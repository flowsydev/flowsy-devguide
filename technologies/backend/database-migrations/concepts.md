# Database Migrations: Concepts

Guide for managing schema changes in PostgreSQL via versioned and repeatable migrations. Migrations ensure that database changes are reproducible, traceable and consistent across all environments.

## Principles

- Every schema modification must be reproducible via **versioned migrations**.
- Avoid untraceable manual changes in shared environments.
- Migrations are **code**: they must live in the repository, be reviewed in PRs and deployed with the application.
- Test migrations forward and rollback when the engine allows it.

## Script Types

### Versioned Scripts

Executed **once**, in sequential order. Once applied in production, they are **immutable**.

```
V[YYYY]_[MM]_[NNN]__[description_in_snake_case].sql
```

Examples:

```
V2024_01_001__create_schema_sales.sql
V2024_01_002__create_table_shopping_cart.sql
V2024_01_003__create_table_shopping_cart_item.sql
V2024_02_001__add_column_lifecycle_status_to_shopping_cart.sql
```

### Repeatable Scripts

Re-executed **automatically when their content changes** (based on file hash). Ideal for objects that are recreated such as views, functions and stored procedures.

```
R__[description_in_snake_case].sql
```

Examples:

```
R__sales_shpcrt_vw_abandoned_carts.sql
R__sales_shpcrt_get_open_by_user_account_id.sql
R__sales_shpcrt_create.sql
```

## SQL Folder Structure

```text
Resources/Databases/
├── Migrations/       ← Versioned scripts (V...)
│   ├── V2024_01_001__create_schema_sales.sql
│   └── V2024_01_002__create_table_shopping_cart.sql
├── Operations/       ← Repeatable DML routines (R__ functions/procedures)
│   ├── R__sales_shpcrt_create.sql
│   └── R__sales_shpcrt_get_open_by_user_account_id.sql
└── Reports/          ← Views and read queries (R__ views)
    └── R__sales_shpcrt_vw_abandoned_carts.sql
```

## Aggregate-Based Routine Design

SQL routines are designed around **domain aggregates**, following the same Bounded Contexts identified in DDD modeling:

- A domain module (`Sales`, `Inventory`) corresponds to a **PostgreSQL schema**.
- Routines for an aggregate (e.g. `ShoppingCart`) are prefixed with the schema and aggregate abbreviation:

```
[schema].[aggregate_abbreviation]_[operation_type]_[detail]
```

Examples for the `ShoppingCart` aggregate in the `sales` schema:

| Routine | Description |
| --- | --- |
| `sales.shpcrt_create` | Creates a new cart |
| `sales.shpcrt_get_open_by_user_account_id` | Gets the open cart for a user |
| `sales.shpcrt_list_abandoned` | Lists abandoned carts |
| `sales.shpcrt_add_item` | Adds an item to the cart |
| `sales.shpcrt_remove_item` | Removes an item from the cart |

This design ensures that:
- Routines are **predictable and discoverable** by convention.
- Changes to an aggregate are **localized** to SQL files for that aggregate.
- The SQL structure reflects the **ubiquitous language** of the domain.

## Schema Integrity

Every table creation script must include:

```sql
-- Primary key
shopping_cart_id  uuid PRIMARY KEY,

-- Audit columns
creation_instant      timestamptz NOT NULL DEFAULT now(),
last_mutation_instant timestamptz NOT NULL DEFAULT now(),
lifecycle_status      text NOT NULL DEFAULT 'Active',

-- Constraints
CONSTRAINT ck_shopping_cart_lifecycle_status
    CHECK (lifecycle_status IN ('Active', 'SoftDeleted', 'HardDeleted'))
```

## Cross Reference

- [PostgreSQL Conventions](../../../conventions/postgresql.md) — detailed naming of SQL objects.
- [Evolve and Flyway: Tools](./evolve-flyway.md) — how to run migrations.
- [Domain-Driven Design](../../../discovery/domain-driven-design.md) — aggregate design that gives rise to routines.
