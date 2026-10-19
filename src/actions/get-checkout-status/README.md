# getCheckoutStatus

Where an online order stands now, as the server holds it. Storefront only.

```ts
const { status, paid } = await renderClient.getCheckoutStatus({ orderPassword });
```

Use it on a confirmation page: the browser only ever knows the payment provider ACCEPTED a
payment, and the order becomes `paid` when the provider's notification reaches the server. Poll a
few times (every few seconds) until `paid`, then stop. `status: null` means the order is unknown
or the password has expired.

| status                            | meaning for the shopper              |
| --------------------------------- | ------------------------------------ |
| `awaiting_payment`                | Not paid yet                         |
| `confirming`                      | They paid; the server is catching up |
| `payment_failed`                  | The last attempt did not go through  |
| `paid` / `fulfilled`              | Paid                                 |
| `partially_refunded` / `refunded` | Paid, then refunded                  |
| `cancelled`                       | Cancelled                            |
