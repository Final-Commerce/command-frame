# order-created Event

## Description

Published when a new order is created in the system.

For complete type reference, see [Types Reference](../../../../types/README.md).

## Event Type

- **Topic**: `orders`
- **Event ID**: `order-created`

## Payload

```typescript
interface OrderCreatedPayload {
    order: CFOrder;
}
```

### Payload Fields

| Field | Type | Description |
|-------|------|-------------|
| `order` | [`CFOrder`](../../../../types/README.md#cforder) | The newly created order object. See field reference below. |

## CFOrder Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | `string` | Yes | Unique order identifier |
| `receiptId` | `string` | No | Receipt identifier |
| `companyId` | `string` | Yes | Company this order belongs to |
| `externalId` | `string \| null` | Yes | External system identifier |
| `status` | `string` | Yes | Order status (e.g. `"completed"`, `"pending"`) |
| `customer` | `Partial<`[`CFActiveCustomer`](../../../../types/README.md#cfactivecustomer)` \| null>` | Yes | Customer attached to the order |
| `customerNote` | `string` | No | Note from the customer |
| `summary` | [`CFSummary`](../../../../types/README.md#cfsummary) | Yes | Order totals, taxes, tip, discount summary |
| `cartDiscount` | [`CFCartDiscountItem`](../../../../types/README.md#cfcartdiscountitem)` \| null` | Yes | Cart-level discount applied |
| `cartFees` | [`CFCartFeeItem`](../../../../types/README.md#cfcartfeeitem)`[] \| null` | Yes | Cart-level fees applied |
| `updatedAt` | `string` | No | ISO timestamp of last update |
| `createdAt` | `string` | No | ISO timestamp of creation |
| `paymentMethods` | [`CFPaymentMethod`](../../../../types/README.md#cfpaymentmethod)`[]` | Yes | Payments made on the order |
| `source` | `string` | Yes | Origin of the order (e.g. `"pos"`) |
| `posData` | [`CFPosDataItem`](../../../../types/README.md#cfposdataitem)` \| null` | Yes | POS context (outlet, station, employee) |
| `sessionId` | `string` | Yes | Session identifier |
| `metadata` | [`CFMetadataItem`](../../../../types/README.md#cfmetadataitem)`[]` | Yes | Key-value metadata pairs |
| `notes` | [`CFOrderNote`](../../../../types/README.md#cfordernote)`[] \| null` | No | Order notes |
| `billing` | [`CFAddress`](../../../../types/README.md#cfaddress)` \| null` | Yes | Billing address |
| `shipping` | [`CFAddress`](../../../../types/README.md#cfaddress)` \| null` | Yes | Shipping address |
| `lineItems` | [`CFLineItem`](../../../../types/README.md#cflineitem)`[]` | Yes | Product line items |
| `customSales` | [`CFCustomSale`](../../../../types/README.md#cfcustomsale)`[]` | Yes | Custom sale items |
| `refund` | [`CFRefundItem`](../../../../types/README.md#cfrefunditem)`[]` | No | Refund records |
| `balance` | `string` | Yes | Remaining balance |
| `signature` | `string \| null` | No | Customer signature data |

### Key Nested Types

Each line item contains discount and fee breakdowns:

- [`CFLineItem`](../../../../types/README.md#cflineitem) -- product line item with price, taxes, discounts, and fees
  - [`CFDiscountLineItem`](../../../../types/README.md#cfdiscountlineitem) -- groups item-level and cart-level discounts
    - [`CFDiscountDetail`](../../../../types/README.md#cfdiscountdetail) -- computed discount with `percentage`, `amount`, and `label`
  - [`CFFeeLineItem`](../../../../types/README.md#cffeelineitem) -- groups item-level and cart-level fees
    - [`CFFeeDetail`](../../../../types/README.md#cffeedetail) -- computed fee with `percentage`, `amount`, `tax`, `taxTableId`, and `label`
- [`CFCustomSale`](../../../../types/README.md#cfcustomsale) -- non-product sale item with its own discount and fee details

## Example Usage

### Subscribing in iframe app

```typescript
import { topics } from '@final-commerce/command-frame';
import type { OrderCreatedEvent } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('orders', (event: OrderCreatedEvent) => {
    if (event.type === 'order-created') {
        console.log('New order created:', event.data.order);
    }
});
```

### Publishing from Render app

```typescript
import { topicPublisher } from '@render/command-frame';
import type { OrderCreatedPayload } from '@final-commerce/command-frame';

topicPublisher.publish('orders', 'order-created', {
    order: newOrder
} as OrderCreatedPayload);
```

## Related Types

- [`CFOrder`](../../../../types/README.md#cforder) - Order type from CommonTypes
- [`CFLineItem`](../../../../types/README.md#cflineitem) - Product line item
- [`CFCustomSale`](../../../../types/README.md#cfcustomsale) - Custom sale item
- [`CFDiscountDetail`](../../../../types/README.md#cfdiscountdetail) - Computed discount detail
- [`CFFeeDetail`](../../../../types/README.md#cffeedetail) - Computed fee detail
- [`CFSummary`](../../../../types/README.md#cfsummary) - Order totals summary
- [`CFPaymentMethod`](../../../../types/README.md#cfpaymentmethod) - Payment transaction
- [`CFRefundItem`](../../../../types/README.md#cfrefunditem) - Refund record
- `OrderCreatedPayload` - Event payload type
- `OrderCreatedEvent` - Full event type with topic, type, data, and timestamp
