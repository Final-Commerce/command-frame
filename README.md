# @final-commerce/command-frame (new version)

A TypeScript library for type-safe communication between iframes and their parent windows in the Final Commerce ecosystem.

## Overview

Command Frame provides a structured way to build integrations that run inside Final Commerce applications (the kaching POS runtime or the Manage Dashboard). It handles the underlying `postMessage` communication while enforcing strict type safety for both the host application (Provider) and the embedded app (Client).

`RenderClient` and `ManageClient` extend `CommandFrameClient`: dynamic methods such as `getProducts()` map to `postMessage` actions named after the method (camelCase), with typed params and responses per project.

The library provides three main capabilities:

| Capability          | Purpose                                                                                                                                                                                                                                            | Scope                                 |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| **Commands**        | Call host functions from the iframe (e.g. get products, open cash drawer)                                                                                                                                                                          | Request/response per call             |
| **Pub/Sub**         | Subscribe to real-time events from the host (e.g. cart changes, payments)                                                                                                                                                                          | Page-scoped (while iframe is mounted) |
| **Refund commands** | Refund payments to gift cards or redeem tenders via `redeemRefund`, or mixed-destination legs on `processPartialRefund`; query engine capacity with `getRefundPlan`; pre-gate UI with `checkPermission` (`issue_refunds` is enforced runtime-side) | Request/response per call             |

Domain models (orders, cart, customers, products, and related types) are documented in **[Types reference](./src/types/README.md)**.

The order lifecycle — payment × fulfillment state pairs, display labels, the transition guard chain, and the financial invariants — is documented in **[Order state machine reference](./docs/order-state-machine.md)**. Read it before building anything that reads or moves order state (`canTransition`, `getAvailableTransitions`, `applyTransition`, park/void/resume, payments, refunds).

## Installation

### From npm (public registry)

```bash
npm install @final-commerce/command-frame
```

### From GitHub Packages

To install from GitHub Packages, add this to your project's `.npmrc`:

```
@final-commerce:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

Set `NODE_AUTH_TOKEN` to a GitHub personal access token with `read:packages` scope, then install as usual:

```bash
npm install @final-commerce/command-frame
```

## Commands

Commands let the extension iframe call typed functions on the host. Each host environment (Render, Manage) exposes its own set of commands.

### Money values: integer minor units

Every money value on this API — params **and** responses — is an **integer in
minor currency units**: `1575` means $15.75 in USD, ¥1575 in JPY. The host
does all money math in minor units and never converts your inputs. Use
`getContext().minorUnits` (the currency's decimal exponent, e.g. `2` for USD,
`0` for JPY) to convert user-typed values before sending:

```typescript
const { minorUnits } = await command.getContext();
const amount = Math.round(parseFloat(userInput) * 10 ** (minorUnits ?? 2));
```

The two exceptions, always flagged in the field docs: percentages (`isPercent:
true` → `amount` is `0–100`), and quantities.

### Render (POS System)

For building applications that run inside the Final Commerce POS (the kaching runtime).

- **[Render Documentation](./src/projects/render/README.md)**
- **Features:** Order management, Product catalog, Customer management, Payments, Hardware integration (Cash drawer, Printer), Custom tables, Secrets storage.

```typescript
import { RenderClient } from '@final-commerce/command-frame';

const client = new RenderClient();
const products = await client.getProducts();
```

### Manage (Dashboard)

For building applications that run inside the Final Commerce Management Dashboard.

- **[Manage Documentation](./src/projects/manage/README.md)**
- **Features:** Context, catalog, entities, custom tables, secrets, and optional host-specific commands (navigation, media, tax, branding, notifications) when the dashboard implements them.

```typescript
import { ManageClient } from '@final-commerce/command-frame';

const client = new ManageClient();
const context = await client.getContext();
```

## Pub/Sub

The pub/sub system allows iframe extensions to subscribe to topics and receive real-time events published by the POS host (kaching). Subscriptions are **page-scoped** -- they fire only while the iframe is mounted on the current page.

- **[Pub/Sub Documentation](./src/pubsub/README.md)**
- **Topics:** Cart (16), Customers (8), Orders (7), Payments (2), Products (4), Refunds (4), Print (3), Custom Tables (3), Outlet (2), Station (2), Session (2), Users (4), Variants (2), Transactions (2), Categories (2), Attributes (2), Split Payments (1).

```typescript
import { topics } from '@final-commerce/command-frame';

const subscriptionId = topics.subscribe('cart', (event) => {
  console.log('Cart event:', event.type, event.data);
});

// Unsubscribe when done
topics.unsubscribe('cart', subscriptionId);
```

## Refunding redeem / extension payments

When staff refund an order that was paid with `paymentType: "redeem"` (via `redeemPayment` or `extensionPayment`), use the **`redeemRefund`** command to refund the amount onto a gift card or redeem tender.

**Key point:** Plain refunds on redeem sources still fail by design (`REDEEM_REFUND_UNSUPPORTED`). Use `redeemRefund` to refund onto a gift card when your extension credits the card first.

```typescript
import { command } from '@final-commerce/command-frame';

