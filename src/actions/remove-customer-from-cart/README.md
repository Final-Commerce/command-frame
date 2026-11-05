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

## Paid orders

Refused while the order in this cart has any payment on it — a split leg, a part payment, or paid in full: its items, amounts and customer can no longer be changed. The call rejects with `removeCustomerFromCart: this order already has a payment on it, so its items, amounts and customer can no longer be changed…` (or `… is paid`), and the cart is left as it was. Check `itemsLocked` from [`getCurrentCart`](../get-current-cart/README.md) to disable the control up front. To move on: [`releaseFromCart`](../release-from-cart/README.md) (saves the order as it is), finish paying, or void the order.

## Events

If a customer was assigned to the cart, publishes the removed customer on both the `cart` and `customers` channels:

| Channel     | Event                 | Payload                          |
| :---------- | :-------------------- | :------------------------------- |
| `cart`      | `customer-unassigned` | `{ customer: CFActiveCustomer }` |
| `customers` | `customer-unassigned` | `{ customer: CFActiveCustomer }` |

The `customers` publish above fires **three times** per call — once from the handler directly, once mirrored by the redux action-to-topic middleware off the `removeActiveCustomer` dispatch, and once more from the shared `handleRemoveCustomer` helper — so a `customers` subscriber's callback runs 3x for a single `removeCustomerFromCart()` call. The `cart` publish is unaffected and fires exactly once.

No events are published if no customer was assigned.

## Error Handling

None (always succeeds, even if no customer is assigned)

## Mock divergence

The standalone mock does not match the events above: it publishes a `customer-removed` event (not `customer-unassigned`) on the `cart` channel only (never `customers`), with an empty payload `{}` instead of `{ customer }`, and it fires unconditionally even if no customer was assigned.
