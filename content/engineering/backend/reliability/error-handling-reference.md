---
title: Error Handling Broad Reference
description: Complementary material by architecture; the split Reliability guides keep normative authority.
type: reference
audience: People who need extended examples of errors and transactions.
canonical: false
canonicalSource: /engineering/backend/reliability/
---

# Error Handling

> [!IMPORTANT]
> This page keeps historical examples. Use [Backend Reliability](/engineering/backend/reliability/) for errors, validation and consistency, and [Reliable Delivery](/engineering/messaging/reliable-delivery) for Outbox.

Error handling protects the system from partial changes, unclear failures and leaked implementation details. Treat it as part of application design, not as a last-minute `try/catch` concern.

This guide is language- and framework-agnostic. Use it to decide where validation belongs, when state may change, how infrastructure errors are translated and how delivery adapters expose failures. For HTTP response contracts, status codes and RFC 9457 Problem Details, see [HTTP API Design](/engineering/backend/api/http-api-design).

## Goals

- Detect invalid requests before changing application state.
- Keep domain rules in application and domain code, not hidden in infrastructure mechanisms.
- Use storage constraints and concurrency controls as integrity safeguards, not as the primary expression of business behavior.
- Hide database, broker, file-system, cloud-provider and SDK-specific errors behind application boundaries.
- Return or publish errors in a shape appropriate to the delivery mechanism: HTTP API, message consumer, CLI, background job or UI.

## Error Categories

| Category | Meaning | Typical Owner |
| --- | --- | --- |
| Contract error | The input shape is malformed, missing required members or uses invalid formats. | Delivery adapter or request validator. |
| Application precondition error | The use case cannot proceed because required state is absent or incompatible. | Application handler or slice state. |
| Domain rule error | A business invariant would be violated. | Domain model, aggregate, value object or slice state. |
| Conflict error | The requested change conflicts with current state, uniqueness, idempotency or concurrency. | Application handler, domain model or persistence boundary. |
| Infrastructure error | A database, message broker, external service, file store or SDK failed. | Infrastructure adapter. |
| Unexpected error | The system reached a failure path that was not modeled explicitly. | Runtime boundary and observability pipeline. |

Use stable names for expected application errors. A client, worker or AI agent should be able to understand that `shoppingCart.alreadyOpen` and `project.nameAlreadyExists` are domain/application outcomes, while a timeout from a database driver is an operational failure that should not leak into domain code.

## Validate Before State Changes

Perform every validation that can be known before changing durable state or triggering side effects. Durable state includes relational databases, document stores, event stores, files, caches used as source of truth, queues, topics, emails and any operation that starts downstream processing.

Recommended command flow:

1. Parse and normalize input at the delivery boundary.
2. Validate the request shape and simple field rules.
3. Load only the decision data needed for the use case.
4. Check preconditions and domain invariants.
5. Persist the mutation inside an explicit consistency boundary.
6. Record events or side effects only as part of the same reliable boundary, or through an outbox.
7. Map the result or failure at the delivery boundary.

Example flow:

```text
HTTP Request
  -> Endpoint validates shape
  -> Command handler loads decision state
  -> State enforces domain rules
  -> StateHandler persists mutation
  -> Outbox records integration events
  -> Endpoint returns success or mapped error
```

Do not publish a message, send an email, write a file or call an external API before the command has passed the rules that can be checked locally. If the side effect must happen after persistence, prefer a reliable handoff such as the Transactional Outbox pattern.

Some failures cannot be eliminated before persistence. Concurrent requests, unique constraints, optimistic concurrency checks, broker outages and network timeouts may still fail at commit or publish time. Model these as expected conflict or infrastructure outcomes and translate them at the correct boundary.

## Domain Rules Belong in Application and Domain Code

The primary expression of a business rule should live where the team can read, test and evolve the behavior with the domain language:

- value object validation for concepts such as `EmailAddress`, `Money` or `DateRange`;
- aggregate or state methods for invariants such as "a cart cannot contain more than 100 items";
- command or use-case validators for request shape and preconditions;
- application handlers for orchestration, idempotency checks and transaction boundaries.

Avoid hiding business decisions inside SQL routines, database triggers, ORM hooks or broker-specific callbacks. Those mechanisms are harder to discover, harder to unit test and easy to bypass when another entry point writes to the same data.

Database constraints still matter. Use `NOT NULL`, foreign keys, unique constraints, check constraints and optimistic concurrency columns as persistence safeguards. They protect integrity when there is a bug, a race condition or a secondary writer. They should reinforce the model, not replace it.

