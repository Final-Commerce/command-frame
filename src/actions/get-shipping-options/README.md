# getShippingOptions

What the cart's shipping address can choose, priced for this cart and ready to show.

```ts
const { required, options, message } = await renderClient.getShippingOptions();
```

Takes no parameters: it reads the cart's shipping address (`setOrderAddress`) and the channel it
runs on. The flow computes nothing; names, prices, "Free", the free-shipping hint and arrival dates
come from the runtime.

| field      | meaning                                                                                          |
| ---------- | ------------------------------------------------------------------------------------------------ |
| `required` | `false`: the store doesn't ship or the cart has nothing to ship. Show no shipping step.          |
| `options`  | Ship options cheapest first, then pickups. `selected` marks the one on the cart.                 |
| `reason`   | Why `options` is empty: `INCOMPLETE`, `ADDRESS_MISMATCH`, `NO_COVERAGE`, `BLOCKED`, `NO_OPTION`. |
| `message`  | What to tell the customer when nothing applies.                                                  |

The till never sees pickup or website-only options. Served by the till and the website.
