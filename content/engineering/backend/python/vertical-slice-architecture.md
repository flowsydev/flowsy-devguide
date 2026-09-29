---
title: VSA with FastAPI and PostgreSQL
description: Python profile for use cases with FastAPI, Pydantic 2, SQLAlchemy, Psycopg and verifiable migrations.
type: profile
audience: People designing and implementing Python backend services.
canonical: true
canonicalSource: /engineering/backend/architecture/vertical-slice-architecture
---

# VSA with FastAPI and PostgreSQL

Use this profile to implement business behavior as vertical slices in Python. A developer should be able to find a use case's entry point, rules, persistence and tests without searching through global technical layers. Start with [VSA concepts](/engineering/backend/architecture/vertical-slice-architecture) and the [Backend Project Design Baseline](/engineering/backend/design-baseline). The classes and folders in the [C# Minimal APIs profile](/engineering/backend/dotnet/minimal-apis/) are decisions for that stack, not Python requirements.

The examples target **Python 3.13 or later** and **PostgreSQL 16 or later**. These are the minimum versions for this profile, not an untested promise of compatibility with every later release. Use a current minor release in each supported series and verify the project's exact runtime, driver and database combination. Check the official [Python release status](https://devguide.python.org/versions/) and [PostgreSQL version policy](https://www.postgresql.org/support/versioning/) when choosing versions.

## Profile Decisions

| Topic | Initial Decision | Justified Adjustment |
| --- | --- | --- |
| Organization | Packages by context, feature set and behavior. | Combine small files when separation obscures a slice. |
| Language | Names follow the context's ubiquitous language, in English by default. | Use Spanish only for intrinsically Mexican concepts such as RFC or CURP. |
| HTTP contract | FastAPI and Pydantic 2 validate input and define public responses. | Use Python classes or `dataclasses` for internal data that needs no external validation. |
| Data access | SQLAlchemy 2 with Psycopg 3 (`psycopg`) for a first slice with rules and a transaction. | SQLModel can simplify simpler relational slices; direct Psycopg suits deliberate SQL work. |
| Execution | Synchronous endpoints and database access with `def`. | Use `async def` with end-to-end asynchronous libraries when measurements justify it. |
| Schema and tests | Alembic migrations; unit, HTTP and PostgreSQL integration tests in CI. | Expand the matrix for deployed versions and the change's risk. |

