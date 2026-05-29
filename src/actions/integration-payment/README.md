# integrationPayment

Extension-driven payment for Stripe-style integrations. The extension processes the payment with its provider, then calls `integrationPayment(...)` so Render can record the resulting transaction + order. Functionally identical to `redeemPayment` on the wire — both delegate to `extensionPayment` — but `integrationPayment` carries `emvData` (required) and `processorFee` typed at the param level.

## Required fields

| Field | Type | Why required |
|---|---|---|
| `amount` | `number` | Minor units of the captured amount. The host won't fall back to cart total — caller must specify. |
| `emvData` | `string` | EMV tag string from the provider. Stored on `paymentMethod.emv` like card. If your integration doesn't produce EMV, use `redeemPayment` instead. |

Optional: `label`, `extensionId`, `processor` (defaults to `"integration"`), `referenceId`, `metadata`, `processorFee`.

## Usage

```ts
import { integrationPayment } from "@final-commerce/command-frame";

await integrationPayment({
    amount: 4250,                        // required (minor units)
    emvData: "EMV_TAG_DATA",             // required
    label: "Visa ****4242",              // optional
    extensionId: "stripe-ext",           // optional
    processor: "Stripe",                 // optional — shown as the processor on the order's paymentMethod
    referenceId: "pi_3Nz...",            // optional — provider's payment intent / charge id (audit link)
    processorFee: 125,                   // optional — minor units
    metadata: { brand: "visa", last4: "4242" }
});
```

Wire `paymentType` is `"integration"`. Cart must be non-empty. TypeScript rejects missing required fields at compile time; the host handler additionally re-validates at runtime so raw postMessage callers can't bypass it. See `command-frame/src/actions/redeem-payment/README.md` for the sibling without `emvData`.
