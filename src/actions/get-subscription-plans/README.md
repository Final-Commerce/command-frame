# getSubscriptionPlans

The subscription plans this merchant sells, with the products their lines name, so a flow can offer a plan and
open the composite picker for its composite lines. A plan has its own price per period (`unitAmount`); it is not
the sum of its lines.

## Parameters

None.

## Response

```typescript
{
  success: boolean;
  reason?: string; // why the host refused, when success is false
  plans: {
    _id: string;
    name: string; // "Meal Prep - 5 lunches a week"
    lines: { variantId: string; quantity: number }[]; // per period
    unitAmount: number; // minor units of `currency`, the price of one period
    currency: string;
    recurring: { interval: 'day' | 'week' | 'month' | 'year'; intervalCount: number };
  }[];
  products: CFProduct[]; // as getProducts serves them here; a composite carries `composite`
  timestamp: string;
}
```

- Only **active** plans are returned. A switched-off plan keeps serving the subscriptions already on it, but is not
  offered for new ones.
- `products` holds the lines' products exactly as `getProducts` would serve them on this till. A line whose variant
  is in none of them cannot be sold here (the product is inactive, not sold in POS, hidden at this outlet or deleted):
  show the line as not sellable here and keep the plan from being sold — do not drop the line.

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

const { success, reason, plans, products } = await command.getSubscriptionPlans();
if (!success) return showError(reason);
const plan = plans[0];
const productOf = (variantId: string) => products.find((p) => p.variants.some((v) => v._id === variantId));
const price = formatMoney(plan.unitAmount); // the plan's price, never a sum of the lines
```

## Error Handling

The plans live on the server, so the host needs a connection. It does not throw: a failure resolves
`{ success: false, reason, plans: [], products: [] }` when there is no active company, the device is offline, or the
API call fails.
