---
title: Visual Design and Storybook
description: Wireframes, states, stories and visual traceability next to the component.
type: profile
audience: Design, frontend, product and quality people.
canonical: true
canonicalSource: /engineering/frontend/vue/components
---

# Visual Design and Storybook

Keep the visual artifact near the component when it helps collaboration and traceability. Include empty, loading, error, with-data and disabled states when they apply.

```text
📁 shopping-cart-summary/
├── 📄 ShoppingCartSummary.vue
├── 📄 ShoppingCartSummary.model.ts
├── 📄 ShoppingCartSummary.excalidraw
├── 📄 ShoppingCartSummary.stories.ts
└── 📄 ShoppingCartSummary.specs.ts
```

Stories document observable variants and enable isolated review; they do not replace integration or end-to-end tests. Link relevant visual decisions and acceptance criteria without copying their full text.

Detailed guidance remains in the [Vue ecosystem reference](./vue-ecosystem-reference#visual-design-by-component).
