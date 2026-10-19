# getCheckoutStatus

Where an online order stands now, as the server holds it. Storefront only.

```ts
const { status, paid } = await renderClient.getCheckoutStatus({ receiptId });
```

Use it on a confirmation page: the browser only ever knows the payment provider ACCEPTED a
payment, and the order becomes `paid` when the provider's notification reaches the server. Poll a
few times (every few seconds) until `paid`, then stop. `receiptId` is the one `startCheckout`
returned; leave it out to ask about the checkout in flight, else the last one this tab finished.
`status: null` means this tab placed no such order, or the server could not be asked.

| status                            | meaning for the shopper              |
| --------------------------------- | ------------------------------------ |
| `awaiting_payment`                | Not paid yet                         |
| `confirming`                      | They paid; the server is catching up |
| `payment_failed`                  | The last attempt did not go through  |
| `paid` / `fulfilled`              | Paid                                 |
| `partially_refunded` / `refunded` | Paid, then refunded                  |
| `cancelled`                       | Cancelled                            |
