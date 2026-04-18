---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Flowsy DevGuide"
  text: "Design and Development of Software Solutions"
  tagline: Guidelines, Patterns and Best Practices
  actions:
    - theme: brand
      text: Discovery
      link: /discovery/
    - theme: alt
      text: Design
      link: /discovery/design-techniques/
    - theme: alt
      text: Documentation
      link: /discovery/documentation/
    - theme: alt
      text: Technologies
      link: /technologies/

features:
  - icon: 🔍
    title: Discovery
    details: Collaborative modeling techniques with Event Storming and Domain-Driven Design to explore the domain and design solutions aligned with the business.
    link: /discovery/
  - icon: 🍕
    title: Vertical Slice Architecture
    details: Backend code organization by vertical functionality, with complete C# examples using Minimal APIs, MediatR and the State pattern.
    link: /technologies/backend/vertical-slice-architecture/concepts
  - icon: 📨
    title: Event-Driven Architecture
    details: Principles and patterns for asynchronous systems with Kafka, Redpanda and RabbitMQ. Outbox Pattern, Saga, DLQ and observability.
    link: /technologies/backend/event-driven-architecture/concepts
  - icon: 🗄️
    title: Database Migrations
    details: PostgreSQL schema management with versioned and repeatable scripts. SQL routine conventions aligned to the domain. Evolve, Flyway and flwdb tools.
    link: /technologies/backend/database-migrations/concepts
  - icon: 🧩
    title: Frontend Modular Architecture
    details: Feature-set organization in Vue 3. Composition API, Pinia, composables, Storybook and testing strategy for scalable SPA applications.
    link: /technologies/frontend/modular-architecture/concepts
  - icon: 📐
    title: Conventions
    details: Coding guidelines for C#, TypeScript, Vue and PostgreSQL. Naming, patterns and style rules consistent across the entire ecosystem.
    link: /conventions/
---
