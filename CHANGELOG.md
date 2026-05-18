# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.6.0] - 2026-05-18

### Changed

- Database object and migration script naming guidance updated to follow each database provider's community conventions, with aggregate-oriented routine naming examples for abbreviated and full aggregate prefixes across PostgreSQL, MySQL/MariaDB, SQL Server, Oracle, Snowflake and BigQuery.
- Top navigation made more compact while preserving dropdown access to the main site sections and technology subsections.
- Evolve/Flyway repeatable migration structure expanded with additional aggregate folder examples under sales, billing and inventory schemas.
- Routine prefix guidance clarified to prefer full aggregate names and reserve derived abbreviations or codes for practical constraints such as PostgreSQL identifier length.
- Routine prefix guidance expanded to require a consistent full-name or abbreviation strategy across each project, with documented exceptions for specific long aggregate names.
- Evolve/Flyway naming guidance reformatted with decision tables and descriptive aggregate-operation examples for easier scanning.
- Repeatable routine naming guidance refined so prefix selection rules appear as bullets and the table focuses on case-style examples.
- Evolve/Flyway guidance reorganized into migration model, script-type selection and naming rules, clarifying repeatable scripts as recreated object definitions.
- Routine prefix wording standardized around "abbreviation or code" for long aggregate exceptions.
- Migration guidance expanded with a cross-tool aggregate operation vocabulary, recommending `create`, `get`, `modify`, `remove` and `view` for aggregate-oriented database objects.
- Database migration repository structure expanded with examples for `Operations/` and `Queries/` scripts outside automatic migration execution.
- Database migration folder guidance clarified so `Resources/Databases/...` is treated as an adaptable base-path recommendation, with lowercase and framework-specific alternatives for non-.NET projects.
- Audit attribute and column guidance updated to make actor fields project- and domain-driven, with English and Spanish examples for user- and application-originated changes.
- Domain and data model language guidance expanded so consuming projects choose English, Spanish or another project language by team agreement, independently from the language of the Flowsy guide.
- Backend relational database and migration guidance unified under a single Data and Migrations navigation section.
- Primary and foreign key naming guidance added for English and Spanish model strategies, including case-style-aware `id` prefix/suffix examples.
- Repeatable migration guidance updated to avoid lifecycle ordering recommendations that depend on English operation names or numeric prefixes.
- Data and Migrations pages physically reorganized under `technologies/backend/data-and-migrations/`, with audit schema guidance consolidated into relational modeling.
- Domain-Driven Design guidance expanded to explain Bounded Contexts as conceptual domain boundaries, decoupled from `Features/` or any specific architecture.
- Testing guidance reorganized under `technologies/testing/database/`, replacing PostgreSQL-specific testing with engine-neutral relational database testing plus separate migration testing.
- Relational modeling naming guidance expanded to include common database objects such as schemas, routines, parameters, views, sequences, triggers and scheduled jobs.
- Primary key naming guidance table reorganized by case style with English and Spanish naming columns to improve readability.
- Top navigation simplified to single-level dropdowns that link only to main section and subsection indexes, leaving detailed page navigation to the sidebar.

## [1.5.0] - 2026-05-03

### Added

- VitePress guidance section under `discovery/documentation/static-site-generators/` covering quick-start, base configuration, disciplinary folder structure, sidebar navigation interceptor, layouts and global Vue components, Mermaid plugin setup, and deployment options.
- `discovery/documentation/index.md` as a gateway page introducing the two subsections: Disciplinary Layers and Static Site Generators.
- Writing Guidelines page at `conventions/writing-guidelines.md` with editorial rules for language, titles, terminology, emojis and repository files.

### Changed

- Disciplinary layers content reorganized under `discovery/documentation/layers/`, separating durable documentation artifacts from the new static-site-generators section.
- Writing Guidelines relocated from `discovery/documentation/layers/` to `conventions/` to reflect its cross-cutting scope across Flowsy repositories and projects that adopt the DevGuide.
- Navigation and sidebar updated: Writing Guidelines now appears under Conventions (before Repository Documentation); Disciplinary Layers entry remains under Discovery & Design.
- All internal links updated to reflect the new paths for layers content and writing guidelines.
- `AGENTS.md` updated with release preparation and publishing instructions and context-on-demand references aligned to current paths.
- Context guides for project documentation and repository instructions updated with current links and expanded implementation guidance.
- `conventions/index.md` updated with Writing Guidelines entry in features and available guides list.

## [1.4.0] - 2026-05-02

### Changed

- Analysis artifact ID prefix corrected from `ANL-*` to `ANA-*` across all analysis templates (need, requirement, use case, business rule) and all cross-template references in architecture and delivery templates.
- Folder Structure section in the project documentation guide redesigned with tree-style characters (`├──`, `└──`, `│`) and folder/file emojis (📂/📁/📄) to clearly represent nesting levels; descriptive paragraph added above the example.
- Release preparation instructions in `AGENTS.md` updated to include `package.json` version bump as the first step.

## [1.3.0] - 2026-05-02

### Changed

- Top navigation sections now open menus with links to their section pages.

## [1.2.0] - 2026-05-02

### Changed

- Writing guidelines clarified for project-selected Spanish documentation and Title Case navigation rules.

## [1.1.0] - 2026-05-02

### Added

- HTTP API design guidance covering API maturity, HTTP semantics, RFC 9457 Problem Details with stable application error codes, global exception handler mapping for C# APIs, Minimal API response patterns and agent routing for API contract work.

### Changed

- Internal specs reorganized by line of work and documentation impact, replacing `specs/ai-specs/` with thematic groups such as `specs/backend-api-design/` while preserving the existing `001-api-maturity-problem-details` spec.
- Internal specs expanded with community-oriented records for AI-assisted development, testing and discovery documentation work.
- Main home feature cards reordered into a three-column discovery, design and implementation path that prioritizes AI-assisted development and automated testing.
- Flowsy documentation coverage expanded for specs-driven development, agent context guides, Git Pull Requests, project documentation, Vue feature-sets and testing practices.
- Minimum audit and entity event-log guidance aligned across C#, Domain-Driven Design and PostgreSQL conventions.
- Database migration structure updated to use `Resources/Databases/{DatabaseOrConnectionKey}` with separated versioned, repeatable, operations and queries folders.
- Database migration concepts made tool-agnostic, with Evolve/Flyway naming moved to tool guidance, `flwdb` CLI guidance separated into its own page, and migration strategy coverage expanded for Liquibase, DbUp, EF Core, Sqitch and Atlas.
- Writing guidelines clarified for project-selected Spanish documentation and Title Case navigation rules.
- SQL Server and MySQL/MariaDB database convention pages added with change-control guidance.

## [1.0.0] - 2026-04-18

### Added

- Initial publication of Flowsy DevGuide
- Conventions section: C#, TypeScript, Vue, PostgreSQL, Git
- Discovery section: Design Techniques, Event Storming, Domain-Driven Design, Project Documentation
- Technologies section: Backend (Clean Architecture, Vertical Slice Architecture, Event-Driven Architecture, Event Sourcing, Relational Databases, Database Migrations) and Frontend (Modular Architecture)
