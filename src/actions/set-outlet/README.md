# setOutlet

Switches the shop to another of the company's locations.

```ts
await setOutlet({ outletId: outlet.id });
```

## It is not a display preference

An outlet decides three things, and this moves all three:

| | what follows the outlet |
|---|---|
| **tax** | rates come from the outlet's own address, so the total moves |
| **availability** | stock is per location, and a product can be hidden at one |
| **fulfilment** | the order records where the goods come from, so the right location's stock is drawn down |

So after it resolves, the cart totals a flow reads are the new location's. There
is nothing for the flow to recompute — read the cart again and render it.

## Only offer outlets that can take a payment

`setOutlet` refuses an outlet whose `connected` is `false`, because starting a
checkout against it fails. Filter the picker rather than relying on the refusal:

```tsx
const { outlets } = await getOutlets({ connectedOnly: true });
```

## Changing location mid-checkout is fine

Checkout starts when a shopper arrives, so an order usually already exists by
the time anyone changes their mind. It is re-priced and moved to the new outlet
in place, keeping its id and its receipt id — the shopper does not end up with
two orders, and the receipt number they may already have seen does not change.

## `rehydrated: false`

The switch took effect but the catalog and tax refresh could not reach the
server, so the shop is running on what it had cached. Totals may still be the
previous location's until the next refresh lands. Worth telling the shopper, or
retrying, rather than showing stale tax as if it were final.
