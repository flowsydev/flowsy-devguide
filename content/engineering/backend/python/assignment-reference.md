---
title: Gift Card Redemption Example
description: FastAPI slice example with a PostgreSQL transaction, Problem Details and test evidence.
type: reference
audience: People implementing and reviewing Python services with FastAPI.
canonical: false
canonicalSource: /engineering/backend/python/vertical-slice-architecture
---

# Gift Card Redemption Example

Use this example to connect a slice's HTTP input, rule, persistence, errors and tests. Like the [Minimal APIs VSA examples](/engineering/backend/dotnet/minimal-apis/examples/), these fragments explain implementation decisions; they do not form a deployable service or required template. The [FastAPI and PostgreSQL profile](./vertical-slice-architecture) owns stack decisions, [HTTP API Design](/engineering/backend/api/http-api-design#problem-details) owns the error contract, and [Python and FastAPI Quality](/quality/stacks/python-fastapi) owns testing guidance.

The illustrative invariant is that **an order redeems at most one gift card, and a gift card cannot be redeemed by two orders**. Discover the real redemption policy with the product team before adopting it. Table names, constraints, URIs and codes are examples.

## Slice Files

This is a possible layout **inside a consuming service**, not a layout required by the guide. It is identical to the tree in the [Python VSA profile](./vertical-slice-architecture#packages-and-names):

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

Combine files if that makes a small slice clearer. Migrations and tests belong to the service that owns the schema.

## Rule, Constraint and Transaction

The order rule rejects a second redemption. A named unique constraint protects gift card exclusivity across orders; locking one order row alone does not protect that cross-order condition.

```python
# models.py
class Order(Base):
    __tablename__ = "orders"
    __table_args__ = (UniqueConstraint("gift_card_id", name="uq_order_gift_card_id"),)

    id: Mapped[UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True)
    gift_card_id: Mapped[UUID | None] = mapped_column(Uuid(as_uuid=True), nullable=True)
```

The service's Alembic revision creates the table and constraint; review any autogenerate proposal manually. `load_order_for_redemption` uses `SELECT ... FOR UPDATE` on the order and receives the use case's session. The pure `validate_redemption` rule raises `GiftCardConflict` when `gift_card_id` is already set.

```python
# use_case.py
def redeem_gift_card(
    session: Session, order_id: UUID, gift_card_id: UUID
) -> GiftCardRedemption:
    try:
        with session.begin():
            order = load_order_for_redemption(session, order_id)
            if order is None:
                raise OrderNotFound
            validate_redemption(order.gift_card_id)
            order.gift_card_id = gift_card_id
            session.flush()
            response = GiftCardRedemption(order_id=order.id, gift_card_id=gift_card_id)
    except IntegrityError as exc:
        name = getattr(getattr(exc.orig, "diag", None), "constraint_name", None)
        if name == "uq_order_gift_card_id":
            raise GiftCardConflict from exc
        raise
    return response
```

The `except` surrounds the entire transaction because the constraint can fail during `flush` or commit. SQLAlchemy rolls back on an exception. A success response leaves only after commit. Translate only the recognized constraint into an application conflict. [SQLAlchemy transactions](https://docs.sqlalchemy.org/en/20/orm/session_transaction.html); [Alembic autogenerate](https://alembic.sqlalchemy.org/en/latest/autogenerate.html).

## HTTP Boundary and Problem Details

The endpoint receives a UUID and Pydantic input, calls the use case and returns public fields. Shared handlers map errors; the endpoint does not catch each exception or return FastAPI's default `detail` JSON.

```python
# api.py
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

`problem_response()` is a service helper that registers a `ProblemDetails` schema under `application/problem+json` in OpenAPI. A shared handler builds `JSONResponse(..., media_type="application/problem+json")` with matching HTTP and body `status`, a stable service-owned `type` URI, `instance`, safe public `detail` and an application `code`. Replace illustrative URIs with real service-owned URIs. [FastAPI additional responses](https://fastapi.tiangolo.com/advanced/additional-responses/); [RFC 9457](https://www.rfc-editor.org/rfc/rfc9457).

| Failure | Status | Illustrative `code` | Shared Mapping |
| --- | --- | --- | --- |
| Order absent | 404 | `orders.notFound` | Stable message without persistence details. |
| Order already redeemed or gift card used | 409 | `orders.giftCardConflict` | Known rule or constraint. |
| Invalid input | 422 | `validation.failed` | `errors` extension with JSON Pointer for body members where applicable. |
| Unexpected failure | 500 | `internal.error` | Server-side logging and sanitized response. |

For `RequestValidationError`, construct controlled public messages; do not return `str(exc)`, `exc.body` or received values. Handle framework-generated HTTP errors so they use the same format. Include `traceId` only when it can be found in operational logs. [FastAPI error handling](https://fastapi.tiangolo.com/tutorial/handling-errors/).

## Evidence the Service Must Produce

A consuming project should test against migrated PostgreSQL, not just SQLite:

1. Success: the response follows commit and the order records the redeemed gift card.
2. Missing order: 404 with `application/problem+json` and a stable code.
3. Second redemption or already used gift card: 409 with no partial change.
4. Invalid input: 422 with `errors` that do not repeat the submitted value.
5. Unexpected failure: sanitized 500 without SQL or driver text.
6. Two concurrent requests for one gift card: exactly one commits.
7. OpenAPI: 404, 409, 422 and 500 document `application/problem+json`.

Data type tests should separately verify UUID, `Decimal` amounts, instants, dates, local times and zones through PostgreSQL and HTTP. See [Data Types at the Boundaries](./vertical-slice-architecture#data-types-at-the-boundaries) and [Relational Database Testing](/quality/systems/relational-databases).
