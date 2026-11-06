# requestShopperCode

Sends a 6-digit sign-in code for this store's account, by email or by text message. Storefront only.

```ts
// By email, or by text (any common spelling: the runtime makes it +1 when no country is given)
const { success, message, reason } = await renderClient.requestShopperCode({ email });
const byText = await renderClient.requestShopperCode({ phone: '709 555 0101' });

// On the confirmation page of a guest checkout ("Email me a code"): no params, the code goes to
// the email that checkout used.
await renderClient.requestShopperCode();
```

Show `message` on success, `reason` otherwise. Then ask for the code and call `signInShopper` with
the same `email` or `phone` (or none, after a checkout). A new email or phone gets an account on the
first correct code: there is no separate sign-up and no password.
