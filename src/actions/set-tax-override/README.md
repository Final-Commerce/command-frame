# setTaxOverride

Turns **all tax off — or back on — for one cart line or the whole sale**, before payment. Staff decide; the till never does it on its own. The change is recorded on the line (and on the sale, in whole-sale mode) as a `taxOverride`: the kind of untaxed sale (`not_charged`), who turned it off (`source: 'staff'`, `userId`), when (`at`), on which till (`stationId`) and an optional note. That record travels with the order, syncs to other stations and stays on the order after payment.

The line keeps its catalogue product, variant and tax group — it is never swapped for a custom amount — so turning tax back on simply taxes it again. The host recalculates the cart with its normal tax engine: an untaxed line's tax is `0`, its modifiers, fees and composite parts are untaxed too, and refunds later return the tax that was actually charged (`0` on an untaxed line).

## Parameters

`params: SetTaxOverrideParams`

| Parameter    | Type      | Required | Description                                                                                                                                                                |
| :----------- | :-------- | :------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `internalId` | `string`  | `false`  | The cart line: a product's or booking's `internalId`, or a custom sale's `id`, as [`getCurrentCart`](../get-current-cart/README.md) returns them. Omit for the whole sale. |
| `taxOff`     | `boolean` | `true`   | `true` turns all tax off, `false` turns it back on.                                                                                                                        |
| `note`       | `string`  | `false`  | Optional free text kept with the record, at most 500 characters. Never required. Ignored when turning tax on.                                                              |

### One line or the whole sale

| Call                                               | Result                                                                                                                                                                                                          |
| :------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `{ internalId, taxOff: true }`                     | That line (with its modifiers, fees and components) is untaxed.                                                                                                                                                 |
| `{ taxOff: true }`                                 | Whole sale: every product, booking, custom sale, cart fee and the shipping are untaxed, and **lines added afterwards come in untaxed**. Each line also carries its own `taxOverride`; the cart carries one too. |
| `{ taxOff: false }`                                | Clears every override in the sale.                                                                                                                                                                              |
| `{ internalId, taxOff: false }` in whole-sale mode | That line is taxed again and the sale leaves whole-sale mode; the other lines stay untaxed.                                                                                                                     |

### Tax-inclusive prices

With tax-inclusive prices the **price paid does not change** — the shop absorbs the tax, exactly as for a product with no tax group in Hub. With tax-exclusive prices the total drops by the tax.

## Response

`Promise<SetTaxOverrideResponse>`

| Field         | Type                    | Description                                                            |
| :------------ | :---------------------- | :--------------------------------------------------------------------- |
| `success`     | `boolean`               | `true` if the change was applied.                                      |
| `internalId`  | `string \| null`        | The line that changed, or `null` for the whole sale.                   |
| `taxOff`      | `boolean`               | As requested.                                                          |
| `taxOverride` | `CFTaxOverride \| null` | The record now on the line or the sale, or `null` when tax is back on. |
| `timestamp`   | `string`                | ISO date string of when the action occurred.                           |

`CFTaxOverride`: `{ type: 'not_charged' | 'exempt' | 'zero_rated', source: 'staff' | 'rule' | 'customer', userId?: string | null, at: string, stationId?: string | null, note?: string }`. This command always writes `not_charged` / `staff`; the other values are reserved for later triggers (tax rules, exempt customers), which report differently on a GST/HST return.

## Reading it back

[`getCurrentCart`](../get-current-cart/README.md) returns the repriced cart: each untaxed product, booking and custom sale carries `taxOverride`, and `cart.taxOverride` is set in whole-sale mode. Orders keep the same fields — `lineItems[].taxOverride`, `reservations[].taxOverride`, `customSales[].taxOverride` and `order.taxOverride` — through [`getOrders`](../get-orders/README.md). The host also publishes cart [`tax-override-changed`](../../pubsub/topics/cart/README.md) `{ internalId, taxOverride, cart }`.

**Receipts:** show an untaxed line's tax as `$0.00 — tax not charged` from `taxOverride`, rather than leaving the tax row out. A total that is only lower than usual is not enough.

## Example Usage

```typescript
import { command } from '@final-commerce/command-frame';

// One line
const { cart } = await command.getCurrentCart();
const line = cart.products[0];
await command.setTaxOverride({ internalId: line.internalId, taxOff: true, note: 'Status card shown' });

// The whole sale, then back on
await command.setTaxOverride({ taxOff: true });
await command.setTaxOverride({ taxOff: false });

// A toggle that reflects the cart
const { cart: after, itemsLocked } = await command.getCurrentCart();
const isOff = (l: { taxOverride?: unknown }) => Boolean(l.taxOverride);
const disabled = itemsLocked; // no tax changes once payment has started
```

## Error Handling

Throws when:

- **The order already has a payment on it** — the same refusal every value-changing cart command gives (`setTaxOverride: this order already has a payment on it, so its items, amounts and customer can no longer be changed. …`). Check `itemsLocked` from `getCurrentCart` to disable the control up front. After payment, tax can only change through a recorded refund.
- `taxOff` is not a boolean.
- `internalId` matches no line in the cart.
- `note` is longer than 500 characters.

## Notes

- **No permission or reason is required** in this version: anyone on the till can use it, and the record says who did.
- **Offline:** works offline like every other cart change; the record syncs with the order.
- **Demo mock:** records the override where the host does (lines and cart) but, like every mock, computes no tax.
