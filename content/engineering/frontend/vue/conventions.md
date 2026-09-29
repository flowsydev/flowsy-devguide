---
title: Vue 3 Conventions
description: Vue 3 conventions for components, reactivity, names and state ownership.
type: profile
audience: Contributors and agents implementing Vue 3 applications.
canonical: true
canonicalSource: /engineering/frontend/vue/
---

# Vue 3 Conventions

Use Vue 3 with Composition API, `<script setup>` and TypeScript for new code. Apply [TypeScript for Frontend](../typescript) and [Modular Architecture](../modular-architecture) first. This page covers decisions specific to Vue.

## Naming

Use the context's ubiquitous language for business concepts and keep Vue technical terms unchanged. These project names are examples, not framework APIs.

| Element | Convention | Example |
| --- | --- | --- |
| Single-File Components | `PascalCase` | `ShoppingCartSummary.vue` |
| Grouping folders | `kebab-case` | `shopping-cart-summary/` |
| Composables | `camelCase` with `use` prefix | `useShoppingCart` |
| Pinia stores | `camelCase` with `use` prefix and `Store` suffix | `useShoppingCartStore` |
| Store and route files | `kebab-case` | `shopping-cart.ts` |
| Props and events | `camelCase` | `cartId`, `cartUpdated` |

## Components and Reactivity

- Design the component contract through `props`, `emits` and slots before implementation.
- Give each component one primary purpose and use pages to compose components.
- Derive values with `computed`; reserve `watch` and `watchEffect` for side effects.
- Extract reusable or lifecycle-aware behavior into a composable.
- Keep deterministic transformations and rules without Vue dependencies in `logic/`.
- Keep direct HTTP access out of presentation components.

## State

Keep state as local as practical. Use `ref` or `reactive` for local interaction, a composable for reusable behavior and Pinia when multiple views or components must share state. Expose `readonly()` state when consumers should not mutate it directly.

A store should coordinate shared state without becoming a universal container for HTTP calls, transformations and rules. See [State and Composables](./state-and-composables) for the full criteria.

## Validation and Accessibility

- Validate on the client to guide interaction; keep rules that protect the system on the server.
- Show loading, empty, error, success and disabled states when relevant.
- Prefer semantic HTML and support keyboard navigation.
- Associate labels with controls; use `aria-*` attributes when native semantics are insufficient.
- Check contrast and visible focus against the project's accessibility requirements.

## Agent Application

Before implementation, identify the owning feature-set, inspect nearby components and conventions, and check the installed versions of Vue, TypeScript, Pinia and test tools. Decide whether each behavior belongs in a component, composable, store or `logic/`, then run the repository's lint, typecheck and test commands.

Introduce Pinia, Storybook, a component library or a new abstraction when the repository already uses it or a documented need supports it.

## References

- [TypeScript for Frontend](../typescript) — typing, contracts, naming and date/time handling.
- [Modular Frontend Architecture](../modular-architecture) — boundaries and feature-set organization.
- [UI/API Contracts](../ui-api-contracts) — direct contracts, ViewModels and adapters.
- [Components with Vue 3](./components) — component design.
- [Vue Structure](./structure) — folder mapping.
- [TypeScript and Vue Quality](/quality/stacks/typescript-vue) — testing strategy and evidence.
