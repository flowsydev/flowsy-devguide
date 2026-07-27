---
title: Local Repository Documentation
description: Location and responsibility of instructions, ADRs, operations, troubleshooting and local specs.
type: guide
audience: People who design or maintain documentation close to the code.
canonical: true
---

# Local Repository Documentation

Use `docs/` for durable system-specific knowledge and `docs/specs/` (or `specs/` in documentation repositories) for the work record that coordinates changes. Keep `AGENTS.md` and equivalent files focused on operational instructions for collaborators and agents.

| Artifact | Responsibility |
| --- | --- |
| `README.md` | Operational entry point. |
| `AGENTS.md` | Minimum rules and context for executing tasks. |
| `CHANGELOG.md` | Visible changes by version or delivery. |
| `docs/` | Architecture, operations, contracts and troubleshooting. |
| `docs/specs/` or `specs/` | Requirements, analysis, plans, execution and change summary. |

Each document should state its audience, validity and related canonical source. Avoid copying DevGuide policies; link them and document only the local adaptation.
