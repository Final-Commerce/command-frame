# setOrderAddress

Put a shipping or billing address on the cart. It is written onto the order at checkout.

```ts
await renderClient.setOrderAddress({
  type: 'shipping',
  address: {
    firstName: 'Sam',
    address1: '1 Water St',
    city: "St. John's",
    state: 'NL',
    postCode: 'A1C 5M2',
    country: 'CA',
  },
});
```

## How it fits with customers

Adding a customer to the cart fills an **empty** address from the customer's own copy. This
command is how the till or the shopper edits it before confirming. An edit changes the order's
copy only; the customer's saved address is never touched. Removing the customer clears an address
that came from them and wasn't edited.

## Guarantees

|                      |                                                                                        |
| -------------------- | -------------------------------------------------------------------------------------- |
| Stored form          | Country as ISO-2, province as its code, postal code tidied. Names are accepted.        |
| New shipping address | Re-checks the chosen shipping option; if it no longer applies, the cheapest is chosen. |
| `address: null`      | Clears it.                                                                             |
| Throws               | No country, a country it can't read, or a shipping address without street and city.    |

Served by the till and the website.
