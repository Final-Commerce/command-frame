# getProducts

Retrieves a list of products from the parent application's local database. A composite whose `composite.needsDate` is true holds a bookable item: show "By date" instead of a ready Add button and route Add through a date and time picker (`getCompositeAvailability`); its items reading `unavailable: 'by_date'` stay pickable.

> **Bookable services are excluded unless you ask for them.** A service is not catalogue stock:
> it is sold by claiming a time with `addBookingToCart`, and `addProductToCart` refuses it
> outright. Returned by default it appeared in ordinary product grids, where the obvious gesture —
> tap, add to cart, charge — took the money and reserved nothing at all: no hold, no reservation
> on the order, the slot still free for the next customer.
>
> Ask for them when the user genuinely wants services — a Book tab, a services screen, a search
> that should span everything:
>
> ```typescript
> getProducts({ query: { productType: 'booking' } }); // services only
> getProducts({ query: { productType: { $in: ['simple', 'variable', 'booking'] } } }); // both
> ```
>
> Any query that names `productType` is used exactly as written — the default exclusion switches
> off entirely, so `{ $ne: 'booking' }` also means what it says.
> A variant sold by measure carries `unitId` (and a resolved `unit`), and its `inventory[].stock` is ALREADY in that selling unit — the host converts its base-unit ledger before the variant reaches you. Show it as `${stock} ${unit.abbreviation}`; never divide or multiply it by `unit.ratioToBase`.

## Parameters

### `GetProductsParams`

```typescript
interface GetProductsParams {
  query?: {
    name?: string | { $regex?: string; $options?: string };
    sku?: string | { $regex?: string; $options?: string };
    status?: string;
    /** `simple` | `variable` | `booking`. Naming it switches off the bookable-service exclusion. */
    productType?: string | { $in?: string[]; $ne?: string };
    categories?: string | { $in?: string[] };
    tags?: string | { $in?: string[] };
    supplier?: string;
    externalId?: string;
    [key: string]: any;
  };
  offset?: number;
  limit?: number;
}
```

#### `query` (optional)

A query object to filter products. The actual supported query operators depend on the database implementation (MongoDB/mongoose vs LokiJS/IndexedDB).

**Note:** The handler always restricts results to `status: 'active'` products, regardless of any `status` value passed here — draft and inactive products are never returned by this command.

**Note:** When `query.sku` (or a `sku` field inside a `$or` branch) is supplied, the handler also matches it against variant SKUs and against the product's `barcode` field (case-insensitive) — not just the product-level `sku` field. This means a scanned barcode or a variant-level SKU will still return the parent product.

#### `offset` (optional)

The number of items to skip. Defaults to 0.

#### `limit` (optional)

The maximum number of items to return. Defaults to 100.

**Note:** The handler automatically excludes deleted products.

## Response

### `GetProductsResponse`

```typescript
interface GetProductsResponse {
  products: CFProduct[];
  total?: number;
  timestamp: string;
}
```

#### `products` ([CFProduct](../../types/README.md#cfproduct)[])

Array of product objects matching the query. The actual structure may vary depending on the database implementation (MongoDB/mongoose vs LokiJS/IndexedDB).

