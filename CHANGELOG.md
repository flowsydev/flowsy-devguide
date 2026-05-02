# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
