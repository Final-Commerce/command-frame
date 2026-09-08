# integrationPayment

Extension-driven payment for Stripe-style integrations. The extension processes the payment with its provider, then calls `integrationPayment(...)` so kaching can record the resulting transaction + order. Functionally identical to `redeemPayment` on the wire — both delegate to `extensionPayment` — but `integrationPayment` carries `emvData` (required) and `processorFee` typed at the param level.

## Required fields

| Field     | Type                 | Why required                                                                                                                                                                                                                                                        |
| --------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `amount`  | `number`             | Minor units of the captured amount. The host won't fall back to cart total — caller must specify.                                                                                                                                                                   |
| `emvData` | `IntegrationEmvData` | Typed card display fields (object, not string). Host maps to the platform's canonical EMV keys and JSON-serializes onto `paymentMethod.emv` — same persisted shape as the native card flow. All inner fields are optional; pass `{}` if you genuinely have nothing. |

Optional: `label`, `extensionId`, `processor` (defaults to `"integration"`), `referenceId`, `metadata`, `processorFee`, `checkoutFulfillmentTarget` (overrides the fulfillment landing on full payment; omitted preserves advanced fulfillment / auto-fulfills from draft, pending, or on_hold — an invalid value is a hard error, not silently dropped).

### `IntegrationEmvData`

camelCase on the wire; the host translates to the platform's canonical persisted keys:

| Field             | Maps to             | Notes                                                                                                    |
| ----------------- | ------------------- | -------------------------------------------------------------------------------------------------------- |
| `brand`           | `"Brand"`           | e.g. `"Visa"`, `"MasterCard"`.                                                                           |
| `cardholderName`  | `"Cardholder Name"` | As printed on the card.                                                                                  |
| `country`         | `"Country"`         | ISO 3166-1 alpha-2, e.g. `"US"`.                                                                         |
| `expiryDate`      | `"Expiry date"`     | Display string, e.g. `"12/26"`.                                                                          |
| `issuer`          | `"Issuer"`          | Issuing bank.                                                                                            |
| `cardNumberLast4` | `"Card Number"`     | Just the last 4 digits — host masks to `**** **** **** XXXX` for display (matches the native card flow). |

## Response

`Promise<IntegrationPaymentResponse>` (alias of `ExtensionPaymentResponse`):

| Field              | Type              | Description                                                                        |
| :----------------- | :---------------- | :--------------------------------------------------------------------------------- |
| `success`          | `boolean`         | `true` when host payment handling completed successfully.                          |
| `amount`           | `number \| null`  | Processed amount reported by host, in integer minor currency units.                |
| `paymentType`      | `string`          | Always `"integration"`.                                                            |
| `order`            | `CFOrder \| null` | Order snapshot after payment processing. `null` for a non-final split-payment leg. |
| `change`           | `number`          | Always `0` — no cash tender on an integration payment.                             |
| `cashRounding`     | `number`          | Always `0` — rounding only applies to cash legs.                                   |
| `saleFinalized`    | `boolean`         | `true` only when this leg finalized the sale (the last, or only, leg captured).    |
| `remainingBalance` | `number`          | Balance still due after this leg, integer minor units; `0` when finalized.         |
| `timestamp`        | `string`          | ISO timestamp produced by the host action handler.                                 |

A payment failure (including a cancelled modal) rejects the promise rather than resolving with `success: false` — the host never returns `success: true` with a failed charge.

## Usage

```ts
import { integrationPayment } from '@final-commerce/command-frame';

await integrationPayment({
  amount: 4250, // required (minor units)
  emvData: {
    // required (object)
    brand: 'Visa',
    cardholderName: 'Jane Doe',
    cardNumberLast4: '4242',
    expiryDate: '12/26',
    country: 'US',
    issuer: 'Chase',
  },
  label: 'Visa ****4242', // optional
  extensionId: 'stripe-ext', // optional
  processor: 'Stripe', // optional — shown as the processor on the order's paymentMethod
  referenceId: 'pi_3Nz...', // optional — provider's payment intent / charge id (audit link)
  processorFee: 125, // optional — minor units
  metadata: { brand: 'visa', last4: '4242' },
});
```

Wire `paymentType` is `"integration"`. Cart must be non-empty. TypeScript rejects missing required fields at compile time; the host handler additionally re-validates at runtime so raw postMessage callers can't bypass it. See `command-frame/src/actions/redeem-payment/README.md` for the sibling without `emvData`.
