---
title: Migration Tools and Strategies
description: Decision path among migration tools without mixing general policy with long recipes.
type: guide
audience: People selecting database tooling.
canonical: true
---

# Migration Tools and Strategies

Select by engine, deployment model, need for explicit SQL, rollback, desired-state workflows, stack integration and operational experience.

| Family | Suitable When |
| --- | --- |
| Evolve / Flyway | Ordered SQL scripts and a linear history are preferred. |
| Liquibase | Declarative changelogs and multi-engine support are required. |
| DbUp | .NET deployment controls embedded scripts. |
| EF Core Migrations | The EF model is the primary source and the team reviews generated SQL. |
| Sqitch | Explicit dependencies and verification are required. |
| Atlas | Desired-schema workflows and diff analysis are used. |

When convenient for the team and project, use the [flwdb CLI](./flwdb-cli) (`Flowsy.Cli.Db`) to run Evolve-style `V*` and `R__*` migrations.

See the [full comparative reference](./tools-and-strategies-reference) for recipes and naming. General concepts belong to [Migration Concepts](./concepts).
