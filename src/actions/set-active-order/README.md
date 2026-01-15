# setActiveOrder

Sets an order as the active order in the store by fetching it from the database using the order ID.

## Parameters

```typescript
interface SetActiveOrderParams {
    orderId: string;
}
```

## Response

```typescript
{
    success: boolean;
    order: CFOrder;
    timestamp: string;
}
```

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

await command.setActiveOrder({ orderId: "order-123" });
```

## Notes

- The order must exist in the database
- After setting the order as active, it can be used for operations like printing receipts
- If the order is not found, an error will be thrown

## Error Handling

The command will throw an error if:
- Order ID is not provided
- Order with the given ID is not found in the database
