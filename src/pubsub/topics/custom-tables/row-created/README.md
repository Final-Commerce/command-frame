# row-created Event

## Description

Fired when a new row is created in a custom table.

## Event Type

- **Topic**: `customTables`
- **Event ID**: `row-created`

## Payload

```typescript
interface RowCreatedPayload {
    tableName: string;
    [key: string]: any;
}
```

### Payload Fields

| Field | Type | Description |
|-------|------|-------------|
| `tableName` | `string` | The name of the custom table where the row was created. |
| `[key: string]` | `any` | Dynamic fields representing the row data columns. |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from '@final-commerce/command-frame';
import type { RowCreatedEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('customTables', (event: RowCreatedEvent) => {
    if (event.type === 'row-created') {
        console.log('New row created in table:', event.data.tableName);
    }
});
```

## Related Types

- `RowCreatedPayload` - Event payload type
- `RowCreatedEvent` - Full event type with topic, type, data, and timestamp
