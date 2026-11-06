# signInShopper

Signs the shopper in with the code `requestShopperCode` sent (or creates the account on the first
code). Storefront only. The session lasts across reloads on this site and works at this store only.

```ts
const { success, shopper, reason } = await renderClient.signInShopper({ email, code });
```

During checkout, call `startCheckout` again after a successful sign-in: the new payment session lists
the shopper's saved cards. Signing out works the same way in reverse.
