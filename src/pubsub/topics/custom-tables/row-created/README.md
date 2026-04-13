# row-created Event

## Description

Published when a new row is created in a custom table.

## Event Type

- **Topic**: `custom-tables`
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
| `tableName` | `string` | Name of the custom table where the row was created. |
| `...` | `any` | Additional row fields published by the host. |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from '@final-commerce/command-frame';
import type { RowCreatedEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('custom-tables', (event: RowCreatedEvent) => {
    if (event.type === 'row-created') {
        console.log('Row created in table:', event.data.tableName);
        console.log('Row payload:', event.data);
    }
});
```

## Related Types

- `RowCreatedPayload` - Event payload type
- `RowCreatedEvent` - Full event type with topic, type, data, and timestamp
- `CustomTablesEventType` - Union of all custom-tables event IDs