// Refund a redeem order back onto a gift card
const result = await command.redeemRefund({
  orderId: 'order_123',
  amount: 2500, // $25.00
  referenceId: 'GIFTCARD-456', // destination card
  processor: 'giftCard',
  label: 'Gift Card Refund',
  reason: 'Customer requested return',
});
```

**Full documentation:** **[redeemRefund](./src/actions/redeem-refund/README.md)**.

Before prompting the cashier for an amount, query **[getRefundPlan](./src/actions/get-refund-plan/README.md)** (read-only) for the order's own per-source caps (`maxRefundable`, `cardNumber` for same-card prefill) and order-level `remainingRefundable` — don't recompute this client-side, and always handle a `REFUND_AMOUNT_EXCEEDS_CAPACITY` rejection from the mutating call since the plan is only an advisory snapshot.

## Development & Testing

### Demo Mode / Mocking

Each client comes with built-in mock data for local development.

- If the application detects it is not running inside a valid host iframe, it automatically switches to **Mock Mode**.
- In Mock Mode, all API calls return local dummy data instead of failing.
- You can force Mock Mode by passing `mockMode: true` to the client constructor.

```typescript
const client = new RenderClient({ mockMode: true, debug: true });
```

#### What the mock host does like the till

The mock cart computes its money the way the till (kaching) does, so a screen built on the mock shows the till's numbers: tax per rate rounded once over the cart, a cart discount split over the lines, product discounts that stack, `lineTotals`, and the order's `taxes` / `totalTax` / `discountTotal` copied from the cart. Payments, refunds and stock refuse like the till, with its error texts:

- `cashPayment`, `terminalPayment`, `tapToPayPayment` reject an empty cart, a missing or non-positive `amount`, or one above the balance due; a partial leg returns `order: null` and the `remainingBalance`.
- `cashPayment` rounds the leg with the company's cash rounding, counts the change against the rounded charge, and rejects a `tenderedAmount` below it.
- `addProductToCart` rejects a tracked variant past its stock at the active outlet (`Insufficient stock. Available: 2, Requested: 3`, `Product is out of stock`); `updateCartItemQuantity` rejects a raise past it the same way.
- `processPartialRefund` refunds only what is left (`getRemainingRefundableQuantities` drops after it), raises the split-payment modal for a multi-tender order unless `openUI: false`, checks `legs` against each source and the budget, and uses the selection `selectAllRefundItems({ orderId })` staged when no `items` are passed. The order then reads `partially_refunded` / `partially_returned` (`status: 'partial-refund'`), or `refunded` / `returned` once everything paid is back, with its `balance`.
- A paid order keeps each line's `modifiers` (with their own `total` / `totalTax` / `taxes`) and a composite line's `components`.
- `upsertCustomTableData` stores the row (an existing `_id` updates it) and `getCustomTableData` reads it back; the mock filters by plain field equality only and does not check the table's fields.

The dataset passed to `setMockDatabase` supplies what the till reads from the company:

```typescript
setMockDatabase({
  company: { settings: { currency: 'USD', isTaxInclusive: false } }, // absent isTaxInclusive = inclusive, as on the till
  // The active outlet's tax tables, keyed by the id products name in `taxTable`; `rate` is a decimal (0.13 = 13%).
  taxTables: {
    tax_standard: [
      {
        id: 'gst',
        name: 'GST',
        rate: 0.05,
        priority: 1,
        compounding: false,
        taxTableId: 'tax_standard',
        taxTableName: 'Standard',
      },
    ],
  },
  cashRounding: '0.05', // the company's cash rounding, major units; absent = cash is not rounded
});
```

No tax tables means no tax, as on a till whose outlet has none.

**Declines — mock only.** A test that needs to see how a flow treats a failed payment or refund sets `declines` in the dataset. Nothing else triggers a decline, and a real till never reads it:

```typescript
setMockDatabase({ declines: { payments: ['terminal', 'tapToPay'], refunds: true } });
```

- `payments`: those card commands reject the way the till's processor does — `CLOUD_PAYMENT_FAILED: Card declined` for `terminalPayment({ paymentType: 'Cloud' })`, `NATIVE_PAYMENT_FAILED: Card declined` for the reader and tap to pay. Nothing is recorded; the cart stays open. Cash never declines.
- `refunds: true`: `processPartialRefund` rejects with `Cloud refund failed` after its checks pass; nothing is recorded.
- `customTableWrites: true`: `upsertCustomTableData` and `deleteCustomTableData` reject with `Table "<name>" not found` (the till's only refusal of a table write); nothing is stored.

A flow receives these as a rejected command — the same as on the till — and must show the failure, never a completed sale.

### Debugging

Enable debug logging to see all message passing activity in the console:

```typescript
const client = new RenderClient({ debug: true });
```

Alternatively, set the global flag before initialization:

```typescript
(window as any).__POSTMESSAGE_DEBUG__ = true;
```
