# Vue Ecosystem

Guide to using Vue 3 and its tools in the Flowsy ecosystem: Composition API, Pinia, composables, UI/API contracts, Storybook and testing.

## Vue 3 + Composition API

Always use **Vue 3 with Composition API** and `<script setup>`. Avoid Options API in new code.

```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { ShoppingCartProps } from './ShoppingCart.model';

const props = defineProps<ShoppingCartProps>();
const emit = defineEmits<{ (e: 'itemAdded', itemId: string): void }>();

const isLoading = ref(false);
const itemCount = computed(() => props.cart?.totalItems ?? 0);

onMounted(async () => {
  // component initialization
});
</script>

<template>
  <div class="shopping-cart" :aria-busy="isLoading">
    <span>{{ itemCount }} items</span>
  </div>
</template>
```

### Composition API Advantages

- Greater cohesion: related logic grouped in the same block.
- Better reuse through composables.
- More natural TypeScript integration.
- No `this` issues in callbacks.

## Pinia — Reactive State

Use Pinia for shared state between components. Prefer the **Composition Store API** over the Options API:

```typescript
// stores/shopping-cart/shopping-cart.ts
import { defineStore } from 'pinia';
import { ref, computed, readonly } from 'vue';
import type { CartItemViewModel } from '../../model/CartItem';

export const useCartStore = defineStore('shopping-cart', () => {
  const items = ref<CartItemViewModel[]>([]);
  const isLoading = ref(false);

  const totalItems = computed(() => items.value.length);
  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + item.subtotal, 0)
  );

  async function loadCart(cartId: string): Promise<void> {
    isLoading.value = true;
    try {
      // call the data access composable
    } finally {
      isLoading.value = false;
    }
  }

  function addItem(item: CartItemViewModel): void {
    items.value.push(item);
  }

  return {
    items: readonly(items),
    isLoading: readonly(isLoading),
    totalItems,
    totalPrice,
    loadCart,
    addItem,
  };
});
```

### Store Rules

- One store per domain concept within the feature-set.
- Return references with `readonly()` to prevent direct mutations from components.
- Do not import stores from other feature-sets directly; use `kernel` or props/events.
- Include unit tests (`shopping-cart.specs.ts`).

## Composables

Composables encapsulate reactive domain logic and frontend use cases:

```typescript
// composables/use-cart-operations/useCartOperations.ts
import { ref, readonly } from 'vue';
import { useCartStore } from '../../stores/shopping-cart';
import { useCartApiClient } from '../use-cart-api-client';

export function useCartOperations() {
  const cartStore = useCartStore();
  const apiClient = useCartApiClient();
  const error = ref<string | null>(null);

  async function addItem(productId: string, quantity: number): Promise<void> {
    error.value = null;
    try {
      const result = await apiClient.addItem(productId, quantity);
      cartStore.addItem(result);
    } catch (e) {
      error.value = 'Could not add the item. Please try again.';
    }
  }

  return {
    error: readonly(error),
    addItem,
  };
}
```

### Composable Rules

- Name with `use` prefix: `useShoppingCart`, `useUserSession`.
- Return state as `readonly` when it is internal to the composable.
- Separate API access (infrastructure composable) from domain logic (business composable).
- Include unit tests (`useCartOperations.specs.ts`).

## UI / API Contracts

Centralize the transformation between backend DTOs and UI models:

```typescript
// model/CartItem.ts
export interface CartItemResponse {      // Backend DTO
  shoppingCartItemId: string;
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface CartItemViewModel {     // UI Model
  id: string;
  productName: string;
  formattedPrice: string;
  quantity: number;
  subtotal: number;
}

// adapters/cartItem.adapter.ts
export function toCartItemViewModel(dto: CartItemResponse): CartItemViewModel {
  return {
    id: dto.shoppingCartItemId,
    productName: dto.productName,
    formattedPrice: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
      .format(dto.productPrice),
    quantity: dto.quantity,
    subtotal: dto.totalPrice,
  };
}
```

Do not pass raw backend DTOs to presentation components.

## Storybook

Use Storybook as a development, documentation and visual testing tool for individual components:

```typescript
// ShoppingCartSummary.stories.ts
import type { Meta, StoryObj } from '@storybook/vue3';
import ShoppingCartSummary from './ShoppingCartSummary.vue';

const meta: Meta<typeof ShoppingCartSummary> = {
  component: ShoppingCartSummary,
  title: 'Shopping Cart / ShoppingCartSummary',
};

export default meta;
type Story = StoryObj<typeof ShoppingCartSummary>;

export const WithItems: Story = {
  args: {
    cartId: 'cart-123',
    totalItems: 3,
    totalPrice: 1250.50,
  },
};

export const Empty: Story = {
  args: {
    cartId: 'cart-456',
    totalItems: 0,
    totalPrice: 0,
  },
};
```

### When to Write Stories

- Reusable UI components (especially in `kernel`).
- Components with multiple visible states (empty, loading, error, with data).
- Business-critical components.

## Testing

### Components (`.specs.ts`)

```typescript
// ShoppingCartSummary.specs.ts
import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import ShoppingCartSummary from './ShoppingCartSummary.vue';

describe('ShoppingCartSummary', () => {
  it('displays the number of items', () => {
    const wrapper = mount(ShoppingCartSummary, {
      props: { cartId: 'cart-1', totalItems: 5, totalPrice: 500 }
    });
    expect(wrapper.text()).toContain('5');
  });

  it('displays a message when the cart is empty', () => {
    const wrapper = mount(ShoppingCartSummary, {
      props: { cartId: 'cart-1', totalItems: 0, totalPrice: 0 }
    });
    expect(wrapper.text()).toContain('empty');
  });
});
```

### Composables (`.specs.ts`)

```typescript
// useCartOperations.specs.ts
import { describe, it, expect, vi } from 'vitest';
import { useCartOperations } from './useCartOperations';

describe('useCartOperations', () => {
  it('adds an item successfully', async () => {
    // mock the API client
    const { addItem, error } = useCartOperations();
    await addItem('product-1', 2);
    expect(error.value).toBeNull();
  });
});
```

### Testing Strategy

| Artifact | Test Type | Tool |
| --- | --- | --- |
| Components | Unit + visual | Vitest + Storybook |
| Composables | Unit | Vitest |
| Stores | Unit | Vitest |
| Pure logic (`logic/`) | Unit | Vitest |

## Cross Reference

- [Modular Architecture: Concepts](./concepts.md) — folder structure and feature-sets.
- [Vue Conventions](../../../conventions/vue.md) — naming and code patterns.
- [TypeScript Conventions](../../../conventions/typescript.md) — types and contracts.
