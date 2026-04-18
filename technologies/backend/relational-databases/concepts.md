# Relational Databases: Concepts

Base guide for relational modeling, schema conventions and operational traceability. Applies to any SQL engine; PostgreSQL-specific conventions are in [PostgreSQL Conventions](../../../conventions/postgresql.md).

## Naming

Use a consistent and explicit convention, preferably `snake_case` for:

- Tables.
- Columns.
- Indexes.
- Constraints and enumerated types.

See [PostgreSQL Conventions](../../../conventions/postgresql.md) for engine-specific naming rules.

## Date and Time

- Prefer timezone-aware types (`timestamp with time zone`) for auditing and events.
- Avoid timezone-less types in data shared between systems or regions.
- Persist instants in UTC; convert to local timezone only in the presentation layer.

## Value Object Modeling

- Use atomic columns for simple data with frequent queries.
- Use `json`/`jsonb` for composite structures when it provides real flexibility.
- Define validations and constraints (`CHECK`, `NOT NULL`, `FK`) in the schema.

See [Domain-Driven Design](../../../discovery/domain-driven-design.md) for more context on Value Objects.

## Migrations

- Every schema modification must be reproducible via versioned migrations.
- Avoid untraceable manual changes in shared environments.
- Test migrations forward and rollback when the engine allows it.

See [Database Migrations](../database-migrations/concepts.md) for the complete migration guide with Evolve and Flyway.

## Integrity and Performance

- Define explicit primary keys and foreign keys.
- Index based on actual query patterns.
- Review execution plans for critical queries.
