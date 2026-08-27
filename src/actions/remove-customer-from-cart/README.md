# removeCustomerFromCart

Removes the currently assigned customer from the cart.

## Parameters

None

## Response

```typescript
{
  success: boolean;
  timestamp: string;
}
```

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

// Remove customer from cart
await command.removeCustomerFromCart();
```

## Events

If a customer was assigned to the cart, publishes the removed customer on both the `cart` and `customers` channels:

| Channel     | Event                 | Payload                                      |
| :---------- | :--------------------- | :-------------------------------------------- |
| `cart`      | `customer-unassigned` | `{ customer: CFActiveCustomer }`             |
| `customers` | `customer-unassigned` | `{ customer: CFActiveCustomer }`             |

The `customers` publish above fires **three times** per call — once from the handler directly, once mirrored by the redux action-to-topic middleware off the `removeActiveCustomer` dispatch, and once more from the shared `handleRemoveCustomer` helper — so a `customers` subscriber's callback runs 3x for a single `removeCustomerFromCart()` call. The `cart` publish is unaffected and fires exactly once.

No events are published if no customer was assigned.

## Error Handling

None (always succeeds, even if no customer is assigned)

## Mock divergence

The standalone mock does not match the events above: it publishes a `customer-removed` event (not `customer-unassigned`) on the `cart` channel only (never `customers`), with an empty payload `{}` instead of `{ customer }`, and it fires unconditionally even if no customer was assigned.

