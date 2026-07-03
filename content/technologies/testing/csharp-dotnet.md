# C#/.NET

Guidelines for automated testing in C# and .NET projects.

Real tooling names in this page include xUnit, NUnit, MSTest, FluentAssertions, Testcontainers, WebApplicationFactory, ASP.NET Core and `dotnet test`. Project names, test class names and method names such as `Flowsy.Sample.Api.UnitTests`, `CreateOrderHandlerTests` and `Handle_ShouldRejectExpiredQuote` are illustrative.

## Base Tools

Common choices include:

- xUnit, NUnit or MSTest for test execution;
- FluentAssertions or framework-native assertions;
- Testcontainers for disposable infrastructure;
- WebApplicationFactory for ASP.NET Core integration tests;
- coverage tools configured by the repository.

## Organization

Keep tests close enough to the code structure that ownership is obvious:

```text
📁 src/
└── 📁 Flowsy.Sample.Api/
📁 tests/
├── 📁 Flowsy.Sample.Api.UnitTests/
└── 📁 Flowsy.Sample.Api.IntegrationTests/
```

## Naming

Use clear names that express behavior:

```csharp
public sealed class CreateOrderHandlerTests
{
    [Fact]
    public async Task Handle_ShouldRejectExpiredQuote()
    {
    }
}
```

## Unit Tests

- Test domain rules, value objects, validators and handlers.
- Replace external dependencies with simple fakes or mocks.
- Control time, IDs and external inputs explicitly.
- Inject `TimeProvider` or the project's clock abstraction instead of depending on the real system clock.
- Test parsing and validation for timestamps with offsets, UTC timestamps and intentionally rejected offset-less instant values.

## Integration Tests

- Use real ASP.NET Core routing and dependency injection when validating HTTP behavior.
- Use the real target database engine when testing queries, migrations or transaction behavior.
- Keep database setup deterministic.
- Verify the selected temporal persistence strategy: UTC instants, canonical system time zone or per-entity time zone.
- When the project uses canonical system time, seed the default time-zone configuration and verify conversion to UTC or explicit offset at API boundaries.
- When the project uses UTC instants, verify that technical timestamps are persisted as UTC instants.
- Verify that local business events preserve local date/time values and `time_zone_id` or the project's equivalent column.
- Include representative time zones such as `UTC`, `America/Mexico_City` and a daylight-saving-sensitive zone such as `America/New_York` when the domain depends on time-zone rules.

## End-to-End Tests

Use E2E tests sparingly for representative API or UI flows. Prefer integration tests for most service-level behavior.

## Parallelism

Unit tests should be parallel-friendly. Integration tests may need collection-level isolation when sharing containers or databases.

## Execution and Filters

```sh
dotnet test
dotnet test --filter FullyQualifiedName~CreateOrder
dotnet test --collect:"XPlat Code Coverage"
```

## References

- [Unit Tests](./unit-tests.md)
- [Integration Tests](./integration-tests.md)
- [Relational Databases](./database/relational-databases.md)
