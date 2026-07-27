---
title: VSA with Minimal APIs
description: Progressive path for implementing feature-sets with Minimal APIs without duplicating examples by invocation mechanism.
type: landing
audience: Backend C# developers.
canonical: true
---

# VSA with Minimal APIs

## Progressive Path

1. [Feature-Set Structure](./feature-set-structure).
2. [Endpoints and HTTP Results](./endpoints-and-http-results).
3. [Commands and Queries](./commands-and-queries).
4. [State and StateHandler](./state-and-statehandler).
5. [Complete Examples](./examples/).

Using Mediator or direct invocation changes composition, not use-case rules. Examples show focused differences and share command, validation, state and model. The [broad reference](./minimal-apis-reference) keeps the full prior material.

Common Flowsy packages in these examples include `Flowsy.Mediation` and persistence helpers such as `Flowsy.Db.Unity`. Adapt package choices to the consuming project.
