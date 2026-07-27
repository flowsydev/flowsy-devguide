---
title: Components with Vue 3
description: Composition API, component contracts and separation of responsibilities.
type: profile
audience: Vue 3 developers.
canonical: true
canonicalSource: /engineering/frontend/modular-architecture
---

# Components with Vue 3

Use Vue 3, TypeScript, Composition API and `<script setup>` for new code. Design each component's contract first: `props`, `emits` and slots.

## Rules

- Keep one primary intention per component.
- Use `props` for input and `emits` to communicate actions upward.
- Derive values with `computed`; reserve `watch` for effects.
- Extract reusable or effectful logic into composables.
- Keep pages and routes as composition, not as rule concentration.
- Use `PascalCase` for primary files and `kebab-case` for grouping folders.

Conceptual organization belongs to [Modular Architecture](../modular-architecture) and evidence to [TypeScript and Vue Quality](/quality/stacks/typescript-vue). Detailed examples remain in the [Vue ecosystem reference](./vue-ecosystem-reference#vue-3-composition-api).
