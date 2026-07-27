---
title: Frontend Modular Architecture
description: Feature-set organization for scalable frontend applications across frameworks.
type: guide
audience: Frontend architecture and development people.
canonical: true
---

# Frontend Modular Architecture

Principles and organizational structure for frontend applications in the Flowsy ecosystem. The goal is to maintain domain cohesion, enable feature evolution and avoid technical coupling that makes team scaling harder.

This guide is framework-agnostic. Apply the same architectural intent in Vue, React, Angular, Svelte or another frontend stack, adapting artifact names to the conventions of each project and ecosystem.

## Principles

- **Domain cohesion**: group by business feature (feature-set), not by technical type.
- **Feature-set autonomy**: each feature-set can evolve without affecting the rest of the application.
- **Kernel module**: genuinely shared capabilities live in one common place.
- **Avoid global folders by type**: do not organize the whole application under a single root of `components/`, `services/`, `stores/`, `hooks/` or equivalents.
- **Separation of concerns**: visual layer, interaction logic, shared state and data access remain clearly separated inside each feature-set.
- **Framework resilience**: the organization should survive changes in libraries, state tools, routing tools or rendering framework.

## Why Feature-Sets and not Technical Types?

Organizing by technical type (`components/`, `stores/`, `services/`, `hooks/`) causes:

- Related files scattered across distant folders.
- High friction to understand or modify a complete feature.
- Frequent Git conflicts when multiple developers work on different features.
- Difficulty measuring the impact of a change.

Organizing by feature-set results in:

- Everything related to `shopping-cart` lives in `features/shopping-cart/`.
- A developer can understand and modify a complete feature without jumping between unrelated folders.
- Changes are localized; the impact on other features is explicit.
- The structure remains stable even if frontend libraries or tools change.

## Common Language Across Frameworks

Concrete names vary by technology, but the architectural intent is the same:

| Concept | Vue | React | Angular | Intent |
| --- | --- | --- | --- | --- |
| Reusable visual unit | `components/` | `components/` | `components/` | Render UI and handle local interaction. |
| Framework-bound reusable logic | `composables/` | `hooks/` | `services/` or presentation utilities | Encapsulate reusable behavior. |
| Shared state | `stores/` | `state/` or context | Services or state libraries | Share state between screens or sections. |
| Pure logic | `logic/` | `logic/` | `logic/` | Rules without framework dependencies. |
| Types and contracts | `model/` | `model/` | `model/` | Define structures and contracts. |
| Navigation | `routing/` | `routing/` | `routing/` | Wire feature routes into the application. |
| Localization | `translation/` | `translation/` | `translation/` | Keep feature-owned labels and messages near the feature. |

In this guide, `components`, `state`, `logic`, `routing` and `translation` describe responsibilities. The framework-specific sections show the equivalent terms for each stack.

## Folder Structure

This tree is a reference implementation, not a mandatory physical layout. Adapt folder names, casing, file extensions and package/module boundaries to the project's language, framework and repository conventions.

```text
📁 src/
├── 📁 app/                                  ← Application bootstrap (see section below)
│   ├── 📁 providers/
│   ├── 📁 routing/                          ← or routing.ts for small apps
│   └── 📁 styles/
└── 📁 features/
    ├── 📁 kernel/                           ← Shared by all feature-sets
    │   ├── 📁 components/
    │   ├── 📁 framework-logic/              ← composables, hooks or equivalent
    │   ├── 📁 logic/
    │   ├── 📁 model/
    │   ├── 📁 routing/
    │   ├── 📁 state/
    │   └── 📁 translation/
    ├── 📁 shopping-cart/
    │   ├── 📁 components/
    │   ├── 📁 framework-logic/
    │   ├── 📁 logic/
    │   ├── 📁 model/
    │   ├── 📁 routing/
    │   ├── 📁 state/
    │   └── 📁 translation/
    └── 📁 user-profile/
        ├── 📁 components/
        ├── 📁 framework-logic/
        ├── 📁 logic/
        ├── 📁 model/
        ├── 📁 routing/
        ├── 📁 state/
        └── 📁 translation/
```

## Application Bootstrap (`app/`)

