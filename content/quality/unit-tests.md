---
title: Unit Tests
description: Fast, isolated tests for rules, handlers, composables and stores.
type: guide
audience: Development and quality people.
canonical: true
---

# Unit Tests

Unit tests validate small pieces of behavior in isolation. They should be fast, deterministic and focused on business-relevant outcomes.

## Scope

Good unit-test candidates include:

- domain rules and value objects;
- pure functions and mapping logic;
- command/query handlers with dependencies replaced by test doubles;
- validators;
- Vue composables and stores with controlled inputs.

Do not use unit tests to verify database schema, real HTTP behavior, queue semantics or browser integration.

## Case Design

- Cover normal behavior, boundary cases and meaningful failures.
- Prefer clear arrange/act/assert structure.
- Keep test data minimal but expressive.
- Test one behavior per case.

## Naming

Use behavior-oriented names:

Treat these names as examples, not a required format. Adapt language, casing and separators to the test framework and repository convention.

```text
CalculateTotal_ShouldApplyDiscountWhenCustomerIsEligible
useOrderFilters_returnsOnlyOpenOrders
orderFilters_returnOnlyOpenOrders
```

## Test Doubles

Use fakes, stubs or mocks only where they clarify the behavior under test. If the double becomes more complex than the real collaboration, consider an integration test.

## Parallelism

Unit tests should normally run safely in parallel. Avoid shared mutable state, static clocks and uncontrolled global configuration.

## Minimum Evidence

Record the command, result and notable failures in specs or PRs when unit tests are part of acceptance evidence.

## References

- [Automated Testing Strategy](./automated-testing-strategy)
- [C#/.NET](./stacks/csharp-dotnet)
- [TypeScript and Vue](./stacks/typescript-vue)
