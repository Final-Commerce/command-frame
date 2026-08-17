# partialPayment

Initiates a partial/split payment for the current cart.

## Parameters

`params?: PartialPaymentParams`

Although the parameter is typed optional, the handler throws if no `params` object is passed at all — pass at minimum `{ openUI: true }` or `{ amount, isPercent }`.

| Parameter  | Type      | Required | Description                                                              |
| :--------- | :-------- | :------- | :----------------------------------------------------------------------- |
| `openUI`   | `boolean` | `false`  | If true, opens the split payment UI. If false, processes the payment with the specified amount. |
| `amount`   | `number`  | `false`  | The payment amount, in integer minor currency units (required if openUI is false). Percentages (`isPercent: true`) are unaffected and remain 0-100. |
| `isPercent` | `boolean` | `false`  | Whether the amount is a percentage (default: false).                      |
| `targetFulfillmentState` | `string` | `false` | Present in the type contract but not currently implemented by this handler (ignored). |

## Response

`Promise<PartialPaymentResponse>`

| Field       | Type     | Description                               |
| :---------- | :------- | :---------------------------------------- |
| `success`   | `boolean` | `true` if the payment was processed successfully. |
| `amount`    | `number \| undefined` | The payment amount (undefined if openUI is true). Integer minor currency units when `isPercent` is false; a 0-100 percentage when `isPercent` is true. |
| `isPercent` | `boolean \| undefined` | Whether the amount is a percentage (undefined if openUI is true). |
| `openUI`    | `boolean` | Whether the split payment UI was opened. |
| `order`     | `ActiveOrder \| null` | Always `null`. This action only queues the split amount (or opens the split UI) — the order is created/completed by whichever payment/tender action runs next, not by `partialPayment` itself. |
| `timestamp` | `string` | ISO date string of when the action occurred. |

## Example Usage

```typescript
import { command } from '@final-commerce/command-frame';

try {
  // Open the split payment UI
  const result1 = await command.partialPayment({
    openUI: true
  });
  console.log('Split payment UI opened:', result1);
  // order will be null until final payment completes

  // Process a partial payment with a fixed amount
  const result2 = await command.partialPayment({
    amount: 2500, // $25.00 in minor units
    isPercent: false
  });
  console.log('Partial payment processed:', result2);
  console.log('Order:', result2.order); // always null here
  // Expected output:
  // {
  //   success: true,
  //   amount: 2500,
  //   isPercent: false,
  //   openUI: false,
  //   order: null, // partialPayment never creates/returns the order itself
  //   timestamp: '2023-10-27T10:00:00.000Z'
  // }
  // The order is only created once a subsequent payment/tender command (e.g. cardPayment,
  // cashPayment) actually charges the queued amount.

  // Process a partial payment with a percentage
  await command.partialPayment({
    amount: 50,
    isPercent: true
  });

} catch (error) {
  console.error('Failed to process partial payment:', error);
}
```

## Notes

- The cart must have items
- `partialPayment` never creates or returns the order itself — it queues the split amount on the cart (or opens the split UI); the order is created/completed by whichever payment/tender action runs next
- If `openUI` is true, the order will be null as the payment is processed through the UI
- The `order` field is always `null` in the response, both for fixed/percent amounts and for `openUI` calls
- When processing a fixed or percentage amount (`openUI: false`), a `cart` / `cart-created` event is published with the updated cart; `openUI: true` calls do not publish this event

## Error Handling

- Throws an error if no `params` object is passed at all (a `params` object is required even though the type marks it optional)
- Throws an error if the cart is empty
- Throws an error if amount is missing when openUI is false
- Throws an error if amount is not an integer in minor currency units when `isPercent` is false (e.g. a fractional amount)
