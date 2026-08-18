# setActiveRefund

Loads the order for the given `orderId`, sets it as the active order, resets refund details to a fresh state, and shows the refund UI.

## Parameters

| Field      | Type     | Required |
| :--------- | :------- | :------- |
| `orderId`  | `string` | Yes      |

## Response

```typescript
{
  success: boolean;
  refund: CFActiveRefundDetails;
  timestamp: string;
}
```

`refund` is the reset refund state ([`CFActiveRefundDetails`](../../types/README.md)).

## Example

```typescript
await command.setActiveRefund({ orderId: 'order_123' });
```

For full refund UX, use [`initiateRefund`](../initiate-refund/README.md) as well when appropriate.

## Error Handling

- Throws if `orderId` is not provided (`Order ID is required`)
- Throws if the order is not found (`Order with ID {orderId} not found`)
