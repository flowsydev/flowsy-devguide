# Domain-Driven Design

Principles and patterns of DDD applied pragmatically in the Flowsy ecosystem, complementing Vertical Slice Architecture.

## What is DDD?

Domain-Driven Design (DDD) is a software design approach that places the business domain at the center of technical decisions. The code should reflect the language and concepts of the business, not the other way around.

In Flowsy, DDD is applied pragmatically: not all its patterns need to be adopted from the start. It is applied where it adds real value, especially in modeling complex behaviors.

## Key Principles

- **Ubiquitous Language**: a shared and agreed vocabulary with the business, used in conversations, code, documentation and tests.
- **Bounded Contexts**: explicit boundaries within the domain where language and models are consistent. Each module in `Features/` represents a Bounded Context.
- **Model-Driven Design**: the code directly expresses domain concepts.
- **Iteration with the Business**: the model evolves with domain knowledge, it is not designed all at once.

## Fundamental Concepts

### Entity

Representation of a domain concept with **unique and persistent identity**. Its identity does not change even if its attributes change.

- Examples: `Product`, `Order`, `ShoppingCart`, `UserAccount`, `Customer`.
- In C#: model with `class` or `record class` with explicit ID.

### Value Object

Object that represents a domain concept **without its own identity**, defined solely by its properties.

- Examples: `PostalAddress`, `CartSummary`, `PhoneNumber`, `DateRange`.
- In C#: model with `record` (value comparison).
- Encapsulate validation, parsing and normalization in the object itself.

### Domain Rule

Constraint or condition that must be satisfied within the domain.

- Examples:
  - "A cart cannot have more than 100 products."
  - "An order cannot be cancelled if it has already been shipped."
- Implement inside the `State` of the corresponding command, not in the handler.

### Domain State

Representation of the domain at a given moment, built from databases, files or external services; modeled with entities and value objects.

- In VSA, the `State` encapsulates the entities needed to execute a command and validate domain rules.

### Feature

Specific functionality that adds value to the end user and is related to the domain.

- Examples: `AddItemToCart`, `CheckOrderStatus`, `SuspendUserAccount`.
- Each feature is an independent Vertical Slice in `Features/`.

### Module

Set of related features, optionally subdivided into submodules.

- Examples: `Inventory`, `Sales`, `Security`.
- Corresponds to a Bounded Context in DDD terms.

### Submodule

Smaller grouping of features within a module.

- Examples: `Sales/OrderPlacement`, `Sales/OrderBilling`.

### Vertical Slice

Pattern that organizes code by specific feature. Each slice contains everything needed: models, logic, validations, endpoints and its own infrastructure.

## Entity Lifecycle

For auditable entities, define an explicit existence state:

| State | Description |
| --- | --- |
| `Active` | Normal operational state. |
| `SoftDeleted` | Recoverable deletion — preserves historical traceability. |
| `HardDeleted` | Permanent deletion — without breaking historical traceability. |

If the business requires functional names, document the functional→technical mapping in the specification.

## Minimum Audit

Every auditable entity must record at minimum:

| Field | Description |
| --- | --- |
| `CreationInstant` | UTC creation timestamp. |
| `CreationContext` | Operational context of creation (user, system). |
| `LastMutationInstant` | UTC timestamp of last modification. |
| `LastMutationContext` | Operational context of last modification. |
| `LifecycleStatus` | Lifecycle state (if applicable). |

If there is an event log per entity, also include:

- `EventTimestamp`.
- `OperationContext`.
- Event type and minimum payload for traceability.

## Anti-Patterns (and Their Consequences)

### 1. Focusing on CRUD Instead of Behavior

- **Consequence**: Models reflect the database structure, not business processes.
- **Alternative**: Focus on commands that express intent (`PlaceOrder`, `ApproveRequest`).

### 2. Global and Shared Domain Model

- **Consequence**: High coupling, Git conflicts, ubiquitous language contamination.
- **Alternative**: Divide into Bounded Contexts. Each module maintains its own model.

### 3. Anemic Classes Without Behavior

- **Consequence**: Business rules are scattered or duplicated outside the domain.
- **Alternative**: Encapsulate behavior and rules inside entities, Value Objects and the `State` of each command.

### 4. Applying All DDD Patterns from Day 1

- **Consequence**: Analysis paralysis, over-engineering, team frustration.
- **Alternative**: Apply DDD incrementally, starting with the most complex or strategic processes.

### 5. Designing the Database First

- **Consequence**: The design becomes inflexible and prevents adequately modeling complex rules.
- **Alternative**: Design behaviors, events and aggregates first; then project to persistence models.

### 6. Skipping Collaborative Discovery

- **Consequence**: The technical team codes a functionally incorrect solution.
- **Alternative**: Conduct [Event Storming](./event-storming.md) sessions with stakeholders.

### 7. Too Many Cross-Module Dependencies

- **Consequence**: Each change propagates like a domino effect.
- **Alternative**: Use explicit messages and contracts (events/notifications) between modules. Avoid directly accessing models from other Bounded Contexts.

### 8. Overusing Generic Helper Services or Shared Utility Classes

- **Consequence**: Introduces unnecessary transversal coupling and dilutes domain intent. The code loses expressiveness and becomes a collection of helpers without cohesion.
- **Alternative**: Explicitly model actions or decisions as domain services with clear language, within the corresponding Bounded Context.

## Cross Reference

- [Event Storming](./event-storming.md) — collaborative domain discovery technique.
- [VSA: Concepts](../technologies/backend/vertical-slice-architecture/concepts.md) — domain implementation in slices.
- [C# Conventions](../conventions/csharp.md) — naming and implementation patterns.
