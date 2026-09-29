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

Each command or query owns a slice with its endpoint in the same folder. Each endpoint registers its route through `Map(RouteGroupBuilder)`. Using Mediator or direct invocation changes composition, not the use-case rules or structure. Examples show focused differences; `State` and concrete `StateHandler` remain optional. The [detailed reference](./minimal-apis-reference) contains complete examples.

Common Flowsy packages in these examples include `Flowsy.Mediation` and persistence helpers such as `Flowsy.Db.Unity`. Adapt package choices to the consuming project.
