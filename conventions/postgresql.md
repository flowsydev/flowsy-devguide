# PostgreSQL Conventions

Naming, modeling and migration guidelines for PostgreSQL databases in the Flowsy ecosystem.

## General Naming

Use `snake_case` consistently and explicitly for all database objects:

| Object | Convention | Example |
| --- | --- | --- |
| Tables | `snake_case` | `shopping_cart`, `user_account` |
| Columns | `snake_case` | `shopping_cart_id`, `creation_instant` |
| Indexes | `ix_[table]_[columns]` | `ix_shopping_cart_user_account_id` |
| FK constraints | `fk_[table]_[reference]` | `fk_cart_item_shopping_cart` |
| CHECK constraints | `ck_[table]_[description]` | `ck_cart_item_quantity_positive` |
| Enumerated types | `snake_case` | `lifecycle_status` |

## Temporal Types

- Prefer `timestamp with time zone` (`timestamptz`) for all audit and event fields.
- Avoid `timestamp without time zone` in data shared between systems or regions.
- Minimum audit columns per table:

```sql
created_at timestamptz NOT NULL DEFAULT now(),
updated_at timestamptz NOT NULL DEFAULT now()
```

## SQL Routines (Functions and Procedures)

Naming convention for routines based on the aggregate they manage:

```text
[schema].[aggregate_abbreviation]_[operation_type]_[detail]
```

Common operation types:

| Type | Description |
| --- | --- |
| `create` | Insert new record |
| `get` | Query that returns one or more records |
| `update` | Update existing record |
| `delete` | Delete record |

Examples:

```
sales.shpcrt_create
sales.shpcrt_get_open_by_user_account_id
sales.shpcrt_list_abandoned
```

## Views

```text
[schema].[abbreviation]_vw_[descriptive_name]
```

Example: `sales.shpcrt_vw_abandoned_carts`

## Migrations

Every schema modification must be reproducible via versioned migrations.

### Versioned Scripts

```text
V[YYYY]_[MM]_[NNN]__[description_in_snake_case].sql
```

Examples:

```text
V2024_01_001__create_schema_sales.sql
V2024_01_002__create_table_shopping_cart.sql
V2024_02_001__add_column_lifecycle_status.sql
```

### Repeatable Scripts

For objects that are recreated (views, functions, procedures):

```text
R__[description_in_snake_case].sql
```

Examples:

```text
R__sales_shpcrt_vw_abandoned_carts.sql
R__sales_shpcrt_get_open_by_user_account_id.sql
```

### Migration Rules

- Avoid untraceable manual changes in shared environments.
- Test migrations forward and rollback when the engine allows it.
- Versioned scripts are immutable once applied in production.
- Repeatable scripts are re-executed when their content changes (different hash).

## SQL Folder Structure

```text
Resources/Databases/
├── Migrations/          ← Versioned scripts (V...)
├── Operations/          ← Repeatable DML routines (R__ functions/procedures)
└── Reports/             ← Views and read queries (R__ views)
```

## Value Object Modeling

- Use atomic columns for simple data with frequent queries.
- Use `jsonb` for composite structures when it provides real flexibility.
- Define explicit constraints in the schema:

```sql
ALTER TABLE shopping_cart_item
    ADD CONSTRAINT ck_cart_item_quantity_positive CHECK (quantity > 0);
```

## Integrity and Performance

- Define explicit primary keys (`uuid` or `bigint`) and foreign keys.
- Index based on actual query patterns, not preventively.
- Review execution plans (`EXPLAIN ANALYZE`) for critical queries.
- Use `NOT NULL` on columns required by the domain.

## Cross Reference

For routine design and domain-aligned migrations, see [Migrations: Concepts](../technologies/backend/database-migrations/concepts.md) and the [Domain-Driven Design](../discovery/domain-driven-design.md) guide.
