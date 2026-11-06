# searchAddresses

Address autocomplete for the checkout's address form. Storefront only.

```ts
const { suggestions, available } = await renderClient.searchAddresses({ query: '12 water st' });
// show suggestions[].main / .secondary in a dropdown under the street field

const { address } = await renderClient.getAddressDetails({ id: picked.id });
if (address) await renderClient.setOrderAddress({ type: 'shipping', address });
```

Call it as the shopper types the street, about 250 ms after the last keystroke, from 3 characters.
`country` defaults to the store's own. When `available` is false (the site has no lookup), stop
asking and keep the plain fields; the shopper can always type the address by hand.
