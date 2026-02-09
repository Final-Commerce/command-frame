# Print Topic

## Overview

The `print` topic provides events related to print actions. Subscribe to this topic to receive real-time notifications when print actions are started, completed, or encounter errors.

## Topic Information

- **Topic ID**: `print`
- **Name**: Print
- **Description**: Topic for print-related events

## Events

| Event                                          | Description                                          | Documentation                               |
| ---------------------------------------------- | ---------------------------------------------------- | ------------------------------------------- |
| [print-started](./print-started/README.md)     | Published when a print action is initiated           | [View Details](./print-started/README.md)   |
| [print-completed](./print-completed/README.md) | Published when a print action completes successfully | [View Details](./print-completed/README.md) |
| [print-error](./print-error/README.md)         | Published when a print action encounters an error    | [View Details](./print-error/README.md)     |

## Quick Start

### Subscribe to All Print Events

```typescript
import { topics } from "@final-commerce/command-frame";
import type { TopicEvent } from "@final-commerce/command-frame";

const subscriptionId = topics.subscribe("print", (event: TopicEvent) => {
    switch (event.type) {
        case "print-started":
            console.log("Print started:", event.data.type);
            break;
        case "print-completed":
            console.log("Print completed:", event.data.type);
            break;
        case "print-error":
            console.error("Print error:", event.data.error);
            break;
    }
});
```

## Type Safety

All event types are fully typed. Import specific event types for better type safety:

```typescript
import type {
    PrintStartedPayload,
    PrintStartedEvent,
    PrintCompletedPayload,
    PrintCompletedEvent,
    PrintErrorPayload,
    PrintErrorEvent,
    PrintEventType,
    PrintEventPayload
} from "@final-commerce/command-frame";
```

## Related Types

- `PrintEventType` - Union type of all print event IDs
- `PrintEventPayload` - Union type of all print event payloads
