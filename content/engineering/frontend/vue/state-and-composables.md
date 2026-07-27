---
title: State and Composables in Vue
description: Criteria for local state, Pinia, composables and pure logic.
type: profile
audience: Vue 3 developers.
canonical: true
canonicalSource: /engineering/frontend/modular-architecture
---

# State and Composables in Vue

Keep state at the most local level possible.

| Need | Prefer |
| --- | --- |
| Local interaction value | Component `ref` or `reactive`. |
| Derived value | `computed`. |
| Reusable or lifecycle logic | Composable. |
| State shared across screens | Pinia store under `stores/`. |
| Deterministic transformation | Pure function under `logic/`. |

A store coordinates shared state; it should not become a universal container for HTTP calls and rules. Composables encapsulate effects and return a small interface. Test pure logic unitarily and reactive adapters with the [Quality profile](/quality/stacks/typescript-vue) tools.

Detailed examples remain in the [Vue ecosystem reference](./vue-ecosystem-reference#pinia-reactive-state).