The `app/` folder holds everything needed to start the application: the entry point, application-wide routing assembly, library providers and global styles. Its contents are infrastructure, not domain logic — they wire up the application without knowing about feature-specific business rules.

### Small Application

For a small application, a single routing file is enough:

```text
📁 src/
└── 📁 app/
    ├── 📁 providers/
    │   ├── 📄 charts.ts
    │   ├── 📄 state.ts
    │   └── 📄 ui.ts
    ├── 📁 styles/
    │   ├── 🎨 base.css
    │   └── 🎨 main.css
    ├── 📄 main.ts
    └── 📄 routing.ts
```

### Medium and Large Application

When routing grows, split it into route groups per feature-set or domain area:

```text
📁 src/
└── 📁 app/
    ├── 📁 providers/
    │   ├── 📄 charts.ts
    │   ├── 📄 state.ts
    │   └── 📄 ui.ts
    ├── 📁 routing/
    │   ├── 📄 index.ts
    │   ├── 📄 route-group-1.ts
    │   ├── 📄 route-group-2.ts
    │   └── 📄 route-group-n.ts
    ├── 📁 styles/
    │   ├── 🎨 base.css
    │   └── 🎨 main.css
    └── 📄 main.ts
```

The root component (e.g. `App.vue` in Vue, `App.tsx` in React) lives alongside `main.ts` following the framework's entry convention. Provider files (`state.ts`, `ui.ts`, `charts.ts`) initialize libraries — adapt names to the project's actual dependencies.

## Folder Rules

| Folder | Content and Rules |
| --- | --- |
| `app/` | Application bootstrap: entry point, routing assembly, library providers and global styles. No domain logic. |
| `kernel/` | Reusable capabilities shared by all feature-sets. Only what is genuinely generic lives here. |
| `components/` | Visual components or UI units owned by the feature-set. |
| `framework-logic/` | Framework-bound presentation or interaction logic. In Vue this may be `composables/`; in React, `hooks/`; in Angular, presentation services or equivalent utilities. |
| `logic/` | Pure domain or UI-independent functions without framework dependencies. |
| `model/` | Types, interfaces, enums and frontend contracts owned by the feature-set. |
| `routing/` | Routes, navigation entries or feature wiring into the application. |
| `state/` | Feature-set shared state. Implement it with the project state tool, such as Pinia, Redux, Zustand, signals, services or context. |
| `translation/` | Localized texts, labels and messages owned by the feature-set. |

These folders are conceptual references, not a rigid taxonomy. A project can keep these names or adapt them to stack equivalents, as long as the architectural responsibility remains clear.

## Kernel Module

The `kernel` module centralizes capabilities genuinely shared by all feature-sets:

- **`components/`**: reusable UI units such as buttons, inputs, tables or common modals.
- **`framework-logic/`**: cross-cutting logic for authentication, notifications, preferences or common frontend capabilities.
- **`state/`**: global state such as user session, app configuration or organization context.
- **`model/`**: shared base types such as `Pagination`, `ApiError` and `DateRange`.
- **`routing/`**: guards, base routes or shared integration with the navigation mechanism.
- **`translation/`**: common texts such as global error messages and generic labels.

Criterion for moving something to `kernel`: "Do three or more different feature-sets need it?"

## Communication Between Feature-Sets

Feature-sets should not couple directly to internal details of other feature-sets. Valid forms of communication include:

1. **Navigation**: routes, URLs or navigation events between features.
2. **Explicit contracts**: props, callbacks, events or inputs/outputs for shared visual units.
3. **Shared state in `kernel`**: only for genuinely global information, such as session or notifications.
4. **URL parameters**: when state should be visible, navigable or shareable.
5. **Data contracts**: types and models shared when two features need to speak the same frontend language.

## What Should Not Change When the Technology Changes

- The main unit of organization remains the business feature.
- Pure logic stays separated from the visual layer.
- Global state remains exceptional and explicit.
- Shared behavior lives in a common module instead of being duplicated across features.
- A functional change should usually be localized in one or a few feature-sets.

## Cross Reference

- [Vue Ecosystem](/engineering/frontend/vue/vue-ecosystem-reference) — Vue 3, Pinia, composables and testing in detail.
- [Vue 3 and TypeScript Conventions](./vue/conventions.md) — Vue-specific naming, types and contracts.
