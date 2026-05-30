---
title: Frontend Vue Feature-Set
context_guide: frontend-vue-feature-set
description: Minimum context for agents implementing Vue 3 feature-sets.
intent:
  - create a Vue feature-set
  - modify pages, components, composables or stores
  - connect UI with API contracts
  - add frontend tests
applies_when:
  - the task modifies Vue or TypeScript frontend code
  - the task mentions feature-set, composable, Pinia, route or Storybook
  - the task creates or changes UI behavior
read_first:
  - /technologies/frontend/vue/conventions
  - /technologies/frontend/vue/conventions
  - /technologies/frontend/modular-architecture
read_if_implementing:
  - /technologies/frontend/vue/ecosystem
  - /technologies/testing/typescript-vue.md
related_guides:
  - specs-driven-development
  - project-documentation-artifact
validation:
  - npm run build or the repository equivalent
  - relevant unit, integration or end-to-end tests from the project
avoid:
  - mixing API access, routing and presentation in large components
  - adding global state when local state or a composable is enough
  - creating UI states that cannot be tested or reproduced
---

# Frontend Vue Feature-Set

Use this guide when adding or changing a Vue feature, route, component group, composable or store.

## Minimum Context

- Understand the target feature-set, route and user flow before changing UI code.
- Identify the API contracts, domain vocabulary and validation/error states involved.
- Keep pages thin; move reusable behavior to composables and shared state to stores only when it has real cross-component value.
- Use typed props, emits, route params, API DTOs and state models.
- Preserve the repository's component library, styling conventions and accessibility patterns.
- Consult [Testing TypeScript and Vue](/technologies/testing/typescript-vue.md) when the change affects behavior, routing, forms, data loading or error handling.

## Expected Structure

Prefer feature-oriented folders when the repository supports them:

```text
📁 features/
└── 📁 checkout/
    ├── 📁 components/
    ├── 📁 composables/
    ├── 📁 model/
    ├── 📁 pages/
    ├── 📁 stores/
    ├── 📁 tests/
    └── 📁 translations/
```

Use the local convention if the repository already has a different but consistent shape.

## Implementation Rules

- Keep UI, state and API access separated enough to test behavior without brittle rendering setup.
- Model loading, empty, error and success states explicitly.
- Keep component props and emits typed.
- Prefer composables for reusable interaction logic.
- Prefer local state for screen-only behavior. Use Pinia when state is shared, cached or reused across routes.
- Keep API DTOs separate from view models when the UI needs derived state, formatting or interaction-specific flags.
- Add Storybook stories for reusable components, complex visual states or design-system-facing UI.
- Add tests for business-relevant behavior, not only snapshots or superficial rendering.
- Cover relevant user flows with unit, integration or end-to-end tests according to risk and scope.

## References

- Architecture: [Frontend Modular Architecture](/technologies/frontend/modular-architecture).
- Vue practices: [Vue Ecosystem](/technologies/frontend/vue/ecosystem).
- Conventions: [Vue 3 and TypeScript](/technologies/frontend/vue/conventions).
- Testing: [TypeScript and Vue](/technologies/testing/typescript-vue.md), [Unit Tests](/technologies/testing/unit-tests.md), [Integration Tests](/technologies/testing/integration-tests.md) and [End-to-End Tests](/technologies/testing/end-to-end-tests.md).
