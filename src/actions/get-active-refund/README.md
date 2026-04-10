# getActiveRefund

Returns the current refund selection / UI state (`refundDetails`), or `null` if not in a refund flow.

## Parameters

None.

## Response

| Field       | Type     | Description |
| :---------- | :------- | :---------- |
| `refund`    | [`CFActiveRefundDetails`](../../types/README.md) ` \| null` | |

## Example

```typescript
const { refund } = await command.getActiveRefund();
```

See [`setActiveRefund`](../set-active-refund/README.md).
