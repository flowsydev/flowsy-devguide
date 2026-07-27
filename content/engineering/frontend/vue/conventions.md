---
title: Vue 3 and TypeScript Conventions
description: Strict typing, contracts, naming and maintainable Vue code conventions.
type: profile
audience: Vue 3 and TypeScript developers.
canonical: true
canonicalSource: /engineering/frontend/modular-architecture
---

# Vue 3 and TypeScript Conventions

Use this page with the [progressive Vue path](/engineering/frontend/vue/).

Coding guidelines for Vue 3 frontend projects with Composition API and strict TypeScript within the Flowsy ecosystem.

Business names in TypeScript and Vue components should follow the ubiquitous language chosen for the project or Bounded Context. Keep technical terms such as `interface`, `type`, `DTO`, `ViewModel`, `component`, `props`, `emits`, `Composable`, `Store`, `Adapter`, `Storybook`, `Pinia` and framework names in English. For example, use `PedidoClienteViewModel` instead of `PedidoClienteModeloVista`, and `usePedidoClienteStore` instead of `usarAlmacenPedidoCliente`.

## Naming

For Spanish identifiers, use compact domain names when articles or prepositions do not add meaning. Prefer `PedidoClienteViewModel`, `useAsignacionDireccionEnvio` and `idPedidoCliente` over `PedidoDeClienteViewModel`, `useAsignacionDeDireccionDeEnvio` and `idPedidoDeCliente`. Keep the natural phrase in UI labels, report titles and translations.

| Element | Convention | Example |
| --- | --- | --- |
| Types and interfaces | `PascalCase` | `ShoppingCartSummary`, `UserProfile` |
| Classes | `PascalCase` | `ShoppingCartAdapter` |
| Functions and methods | `camelCase` | `fetchCartItems`, `formatCurrency` |
| Variables and parameters | `camelCase` | `shoppingCartId`, `totalPrice` |
| Module constants | `UPPER_SNAKE_CASE` | `MAX_ACTIVE_CONTRACTS`, `API_BASE_URL` |
| Enums | `PascalCase` (members in `PascalCase`) | `LifecycleStatus.Active` |
| Composables | `camelCase` with `use` prefix | `useShoppingCart`, `useUserSession` |
| SFC Components | `PascalCase` | `ShoppingCartSummary.vue` |
| Props and emits | `camelCase` | `cartId`, `onCartUpdated` |
| Stores (Pinia) | `camelCase` with `Store` suffix | `useCartStore` |
| Store files | `kebab-case` | `shopping-cart.ts` |
| Route files | `kebab-case` | `shopping-cart-checkout.ts` |

## Example Names and Real Artifacts

This page mixes real Vue, TypeScript and JavaScript artifacts with illustrative project names:

- Real language or ecosystem artifacts include `interface`, `type`, `Date`, `Intl.DateTimeFormat`, `Temporal`, Vue Single-File Components, Pinia, Storybook, props and emits.
- Sample project names include `ShoppingCartSummary`, `ShoppingCartResponse`, `CartItemViewModel`, `ShoppingCartAdapter`, `useShoppingCart`, `AppointmentRequest` and `shopping-cart.ts`.
- Folder names such as `components/`, `composables/`, `stores/`, `logic/`, `model/`, `routing/` and `translation/` are recommended conventions for projects using this guide, not framework-mandated names.

Adapt sample domain names to the project's ubiquitous language and keep real framework names unchanged.

## Strict Typing

Configure `tsconfig.json` with strict mode:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

## Types and Contracts

Explicitly type all contracts; avoid `any` except in justified cases:

```typescript
export interface ShoppingCartResponse {
  shoppingCartId: string;
  totalItems: number;
  totalPrice: number;
  items: CartItemResponse[];
}

// UI model (may differ from the API DTO)
export interface CartItemViewModel {
  id: string;
  productName: string;
  formattedPrice: string;
  quantity: number;
}
```

## UI / API Contracts

- Explicitly type request/response contracts.
- Centralize adapters to map backend DTOs to UI models:

```typescript
// adapters/shoppingCart.adapter.ts
export function toCartItemViewModel(dto: CartItemResponse): CartItemViewModel {
  return {
    id: dto.shoppingCartItemId,
    productName: dto.productName,
    formattedPrice: formatCurrency(dto.totalPrice),
    quantity: dto.quantity,
  };
}
```

- Do not couple presentation components to raw backend payloads.

## Dates and Times

For normative temporal policy, prefer [Date and Time](/engineering/cross-cutting/date-and-time). Local Vue application notes follow.

- Treat JavaScript `Date` as an instant. Its internal value is timestamp-like, but formatting usually uses the browser's local time zone.
- Consume and send global instants as ISO-8601 strings with `Z` or explicit offset.
- Convert instants to the target presentation time zone only when rendering.
- Do not treat a database canonical-zone value as a browser-local `Date`. If the backend uses a canonical system time-zone persistence strategy, the API should still send UTC, an explicit offset or a local value plus `timeZoneId`.
- Do not store ambiguous date/time values in UI state as `Date` objects when they represent local business intent.
- For local appointments, schedules or future recurring events, keep the local date/time and IANA time-zone identifier together until the backend or domain logic resolves them.
- Do not use the browser's current offset as a substitute for a real time zone. Future offsets can change because of daylight-saving rules or legal changes.
- Do not trust the browser clock as the source of truth for creation, signing, expiration, ordering or audit decisions. Ask the backend to resolve those values with the application's authoritative clock.

```typescript
// Correct: preserve ISO-8601 string from backend
const creationInstant: string = response.creationInstant; // "2024-01-15T10:30:00-06:00"

// Only convert when displaying
const displayDate = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(
  new Date(creationInstant)
);
```

For local business input, model the contract explicitly:

```typescript
export interface AppointmentRequest {
  scheduledDateTime: string; // "2026-07-01T10:00:00"
  timeZoneId: string;        // "America/Mexico_City"
}
```

Use modern date/time libraries when the feature has serious time-zone behavior. Prefer `Temporal` when it is available in the target environment or polyfilled deliberately; otherwise evaluate libraries such as Luxon, date-fns-tz or Day.js with the required plugins.

## Validation and Accessibility

- Validate critical data both on client and server.
- Include error, loading and empty states per component.
- Ensure minimum accessibility:
  - Keyboard navigation (`tabindex`, `@keydown`).
  - Labels associated with inputs (`<label for="...">` or `aria-label`).
  - Sufficient color contrast (WCAG AA minimum).
  - `aria-*` attributes on interactive components without native HTML semantics.

## Type Organization by Module

Within each feature-set, types are located in the `model/` folder:

```text
📁 features/shopping-cart/model/
├── 📄 ShoppingCart.ts        ← main interfaces
├── 📄 CartItem.ts
├── 📄 CartStatus.ts          ← enums
└── 📄 index.ts               ← re-exports everything
```

## Separation of Responsibilities

| Layer | Responsibility |
| --- | --- |
| `components/` | Presentation and UI; no direct business logic |
| `composables/` | Reactive domain logic and use cases |
| `stores/` | State shared by multiple components |
| `logic/` | Pure functions without framework dependencies |
| `model/` | Types, interfaces and enums for the feature |
| `routing/` | Feature-set route definitions |
| `translation/` | Localized texts and messages |

## Cross Reference

For feature-set organization and folder structure, see [Frontend Modular Architecture](../modular-architecture.md). For Vue 3, Pinia, composables, Storybook and testing patterns, see [Vue Ecosystem](./vue-ecosystem-reference).
