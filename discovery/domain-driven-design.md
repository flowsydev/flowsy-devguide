# Domain-Driven Design

Principles and patterns of DDD applied pragmatically in the Flowsy ecosystem, complementing Vertical Slice Architecture.

## What is DDD?

Domain-Driven Design (DDD) is a software design approach that places the business domain at the center of technical decisions. The code should reflect the language and concepts of the business, not the other way around.

In Flowsy, DDD is applied pragmatically: not all its patterns need to be adopted from the start. It is applied where it adds real value, especially in modeling complex behaviors.

## Key Principles

- **Ubiquitous Language**: a shared and agreed vocabulary with the business, used in conversations, code, documentation and tests.
- **Bounded Contexts**: explicit boundaries where a specific domain language, model and set of rules are consistent.
- **Model-Driven Design**: the code directly expresses domain concepts.
- **Iteration with the Business**: the model evolves with domain knowledge, it is not designed all at once.

## Bounded Contexts

A Bounded Context is a conceptual boundary inside the domain. Within that boundary, terms have precise meaning and the model can evolve without being forced to match every other part of the system.

For example, `Customer` may mean a buyer in a `Sales` context, an account holder in an `Identity` context and a billing party in an `Invoicing` context. DDD does not require those meanings to collapse into one global class. Instead, each context owns its language, rules, entities, value objects, events and persistence decisions.

Bounded Contexts are not a folder convention or a specific architecture. A project may implement them using modules, packages, projects, namespaces, services, schemas, feature sets or another structure that fits its language, framework and architecture. When a project uses Vertical Slice Architecture, a folder such as `Features/` can be a practical way to organize features by module or context, but it is not required by DDD.

Use Bounded Contexts when:

- the same term has different meanings in different areas of the business;
- teams need autonomy over different parts of the model;
- integrations require explicit contracts between domain areas;
- one shared model would create confusing names, excessive coupling or constant negotiation.

Document the chosen implementation mapping in the project architecture guide. For example, one project may map a Bounded Context to a service, another to a .NET project, another to a Java package and another to a VSA `Features/<Module>/` folder.

## Model Language Strategy

Choose the language of the domain model with domain experts and the delivery team. Flowsy documentation is written in English by default, but a project may deliberately model aggregates, entities, value objects, commands, events and data objects in another language when that better reflects the business language.

| Strategy | When It Fits | Examples |
| --- | --- | --- |
| English domain model | The product, team, documentation and integrations use English consistently. | `ShoppingCart`, `AddItem`, `CartCheckedOut` |
| Business-language domain model | Domain experts and operational processes use another language as the main business language. | `OrdenDespacho`, `AsignarTerminal`, `OrdenDespachoAsignada` |
| Mixed strategy with boundaries | Technical platform terms stay in English, while domain concepts stay in the business language. | `DispatchIntegrationClient`, `OrdenDespacho`, `obtener_pendientes_asignacion` |

Keep the decision consistent inside each Bounded Context and document exceptions. The data model should follow the same language strategy unless integration, reporting or platform constraints justify a different one.

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
- In Vertical Slice Architecture, a feature can be implemented as an independent slice under a convention such as `Features/`. Other architectures may place the same behavior in use-case classes, application services, handlers, modules or packages.

### Module

Set of related features, optionally subdivided into submodules.

- Examples: `Inventory`, `Sales`, `Security`.
- May represent a Bounded Context, part of a Bounded Context or an implementation grouping, depending on the project's architecture and domain boundaries.

### Submodule

Smaller grouping of features within a module.

- Examples: `Sales/OrderPlacement`, `Sales/OrderBilling`.

### Vertical Slice

Pattern that organizes code by specific feature. Each slice contains everything needed: models, logic, validations, endpoints and its own infrastructure.

## Entity Record Status

For auditable entities, define an explicit existence state:

| State | Description |
| --- | --- |
| `Active` | Normal operational state. |
| `SoftDeleted` | Recoverable deletion — preserves historical traceability. |
| `HardDeleted` | Permanent deletion — without breaking historical traceability. |

If the business requires functional names, document the functional→technical mapping in the specification.

## Audit Attributes

Design audit attributes according to the requirements of each project, domain and actor model. The guide proposes common attributes, but each team must validate them through requirements analysis instead of treating one fixed list as universal: some domains need to know the user that performed an action, while others need to record the application, service account, integration, device, tenant or process that caused the change.

Auditable entities commonly need:

| Field | Description |
| --- | --- |
| `RecordStatus` | Record state (if applicable for a given entity). |
| `LifetimeStart` | When using `RecordStatus`, the UTC time stamp when the normal operational state started. |
| `LifetimeEnd` | When using `RecordStatus`, the UTC time stamp when the normal operational state ended. |
| `CreatedAt` | UTC creation timestamp. |
| `CreatedByUserId` | ID of the user that created the entity, when the actor is a user. |
| `CreatedByApplicationId` | ID of the application or integration that created the entity, when the actor is a system. |
| `UpdatedAt` | UTC timestamp of last modification. |
| `UpdatedByUserId` | ID of the user that updated the entity for the last time, when the actor is a user. |
| `UpdatedByApplicationId` | ID of the application or integration that updated the entity, when the actor is a system. |

Choose names in the language and naming style of the project. Attributes that reference another entity, such as a user or application, should respect the same `Id` position rule used for primary and foreign keys: English names normally use `Id` as a suffix, while Spanish names normally use `Id` as a prefix.

| Language Strategy | Example Attributes |
| --- | --- |
| English domain and code | `CreatedAt`, `CreatedByUserId`, `CreatedByApplicationId`, `UpdatedAt` |
| Spanish domain and code | `CreadoEn`, `IdUsuarioCreador`, `IdAplicacionCreadora`, `ActualizadoEn` |

If there is an event log per entity, also include:

- `EventTimestamp`.
- `EventType`.
- `Payload`.
- `OperationContext`.

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
