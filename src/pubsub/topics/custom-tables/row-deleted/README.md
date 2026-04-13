# row-deleted Event

## Description

Published when a row is removed from a custom table.

## Event Type

- **Topic**: `custom-tables`
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
| `tableName` | `string` | Name of the custom table where the deletion happened. |
| `rowId` | `string` | Identifier of the deleted row. |

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from '@final-commerce/command-frame';
import type { RowDeletedEvent } from '@final-commerce/command-frame';

topics.subscribe('custom-tables', (event: RowDeletedEvent) => {
    if (event.type === 'row-deleted') {
        console.log('Custom table row deleted:', event.data.tableName, event.data.rowId);
    }
});
```

## Related Types

- `RowDeletedPayload` - Event payload type
- `RowDeletedEvent` - Full event envelope (`topic`, `type`, `data`, `timestamp`)
- [`CFCustomTable`](../../../../types/README.md#cfcustomtable) - Table definition

