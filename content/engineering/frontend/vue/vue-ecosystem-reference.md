---
title: Vue Ecosystem Broad Reference
description: Detailed Vue 3 examples for components, Pinia, composables, contracts, Storybook and testing.
type: reference
audience: People who need extended Vue ecosystem examples.
canonical: false
canonicalSource: /engineering/frontend/vue/
---

# Vue Ecosystem

> [!IMPORTANT]
> Prefer the progressive Vue path under [Vue](/engineering/frontend/vue/). This page keeps detailed examples.

Guide to using Vue 3 and its tools in the Flowsy ecosystem: Composition API, Pinia, composables, UI/API contracts, Storybook and testing.

## Operating Principles

- Treat the feature-set as the main unit of frontend change.
- Keep pages thin and focused on routing, layout composition and orchestration.
- Keep reusable interaction logic in composables and shared reactive state in Pinia only when it crosses component or route boundaries.
- Keep API DTOs, view models, navigation metadata, translations and pure logic explicit.
- Design loading, empty, error, disabled and success states before implementation is considered complete.
- Add automated tests as part of the design and implementation process, not as a final cleanup step.

## Recommended Flow Before Implementation

1. Identify the user flow, route, feature-set and affected API contracts.
2. Review existing components, stores, composables and tests in the same feature-set.
3. Decide which state belongs locally, which belongs in a composable and which belongs in a Pinia store.
4. Define UI states and validation behavior before coding the happy path.
5. Implement the smallest cohesive change and add tests that prove the behavior.
6. Run the project validation command and capture relevant evidence when the work is part of a spec.

## Recommended Skills for Vue

When working with AI agents that support skills, prefer a Vue or Nuxt UI skill when the task involves component composition, theme customization, forms, dashboards, documentation sites or design-system integration.

Use the skill to accelerate local framework usage, but keep repository conventions as the final source of truth. A skill should complement the guide; it should not override existing architecture, naming, tests or accessibility patterns.

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

### Component Rules

- Use `<script setup lang="ts">` in new components.
- Keep props and emits typed.
- Avoid hidden dependencies on global stores when props or events are enough.
- Keep templates readable; move formatting, filtering and branching logic into computed values or small helper functions.
- Model all meaningful UI states explicitly: loading, empty, error, unauthorized, disabled, dirty and saved.
- Do not introduce a component abstraction only because markup repeats once. Extract components when the concept is reusable or the parent becomes hard to scan.

## Visual Design by Component

Reusable components should document or exercise their visible states through Storybook or focused tests when the project supports them.

### What to Include

- Default state.
- Loading and disabled states.
- Empty state.
- Error state.
- Long text or overflow case.
- Permission or read-only state when relevant.

### Suggested Format

```text
📁 components/
└── 📁 shopping-cart-summary/
    ├── 📄 ShoppingCartSummary.vue
    ├── 📄 ShoppingCartSummary.model.ts
    ├── 📄 ShoppingCartSummary.stories.ts
    └── 📄 ShoppingCartSummary.specs.ts
```

### Example Folder

Use one folder per component when it has local model, stories, tests or assets. A very small component can remain as a single `.vue` file if the local convention allows it.

## Vue Feature-Set Structure

```text
📁 features/
└── 📁 shopping-cart/
    ├── 📁 components/
    ├── 📁 composables/
    ├── 📁 logic/
    ├── 📁 model/
    ├── 📁 routing/
    ├── 📁 stores/
    └── 📁 translation/
```

Use the folders that are useful for the feature. Do not create empty folders just to satisfy the example.

## Complete Vue Application Structure

### Small Application

For a small application, a single `routing.ts` file is enough to wire all routes:

```text
📁 src/
├── 📁 app/
│   ├── 📁 providers/
│   │   ├── 🔧 charts.ts
│   │   ├── 🔧 pinia.ts
│   │   └── 🔧 vuetify.ts
│   ├── 📁 styles/
│   │   ├── 🎨 base.css
│   │   └── 🎨 main.css
│   ├── 🧩 App.vue
│   ├── 📄 main.ts
│   └── 📄 routing.ts
└── 📁 features/
    ├── 📁 kernel/
    │   ├── 📁 components/
    │   ├── 📁 composables/
    │   ├── 📁 logic/
    │   ├── 📁 model/
    │   ├── 📁 routing/
    │   ├── 📁 stores/
    │   └── 📁 translation/
    └── 📁 shopping-cart/
        ├── 📁 components/
        ├── 📁 composables/
        ├── 📁 logic/
        ├── 📁 model/
        ├── 📁 routing/
        ├── 📁 stores/
        └── 📁 translation/
```

### Medium and Large Application

When routing grows, split it into a `routing/` directory with one file per feature-set:

