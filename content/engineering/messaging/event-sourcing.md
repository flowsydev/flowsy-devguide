---
title: Event Sourcing
description: Persisting state as a sequence of domain events and reconstructing decision state.
type: guide
audience: Architecture, backend and data people.
canonical: true
---

# Event Sourcing: Concepts

Guide for systems that persist state as a sequence of immutable events. Event Sourcing uses the event history as the source of truth, enabling complete auditing and state reconstruction at any point in time.

## Principles

- State is reconstructed from the **complete sequence of events**.
- Events are **immutable** and stored in append-only mode.
- Separation between **write model** (events) and **read model** (projections).
- The **event store** is the sole source of truth; records are never updated or deleted.
- Invalid commands do not append events; validation happens before the append and concurrency is protected by stream version or append conditions.

## Difference with EDA

| Aspect | Event Sourcing | Event-Driven Architecture |
| --- | --- | --- |
| Purpose | Persist state as a sequence of events | Asynchronous communication between services |
| Storage | Event store (append-only) | Message broker (transient or with retention) |
| Reconstruction | State reconstructed from events | Not directly applicable |
| Typical use | Complete auditing, time travel, financial systems | Integration between bounded contexts |

Both approaches are complementary: a system can use Event Sourcing internally and EDA to communicate with other services.

## Recommended Technologies

| Technology | Description |
| --- | --- |
| **Apache Kafka** | Distributed event log with configurable retention; suitable for event sourcing at scale. |
| **Redpanda** | Lightweight alternative compatible with Kafka protocol; smaller operational footprint. |
| **EventStoreDB** | Database designed specifically for event sourcing; native stream support per aggregate. |
| **Marten (.NET)** | Event store on top of PostgreSQL with native .NET integration; built-in projections. |

## Projections

Projections build read views from the event log:

- Maintain projections as **materialized views** of the event log.
- Design each projection for a **specific read pattern** (screen, report, search).
- Allow **complete reconstruction** from the event store (in case of corruption or new projection).
- Consider **asynchronous projections** to decouple reads from writes (eventual consistency).

The following diagrams are conceptual. Adapt event names, projection names, storage objects and operational policies to the project's domain language, database engine, framework and infrastructure conventions.

```text
Event Store (append-only)
    ├── Projection: OrderSummaryView   → table order_summary
    ├── Projection: UserActivityReport → table user_activity
    └── Projection: SearchIndex        → search index
```

## Snapshots

Snapshots optimize reconstruction of aggregates with many events:

- Use snapshots for aggregates with a **long event history**.
- Define a **frequency policy** per aggregate (e.g. every 50 events, every 24 hours).
- Snapshots are an **optimization, not a replacement** for the event log.
- When reconstructing: load the last snapshot and apply only subsequent events.

```text
Reconstruction without snapshot:  Event 1 → 2 → ... → N (expensive if N is large)
Reconstruction with snapshot:     Snapshot(N-50) → Event N-49 → ... → N (efficient)
```

## Conventions

### Event Naming

- Each event must be **self-descriptive**: type, version and timestamp.
- Name in past tense with the aggregate as prefix: `ShoppingCartCreated`, `ItemAddedToCart`.

### Versioning

- Use event versioning to evolve schemas without losing history.
- Include a `version` field in each event.
- When introducing incompatible changes, create a new event version (`v2`) while maintaining the `v1` processor.

### Streams per Aggregate

- Separate streams by **aggregate instance** to facilitate concurrency and reconstruction.
- Stream name: `[aggregate-type]-[aggregate-id]` (e.g. `shopping-cart-{cartId}`).

### Event Catalog

- Document the event catalog per bounded context.
- Define retention and archiving policies for the event store.

## When to Use Event Sourcing

Event Sourcing adds complexity. Consider it when:

- Complete and immutable audit history of changes is required.
- The business needs "time travel" (querying state at a past point in time).
- Read projections must be reconstructable or redefinable.
- The domain has high complexity of rules and aggregate behavior.

Avoid in simple CRUD systems without advanced audit requirements.

## Cross Reference

- [Kafka and Redpanda as Event Store](./kafka-redpanda-event-store)
- [Error Handling](/engineering/backend/reliability/error-handling) — validation before state changes, conflicts and infrastructure boundaries.
- [EDA: Concepts](/engineering/messaging/event-driven-architecture) — event-driven architecture.
- [VSA: Concepts](/engineering/backend/architecture/vertical-slice-architecture) — integration with slices.
