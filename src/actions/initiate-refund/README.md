# initiateRefund

> **DEPRECATED** — the host-side refund popup is disabled (kaching ≥1.9.5-preprod.4); this command no longer opens any UI. It still stages the given/active order and, with no `orderId`, arms barcode refund-scan routing. Build the refund UI in your flow with `getRefundPlan`, `getRemainingRefundableQuantities`, `processPartialRefund`, and `redeemRefund`.

Stages the specified order (or the currently active order) as the refund target. Historically this opened the host's refund popup — it no longer does.

## Parameters

- `orderId` (string, optional): The ID of the order to refund. If not provided, uses the currently active order.

## Response

```typescript
{
  success: boolean;
  orderId: string;
  timestamp: string;
}
```

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

// Initiate refund for a specific order
await command.initiateRefund({
  orderId: '691df9c6c478bada1fb23d31',
});

// Initiate refund for the active order
await command.initiateRefund();
```

## Notes

- No UI opens (deprecated popup); the order is staged as the active refund target
- The actual refund processing happens through the UI
- If `orderId` is provided, that order is set as the active order
- If no `orderId` is given and no order is currently active, this does **not** throw: kaching enters refund-scan mode instead — the next barcode scan selects the order (announced on the `barcode` topic as `refund-order-selected`) — and the call resolves with `{ success: true, orderId: '', timestamp }`

## Error Handling

- Throws an error if `orderId` is provided but the order is not found (`Order with ID {orderId} not found`)
