# Proposed Information Architecture

## Objective

Organize Flowsy DevGuide by the reader's primary intent so a person can quickly answer one of these questions:

- How do I understand and model the problem?
- How do I document knowledge and coordinate work?
- How do I design and implement the solution?
- How do I verify quality?
- How do I collaborate with AI agents?
- Which shared conventions must I follow?

The proposal does not require changing every slug immediately. The tree represents thematic ownership and target navigation; physical migration can be gradual and keep previous routes through bridges.

## Organization Principles

### One Primary Intent per Page

Each page should summarize as a single sentence of the form “use this guide to...”. If it needs two verbs of different nature — for example, “model errors and design transactions” — it should be split or explicitly declare an external canonical page.

### Separate Concept, Practice, Implementation and Example

| Type | Question It Answers | Example |
| --- | --- | --- |
| Concept | What is it and which decision does it represent? | What a global instant means. |
| Practice | How should it apply across stacks? | How to model validation and invariants. |
| Implementation | How does it land in a stack? | `DateTimeOffset` in .NET. |
| Example | What does a complete solution look like? | A dispatch-order slice with Minimal APIs. |

An implementation page may summarize the concept, but must link the canonical source and focus on stack differences.

### Location Defines Ownership, Not Exclusivity

A canonical Date and Time page does not prevent API, Vue or PostgreSQL from explaining local application. It does prevent each of them from independently redefining the full policy.

### Navigation Must Be Contextual

Top navigation should show primary areas. The sidebar should show only the current section tree, with related links at the end of each page. That reduces visual volume and stops the physical tree from replacing reading paths.

### IDs Are Not Translated

Documentary identifiers must stay stable even when title, language, folder or slug changes. Visible labels may be translated; canonical codes may not.

### Public Content and the Work Record Are Different Products

- `content/` holds canonical knowledge for guide readers.
- `specs/` holds the operational history of changes to the guide.
- `docs/` holds internal analysis or proposals that are not yet (or not only) public guidance.

A spec may produce content changes, but must not become permanent site navigation.

## Proposed Primary Navigation

| Section | Intent | Main Content |
| --- | --- | --- |
| Home | Choose a reading path | Purpose, audience, tours and section access. |
| Foundations | Understand and model the domain | Ubiquitous Language, design techniques, Event Storming and DDD. |
| Documentation | Capture knowledge and coordinate work | Project artifacts, repositories, work specs and publishing tools. |
| Engineering | Design and implement solutions | Backend, APIs, reliability, data, messaging, .NET, frontend and Vue. |
| Quality | Design and demonstrate validation | Strategy, levels, evidence, stacks, databases and events. |
| AI-Assisted Development | Collaborate with agents | Best practices, routing, context guides and platforms. |
| Conventions | Apply shared rules | Writing, Git, versioning and cross-cutting terminology. |

## Target Tree

Physical names are illustrative. English technical slugs stay aligned with repository convention; visible navigation labels are also English Title Case for this guide.

