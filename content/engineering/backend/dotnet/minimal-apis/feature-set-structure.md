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
📁 ShoppingCarts/
├── 📁 Commands/
├── 📁 Infrastructure/
├── 📁 Model/
├── 📁 Queries/
└── 📄 ShoppingCartsEndpoints.cs
```

Group endpoint, command/query, validation and adapters near the behavior. Extract shared models only when several operations consume them. Avoid global horizontal layers that force traversing the repository to understand a single feature.

Structure alone does not define the domain model; see [Domain Modeling](/foundations/domain-modeling/) and [Reliability](/engineering/backend/reliability/).
