# get-active-order Event

## Description

Published when the active order is read or synchronized for extensions.

## Event Type

- **Topic**: `orders`
- **Event ID**: `get-active-order`

## Payload

```typescript
interface OrderActiveGetPayload {
    order: CFActiveOrder | null;
}
```
