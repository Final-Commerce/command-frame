# print-error Event

## Description

Published when a print action encounters an error.

## Event Type

- **Topic**: `print`
- **Event ID**: `print-error`

## Payload

```typescript
interface PrintErrorPayload {
    type: "image" | "html" | "selector" | "receipt";
    error: string;
    orderId?: string; // For receipt type
    globalBlockId?: string; // For receipt type
}
```

### Payload Fields

| Field           | Type                                           | Description                                  |
| --------------- | ---------------------------------------------- | -------------------------------------------- |
| `type`          | `"image" \| "html" \| "selector" \| "receipt"` | The type of print action that failed         |
| `error`         | `string`                                       | The error message describing what went wrong |
| `orderId`       | `string?`                                      | The order ID when printing a receipt         |
| `globalBlockId` | `string?`                                      | The global block ID for receipt printing     |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from "@final-commerce/command-frame";
import type { PrintErrorEvent } from "@final-commerce/command-frame";

const subscriptionId = topics.subscribe("print", (event: PrintErrorEvent) => {
    if (event.type === "print-error") {
        console.error("Print error:", event.data.error);
        console.log("Print type:", event.data.type);
        if (event.data.orderId) {
            console.log("Order ID:", event.data.orderId);
        }
    }
});
```

### Publishing from Render app

```typescript
import { topicPublisher } from "@render/command-frame";
import type { PrintErrorPayload } from "@final-commerce/command-frame";

// When a print action encounters an error
topicPublisher.publish("print", "print-error", {
    type: "receipt",
    error: "No active order found. Please provide an order or ensure there is an active order in the store.",
    orderId: order?._id,
    globalBlockId: "block-id-123"
} as PrintErrorPayload);
```

## Related Types

- `PrintErrorPayload` - Event payload type
- `PrintErrorEvent` - Full event type with topic, type, data, and timestamp
