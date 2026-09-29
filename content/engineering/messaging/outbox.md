---
title: Transactional Outbox
description: Producer and relay design for publishing messages derived from a business mutation without losing delivery intent.
type: guide
audience: Architecture, backend, integration, data and operations people designing asynchronous publication.
canonical: true
related:
  - /engineering/messaging/reliable-delivery
  - /engineering/backend/reliability/transactional-consistency
---

# Transactional Outbox

Use this guide to decide how to record, publish and recover messages created by a business mutation. Outbox addresses the producer's **dual write** problem: if the producer commits its database change and crashes before publishing, other systems miss the change. If it publishes first and the transaction rolls back, they receive a fact that never happened. Store the business change and delivery intent in one local transaction, then publish through a separate relay. See [Chris Richardson's Transactional Outbox pattern](https://microservices.io/patterns/data/transactional-outbox) and [AWS Prescriptive Guidance](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html).

## When to Apply It

Apply Outbox when an operation must commit local data and arrange delivery to another system. For example, placing an order persists the `Order` and an `OrderPlaced` delivery in **the same local transaction**. A relay publishes the message after commit. A rollback leaves neither record; an API crash after commit leaves a pending delivery for recovery.

The producer's atomic guarantee ends at its database. The broker and consumer participate later. Outbox adds storage, publication latency and operational work. If publication is not coupled to a local mutation, first assess the destination's guarantees. The decision to emit an integration event belongs to [Event-Driven Architecture](./event-driven-architecture); the transaction boundary belongs to [Transactional Consistency](/engineering/backend/reliability/transactional-consistency).

## Flow Responsibilities

1. **Producer:** validate the command and invariants, then save the business mutation and Outbox delivery in one transaction. Do not call the broker inside that transaction.
2. **Relay:** discover committed deliveries, coordinate claims across instances and publish to the intended destination.
3. **Destination:** signal acceptance according to its protocol. Close the delivery only after the required signal. A lost response leaves an ambiguous result to reconcile or retry.
4. **Consumer:** recognize redelivery and acknowledge the broker after applying a durable effect.

Keep at least a stable message ID, destination, contract type and version, payload or a reference from which to build it, creation time, and publication state or cursor. Add an aggregate ID and sequence when order matters; correlation and trace IDs for diagnostics; and attempt count and next attempt time when retries are needed. These are responsibilities, not a prescribed table schema. **One delivery represents one destination.** If `OrderPlaced` must reach both a broker and an email provider, choose independent deliveries or publish once and distribute downstream according to each destination's contract.

## State, Scheduling and Evidence

| Delivery Situation | Decision the Design Must Express |
| --- | --- |
| Pending | Eligible for the relay when its first visibility time arrives. |
| In progress | Temporarily owned; an expired claim can be recovered. |
| Published | The destination supplied the acceptance required by its delivery contract. |
| Quarantined | Attempts are exhausted, a failure is terminal, or an ambiguous result needs investigation. |
| Canceled | A business decision means it should no longer be sent; this is not a publication failure. |

These situations may be represented by row states, a CDC cursor or other durable records. Keep **first visibility time** distinct from **next attempt time**, and **business expiration** distinct from **evidence retention**. If you introduce priority, ensure it does not break required ordering per aggregate. Record both send time and destination acceptance time when that latency matters.

Attempt history explains each actual send. A summary counter should count attempts, not deferrals while a circuit breaker is open. Quarantine preserves a diagnosis; an inbox or unique key at the consumer can deduplicate effects. These responsibilities do not require a separate table for every project.

## Choose and Recover the Relay

| Approach | How It Advances | Operational Decision |
| --- | --- | --- |
| Table polling | A worker claims pending rows, publishes and updates their state. | Control concurrency, retries, abandoned claims and backlog age. |
| Change data capture (CDC) | A process reads committed transaction log changes and routes them. | Operate the connector, its read position and the event contract. |

Both approaches can resend and therefore require idempotent consumers. With shared storage, a worker must claim only destinations it can publish. In concurrent polling, claiming and publishing are separate stages: a short row lock cannot protect a worker after its claim transaction commits. PostgreSQL `FOR UPDATE SKIP LOCKED` can distribute rows, but an expiring claim and an owner token or equivalent are still needed to recover abandoned work and stop an earlier worker from closing a newer owner's claim. See [PostgreSQL `SELECT`](https://www.postgresql.org/docs/current/sql-select.html) and [Debezium's Outbox Event Router](https://debezium.io/documentation/reference/stable/transformations/outbox-event-router.html).

## Add Mechanisms When Needed

| Condition | Mechanism to Evaluate |
| --- | --- |
| Several relays compete | Atomic claim and owner-conditional completion; renew the lease if sends can outlast it. |
| A destination stays unavailable | Bounded retries with jitter; a circuit breaker may avoid repeated calls while it is down. |
| One fact has several destinations | Independent deliveries and policies, or downstream distribution after one publication. |
| Backlog grows faster than publication | Tune batch size, concurrency and destination connections; alert on age and drain capacity. |
| Support needs investigation and replay | Attempt history, exception state and controlled replay with traceability. |

The basic pattern requires an atomic write and a recoverable relay, not a fixed number of tables, workers or states. See [Microsoft's transient fault guidance](https://learn.microsoft.com/en-us/azure/architecture/best-practices/transient-faults).

## Failure Outcomes

| Failure Point | Design Response |
| --- | --- |
| Before commit | Roll back both the order change and `OrderPlaced` delivery. |
| After commit, before send | A later relay cycle finds the pending delivery. |
| Destination accepts, but recording success fails | A retry may resend the same ID; the consumer deduplicates. |
| Worker stops while holding a claim | Recovery policy makes the delivery eligible again. |
| Consumer commits its effect but cannot acknowledge | The broker may redeliver; the effect remains idempotent. |

The relay normally has **at least once** semantics: it may repeat a send, and quarantine means a delivery is still unpublished. It does not provide end-to-end exactly once processing. A send without a network exception does not prove durable acceptance. In RabbitMQ, use publisher confirms for broker acceptance; when routing to a queue is required, handle returns for `mandatory` publications too, because an unroutable publication can still be confirmed. Consumer acknowledgements cover a separate stage. See [RabbitMQ publisher confirms and consumer acknowledgements](https://www.rabbitmq.com/docs/confirms).

## Idempotency and Order

A consumer can record `(consumer_name, message_id)`. If it changes a database, commit that processed key **with the effect** in one local transaction. A prior existence check alone leaves a race. For an external effect, use the provider's idempotency key or define reconciliation for an uncertain result. Producer request idempotency is separate: repeating a request may create two messages with different IDs unless a business operation key or uniqueness rule prevents it. See [Transactional Outbox](https://microservices.io/patterns/data/transactional-outbox) and [RabbitMQ's reliability guide](https://www.rabbitmq.com/docs/reliability).

Separate three identifiers when the case needs them: a **business key** lets support identify the order; a **producer operation key** prevents repeated placement from creating equivalent deliveries; and a **message ID** lets a consumer recognize redelivery of the same delivery. If one action creates several destinations, define operation-key uniqueness per operation and destination.

If order matters, define it per aggregate or business key, not for the entire table. A sequence or version can detect stale events, but claiming, publishing and consuming must preserve the required sequence too. SQL ordering by creation time is insufficient with concurrent workers, retries or rows skipped by `SKIP LOCKED`. See [Transactional Outbox](https://microservices.io/patterns/data/transactional-outbox) and [Debezium's Outbox Event Router](https://debezium.io/documentation/reference/stable/transformations/outbox-event-router.html).

## Retries and Operations

- **Transient failures:** bound each attempt and retry count. Use exponential backoff with **jitter**, a random variation in delay, so relays do not overload a recovering destination together. Respect `Retry-After` when available. For an ambiguous result, retain the same ID and reconcile or rely on deduplication before repeating a sensitive effect. See [Microsoft's transient fault guidance](https://learn.microsoft.com/en-us/azure/architecture/best-practices/transient-faults).
- **Exceptions:** quarantine deliveries that no longer qualify for automatic retry. Record cause, owner, correction and replay procedure. Dead letter does not mean success.
- **Replay:** distinguish an automatic retry from a new delivery created from quarantine. A new `message_id` bypasses deduplication by ID, so first verify that the business effect still belongs. Define how that new delivery interacts with producer operation uniqueness; link it to the original and audit who authorized and executed replay.
- **Observability:** measure pending count and age per destination, commit-to-acceptance latency, retries, expired claims and exceptions. Correlate message, operation and traces without exposing sensitive data. See [OpenTelemetry messaging spans](https://opentelemetry.io/docs/specs/semconv/messaging/messaging-spans/).
- **Protection and retention:** minimize payload and headers; do not store secrets, tokens or credentials. Restrict inspection, replay and purge according to sensitivity. Keep delivery and deduplication evidence long enough to cover possible redelivery.

Shared broker and consumer guarantees belong to [Reliable Message Delivery](./reliable-delivery). Hosting a .NET relay belongs to [Background Services](/engineering/backend/dotnet/background-services/background-services-reference); failure and recovery tests belong to [Event-Driven Systems](/quality/systems/event-driven-systems).
