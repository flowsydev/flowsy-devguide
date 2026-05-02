# End-to-End Tests

End-to-end tests validate complete flows from the perspective of a user, operator, consuming system or external process. Reserve them for critical journeys where confidence depends on the real integration of several layers.

## Scope

Include:

- login, permissions and critical navigation;
- complete business flows;
- forms, visible validation and persisted results;
- frontend + backend + database integration in a controlled environment;
- asynchronous flows where the user expects an observable result;
- high-value API workflows and smoke checks for deployed environments.

Avoid:

- validating every combination of business rules;
- testing third parties the project does not control;
- using E2E as a substitute for unit or integration tests;
- depending on manual data that cannot be reset.

## Flow Design

- Name each test after visible behavior.
- Use user-oriented locators: roles, labels, visible text or agreed test ids.
- Isolate session, cookies, local storage and data by test.
- Control accounts, permissions and initial state.
- Prefer framework auto-waiting over fixed sleeps.
- Keep flows short; if a journey becomes too large, split it by intent.
- Separate setup from the action being validated.

## Environments and Data

- Use dedicated, ephemeral or clearly identified test environments.
- Do not run E2E tests against production.
- Create data through APIs, fixtures or reproducible setup tasks.
- Clean data at the end or use unique identifiers with expiration.
- Document environment assumptions when evidence is relevant.

## Parallelism and Stability

Parallelism requires isolated users, data and resources. If two tests can touch the same account, cart, order or shared object, they should use different data or run sequentially.

Retries are acceptable only as resilience against variable infrastructure. They should not hide application flakiness.

## Diagnostics

For failures or critical flows, preserve:

- runner summary;
- trace or HTML report when available;
- screenshot or video only when it helps diagnosis;
- error message and failed step;
- request logs or correlation IDs when the tool or platform supports them.

## References

- [Playwright: Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright: Parallelism](https://playwright.dev/docs/test-parallel)
- [Storybook: Interaction Tests](https://storybook.js.org/docs/writing-tests/component-testing)
- [Evidence and Reporting](./evidence-and-reporting.md)
- [TypeScript and Vue](./typescript-vue.md)
