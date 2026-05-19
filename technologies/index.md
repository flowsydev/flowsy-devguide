---
layout: section-home

hero:
  name: "Technologies"
  text: "Reference architectures, patterns and stacks"
  tagline: Backend and frontend organized as practical guides for designing maintainable, scalable solutions aligned to the domain.
  actions:
    - theme: brand
      text: Testing
      link: /technologies/testing/
    - theme: alt
      text: Backend
      link: /technologies/backend/concepts
    - theme: alt
      text: Frontend
      link: /technologies/frontend/
    - theme: alt
      text: Conventions
      link: /conventions/

features:
  - icon: ✅
    title: Testing
    details: Automated testing strategy across unit, integration, end-to-end, database, migration and event-driven scenarios.
    link: /technologies/testing/
  - icon: 🛠️
    title: Backend Base Concepts
    details: Base principles for APIs and services, HTTP API design, contract modeling, traceability, value objects and domain-oriented design.
    link: /technologies/backend/concepts
  - icon: 🧭
    title: Backend Architectures
    details: Vertical Slice Architecture, Clean Architecture and criteria for organizing business rules, application and infrastructure.
    link: /technologies/backend/vertical-slice-architecture/concepts
  - icon: 🧩
    title: Frontend Vue
    details: Modular architecture with Vue 3, Composition API, Pinia, composables, Storybook and component testing.
    link: /technologies/frontend/
  - icon: 🗃️
    title: Data and Migrations
    details: Relational design, database-specific conventions and migration strategies with tools such as Evolve, Flyway, Liquibase, DbUp, EF Core, Sqitch and Atlas.
    link: /technologies/backend/data-and-migrations/relational-modeling
  - icon: 📨
    title: Events and Messaging
    details: Event-driven architecture, background services, outbox pattern, Kafka, Redpanda and asynchronous flows.
    link: /technologies/backend/event-driven-architecture/concepts
  - icon: 🧱
    title: C# and APIs
    details: Minimal APIs and .NET backend implementation examples aligned to the conceptual architecture guidance.
    link: /technologies/backend/vertical-slice-architecture/csharp-minimal-apis
  - icon: 📚
    title: Event Sourcing
    details: Event-based persistence for complete audit, state reconstruction and business-oriented derived models.
    link: /technologies/backend/event-sourcing/concepts
---

## Section Map

### Backend

Backend guidance is organized from technology-agnostic concepts to specific implementations. Start with the conceptual pages, then move into concrete stacks, libraries and database engines.

**General**

- [General Concepts](./backend/concepts.md) - Base guidelines for contracts, dates, value objects, traceability and API design.
- [HTTP API Design](./backend/api-design.md) - API maturity baseline, HTTP semantics and Problem Details guidance.

**Architecture**

- [Vertical Slice Architecture](./backend/vertical-slice-architecture/concepts.md) - Organization by feature and complete use cases.
- [Clean Architecture](./backend/clean-architecture/concepts.md) - Layer separation focused on protecting the domain.

**Events and Messaging**

- [Event-Driven Architecture](./backend/event-driven-architecture/concepts.md) - Asynchronous integration, domain events and reactive infrastructure.
- [Event Sourcing](./backend/event-sourcing/concepts.md) - Persisting changes as a sequence of events.
- [Kafka and Redpanda](./backend/event-sourcing/kafka-redpanda.md) - Event-store and stream-processing guidance.

**Data and Persistence**

- [Relational Modeling](./backend/data-and-migrations/relational-modeling.md) - Business-aligned relational modeling, keys and integrity.
- [Migration Concepts](./backend/data-and-migrations/migration-concepts.md) - Tool-agnostic strategy for evolving schemas and SQL artifacts.
- [PostgreSQL](./backend/data-and-migrations/database-engines/postgresql.md), [SQL Server](./backend/data-and-migrations/database-engines/sql-server.md) and [MySQL and MariaDB](./backend/data-and-migrations/database-engines/mysql-mariadb.md) - Database-engine-specific naming, temporal and change-control guidance.
- [Migration Tools and Strategies](./backend/data-and-migrations/tools-and-strategies.md) - Evolve, Flyway, Liquibase, DbUp, EF Core, Sqitch and Atlas.
- [flwdb CLI](./backend/data-and-migrations/cli.md) - Database CLI usage and script conventions.

**.NET**

- [C#](./backend/dotnet/csharp.md) - Naming, types, contracts and implementation conventions for .NET backend code.
- [C# with Minimal APIs](./backend/vertical-slice-architecture/csharp-minimal-apis.md) - Complete VSA implementation examples with Minimal APIs.
- [Background Services in C#](./backend/event-driven-architecture/csharp-background-services.md) - Worker and consumer implementation patterns.

### Frontend

- [Vue 3 and TypeScript Conventions](./frontend/vue/conventions.md) - Strict typing, contracts, naming and maintainable Vue code conventions.
- [Frontend Modular Architecture](./frontend/modular-architecture.md) - Feature-set organization for scalable frontend applications across frameworks.
- [Vue Ecosystem](./frontend/vue/ecosystem.md) - Components, composables, stores, testing and ecosystem tools.

### Testing

- [Automated Testing Strategy](./testing/automated-testing.md) - How to decide what to validate at each test level.
- [Unit Tests](./testing/unit-tests.md) - Fast isolated tests for rules, handlers, composables and stores.
- [Integration Tests](./testing/integration-tests.md) - Tests for database, HTTP, filesystem, messaging and other controlled dependencies.
- [End-to-End Tests](./testing/end-to-end-tests.md) - Representative critical flows from the user or consumer perspective.
- [Evidence and Reporting](./testing/evidence-and-reporting.md) - How to document validation results without copying full logs.

### How to Use These Guides

1. Start with the general concepts of the stack you will work with.
2. Choose the architectural pattern that best resolves the project context.
3. Dive into concrete implementation examples and complement them with the [conventions](../conventions/) in the repository.
