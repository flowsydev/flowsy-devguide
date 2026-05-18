# Integration Tests

Integration tests validate collaboration between code and real or controlled dependencies.

## Scope

Use integration tests for behavior that depends on:

- relational database schemas, queries, routines or transactions;
- HTTP clients and server routing;
- serialization and contract binding;
- filesystem behavior;
- queues, brokers or outbox processing;
- dependency-injection configuration.

## Controlled Dependencies

Prefer disposable infrastructure such as containers, test databases, temporary folders and in-memory brokers only when they faithfully represent the relevant behavior.

Do not mock the boundary that the test is meant to validate.

## Data and Cleanup

- Create data explicitly for each test or fixture.
- Clean by transaction rollback, schema reset, database recreation or isolated identifiers.
- Avoid depending on execution order.

## Parallelism

Parallel execution is acceptable only when tests do not share mutable external state. If isolation is expensive, group tests intentionally and document the constraint.

## Minimum Evidence

Record:

- command executed;
- infrastructure used;
- result;
- failing case summary if applicable.

## References

- [Relational Databases](./database/relational-databases.md)
- [Database Migration Testing](./database/migrations.md)
- [Event-Driven Systems](./event-driven-systems.md)
