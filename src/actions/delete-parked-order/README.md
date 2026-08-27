# deleteParkedOrder

Deletes a parked order. This is a state transition, not a database delete: the order moves to `voided` × `cancelled` state and remains in the database (the legacy `status` field is stamped, not the record itself). Only succeeds on an order currently in `parked` status.

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

- Throws `Order ID is required` if `orderId` is missing
- Throws `Order with ID {orderId} not found` if no order exists with that ID
- Throws `Order {orderId} is not a parked order and cannot be deleted via delete-parked-order` if the order's status isn't `parked`