**Tip:** You can import [`CFProduct`](../../types/README.md#cfproduct) and [`CFProductVariant`](../../types/README.md#cfproductvariant) types directly from the library:

```typescript
import { type CFProduct, type CFProductVariant } from '@final-commerce/command-frame';
```

See the [Real Data Examples](#real-data-examples) section below for actual product and variant object structures.

**Composite products** (`productType: 'composite'`) carry `composite: CFComposite` — `null` on every other product.
It is the whole picker, decided by the host: `parts[]` (`name`, `required`, `min`, `max`) → `items[]` (`name`, `cost` =
what one pick adds on top of the composite's price — its upcharge × quantity (B31), `unavailable` = null or `'deleted' | 'inactive' | 'empty' | 'out_of_stock' | 'by_date' | 'fully_booked'`, `choices[]` = the variants a pick may
name), plus
`available` (false = show the composite Unavailable; `fromPrice` is then null when nothing is left to price), `basePrice` (the composite's own price, set by the merchant, in every tax mode) and
`fromPrice` (the "from" price for the card).

_At the till's outlet_ (catalog-visibility, per product): a composite hidden there is not returned at all (and
`addProductToCart` / `getCompositePrice` refuse it: "<name> is not sold at this outlet"); an item whose product is hidden
there is left out of its part; a category item keeps only the products sold there — none left → `unavailable: 'empty'`;
an Optional part with nothing to pick there is not offered; a required part with nothing to pick makes the composite
`available: false`, and the host's refusal names that part ("Drink: nothing can be picked at this outlet"). A pick of an
item not offered is refused ("Composite item <id> is not offered here"). `'hidden'` stays in the type for the back office (an item hidden at an outlet), but the till leaves such items out —
a flow never receives it. A hide or show
arrives as `products` / `catalog-visibility-changed` — refetch.

_Stock at the till's outlet_ (B35): an item whose variant is tracked, not on backorder, and short of one pick's
quantity (in its pool's base units — `stockVariantId` shares a shelf) is `unavailable: 'out_of_stock'` — show it
"Sold out"; it cannot be picked. A category item is in stock while any of its products is (its `choices` are those). A unit-sold, tracked choice carries
`stockLeft` — how much its shelf still serves here, in its own unit, floored at the unit's precision (`availableIn`,
B36e): show "2.35 kg left". Absent when sold by the piece or untracked; never compute it.
Untracked variants are always in stock. A required part with nothing in stock makes the composite unavailable. At
`addProductToCart` / `getCompositePrice`, and again at the first payment, the host adds up what the whole cart takes
from each shelf (pick × item × line, plain lines on the same pool included) and refuses "<item>: only N left". A stock
move arrives as `products` / `inventory-changed` — refetch.

_Bookable items_ (B41): an item whose product is bookable is judged by seats, never stock. `composite.needsDate` is
true when the composite offers one: show "By date" instead of a ready-to-add state. Until a date and time is chosen
such an item reads `unavailable: 'by_date'` — it still has its `choices` and does NOT make the composite unavailable.
Ask `getCompositeAvailability` for the start times free for all of them, then `getCompositePrice` /
`addProductToCart` with `compositeSlot: { startAt }`; there an item without enough seats reads `'fully_booked'`.
A category item never hands out bookables.

Each part's `defaultPick` (`{ itemId, variantId }`) is the pick to show
preselected (B29 = D36): only on a required "pick 1" part (`required`, `min = max = 1`) — its cheapest available item
(lowest `cost`, ties to the first listed); `null` on every other part, and when the cheapest is a category item. Parts
without a default show how many picks they still need (`getCompositePrice().missing`). A part with `max = 1` is a
radio: picking another item replaces the pick. Show these; do not recompute prices, availability or defaults. Send the picks with
`addProductToCart({ variantId, composite: [{ itemId, variantId, quantity? }] })`.

#### `total` (number, optional)

Total number of products matching the query, ignoring `offset`/`limit`. Optional — hosts that cannot cheaply compute the total may omit it (the kaching host currently does not return it).

#### `timestamp` (string)

ISO 8601 timestamp string (e.g., `"2024-01-01T00:00:00.000Z"`) indicating when the response was generated by the handler.

## Usage

```typescript
import { command } from '@final-commerce/command-frame';
```

## Usage Examples

### Basic Query

Get all products (up to default limit of 100):

```typescript
import { command } from '@final-commerce/command-frame';

const result = await command.getProducts();
console.log(result.products);
```

### With Pagination

Get 50 products starting from index 0:

```typescript
const result = await command.getProducts({
  limit: 50,
  offset: 0,
});
```

### Filtered Query

Get products by name (case-insensitive regex):

```typescript
const result = await command.getProducts({
  query: {
    name: { $regex: 'coffee', $options: 'i' },
  },
});
```

## Real Data Examples

### Example Response

```json
{
  "products": [
    {
      "_id": "691df9c6c478bada1fb23d31",
      "name": "Final Coffee ",
      "description": "Premium roasted coffee beans",
      "shortDescription": "Best coffee in town",
      "productType": "variable",
      "source": "standalone",
      "companyId": "691df9c4c478bada1fb23bff",
      "minPrice": 1000,
      "maxPrice": 1000,
      "taxTable": "tax_standard",
      "categories": [
        {
          "name": "Beverages",
          "externalId": "cat_beverages"
        }
      ],
      "attributes": [
        {
          "name": "Size",
          "values": ["Regular", "Large"]
        }
      ],
      "tags": ["hot", "drink"],
      "supplier": "Coffee Co.",
      "sku": "COFFEE-MAIN",
      "variants": [
        {
          "_id": "691df9c6c478bada1fb23d55",
          "productId": "691df9c6c478bada1fb23d31",
          "price": 1000,
          "salePrice": 0,
          "isOnSale": false,
          "sku": "COFFEE-1",
          "manageStock": true,
          "externalId": "ext_coffee_1",
          "inventory": [
            {
              "warehouse": "main",
              "outletId": "outlet_1",
              "stock": 100
            }
          ],
          "attributes": [
            {
              "name": "Size",
              "value": "Regular"
            }
          ],
          "isDeleted": false
        }
      ],
      "isDeleted": false,
      "createdAt": "2024-12-03T10:00:00.000Z",
      "updatedAt": "2024-12-03T10:00:00.000Z"
    },
    {
      "_id": "691df9c6c478bada1fb23d32",
      "name": "Cool Shirt",
      "productType": "variable",
      "source": "standalone",
      "companyId": "691df9c4c478bada1fb23bff",
      "minPrice": 2000,
      "maxPrice": 2000,
      "variants": [
        {
          "_id": "691df9c6c478bada1fb23d56",
          "productId": "691df9c6c478bada1fb23d32",
          "price": 2000,
          "sku": "SHIRT-1",
          "isDeleted": false
        }
      ],
      "isDeleted": false,
      "createdAt": "2024-12-03T10:00:00.000Z",
      "updatedAt": "2024-12-03T10:00:00.000Z"
    },
    {
      "_id": "691df9c6c478bada1fb23d33",
      "name": "Final Juice",
      "productType": "variable",
      "source": "standalone",
      "companyId": "691df9c4c478bada1fb23bff",
      "minPrice": 2300,
      "maxPrice": 4200,
      "variants": [
        {
          "_id": "691df9c6c478bada1fb23d57",
          "productId": "691df9c6c478bada1fb23d33",
          "price": 2300,
          "sku": "JUICE-S",
          "isDeleted": false
        },
        {
          "_id": "691df9c6c478bada1fb23d58",
          "productId": "691df9c6c478bada1fb23d33",
          "price": 4200,
          "sku": "JUICE-L",
          "isDeleted": false
        }
      ],
      "isDeleted": false,
      "createdAt": "2024-12-03T10:00:00.000Z",
      "updatedAt": "2024-12-03T10:00:00.000Z"
    }
  ],
  "timestamp": "2025-12-04T19:23:45.123Z"
}
```

### Example Product with Variants

```json
{
  "_id": "691df9c6c478bada1fb23d31",
  "name": "Final Coffee ",
  "description": "Premium roasted coffee beans",
  "shortDescription": "Best coffee in town",
  "productType": "variable",
  "source": "standalone",
  "companyId": "691df9c4c478bada1fb23bff",
  "minPrice": 1000,
  "maxPrice": 1000,
  "taxTable": "tax_standard",
  "images": [
    "https://storage.googleapis.com/attachments-dev-1/67e3f8092d38e6eb3c4cbbc6/1759858638421_CoffeSwagShop-600x600.png"
  ],
  "categories": [
    {
      "name": "Beverages",
      "externalId": "cat_beverages"
    }
  ],
  "attributes": [
    {
      "name": "Size",
      "values": ["Regular", "Large"]
    }
  ],
  "tags": ["hot", "drink"],
  "supplier": "Coffee Co.",
  "sku": "COFFEE-MAIN",
  "variants": [
    {
      "_id": "691df9c6c478bada1fb23d55",
      "productId": "691df9c6c478bada1fb23d31",
      "price": 1000,
      "salePrice": 0,
      "isOnSale": false,
      "barcode": "123456789",
      "costPrice": 500,
      "manageStock": true,
      "externalId": "ext_coffee_1",
      "inventory": [
        {
          "warehouse": "main",
          "outletId": "outlet_1",
          "stock": 100
        }
      ],
      "allowBackorder": false,
      "images": [
        "https://storage.googleapis.com/attachments-dev-1/67e3f8092d38e6eb3c4cbbc6/1759858638421_CoffeSwagShop-600x600.png"
      ],
      "attributes": [
        {
          "name": "Size",
          "value": "Regular"
        }
      ],
      "metadata": [
        {
          "key": "roast_level",
          "value": "medium"
        }
      ],
      "isDeleted": false,
      "createdAt": "2024-12-03T10:00:00.000Z",
      "updatedAt": "2024-12-03T10:00:00.000Z"
    }
  ],
  "isDeleted": false,
  "createdAt": "2024-12-03T10:00:00.000Z",
  "updatedAt": "2024-12-03T10:00:00.000Z"
}
```

## Product Structure Reference

The structure shown above matches the `CFProduct` type (an alias of `FullProduct` from `@final-commerce/common/pos-types`) that this command's contract returns — it is a fixed, typed shape, not `any`. The same canonical shape applies regardless of the underlying database implementation (MongoDB/mongoose vs LokiJS/IndexedDB).

Key fields:

- **Attributes**: Product attributes with name and values array.
- **Metadata**: Array of key-value pairs for custom data.
- **Variants**: Product variants with their own pricing, inventory, and attributes.
- **Inventory**: Variant inventory is tracked per outlet in the `inventory` array.
- **Unavailable**: `variant.unavailable` is `true` when the variant is marked "can't be sold here right now" at the active outlet (`setVariantUnavailable`). Independent of stock — show it as unavailable and don't offer add-to-cart; `addProductToCart` refuses it with `reason: 'Marked unavailable'`.
- **ID fields**: Products and variants are keyed by `_id` (string).
- **Pricing**: `price`, `salePrice`, `costPrice`, `minPrice`, and `maxPrice` are integers in minor currency units (e.g. cents for USD) — not decimal strings.

### Stock on a measured variant is already in the selling unit

A variant sold by measure carries `unitId` (and a resolved `unit` object — see the
add-product-to-cart docs). Its `inventory[].stock` arrives ALREADY converted: the host's
ledger counts base units (grams, millilitres), but its resolver turns that into whole
servable selling units (`availableIn`) before the variant reaches an extension:

```typescript
// unit = { abbreviation: "kg", ratioToBase: 1000, precision: 3 }
// inventory[0].stock = 100   ← kilograms, not grams
const label = `${stock} ${unit.abbreviation}`; // "100 kg"
```

Never divide or multiply `stock` by `unit.ratioToBase` — the conversion already happened,
and doing it again is a thousand-fold error. A variant with no `unitId` is sold by the
piece and `stock` is the plain count.

## Error Handling

If no products match the query, the handler returns an empty array — this is a normal empty result, not an error:

```typescript
{
    products: [],
    timestamp: "2024-01-01T00:00:00.000Z"
}
```

The handler does not catch or swallow errors. If the underlying query fails (e.g. a database or sync error), the returned promise rejects and the error propagates to the caller.

## Notes

- Results are limited to 100 products per request by default
- Deleted products (`isDeleted: true`) are automatically excluded
- Only products with `status: 'active'` are returned — draft and inactive products are excluded, even if requested via `query.status`
- Results are scoped to the currently active outlet: products not assigned to that outlet, or explicitly hidden there via catalog visibility, are excluded
- Variants are included in the response; soft-deleted variants (sync tombstones) are stripped out before the response is returned

### Composite choices carry their modifiers

`composite.parts[].items[].choices[].modifiers` is the picked product's own modifier menu (same shape as
`product.modifiers`, resolved by the host). Offer it inside the picker and send the answers as
`composite[].modifiers`. A choice whose required modifier has nothing sold at this outlet is left out; an item with no
choice left is `unavailable: 'empty'`.
