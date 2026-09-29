---
title: Feature-Set Structure with Minimal APIs
description: Organization of endpoints, commands, queries, infrastructure and models by behavior.
type: profile
audience: Backend C# developers using VSA.
canonical: true
canonicalSource: /engineering/backend/architecture/vertical-slice-architecture
---

# Feature-Set Structure with Minimal APIs

```text
Features/
└── Sales/
    └── OrderPlacement/
        ├── Commands/
        │   └── CreateShoppingCart/
        │       ├── CreateShoppingCartEndpoint.cs
        │       ├── CreateShoppingCartCommand.cs
        │       ├── CreateShoppingCartCommandValidator.cs
        │       └── CreateShoppingCartState.cs       ← Optional
        ├── Infrastructure/
        │   └── ShoppingCartFinder.cs             ← Shared when needed
        ├── Model/
        │   └── ShoppingCartOverview.cs           ← Shared when needed
        └── Queries/
            └── ShoppingCartDetail/
                ├── ShoppingCartDetailEndpoint.cs
                ├── ShoppingCartDetailQuery.cs
                └── ShoppingCartDetailQueryValidator.cs  ← Optional
```

Each child of `Commands/` or `Queries/` is a slice. Keep its endpoint beside its command or query, result, handler, validator and other behavior-specific artifacts. The handler may share a file with the command or query.

Each `[ActionName]Endpoint` class registers its own route through `Map(RouteGroupBuilder)`. The application's composition point calls those methods while configuring the route group. Keep route registration in each slice rather than a feature-set aggregator.

`State` and its concrete `StateHandler` are optional. When one command needs them, keep both in `[ActionName]State.cs` inside that command's folder. If multiple commands truly reuse the same decision state, place it in their closest common folder while keeping each command's endpoint and handler in its own slice.

Extract adapters or models to `Infrastructure/` or `Model/` only when several slices consume them. Avoid global horizontal layers that force traversing the repository to understand a single feature.

Structure alone does not define the domain model; see [Domain Modeling](/foundations/domain-modeling/) and [Reliability](/engineering/backend/reliability/).
