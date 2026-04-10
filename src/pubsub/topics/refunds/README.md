# Refunds Topic

## Overview

The `refunds` topic provides events related to refund lifecycle. Subscribe to this topic to receive real-time notifications when refunds are created or updated, when active refund selection state changes, or when the host publishes a refund snapshot.

## Topic Information

- **Topic ID**: `refunds`
- **Name**: Refunds
- **Description**: Topic for refund-related events

## Events

| Event | Description | Documentation |
|-------|-------------|---------------|
| [refund-created](./refund-created/README.md) | Published when a new refund is created | [View Details](./refund-created/README.md) |
| [refund-updated](./refund-updated/README.md) | Published when a refund is updated | [View Details](./refund-updated/README.md) |
| [set-active-refund](./set-active-refund/README.md) | Published when active refund selection state changes | [View Details](./set-active-refund/README.md) |
| [get-active-refund](./get-active-refund/README.md) | Reserved for host publish of refund snapshots | [View Details](./get-active-refund/README.md) |

## Quick Start

### Subscribe to All Refund Events

```typescript
import { topics } from '@final-commerce/command-frame';
import type { TopicEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('refunds', (event: TopicEvent) => {
    switch (event.type) {
        case 'refund-created':
            console.log('New refund created:', event.data.refund);
            break;
        case 'refund-updated':
            console.log('Refund updated:', event.data.refund);
            break;
        case 'set-active-refund':
            console.log('Active refund state:', event.data.refund);
            break;
        case 'get-active-refund':
            console.log('Active refund snapshot:', event.data.refund);
            break;
    }
});
```

## Type Safety

All event types are fully typed. Import specific event types for better type safety:

```typescript
import type {
    RefundCreatedPayload,
    RefundCreatedEvent,
    RefundUpdatedPayload,
    RefundUpdatedEvent,
    RefundActiveSetPayload,
    RefundActiveSetEvent,
    RefundActiveGetPayload,
    RefundActiveGetEvent,
    RefundsEventType,
    RefundsEventPayload
} from '@final-commerce/command-frame';
```

## Related Types

- `CFRefundItem` - Refund type from CommonTypes
- `RefundsEventType` - Union type of all refund event IDs
- `RefundsEventPayload` - Union type of all refund event payloads