The [FastAPI skill](https://github.com/fastapi/fastapi/blob/master/fastapi/.agents/skills/fastapi/SKILL.md) favors SQLModel for ordinary SQL work. SQLAlchemy is used here to expose the persistence model, decision query and transaction without coupling HTTP or domain state to a table model. This does not rule out SQLModel: its [official skill](https://github.com/fastapi/sqlmodel/blob/main/sqlmodel/.agents/skills/sqlmodel/SKILL.md) recommends separate public schemas and permits SQLAlchemy mechanisms where needed. The [Pydantic skill](https://github.com/pydantic/pydantic/blob/main/.agents/skills/pydantic/SKILL.md) recommends models for external data and ordinary classes or `dataclasses` for internal objects.

## Packages and Names

Group code by behavior. Use `snake_case` for Python packages, modules, functions, variables and PostgreSQL objects, and `PascalCase` for classes. Use ASCII identifiers and the agreed business language of each context. For example, `redeem_gift_card`, `Order` and `gift_card_id` belong to the same vocabulary; `api.py`, `schemas.py` and `use_case.py` are technical names. See [PEP 8](https://peps.python.org/pep-0008/), [Ubiquitous Language](/foundations/ubiquitous-language), [Writing Guidelines](/conventions/writing-guidelines) and [PostgreSQL Conventions](/engineering/data/database-engines/postgresql).

The same service tree is used in the [Gift Card Redemption Example](./assignment-reference#slice-files):

```text
service/
├── pyproject.toml
├── app/
│   ├── main.py                         # router composition and lifespan
│   ├── shared/
│   │   ├── db.py                       # engine and session factory
│   │   └── problem.py                  # shared error handlers and responses
│   └── sales/
│       └── orders/
│           └── redeem_gift_card/
│               ├── api.py             # HTTP boundary
│               ├── schemas.py         # Pydantic input and response
│               ├── use_case.py        # orchestration and transaction
│               ├── domain.py          # decisions without I/O
│               ├── errors.py          # known use case failures
│               ├── persistence.py     # slice-specific reads and writes
│               └── models.py          # table mapping; move to a shared module when multiple slices use it
├── migrations/                         # Alembic revisions
└── tests/                              # rules, HTTP and integration tests
```

The tree shows change ownership, not a mandatory number of files. A small slice can combine modules. Share stable infrastructure such as session creation or authentication; avoid global `services/`, `repositories/` or `models/` directories that concentrate all contexts' behavior. Compose the `APIRouter` near each behavior. [FastAPI: bigger applications](https://fastapi.tiangolo.com/tutorial/bigger-applications/).

## Slice Boundaries

| File | Responsibility |
| --- | --- |
| `api.py` | Declare the route, obtain dependencies, call the use case and map its known outcomes to HTTP. |
| `schemas.py` | Validate external data shape and define the public response; a Pydantic schema alone cannot enforce a domain invariant. |
| `use_case.py` | Coordinate loading, decision, persistence and transaction commit. A typed function is often enough. |
| `domain.py` | Apply rules to decision data without network or database I/O. |
| `errors.py` | Name application failures without depending on driver exceptions. |
| `persistence.py` | Execute slice-specific queries and writes with the provided session; do not commit independently. |
| `models.py` | Map the table; move the mapping to a shared module if multiple slices use it. |

Do not add a mediator, dispatcher, `CommandHandler` class or `State`/`StateHandler` pair by default. Introduce a decision object and focused loader when a decision across entities becomes hard to follow. Keep loading, mutation and writing inside one consistency boundary. For a simple mutation, call an application function directly. See [Commands, Queries and Dispatching](/engineering/backend/architecture/vertical-slice-architecture#commands-queries-and-dispatching) and [Transactional Consistency](/engineering/backend/reliability/transactional-consistency).

The HTTP boundary can stay small. These fragments illustrate the contract and route; `get_session` yields a session and closes it without committing. The [Gift Card Redemption Example](./assignment-reference) connects them to persistence and tests.

```python
# schemas.py
from uuid import UUID
from pydantic import BaseModel


class RedeemGiftCardInput(BaseModel):
    gift_card_id: UUID


class GiftCardRedemption(BaseModel):
    order_id: UUID
    gift_card_id: UUID
```

```python
# api.py
from typing import Annotated
from uuid import UUID
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.shared.db import get_session
from app.shared.problem import problem_response
from .schemas import GiftCardRedemption, RedeemGiftCardInput
from .use_case import redeem_gift_card

router = APIRouter(prefix="/orders", tags=["Orders"])
SessionDep = Annotated[Session, Depends(get_session)]


@router.post(
    "/{order_id}/gift-card",
    responses={status: problem_response() for status in (404, 409, 422, 500)},
)
def redeem_gift_card_http(
    order_id: UUID,
    input: RedeemGiftCardInput,
    session: SessionDep,
) -> GiftCardRedemption:
    return redeem_gift_card(session, order_id, input.gift_card_id)
```

`APIRouter` groups route metadata, `Annotated` expresses the dependency and the return type limits the public output. The shared `problem_response` helper registers `application/problem+json` in OpenAPI; the [reference](./assignment-reference#http-boundary-and-problem-details) explains its contract. Use `response_model` when the returned internal type differs from the public type. Keep table access and business decisions outside the endpoint. Translate a recognized driver failure, such as a named unique constraint, at the transaction boundary because it can arise during `flush` or commit. Let the central handler sanitize unexpected errors. [FastAPI: additional responses](https://fastapi.tiangolo.com/advanced/additional-responses/); [response models](https://fastapi.tiangolo.com/tutorial/response-model/); [Error Handling](/engineering/backend/reliability/error-handling).

### FastAPI Errors and Problem Details

FastAPI's default `HTTPException` body uses `detail`; `RequestValidationError` also does not implement the [Problem Details contract](/engineering/backend/api/http-api-design#problem-details) on its own. Install shared handlers for known application errors, invalid input, framework HTTP errors and unexpected failures. Use `application/problem+json`, match the HTTP and body `status`, and document error schemas in OpenAPI. The [reference](./assignment-reference#http-boundary-and-problem-details) gives the 404, 409, 422 and 500 mapping. [FastAPI: handling errors](https://fastapi.tiangolo.com/tutorial/handling-errors/); [RFC 9457](https://www.rfc-editor.org/rfc/rfc9457).

For `RequestValidationError`, convert body-member locations to JSON Pointer where possible and return controlled public messages. Do not expose `str(exc)`, `exc.body`, input values, SQL or driver text. Log operational details on the server. Include `traceId` only if it identifies a recorded, searchable trace.

### Example Flow: Redeem a Gift Card

Suppose each order can redeem one gift card and a gift card cannot be redeemed by two orders. This invariant is illustrative; discover the project's actual gift card policy before implementing it. The use case receives identifiers already parsed at the HTTP boundary, loads only decision data and applies the rule in a domain function or object.

```python
def redeem_gift_card(session: Session, order_id: UUID, gift_card_id: UUID) -> GiftCardRedemption:
    with session.begin():
        order = load_order_for_redemption(session, order_id)
        decision = decide_redemption(order, gift_card_id)
        save_redemption(session, decision)
        record_outbox_if_needed(session, decision)
        response = build_public_response(decision)
    return response
```

These functions illustrate responsibility, not a deployable service. `session.begin()` commits on successful exit and rolls back on failure; **the success response is returned after commit**. `get_session` yields a session from the factory and closes it after the request without committing in cleanup. The session must reach `session.begin()` without a transaction already active. [FastAPI: dependencies with `yield`](https://fastapi.tiangolo.com/tutorial/dependencies/dependencies-with-yield/); [SQLAlchemy: transactions](https://docs.sqlalchemy.org/en/20/orm/session_transaction.html).

Pydantic checks declarative input shape. State-dependent preconditions and invariants belong in the use case or domain. Build the response with explicit Pydantic fields; do not return an ORM entity with lazy relationships or expose internal IDs accidentally. Use a return type or `response_model` so FastAPI validates, documents and filters output. [Validation and Domain Rules](/engineering/backend/reliability/validation-and-domain-rules); [Public Identifiers](/engineering/cross-cutting/identifiers).

For a read query such as `pending_orders`, select the columns the consumer needs and compose a focused read schema. A separate read model does not require full CQRS or another database. Change an existing slice when its use case changes; create another for independent behavior.

## PostgreSQL, Sessions and Concurrency

Use an explicit `postgresql+psycopg://` URL to select Psycopg 3. Create the SQLAlchemy `Engine` and session factory once per process, dispose of the pool on application shutdown through `lifespan` when appropriate, and give each request its own `Session`. Never share a session between concurrent tasks. Size connections across processes and replicas against PostgreSQL limits before adding another pool. Do not hold transactions open during external HTTP calls or long jobs. [Psycopg dialect](https://docs.sqlalchemy.org/en/20/dialects/postgresql.html#psycopg); [sessions](https://docs.sqlalchemy.org/en/20/orm/session_basics.html); [pooling](https://docs.sqlalchemy.org/en/20/core/pooling.html); [FastAPI lifespan](https://fastapi.tiangolo.com/advanced/events/).

Choose concurrency protection for the invariant:

- **Unique or `CHECK` constraint** for conditions PostgreSQL can enforce. Name the constraint and translate only recognized conflicts. [PostgreSQL constraints](https://www.postgresql.org/docs/current/ddl-constraints.html).
- **Optimistic version or conditional update** when a command must fail if another changed the same row. Verify `version_id_col` behavior against PostgreSQL. [SQLAlchemy versioning](https://docs.sqlalchemy.org/en/20/orm/versioning.html).
- **`SELECT ... FOR UPDATE`** when decisions must serialize on specific rows. The lock lasts until the transaction ends; locking an order alone does not protect a condition across orders and gift cards. [PostgreSQL locking](https://www.postgresql.org/docs/current/explicit-locking.html).

If a mutation produces an integration event, write an [Outbox](/engineering/messaging/outbox) record in the same transaction and publish later through a recoverable process. With `SERIALIZABLE` isolation, bound retries after serialization failures and repeat the whole transaction without repeating already emitted external effects. [PostgreSQL serialization failures](https://www.postgresql.org/docs/current/mvcc-serialization-failure-handling.html).

### When to Use SQLModel or Direct Psycopg

SQLModel is reasonable for simple tables and relationships when its API reduces code. Keep creation, table and response models separate and use `Session.exec(select(...))` as shown by its [official skill](https://github.com/fastapi/sqlmodel/blob/main/sqlmodel/.agents/skills/sqlmodel/SKILL.md) and [multiple-model guide](https://sqlmodel.tiangolo.com/tutorial/fastapi/multiple-models/). Avoid two ORM styles for the same boundary without a concrete need.

Direct Psycopg can serve a specific SQL query or deliberately SQL-first module. Keep bound parameters, explicit transactions and clear pool ownership. If the module already uses a SQLAlchemy `Engine`, it can execute SQL through that engine; do not add a second pool by habit. [Psycopg transactions](https://www.psycopg.org/psycopg3/docs/basic/transactions.html); [Psycopg pool](https://www.psycopg.org/psycopg3/docs/advanced/pool.html).

## Synchronous First; Asynchronous When Useful

With synchronous data access, declare I/O endpoints and dependencies using `def`; FastAPI runs them in a thread pool. Do not call synchronous Psycopg or SQLAlchemy directly from `async def`. Measure latency, throughput, pool wait, thread-pool saturation and query time before switching. For end-to-end asynchronous I/O, use `create_async_engine`, `async_sessionmaker` and one `AsyncSession` per task, avoiding implicit lazy loading. Async code will not fix a slow query, missing index or long-held lock. [FastAPI: `async` and `def`](https://fastapi.tiangolo.com/async/); [SQLAlchemy asyncio](https://docs.sqlalchemy.org/en/20/orm/extensions/asyncio.html).

## Migrations and CI Validation

Version the schema with Alembic revisions. Review and correct each `alembic revision --autogenerate` candidate; it does not reliably capture every constraint, data transformation or operational choice. Run migrations as a controlled deployment step, not at module import or every API process startup. See [Migration Concepts](/engineering/data/migrations/concepts) and [Alembic autogenerate](https://alembic.sqlalchemy.org/en/latest/autogenerate.html).

In each pull request, CI for a project using this profile should:

1. Run lint, type checks and unit tests for domain rules.
2. Start a real supported PostgreSQL version; apply `alembic upgrade head` to an empty database and run `alembic check` for pending model-to-schema differences.
3. Test HTTP contracts and persistence against the migrated schema: commit, rollback, constraints, concurrency conflicts and Outbox where needed. Use `TestClient` or HTTPX and `app.dependency_overrides` for external services, restoring overrides after each test.
4. Before a risky schema release, test upgrade from the previously published schema and define a deployment rollback path. An automatic downgrade may be unsafe.

The regular matrix includes **Python 3.13** and **PostgreSQL 16**, plus the combination deployed by the project. Periodic checks can add recent stable versions. SQLite examples cannot establish PostgreSQL locking, constraint and transaction behavior. [Alembic check](https://alembic.sqlalchemy.org/en/latest/autogenerate.html#running-alembic-check-to-test-for-new-upgrade-operations); [FastAPI testing](https://fastapi.tiangolo.com/tutorial/testing/); [dependency overrides](https://fastapi.tiangolo.com/advanced/testing-dependencies/); [Automated Testing Strategy](/quality/automated-testing-strategy).

The [Python and FastAPI quality profile](/quality/stacks/python-fastapi) covers fixtures, HTTP contracts, migrated databases, rollback and concurrency.

## Reproducible Startup

Declare the minimum Python version, direct dependencies and tools in the service's `pyproject.toml`. Use an isolated environment and locked resolution in CI, reviewed when dependencies change. Document exact API startup, migration, lint, type-check and test commands in the consuming repository. This guide does not impose `uv` or another environment manager on existing projects. [PyPA: `pyproject.toml`](https://packaging.python.org/en/latest/guides/writing-pyproject-toml/); [Dependency Safety](/engineering/security/dependency-safety).

Read external configuration at startup and validate required values. Keep credentials outside the repository. Pydantic Settings can help with multiple environment options. Apply `alembic upgrade head` in a controlled step before starting FastAPI, not on module import or once per replica. [Pydantic Settings](https://docs.pydantic.dev/latest/concepts/pydantic_settings/).

## Data Types at the Boundaries

The Python type, PostgreSQL column and HTTP representation must preserve the same meaning. [Date and Time](/engineering/cross-cutting/date-and-time), [Public Identifiers](/engineering/cross-cutting/identifiers) and [PostgreSQL Conventions](/engineering/data/database-engines/postgresql#language-and-provider-mapping) own the shared rules. Apply these choices to the project's contract:

| Domain Data | Python and PostgreSQL | Required Verification |
| --- | --- | --- |
| Public order ID | `UUID` and `uuid`. | The API receives and emits the same public identifier without leaking an internal ID. |
| Order total | `Decimal` and `numeric(p, s)` with agreed precision and scale. | Round-trip preserves amount and rounding policy; avoid `float` for exact money. |
| Payment capture instant | Time-zone-aware `datetime` and `timestamptz`. | Compare the instant, not only response text or offset; define the HTTP format. |
| Local delivery appointment | `date`, `time` and IANA time-zone ID in date, time and text columns. | Values remain local, and the zone supports the domain's ambiguity policy. |

Psycopg adapts `Decimal` to `numeric` and `float` to `float8`; time-zone-aware `datetime` maps to `timestamptz`, while an unaware value maps to `timestamp`. `timestamptz` preserves an instant, but the displayed offset depends on the session. Test microsecond precision and HTTP conversion with the installed driver and ORM. For future civil times, test daylight saving transitions and do not convert an isolated local time to an instant without date and zone. [Psycopg type adaptation](https://www.psycopg.org/psycopg3/docs/basic/adapt.html).

## Implementation Sources

Alongside the official [FastAPI](https://github.com/fastapi/fastapi/blob/master/fastapi/.agents/skills/fastapi/SKILL.md), [Pydantic](https://github.com/pydantic/pydantic/blob/main/.agents/skills/pydantic/SKILL.md) and [SQLModel](https://github.com/fastapi/sqlmodel/blob/main/sqlmodel/.agents/skills/sqlmodel/SKILL.md) skills, consult the documentation for the installed versions of [SQLAlchemy](https://docs.sqlalchemy.org/en/20/), [Psycopg](https://www.psycopg.org/psycopg3/docs/) and [Alembic](https://alembic.sqlalchemy.org/en/latest/).
