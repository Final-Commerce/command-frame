# getActiveProduct

Retrieves the currently selected/active product in the POS interface. Returns the product that is currently being viewed or interacted with by the user.

## Parameters

None.

## Response

`Promise<GetActiveProductResponse>`

| Field       | Type     | Description                               |
| :---------- | :------- | :---------------------------------------- |
| `success`   | `boolean` | `true` if the active product was retrieved successfully. |
| `product`   | `CFActiveProduct \| null` | The currently active product, or `null` if no product is selected. |
| `timestamp` | `string` | ISO date string of when the action occurred. |

**Tip:** You can import [`CFActiveProduct`](../../types/README.md#cfactiveproduct) directly from the library:
```typescript
import { type CFActiveProduct } from '@final-commerce/command-frame';
```

## Product Object Structure

When a product is active, the returned `CFActiveProduct` object includes:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | Product identifier |
| `internalId` | `string` | Yes | Unique cart line-item identifier |
| `externalId` | `string` | Yes | External product identifier |
| `productExternalId` | `string` | Yes | External product-level identifier |
| `variantId` | `string` | Yes | Variant identifier |
| `name` | `string` | Yes | Product display name |
| `sku` | `string` | Yes | Stock keeping unit |
| `price` | `number` | Yes | Unit price, in integer minor currency units (e.g. `1999` = $19.99) |
| `images` | `string[]` | Yes | Product image URLs |
| `taxTableId` | `string` | Yes | Tax table identifier |
| `quantity` | `number` | Yes | Quantity in the cart |
| `stock` | `number` | Yes | Available stock count |
| `note` | `string` | No | Product-level note |
| `discounts` | `CFDiscount[]` | No | Discounts applied to the product |
| `description` | `string` | No | Short product description |
| `longDescription` | `string` | No | Full product description |
| `shortDescription` | `string` | No | Brief product description |
| `barcodeId` | `string` | No | Barcode identifier |
| `allowBackOrder` | `boolean` | No | Whether back-ordering is allowed |
| `fees` | `CFCustomFee[]` | No | Custom fees applied to the product |
| `isUnlimited` | `boolean` | No | Whether stock is unlimited |
| `attributes` | `string` | No | Product attributes |
| `localQuantity` | `number` | No | Locally tracked quantity |
| `_id` | `string` | No | Mongo-style id when retained from the catalog |
| `productType` | `CFProductType` | No | `"simple"` or `"variable"` |
| `currency` | `CurrencyCode` | No | Currency code for the line price |
| `minorUnits` | `number` | No | Decimal places for the line currency |

## Example Usage

```typescript
import { command } from '@final-commerce/command-frame';

try {
  const result = await command.getActiveProduct();

  if (result.product) {
    console.log('Active product:', result.product.name);
    console.log('Price:', result.product.price);
    console.log('Quantity:', result.product.quantity);
  } else {
    console.log('No product is currently selected');
  }

  // Expected output when a product is selected:
  // {
  //   success: true,
  //   product: {
  //     id: '123',
  //     name: 'Example Product',
  //     sku: 'EX-001',
  //     price: 1999, // $19.99 in minor units
  //     quantity: 1,
  //     stock: 50,
  //     images: ['https://...'],
  //     ...
  //   },
  //   timestamp: '2023-10-27T10:00:00.000Z'
  // }

} catch (error) {
  console.error('Failed to get active product:', error);
}
```

## Error Handling

This action typically does not throw errors unless there's an underlying system issue.

## Events

Publishes the active product snapshot on the `products` channel — unconditionally, including `null` when there is no active selection:

| Channel    | Event               | Payload |
| :--------- | :------------------- | :------ |
| `products` | `get-active-product` | `{ product: CFActiveProduct \| null }` |

## Notes

- Returns `null` for the `product` field when no product is currently selected or being viewed.
- The active product reflects the product the user is interacting with in the POS interface (e.g. tapped on in the cart or product list).
- Useful for building context-aware extensions that need to react to the currently focused product.
