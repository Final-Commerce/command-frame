# startCheckout

Takes an **online** payment for the current cart on a published website: creates
a server-priced order from the cart and mounts the payment provider's hosted
card fields into an element you own. This is the ecommerce counterpart of the
till tenders — `cashPayment`, `terminalPayment`, `tapToPayPayment` and
`chargeMoto` are all **refused on a website**, and `startCheckout` is the only
way to take money there.

**It does not resolve with a payment.** It resolves as soon as the shopper *can*
pay — the order exists and the card fields are mounted. The shopper has not
typed a card yet at that moment. The outcome arrives later, on the
[`checkout`](../../pubsub/topics/checkout/README.md) topic, so a page subscribes
rather than polling.

**You never send a price.** The params carry ids and quantities only; the server
re-prices the cart with the same engine the POS uses and returns `serverTotal`.
There is deliberately nowhere for a browser-supplied amount to land, so a
tampered page cannot change what is charged. Display `serverTotal` (integer
**minor** units, e.g. `5175` = $51.75) as the amount due — not a total your own
code added up.

**The card fields are the provider's, not yours.** They are iframes hosted by
the payment provider, so the card number never enters your page, which is what
keeps a merchant out of PCI scope. Style everything *around* the container
freely; you cannot style inside it, and you must never build your own card
number / CVC inputs.

## Parameters

`params: StartCheckoutParams`

| Parameter              | Type                       | Required | Description                                                                                                                                       |
| :--------------------- | :------------------------- | :------- | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| `contact`              | `StartCheckoutContact`     | `true`   | Guest contact. There is no shopper account, so this is the only way to reach them.                                                                |
| `container`            | `string`                   | `true`   | **CSS selector** for the element the fields mount into, e.g. `'#card-fields'`. The element must already be in the DOM. **Not a DOM node** — see below. |
| `returnUrl`            | `string`                   | `false`  | Where the provider returns the shopper after a redirect method (bank apps, wallets). Defaults to the current URL.                                  |
| `idempotencyKey`       | `string`                   | `false`  | Overrides the cart-derived key. Leave unset (see Idempotency).                                                                                     |
| `outletId`             | `string`                   | `false`  | Defaults to the outlet the storefront booted against.                                                                                              |
| `dropinConfiguration`  | `Record<string, unknown>`  | `false`  | Forwarded verbatim to the provider's Drop-in (`showPayButton`, `locale`, field styling, …).                                                        |

### `StartCheckoutContact`

```typescript
interface StartCheckoutContact {
  email: string; // required — where the receipt goes
  name?: string;
  phone?: string;
}
```

### `container` must be a selector string, never an element

Passing `ref.current` throws before the command is even sent:

```
DataCloneError: Failed to execute 'postMessage' on 'Window':
HTMLDivElement object could not be cloned.
```

Command params cross a `postMessage` boundary, which serializes them with the
structured clone algorithm, and DOM nodes are not cloneable. Give the element a
stable `id` and pass the selector; it is resolved against the same document your
page rendered.

```tsx
// WRONG — throws DataCloneError
<div ref={fieldsRef} />;
await command.startCheckout({ contact, container: fieldsRef.current });

// RIGHT
<div id="card-fields" />;
await command.startCheckout({ contact, container: '#card-fields' });
```

### `returnUrl` must be HTTPS on the storefront's own origin

The server rejects anything else. This URL is handed to a payment provider, so
an open redirect on a checkout would be a phishing primitive. A plain-HTTP dev
origin is refused by the server, not by this command.

## Response

`Promise<StartCheckoutResponse>`

| Field       | Type                 | Description                                            |
| :---------- | :------------------- | :----------------------------------------------------- |
| `success`   | `boolean`            | Always `true`; a failure rejects the promise instead.  |
| `timestamp` | `string`             | ISO date string.                                       |
| `order`     | `StartCheckoutOrder` | The created order — see below.                         |

### `StartCheckoutOrder`

| Field           | Type                          | Description                                                                                                       |
| :-------------- | :---------------------------- | :---------------------------------------------------------------------------------------------------------------- |
| `orderId`       | `string`                      | The created order's id.                                                                                            |
| `receiptId`     | `string`                      | Human-facing receipt number, e.g. `ON-004-000173`. Show this to the shopper.                                       |
| `serverTotal`   | `number`                      | The **server's** price for the cart, integer minor units. The only total that matters.                             |
| `currency`      | `string`                      | ISO 4217 code.                                                                                                     |
| `paymentStatus` | `'ready' \| 'unavailable'`    | `ready` — fields mounted, shopper can pay. `unavailable` — **the order exists** but payment could not be started.   |
| `orderPassword` | `string?`                     | One-time password for reading this order back. Returned **only on the first create** — keep it or lose order status. |

