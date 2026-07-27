---
title: Adopting the DevGuide
description: Short path for integrating Flowsy DevGuide into onboarding and project decisions.
type: guide
audience: Teams starting or aligning a technical solution.
canonical: true
---

# Adopting the DevGuide

Flowsy DevGuide is a reference, not a single solution. Each team evaluates its recommendations against the real domain, risks, constraints and goals.

## Minimum Adoption

1. Define the [Ubiquitous Language](/foundations/ubiquitous-language).
2. Link the DevGuide from `README.md` and agent instructions.
3. Select only the Engineering and Quality routes relevant to the stack.
4. Record decisions and exceptions in the project's local documentation.
5. Keep secrets, tokens and credentials out of versioned files.

For private repositories, configure credentials with least privilege in each tool without documenting their values. See [Repository Documentation](./repositories/) for README, agent instructions and local docs conventions, including safe dependency validation practices.
