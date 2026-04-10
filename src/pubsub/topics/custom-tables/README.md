# Custom Tables Topic

## Overview

The `custom-tables` topic provides events for row-level lifecycle changes in custom tables.
Subscribe to this topic to react to row creation, updates, and deletion events emitted by the host.

## Topic Information

- **Topic ID**: `custom-tables`
- **Name**: Custom Tables
- **Description**: Topic for custom table-related events

## Events

| Event | Description |
|-------|-------------|
| `row-created` | Fired when a new row is created in a custom table |
| `row-updated` | Fired when an existing row is updated in a custom table |
| `row-deleted` | Fired when a row is deleted from a custom table |

## Quick Start

```typescript
import { topics } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('custom-tables', (event) => {
    switch (event.type) {
        case 'row-created':
            console.log('Row created in table:', event.data.tableName, event.data);
            break;
        case 'row-updated':
            console.log('Row updated in table:', event.data.tableName, event.data);
            break;
        case 'row-deleted':
            console.log('Row deleted in table:', event.data.tableName, 'rowId:', event.data.rowId);
            break;
    }
});

// Cleanup
topics.unsubscribe('custom-tables', subscriptionId);
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

## Payload Shapes

```typescript
interface RowCreatedPayload {
    tableName: string;
    [key: string]: any;
}

interface RowUpdatedPayload {
    tableName: string;
    [key: string]: any;
}

interface RowDeletedPayload {
    tableName: string;
    rowId: string;
}
```

## Notes and Constraints

- `row-created` and `row-updated` intentionally allow additional fields (`[key: string]: any`) because row schemas are custom-table specific.
- `row-deleted` includes a stable `rowId` and `tableName` so consumers can remove local cache entries deterministically.
- Hooks can register on the same `custom-tables` topic when logic must persist for the full session.

## Related Types

- `CustomTablesEventType` - Union type of all custom-table event IDs
- `CustomTablesEventPayload` - Union type of all custom-table event payloads
