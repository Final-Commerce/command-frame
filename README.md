# @final-commerce/command-frame

A TypeScript library for type-safe communication between iframes and their parent windows in the Final Commerce ecosystem.

## Overview

Command Frame provides a structured way to build integrations that run inside Final Commerce applications (like Render POS or Manage Dashboard). It handles the underlying `postMessage` communication while enforcing strict type safety for both the host application (Provider) and the embedded app (Client).

The library provides three main capabilities:

| Capability | Purpose | Scope |
|-----------|---------|-------|
| **Commands** | Call host functions from the iframe (e.g. get products, open cash drawer) | Request/response per call |
| **Pub/Sub** | Subscribe to real-time events from the host (e.g. cart changes, payments) | Page-scoped (while iframe is mounted) |
| **Hooks** | Register business-logic callbacks that persist across all pages | Session-scoped (survives page navigation) |

## Installation

```bash
npm install @final-commerce/command-frame
```

## Commands

Commands let the extension iframe call typed functions on the host. Each host environment (Render, Manage) exposes its own set of commands.

### Render (POS System)

For building applications that run inside the Render Point of Sale interface.

- **[Render Documentation](./src/projects/render/README.md)**
- **Features:** Order management, Product catalog, Customer management, Payments, Hardware integration (Cash drawer, Printer), Custom tables, Secrets storage.

```typescript
import { RenderClient } from '@final-commerce/command-frame';

const client = new RenderClient();
const products = await client.getProducts();
```

### Manage (Dashboard)

For building applications that run inside the Final Commerce Management Dashboard.

- **[Manage Documentation](./src/projects/manage/README.md)**
- **Features:** Context information, Users & Roles, Customers, Custom tables, Secrets storage.

```typescript
import { ManageClient } from '@final-commerce/command-frame';

const client = new ManageClient();
const context = await client.getContext();
```

## Pub/Sub

The pub/sub system allows iframe extensions to subscribe to topics and receive real-time events published by the host (Render). Subscriptions are **page-scoped** -- they fire only while the iframe is mounted on the current page.

- **[Pub/Sub Documentation](./src/pubsub/README.md)**
- **Topics:** Cart (8 events), Customers (6), Orders (2), Payments (2), Products (2), Refunds (2), Print (3).

```typescript
import { topics } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('cart', (event) => {
    console.log('Cart event:', event.type, event.data);
});

// Unsubscribe when done
topics.unsubscribe('cart', subscriptionId);
```

## Hooks

Hooks are **session-scoped** event callbacks that run in the host (Render) context and persist across all page navigations -- even when the extension iframe is no longer on the current page. Use hooks for business logic that must run on every event (e.g. logging to custom tables, triggering webhooks).

- **[Hooks Documentation](./src/hooks/README.md)**
- The callback is serialized and sent to the host; it must be **self-contained** (no closures, no imports).
- A stable `hookId` is required for deduplication (safe on iframe reload).

```typescript
import { hooks } from '@final-commerce/command-frame';

hooks.register('cart', async (event, hostCommands) => {
    await hostCommands.upsertCustomTableData({
        tableName: 'cart-events-log',
        data: { eventType: event.type, payload: event.data, timestamp: event.timestamp },
    });
}, { hookId: 'my-extension:cart-log' });

// Unregister when no longer needed
hooks.unregister('my-extension:cart-log');
```

## Development & Testing

### Demo Mode / Mocking

Each client comes with built-in mock data for local development.

- If the application detects it is not running inside a valid host iframe, it automatically switches to **Mock Mode**.
- In Mock Mode, all API calls return local dummy data instead of failing.
- You can force Mock Mode by passing `mockMode: true` to the client constructor.

```typescript
const client = new RenderClient({ mockMode: true, debug: true });
```

### Debugging

Enable debug logging to see all message passing activity in the console:

```typescript
const client = new RenderClient({ debug: true });
```

Alternatively, set the global flag before initialization:

```typescript
(window as any).__POSTMESSAGE_DEBUG__ = true;
```

## License

MIT
