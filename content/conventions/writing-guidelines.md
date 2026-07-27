---
title: Writing Guidelines
description: Editorial rules for project documentation artifacts, repositories and navigation.
type: guide
audience: Authors, maintainers and contributors of documentation.
canonical: true
---

# Writing Guidelines

These guidelines apply to documentation artifacts produced inside projects, documentation sites and code repositories. Use them when writing `README.md`, `AGENTS.md`, guides in `docs/`, specs, ADRs, acceptance criteria, use cases, PBIs, navigation labels and documentation templates.

Before applying these rules, define the project's [Ubiquitous Language](/foundations/ubiquitous-language) so editorial choices, business examples and technical names follow the same domain language strategy.

## Base Rules

- Choose the documentation language according to the needs of every project, audience and Bounded Context.
- Support multi-language projects deliberately: make clear which language is used for business concepts, examples and user-facing terminology in each documentation area.
- Apply the chosen ubiquitous language consistently to business concepts in examples, tests, user stories, acceptance criteria and documentation artifacts.
- Distinguish technical identifiers from user-facing wording: compact identifiers may omit articles and prepositions, while UI labels, reports and business-facing prose should keep the natural phrase.
- Keep proper names, acronyms and technical terms in their original form when translating them would reduce precision.
- Use a clear, direct and useful voice for technical and business audiences.
- Avoid unnecessary jargon when a simpler term is precise enough.

## Multi-Language Documentation

When a project uses more than one language, avoid accidental mixing. Document the rule that explains where each language belongs, such as English for public developer documentation and Spanish for business examples tied to a specific domain.

When showing equivalent examples in multiple languages, use the same business concept with an appropriate translation. For example, use `ShoppingCart` with `CarritoCompra`, or `CreateOrderCommand` with `CrearPedidoCommand`; avoid switching to unrelated domains just to show a different language.

Do not translate stable technical vocabulary just because the surrounding paragraph is in another language. For example, a Spanish business model may still use suffixes such as `Command`, `Repository`, `DTO` or `ViewModel` when those words identify established software concepts.

For Spanish business concepts, use compact forms in identifiers when articles or prepositions are not needed for meaning: `PedidoCliente`, `AsignarDireccionEnvio`, `pedido_cliente`. Use natural forms in visible text: "Pedido de cliente", "Asignar dirección de envío", "Reporte de asignaciones de dirección de envío".

## Example Names and Real Artifacts

When a guide uses names for interfaces, classes, records, DTOs, database objects, routes, packages or files, make the reader's interpretation explicit.

- Mark fictitious or proposed names as examples. Use wording such as "for example", "sample", "proposed", "representative" or "adapt this name to the project".
- Mark real artifacts from a language, framework or ecosystem as real. For example, clarify when `DateTimeOffset`, `TimeProvider`, `IOptions<T>`, `ILogger<T>`, `record`, `interface`, `Date`, `Intl.DateTimeFormat`, `timestamptz` or `datetimeoffset` are actual platform artifacts.
- Do not let sample domain names look like required framework APIs. A name such as `CreateShoppingCartCommand`, `IShoppingCartFinder`, `DbTimeProvider`, `ShoppingCartAdapter`, `scheduled_at_local` or `public_id` should be understood as illustrative unless the project explicitly defines it.
- When a code block mixes real framework types and sample project types, add a short sentence before the block that distinguishes them.
- Prefer realistic sample names that teach the convention, but avoid implying that every project must copy the exact names.

## Language-Specific Rules

### English

- Write in clear English by default for Flowsy repositories.
- Use consistent spelling within each repository or project; avoid mixing regional variants without a reason.
- Prefer plain technical prose over idioms that are difficult to translate or understand for international teams.
- Use Spanish only for concepts that are intrinsically Mexican or legal/business-specific, such as CURP or RFC.

### Spanish

- Write in careful Spanish, with accents, opening punctuation marks (`¿`, `¡`) and correct punctuation.
- Avoid unnecessary anglicisms when a precise and natural Spanish term exists.
- Translate `feature` to Spanish as `característica`, not as `capacidad`.
- Keep established technical terms in English when translating them would reduce precision or make communication harder.

## Titles and Navigation

Write titles, headings and navigation text in Title Case:

- Capitalize major words;
- Keep short articles, prepositions and conjunctions lowercase;
- Capitalize a word when it is the first word of the title;
- Respect proper names, acronyms and technical terms.

Examples:

```text
Project Documentation
Repository Agent Instructions
Specs-Driven Development
Acceptance Criteria
PostgreSQL and Migrations
```

## Terminology

Use consistent terms across business documentation, technical documentation and agent instructions.

For English documentation:

| Concept | Recommended Term |
| --- | --- |
| Product capability delivered to users | feature |
| Formalized need or expected behavior | requirement |
| Domain constraint or policy | business rule |
| Conditions for acceptance | acceptance criteria |
| Actor-centered backlog expression | user story |

For Spanish documentation:

| English Term | Spanish Term |
| --- | --- |
| `feature` | característica |
| `requirement` | requerimiento |
| `business rule` | regla de negocio |
| `acceptance criteria` | criterios de aceptación |
| `user story` | historia de usuario |

When a technical term is more recognizable in English, keep it in English, especially for patterns, frameworks, libraries or formats. Examples include `Domain-Driven Design`, `Bounded Context`, `Value Object`, `Aggregate`, `Repository`, `Unit of Work`, `Factory`, `Adapter`, `Outbox`, `Saga`, `Vertical Slice Architecture`, `Clean Architecture`, `Minimal API`, `DTO`, `API`, `Storybook`, `Pinia`, `Composable`, `CI/CD` and framework or library names.

## Emojis

Use emojis only when they add visual, semantic or didactic value. In folder trees, they can improve readability when they help distinguish element types. 

Avoid using them as repetitive decoration or when they distract from the content.

## Repository Files

In code repositories, apply these guidelines also to:

- `README.md`;
- `AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md` and equivalent instructions;
- `CHANGELOG.md`;
- documentation under `docs/`;
- specs under `docs/specs/`;
- ADRs, contracts, operations guides and support documentation.

For repository-specific application, see [Repository Documentation](/documentation/repositories/).
