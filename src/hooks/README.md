# Hooks System

The hooks system allows iframe extensions to register **session-scoped event callbacks** that run in the host application (Render) context and persist across all page navigations -- even when the extension iframe is no longer on the current page.

## Hooks vs Pub/Sub

| Use case | Use this | Where it runs |
|----------|----------|---------------|
| UI reactions inside the extension (e.g. refresh display when cart changes) | Pub/Sub: `topics.subscribe()` | Extension iframe; fires only while iframe is on the current page |
| Business logic that must run on every event (e.g. log to custom tables, call a webhook) | Hooks: `hooks.register()` | Render host; runs on all pages for the whole session |

Pub/sub subscriptions are **page-scoped** (tied to the iframe lifecycle). Hooks are **session-scoped** and receive `hostCommands` and `callCommand` when they execute in the host.

## Quick Start

```typescript
import { hooks } from '@final-commerce/command-frame';

// Register a hook with a stable hookId
hooks.register('cart', async (event, hostCommands) => {
    await hostCommands.upsertCustomTableData({
        tableName: 'cart-events-log',
        data: { eventType: event.type, payload: event.data, timestamp: event.timestamp },
    });
}, { hookId: 'my-extension:cart-log' });

// Unregister when no longer needed
hooks.unregister('my-extension:cart-log');
```

## How It Works

1. The extension calls `hooks.register()`. The callback is serialized (`.toString()`) and sent to the host via `postMessage`.
2. The host (Render) reconstructs the function with `new Function()`, wraps it with `hostCommands` / `callCommand`, and stores it.
3. From that point on, the hook runs in the host context on every matching event, regardless of which page the user navigates to.
4. The iframe must load **at least once** for the hook to be registered. After that, the hook persists for the rest of the session.

## Deduplication

You must provide a **stable `hookId`** in the options. The host uses it as a dedup key:

- **Same `hookId` on re-register** (e.g. iframe reload): the existing hook is **replaced**. No duplicates.
- **Different `hookId` values**: each is stored independently. Multiple extensions (or multiple hooks from one extension) coexist on the same topic.

Choose a descriptive `hookId` that won't collide with other extensions, e.g. `your-extension-name:purpose`.

## API Reference

### `hooks.register(topic, callback, options)`

Registers a session-scoped hook for a topic. The callback is serialized and sent to the host.

**Parameters:**
- `topic: string` - The topic ID to hook into (e.g. `'cart'`, `'payments'`, `'orders'`)
- `callback: HookFunction` - The function to run on each event. Receives `(event, hostCommands, callCommand)`.
- `options: HookRegisterOptions` - Required options object:
  - `hookId: string` (required) - Stable identifier for deduplication
  - `eventTypes?: string[]` - Only fire for these event types; omit to receive all events

**Returns:** `string` - The `hookId` (same as `options.hookId`)

**Example:**
```typescript
hooks.register('payments', async (event, hostCommands) => {
    if (event.type === 'payment-done') {
        await hostCommands.triggerWebhook({
            webhookUrl: 'https://my-api.com/payment-done',
            payload: event.data,
        });
    }
}, { hookId: 'my-extension:payment-webhook' });
```

### `hooks.unregister(hookId)`

Removes a hook by its ID.

**Parameters:**
- `hookId: string` - The hook ID to remove

**Example:**
```typescript
hooks.unregister('my-extension:payment-webhook');
```

## Callback Signature

```typescript
type HookFunction = (
    event: TopicEvent,
    hostCommands: Record<string, (params?: any) => Promise<any>>,
    callCommand: (action: string, params?: any) => Promise<any>
) => void | Promise<void>;
```

- **`event`** - The topic event (`topic`, `type`, `data`, `timestamp`). Same shape as pub/sub events.
- **`hostCommands`** - Object of host command functions (e.g. `upsertCustomTableData`, `triggerWebhook`).
- **`callCommand`** - `(action, params?) => Promise<any>`. Use when the action name is dynamic.

## Self-Contained Constraint

The callback is **serialized** via `.toString()` and **reconstructed** in the host with `new Function()`. It must be **self-contained**:

- **Allowed:** Use `event`, `hostCommands`, and `callCommand` only.
- **Not allowed:** Closures, imports, or references to extension-local variables. These will cause `ReferenceError` at runtime (caught and logged by the host).

If you need configuration values (e.g. table name, webhook URL), encode them as literals inside the function body.

## Options Type

```typescript
interface HookRegisterOptions {
    /** Stable identifier for this hook. Used to deduplicate on reload. Must be unique per hook. */
    hookId: string;
    /** Only fire for these event types; omit to receive all events for the topic */
    eventTypes?: string[];
}
```

## Examples

### Log every cart change to a custom table

```typescript
import { hooks } from '@final-commerce/command-frame';

hooks.register('cart', async (event, hostCommands) => {
    await hostCommands.upsertCustomTableData({
        tableName: 'cart-events-log',
        data: {
            eventType: event.type,
            topic: event.topic,
            payload: event.data,
            timestamp: event.timestamp,
        },
    });
}, { hookId: 'my-extension:cart-events-log' });
```

### Webhook on payment completion

```typescript
hooks.register('payments', async (event, hostCommands) => {
    if (event.type === 'payment-done') {
        await hostCommands.triggerWebhook({
            webhookUrl: 'https://my-api.com/payment-done',
            payload: event.data,
        });
    }
}, { hookId: 'my-extension:payment-webhook' });
```

### Filtered hook (only specific event types)

```typescript
hooks.register(
    'cart',
    async (event, hostCommands) => {
        await hostCommands.upsertCustomTableData({
            tableName: 'product-changes',
            data: { type: event.type, data: event.data, timestamp: event.timestamp },
        });
    },
    { hookId: 'my-extension:product-changes', eventTypes: ['product-added', 'product-deleted'] }
);
```

### React component with hook registration

```typescript
import { useEffect } from 'react';
import { hooks } from '@final-commerce/command-frame';

function MyExtension() {
    useEffect(() => {
        hooks.register('cart', async (event, hostCommands) => {
            await hostCommands.upsertCustomTableData({
                tableName: 'cart-log',
                data: { type: event.type, data: event.data, ts: event.timestamp },
            });
        }, { hookId: 'my-extension:cart-log' });

        return () => {
            hooks.unregister('my-extension:cart-log');
        };
    }, []);

    return <div>Extension loaded. Hook registered.</div>;
}
```

## Available Topics

Hooks use the same topics as the pub/sub system. See the [Pub/Sub documentation](../pubsub/README.md) for the full list of topics and event types:

- [Cart](../pubsub/topics/cart/README.md) - Cart operation events (8 events)
- [Customers](../pubsub/topics/customers/README.md) - Customer lifecycle events (6 events)
- [Orders](../pubsub/topics/orders/README.md) - Order lifecycle events (2 events)
- [Payments](../pubsub/topics/payments/README.md) - Payment processing events (2 events)
- [Products](../pubsub/topics/products/README.md) - Product sync events (2 events)
- [Refunds](../pubsub/topics/refunds/README.md) - Refund lifecycle events (2 events)
- [Print](../pubsub/topics/print/README.md) - Print events (3 events)
