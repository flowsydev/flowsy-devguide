---
title: Ubiquitous Language
description: Guidance for choosing and applying the project language for the domain model, data model and business examples.
---

# Ubiquitous Language

Choose the project's ubiquitous language before writing examples, naming domain objects or designing database objects. In Domain-Driven Design, the ubiquitous language is the shared vocabulary used by domain experts, developers, documentation, tests and code inside a Bounded Context.

Treat the language of the model as a design decision, not as a side effect of the documentation language. A Flowsy guide may be written in English while a consuming project deliberately models its business domain in Spanish, Portuguese or another language.

## First Project Decision

At project start, agree which language will be used for business concepts in each relevant Bounded Context. The decision should cover conversations with domain experts, specs, examples, user stories, acceptance criteria, entities, Value Objects, commands, events, tests, database tables, columns, routines and integration contracts.

The language may differ by Bounded Context when the business reality requires it. For example, a customer-facing context may use English because the product operates internationally, while a compliance context may use Spanish for concepts tied to Mexican legal or operational vocabulary.

## Domain and Data Model

| Decision | Guideline |
| --- | --- |
| Domain model language | Use the language that best supports collaboration with domain experts and keeps the ubiquitous language clear. |
| Data model language | Align table, column, routine and event names with the domain language and the database engine naming convention. |
| Examples and templates | Show or adapt business examples in the chosen project language; when teaching language strategy, include English and Spanish equivalents. |
| Mixed-language projects | Define where English technical terms are acceptable and where domain terms must remain in the business language. |
| Team agreement | Document the chosen language strategy in project conventions, ADRs or repository instructions. |

Examples:

| Strategy | Domain Example | Data Model Example |
| --- | --- | --- |
| English model | `ShoppingCart`, `CreatedBy` | `shopping_cart`, `created_by` |
| Spanish model | `CarritoCompra`, `CreadoPor` | `carrito_compra`, `creado_por` |

## Identifiers and User-Facing Text

In Spanish business identifiers, omit articles and prepositions such as `De`, `Del`, `A`, `Al`, `La`, `El`, `Los` and `Las` when removing them does not change the meaning. This keeps code, database objects and technical contracts concise and easier to scan across `PascalCase`, `camelCase` and `snake_case`.

Keep the natural phrase in user-facing text, reports, labels, help text and business documentation when that is how users and domain experts speak.

| Context | Prefer | Avoid | Notes |
| --- | --- | --- | --- |
| C# entity | `OrdenDespacho` | `OrdenDeDespacho` | The compact identifier preserves the concept. |
| C# command | `AsignarTerminalDespachoCommand` | `AsignarTerminalDeDespachoCommand` | Technical suffixes stay in English. |
| TypeScript model | `ResumenOrdenDespacho` | `ResumenDeOrdenDeDespacho` | Keep identifiers short but meaningful. |
| PostgreSQL table | `orden_despacho` | `orden_de_despacho` | Use the compact form in database objects. |
| UI label | `Orden de despacho` | `Orden despacho` | User-facing text should read naturally. |
| Report title | `Asignaciones a la terminal de despacho` | `Asignaciones terminal despacho` | Preserve articles and prepositions for readability. |

Do not remove articles or prepositions mechanically. Keep them when they are part of an official term, avoid ambiguity or make the identifier clearer. For example, `PuestaEnOperacion` may be clearer than `PuestaOperacion`, and `PagoAProveedor` may be clearer than `PagoProveedor`.

## Technical Vocabulary

Keep well-known software design and development terms in English when translating them would reduce precision or make communication harder across tools and communities. Examples include `Domain-Driven Design`, `Bounded Context`, `Value Object`, `Aggregate`, `Repository`, `Unit of Work`, `Factory`, `Adapter`, `Outbox`, `Saga`, `Vertical Slice Architecture`, `Clean Architecture`, `Minimal API`, `DTO`, `API`, `Storybook`, `Pinia`, `Composable`, `CI/CD` and framework or library names.

Short examples:

| Business Language | Prefer | Avoid |
| --- | --- | --- |
| Spanish | `CrearPedidoCommand` | `CrearPedidoComando` |
| Spanish | `OrdenDespachoRepository` | `RepositorioOrdenDespacho` |
| Spanish | `ResumenPedidoDTO` | `ResumenPedidoOTD` |
| English | `CreateOrderCommand` | `CreateOrderComando` |

## Documentation Alignment

After choosing the language strategy, apply it consistently across [Writing Guidelines](/conventions/writing-guidelines), code conventions, data modeling, test examples and project documentation. When a page shows examples in both languages, the examples should express the same business concept with an appropriate translation rather than switching domains.
