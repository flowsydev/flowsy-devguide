# Evidence and Reporting

Evidence should make validation reviewable without turning specs or PRs into raw log archives.

## Evidence by Test Type

| Type | Useful Evidence |
| --- | --- |
| Unit | command, result, failing test names |
| Integration | command, infrastructure, database/broker version when relevant |
| End-to-End | command, environment, trace/screenshot/video link when relevant |
| Migration | clean run, upgrade run, rollback or compatibility notes |

## In Specs

Use concise entries:

```md
## Evidence and Validation

- `dotnet test`: passed.
- `npm run test:unit`: passed.
- `npm run docs:build`: failed initially because of a broken link; fixed and reran successfully.
```

## Console Output

Include only the lines needed to understand the result. Full logs belong in CI artifacts or attached files, not copied into durable docs by default.

## Reports

When the tooling generates reports, prefer linking to the artifact or naming its path:

```text
Test report: artifacts/test-results/index.html
Coverage report: artifacts/coverage/lcov-report/index.html
```

## Writing Rules

- State command and outcome.
- Mention unresolved failures clearly.
- Do not hide skipped tests.
- Do not claim coverage that was not executed.

## References

- [Specs-Driven Development](/ai-assisted-development/specs-driven-development)
- [Automated Testing Strategy](./automated-testing.md)
