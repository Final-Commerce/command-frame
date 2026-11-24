# resumeCheckout

Finishes an online checkout the shopper was **redirected away from**.

Some payment methods send the shopper to their bank or wallet, and 3-D Secure
does the same for a card. The provider sends them back to the `returnUrl` you
gave [`startCheckout`](../start-checkout/README.md) — as a **fresh page load**.
At that moment the payment is not finished. The provider has handed the browser
a one-time result in the URL, and it has to go back to the provider before the
charge completes.

`startCheckout` cannot do this: it ran in the page that no longer exists, along
with everything it was holding in memory. `resumeCheckout` is the other half.

**Call it unconditionally when your checkout or confirmation screen mounts.** On
an ordinary visit there is nothing in the URL, so it answers
`{ resumed: false }` without touching the network. That is not an error, it is
the normal answer.

> If you never call it, a shopper who is sent through 3-D Secure comes back to a
> page that looks finished and an order that never gets paid. There is no other
> code path that completes that charge.

## Parameters

`params?: ResumeCheckoutParams` — optional.

| Parameter | Type     | Required | Description                                                                                                    |
| :-------- | :------- | :------- | :------------------------------------------------------------------------------------------------------------- |
| `url`     | `string` | `false`  | Where to read the provider's return data from. Defaults to the current page URL. Override only if your router strips the query string before this runs. |

## Response

`Promise<ResumeCheckoutResponse>`

```typescript
interface ResumeCheckoutResponse {
  success: boolean;
  timestamp: string;
  checkout: {
    resumed: boolean;        // false = ordinary page load, nothing to finish
    orderId?: string;
    receiptId?: string;
    resultCode?: string;     // e.g. 'Authorised' — an authorisation, NOT a settlement
    sessionResult?: string;  // opaque proof of the payment; treat as a credential
    orderPassword?: string;  // recovered from browser storage
  };
}
```

Everything past `resumed` is absent when `resumed` is `false`.

### `orderPassword` comes back too

The password is returned **once**, by `startCheckout`, and it is the only route
to the order's status — the shopper's guest token can create an order and
deliberately cannot read one. A redirect destroys the page that was holding it,
so `resumeCheckout` recovers it from browser storage and hands it back. Keep it
the same way you kept the first one.

## Usage

```typescript
import { renderClient, topics } from '@final-commerce/command-frame';

useEffect(() => {
  // Subscribe FIRST. The outcome is published on the checkout topic as well as
  // returned, and the event fires during the call below.
  const id = topics.subscribe('checkout', (event) => {
    if (event.type === 'payment-completed') showConfirmation(event.data);
    if (event.type === 'payment-failed') showRetry(event.data);
  });

  void renderClient.resumeCheckout().then(({ checkout }) => {
    if (!checkout.resumed) return; // ordinary visit
    rememberOrder(checkout);       // orderPassword is in here
  });

  return () => topics.unsubscribe('checkout', id);
}, []);
```

## Behaviour

- **Safe on every page load.** No return data in the URL means no work and no
  network call.
- **Safe to call twice.** The return data is consumed the first time; a second
  call answers `{ resumed: false }`.
- **Publishes on the [`checkout`](../../pubsub/topics/checkout/README.md)
  topic** — `payment-completed` or `payment-failed`, exactly as if the shopper
  had never left. A page that already subscribes needs no second code path.
- **`Authorised` is still not settlement.** The money is confirmed by the
  provider's capture webhook reaching the backend, out of band and after the
  page is done. The same rule as everywhere else in this topic.

## Availability

Storefront (published website) runtime only, like `startCheckout`. It is refused
on a register, where no shopper is ever redirected anywhere.

## Testing in preview

The mock reads the same query parameters, so you can drive the return path by
appending them yourself:

```
?sessionId=CS_MOCK&redirectResult=MOCK
```

Without them the mock answers `{ resumed: false }`, which is the branch your
screen hits on every normal visit.
