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

No events are published if no customer was assigned.

## Error Handling

None (always succeeds, even if no customer is assigned)

