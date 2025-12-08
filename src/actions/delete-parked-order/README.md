# deleteParkedOrder

Deletes a parked order from the system.

## Parameters

- `orderId` (string, required): The ID of the parked order to delete

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

// Delete a parked order
await command.deleteParkedOrder({
  orderId: '691df9c6c478bada1fb23d31'
});
```

## Error Handling

- Throws an error if orderId is missing
- Throws an error if the order is not found
- Throws an error if the order cannot be deleted

