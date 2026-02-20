# row-deleted Event

## Description

Fired when a row is deleted from a custom table.

## Event Type

- **Topic**: `customTables`
- **Event ID**: `row-deleted`

## Payload

```typescript
interface RowDeletedPayload {
    tableName: string;
    rowId: string;
}
```

### Payload Fields

| Field | Type | Description |
|-------|------|-------------|
| `tableName` | `string` | The name of the custom table where the row was deleted. |
| `rowId` | `string` | The ID of the deleted row. |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from '@final-commerce/command-frame';
import type { RowDeletedEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('customTables', (event: RowDeletedEvent) => {
    if (event.type === 'row-deleted') {
        console.log('Row deleted from table:', event.data.tableName, 'rowId:', event.data.rowId);
    }
});
```

## Related Types

- `RowDeletedPayload` - Event payload type
- `RowDeletedEvent` - Full event type with topic, type, data, and timestamp
