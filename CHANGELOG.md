# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
