# C#/.NET

Guidelines for automated testing in C# and .NET projects.

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

## Integration Tests

- Use real ASP.NET Core routing and dependency injection when validating HTTP behavior.
- Use real PostgreSQL when testing queries, migrations or transaction behavior.
- Keep database setup deterministic.

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
- [PostgreSQL](./postgresql.md)
