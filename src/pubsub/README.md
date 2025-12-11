# Pub/Sub System

The pub/sub system allows iframe applications to subscribe to topics and receive real-time events published by the host application (Render).

## Quick Start

```typescript
import { topics } from '@final-commerce/command-frame';

// Get available topics
const availableTopics = await topics.getTopics();

// Subscribe to a topic with a callback
const subscriptionId = topics.subscribe('customers', (event) => {
    console.log('Received event:', event.type, event.data);
});

// Unsubscribe when done
topics.unsubscribe('customers', subscriptionId);
```

## Available Topics

| Topic | Description | Events | Documentation |
|-------|-------------|--------|---------------|
| [customers](./topics/customers/README.md) | Customer lifecycle events | 6 events | [View Details](./topics/customers/README.md) |
| [orders](./topics/orders/README.md) | Order lifecycle events | 2 events | [View Details](./topics/orders/README.md) |
| [refunds](./topics/refunds/README.md) | Refund lifecycle events | 2 events | [View Details](./topics/refunds/README.md) |
| [products](./topics/products/README.md) | Product sync events | 2 events | [View Details](./topics/products/README.md) |
| [cart](./topics/cart/README.md) | Cart operation events | 8 events | [View Details](./topics/cart/README.md) |
| [payments](./topics/payments/README.md) | Payment processing events | 2 events | [View Details](./topics/payments/README.md) |

## API Reference

### `topics.getTopics()`

Retrieves the list of available topics from the host application.

**Returns:** `Promise<TopicDefinition[]>`

**Example:**
```typescript
const topics = await topics.getTopics();
topics.forEach(topic => {
    console.log(`Topic: ${topic.name} (${topic.id})`);
    console.log(`Event types: ${topic.eventTypes.map(et => et.id).join(', ')}`);
});
```

### `topics.subscribe(topic, callback)`

Subscribes to a topic and receives events via the callback function.

**Parameters:**
- `topic: string` - The topic ID to subscribe to
- `callback: (event: TopicEvent) => void` - Function called when an event is received

**Returns:** `string` - Subscription ID (use this to unsubscribe)

**Example:**
```typescript
const subscriptionId = topics.subscribe('customers', (event) => {
    console.log('Received event:', event.type);
    console.log('Event data:', event.data);
    console.log('Timestamp:', event.timestamp);
});
```

### `topics.unsubscribe(topic, subscriptionId)`

Unsubscribes from a topic using the subscription ID returned from `subscribe()`.

**Parameters:**
- `topic: string` - The topic ID
- `subscriptionId: string` - The subscription ID returned from `subscribe()`

**Returns:** `boolean` - `true` if successfully unsubscribed

**Example:**
```typescript
const success = topics.unsubscribe('customers', subscriptionId);
```

### `topics.unsubscribeAll(topic)`

Unsubscribes all callbacks for a specific topic.

**Parameters:**
- `topic: string` - The topic ID

**Returns:** `number` - Number of subscriptions removed

**Example:**
```typescript
const removed = topics.unsubscribeAll('customers');
console.log(`Removed ${removed} subscriptions`);
```

## Type Safety

All topics and events are fully typed. Import specific types for better type safety:

```typescript
import type {
    TopicDefinition,
    TopicEvent,
    TopicEventType,
    // Customer event types
    CustomerCreatedPayload,
    CustomerCreatedEvent,
    CustomerUpdatedPayload,
    CustomerUpdatedEvent,
    CustomerNoteAddedPayload,
    CustomerNoteAddedEvent,
    CustomerNoteDeletedPayload,
    CustomerNoteDeletedEvent,
    CustomerAssignedPayload,
    CustomerAssignedEvent,
    CustomerUnassignedPayload,
    CustomerUnassignedEvent,
    CustomersEventType,
    CustomersEventPayload
} from '@final-commerce/command-frame';
```

## Example: React Component with Pub/Sub

```typescript
import { useEffect, useState } from 'react';
import { topics, type TopicEvent } from '@final-commerce/command-frame';

function CustomerEvents() {
    const [events, setEvents] = useState<TopicEvent[]>([]);

    useEffect(() => {
        // Subscribe on mount
        const subscriptionId = topics.subscribe('customers', (event) => {
            setEvents(prev => [event, ...prev]);
        });

        // Unsubscribe on unmount
        return () => {
            topics.unsubscribe('customers', subscriptionId);
        };
    }, []);

    return (
        <div>
            <h2>Customer Events ({events.length})</h2>
            {events.map((event, index) => (
                <div key={index}>
                    <p>Type: {event.type}</p>
                    <pre>{JSON.stringify(event.data, null, 2)}</pre>
                </div>
            ))}
        </div>
    );
}
```

## Host Application (Render) - Publishing Events

In the Render application, use the `topicPublisher` to publish events:

```typescript
import { topicPublisher } from '@render/command-frame';
import type { CustomerCreatedPayload } from '@final-commerce/command-frame';

// When a customer is created
topicPublisher.publish('customers', 'customer-created', {
    customer: newCustomer
} as CustomerCreatedPayload);
```

The host application must register topics before they can be used. Topics are registered automatically when the `TopicPublisher` is initialized.

## Base Types

```typescript
interface TopicDefinition {
    id: string;
    name: string;
    description?: string;
    eventTypes: TopicEventType[];
}

interface TopicEvent<T = any> {
    topic: string;
    type: string;
    data: T;
    timestamp: string;
}

interface TopicEventType {
    id: string;
    name: string;
    description?: string;
}
```

## Documentation

For detailed documentation on each topic and its events, see:

- [Customers Topic](./topics/customers/README.md)
- [Orders Topic](./topics/orders/README.md)
- [Refunds Topic](./topics/refunds/README.md)
- [Products Topic](./topics/products/README.md)
- [Cart Topic](./topics/cart/README.md)
- [Payments Topic](./topics/payments/README.md)

