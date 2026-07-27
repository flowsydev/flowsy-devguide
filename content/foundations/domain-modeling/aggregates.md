---
title: Aggregates
description: Consistency boundaries that protect invariants through an explicit root.
type: guide
audience: People who design transactional domain behavior.
canonical: true
---

# Aggregates

Use an Aggregate when several entities or values must respect invariants inside the same consistency boundary. The root controls mutations and prevents external consumers from changing the set without applying its rules.

## Practical Criteria

- Include only data needed to protect atomic invariants.
- Avoid large Aggregates chosen for query convenience.
- Reference other Aggregates by identity when immediate consistency is not required.
- Model the transaction from behavior, not from the existing schema.

A `ShoppingCart` may block changes after checkout and control its items as one unit. Related tables alone are not enough to define the Aggregate.

When different actions need different boundaries, evaluate [Dynamic Consistency Boundaries](./dynamic-consistency-boundaries).
