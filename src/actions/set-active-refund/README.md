# setActiveRefund

Initializes or updates refund details for the given `orderId` (host loads order and refund state).

## Parameters

| Field      | Type     | Required |
| :--------- | :------- | :------- |
| `orderId`  | `string` | Yes      |

## Response

Returns `refund` ([`CFActiveRefundDetails`](../../types/README.md)).

## Example

```typescript
await command.setActiveRefund({ orderId: 'order_123' });
```

For full refund UX, use [`initiateRefund`](../initiate-refund/README.md) as well when appropriate.
