# Vue 3 and TypeScript Conventions

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

- Consume and send dates in ISO-8601 format with timezone.
- Convert to local timezone only when rendering.
- Do not store dates in UI state as `Date` objects without timezone.

```typescript
// Correct: preserve ISO-8601 string from backend
const creationInstant: string = response.creationInstant; // "2024-01-15T10:30:00-06:00"

// Only convert when displaying
const displayDate = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(
  new Date(creationInstant)
);
```

## Validation and Accessibility

- Validate critical data both on client and server.
- Include error, loading and empty states per component.
- Ensure minimum accessibility:
  - Keyboard navigation (`tabindex`, `@keydown`).
  - Labels associated with inputs (`<label for="...">` or `aria-label`).
  - Sufficient color contrast (WCAG AA minimum).
  - `aria-*` attributes on interactive components without native HTML semantics.

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

For feature-set organization and folder structure, see [Frontend Modular Architecture](../modular-architecture.md). For Vue 3, Pinia, composables, Storybook and testing patterns, see [Vue Ecosystem](./ecosystem.md).