```text
📁 src/
├── 📁 app/
│   ├── 📁 providers/
│   │   ├── 🔧 charts.ts
│   │   ├── 🔧 pinia.ts
│   │   └── 🔧 vuetify.ts
│   ├── 📁 routing/
│   │   ├── 📄 index.ts
│   │   ├── 📄 shopping-cart.routes.ts
│   │   └── 📄 user-profile.routes.ts
│   ├── 📁 styles/
│   │   ├── 🎨 base.css
│   │   └── 🎨 main.css
│   ├── 🧩 App.vue
│   └── 📄 main.ts
└── 📁 features/
    ├── 📁 kernel/
    │   ├── 📁 components/
    │   ├── 📁 composables/
    │   ├── 📁 logic/
    │   ├── 📁 model/
    │   ├── 📁 routing/
    │   ├── 📁 stores/
    │   └── 📁 translation/
    ├── 📁 shopping-cart/
    │   ├── 📁 components/
    │   ├── 📁 composables/
    │   ├── 📁 logic/
    │   ├── 📁 model/
    │   ├── 📁 routing/
    │   ├── 📁 stores/
    │   └── 📁 translation/
    └── 📁 user-profile/
        ├── 📁 components/
        ├── 📁 composables/
        ├── 📁 logic/
        ├── 📁 model/
        ├── 📁 routing/
        ├── 📁 stores/
        └── 📁 translation/
```

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

### Example Folder

```text
📁 stores/
└── 📁 shopping-cart/
    ├── 📄 shopping-cart.store.ts
    ├── 📄 shopping-cart.model.ts
    └── 📄 shopping-cart.specs.ts
```

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

### Example Folder

```text
📁 composables/
└── 📁 use-cart-operations/
    ├── 📄 useCartOperations.ts
    ├── 📄 useCartOperations.model.ts
    └── 📄 useCartOperations.specs.ts
```

## UI / API Contracts

Not every backend response needs to be mapped to a separate UI model. Applying an adapter layer as a blanket rule adds boilerplate without value. The right decision depends on whether the backend contract and the component's actual needs diverge — and that analysis is most effective when the project has defined and adopted a shared ubiquitous language from day one.

### Use the Backend Type Directly

When the API already uses the domain's language and the component needs the data in the same shape, type the response explicitly and pass it through. A ViewModel identical to the backend type adds noise without protection.

#### Example: country selector in an address form

```typescript
// model/Country.ts
export interface Country {
  id: string;
  name: string;
  isoCode: string;
}
```

A `<CountrySelector>` component that renders a dropdown list needs exactly `id`, `name` and `isoCode`. No formatting, no renaming, no derived fields. Creating a `CountryViewModel` that mirrors this structure serves no purpose.

The same applies to status catalogs, currency lists, timezone pickers and any other lookup data where the API response is already the right shape for the UI.

### Introduce a ViewModel and Adapter When Needed

The following scenarios justify the separation. In each case, the adapter concentrates a concern that would otherwise be scattered across templates, composables or stores — making it untestable and hard to change.

#### 1. Formatting values for display

The backend transmits raw values optimized for storage and transfer. Formatting logic does not belong in templates, and it should not be duplicated across multiple components.

```typescript
// model/InvoiceLine.ts

export interface InvoiceLineResponse {
  invoiceLineId: string;
  description: string;
  unitPriceUsd: number;
  quantity: number;
}

export interface InvoiceLineViewModel {
  id: string;
  description: string;
  formattedUnitPrice: string;   // "$12.50"
  quantity: number;
  formattedTotal: string;       // "$37.50" — derived and formatted
}

export function toInvoiceLineViewModel(dto: InvoiceLineResponse): InvoiceLineViewModel {
  const total = dto.unitPriceUsd * dto.quantity;
  return {
    id: dto.invoiceLineId,
    description: dto.description,
    formattedUnitPrice: formatCurrency(dto.unitPriceUsd),
    quantity: dto.quantity,
    formattedTotal: formatCurrency(total),
  };
}
```

This example also illustrates a combined case: the adapter renames (`invoiceLineId` → `id`), formats currency and derives `formattedTotal` from two raw fields — all in one place.

#### 2. Closing the gap between persistence and domain language

When the backend names fields after database columns or internal service conventions and the project has defined a different ubiquitous language, the adapter is the explicit translation point between both layers.

```typescript
// Backend response — persistence-oriented naming
export interface ProductListingResponse {
  skuCode: string;
  displayTitle: string;
  stockQty: number;
  listPriceUsd: number;
  isActiveFlag: boolean;
}

// UI model — domain-oriented naming agreed by the team
export interface ProductViewModel {
  sku: string;
  name: string;
  availableStock: number;
  price: number;
  isAvailable: boolean;
}
```

If this kind of gap is common in a project, it usually signals that the ubiquitous language was not applied consistently during backend design. When the team shares a common vocabulary across requirements, design sessions and code, most of these translations vanish naturally.

