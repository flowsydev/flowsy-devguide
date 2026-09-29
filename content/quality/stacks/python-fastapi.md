---
title: Python and FastAPI
description: Tests for rules, HTTP contracts, migrations and concurrency in Python services with PostgreSQL.
type: profile
audience: Developers and quality engineers validating Python services.
canonical: true
canonicalSource: /quality/automated-testing-strategy
---

# Python and FastAPI

Use this profile to verify FastAPI services without losing PostgreSQL behavior. It turns the [Automated Testing Strategy](/quality/automated-testing-strategy) into a reproducible path. [Relational Database Testing](/quality/systems/relational-databases) and [Database Migration Testing](/quality/systems/database-migrations) own general persistence guidance; this page supplies Python tools and integration points.

## Test Path

| Test | Tool and Boundary | Expected Evidence |
| --- | --- | --- |
| Pure rule | `pytest` without FastAPI or PostgreSQL. | The decision accepts and rejects states according to the invariant. |
| HTTP contract | `TestClient` or HTTPX against the application. | Status, public body, `Content-Type`, Problem Details and OpenAPI schema. |
| Integration | `pytest` against PostgreSQL with Alembic migrations applied. | Commit, rollback, constraints, queries and error mapping. |
| Concurrency | Independent sessions or requests against one database. | Only the outcome permitted by the invariant commits. |
| Asynchronous delivery | Real or controlled publisher and Outbox, when used. | The event is recorded in the same transaction and delivered recoverably. |

The [Gift Card Redemption Example](/engineering/backend/python/assignment-reference) demonstrates an invariant and the evidence a consuming service should produce. Its `UNIQUE` constraint prevents the same gift card being assigned to two orders, so a conflicting operation must roll back. Add an Outbox test only when the use case actually publishes an integration event.

## Fixtures and Isolation

Give `pytest` fixtures the smallest scope that avoids repeated setup without sharing mutable state. A session-scoped fixture can apply `alembic upgrade head` once; per-test fixtures create minimal data and remove it or discard the database afterward. HTTP tests for a slice using `session.begin()` need a session with no active transaction. Do not wrap the entire test in an outer transaction if it hides the endpoint's actual commit.

FastAPI supports dependency replacement through `app.dependency_overrides`. Clear overrides even when a test fails:

```python
@pytest.fixture
def client():
    app.dependency_overrides[get_external_service] = controlled_service
    try:
        with TestClient(app, raise_server_exceptions=False) as client:
            yield client
    finally:
        app.dependency_overrides.clear()
```

`get_external_service` and `controlled_service` stand for project functions. `raise_server_exceptions=False` lets a test inspect a sanitized 500 response. Use independent sessions and clients for concurrency tests. SQLite cannot prove PostgreSQL locks, constraints, isolation or driver behavior. [FastAPI dependency overrides](https://fastapi.tiangolo.com/advanced/testing-dependencies/); [pytest fixtures](https://docs.pytest.org/en/stable/how-to/fixtures.html).

## Migrated Database and Execution

CI should start a disposable supported PostgreSQL version, apply actual migrations and run integration tests. `alembic check` detects differences autogenerate would propose between models and the versioned schema. It does not replace migration review or test data transformations. For risky changes, also test upgrade from the previously published schema. [Alembic check](https://alembic.sqlalchemy.org/en/latest/autogenerate.html#running-alembic-check-to-test-for-new-upgrade-operations).

For a project that chooses `uv`, an illustrative CI sequence is:

```bash
uv sync --locked
uv run alembic upgrade head
uv run alembic check
uv run pytest
uv run ruff check .
uv run mypy app
```

Start a disposable PostgreSQL database and provide `DATABASE_URL` without versioning credentials before applying migrations. Adapt package names and tools to the service. If the project already uses another environment manager or runner, retain its commands and the same test boundaries. Include **Python 3.13** and **PostgreSQL 16** in the regular matrix, along with the deployed combination.

For dates, times, amounts and public IDs, verify both HTTP serialization and the PostgreSQL round trip. A Python type accepted by the driver does not prove that the client receives the intended meaning, zone or precision. See [Date and Time](/engineering/cross-cutting/date-and-time), [Public Identifiers](/engineering/cross-cutting/identifiers) and [Data Types at the Boundaries](/engineering/backend/python/vertical-slice-architecture#data-types-at-the-boundaries).
