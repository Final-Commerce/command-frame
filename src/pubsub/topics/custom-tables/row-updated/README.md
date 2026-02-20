# row-updated Event

## Description

Fired when a row is updated in a custom table.

## Event Type

- **Topic**: `customTables`
- **Event ID**: `row-updated`

## Payload

```typescript
interface RowUpdatedPayload {
    tableName: string;
    [key: string]: any;
}
```

### Payload Fields

| Field | Type | Description |
|-------|------|-------------|
| `tableName` | `string` | The name of the custom table where the row was updated. |
| `[key: string]` | `any` | Dynamic fields representing the updated row data columns. |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from '@final-commerce/command-frame';
import type { RowUpdatedEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('customTables', (event: RowUpdatedEvent) => {
    if (event.type === 'row-updated') {
        console.log('Row updated in table:', event.data.tableName);
    }
});
```

## Related Types

- `RowUpdatedPayload` - Event payload type
- `RowUpdatedEvent` - Full event type with topic, type, data, and timestamp
