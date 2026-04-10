# set-active-order Event

## Description

Published when the active order is set in POS state (e.g. after `setActiveOrder`).

## Event Type

- **Topic**: `orders`
- **Event ID**: `set-active-order`

## Payload

```typescript
interface OrderActiveSetPayload {
    order: CFActiveOrder;
}
```

## Example

```typescript
topics.subscribe('orders', event => {
    if (event.type === 'set-active-order') {
        console.log(event.data.order);
    }
});
```
