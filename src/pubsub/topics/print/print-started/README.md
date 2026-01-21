# print-started Event

## Description

Published when a print action is initiated.

## Event Type

- **Topic**: `print`
- **Event ID**: `print-started`

## Payload

```typescript
interface PrintStartedPayload {
    type: "image" | "html" | "selector" | "receipt";
    options?: {
        margins?: {
            top?: number;
            right?: number;
            bottom?: number;
            left?: number;
        };
        paperSize?: string;
        width?: string;
    };
    orderId?: string; // For receipt type
    globalBlockId?: string; // For receipt type
}
```

### Payload Fields

| Field           | Type                                           | Description                                                      |
| --------------- | ---------------------------------------------- | ---------------------------------------------------------------- |
| `type`          | `"image" \| "html" \| "selector" \| "receipt"` | The type of print action being performed                         |
| `options`       | `PrintOptions?`                                | Optional print settings including margins, paper size, and width |
| `orderId`       | `string?`                                      | The order ID when printing a receipt                             |
| `globalBlockId` | `string?`                                      | The global block ID for receipt printing                         |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from "@final-commerce/command-frame";
import type { PrintStartedEvent } from "@final-commerce/command-frame";

const subscriptionId = topics.subscribe("print", (event: PrintStartedEvent) => {
    if (event.type === "print-started") {
        console.log("Print started:", event.data.type);
        if (event.data.orderId) {
            console.log("Order ID:", event.data.orderId);
        }
    }
});
```

### Publishing from Render app

```typescript
import { topicPublisher } from "@render/command-frame";
import type { PrintStartedPayload } from "@final-commerce/command-frame";

// When a print action is initiated
topicPublisher.publish("print", "print-started", {
    type: "receipt",
    orderId: order._id,
    globalBlockId: "block-id-123",
    options: {
        margins: { top: 10, right: 10, bottom: 10, left: 10 },
        paperSize: "A4"
    }
} as PrintStartedPayload);
```

## Related Types

- `PrintStartedPayload` - Event payload type
- `PrintStartedEvent` - Full event type with topic, type, data, and timestamp
