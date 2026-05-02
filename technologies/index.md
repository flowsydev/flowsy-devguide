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
      link: /technologies/frontend/modular-architecture/concepts
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
  - icon: 🧱
    title: C# and APIs
    details: Principles, contracts, Minimal APIs and backend service organization aligned to the domain and complete use cases.
    link: /technologies/backend/vertical-slice-architecture/csharp-minimal-apis
  - icon: 🧩
    title: Frontend Vue
    details: Modular architecture with Vue 3, Composition API, Pinia, composables, Storybook and component testing.
    link: /technologies/frontend/modular-architecture/vue-ecosystem
  - icon: 🗃️
    title: Data and Migrations
    details: Relational design, database-specific conventions and migration strategies with tools such as Evolve, Flyway, Liquibase, DbUp, EF Core, Sqitch and Atlas.
    link: /technologies/backend/database-migrations/concepts
  - icon: 📨
    title: Events and Messaging
    details: Event-driven architecture, background services, outbox pattern, Kafka, Redpanda and asynchronous flows.
    link: /technologies/backend/event-driven-architecture/concepts
  - icon: 🧭
    title: Backend Architectures
    details: Vertical Slice Architecture, Clean Architecture and criteria for organizing business rules, application and infrastructure.
    link: /technologies/backend/vertical-slice-architecture/concepts
  - icon: 📚
    title: Event Sourcing
    details: Event-based persistence for complete audit, state reconstruction and business-oriented derived models.
    link: /technologies/backend/event-sourcing/concepts
---

## Section Map

### Backend

- [General Concepts](./backend/concepts.md) - Base guidelines for contracts, dates, value objects, traceability and API design.
- [HTTP API Design](./backend/api-design.md) - API maturity baseline, HTTP semantics and Problem Details guidance.
- [Vertical Slice Architecture](./backend/vertical-slice-architecture/concepts.md) - Organization by feature and complete use cases.
- [Clean Architecture](./backend/clean-architecture/concepts.md) - Layer separation focused on protecting the domain.
- [Event-Driven Architecture](./backend/event-driven-architecture/concepts.md) - Asynchronous integration, domain events and reactive infrastructure.
- [Event Sourcing](./backend/event-sourcing/concepts.md) - Persisting changes as a sequence of events.
- [Relational Databases](./backend/relational-databases/concepts.md) - Fundamentals for business-aligned relational modeling.
- [Database Migrations](./backend/database-migrations/concepts.md) - Tool-agnostic strategy for evolving schemas and SQL artifacts.
- [Migration Tools and Strategies](./backend/database-migrations/tools-and-strategies.md) - Evolve, Flyway, Liquibase, DbUp, EF Core, Sqitch and Atlas.

### Frontend

- [Modular Architecture](./frontend/modular-architecture/concepts.md) - Feature-set organization for scalable Vue 3 applications.
- [Vue Ecosystem](./frontend/modular-architecture/vue-ecosystem.md) - Components, composables, stores, testing and ecosystem tools.

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
