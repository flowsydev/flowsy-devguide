---
layout: section-home

hero:
  name: "Architecture"
  text: "Technical decisions and lasting contracts"
  tagline: Documents how the solution is structured, what decisions govern its evolution and what interfaces must be respected.
  actions:
    - theme: brand
      text: View ADR
      link: /discovery/documentation/architecture/templates/adr
    - theme: alt
      text: View Contract
      link: /discovery/documentation/architecture/templates/contract
    - theme: alt
      text: View Technologies
      link: /technologies/

features:
  - icon: 🧾
    title: ADR
    details: Architectural decision record with context, alternatives and consequences.
    link: /discovery/documentation/architecture/templates/adr
  - icon: 🔌
    title: Contract
    details: Specification of APIs, events or exchange formats between components or systems.
    link: /discovery/documentation/architecture/templates/contract
---

# Architecture / Design

Artifacts for documenting lasting technical decisions, models, contracts and architectural implications.

## Purpose

Answer the questions:

- How will the solution be structured?
- What technical decision was made and why?
- What contract or model must be respected?

## Artifacts

| Artifact | Description | Value | When to use | When to omit |
| --- | --- | --- | --- | --- |
| **ADR** | Architectural decision record | Documents the context, decision, alternatives and consequences | The decision affects multiple items, teams or integrations | The decision is ephemeral and local |
| **Contract** | Technical interface specification: API, event, schema, exchange format | Defines the interface that producers and consumers must respect | There is integration between services, teams or external systems | The interface is internal to a single component with no consumers |

::: tip Other architecture artifacts
Context diagrams, sequence diagrams, component diagrams, domain models, data models and technical constraints also belong to this layer. Use the format and level of detail that provides clarity to the team.
:::

## Templates

- [ADR](./templates/adr) — Template for documenting an architectural decision.
- [Contract](./templates/contract) — Template for documenting an API or event contract.

## Collaboration Tools

- **Git Repository**: ADRs versioned alongside source code.
- **Swagger / OpenAPI**: REST API contracts.
- **AsyncAPI**: Event and async messaging contracts.

## References

- [AWS Prescriptive Guidance — Transactional Outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html) — Architectural patterns for reliability and interoperability.
- [Azure Architecture Center — Transactional Outbox](https://learn.microsoft.com/en-us/azure/architecture/databases/guide/transactional-outbox-cosmos) — Patterns to avoid dual write and support eventual consistency.
- [microservices.io — Transactional Outbox](https://microservices.io/patterns/data/transactional-outbox.html) — Microservices pattern catalog.