| Concern | Prefer | Avoid as Primary Rule Location |
| --- | --- | --- |
| Required field in a request | Request validator and contract schema. | Letting a database `NOT NULL` violation become the user-facing error. |
| Domain invariant | Domain model, aggregate or slice state. | Trigger or stored procedure that silently rejects the operation. |
| Uniqueness under concurrency | Application pre-check plus unique constraint. | Only checking in memory without a database guarantee. |
| Referential integrity | Domain/application check plus foreign key where supported. | Relying on accidental join failures. |
| Derived side effect | Domain event plus outbox. | Sending the message in the middle of a transaction. |

## Keep Infrastructure Errors Behind Boundaries

Application and domain code should not branch on provider-specific exception types, SQL state codes, SDK response classes or broker client structures. Keep those details in infrastructure adapters.

```text
Application Handler
  -> PaymentGatewayPort
      -> StripePaymentGatewayAdapter
          -> Stripe SDK exception
          -> maps to PaymentUnavailable or PaymentRejected
```

The adapter may inspect provider-specific details, retry transient failures, classify known errors and log operational context. It should return or throw errors that use application language.

Prefer this:

```text
PaymentGatewayPort.Authorize(payment)
  -> PaymentRejected(reason: "insufficientFunds")
  -> PaymentUnavailable(retryable: true)
```

Avoid this in application/domain code:

```text
catch StripeCardException
catch SqlException where Number == 2627
catch KafkaRetriableException
```

Provider-specific details may appear in logs and telemetry, but sanitize what crosses the delivery boundary. Public errors should not expose SQL text, table names, connection strings, queue names, credentials, stack traces or internal authorization rules.

## Transaction and Side-Effect Boundaries

For Outbox, retries, duplicates and DLQ, prefer [Reliable Delivery](/engineering/messaging/reliable-delivery) and [Transactional Consistency](./transactional-consistency).

State changes and side effects must have an intentional boundary:

- Use one transaction or optimistic consistency boundary for the data that must change atomically.
- Use idempotency keys for commands that clients may retry.
- Use optimistic concurrency or append conditions when two requests may change the same decision state.
- Use an outbox when a database mutation must produce an event or message.
- Make message consumers idempotent because brokers and outbox relays may deliver messages more than once.

Do not treat a message broker publish, email send or external API call as part of a local database transaction unless the platform explicitly provides that guarantee. In most systems, storing an integration event with the data mutation and publishing it asynchronously is safer.

## Architecture Guidance

### Vertical Slice Architecture

Each slice owns its validation, decision data, behavior and persistence boundary. A typical command slice separates responsibilities this way:

| Artifact | Error-Handling Responsibility |
| --- | --- |
| Delivery adapter | Bind input and map known outcomes to the protocol. |
| Validator | Reject malformed input and simple precondition failures before state changes. |
| Handler | Orchestrate validation, state loading, persistence and outbox recording. |
| State or aggregate | Enforce domain invariants and throw domain errors. |
| StateHandler or repository adapter | Translate database and provider failures to application errors. |

### Clean Architecture and Ports and Adapters

Domain code should not know about controllers, ORMs, queues, SDKs or HTTP clients. Application ports define the errors the use case can understand; infrastructure adapters translate provider-specific failures into those errors.

When a port talks to an external dependency, design its error contract deliberately. For example, `InventoryReservationPort` may expose `InventoryUnavailable`, `ReservationRejected` and `ReservationServiceUnavailable`. The application should not need to know whether the adapter used REST, gRPC, SQL or a message broker.

### Event-Driven Architecture

Producers should validate domain behavior before recording an event. Consumers should treat duplicate delivery, delayed delivery and poison messages as normal operating conditions:

- make handlers idempotent;
- store processed message IDs when needed;
- use retry policies for transient failures;
- move repeatedly failing messages to a dead letter queue;
- include correlation IDs for investigation.

### Event Sourcing

In Event Sourcing, invalid commands should not append events. Reconstruct the decision state, validate the command and append events only when the expected stream version or append condition still holds. Concurrency conflicts are expected outcomes, not unexpected crashes.

## Testing Checklist

- Invalid input is rejected before persistence or external side effects.
- Domain rule failures do not leave partial state changes.
- Uniqueness and concurrency conflicts are mapped to stable application errors.
- Infrastructure adapter failures do not leak provider-specific types or sensitive details.
- HTTP APIs expose expected failures as Problem Details.
- Message consumers handle retries, duplicates and dead letter scenarios.
- Outbox relay processing is idempotent and observable.

## References

- [RFC 9457: Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457)
- [ASP.NET Core: Handle Errors in Web APIs](https://learn.microsoft.com/en-us/aspnet/core/web-api/handle-errors)
- [Designing a DDD-Oriented Microservice](https://learn.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/ddd-oriented-microservice)
- [Azure Architecture Center: Domain Analysis](https://learn.microsoft.com/en-us/azure/architecture/microservices/model/domain-analysis)
- [Transactional Outbox Pattern](https://microservices.io/patterns/data/transactional-outbox)
- [AWS Prescriptive Guidance: Transactional Outbox Pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html)
