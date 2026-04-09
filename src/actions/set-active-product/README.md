# setActiveProduct

Sets a product as the active product in the POS interface by its variant ID. The active product represents the item currently being viewed or interacted with by the user.

## Parameters

```typescript
interface SetActiveProductParams {
    variantId: string;
}
```

| Field       | Type     | Required | Description                          |
| :---------- | :------- | :------- | :----------------------------------- |
| `variantId` | `string` | Yes      | The variant identifier of the product to set as active. |

## Response

`Promise<SetActiveProductResponse>`

| Field       | Type              | Description                                      |
| :---------- | :---------------- | :----------------------------------------------- |
| `success`   | `boolean`         | `true` if the active product was set successfully. |
| `product`   | `CFActiveProduct` | The product that was set as active.               |
| `timestamp` | `string`          | ISO date string of when the action occurred.      |

**Tip:** You can import [`CFActiveProduct`](../../types/README.md#cfactiveproduct) directly from the library:
```typescript
import { type CFActiveProduct } from '@final-commerce/command-frame';
```

## Product Object Structure

The returned `CFActiveProduct` object includes:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | Product identifier |
| `internalId` | `string` | Yes | Unique cart line-item identifier |
| `externalId` | `string` | Yes | External product identifier |
| `productExternalId` | `string` | Yes | External product-level identifier |
| `variantId` | `string` | Yes | Variant identifier |
| `name` | `string` | Yes | Product display name |
| `sku` | `string` | Yes | Stock keeping unit |
| `price` | `number` | Yes | Unit price |
| `images` | `string[]` | Yes | Product image URLs |
| `taxTableId` | `string` | Yes | Tax table identifier |
| `quantity` | `number` | Yes | Quantity in the cart |
| `stock` | `number` | Yes | Available stock count |
| `note` | `string` | No | Product-level note |
| `discount` | `CFDiscount` | No | Discount applied to the product |
| `description` | `string` | No | Short product description |
| `longDescription` | `string` | No | Full product description |
| `shortDescription` | `string` | No | Brief product description |
| `barcodeId` | `string` | No | Barcode identifier |
| `allowBackOrder` | `boolean` | No | Whether back-ordering is allowed |
| `fee` | `CFCustomFee` | No | Custom fee applied to the product |
| `isUnlimited` | `boolean` | No | Whether stock is unlimited |
| `attributes` | `string` | No | Product attributes |
| `localQuantity` | `number` | No | Locally tracked quantity |

## Example Usage

```typescript
import { command } from '@final-commerce/command-frame';

try {
  const result = await command.setActiveProduct({ variantId: "variant-456" });

  console.log('Active product set:', result.product.name);
  console.log('Price:', result.product.price);

  // Expected output:
  // {
  //   success: true,
  //   product: {
  //     id: '123',
  //     variantId: 'variant-456',
  //     name: 'Example Product',
  //     sku: 'EX-001',
  //     price: 19.99,
  //     quantity: 1,
  //     stock: 50,
  //     images: ['https://...'],
  //     ...
  //   },
  //   timestamp: '2023-10-27T10:00:00.000Z'
  // }

} catch (error) {
  console.error('Failed to set active product:', error);
}
```

## Error Handling

The command will throw an error if:
- `variantId` is not provided
- The product with the given variant ID is not found

## Notes

- Use this action to programmatically highlight or focus a product in the POS interface.
- After setting the active product, it can be retrieved using [`getActiveProduct`](../get-active-product/README.md).
- Useful for building extensions that guide the user to a specific product, such as search results or recommendation flows.
