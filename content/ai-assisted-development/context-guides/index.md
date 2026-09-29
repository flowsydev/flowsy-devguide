---
title: Agent Context Guides
description: Focused guides for giving AI agents the minimum useful context by type of work.
---

# Agent Context Guides

These guides are short operational entry points for AI agents and developers. Use them to select references, boundaries and validation expectations before implementation.

## Available Guides

| Guide | Use It For |
| --- | --- |
| [Backend VSA with Minimal APIs](./backend-vsa-minimal-api.md) | C# Minimal API slices, handlers, validation, mediation and persistence boundaries. |
| [Frontend Vue Feature-Set](./frontend-vue-feature-set.md) | Apply frontend architecture and contracts when creating Vue 3 components, composables, stores, feature-sets or tests. |
| [PostgreSQL and Migrations](./postgres-migrations.md) | Schema changes, routines, migration scripts and `flwdb` usage. |
| [Project Documentation](./project-documentation-artifact.md) | Needs, requirements, use cases, ADRs, contracts, PBIs and validation artifacts. |
| [Repository Agent Instructions](./repository-agent-instructions.md) | `AGENTS.md`, Copilot instructions, Claude guidance and local agent rules. |
| [Specs-Driven Development](./specs-driven-development.md) | Requirements, analysis, plan, execution evidence and summaries under `docs/specs/`. |

## Usage Rule

Read one guide first, then open only the references it names. This keeps agent work focused and makes review easier.

## Decision Sequence for Agents

1. Choose an initial source by task intent in [Agent Context Routing](/ai-assisted-development/agent-routing).
2. Read the technology-independent design guidance before selecting an implementation profile.
3. Inspect repository-local instructions, existing code and dependencies.
4. Use the C#, Python, TypeScript or Vue profile only when the task needs that implementation detail.
5. Validate the resulting behavior and record any deliberate local deviation.
