# createPaymentLink

Creates a hosted payment link for the **current cart** and texts or emails it
to the customer. Unlike a POS-owned tender, nobody keys in a card here: the
shopper pays on the provider's own hosted page, and the sale completes
asynchronously when they do.

**The caller rings the sale up first**, for an amount-only link, add a
custom sale to the cart before calling this, exactly as a cashier would.
Flows never compute money: the link is for the cart's own total, tax and line
items, not an amount you pass in.

Adyen-only today; a company configured on any other provider gets a rejected
promise.

## Parameters

`params: CreatePaymentLinkParams`

| Parameter | Type     | Required | Description                                                              |
| :-------- | :------- | :------- | :----------------------------------------------------------------------- |
| `email`   | `string` | \*       | Address to email the link to.                                            |
| `phone`   | `string` | \*       | Phone number to text the link to, in E.164 format (e.g. `+15555550123`). |

\* **Exactly one** of `email` / `phone` is required: both present, or
neither, is rejected.

## Response

`Promise<CreatePaymentLinkResponse>`

| Field       | Type                                                       | Description                                                                                                   |
| :---------- | :--------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------ |
| `success`   | `boolean`                                                  | Always `true`, a failed request rejects the promise instead of resolving `false`.                             |
| `timestamp` | `string`                                                   | ISO date string.                                                                                              |
| `orderId`   | `string`                                                   | Client `_id` of the order the station created for this link. This is the order that will sync and complete.   |
| `url`       | `string`                                                   | Hosted payment page to send the shopper.                                                                      |
| `id`        | `string`                                                   | The provider's payment-link id.                                                                               |
| `expiresAt` | `string`                                                   | ISO date string, when the link stops accepting payment.                                                       |
| `delivery`  | `{ email?: 'sent' \| 'failed'; sms?: 'sent' \| 'failed' }` | Per-channel delivery outcome. **Absent means delivered**, treat a missing `delivery` as success, not failure. |

## Example Usage

```typescript
import { command } from '@final-commerce/command-frame';

// 1. Ring up the sale (an amount-only quick charge adds a custom sale):
await command.addCustomSale({ label: 'Invoice #4821', price: 8500 }); // $85.00

// 2. Ask for a payment link:
const link = await command.createPaymentLink({ phone: '+15555550123' });

console.log('Send the customer to:', link.url);
console.log('Delivery status:', link.delivery); // e.g. { sms: 'sent' }
```

## Behavior

1. The current cart must be non-empty with a total greater than zero.
2. The station creates a real local order (`unpaid × in_progress`) from the
   cart BEFORE requesting the link; only that order's id travels to the
   provider. The provider links its payment page to that order and creates
   none of its own.
3. On success, the cart is cleared: the order now owns the line, same as any
   completed tender.
4. On a failed send, the order is voided and the cart is kept, so the cashier
   can retry immediately. Each retry materializes a fresh order.
5. The order completes later, out of band, when the shopper pays on the
   hosted page (a processor webhook settles it); this command does not wait
   for that.

## Error Handling

Every failure below **rejects the returned promise**, the handler never
resolves with `success: false`.

- Neither `email` nor `phone` is provided: `"exactly one of email or phone is required to deliver the payment link"`
- Both `email` and `phone` are provided: `"exactly one of email or phone delivers a payment link, not both"`
- `email` is not a valid address: `"a valid recipient email is required to send a payment link"`
- `phone` is not in E.164 format: `"phone must be in E.164 format, e.g. +15555550123, to send a payment link"`
- The cart is empty: `"ring the sale up before creating a payment link: the cart is empty"`
- The cart total is not greater than zero: `"the cart total must be greater than zero to ask for payment"`
- The configured payment provider is not Adyen: the promise rejects naming the
  configured provider and `createPaymentLinkFromCart` as the unsupported route.
- The order could not be created by the state machine: `"PAYMENT_LINK_ORDER_REJECTED: <reason>"`.

## Notes

- No `amount` parameter exists on purpose, the amount always comes from the
  cart. If you need a different amount, adjust the cart first.
- A voided retry order is the accepted cost of never leaving a payable order
  behind an unsent link; you may see orphaned voided orders in order history
  after a failed send.
- This is a separate, cart-owning variant of payment links; it does not take
  an explicit order or amount payload.
