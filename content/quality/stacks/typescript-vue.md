---
title: TypeScript and Vue
description: Testing tools and conventions for Vue 3 and TypeScript projects.
type: profile
audience: Development and quality people working in Vue.
canonical: true
canonicalSource: /quality/automated-testing-strategy
---

# TypeScript and Vue

Guide for unit, integration and end-to-end tests in Vue 3 projects with Composition API, TypeScript, Pinia, composables and Storybook.

## Base Tools

- `Vitest` for unit tests and component tests in Vite/Vue projects.
- `Vue Test Utils` for mounting and interacting with Vue components.
- Testing Library when the test should prioritize user-like interaction.
- Storybook for visual states, variant documentation and interaction tests.
- Playwright for end-to-end user flows.
- MSW or local API fakes for controlled HTTP boundaries when the project uses them.

## Organization

Keep tests close to the artifact when that helps explain the feature-set:

```text
📁 features/shopping-cart/
├── 📁 components/
│   └── 📁 shopping-cart-summary/
│       ├── 📄 ShoppingCartSummary.vue
│       ├── 📄 ShoppingCartSummary.stories.ts
│       └── 📄 ShoppingCartSummary.specs.ts
├── 📁 composables/
│   └── 📁 use-cart-operations/
│       ├── 📄 useCartOperations.ts
│       └── 📄 useCartOperations.specs.ts
└── 📁 logic/
    ├── 📄 calculateCartTotal.ts
    └── 📄 calculateCartTotal.specs.ts
```

For E2E tests, use a dedicated folder such as `e2e/`, `tests/e2e/` or the project's established convention.

## Naming

- Test files: `*.specs.ts`, aligned with current DevGuide conventions.
- Suites: component, composable, store or function name.
- Cases: behavior-oriented phrases in the repository's language.
- Stories: visible variants such as `Empty`, `Loading`, `WithItems`, `Readonly` or `Error`.

## Unit Tests

Apply to:

- pure functions in `logic/`;
- composables without a real network dependency;
- Pinia stores with controlled state;
- UI/API contract transformers;
- validation and formatting helpers.

Use `vi` test doubles when you need to control time, network or dependencies. Avoid snapshots as the only assertion of behavior.

## Integration Tests

Apply to:

- component + composable;
- component + store;
- store + mocked API client;
- Storybook story with representative interaction;
- form behavior involving validation, disabled states and visible errors.

Validate observable DOM before internal component instance details. Use `mount` when you need real child integration and `shallowMount` only when isolating visual dependencies that are not relevant to the risk.

## End-to-End Tests

Apply to:

- critical navigation;
- forms with visible validations;
- authentication, authorization, search, upload or confirmation flows;
- integration with backend in a controlled environment;
- flows where browser behavior, routing, storage or accessibility matters.

Use Playwright with user-oriented locators. Avoid selecting by internal CSS classes unless there is an agreed `data-testid`.

## Parallelism and Reports

Vitest runs files in parallel by default and tests inside a file sequentially. Playwright also runs files in parallel by default. Isolate data, global stores, local storage and test users before increasing concurrency.

Configure reports only when they provide pipeline value or evidence: console summary, JUnit XML, HTML report, trace or Storybook interactions.

## References

- [Vitest: Parallelism](https://vitest.dev/guide/parallelism)
- [Vitest: Reporters](https://vitest.dev/guide/reporters)
- [Vue Test Utils: Getting Started](https://test-utils.vuejs.org/guide/)
- [Testing Library: Guiding Principles](https://testing-library.com/docs/guiding-principles)
- [Storybook: Interaction Tests](https://storybook.js.org/docs/writing-tests/component-testing)
- [Playwright: Best Practices](https://playwright.dev/docs/best-practices)
- [Vue 3 and TypeScript Conventions](/engineering/frontend/vue/conventions)
- [Frontend Modular Architecture](/engineering/frontend/modular-architecture)
- [End-to-End Tests](../end-to-end-tests)
