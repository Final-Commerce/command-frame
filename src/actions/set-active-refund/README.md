# setActiveRefund

Loads the order for the given `orderId`, sets it as the active order, and resets refund details to a fresh state. (The host-side refund popup is disabled as of kaching 1.9.5-preprod.4 — no UI opens; flows own the refund UI.)

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
