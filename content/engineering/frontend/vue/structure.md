---
title: Vue Structure
description: Mapping modular architecture to Vue feature-sets, kernel and folders.
type: profile
audience: People organizing Vue applications.
canonical: true
canonicalSource: /engineering/frontend/modular-architecture
---

# Vue Structure

Group behavior by feature and keep a small `kernel` for cross-cutting infrastructure.

```text
📁 src/
├── 📁 kernel/
│   ├── 📁 api/
│   └── 📁 routing/
└── 📁 feature-sets/
    └── 📁 shopping-carts/
        ├── 📁 components/
        ├── 📁 composables/
        ├── 📁 logic/
        ├── 📁 model/
        ├── 📁 routing/
        ├── 📁 stores/
        └── 📁 translation/
```

`stores/` is the recommended physical folder for Pinia; "state" describes its responsibility. Use `routing/` for route configuration and `translation/` for localized text or catalogs. Avoid generic global folders that hide domain ownership.

See [Modular Architecture](../modular-architecture) and the [Vue ecosystem reference](./vue-ecosystem-reference#vue-feature-set-structure) for complete layouts.
