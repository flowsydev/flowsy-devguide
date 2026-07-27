---
title: Backend
description: Path for designing behavior, contracts, reliability and .NET solutions.
type: landing
audience: Architecture and backend development people.
canonical: true
---

# Backend

Base guidance for backend APIs and services, independent of a specific language or framework. Read from design decisions toward implementation details.

| Need | Start Here |
| --- | --- |
| Design a change with business behavior | [Design Baseline](./design-baseline) |
| Choose code organization | [Backend Architectures](./architecture/) |
| Design an HTTP contract | [HTTP API Design](./api/http-api-design) |
| Model failures, rules or transactions | [Reliability](./reliability/) |
| Implement with C# and Minimal APIs | [.NET](./dotnet/) |
| Change persistence | [Data](../data/) |
| Publish or consume events | [Messaging](../messaging/) |
| Define evidence | [Quality](/quality/) |

## Design Conventions

- Name contracts by functional role (`CreateOrderRequest`, `OrderSummary`).
- Avoid generic suffixes that add no semantics.
- Choose the language of domain contracts according to the project's ubiquitous language.
- Keep naming consistent inside each Bounded Context.
- See language-specific guides: [C#](./dotnet/csharp), [Vue 3 and TypeScript](../frontend/vue/conventions).

## Shared Modeling Concerns

Date/time, auditing, validity and public identifiers live in [Cross-Cutting](/engineering/cross-cutting/). Value Objects and domain modeling belong in [Domain Modeling](/foundations/domain-modeling/).

## Traceability

- Include `correlationId` / `requestId` in logs and error responses.
- Log relevant business events with operational context.

Start with the design baseline and select patterns only when the context justifies them.
