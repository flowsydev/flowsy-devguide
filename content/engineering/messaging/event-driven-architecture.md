---
title: Event-Driven Architecture
description: Asynchronous communication, domain events and reactive integration patterns.
type: guide
audience: Architecture, backend, integration and operations people.
canonical: true
---

# EDA: Concepts

Guide for systems that use asynchronous event-based communication. Event-Driven Architecture (EDA) decouples producers and consumers, enabling more resilient and scalable systems.

## Principles

- **Decoupling**: event producers do not know their consumers.
- **Immutability**: events represent business facts that already occurred; they are immutable.
- **Idempotence**: consumers must handle the same event more than once without undesired side effects.
- **Guaranteed order**: when the domain requires it, use partitions or ordered streams (e.g. Kafka with partition key per aggregate).

## Recommended Message Brokers

| Broker | Characteristics |
| --- | --- |
| **Apache Kafka** | High throughput, durable persistence, event replay, partitioning. |
| **Redpanda** | Kafka protocol compatible, smaller operational footprint, easier to operate. |
| **RabbitMQ** | Flexible routing, good request-reply pattern support, operational maturity. |
| **Azure Service Bus** | Managed service, native integration with Azure ecosystem, guaranteed SLA. |

## Recommended Patterns

### Publish/Subscribe

Broadcasting domain events to multiple independent consumers. The producer publishes to a topic/exchange; consumers subscribe independently.

### Competing Consumers

Multiple instances of the same consumer compete to process messages from the same queue. Enables horizontal scaling of processing.

### Dead Letter Queue (DLQ)

Messages that repeatedly fail move to a separate queue for analysis and manual reprocessing. Normative guidance for retries, duplicates and DLQ lives in [Reliable Delivery](./reliable-delivery).


### Outbox Pattern

Guarantees consistency between the database and the message broker by recording events in the same transaction as the domain mutation, then publishing through a recoverable relay. Normative guidance and table examples live in [Reliable Delivery](./reliable-delivery).


### Saga / Choreography

Coordination of distributed processes via events. Each service reacts to events and emits new events, forming a processing chain without a central coordinator.

## Event Conventions

### Naming

- Name events in **past tense**: `OrderCreated`, `PaymentProcessed`, `UserAccountSuspended`.
- The name must express a business fact, not a technical operation.

### Standard Metadata

Every event must include standard metadata:

```json
{
  "eventId": "3f2e1d4c-...",
  "eventType": "OrderCreated",
  "eventVersion": "1.0",
  "timestamp": "2024-01-15T10:30:00-06:00",
  "correlationId": "a1b2c3d4-...",
  "source": "sales-service"
}
```

| Field | Description |
| --- | --- |
| `eventId` | Unique event identifier (UUID). |
| `eventType` | Event type name. |
| `eventVersion` | Event schema version. |
| `timestamp` | Occurrence instant (ISO-8601 with timezone). |
| `correlationId` | Correlation ID for traceability between services. |
| `source` | Service or bounded context that originated the event. |

### Schema Versioning

- Version event schemas to avoid breaking existing consumers.
- Strategies: `version` field in the event, separate topics per version (`orders.v1`, `orders.v2`).
- Document the event catalog per bounded context.

## Observability

- Trace complete flows using `correlationId` between services.
- Monitor consumer lag and processing times.
- Alert on dead letter queue growth.
- Record publication and consumption metrics per event type.
- Use distributed tracing (OpenTelemetry) to correlate spans between producers and consumers.

## Cross Reference

- [Reliable Delivery](./reliable-delivery) — Outbox, retries, idempotency, duplicates and DLQ.
- [Background Services](/engineering/backend/dotnet/background-services/) — consumer implementation in .NET.
- [Error Handling](/engineering/backend/reliability/error-handling) — failure taxonomy across boundaries.
- [Event Sourcing](./event-sourcing) — using events as source of truth.
- [Vertical Slice Architecture](/engineering/backend/architecture/vertical-slice-architecture) — EDA integration with slices.
