# Relational Databases: Concepts

Base guide for relational modeling, schema conventions and operational traceability. Applies to any SQL engine.

## Naming

Use a consistent and explicit convention for:

- Tables.
- Columns.
- Indexes.
- Constraints and enumerated types.

## Date and Time

- Use a database type that preserves the intended instant or civil time semantics.
- Persist auditable instants in UTC.
- Store local civil time only when the domain explicitly needs it, such as schedules, local deadlines or legal time windows.
- Convert to user-facing time zones in the presentation layer or reporting layer.

## Value Object Modeling

- Use atomic columns for simple data with frequent queries.
- Use structured or semi-structured storage for composite values only when it provides real flexibility and the engine supports safe querying and validation.
- Define domain validations, required fields and referential relationships in the schema whenever the engine supports them.

See [Domain-Driven Design](../../../discovery/domain-driven-design.md) for more context on Value Objects.

## Migrations

- Every schema modification must be reproducible via versioned migrations.
- Avoid untraceable manual changes in shared environments.
- Test migrations forward and rollback when the engine allows it.

See [Database Migrations](../database-migrations/concepts.md) for the complete migration guide and [Migration Tools and Strategies](../database-migrations/tools-and-strategies.md) for tool-specific naming.

## Integrity and Performance

- Define explicit primary keys and foreign keys.
- Index based on actual query patterns.
- Review execution plans for critical queries.

## Engine-Specific Conventions

- [PostgreSQL Conventions](../../../conventions/postgresql.md)
- [SQL Server Conventions](../../../conventions/sql-server.md)
- [MySQL and MariaDB Conventions](../../../conventions/mysql-mariadb.md)
