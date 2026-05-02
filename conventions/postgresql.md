# PostgreSQL Conventions

Naming and modeling guidelines for PostgreSQL databases in the Flowsy ecosystem.

## General Naming

Use `snake_case` consistently and explicitly for all database objects:

| Object | Convention | Example |
| --- | --- | --- |
| Tables | `snake_case` | `shopping_cart`, `user_account` |
| Columns | `snake_case` | `shopping_cart_id`, `created_at` |
| Indexes | `ix_[table]_[columns]` | `ix_shopping_cart_user_account_id` |
| FK constraints | `fk_[table]_[reference]` | `fk_cart_item_shopping_cart` |
| CHECK constraints | `ck_[table]_[description]` | `ck_cart_item_quantity_positive` |
| Enumerated types | `snake_case` | `record_status` |

## Temporal Types

- Prefer `timestamp with time zone` (`timestamptz`) for all audit and event fields.
- Avoid `timestamp without time zone` in data shared between systems or regions.
- Minimum audit columns per table:

```sql
created_at         timestamptz NOT NULL DEFAULT now(),
created_by_user_id uuid        NOT NULL,
updated_at         timestamptz NOT NULL DEFAULT now(),
updated_by_user_id uuid        NOT NULL
```

These names are the database equivalent of the entity properties `CreatedAt`, `CreatedByUserId`, `UpdatedAt` and `UpdatedByUserId`.

- When maintaining an event log per entity, use at least:

```sql
event_timestamp   timestamptz NOT NULL DEFAULT now(),
event_type        text        NOT NULL,
payload           jsonb       NOT NULL,
operation_context jsonb       NULL
```

These names are the database equivalent of `EventTimestamp`, `EventType`, `Payload` and `OperationContext`.

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
| `mut` | Mutate an existing aggregate |

Examples:

```
sales.shpcrt_create
sales.shpcrt_get_open_by_user_account_id
sales.shpcrt_mut_add_item
sales.shpcrt_mut_remove_item
```

## Views

```text
[schema].[descriptive_view_name]
```

Views should follow the same naming convention as tables. Use descriptive names and avoid routine-style aggregate prefixes for the database object name.

Example: `sales.abandoned_shopping_cart`

## Change Control

- Manage PostgreSQL schema changes with an explicit migration strategy.
- Keep schema changes, routines, views, constraints and indexes under source control.
- Use the selected migration tool's naming and folder rules instead of defining tool-specific file formats in PostgreSQL conventions.
- See [Database Migrations: Concepts](/technologies/backend/database-migrations/concepts) and [Migration Tools and Strategies](/technologies/backend/database-migrations/tools-and-strategies) for migration patterns.

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
