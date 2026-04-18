# Vue Conventions

Development guidelines for frontend applications with Vue 3 + Composition API in the Flowsy ecosystem.

## Naming

| Element | Convention | Example |
| --- | --- | --- |
| SFC Components | `PascalCase` | `ShoppingCartSummary.vue` |
| Composables | `camelCase` with `use` prefix | `useShoppingCart.ts` |
| Props and emits | `camelCase` | `cartId`, `onCartUpdated` |
| Stores (Pinia) | `camelCase` with `Store` suffix | `useCartStore` |
| Store files | `kebab-case` | `shopping-cart.ts` |
| Route files | `kebab-case` | `order-placement.ts` |

## Composition API

Always use `<script setup>` with Composition API. Avoid Options API in new code:

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import { useShoppingCart } from '../composables/use-shopping-cart';

const props = defineProps<{ cartId: string }>();
const emit = defineEmits<{ (e: 'cartUpdated', cartId: string): void }>();

const { cart, isLoading, addItem } = useShoppingCart(props.cartId);
const hasItems = computed(() => (cart.value?.totalItems ?? 0) > 0);
</script>
```

## Component Structure

Each component lives in its own folder with files separated by responsibility:

```
components/ShoppingCartSummary/
├── ShoppingCartSummary.vue          ← component SFC
├── ShoppingCartSummary.model.ts     ← props and emits interfaces
├── ShoppingCartSummary.lang.en.ts   ← English translations
├── ShoppingCartSummary.stories.ts   ← Storybook stories
├── ShoppingCartSummary.specs.ts     ← unit tests
└── index.ts                         ← public export
```

### ShoppingCartSummary.model.ts

```typescript
export interface ShoppingCartSummaryProps {
  cartId: string;
  readOnly?: boolean;
}

export interface ShoppingCartSummaryEmits {
  (e: 'itemRemoved', itemId: string): void;
}
```

## Composables

Encapsulate reusable domain logic with `ref`, `computed` and reactive functions:

```typescript
// use-shopping-cart/useShoppingCart.ts
export function useShoppingCart(cartId: string) {
  const cart = ref<ShoppingCartViewModel | null>(null);
  const isLoading = ref(false);

  async function addItem(productId: string, quantity: number) {
    // business logic
  }

  return { cart: readonly(cart), isLoading: readonly(isLoading), addItem };
}
```

Rules:
- Name always with `use` prefix.
- Return read-only references for internal state.
- Include unit tests (`useShoppingCart.specs.ts`).

## Pinia — Stores

Use Pinia for shared state between components of the same feature-set:

```typescript
// stores/shopping-cart/shopping-cart.ts
export const useCartStore = defineStore('shopping-cart', () => {
  const items = ref<CartItemViewModel[]>([]);
  const totalPrice = computed(() => items.value.reduce((sum, i) => sum + i.price, 0));

  function addItem(item: CartItemViewModel) {
    items.value.push(item);
  }

  return { items: readonly(items), totalPrice, addItem };
});
```

Rules:
- One store per domain concept within the feature-set.
- Include unit tests (`shopping-cart.specs.ts`).
- Do not access other feature-set stores directly; use events or props.

## Feature-Set Organization

Avoid global folders by technical type (`components/`, `stores/`) at the root. Group by feature-set to maintain domain cohesion.

```text
src/features/
├── kernel/                     ← shared by all feature-sets
│   ├── components/
│   ├── composables/
│   └── stores/
└── shopping-cart/
    └── shopping-cart/
        ├── components/
        ├── composables/
        ├── model/
        ├── router/
        ├── stores/
        └── translations/
```

For the complete folder structure, see [Vue Modular Architecture](../technologies/frontend/modular-architecture/concepts.md).

## Storybook and Testing

- Use Storybook as a testing and documentation tool for individual components.
- Critical components should have stories (`*.stories.ts`) and unit tests (`*.specs.ts`).
- Critical composables and stores should include unit tests (`*.specs.ts`).
- Domain logic (pure functions in `logic/`) should have unit tests.

## Separation of Concerns

| Layer | Responsibility |
| --- | --- |
| `components/` | Presentation and UI; no direct business logic |
| `composables/` | Reactive domain logic and use cases |
| `stores/` | State shared by multiple components |
| `logic/` | Pure functions without framework dependencies |
| `model/` | Types, interfaces and enums for the feature |
| `router/` | Feature-set route definitions |
| `translations/` | Localized texts and messages |
