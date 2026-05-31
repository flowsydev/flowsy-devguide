# Relational Database Testing

Guide for validating persistence, constraints, queries and transactional behavior in relational databases.

## Relationship With Integration Tests

In most projects, relational database tests do not live as an isolated suite of "database unit tests". They mainly live as **backend integration tests** because the database is validated through the behavior that consumes it:

- a handler queries or persists data correctly;
- an API applies a rule and leaves the expected state;
- a routine or view returns the read model required by the use case;
- a transaction protects a critical operation;
- a constraint prevents an invalid state that the domain must not accept.

This approach avoids testing internal details without business context. The test should demonstrate that the backend and database collaborate correctly for a verifiable case.

Database-specific tests are justified when the behavior primarily lives in SQL: routines with relevant rules, complex views, critical constraints, high-risk queries, concurrency or performance validation.

## Where They Should Live

The location depends on who consumes and versions the schema:

| Context | Recommended Location |
| --- | --- |
| Backend owns the schema | Backend integration test project, for example `*.IntegrationTests`. |
| Monorepo with backend and database | Integration test folder next to the module or service that consumes the schema. |
| Dedicated database repository | Suite in the database repo, focused on migrations, routines, views and constraints. |
| Schema shared by several services | Repository that owns the data contract or dedicated pipeline with compatibility tests for critical consumers. |
| Exploratory changes or operational scripts | Local or pipeline tests, but not as a substitute for a versioned suite when the change is durable. |

Avoid duplicating the same validation in every consumer repository. If the backend owns the persistence model, backend integration tests are usually the main source of evidence. If the database is a shared product, a dedicated suite can protect SQL contracts.

## What to Test

- Critical `NOT NULL`, `CHECK`, `UNIQUE` constraints and foreign keys.
- Indexes required by frequent queries.
- Routines, views and functions with business rules.
- Transactions and concurrency when the use case requires them.
- Backend integration against a controlled real database.

## Test Design

Start from the use case, not from the table:

- `CreateOrder_WhenCustomerExists_PersistsOrderAndItems`.
- `AssignWarehouse_WhenWarehouseAlreadyAssigned_RejectsOperation`.
- `GetPendingSubscriptions_WhenUserHasRegion_ReturnsOnlyVisibleSubscriptions`.

The test can call the endpoint, handler, repository or routine, depending on the level of integration that provides the best signal. If the intent is to validate full backend collaboration, use an endpoint or handler. If the intent is to validate a critical SQL routine, call the routine directly from a dedicated integration test and document which contract it protects.

## Isolation Strategies

- Ephemeral database per execution.
- Isolated schema per suite.
- Transaction per test with rollback when no external processes are involved.
- Database container with reproducible seed data.
- Unique identifiers per case when tests run in parallel.

Do not use production data. Do not depend on a shared environment that other teams or processes can modify during execution.

## Test Data

- Declare minimal data for the scenario.
- Use SQL builders or seed scripts with clear names.
- Clean data created by the test or use disposable environments.
- Avoid coupling tests to physical record order.
- Prefer data created by the test over large global fixtures.
- Use semantic identifiers for the case when they help diagnose failures.

## Concurrency

Different database engines use different default isolation levels. PostgreSQL uses `Read Committed` by default. If the case requires stronger consistency, test `Repeatable Read` or `Serializable` explicitly and account for retries after serialization failures.

Concurrency tests should state which anomaly they aim to prevent: duplicate assignment, negative balance, duplicate confirmation, closed batch with pending movements or another domain risk.

## Engine-Specific Notes

Keep the main testing strategy database-engine-neutral, then add notes for the actual database engines used by the project.

| Engine | Notes |
| --- | --- |
| PostgreSQL | Validate transaction isolation intentionally, use `EXPLAIN ANALYZE` for performance-sensitive changes and prefer disposable containers or schemas for repeatable tests. |
| SQL Server | Validate isolation level and locking assumptions explicitly, especially when using `READ COMMITTED SNAPSHOT`, `rowversion` or stored procedures with transactional behavior. |
| MySQL / MariaDB | Validate behavior under the configured storage engine and isolation level, especially when relying on foreign keys, `CHECK` constraints or transactional DDL support. |

## Evidence

For database changes, preserve:

- applied script or migration;
- validation command;
- result of critical constraints, routines or queries;
- execution plan only when the change carries performance risk;
- isolation and cleanup note.

## Anti-Patterns

- Creating a SQL suite disconnected from the backend when real behavior depends on handlers, transactions or application mappings.
- Testing every table with generic CRUD operations unrelated to business rules.
- Reusing a shared database between developers or pipelines.
- Depending on manual preexisting data.
- Validating only that "the query does not crash" without business assertions.
- Duplicating the same test in backend and database repositories without a clear contract that justifies it.

## References

- [PostgreSQL: Transaction Isolation](https://www.postgresql.org/docs/current/transaction-iso.html)
- [Integration Tests](../integration-tests.md)
- [Database Migration Testing](./migrations.md)
- [PostgreSQL Conventions](/technologies/backend/data-and-migrations/database-engines/postgresql)
