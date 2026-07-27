---
title: Artifact Organization
description: Criteria for structuring documentation by discipline, context and language without rigid hierarchies.
type: guide
audience: People who maintain project documentation.
canonical: true
---

# Artifact Organization

Start with folders by discipline and subdivide by Bounded Context, module or functional aspect only when volume justifies it.

```text
📁 docs/
├── 📁 strategy/
├── 📁 analysis/
├── 📁 architecture/
├── 📁 delivery/
└── 📁 validation/
```

## Rules

- Keep folder names stable and technical; translate visible titles.
- Do not use the physical structure as a substitute for traceability.
- Avoid duplicating the same artifact by language. Choose one language strategy per project.
- Keep operational specs separate from durable product documentation.
- Add indexes when a folder has three or more reading paths.

See [Identifiers and Traceability](./identifiers-and-traceability) to relate artifacts and [Writing Guidelines](/conventions/writing-guidelines) for style.
