---
layout: section-home

hero:
  name: "Technologies"
  text: "Reference architectures, patterns and stacks"
  tagline: Backend and frontend organized as practical guides for designing maintainable, scalable solutions aligned to the domain.
  actions:
    - theme: brand
      text: Explore Backend
      link: /technologies/backend/concepts
    - theme: alt
      text: Explore Frontend
      link: /technologies/frontend/modular-architecture/concepts
    - theme: alt
      text: View Conventions
      link: /conventions/

features:
  - icon: 🧱
    title: Backend
    details: Base principles for APIs and services, contract modeling, traceability, value objects and domain-oriented design.
    link: /technologies/backend/concepts
  - icon: 🍕
    title: Vertical Slice Architecture
    details: Organization by end-to-end complete functionalities, ideal for reducing team friction and maintaining high cohesion.
    link: /technologies/backend/vertical-slice-architecture/concepts
  - icon: 🧭
    title: Clean Architecture
    details: Clear separation between domain, application and infrastructure to protect business rules and control dependencies.
    link: /technologies/backend/clean-architecture/concepts
  - icon: 📨
    title: Event-Driven Architecture
    details: Asynchronous integration with events, workers, outbox pattern and decoupled processing for distributed ecosystems.
    link: /technologies/backend/event-driven-architecture/concepts
  - icon: 📚
    title: Event Sourcing
    details: Event-based persistence for complete audit, state reconstruction and business-oriented derived models.
    link: /technologies/backend/event-sourcing/concepts
  - icon: 🗃️
    title: Databases and Migrations
    details: Relational design, controlled schema evolution and tools like Evolve and Flyway for versioned changes.
    link: /technologies/backend/database-migrations/concepts
  - icon: 🧩
    title: Frontend Modular
    details: Feature-set architecture in Vue 3 for building maintainable SPAs, with clear boundaries between domain, UI and state.
    link: /technologies/frontend/modular-architecture/concepts
  - icon: 🛠️
    title: Guided Implementation
    details: Applied examples in C#, Minimal APIs, background services, Vue, Pinia and composables to ground each pattern.
    link: /technologies/backend/vertical-slice-architecture/csharp-minimal-apis
---

## Section Map

### Backend

- [General Concepts](./backend/concepts.md) - Base guidelines for contracts, dates, value objects, traceability and API design.
- [Vertical Slice Architecture](./backend/vertical-slice-architecture/concepts.md) - Organization by feature and complete use cases.
- [Clean Architecture](./backend/clean-architecture/concepts.md) - Layer separation focused on protecting the domain.
- [Event-Driven Architecture](./backend/event-driven-architecture/concepts.md) - Asynchronous integration, domain events and reactive infrastructure.
- [Event Sourcing](./backend/event-sourcing/concepts.md) - Persisting changes as a sequence of events.
- [Relational Databases](./backend/relational-databases/concepts.md) - Fundamentals for business-aligned relational modeling.
- [Database Migrations](./backend/database-migrations/concepts.md) - Strategy for evolving schemas and SQL artifacts.

### Frontend

- [Modular Architecture](./frontend/modular-architecture/concepts.md) - Feature-set organization for scalable Vue 3 applications.
- [Vue Ecosystem](./frontend/modular-architecture/vue-ecosystem.md) - Components, composables, stores, testing and ecosystem tools.

### How to Use These Guides

1. Start with the general concepts of the stack you will work with.
2. Choose the architectural pattern that best resolves the project context.
3. Dive into concrete implementation examples and complement them with the [conventions](../conventions/) in the repository.
