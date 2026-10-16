# getMotoConfig

Everything a flow needs to take a **keyed (card-not-present / MOTO) payment** itself: the Adyen
client key and environment, and the company's country, to mount Adyen's own card-entry fields.
What those fields produce goes to [`chargeMoto`](../charge-moto/README.md), which charges the
flow's current cart.

The client key is Adyen's publishable key, but it is host environment config: the host injects it
at runtime, so **never bake a key into a flow build**. Keyed charges are Adyen-only today.

## Usage

```ts
import { command } from '@final-commerce/command-frame';
import { AdyenCheckout, CustomCard } from '@adyen/adyen-web';

const config = await command.getMotoConfig();
if (!config.available) {
  // config.reason: 'provider-unsupported' | 'no-client-key' | 'no-country' | 'no-company'
  return; // hide the manual card tender
}

const checkout = await AdyenCheckout({
  clientKey: config.clientKey,
  environment: config.environment,
  countryCode: config.countryCode,
});
// Mount CustomCard into your card-number / expiry / CVC boxes; its onChange hands back
// state.data.paymentMethod.encryptedCardNumber, encryptedExpiryMonth, encryptedExpiryYear and
// encryptedSecurityCode. Then:
await command.chargeMoto({ amount, card: { encryptedCardNumber /* … */ }, idempotencyKey });
```

## Response

```ts
| { success: true; timestamp: string; available: true; provider: 'adyen';
    clientKey: string; environment: 'test' | 'live'; countryCode: string }
| { success: true; timestamp: string; available: false;
    reason: 'provider-unsupported' | 'no-client-key' | 'no-country' | 'no-company' }
```

It never rejects for a missing piece — `available: false` always says why.

## Mock

The mock has no Adyen account, so it returns `{ available: false, reason: 'no-client-key' }`.
