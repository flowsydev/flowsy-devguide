---
title: Transactional Consistency
description: Mutation boundaries, command idempotency, concurrency and effect coordination.
type: guide
audience: Backend, data, messaging and architecture people.
canonical: true
---

# Transactional Consistency

Define intentionally which data must change atomically and which effects can complete later through reliable delivery.

## Recommended Sequence

1. Normalize and validate the contract.
2. Load the decision data needed.
3. Evaluate preconditions and invariants.
4. Persist the mutation with an explicit concurrency condition.
5. Record messages in the Outbox inside the same durable boundary.
6. Commit the transaction.
7. Execute external effects through a relay or recoverable process.

Use idempotency keys for retryable commands and distinguish that decision from consumer idempotency. For delivery, ordering, duplicates and DLQ, see [Reliable Delivery](/engineering/messaging/reliable-delivery).
