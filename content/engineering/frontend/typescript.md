---
title: TypeScript for Frontend
description: Language profile for strict typing, contracts, naming and temporal values in frontend applications.
type: profile
audience: Contributors and agents implementing frontend applications with TypeScript.
canonical: true
canonicalSource: /engineering/frontend/
---

# TypeScript for Frontend

Apply this profile after defining the framework-independent architecture and UI/API contracts. TypeScript provides static checks and explicit types; component boundaries, state ownership and routing remain separate design decisions.

## Strict Typing

Enable the strict checks supported by the project and avoid `any` except at a justified, contained boundary. This is representative configuration; adapt it to the repository's TypeScript version and tools:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

## Names and Contracts

Use the context's ubiquitous language for types, functions and variables. Keep established TypeScript terms unchanged. These names illustrate a shopping application; adapt them to the project.

| Element | Convention | Example |
| --- | --- | --- |
| Types, interfaces, classes and enums | `PascalCase` | `ShoppingCartSummary` |
| Functions, methods, variables and parameters | `camelCase` | `fetchShoppingCart` |
| Module constants | `UPPER_SNAKE_CASE` | `MAX_CART_ITEMS` |

Type request and response contracts explicitly. Keep the transport contract distinct from the UI model when their meanings differ. Use [UI/API Contracts](./ui-api-contracts) to decide when a ViewModel and adapter are warranted.

## Type Organization

Keep feature-owned types near the behavior they describe. Move them to a shared module only when several features consume the same concept and share its change cycle.

```text
features/shopping-cart/model/
├── ShoppingCart.ts
├── CartItem.ts
├── ShoppingCartStatus.ts
└── index.ts
```

## Date and Time

- Preserve HTTP instants as ISO 8601 strings with `Z` or an explicit offset when they must be sent onward without loss.
- Convert an instant to the presentation time zone when rendering it.
- Keep a future local business date and time together with an IANA time-zone identifier until it is resolved to an instant.
- Do not use the browser clock as authority for auditing, expiration or causal order.
- Remember that JavaScript `Date` stores milliseconds and can lose precision supplied by a backend or database.

This example distinguishes a payment capture instant from a delivery appointment that still needs a time zone:

```typescript
const capturedAt: string = response.capturedAt; // "2026-09-13T08:30:00-06:00"
const paymentLabel = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'America/Chicago',
}).format(new Date(capturedAt));

export interface DeliveryAppointmentRequest {
  scheduledLocalDateTime: string; // "2026-09-15T10:00:00"
  timeZoneId: string;              // "America/Chicago"
}
```

The complete policy belongs to [Date and Time](/engineering/cross-cutting/date-and-time). A framework integration does not change the value's semantics.

## Agent Application

Before changing code, inspect the actual TypeScript configuration, runtime version, framework and local conventions. Preserve existing contracts, introduce adapters for real transformations and run the repository's lint, typecheck and test commands. Names and paths on this page are examples rather than required APIs.

## References

- [Modular Frontend Architecture](./modular-architecture).
- [UI/API Contracts](./ui-api-contracts).
- [Vue](./vue/) for the available framework profile.
- [TypeScript and Vue Quality](/quality/stacks/typescript-vue).
