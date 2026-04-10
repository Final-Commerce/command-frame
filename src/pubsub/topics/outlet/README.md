# Outlet Topic

## Topic Information

- **Topic ID**: `outlet`
- **Name**: Outlet
- **Description**: Active outlet context for the POS station

## Events

| Event | Description |
|-------|-------------|
| [set-active-outlet](./set-active-outlet/README.md) | Active outlet set in state |
| [get-active-outlet](./get-active-outlet/README.md) | Active outlet published to listeners |

## Quick Start

```typescript
import { topics } from '@final-commerce/command-frame';

topics.subscribe('outlet', event => {
    console.log(event.type, event.data);
});
```

## Type Safety

```typescript
import type { OutletEventType, OutletEventPayload } from '@final-commerce/command-frame';
```
