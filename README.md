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

### Debugging

Enable debug logging to see all message passing activity in the console:

```typescript
const client = new RenderClient({ debug: true });
```

Alternatively, set the global flag before initialization:

```typescript
(window as any).__POSTMESSAGE_DEBUG__ = true;
```
