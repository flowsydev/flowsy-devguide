---
title: Error Handling
description: Taxonomy, propagation, translation and sanitization of errors across boundaries.
type: guide
audience: People who design applications, adapters and delivery contracts.
canonical: true
---

# Error Handling

Model expected errors with stable application language and translate infrastructure details in their adapters. This page owns the general taxonomy; HTTP keeps its specific contract.

| Category | Primary Owner |
| --- | --- |
| Invalid input shape | Adapter or contract validator. |
| Application precondition | Use case or handler. |
| Domain invariant | Entity, Value Object, Aggregate or decision state. |
| Conflict or concurrency | Application and persistence boundary. |
| Infrastructure failure | Provider adapter. |
| Unexpected failure | Execution boundary and observability. |

## Rules

- Do not expose driver, SDK, SQL, credential or stack-trace details.
- Keep a stable, safe code for expected errors.
- Record technical context in observability without turning it into a public contract.
- Translate the error when crossing a boundary; do not couple the domain to provider exceptions.

See [Validation and Domain Rules](./validation-and-domain-rules), [Transactional Consistency](./transactional-consistency) and the [reference material](./error-handling-reference) for architecture-specific examples.
