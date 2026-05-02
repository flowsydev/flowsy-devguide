---
title: Agent Context Routing
description: How to select the smallest useful context guide for an AI-assisted development task.
---

# Agent Context Routing

Context routing helps agents read the right guide for the task without loading the entire DevGuide every time.

## General Rule

Start with the user request and route to the smallest guide that can answer it. Add broader references only when the task crosses boundaries.

## Routing Matrix

| Intent | Start With |
| --- | --- |
| Create or improve repository instructions | [Repository Agent Instructions](./context-guides/repository-agent-instructions.md) |
| Plan work with requirements, analysis and execution evidence | [Specs-Driven Development](./context-guides/specs-driven-development.md) |
| Implement a C# backend slice or Minimal API | [Backend VSA with Minimal APIs](./context-guides/backend-vsa-minimal-api.md) |
| Design or revise HTTP API contracts, status codes or error responses | [Backend VSA with Minimal APIs](./context-guides/backend-vsa-minimal-api.md) + [Official References](./official-references.md) |
| Implement a Vue feature-set | [Frontend Vue Feature-Set](./context-guides/frontend-vue-feature-set.md) |
| Change PostgreSQL schemas, routines or migrations | [PostgreSQL and Migrations](./context-guides/postgres-migrations.md) |
| Create durable project documentation | [Project Documentation](./context-guides/project-documentation-artifact.md) |
| Choose verification strategy | [Testing](/technologies/testing/) |

## Common Combinations

| Work | Combine |
| --- | --- |
| Backend endpoint with database changes | Backend VSA + PostgreSQL and Migrations + Testing |
| Vue screen backed by a new API contract | Frontend Vue Feature-Set + Backend VSA + Project Documentation |
| Large refactor or feature delivery | Specs-Driven Development + relevant stack guide + Testing |
| Repository onboarding improvements | Repository Agent Instructions + Repository Documentation |

## Progressive Reading Criteria

1. Read the routing page.
2. Read the one context guide that matches the task.
3. Open the referenced DevGuide sections only when the task needs more detail.
4. Inspect repository-local instructions and existing code before changing files.
5. Validate with commands that already exist in the repository.

## Limits

Do not use routing as a substitute for engineering judgment. If the repository conflicts with a generic guide, prefer the repository's established pattern unless it is clearly broken or unsafe.
