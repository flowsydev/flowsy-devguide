---
title: Database Migration Testing
description: Validation for versioned and repeatable schema migrations.
type: profile
audience: Quality, data and backend development people.
canonical: true
canonicalSource: /quality/automated-testing-strategy
---

# Database Migration Testing

Guide for validating versioned and repeatable migrations before schema changes reach shared environments.

## Relationship With Integration Tests

Migrations are the entry point for reliable integration tests. Before validating a handler, endpoint or routine against a relational database, the suite should build the schema by applying the real project migrations.

In a typical backend, validation happens in two layers:

- **Migration validation:** the database can be built or upgraded with versioned and repeatable scripts.
- **Integration tests:** the backend uses that migrated schema to execute real business cases.

The first layer protects schema evolution. The second protects the application code that depends on that schema.

## What to Validate

- A clean database can apply all migrations.
- An existing database can apply only pending migrations.
- Applied versioned scripts have not changed.
- Repeatable scripts execute in a controlled way when their content changes.
- Resulting routines, views, constraints and indexes exist and work.
- Existing data survives when the change is not intended to be destructive.

## Where They Should Live

The right location depends on how the database is versioned and deployed:

| Context | Recommended Location |
| --- | --- |
| Backend and migrations in the same repo | Backend integration test project or backend build job. |
| Migrations in a dedicated repo | Database repository suite, executed before publishing SQL scripts or artifacts. |
| Monorepo | Folder of the service that owns the schema or shared database package. |
| Database shared by several services | Repository or pipeline that owns the data contract, with compatibility tests for key consumers. |
| Centralized migration tool | Dedicated pipeline that runs `info`, `validate` and `migrate` against ephemeral databases or test environments. |

If the backend owns the schema, a separate repository just to test migrations is usually unnecessary. In that case, backend integration tests should apply migrations as part of the database fixture.

If the database is a shared product or has its own deployment cycle, a dedicated repository or pipeline with migration tests independent from the backend can be useful.

## Evolve, Flyway and flwdb

Evolve and Flyway store metadata for applied migrations and validate changes through checksums. A versioned migration that has already been applied must be treated as immutable.

Use a new migration to correct a change that has already been published. Reserve repeatable scripts for objects that can be recreated safely, such as views or routines.

If the project exposes `flwdb`, validate the command path used by developers and CI, not only the underlying tool directly.

## Recommended Tests

- Run all versioned migrations against an empty database.
- Run migrations against a database with representative data.
- Run checksum validation with the configured tool.
- Test modified routines or views with minimal cases.
- Check that destructive changes have approval and a mitigation path.

## Fixture Strategy

For backend integration tests:

- Start the target database engine in a container, ephemeral database or controlled local environment.
- Apply the real migrations, not a parallel schema maintained by hand.
- Load only the seed data required by the case.
- Execute the endpoint, handler, repository or routine under test.
- Clean created data or destroy the database at the end.

For dedicated database repositories:

- Run `migrate` from zero.
- Run `validate` or the equivalent tool command.
- Apply repeatable scripts and verify that critical routines or views respond.
- Test upgrades from a representative previous version when the change affects existing data.

## Destructive Changes

A destructive change requires stronger evidence:

- inventory of affected objects;
- test against representative data;
- migration or backfill path;
- temporary compatibility plan if backend versions coexist;
- confirmation that critical consumers are not broken.

It is not enough for the migration to compile. The team must demonstrate that the system can move forward without losing data or breaking active contracts.

## Evidence

Record:

- command executed;
- tool and version when relevant;
- migrations applied or validated;
- validation result;
- sample error if checksums, order or dependencies fail;
- execution context: clean database, database with representative data or upgrade from a previous version.

## Anti-Patterns

- Maintaining a test schema script separate from the real migrations.
- Testing migrations only on a developer machine and not in CI.
- Editing already-applied versioned migrations to "fix" history.
- Validating only an empty database when the change affects existing data.
- Using rollback as an excuse not to test forward migration.
- Mixing several unrelated intentions in one migration that is hard to audit.

## References

- [Evolve: Concepts](https://evolve-db.netlify.app/concepts/)
- [Flyway: Validate](https://documentation.red-gate.com/flyway/reference/commands/validate)
- [Database Migrations Concepts](/engineering/data/migrations/concepts)
- [flwdb CLI](/engineering/data/migrations/flwdb-cli)
- [Relational Database Testing](./relational-databases)
