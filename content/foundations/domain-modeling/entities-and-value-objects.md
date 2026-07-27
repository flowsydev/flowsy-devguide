---
title: Entities and Value Objects
description: Tactical patterns for representing identity, state and domain values.
type: guide
audience: People who design domain models.
canonical: true
---

# Entities and Value Objects

An entity keeps identity across its lifecycle; a Value Object is defined by its values and should favor immutability and validation at construction.

## Selection Criteria

| Question | Entity | Value Object |
| --- | --- | --- |
| Does it matter to distinguish two instances with the same data? | Yes | No |
| Does it have its own lifecycle? | Yes | No |
| Can it be validated as a unit of value? | Sometimes | Yes |

`Customer` or `ShoppingCart` usually need identity. `PostalAddress`, `Money` and `DateRange` usually work better as values with their own invariants.

External identifiers follow the [Public Identifiers](/engineering/cross-cutting/identifiers) policy; auditing and validity follow [Auditing and Validity](/engineering/cross-cutting/auditing-and-validity).
