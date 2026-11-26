# getAddressDetails

The address the shopper picked from `searchAddresses`, as a full address in the cart's shape
(country `CA`, province `NL`). Storefront only.

```ts
const { success, address, reason } = await renderClient.getAddressDetails({ id: suggestion.id });
if (address) await renderClient.setOrderAddress({ type: 'shipping', address: { ...address, firstName, lastName } });
```

Fill the form with it and let the shopper edit; a place that is not a street address answers
`success: false` with a reason, and the typed text stays.
