---
title: Bounded Contexts
description: Explicit boundaries where a model and its language keep a consistent meaning.
type: guide
audience: Domain, architecture, analysis and development people.
canonical: true
---

# Bounded Contexts

Use a Bounded Context to declare where a term, model and set of decisions keep a coherent meaning. The boundary expresses conceptual ownership; it does not automatically equal a repository, microservice, module or `Features/` folder.

## Key Decisions

- Name the context purpose in business language.
- Identify which team or group maintains its decisions.
- Make explicit how concepts translate when crossing the boundary.
- Choose integration after understanding autonomy, consistency and change pace.

For example, `Order` may represent a purchase intent in Sales and a fulfillment unit in Logistics. Sharing the name does not require sharing the same model.

Continue with [Aggregates](./aggregates) to model consistency inside a context. See the [broad reference](./domain-driven-design-reference) for additional examples.
