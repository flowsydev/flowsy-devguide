---
title: Repository README
description: Minimum content to install, run, validate and locate deeper documentation.
type: guide
audience: People who maintain a repository entry point.
canonical: true
---

# Repository README

The `README.md` is the operational entry point. Prioritize what a person needs to understand the purpose, prepare the environment, run and validate the project.

## Recommended Content

- purpose and scope;
- stack and prerequisites;
- installation, execution and validation;
- local configuration without secret values;
- relevant structure;
- links to architecture, operations, specs and DevGuide;
- status or limitations that affect usage.

Do not copy full architecture, decision logs or cross-cutting policies. Link deeper guides and keep only repository-specific decisions in the README. For dependency trust concerns, follow the safe validation practices in the [repository documentation reference](./repository-documentation-reference#safe-dependency-validation).
