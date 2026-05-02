# TypeScript Conventions

Coding guidelines for frontend projects in TypeScript within the Flowsy ecosystem.
The target standard is Vue 3 + Composition API + strict TypeScript.

## Naming

| Element | Convention | Example |
| --- | --- | --- |
| Types and interfaces | `PascalCase` | `ShoppingCartSummary`, `UserProfile` |
| Classes | `PascalCase` | `ShoppingCartAdapter` |
| Functions and methods | `camelCase` | `fetchCartItems`, `formatCurrency` |
| Variables and parameters | `camelCase` | `shoppingCartId`, `totalPrice` |
| Module constants | `UPPER_SNAKE_CASE` | `MAX_CART_ITEMS`, `API_BASE_URL` |
| Enums | `PascalCase` (members in `PascalCase`) | `LifecycleStatus.Active` |
| Composables | `camelCase` with `use` prefix | `useShoppingCart`, `useUserSession` |

## Types and Contracts

Explicitly type all contracts; avoid `any` except in justified cases:

```typescript
// API response contract
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

```
📁 features/shopping-cart/shopping-cart/model/
├── 📄 ShoppingCart.ts        ← main interfaces
├── 📄 CartItem.ts
├── 📄 CartStatus.ts          ← enums
└── 📄 index.ts               ← re-exports everything
```

## Cross Reference

For feature-set organization and folder structure, see [Vue Modular Architecture](../technologies/frontend/modular-architecture/concepts.md).
