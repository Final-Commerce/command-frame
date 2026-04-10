# row-updated Event

## Description

Published when an existing row is updated in a custom table.

## Event Type

- **Topic**: `custom-tables`
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
| `tableName` | `string` | Custom table name where the row was updated |
| `...` | `any` | Updated row fields as provided by the host event payload |

## Example Usage

```typescript
import { topics } from '@final-commerce/command-frame';
import type { RowUpdatedEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('custom-tables', (event: RowUpdatedEvent) => {
    if (event.type === 'row-updated') {
        console.log('Custom table row updated:', event.data.tableName, event.data);
    }
});
```

## Related Types

- `RowUpdatedPayload` - Event payload type
- `RowUpdatedEvent` - Full event type with topic, type, data, and timestamp
- `CustomTablesEventType` - Union of custom-table event IDs
- `CustomTablesEventPayload` - Union of custom-table payloads
