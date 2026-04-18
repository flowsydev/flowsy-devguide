# Frontend Modular Architecture: Concepts

Principles and organizational structure for frontend applications in the Flowsy ecosystem. The goal is to maintain domain cohesion and avoid technical coupling that hinders team scalability.

## Principles

- **Domain cohesion**: group by business feature (feature-set), not by technical type.
- **Feature-set autonomy**: each feature-set can evolve without affecting others.
- **Kernel module**: shared functionalities centralized in a single place.
- **Avoid global folders by type**: do not create `components/`, `stores/`, `composables/` at the frontend root.
- **Separation of concerns**: visual layer, domain logic and data access clearly separated within each feature-set.

## Why Feature-Sets and not Technical Types?

Organizing by technical type (`components/`, `stores/`, `services/`) causes:

- Related files scattered in multiple distant folders.
- High friction to understand or modify a complete feature.
- Frequent Git conflicts when multiple developers work on different features.
- Difficulty measuring the impact of a change.

Organizing by feature-set results in:

- Everything related to `ShoppingCart` lives in `features/shopping-cart/`.
- A developer can understand and modify a complete feature without jumping between folders.
- Changes are localized; the impact on other features is explicit.

## Folder Structure

```text
src/
└── features/
    ├── kernel/                          ← Shared by all feature-sets
    │   ├── components/
    │   ├── composables/
    │   ├── logic/
    │   ├── model/
    │   ├── router/
    │   ├── stores/
    │   └── translations/
    └── <feature-set-name>/
        └── <feature-set-name>/
            ├── components/
            │   └── <ComponentName>/
            │       ├── <ComponentName>.vue
            │       ├── <ComponentName>.model.ts
            │       ├── <ComponentName>.lang.en.ts
            │       ├── <ComponentName>.stories.ts
            │       ├── <ComponentName>.specs.ts
            │       └── index.ts
            ├── composables/
            │   └── <composable-name>/
            │       ├── use<ComposableName>.ts
            │       ├── use<ComposableName>.specs.ts
            │       └── index.ts
            ├── logic/
            ├── model/
            ├── router/
            │   ├── <route-group>.ts
            │   └── index.ts
            ├── stores/
            │   └── <store-name>/
            │       ├── <store-name>.ts
            │       ├── <store-name>.specs.ts
            │       └── index.ts
            └── translations/
                ├── lang.en.ts
                └── index.ts
```

## Rules per Folder

| Folder | Content and Rules |
| --- | --- |
| `kernel/` | Reusable functionalities shared by all feature-sets. Only what is genuinely generic lives here. |
| `components/<ComponentName>/` | Vue 3 SFC component with its model, translations, Storybook stories and tests. |
| `composables/<composable-name>/` | Reactive domain logic encapsulated with `ref`, `computed` and functions. |
| `logic/` | Pure domain functions without framework dependencies. |
| `model/` | Types, interfaces and enums for the feature-set. |
| `router/` | Route configuration; `index.ts` exports all feature routes as an array. |
| `stores/` | Pinia stores per feature-set; do not access other feature-set stores directly. |
| `translations/` | Localized texts shared by composables and stores of the feature-set. |

## Kernel Module

The `kernel` module centralizes functionalities genuinely shared by all feature-sets:

- **`components/`**: reusable UI components (buttons, inputs, common modals).
- **`composables/`**: cross-cutting composables (authentication, notifications, preferences).
- **`stores/`**: global stores (user session, app configuration).
- **`model/`**: shared base types (`Pagination`, `ApiError`, `DateRange`).
- **`router/`**: navigation guards and base routes.
- **`translations/`**: common texts (global error messages, generic labels).

Criterion for moving something to `kernel`: "Do three or more different feature-sets need it?"

## Communication between Feature-Sets

Feature-sets must not directly access stores or composables from other feature-sets. Valid forms of communication:

1. **Router events**: navigation between features via named routes.
2. **Props and emits**: for components that cross feature-sets (from `kernel`).
3. **Shared store in `kernel`**: for truly global state (session, notifications).
4. **URL params / query params**: to share state between routes.

## Cross Reference

- [Vue Ecosystem](./vue-ecosystem.md) — Vue 3, Pinia, composables and testing in detail.
- [Vue Conventions](../../../conventions/vue.md) — naming and Vue code patterns.
- [TypeScript Conventions](../../../conventions/typescript.md) — types and contracts.
