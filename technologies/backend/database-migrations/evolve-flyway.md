# Evolve and Flyway: Migration Tools

Guide for running database migrations in .NET projects in the Flowsy ecosystem, using Evolve or Flyway as the execution engine.

## Supported Tools

| Tool | Description |
| --- | --- |
| **Evolve** | Embedded .NET library; ideal for execution at application startup. Supports versioned and repeatable scripts. |
| **Flyway** | Standalone cross-platform tool; popular in CI/CD pipelines. |
| **flwdb** | CLI from Flowsy that encapsulates Evolve to run migrations from the command line. |

## Configuration with Flowsy.Db.Unity

In .NET projects using `Flowsy.Db.Unity`, migration configuration is done in `Program.cs` or in an initialization `IHostedService`:

```csharp
// Program.cs
builder.Services.AddFlowsyDb(options =>
{
    options.AddDatabase("Ecommerce", connectionString =>
    {
        connectionString.Host = builder.Configuration["Database:Host"];
        connectionString.Database = builder.Configuration["Database:Name"];
        connectionString.Username = builder.Configuration["Database:Username"];
        connectionString.Password = builder.Configuration["Database:Password"];
    });
});

// Migrations run automatically at startup
// via the Flowsy.Db.Unity middleware
```

The library automatically detects scripts in `Resources/Databases/Migrations/` and `Resources/Databases/Operations/` following the `V*` and `R*` file convention.

## CLI flwdb

The `flwdb` CLI tool enables running migrations from the command line, useful in CI/CD pipelines or manual environment initialization.

Documentation: [https://github.com/flowsydev/flowsy-net-cli-db](https://github.com/flowsydev/flowsy-net-cli-db)

### Usage examples

```bash
# Run all pending migrations
flwdb migrate --connection "Host=localhost;Database=ecommerce;Username=app;Password=secret"

# Run migrations from a specific folder
flwdb migrate \
  --connection "Host=localhost;Database=ecommerce;Username=app;Password=secret" \
  --location "./Resources/Databases"

# View the status of applied migrations
flwdb info --connection "Host=localhost;Database=ecommerce;Username=app;Password=secret"
```

### Environment Variables

For CI/CD environments, use environment variables instead of passing the connection string as an argument:

```bash
export FLWDB_CONNECTION="Host=postgres;Database=ecommerce;Username=app;Password=secret"
flwdb migrate
```

## Script Convention

The CLI and Evolve follow the same naming convention:

```
Migrations/   → V[YYYY]_[MM]_[NNN]__description.sql   (versioned, run once)
Operations/   → R__description.sql                     (repeatable by content)
Reports/      → R__description.sql                     (repeatable by content)
```

See [Migrations: Concepts](./concepts.md) for the complete folder structure.

## Evolve — Standalone Configuration

If `Flowsy.Db.Unity` is not used, Evolve can be configured directly:

```csharp
// NuGet: Evolve
var connection = new NpgsqlConnection(connectionString);
var evolve = new Evolve.Evolve(connection, msg => Console.WriteLine(msg))
{
    Locations = ["Resources/Databases/Migrations", "Resources/Databases/Operations", "Resources/Databases/Reports"],
    IsEraseDisabled = true,
    Schemas = ["public", "sales", "inventory"]
};

evolve.Migrate();
```

Official Evolve documentation: [https://evolve-db.netlify.app/](https://evolve-db.netlify.app/)

## Flyway — Configuration

If Flyway is preferred (e.g. in teams with mixed stack or existing pipelines):

```bash
flyway -url=jdbc:postgresql://localhost:5432/ecommerce \
       -user=app \
       -password=secret \
       -locations=filesystem:./Resources/Databases \
       migrate
```

Official Flyway documentation: [https://documentation.red-gate.com/flyway/reference/usage/flyway-open-source](https://documentation.red-gate.com/flyway/reference/usage/flyway-open-source)

## Operation Rules

- `V*` scripts are **immutable** once applied. If an already-applied versioned script is modified, Evolve/Flyway will fail the checksum.
- `R*` scripts are re-executed automatically when their content changes (different hash).
- Never edit applied versioned scripts; create a new script with the fix.
- Keep scripts in source control (Git); PRs must include the corresponding migration scripts.

## Cross Reference

- [Migrations: Concepts](./concepts.md) — script structure and naming.
- [PostgreSQL Conventions](../../../conventions/postgresql.md) — naming of tables, columns and routines.
