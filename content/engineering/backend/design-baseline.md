---
title: Backend Project Design Baseline
description: Project-wide discovery, design, documentation and validation baseline for backend work.
type: guide
audience: Architecture and backend development people.
canonical: true
---

# Backend Project Design Baseline

Use this baseline before choosing an architecture style such as Vertical Slice Architecture, Clean Architecture, Hexagonal Architecture, event-driven architecture or a framework-specific implementation model.

The goal is to keep backend work anchored in the domain, documented before implementation and validated by useful tests. Architecture patterns should organize those decisions; they should not replace discovery, analysis or design.

## Reading Path

Start here when a backend change introduces a new business capability, modifies domain behavior, affects persistence boundaries, creates integration events or changes public contracts.

Then continue with the specific implementation guide:

- [Vertical Slice Architecture](./architecture/vertical-slice-architecture) when organizing code by feature or use case.
- [Clean Architecture](./architecture/clean-architecture) when organizing dependencies around a protected domain core.
- [HTTP API Design](/engineering/backend/api/http-api-design) when defining routes, methods, status codes, Problem Details or OpenAPI contracts.
- [Error Handling](/engineering/backend/reliability/error-handling) when deciding validation flow, domain errors, transaction boundaries, infrastructure failures or side effects.
- [Data and Migrations](/engineering/data/relational-modeling) when modeling relational structures or schema evolution.

## Example Names and Real Artifacts

Names such as `OrderPlaced`, `CreateShoppingCart`, `ShoppingCart`, `Inventory`, `Sales`, `OrderPlacement`, `SendConfirmationEmail` and `ShoppingCartSummary` are illustrative domain, module, use-case or event names. Adapt them to the project's ubiquitous language.

Terms such as Event Storming, Bounded Context, ubiquitous language, ADR, OpenAPI, Problem Details, Clean Architecture, Vertical Slice Architecture and Hexagonal Architecture refer to real practices, standards or architecture styles.

## Project Design Workflow

### 1. Explore the Domain

- Understand the business from its protagonists before committing to a technical structure.
- Conduct [Event Storming](/foundations/discovery/event-storming) or another collaborative discovery technique with stakeholders.
- Map key processes with non-technical participants using simple notation: commands, events, aggregates, read models, rules and policies.
- Identify Bounded Contexts naturally, not as a forced upfront taxonomy.
- Establish a ubiquitous language for each context before naming APIs, database objects, events or code artifacts.
- Keep discovery evidence in the project documentation layer where the team can find and challenge it.

Useful tools include Miro, Excalidraw, Notion, paper and sticky notes. Useful roles include a facilitator, business representatives, technical contributors and people who operate or support the process.

### 2. Design and Document Before Implementation

- Describe the need, use case, business rules, acceptance criteria and validation evidence before creating production code.
- Capture important architecture decisions in ADRs when they affect boundaries, dependencies, data ownership, consistency, integration or operational risk.
- Define external contracts deliberately: HTTP APIs, messages, files, database interfaces, CLI commands or UI-facing models.
- Decide where domain rules live before selecting helper classes, services, frameworks or persistence structures.
- Keep documentation close enough to implementation work that it can guide code review, testing and AI-assisted development.

Use [Specs-Driven Development](/ai-assisted-development/specs-driven-development) and the [Project Documentation](/documentation/) guidance when work needs structured analysis or agent-friendly context.

### 3. Model Behavior Before Storage

- Start from the behavior the system must support, not from tables, screens or generic CRUD operations.
- Select a relevant user story or use case and model it end-to-end: client contract or trigger, delivery boundary, use case, domain behavior, persistence or integration, and events when required.
- Design the command or use-case input, application flow, domain behavior, validation, state loading strategy, read model, query and integration events only when the scenario needs them.
- Let database design follow aggregate boundaries, consistency needs, queries, integrity rules and operational constraints.
- Use constraints, indexes and concurrency controls as safeguards for the model, not as the only expression of business rules.

### 4. Choose the Implementation Shape

- Use a vertical slice when a feature should own its input, behavior, validation, persistence boundary and tests.
- Use layered organization when the project needs strong separation by dependency direction and shared application abstractions.
- Use ports and adapters when the domain must be isolated from several delivery or infrastructure mechanisms.
- Use events when other capabilities need to react independently to a committed business fact.
- Prefer the simplest structure that still protects the domain and makes change ownership clear.

### 5. Validate End to End

- Start with a real and functional capability rather than a purely technical skeleton.
- Test the behavior through the smallest useful path: command, domain decision, persistence, event, worker or read model according to risk.
- Add unit tests for domain decisions, integration tests for persistence and adapters, and end-to-end tests for critical workflows.
- Record validation evidence when the change affects contracts, migrations, operational behavior or business-critical flows.

## General Anti-Patterns

Avoid these regardless of architecture style:

1. **Focusing on CRUD instead of behavior**: model commands and use cases with intent.
2. **Skipping collaborative discovery**: use Event Storming or another lightweight discovery technique before naming core concepts.
3. **Designing the database first**: design behaviors, consistency boundaries and events before physical storage details.
4. **Global and shared domain model**: use Bounded Contexts and explicit contracts between contexts.
5. **Overusing generic helper services**: prefer domain services or use cases with clear language and responsibility.
6. **Anemic classes without behavior**: keep important invariants close to the state they protect.
7. **Applying every DDD pattern from day one**: grow the model pragmatically as complexity appears.
8. **Implementing before documenting the decision**: use specs, ADRs or lightweight notes when the choice affects future readers.

## Cross Reference

- [Ubiquitous Language](/foundations/ubiquitous-language)
- [Event Storming](/foundations/discovery/event-storming)
- [Domain-Driven Design](/foundations/domain-modeling/domain-driven-design-reference)
- [Project Documentation](/documentation/)
- [Specs-Driven Development](/ai-assisted-development/specs-driven-development)
