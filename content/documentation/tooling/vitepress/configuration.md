---
title: VitePress Configuration
description: Installation, scripts, srcDir, metadata and essential plugins.
type: guide
audience: People who configure a VitePress site.
canonical: true
---

# VitePress Configuration

Install VitePress as a development dependency and declare explicit scripts:

```json
{
  "scripts": {
    "docs:dev": "vitepress dev",
    "docs:build": "vitepress build",
    "docs:preview": "vitepress preview"
  }
}
```

Define `srcDir`, title, description and navigation in `.vitepress/config.ts`. Add plugins only when they solve an observed need and verify compatibility with the static build.

In Flowsy DevGuide, public content lives under `content/`; `docs/` and `specs/` remain outside the public build.
