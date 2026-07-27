---
title: Commands and Queries with Minimal APIs
description: Separation of mutations, reads, validators and response models.
type: profile
audience: Backend C# developers using VSA.
canonical: true
canonicalSource: /engineering/backend/architecture/vertical-slice-architecture
---

# Commands and Queries with Minimal APIs

A command expresses an intention that may change state. A query extracts data without introducing business effects.

Validators cover shape and simple input rules. Preconditions and invariants live in the use case or appropriate model. A simple mutation may run directly in the handler; a complex mutation may use [State and StateHandler](./state-and-statehandler).

Mediator (`Flowsy.Mediation` or an equivalent) is optional. Use it when the pipeline, decoupling or cross-cutting behavior adds observable value; direct invocation is valid and must not force a second copy of the use case.
