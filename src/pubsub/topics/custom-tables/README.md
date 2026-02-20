# Custom Tables Topic

## Overview

The `customTables` topic provides events related to custom table row operations. Subscribe to this topic to receive real-time notifications when rows are created, updated, or deleted in custom tables.

## Topic Information

- **Topic ID**: `customTables`
- **Name**: Custom Tables
- **Description**: Topic for custom table-related events

## Events

| Event | Description | Documentation |
|-------|-------------|---------------|
| [row-created](./row-created/README.md) | Fired when a new row is created in a custom table | [View Details](./row-created/README.md) |
| [row-updated](./row-updated/README.md) | Fired when a row is updated in a custom table | [View Details](./row-updated/README.md) |
| [row-deleted](./row-deleted/README.md) | Fired when a row is deleted from a custom table | [View Details](./row-deleted/README.md) |

## Quick Start

### Subscribe to All Custom Table Events

```typescript
import { topics } from '@final-commerce/command-frame';
import type { TopicEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('customTables', (event: TopicEvent) => {
    switch (event.type) {
        case 'row-created':
            console.log('Row created in table:', event.data.tableName);
            break;
        case 'row-updated':
            console.log('Row updated in table:', event.data.tableName);
            break;
        case 'row-deleted':
            console.log('Row deleted from table:', event.data.tableName, 'rowId:', event.data.rowId);
            break;
    }
});
```

## Type Safety

All event types are fully typed. Import specific event types for better type safety:

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
- `CustomTablesEventPayload` - Union type of all custom table event payloads