**`unavailable` is not a failed order.** The order exists and the shopper owes
for it; only the payment could not be started, and they have **not** been
charged. Say exactly that — never "your order failed".

## Example Usage

```typescript
import { command, topics } from '@final-commerce/command-frame';
// Mount the provider stylesheet once in your app, or the fields render unstyled:
// import '@adyen/adyen-web/styles/adyen.css';

// The outcome CANNOT come back from the call — subscribe before you start.
const subscriptionId = topics.subscribe('checkout', (event) => {
  if (event.type === 'payment-completed') {
    // The shopper's side finished (resultCode is usually 'Authorised').
    // NOT settlement — show a confirmation, not "payment received".
    showConfirmation();
  }
  if (event.type === 'payment-failed') {
    // One declined attempt. The fields stay mounted; let them try another card.
    showRetryMessage(event.data.message);
  }
});

// The container must already be rendered when this runs.
const { order } = await command.startCheckout({
  contact: { email: 'shopper@example.com', name: 'Alex Kim' },
  container: '#card-fields',
});

console.log('Receipt', order.receiptId);
console.log('Due', order.serverTotal, order.currency); // minor units

if (order.paymentStatus === 'unavailable') {
  showMessage('Your order was created, but we could not start payment.');
}

// Later:
topics.unsubscribe('checkout', subscriptionId);
```

## Events

All three are published on the [`checkout`](../../pubsub/topics/checkout/README.md)
topic — the POS `payments` topic never fires for an online checkout.

| Event                                                                                  | When                                                                       |
| :------------------------------------------------------------------------------------- | :------------------------------------------------------------------------- |
| [`checkout-started`](../../pubsub/topics/checkout/checkout-started/README.md)            | The order exists and the fields are mounted. Carries `serverTotal`.        |
| [`payment-completed`](../../pubsub/topics/checkout/payment-completed/README.md)          | The shopper's payment succeeded on their side. **Authorisation, not settlement.** |
| [`payment-failed`](../../pubsub/topics/checkout/payment-failed/README.md)                | An attempt was refused or errored. The shopper can retry in place.         |

## Idempotency

Leave `idempotencyKey` unset. The key is derived from the cart, so a shopper
double-tapping "Pay" re-sends the same key and is handed **the order that
already exists** instead of creating a second, abandoned one. A genuinely
changed cart produces a genuinely new key. Supply your own key only if you are
managing that lifecycle yourself.

## Error Handling

Every failure below **rejects the promise**; the handler never resolves with
`success: false`. All of these are checked before an order is created, so a
rejected call has created nothing and charged nothing.

- The cart is empty.
- `contact.email` is missing or blank.
- `container` is missing, or is not a string (a DOM node throws `DataCloneError` at the boundary).
- No element matches `container` on the page — the error names the selector.
- No outlet is in context (the storefront has not booted).
- The server rejects the order (unknown product, `returnUrl` not HTTPS/same-origin, …).

A payment that is *attempted and declined* does **not** reject: the call already
resolved when the fields mounted. That outcome arrives as `payment-failed`.

## Notes

- **Import the provider stylesheet once** in your app (`@adyen/adyen-web/styles/adyen.css`). Without it the fields still work and still take payments — they just render unstyled, which looks like a bug and is not one.
- Render the container **before** calling; a missing selector is the most common mistake.
- `payment-completed` is not proof the money is yours. Under manual capture the provider reports `Authorised` and the funds are confirmed by a capture webhook reaching the backend, out of band. Do not release a download, mark fulfilled, or claim "payment received" on this event alone — read the order back with `orderPassword` for the settled state.
- Available only on the storefront (website) runtime. On a register this command does not exist.

## Related Actions

- [`chargeMoto`](../charge-moto/README.md) — keyed card taken by phone or mail, **at a till**. Same shape, wrong channel for a website: it declares a merchant-keyed transaction, which carries no 3-D Secure and leaves fraud liability with the merchant.
- [`createPaymentLink`](../create-payment-link/README.md) — sends the shopper elsewhere to pay, instead of paying in place.
- [`getProducts`](../get-products/README.md) / [`addProductToCart`](../add-product-to-cart/README.md) — build the cart this charges.
