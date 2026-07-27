---
title: Event-Driven Systems
description: Testing guidance for events, outbox, Kafka, Redpanda and Event Sourcing.
type: profile
audience: Quality, integration and backend development people.
canonical: true
canonicalSource: /quality/automated-testing-strategy
---

# Event-Driven Systems

Guide for unit, integration and end-to-end tests in systems with events, background services, Kafka, Redpanda, outbox pattern and Event Sourcing.

## What to Test in Unit Tests

- Mapping between command, event and read model.
- Event validators.
- Handler idempotency.
- Partitioning rules or aggregate keys.
- Payload transformations and internal versioning.
- Retry classification and dead-letter decisions.

Use test doubles for producer, consumer, clock and repositories when behavior can be validated without a real broker.

## What to Test in Integration

- Producer publishes to the expected topic with correct key, headers and payload.
- Consumer processes valid messages.
- Consumer rejects or routes invalid messages.
- Outbox publishes once and marks state correctly.
- Retry and dead-letter flows activate under controlled conditions.
- Projections update from real events.
- Transaction boundaries between database and messaging are preserved.

Use ephemeral brokers or controlled environments. Kafka, Redpanda and Testcontainers are natural candidates for reproducible tests.

## What to Test End-to-End

Reserve E2E for critical asynchronous flows:

- A user performs an action and the system reflects the result after event processing.
- An external service publishes an event and the system updates visible state.
- A business operation requires correlation across API, outbox, broker, consumer and persistence.

Define clear timeouts and observable conditions. Do not use fixed sleeps when you can query state or wait for an event with a limit.

## Contracts and Versioning

- Treat event shape as a contract.
- Document schema, required fields, header semantics and compatibility.
- Validate consumers against events with additional fields.
- Keep tests for event version changes.
- Use event fixtures that represent the domain.
- Document breaking changes with migration or rollout guidance.

## Diagnostics

Include `correlationId`, `eventId`, topic, partition, offset and consumer name when available. Evidence should help reconstruct the flow without exposing sensitive data.

## References

- [Apache Kafka: Testing a Streams Application](https://kafka.apache.org/38/streams/developer-guide/testing/)
- [Confluent: Testing Kafka](https://developer.confluent.io/learn/testing-kafka/)
- [Confluent: Kafka Native Testcontainers](https://developer.confluent.io/confluent-tutorials/kafka-native-testcontainers/kafka/)
- [Testcontainers: Redpanda Module](https://testcontainers.com/modules/redpanda/)
- [Event-Driven Architecture](/engineering/messaging/event-driven-architecture)
- [Event Sourcing](/engineering/messaging/event-sourcing)
- [Integration Tests](../integration-tests)