```text
📁 content/
├── 📄 index.md
├── 📁 foundations/
│   ├── 📄 index.md
│   ├── 📄 ubiquitous-language.md
│   ├── 📁 discovery/
│   │   ├── 📄 index.md
│   │   ├── 📄 design-techniques.md
│   │   └── 📄 event-storming.md
│   └── 📁 domain-modeling/
│       ├── 📄 index.md
│       ├── 📄 bounded-contexts.md
│       ├── 📄 entities-and-value-objects.md
│       ├── 📄 aggregates.md
│       └── 📄 dynamic-consistency-boundaries.md
├── 📁 documentation/
│   ├── 📄 index.md
│   ├── 📄 adopting-the-devguide.md
│   ├── 📁 project-artifacts/
│   │   ├── 📄 index.md
│   │   ├── 📄 organization.md
│   │   ├── 📄 identifiers-and-traceability.md
│   │   ├── 📁 strategy/
│   │   ├── 📁 analysis/
│   │   ├── 📁 architecture/
│   │   ├── 📁 delivery/
│   │   └── 📁 validation/
│   ├── 📁 repositories/
│   │   ├── 📄 index.md
│   │   ├── 📄 readme.md
│   │   └── 📄 local-documentation.md
│   ├── 📁 work-specs/
│   │   ├── 📄 index.md
│   │   ├── 📄 workflow.md
│   │   └── 📄 document-reference.md
│   └── 📁 tooling/
│       ├── 📄 index.md
│       └── 📁 vitepress/
│           ├── 📄 index.md
│           ├── 📄 configuration.md
│           ├── 📄 layouts-and-navigation.md
│           └── 📄 deployment.md
├── 📁 engineering/
│   ├── 📄 index.md
│   ├── 📁 cross-cutting/
│   │   ├── 📄 date-and-time.md
│   │   ├── 📄 identifiers.md
│   │   └── 📄 auditing-and-validity.md
│   ├── 📁 backend/
│   │   ├── 📄 index.md
│   │   ├── 📄 design-baseline.md
│   │   ├── 📁 architecture/
│   │   │   ├── 📄 index.md
│   │   │   ├── 📄 vertical-slice-architecture.md
│   │   │   └── 📄 clean-architecture.md
│   │   ├── 📁 api/
│   │   │   └── 📄 http-api-design.md
│   │   ├── 📁 reliability/
│   │   │   ├── 📄 index.md
│   │   │   ├── 📄 error-handling.md
│   │   │   ├── 📄 validation-and-domain-rules.md
│   │   │   └── 📄 transactional-consistency.md
│   │   └── 📁 dotnet/
│   │       ├── 📄 index.md
│   │       ├── 📄 csharp.md
│   │       ├── 📁 minimal-apis/
│   │       └── 📁 background-services/
│   ├── 📁 data/
│   │   ├── 📄 index.md
│   │   ├── 📄 relational-modeling.md
│   │   ├── 📁 migrations/
│   │   └── 📁 database-engines/
│   ├── 📁 messaging/
│   │   ├── 📄 index.md
│   │   ├── 📄 event-driven-architecture.md
│   │   ├── 📄 reliable-delivery.md
│   │   ├── 📄 event-sourcing.md
│   │   └── 📄 kafka-redpanda-event-store.md
│   ├── 📁 frontend/
│   │   ├── 📄 index.md
│   │   ├── 📄 modular-architecture.md
│   │   └── 📁 vue/
│   │       ├── 📄 index.md
│   │       ├── 📄 conventions.md
│   │       ├── 📄 components.md
│   │       ├── 📄 state-and-composables.md
│   │       ├── 📄 ui-api-contracts.md
│   │       └── 📄 storybook.md
│   └── 📁 security/
│       ├── 📄 index.md
│       └── 📄 dependency-safety.md
├── 📁 quality/
│   ├── 📄 index.md
│   ├── 📄 automated-testing-strategy.md
│   ├── 📄 unit-tests.md
│   ├── 📄 integration-tests.md
│   ├── 📄 end-to-end-tests.md
│   ├── 📄 evidence-and-reporting.md
│   ├── 📁 stacks/
│   │   ├── 📄 csharp-dotnet.md
│   │   └── 📄 typescript-vue.md
│   └── 📁 systems/
│       ├── 📄 relational-databases.md
│       ├── 📄 database-migrations.md
│       └── 📄 event-driven-systems.md
├── 📁 ai-assisted-development/
│   ├── 📄 index.md
│   ├── 📄 best-practices.md
│   ├── 📄 agent-routing.md
│   ├── 📄 platform-guidance.md
│   ├── 📄 official-references.md
│   └── 📁 context-guides/
└── 📁 conventions/
    ├── 📄 index.md
    ├── 📄 writing-guidelines.md
    └── 📁 source-control/
        └── 📄 git.md
```

## Relocation Map from Current Families

