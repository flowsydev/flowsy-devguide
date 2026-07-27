---
title: Documentation Contribution
description: Flow for creating, moving and validating public Flowsy DevGuide pages.
type: guide
audience: People who contribute content to the guide.
canonical: true
---

# Documentation Contribution

Use this flow so content, navigation and operational documents evolve together.

## Location

| Intent | Area |
| --- | --- |
| Model the domain | `content/foundations/` |
| Create artifacts or documentation tooling | `content/documentation/` |
| Design or implement solutions | `content/engineering/` |
| Define tests and evidence | `content/quality/` |
| Collaborate with agents | `content/ai-assisted-development/` |
| Establish shared rules | `content/conventions/` |

`docs/` and `specs/` are internal and are not part of the public site.

## Flow

1. Declare intent, audience and related canonical source.
2. Use the [frontmatter contract](/conventions/documentation-governance#frontmatter-contract).
3. Register the page in the contextual sidebar and link it from a landing page.
4. If you move a route, keep a `type: redirect` bridge without duplicating content.
5. Update `CHANGELOG.md` when the change is visible to readers.
6. Run:

```bash
npm run docs:validate
npm run docs:build
git diff --check
```

Do not edit `.vitepress/dist/`. Use open-source and general-community examples, and keep titles and navigation in Title Case.
