# signInShopper

Signs the shopper in with the code `requestShopperCode` sent (or creates the account on the first
code). Storefront only. The session lasts across reloads on this site and works at this store only.

```ts
const { success, shopper, reason } = await renderClient.signInShopper({ email, code });
const byText = await renderClient.signInShopper({ phone, code });
```

Pass the same `email` or `phone` the code went to. `shopper.email` is null for an account made with a
phone that has no email yet (its orders appear once the shopper adds their email in My Account).

During checkout, signing in fills an empty contact and the default saved address, then call
`startCheckout` again: the new payment session lists the shopper's saved cards. Signing out works
the same way in reverse.
