# deleteProduct

Deletes a product from the catalog (soft delete).

## Parameters

### `DeleteProductParams`

```typescript
interface DeleteProductParams {
    productId: string;
}
```

#### `productId` (required)

The ID of the product to delete.

## Response

### `DeleteProductResponse`

```typescript
interface DeleteProductResponse {
    success: boolean;
    timestamp: string;
}
```

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

const result = await command.deleteProduct({
    productId: '64abc123def456',
});
console.log(result.success); // true
```
