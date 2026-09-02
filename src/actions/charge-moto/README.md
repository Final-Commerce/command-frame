# chargeMoto

Charges a keyed (card-not-present) MOTO sale for the **current cart**. The
operator keys in the card themselves, this is for phone/mail orders and
similar scenarios where the card is not physically present at a reader. All
amounts are **integer MINOR currency units** (e.g. `1575` = $15.75).

**The caller rings the sale up first.** This charges the CURRENT CART, for
an amount-only quick charge that means adding a custom sale
(`addCustomSale`) before calling this, exactly as a cashier would.

Adyen-only today; a company configured on any other provider gets a rejected
promise (Stripe's MOTO route takes an SDK-tokenized payment method instead of
encrypted card fields, so it is not served here).

**One full charge, not a split leg.** Call this with no split payment in
progress.

## Parameters

`params: ChargeMotoParams`

| Parameter                | Type                   | Required | Description                                                                                                                           |
| :----------------------- | :--------------------- | :------- | :------------------------------------------------------------------------------------------------------------------------------------ |
| `amount`                 | `number`               | `true`   | Total to charge, base + tip, minor units. **Minimum 50 minor units.** A value below the cart's balance due records a partial payment. |
| `tipAmount`              | `number`               | `false`  | Tip portion of `amount`, already collected by your own UI. Defaults to `0`.                                                           |
| `currency`               | `string`               | `false`  | ISO 4217 code. Must match the active company's currency when supplied; the charge is rejected before anything is sent otherwise.      |
| `card`                   | `ChargeMotoCardFields` | `true`   | Provider-encrypted card fields (see below). Opaque to the POS, never a raw PAN.                                                       |
| `idempotencyKey`         | `string`               | `true`   | Caller-held key for this charge (see Idempotency below).                                                                              |
| `paymentName`            | `string`               | `false`  | Optional tender label recorded on the payment method.                                                                                 |
| `targetFulfillmentState` | `string`               | `false`  | Fulfillment state to land on after full payment. Defaults to auto-fulfill.                                                            |

### `ChargeMotoCardFields`

```typescript
interface ChargeMotoCardFields {
  encryptedCardNumber: string;
  encryptedExpiryMonth: string;
  encryptedExpiryYear: string;
  encryptedSecurityCode: string;
  postalCode?: string; // Optional AVS postal code the operator entered.
  reference?: string; // Provider-side reference; defaults to idempotencyKey server-side.
}
```

`encryptedCardNumber`, `encryptedExpiryMonth`, `encryptedExpiryYear`, and
`encryptedSecurityCode` are **required and must be non-blank**. These are the
provider's own client-side-encrypted (CSE) blobs, the POS never sees, stores,
or logs the actual card number.

## Response

`Promise<ChargeMotoResponse>`

| Field              | Type          | Description                                                                           |
| :----------------- | :------------ | :------------------------------------------------------------------------------------ |
| `success`          | `boolean`     | Always `true`, a failed charge rejects the promise instead of resolving `false`.      |
| `timestamp`        | `string`      | ISO date string.                                                                      |
| `order`            | `ActiveOrder` | The persisted order the charge landed on.                                             |
| `saleFinalized`    | `boolean`     | `true` only when this charge completed the sale (`paymentState === 'paid'`).          |
| `remainingBalance` | `number`      | Balance still due after this charge, minor units. `0` when `saleFinalized` is `true`. |

**A resolved result does not mean the sale is done.** This is a single leg:
if `amount` does not cover the order, the money IS captured but the order
lands `partially_paid`, the cart is NOT reset, and no `payment-done` event is
published. Check `saleFinalized` before printing a receipt or clearing the
screen; `remainingBalance` is what is still owed.

## Example Usage

```typescript
import { command } from '@final-commerce/command-frame';

// 1. Ring up the sale:
await command.addCustomSale({ label: 'Phone Order #442', price: 4200 }); // $42.00

// 2. Charge the keyed card (encrypted client-side by your provider's own SDK):
const result = await command.chargeMoto({
  amount: 4200,
  card: {
    encryptedCardNumber: 'adyenjs_0_1_25$...',
    encryptedExpiryMonth: 'adyenjs_0_1_25$...',
    encryptedExpiryYear: 'adyenjs_0_1_25$...',
    encryptedSecurityCode: 'adyenjs_0_1_25$...',
  },
  idempotencyKey: 'moto-4821-attempt-1',
});

if (result.saleFinalized) {
  console.log('Sale complete:', result.order._id);
} else {
  console.log('Partial charge captured. Remaining balance:', result.remainingBalance);
}
```

## Idempotency

`idempotencyKey` is **held by the caller across retries**, not generated by
the library:

- Retrying with the **same** key replays the original authorization; the
  card is never charged twice, even if the first attempt's response was lost
  (a timeout, a dropped connection).
- Retrying with a **different amount** requires a **new** key. Reusing a key
  after changing the amount does not "update" the original charge.

## Error Handling

Every failure below **rejects the returned promise**, the handler never
resolves with `success: false`. All validation runs BEFORE any network call,
so a rejected charge has moved no money and can be corrected and retried
under the same idempotency key.

- `amount` is missing or not an integer number of minor units.
- `amount` is below the 50-minor-unit floor.
- `tipAmount` is not a non-negative integer, or exceeds `amount`.
- Any required `card.*` field is missing or blank (error names the specific field, e.g. `"card.encryptedCardNumber is required"`).
- `idempotencyKey` is missing or blank.
- `currency` is supplied and does not match the active company's currency.
- The configured payment provider is not Adyen: the promise rejects naming
  the configured provider and `chargeMoto` as the unsupported route.
- The engine or processor rejects the charge (declined card, blocked
  transition, etc.); the promise rejects with the engine's own message.

## Notes

- Requires the cart to have items before calling.
- This does none of a split-tender's own bookkeeping, call it with no split
  payment in progress, or the next leg reads a stale balance.
- On a fully finalized sale, the completed-sale event pipeline (receipt
  printing, cart clearing) runs exactly as it does for any other tender.
