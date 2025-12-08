# getCurrentCart

Retrieves the current cart object with all its contents including products, custom sales, discounts, fees, totals, and customer information.

## Parameters

None.

## Response

`Promise<GetCurrentCartResponse>`

| Field       | Type     | Description                               |
| :---------- | :------- | :---------------------------------------- |
| `success`   | `boolean` | `true` if the cart was retrieved successfully. |
| `cart`      | `ActiveCart` | The current cart object containing products, custom sales, totals, discounts, fees, customer, and other cart details. |
| `timestamp` | `string` | ISO date string of when the action occurred. |

## Cart Object Structure

The cart object (`ActiveCart`) includes:

- `products`: Array of products in the cart (`ActiveProduct[]`)
- `customSales`: Optional array of custom sales (`ActiveCustomSales[]`)
- `total`: Total amount of the cart (number)
- `subtotal`: Subtotal amount before taxes and discounts (number)
- `tax`: Tax amount (number, optional)
- `discount`: Cart-level discount object (optional)
- `customFee`: Array of custom fees (optional)
- `customer`: Customer assigned to the cart (optional)
- `orderNotes`: Notes for the order (optional string)
- `remainingBalance`: Remaining balance for split payments (optional number)
- `amountToBeCharged`: Amount to be charged (number)
- `orderId`: Order ID if cart is associated with an order (optional string)
- `cartTotal`: Cart total (optional number)
- `orderTotal`: Order total (optional number)

## Example Usage

```typescript
import { command } from '@final-commerce/command-frame';

try {
  // Get the current cart
  const result = await command.getCurrentCart();
  console.log('Current cart:', result.cart);
  console.log('Cart products:', result.cart.products);
  console.log('Cart total:', result.cart.total);
  console.log('Cart subtotal:', result.cart.subtotal);
  
  // Expected output:
  // {
  //   success: true,
  //   cart: {
  //     products: [...],
  //     customSales: [...],
  //     total: 25.50,
  //     subtotal: 20.00,
  //     tax: 5.50,
  //     discount: {...},
  //     customer: {...},
  //     ...
  //   },
  //   timestamp: '2023-10-27T10:00:00.000Z'
  // }

} catch (error) {
  console.error('Failed to get current cart:', error);
}
```

## Error Handling

This action typically does not throw errors unless there's an underlying system issue.

## Notes

- Returns the complete cart object as it exists in the Redux store.
- The cart includes all products, custom sales, discounts, fees, and calculated totals.
- Useful for displaying cart contents, calculating totals, or syncing cart state with external systems.

