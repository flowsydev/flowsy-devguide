---
title: UI/API Contracts
description: Canonical decision for using direct contracts, ViewModels or adapters in frontend.
type: guide
audience: Frontend, API and architecture people.
canonical: true
---

# UI/API Contracts

The frontend should neither create a ViewModel by reflex nor always couple to the HTTP contract. Decide according to semantic and lifecycle difference.

| Situation | Decision |
| --- | --- |
| UI consumes the contract without relevant transformation | Use the generated or shared type directly. |
| Screen combines several responses | Create a screen ViewModel and an adapter. |
| UI needs different format, selection or names | Adapt at the boundary; keep the original DTO separate. |
| Transformation expresses a business rule | Review whether it belongs to the backend or a domain source, not the component. |

Use [Ubiquitous Language](/foundations/ubiquitous-language), [Public Identifiers](/engineering/cross-cutting/identifiers) and [Date and Time](/engineering/cross-cutting/date-and-time). Keep components free of HTTP client details.

Detailed scenarios remain in the [Vue ecosystem reference](./vue-ecosystem-reference#ui-api-contracts).
