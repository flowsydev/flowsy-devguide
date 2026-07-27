---
title: Dynamic Consistency Boundaries
description: Approach for defining the consistency boundary needed by each behavior.
type: guide
audience: People who design commands over complex domains.
canonical: true
---

# Dynamic Consistency Boundaries

Dynamic Consistency Boundaries (DCB) proposes reasoning by command: load the indispensable decision state, validate the behavior and persist with an explicit consistency condition. It is a modeling mindset, not a synonym for a `State` class or for Vertical Slice Architecture.

## When to Evaluate It

- Different commands traverse different data sets.
- A classical Aggregate would become artificially large.
- The store can express suitable concurrency or append conditions.

## Risks

- Implicit boundaries that are hard to review.
- Expensive decision queries.
- Incomplete concurrency conditions.

Document for each command the decision data, the invariant, the consistency condition and the downstream effects. Application in VSA lives in [State and StateHandler](/engineering/backend/dotnet/minimal-apis/state-and-statehandler).