| Current Location | Conceptual Destination | Action |
| --- | --- | --- |
| `content/index.md` | Home + Documentation > Adoption | Keep a short home; extract onboarding and typical solution structure. |
| `discovery/ubiquitous-language.md` | Foundations | Keep as canonical domain-language source. |
| `discovery/design-techniques.md` | Foundations > Discovery | Keep as catalog and path to detailed guides. |
| `discovery/event-storming.md` | Foundations > Discovery | Keep; decouple direct VSA mapping. |
| `discovery/domain-driven-design.md` | Foundations > Domain Modeling | Split by strategic design, tactical modeling, Aggregates and DCB. |
| `discovery/documentation/layers/**` | Documentation > Project Artifacts | Move as a block, fix links and unify IDs. |
| `discovery/documentation/static-site-generators/**` | Documentation > Tooling | Move out of Discovery and split VitePress by intent. |
| `conventions/repository-documentation.md` | Documentation > Repositories | Split README/local docs from dependency safety. |
| `ai-assisted-development/specs-driven-development.md` | Documentation > Work Specs | Move the canonical guide; keep a context guide under AI. |
| `technologies/backend/concepts.md` | Engineering > Backend | Convert into a landing or distribute its canonical topics. |
| `technologies/backend/project-design-baseline.md` | Engineering > Backend | Keep as first path for meaningful changes. |
| `technologies/backend/error-handling.md` | Engineering > Backend > Reliability | Split error, validation/invariants and consistency/effects. |
| `technologies/backend/api-design.md` | Engineering > Backend > APIs | Keep; leave only HTTP semantics and contracts. |
| VSA and Clean Architecture | Engineering > Backend > Architecture | Keep, with references to reliability and foundations. |
| `backend/data-and-migrations/**` | Engineering > Data | Promote out of Backend; create an area landing. |
| EDA and Event Sourcing | Engineering > Messaging | Group under a common landing without confusing communication and persistence. |
| `backend/dotnet/**` | Engineering > Backend > .NET | Keep and split long pages by intent. |
| `technologies/frontend/**` | Engineering > Frontend | Keep agnostic → stack pattern; fix contradictions. |
| `technologies/testing/**` | Quality | Move as a nearly unchanged conceptual block. |
| `ai-assisted-development/**` except canonical specs guide | AI-Assisted Development | Keep; move stack-specific skills from technical pages into context guides. |
| `conventions/writing-guidelines.md` | Conventions | Keep as editorial canonical source. |
| `conventions/source-control/git.md` | Conventions > Source Control | Keep. |
| `specs/**` | Internal Record | Keep excluded from the public site. |

Historical routes under `discovery/` and `technologies/` remain compatibility bridges only. Canonical content does not continue under those paths after migration.

## Decomposition of Overloaded Pages

### Error Handling

```text
Error Handling
├── error taxonomy
├── propagation and translation across boundaries
├── sanitization and observability
└── error-contract selection

Validation and Domain Rules
├── contract validation
├── application preconditions
├── domain invariants
└── constraints as safeguards

Transactional Consistency
├── mutation order
├── transaction boundary
├── command idempotency
├── Outbox
└── side effects

Reliable Message Delivery
├── retries
├── consumer idempotency
├── duplicates and ordering
└── DLQ
```

`http-api-design.md` owns HTTP mapping and Problem Details. Specific architectures include only a short responsibility table and link these pages.

### Domain-Driven Design

| New Page | Content |
| --- | --- |
| DDD Introduction | Purpose, pragmatism, language and journey. |
| Bounded Contexts | Meanings, ownership, integration and possible mappings. |
| Entities and Value Objects | Basic tactical concepts. |
| Aggregates | Classic boundary, invariants and consistency. |
| Dynamic Consistency Boundaries | Behavior-based decisions, benefits, risks and selection. |
| VSA: Implementation Mapping | `State`, `StateHandler`, commands and code structure. |
| Auditing and Validity | Cross-cutting model and persistence conventions. |
| Public Identifiers | External contracts, safety and persistence. |

### C# with Minimal APIs

Convert the current page into a landing with a progressive path:

1. feature-set structure;
2. endpoints and HTTP results;
3. commands and queries;
4. `State`/`StateHandler` decision;
5. simple command examples;
6. shared-state mutation examples;
7. query examples;
8. shared models.

Mediator vs direct-invocation examples should use focused differences or tabs, avoiding full-block duplication when only invocation changes.

### Vue Ecosystem

| New Page | Content |
| --- | --- |
| Vue 3 and Components | Composition API, components and prior flow. |
| Visual Design and Storybook | Wireframes, states, stories and visual traceability. |
| State and Composables | Pinia, composables, pure logic and communication. |
| UI/API Contracts | Decision table for direct use, ViewModel or adapter. |
| Vue Structure | Concrete mapping of modular architecture to the stack. |
| TypeScript and Vue Testing | Canonical testing strategy and tools. |
| Vue Context Guide | Agent skills and operational summary. |

### Project Documentation

Separate:

