# requestShopperCode

Emails a 6-digit sign-in code for this store's account. Storefront only.

```ts
const { success, message, reason } = await renderClient.requestShopperCode({ email });
```

Show `message` on success, `reason` otherwise. Then ask for the code and call `signInShopper`. A new
email gets an account on the first correct code: there is no separate sign-up.
