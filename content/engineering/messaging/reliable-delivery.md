---
title: Reliable Message Delivery
description: Canonical source for Outbox, retries, idempotency, duplicates, ordering and DLQ.
type: guide
audience: Backend, integration, messaging, operations and quality people.
canonical: true
---

# Reliable Message Delivery

Brokers and networks can deliver more than once, delay, reorder or reject messages. Design producers, relays and consumers to recover without relying on exactly-once delivery end to end.

## Producer and Outbox

- Persist the business mutation and the Outbox record in the same transaction.
- Publish afterward through a recoverable relay.
- Keep a stable message identifier and observable publication state.
- Do not call the broker in the middle of the business transaction.

Example Outbox table shape:

```sql
CREATE TABLE domain_event_outbox (
    event_id          uuid PRIMARY KEY,
    event_type        text NOT NULL,
    payload           jsonb NOT NULL,
    created_at        timestamptz NOT NULL DEFAULT clock_timestamp(),
    published_at      timestamptz
);
```

## Consumer

- Detect duplicates with a stable key when the effect is not naturally idempotent.
- Acknowledge the message only after completing its durable effect.
- Apply bounded retries for transient failures.
- Send non-recoverable failures to a Dead Letter Queue (DLQ) with safe, traceable context.
- Do not assume global order; define the partition key or version condition you actually need.

## Operational Signals

- Monitor consumer lag and processing times.
- Alert on DLQ growth.
- Record publication and consumption metrics per event type.
- Correlate flows with `correlationId` and distributed tracing.

The decision to emit events belongs to [Event-Driven Architecture](./event-driven-architecture); worker implementation belongs to the [.NET Background Services](/engineering/backend/dotnet/background-services/) profile; evidence belongs to [Event-Driven Systems](/quality/systems/event-driven-systems).
