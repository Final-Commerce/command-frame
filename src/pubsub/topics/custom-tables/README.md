# Custom Tables Topic

## Overview

The `custom-tables` topic provides lifecycle events for rows in host custom tables. Subscribe to this topic when your extension needs to react to row creation, updates, or deletion.

## Topic Information

- **Topic ID**: `custom-tables`
- **Name**: Custom Tables
- **Description**: Topic for custom table-related events

## Events

| Event | Description | Documentation |
|-------|-------------|---------------|
| [row-created](./row-created/README.md) | Fired when a row is created in a custom table | [View Details](./row-created/README.md) |
| [row-updated](./row-updated/README.md) | Fired when a row is updated in a custom table | [View Details](./row-updated/README.md) |
| [row-deleted](./row-deleted/README.md) | Fired when a row is deleted from a custom table | [View Details](./row-deleted/README.md) |

## Quick Start

```typescript
import { topics } from '@final-commerce/command-frame';
import type { TopicEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('custom-tables', (event: TopicEvent) => {
    switch (event.type) {
        case 'row-created':
            console.log('Row created:', event.data.tableName, event.data);
            break;
        case 'row-updated':
            console.log('Row updated:', event.data.tableName, event.data);
            break;
        case 'row-deleted':
            console.log('Row deleted:', event.data.tableName, event.data.rowId);
            break;
    }
});

// Later
topics.unsubscribe('custom-tables', subscriptionId);
```

## Type Safety

```typescript
import type {
    RowCreatedPayload,
    RowCreatedEvent,
    RowUpdatedPayload,
    RowUpdatedEvent,
    RowDeletedPayload,
    RowDeletedEvent,
    CustomTablesEventType,
    CustomTablesEventPayload
} from '@final-commerce/command-frame';
```

## Related Types

- `CustomTablesEventType` - Union type of all custom table event IDs
- `CustomTablesEventPayload` - Union type of all custom table payloads

