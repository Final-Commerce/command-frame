# chargeMoto

Charges a keyed (card-not-present) MOTO sale for the **current cart**. The
operator keys in the card themselves, this is for phone/mail orders and
similar scenarios where the card is not physically present at a reader. All
amounts are **integer MINOR currency units** (e.g. `1575` = $15.75).

**It charges the CURRENT CART, whatever is in it.** A flow with products in
its cart charges exactly those products (modifiers, discounts and all), and the
order is built from the cart like any other tender's. For an amount-only quick
charge with no products, add a custom sale (`addCustomSale`) first, as the host's
own Manual Entry screen does.

**Getting the card fields from a flow:** call
[`getMotoConfig`](../get-moto-config/README.md) for the Adyen client key,
environment and company country, mount Adyen's own card fields
(`@adyen/adyen-web` Custom Card) with it, and pass the encrypted fields they
produce here. See [Flow implementation](#flow-implementation-manual-card-tender)
below.

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

## Flow implementation: manual card tender

What a flow needs to offer "Manual card" (phone / mail order) on its own cart:

1. **Ask whether it's available.** `getMotoConfig()` returns
   `{ available: true, clientKey, environment, countryCode }`, or
   `{ available: false, reason }` (`provider-unsupported`, `no-client-key`,
   `no-country`, `no-company`). Hide the tender when it is not available; the
   preview mock always reports `no-client-key`.
2. **Mount Adyen's card fields.** Add `@adyen/adyen-web` (the host uses
   `6.44.0`) to the flow's `package.json`, import it **lazily** in the card
   screen only, and mount a `CustomCard` into four `data-cse` boxes:
   `encryptedCardNumber`, `encryptedExpiryMonth`, `encryptedExpiryYear` and
   `encryptedSecurityCode`. Adyen renders an iframe in each, so the card
   number never touches the flow. Keep nothing else inside those boxes, and
   size Adyen's iframes yourself (`.js-iframe { border: none; width: 100%; height: 100%; }`)
   rather than shipping Adyen's stylesheet. **Never put a client key in the
   flow's code**: use the one `getMotoConfig` returns.
3. **Charge.** Read the balance due from `getCurrentCart()`
   (`cart.amountToBeCharged ?? cart.total`). `amount` is required and is
   **not** defaulted to the balance. Pass it with the encrypted fields (plus an
   optional `postalCode` your own input collected) and the idempotency key you
   hold for that amount.
4. **Land it like any tender.** Check `saleFinalized`. Unlike the other
   tenders, the fulfillment parameter here is **`targetFulfillmentState`**,
   not `checkoutFulfillmentTarget`: pass `'pending'` to keep a paid order open
   for a kitchen.
5. **Handle a refusal on the card screen.** A decline rejects with
   `MOTO_PAYMENT_FAILED: <Adyen refusal reason>` (`Refused`, `Expired Card`,
   `CVC Declined`, `Not enough balance`, …). Show it, keep the card form, and
   retry with the **same** key. `MOTO_CAPTURE_FAILED` means the card was
   authorised but not captured: do not retry blindly; check the order first.

```tsx
import { useEffect, useRef, useState } from 'react';
import { renderClient, type ChargeMotoCardFields } from '@final-commerce/command-frame';

type MotoConfig =
  | { available: true; clientKey: string; environment: 'test' | 'live'; countryCode: string }
  | { available: false; reason: string };

export function ManualCard({ onPaid }: { onPaid: () => void }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [config, setConfig] = useState<MotoConfig | null>(null);
  const [card, setCard] = useState<ChargeMotoCardFields | null>(null);
  const [error, setError] = useState<string | null>(null);
  const attempt = useRef<{ amount: number; key: string } | null>(null);

  useEffect(() => {
    void renderClient
      .getMotoConfig()
      .then(setConfig)
      .catch(() => setConfig({ available: false, reason: 'unsupported' }));
  }, []);

  useEffect(() => {
    const node = boxRef.current;
    if (!node || !config?.available) return;
    let mounted: { remove(): void } | null = null;
    void (async () => {
      const { AdyenCheckout, CustomCard } = await import('@adyen/adyen-web'); // lazy: card screen only
      const checkout = await AdyenCheckout({
        clientKey: config.clientKey,
        environment: config.environment,
        countryCode: config.countryCode,
        analytics: { enabled: false },
      });
      mounted = new CustomCard(checkout, {
        onChange: (state) => {
          const pm = state.data.paymentMethod as Record<string, string | undefined>;
          const f = {
            encryptedCardNumber: pm.encryptedCardNumber ?? '',
            encryptedExpiryMonth: pm.encryptedExpiryMonth ?? '',
            encryptedExpiryYear: pm.encryptedExpiryYear ?? '',
            encryptedSecurityCode: pm.encryptedSecurityCode ?? '',
          };
          setCard(Object.values(f).every(Boolean) ? f : null); // all four, or nothing
        },
      }).mount(node);
    })();
    return () => mounted?.remove();
  }, [config]);

  const charge = async () => {
    if (!card) return;
    const { cart } = await renderClient.getCurrentCart();
    const amount = cart.amountToBeCharged ?? cart.total;
    const held = attempt.current;
    const idempotencyKey = held?.amount === amount ? held.key : crypto.randomUUID();
    attempt.current = { amount, key: idempotencyKey };
    try {
      const res = await renderClient.chargeMoto({ amount, card, idempotencyKey, targetFulfillmentState: 'pending' });
      attempt.current = null;
      if (res.saleFinalized) onPaid();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e)); // keep the form and the key: retry replays
    }
  };

  if (!config?.available) return null; // no manual card tender here
  return (
    <div>
      <div ref={boxRef}>
        <span data-cse="encryptedCardNumber" />
        <span data-cse="encryptedExpiryMonth" /> / <span data-cse="encryptedExpiryYear" />
        <span data-cse="encryptedSecurityCode" />
      </div>
      {error && <p>{error}</p>}
      <button disabled={!card} onClick={charge}>
        Charge
      </button>
    </div>
  );
}
```

The example app (`example/`, Payments › Manual card) runs this end to end.

## Example Usage

```typescript
import { command } from '@final-commerce/command-frame';

// Amount-only (no products): ring a custom sale up first.
await command.addCustomSale({ label: 'Phone Order #442', price: 4200 }); // $42.00

// Charge the keyed card (fields encrypted by Adyen's card fields, see above):
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
- The engine or processor rejects the charge; the promise rejects with
  `CODE: message`:
  - `MOTO_PAYMENT_FAILED: <reason>`: not charged. On a decline the reason is
    Adyen's refusal reason. Retry with the same key.
  - `MOTO_CAPTURE_FAILED: …`: authorised but not captured (the authorisation
    reference is in the message). Do not retry blindly.
  - `PAY_REJECTED: empty-cart`: nothing in the cart.
  - `BOOKING_HOLD_EXPIRED`: a booking in the cart lost its hold; nothing was charged.

## Notes

- Requires the cart to have items before calling.
- This does none of a split-tender's own bookkeeping, call it with no split
  payment in progress, or the next leg reads a stale balance.
- On a fully finalized sale, the completed-sale event pipeline (receipt
  printing, cart clearing) runs exactly as it does for any other tender.
