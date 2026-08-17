# removeProductFee

Clears all fees from a specific cart line item, or from the current active product if no `internalId` is given.

## Parameters

### `RemoveProductFeeParams`

```typescript
interface RemoveProductFeeParams {
    internalId?: string;
}
```

#### `internalId` (optional)

The `internalId` of the cart line item to clear fees from. This ID is returned in the response of `addProductToCart` or `getCurrentCart`. If omitted, fees are cleared from the current active product context instead; if there is no `internalId` and no active product, the call throws.

## Response

### `RemoveProductFeeResponse`

```typescript
interface RemoveProductFeeResponse {
    success: boolean;
    internalId?: string;  // Only present when internalId was passed in the request
    timestamp: string;
}
```

## Usage Example

```typescript
import { command } from '@final-commerce/command-frame';

// Clear all fees from a specific cart item
await command.removeProductFee({ internalId: 'abc123' });

// Clear all fees from the current active product
await command.removeProductFee();
```

## Error Handling

- Throws `Product with ID ${internalId} not found in cart` if `internalId` is provided but doesn't match any item currently in the cart.
- Throws `No active product. Provide internalId or use setActiveProduct first.` if `internalId` is omitted and there is no active product context to fall back to.

## Events

Publishes a `product-fee-removed` event on the `cart` topic with the updated product and (when provided) the `internalId` that was cleared.
