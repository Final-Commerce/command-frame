# getShopperAccount

Who is signed in at this store's website, their saved addresses, and the account boxes for the
checkout. Storefront only.

```ts
const { signedIn, shopper, addresses, boxes } = await renderClient.getShopperAccount();
```

Show `boxes` on the contact step as they come (label and default), and send their values with
`attachCheckoutContact`:

- a guest gets "Track this order and check out faster next time" (`accountOptIn`) and the news box
  (`marketingOptIn`);
- a signed-in shopper gets the news box and "Save this address" (`saveAddress`, ticked).

`addresses` (signed in only) lets a shopper pick another saved address; each has a ready `line`.
Signing in already fills the contact and the default address into an empty checkout. Cards, address
editing and the rest of the account live in My Account: link to it, never build them.
