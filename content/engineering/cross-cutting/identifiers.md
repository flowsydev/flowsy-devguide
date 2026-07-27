---
title: Public Identifiers
description: Canonical policy for separating internal identity, external contracts and safe exposure.
type: guide
audience: API, backend, frontend, data and security people.
canonical: true
---

# Public Identifiers

Do not automatically expose the internal physical key. Use a stable public identifier when enumeration risk, migration, interoperability or storage evolution justifies it.

## Rules

- External contracts use an opaque, stable identifier such as UUID/ULID according to system constraints.
- Internal keys are chosen for persistence needs and may change without altering the contract.
- Naming distinguishes intent: `PublicId` / `IdPublico` versus `InternalId` / `IdInterno` when both appear.
- An identifier does not replace authorization; validate access to the resource on every operation.
- Events and messages keep the business and correlation IDs needed for traceability.

Recommended public attribute:

| Purpose | English | Spanish | Recommended Type |
| --- | --- | --- | --- |
| Public identifier | `PublicId` | `IdPublico` | UUID v4 or UUID v7 |

Do not expose numeric auto-increment primary keys outside backend applications, trusted internal jobs or controlled operational tooling.

Documentary artifact IDs follow a different catalog in [Identifiers and Traceability](/documentation/project-artifacts/identifiers-and-traceability) when that page applies. Complementary bilingual tables remain in the [DDD reference](/foundations/domain-modeling/domain-driven-design-reference#public-identifiers) and [Relational Modeling](/engineering/data/relational-modeling).