#### 3. Derived or computed fields

The backend sends the raw building blocks; the component needs values computed from them. Inline computation in templates or `computed` properties scatters logic that should live in one testable place.

```typescript
// model/Shipment.ts

export interface ShipmentResponse {
  origin: string;
  destination: string;
  scheduledAt: string;          // ISO-8601
  deliveredAt: string | null;
  totalWeightKg: number;
  totalVolumeM3: number;
}

export interface ShipmentViewModel {
  origin: string;
  destination: string;
  scheduledDate: string;        // "Jan 15, 2025"
  isDelivered: boolean;         // derived: deliveredAt !== null
  deliveryDate: string | null;  // formatted or null
  weightLabel: string;          // "12.5 kg"
  volumeLabel: string;          // "2.3 m³"
}
```

#### 4. Merging data from multiple endpoints

A single screen often needs data from two or more endpoints. The adapter creates the unified object the component binds to, keeping orchestration logic out of the template and the composable focused on data fetching.

```typescript
// Merges /orders/:id and /customers/:id into a single view object
export interface OrderDetailViewModel {
  orderId: string;
  orderDate: string;
  status: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  lines: OrderLineViewModel[];
}
```

#### 5. UI-only state combined with backend data

When a component needs to track per-item interaction state that does not exist in the backend response, the ViewModel is the right place to declare it.

```typescript
export interface ProductRowViewModel {
  id: string;
  name: string;
  formattedPrice: string;
  availableStock: number;
  isSelected: boolean;    // UI state — not from backend
  isExpanded: boolean;    // UI state — not from backend
}
```

Initializing `isSelected` and `isExpanded` to `false` inside the adapter keeps the store and components free of per-item initialization boilerplate.

#### 6. External or legacy APIs you do not control

When the API belongs to a third party or a legacy system with no planned migration, field names, types and structure may change without your team's involvement. The adapter acts as an anti-corruption layer: update one file when the external contract changes, and the rest of the frontend remains untouched.

### Ubiquitous Language as the Foundation

The scenarios above do not arise with equal frequency in every project. A team that defines a shared ubiquitous language at the start — and applies it consistently across requirements, domain model, backend responses and frontend types — naturally narrows the gap between the API contract and what the UI needs.

When the backend already uses `orderId`, `customerName`, `scheduledDate` and `availableStock` with the same vocabulary the team uses in design sessions, user stories and code reviews, many of the adapter scenarios above disappear. The remaining ones — formatting, derived fields, merged sources and external APIs — are structural and unavoidable regardless of how well-chosen the names are.

#### The Cost of Deferring This Analysis

A project that starts without a defined ubiquitous language tends to accumulate a different vocabulary in every layer: the database uses one naming convention, the backend API another, the frontend a third and the design documentation a fourth. Each of these gaps eventually becomes translation code. Adapters written to compensate for a language problem are not a solution — they are a symptom.

Invest in language alignment before writing the first endpoint. Define the terms the domain uses, make them explicit in the team's vocabulary and apply them from the database schema to the UI types. The result is less translation code, more readable interfaces and faster onboarding for every developer who joins after the first sprint.

### Example Folder `model/`

```text
📁 model/
├── 📄 InvoiceLine.ts     ← response type, view model and adapter in one file when small
└── 📄 index.ts
```

### Example Folder `routing/`

```text
📁 routing/
└── 📄 shopping-cart.routes.ts
```

### Example Folder `translation/`

```text
📁 translation/
├── 📄 en.ts
└── 📄 es.ts
```

### Example Folder `logic/`

```text
📁 logic/
├── 📄 calculate-cart-total.ts
└── 📄 calculate-cart-total.specs.ts
```

## Optional Features

Use these only when they solve a real problem in the feature-set:

- `routing/` for route definitions, guards or navigation metadata owned by the feature.
- `translation/` for localized labels and messages.
- `logic/` for pure functions that deserve direct unit tests outside Vue rendering.
- `adapters/` when DTO-to-view-model transformation becomes too large for `model/`.
- `assets/` when the feature owns images, fixtures or static resources.

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

## Final Verification

Before closing a Vue feature-set change:

- Run the repository's build or type-check command.
- Run the relevant component, composable, store or e2e tests.
- Verify loading, empty, error and success states.
- Check that text fits in the intended layouts.
- Check accessibility basics for interactive elements, labels and keyboard flow.
- Update stories or documentation when the component is reusable or visible in a design system.

## Cross Reference

- [Frontend Modular Architecture](../modular-architecture.md) — folder structure and feature-sets.
- [Vue 3 and TypeScript Conventions](./conventions.md) — naming, types and contracts.
- [Testing TypeScript and Vue](/quality/stacks/typescript-vue) — frontend testing strategy.
