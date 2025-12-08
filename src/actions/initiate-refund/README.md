# initiateRefund

Opens the refund UI for the specified order or the currently active order.

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
import { commands } from '@final-commerce/command-frame';

// Initiate refund for a specific order
await commands.initiateRefund({
  orderId: '691df9c6c478bada1fb23d31'
});

// Initiate refund for the active order
await commands.initiateRefund();
```

## Notes

- This opens the refund UI modal in the parent application
- The actual refund processing happens through the UI
- If orderId is provided, that order will be set as active before opening the refund UI

## Error Handling

- Throws an error if orderId is provided but the order is not found
- Throws an error if no active order exists and no orderId is provided

