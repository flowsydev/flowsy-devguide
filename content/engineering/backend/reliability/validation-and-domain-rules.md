---
title: Validation and Domain Rules
description: Canonical separation of contract validation, preconditions, invariants and persistence safeguards.
type: guide
audience: Analysis, backend, data and quality people.
canonical: true
---

# Validation and Domain Rules

Validate before changing durable state or starting side effects. Place each rule at the boundary that can express, test and maintain it clearly.

| Concern | Primary Location |
| --- | --- |
| Shape, format and required fields | Contract and input validator. |
| State required by a use case | Application or handler. |
| Business invariant | Domain model or decision state. |
| Referential integrity and concurrent uniqueness | Model plus persistence constraint. |

Database constraints are necessary safeguards, but they must not hide primary behavior. For example, "a cancelled order does not accept line items" should be readable in the model; a constraint may reinforce integrity when feasible.

Unit tests cover pure rules and integration tests confirm adapters and constraints. See [Quality](/quality/).
