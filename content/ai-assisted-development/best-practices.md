---
title: Best Practices
description: General practices for working with AI agents, skills and repository instructions.
---

# Best Practices

Use AI assistants as collaborators that can accelerate analysis, implementation and review, but keep human ownership over intent, risk and final acceptance.

## Context and Scope

- Give the agent the smallest useful context: repository instructions, the relevant guide, target files and acceptance criteria.
- Prefer concrete tasks over broad prompts. State what should change, what must stay untouched and how the result will be verified.
- Keep repository instructions versioned in files such as `AGENTS.md`, `.github/copilot-instructions.md` or equivalent project guidance.
- Reference Flowsy DevGuide sections by title and purpose; do not depend on deep anchors as permanent identifiers.

## Recommended Skills by Stack

- Use backend guidance for C#/.NET, Minimal APIs, Vertical Slice Architecture, database access and mediation.
- Use frontend guidance for Vue, TypeScript, composables, stores and component tests.
- Use migration guidance for PostgreSQL schemas, routines, Evolve, Flyway and `flwdb`.
- Use documentation guidance when the task changes README files, specs, ADRs, contracts or project documentation artifacts.

## Delegation and Coordination

- Delegate only bounded work that can be executed independently or in parallel.
- Keep tightly coupled design and implementation decisions in the main thread.
- Define ownership when multiple agents or people work in the same repository.
- Ask agents to report changed files, validation commands and any assumptions they made.

## Security and Permissions

- Start from least privilege and the smallest useful toolset.
- Require explicit approval before destructive operations, publishing, credential access or production-impacting commands.
- Never paste secrets, tokens or private keys into prompts, specs, logs or committed files.
- Prefer local credentials helpers, environment variables and ignored local files over hard-coded configuration.

## Quality and Validation

- Treat AI output as draft work until reviewed and validated.
- Run the smallest relevant verification first, then broaden when the change touches shared contracts or cross-cutting behavior.
- For code changes, inspect the diff before accepting it.
- For documentation, verify terminology, links, examples and command names.
- Record important validation results in specs, PRs or summaries without copying full logs.

## Writing and Terminology

- Write Flowsy documentation in English by default.
- Keep code identifiers, package names and command prefixes aligned with Flowsy conventions: `Flowsy.*`, `flw`, `flw-` and `flwdb`.
- Use Spanish only for domain terms that are intrinsically Mexican or legal/business-specific, such as CURP or RFC.
