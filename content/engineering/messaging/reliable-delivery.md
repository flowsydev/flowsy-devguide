---
title: Reliable Message Delivery
description: Shared guarantees for publication, redelivery, idempotency, ordering and failure handling in messaging.
type: guide
audience: Backend, integration, messaging, operations and quality people.
canonical: true
related:
  - /engineering/messaging/outbox
---

# Reliable Message Delivery

Use this guide to define what each stage between producer, transport and consumer promises. A network or broker may delay, reject, reorder or redeliver messages. Declare the guarantee required by the use case and how each participant recovers; one acknowledgement does not imply end-to-end exactly once processing. See [RabbitMQ's reliability guide](https://www.rabbitmq.com/docs/reliability).

## Responsibility Boundaries

| Participant | Responsibility |
| --- | --- |
| Producer | Preserve delivery intent when publication depends on a local mutation; apply [Transactional Outbox](./outbox) in that case. |
| Publisher and transport | Confirm acceptance according to the protocol, retry uncertain deliveries with a stable ID, and make backlog visible. |
| Consumer | Apply the effect idempotently and acknowledge after making it durable. |

In RabbitMQ, publisher confirms and consumer acknowledgements cover independent stages: broker acceptance does not prove consumer processing. Depending on routing, an unroutable publication may also receive a confirm. See [RabbitMQ publisher confirms and consumer acknowledgements](https://www.rabbitmq.com/docs/confirms).

## Duplicates, Order and Failures

- **Duplicates:** retain a stable identifier across retries. When the consumer effect is not naturally idempotent, record its deduplication key with the durable change. Repeated producer requests additionally need a business operation key.
- **Order:** identify the aggregate or group that needs sequencing. Choose a partition, session, serial processing or version check according to the transport; do not assume global order.
- **Retries:** distinguish transient failures, terminal rejections and ambiguous results. Bound attempts and use backoff with jitter when many publishers may retry together. Decide when reconciliation must precede resending. See [Microsoft's transient fault guidance](https://learn.microsoft.com/en-us/azure/architecture/best-practices/transient-faults).
- **Exceptions:** move messages needing intervention to a dead-letter queue or exception state with cause, owner and replay procedure. An exception is not a successful delivery.
- **Observability:** measure delay, redelivery, errors and exceptions per destination. Use message and correlation IDs to reconstruct the flow without exposing sensitive data.

The decision to emit events belongs to [Event-Driven Architecture](./event-driven-architecture). For the joint write of business data and a message, see [Transactional Outbox](./outbox); for evidence of these guarantees, see [Event-Driven Systems](/quality/systems/event-driven-systems).