- vision and disciplinary layers;
- folder organization;
- identifiers and traceability;
- pages and templates per discipline.

A reader who only needs to choose an artifact should not walk the full multi-language structure and ID rules.

### Specs-Driven Development

Separate:

- overview and when to use specs;
- workflow;
- document-type and template reference;
- agent usage as a context guide.

## Cross-Cutting Topic Ownership

| Topic | Canonical Source | Profiles or Consumers |
| --- | --- | --- |
| Ubiquitous Language | Foundations > Ubiquitous Language | Writing, DDD, C#, Vue, data and artifacts. |
| Date and Time | Engineering > Cross-Cutting | API, C#, Vue, relational modeling, engines and testing. |
| Auditing and Validity | Engineering > Cross-Cutting | DDD, C#, relational modeling and engines. |
| Public Identifiers | Engineering > Cross-Cutting | API, C#, frontend and databases. |
| Errors | Backend > Reliability > Error Handling | API, VSA, Clean, .NET and messaging. |
| Validation and Invariants | Backend > Reliability | DDD, VSA, Clean, data and testing. |
| Outbox and Reliable Delivery | Messaging > Reliable Delivery | Error handling, EDA, Background Services and testing. |
| Testing Strategy | Quality | All stacks and context guides. |
| Artifact IDs | Documentation > Project Artifacts | Templates, home and solution examples. |
| Editorial Rules | Conventions > Writing Guidelines | All public and operational Markdown. |
| Agent Skills | AI > Context Guides | Stack pages via short link. |
| Dependency Safety | Engineering > Security | README via onboarding reference. |

## Recommended Identifier System

Declare codes as non-translatable canonical tokens:

| Discipline | Artifact | Proposed Canonical Code |
| --- | --- | --- |
| Strategy | Theme | `STR-THM` |
| Strategy | Initiative | `STR-INI` |
| Analysis | Need | `ANL-NED` |
| Analysis | Requirement | `ANL-REQ` |
| Analysis | Use Case | `ANL-UC` |
| Analysis | Business Rule | `ANL-BR` |
| Architecture | ADR | `ARC-ADR` |
| Architecture | Contract | `ARC-CTR` |
| Delivery | Epic | `DLV-EPC` |
| Delivery | PBI | `DLV-PBI` |
| Delivery | Task | `DLV-TSK` |
| Validation | Acceptance Criteria | `VAL-AC` |
| Validation | GWT Scenario | `VAL-GWT` |
| Validation | Test Case | `VAL-TST` |

Projects that consume historical codes should document their transition; existing artifacts are not silently renumbered.

## Navigation Model

### Top Bar

Keep only access to the seven primary areas. Secondary links live on each section landing.

### Contextual Sidebar

Configure sidebars by route prefix, for example:

- `/foundations/` shows only Foundations;
- `/documentation/` shows only Documentation;
- `/engineering/` shows Engineering and its groups;
- `/quality/` shows Quality;
- `/ai-assisted-development/` shows AI;
- `/conventions/` shows Conventions.

### Required Landings

Every area with three or more pages needs `index.md`. Priorities:

- Backend;
- Data;
- Messaging;
- .NET;
- Vue;
- Repository Documentation;
- Work Specs;
- Reliability;
- Security.

### Reading Paths

Each landing should offer task-oriented paths, not only file lists. Example for Backend:

| Need | Start At |
| --- | --- |
| Design a change with business behavior | Backend Design Baseline |
| Choose code organization | Backend Architectures |
| Design an HTTP contract | HTTP API Design |
| Model failures or transactions | Reliability |
| Implement with .NET | .NET |
| Change persistence | Data |
| Publish or consume events | Messaging |
| Define evidence | Quality |

## Editorial Rules to Prevent New Drift

1. Every new page declares intent, audience and related canonical source.
2. Every main section has a conceptual owner and landing.
3. Stack pages do not redefine full cross-cutting policies.
4. Extended examples live apart from normative rules.
5. Context guides summarize; they do not replace or contradict canonical pages.
6. Visible changes update navigation, section maps and `CHANGELOG.md` in the same delivery.
7. Links are validated in both Markdown and frontmatter.
8. Operational repository documents are reviewed when routes or taxonomy change.
9. Documentary IDs are stable and independent of language and folder.
10. Every repeated topic declares which page owns the decision and which pages are application profiles.
