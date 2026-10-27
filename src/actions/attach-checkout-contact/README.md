# attachCheckoutContact

Put the shopper's contact on the order `startCheckout` already created.

```ts
await renderClient.attachCheckoutContact({ email: 'shopper@example.com', name: 'Sam' });
```

## Why this is a separate command

The card fields cannot render without a payment session, a session needs a server-priced
amount, and an amount needs an order. So the order has to exist **before** the shopper has
typed anything.

Demanding an email first is what forced the old "fill the form, then see the card fields"
checkout. It also meant every cart edit minted a **new** order, because the idempotency key
moved with the cart.

So `startCheckout` now runs when the shopper **arrives**, with no contact, and this command
supplies the email afterwards against the same order.

## When to call it

Any time before paying, as soon as the email is known — on blur, on submit, or as the shopper
leaves the contact step.

## Guarantees

|                     |                                                                                                                                            |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Called twice        | Harmless. The server only ADDS contact to an order that has none, so a later call cannot redirect a receipt that was already addressed.    |
| No checkout started | Answers `{ attached: false }`. It does **not** throw — failing to record an email must never stop a payment the shopper is trying to make. |
| Return value        | `attached: false` is not a charge failure and never means the shopper paid.                                                                |

## Params

| name       | required | notes                                                 |
| ---------- | -------- | ----------------------------------------------------- |
| `email`    | yes      | Where the receipt goes.                               |
| `name`     | no       |                                                       |
| `phone`    | no       |                                                       |
| `outletId` | no       | Defaults to the outlet the storefront booted against. |

Served **only** by the storefront runtime (a published website), like `startCheckout`. On a
register it does not exist.
