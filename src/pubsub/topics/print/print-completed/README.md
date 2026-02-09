# print-completed Event

## Description

Published when a print action completes successfully.

## Event Type

- **Topic**: `print`
- **Event ID**: `print-completed`

## Payload

```typescript
interface PrintCompletedPayload {
    type: "image" | "html" | "selector" | "receipt";
    orderId?: string; // For receipt type
    globalBlockId?: string; // For receipt type
}
```

### Payload Fields

| Field           | Type                                           | Description                              |
| --------------- | ---------------------------------------------- | ---------------------------------------- |
| `type`          | `"image" \| "html" \| "selector" \| "receipt"` | The type of print action that completed  |
| `orderId`       | `string?`                                      | The order ID when printing a receipt     |
| `globalBlockId` | `string?`                                      | The global block ID for receipt printing |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from "@final-commerce/command-frame";
import type { PrintCompletedEvent } from "@final-commerce/command-frame";

const subscriptionId = topics.subscribe("print", (event: PrintCompletedEvent) => {
    if (event.type === "print-completed") {
        console.log("Print completed:", event.data.type);
        if (event.data.orderId) {
            console.log("Order ID:", event.data.orderId);
        }
    }
});
```

### Publishing from Render app

```typescript
import { topicPublisher } from "@render/command-frame";
import type { PrintCompletedPayload } from "@final-commerce/command-frame";

// When a print action completes successfully
topicPublisher.publish("print", "print-completed", {
    type: "receipt",
    orderId: order._id,
    globalBlockId: "block-id-123"
} as PrintCompletedPayload);
```

## Related Types

- `PrintCompletedPayload` - Event payload type
- `PrintCompletedEvent` - Full event type with topic, type, data, and timestamp
