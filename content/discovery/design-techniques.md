# Design Techniques

Recommended techniques and visual tools for analysis, design and communication of systems in the Flowsy ecosystem.

## Event Storming

Collaborative workshop to discover domain events, commands, aggregates and business policies.

- **When to use**: project kickoff, bounded context discovery, alignment between business and technology.
- **Artifacts**: board with events (orange), commands (blue), aggregates (yellow), policies (lilac), read models (green).

See the complete guide at [Event Storming](./event-storming.md).

## Flowcharts

Visual representation of sequential processes with decision points.

- **When to use**: document business processes, approval flows, pipelines.
- **Convention**: use standard notation (start/end, process, decision, data).

## Swimlane Diagrams

Flowcharts with lanes that assign responsibility by actor or system.

- **When to use**: processes involving multiple actors, systems or departments.
- **Convention**: one lane per actor/system, flow from left to right or top to bottom.

## State Transition Diagrams

Representation of the possible states of an entity and valid transitions between them.

- **When to use**: entities with complex lifecycle, state machines, approval workflows.
- **Convention**: states as nodes, transitions as edges labeled with the event or action that triggers them.

## User Story Telling

Narrative technique to explore the user's journey through functional scenarios.

- **When to use**: user flow validation, story prioritization, refinement sessions.

## User Storyboard

Sequential visual representation of the user's journey interacting with the product.

- **When to use**: experience design, value proposition validation, communication with non-technical stakeholders.

## C4 Diagrams

4-level hierarchical model for documenting software architecture.

- **Level 1 — Context**: general view of the system and its external integrations.
- **Level 2 — Containers**: applications, services, databases that compose the system.
- **Level 3 — Components**: internal structure of a container.
- **Level 4 — Code**: class-level detail (use sparingly).

## Sequence Diagrams

Time-ordered interactions between components or actors for a specific use case.

- **When to use**: document integration flows, service-to-service calls, communication protocols.

## Context Maps (DDD)

Representation of relationships between bounded contexts within a system.

- **When to use**: systems with multiple domains, contract definition between teams, identification of integration patterns (ACL, Shared Kernel, Customer-Supplier).

See the [Domain-Driven Design](./domain-driven-design.md) guide for more context on bounded contexts and integration patterns.

## General Rule

Select the appropriate technique for the required level of detail. Document visual artifacts alongside the corresponding functional specification.

**Recommended tools**: Miro, Excalidraw, Notion, paper and post-its.
