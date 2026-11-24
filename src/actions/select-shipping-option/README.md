# selectShippingOption

Choose one of the options `getShippingOptions` listed.

```ts
await renderClient.selectShippingOption({ optionId });
```

The cart re-prices: its totals include shipping and the tax on it. On a website the order is
re-priced on the server before payment, so the amount charged is always the server's.

| name       | required | notes                                         |
| ---------- | -------- | --------------------------------------------- |
| `optionId` | yes      | From `getShippingOptions`. `null` removes it. |

Throws for an option this cart isn't offered (another address, website-only at the till, or
removed since). Served by the till and the website.
