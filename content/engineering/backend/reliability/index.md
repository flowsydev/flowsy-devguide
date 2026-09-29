---
title: Backend Reliability
description: Canonical practices for errors, validation, consistency and idempotency.
type: landing
audience: Architecture, backend, data, messaging and quality people.
canonical: true
---

# Backend Reliability

## Reading Path

1. [Error Handling](./error-handling): classify and translate failures across boundaries.
2. [Validation and Domain Rules](./validation-and-domain-rules): separate contract, preconditions and invariants.
3. [Transactional Consistency](./transactional-consistency): order mutations, idempotency and effects.
4. [Transactional Outbox](/engineering/messaging/outbox): record messages with a mutation and operate the relay. [Reliable Message Delivery](/engineering/messaging/reliable-delivery) defines shared retry and consumption guarantees.

Mapping to RFC 9457 Problem Details belongs to [HTTP API Design](../api/http-api-design).
