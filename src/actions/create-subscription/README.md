# createSubscription

Subscribes a customer to a plan from `getSubscriptionPlans`, with the picks of period 1 for every composite line of
the plan. The subscription starts `incomplete` and its period 1 is a draft: nothing is charged and no order is made
by this command. The price is the plan's; the flow sends none.

## Parameters

- `customerId` (string, required): the customer's `_id` (from `getCustomers` or `getActiveCustomer`). The host never
  takes it from the cart.
- `planId` (string, required): an active plan. The customer gets one subscription to it, so a line's portions are the
  plan line's `quantity` — the flow multiplies nothing.
- `picksSnapshot` (required): `{ variantId, quantity, picks: CFCompositePick[] }[]` — for each composite line, the picks
  per portion, exactly as the composite picker hands them to `addProductToCart({ composite })`. One entry per portion
  is fine; entries may repeat a `variantId`. Per variant the quantities must add up to the line's `quantity`.

## Response

```typescript
{
  success: boolean;
  reason?: string; // why the host or the server refused, when success is false
  subscriptionId?: string; // absent when refused
  status?: 'incomplete'; // until period 1 is paid; absent when refused
  timestamp: string;
}
```

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

const result = await command.createSubscription({
  customerId: customer._id,
  planId: plan._id,
  picksSnapshot: lunches.map((picks) => ({ variantId: lunchVariantId, quantity: 1, picks })),
});
if (!result.success) return showError(result.reason);
show(result.subscriptionId, result.status);
```

Keep the confirm button disabled while the call is in flight: a second call makes a second subscription.

## Error Handling

The subscription is written by the server, so the host needs a connection. It does not throw: a failure resolves
`{ success: false, reason }` when

- `customerId` or `planId` is missing;
- there is no active company;
- the device is offline;
- the server refuses: unknown customer or plan, inactive plan, picks that do not fill the composite lines exactly,
  no business timezone — its message is the `reason`.
