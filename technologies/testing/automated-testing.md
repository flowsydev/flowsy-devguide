# Automated Testing Strategy

Automated tests should make change safer by catching the right failure at the cheapest useful level.

## Test Levels

| Level | Purpose | Typical Scope |
| --- | --- | --- |
| Unit | Validate isolated behavior quickly | Rules, value objects, handlers, composables, stores |
| Integration | Validate collaboration across real boundaries | Database, HTTP, filesystem, queues, dependency adapters |
| End-to-End | Validate complete user or consumer journeys | Browser flows, API workflows, external contract scenarios |

## Selection Criteria

- Use unit tests when the behavior can be expressed without infrastructure.
- Use integration tests when correctness depends on real persistence, serialization, messaging or framework behavior.
- Use end-to-end tests when the value comes from confirming a complete critical path.
- Avoid moving a test upward in the pyramid only because lower-level setup is inconvenient.

## Cross-Cutting Rules

- Tests must be deterministic and safe to run repeatedly.
- Test data should be explicit and isolated.
- Assertions should explain the business outcome, not only implementation details.
- Keep slow, flaky or environment-dependent tests visible and intentionally scoped.
- Prefer a few meaningful cases over broad coverage that does not detect real risk.

## Naming

Use names that state the expected behavior:

These examples illustrate intent and readability. Adapt casing, separators, test-runner constraints and language to the repository convention.

```text
CreateOrder_ShouldRejectExpiredQuote
orderStore_loadsEmptyStateWhenApiReturnsNoItems
checkoutStore_rejectsExpiredQuote
```

Prefer the repository's established naming convention when one already exists.

## Relationship With Specs

Specs should record which validations were run and the result. Do not paste full logs unless the log itself is the artifact under review. Include the command, outcome and relevant failure details.

## Anti-Patterns

- Testing private implementation instead of externally visible behavior.
- Replacing integration tests with mocks where the risk is the integration itself.
- Keeping flaky tests without documented ownership.
- Treating coverage percentage as a substitute for meaningful assertions.

## References

- [Unit Tests](./unit-tests.md)
- [Integration Tests](./integration-tests.md)
- [End-to-End Tests](./end-to-end-tests.md)
