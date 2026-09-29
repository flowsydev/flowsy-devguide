---
title: UI/API Contracts
description: Canonical criteria for direct HTTP contracts, ViewModels and adapters in frontend applications.
type: guide
audience: Frontend, API and architecture contributors and agents.
canonical: true
---

# UI/API Contracts

Use this guide to decide how an HTTP contract crosses into a user interface. The decision applies across frameworks. Preserve the meaning and ownership of each model, and add a mapping layer when it serves a visible need.

## Decision Criteria

| Situation | Decision |
| --- | --- |
| The UI uses the response without a meaningful transformation | Use the generated or declared contract type directly. |
| A screen combines several responses | Create a screen ViewModel and an adapter that composes them. |
| The UI needs formatted, selected, derived or renamed values | Adapt at the boundary and keep the transport DTO separate. |
| A legacy or external API defines unfamiliar terms | Use an adapter to protect the application's domain language. |
| A transformation enforces a business rule | Check whether it belongs in the backend or domain model. |

## Responsibilities

| Part | Responsibility |
| --- | --- |
| HTTP contract | Represent the request or response actually exchanged. |
| Adapter | Translate deterministically between the contract and the UI model. |
| ViewModel | Hold the data and visual state required by a screen or component. |
| Component | Render information and report interactions without depending on HTTP client details. |

Avoid a ViewModel that duplicates the HTTP contract field for field. When a difference exists, keep the transformation in a focused function or adapter with a representative test. Do not spread it across components, templates or stores.

## Decision Examples

| Case | Received Contract | UI Need | Decision |
| --- | --- | --- | --- |
| Product category selector | Category ID, name and code | Display the same values | Use the contract directly. |
| Order summary | Amounts, timestamps and status codes | Localized labels, formatted totals and visual status | Create a ViewModel and adapter. |
| Checkout review | Cart, customer, payment and shipment responses | One review screen | Compose a screen ViewModel. |
| External shipping provider catalog | Provider-specific names and types | Terms used by the shopping application | Translate through an adapter. |

## Application Sequence

1. Identify who owns the contract and how it changes.
2. Compare its meaning and shape with the data the UI requires.
3. Use the contract directly when there is no meaningful difference.
4. Introduce a ViewModel and adapter for composition, translation, formatting or additional visual state.
5. Check missing data, errors, temporal precision and public identifiers at the boundary.

An agent should inspect existing types before creating new ones, state the observable reason for an adapter and verify at least one representative mapping when behavior changes.

Apply [Ubiquitous Language](/foundations/ubiquitous-language), [Public Identifiers](/engineering/cross-cutting/identifiers), [Date and Time](/engineering/cross-cutting/date-and-time) and the [TypeScript](./typescript) profile when relevant.
