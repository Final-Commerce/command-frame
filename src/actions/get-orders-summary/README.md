# getOrdersSummary

How many orders match, what they add up to, and how many are completed / refunded — answered by the till for EVERY
matched order (not a loaded page), so a dashboard tile never sums in the flow.

## Parameters

The same filters as [`getOrders`](../get-orders/README.md) (`status`, `customerId`, `sessionId`, `paymentState`,
`fulfillmentState`, `outletId`, `inCart`, `orderType`, `searchValue`, …). No paging or sorting.

## Response

```typescript
interface GetOrdersSummaryResponse {
  orderCount: number; // matched orders, leaving out in-cart / parked / park-deleted (legacy status)
  ordersTotal: number; // Σ summary.total, MINOR units
  currency: string;
  minorUnits: number;
  completed: { count: number; percentOfOrders: number }; // legacy status 'completed'
  refunded: { count: number; percentOfOrders: number }; // legacy status 'refunded' or 'partial-refund'
  timestamp: string;
}
```

## Notes

- The buckets read the legacy `status`, exactly as the first-party orders screen did; `percentOfOrders` is rounded to a
  whole percent by the till (0 when nothing matches).
- The command-frame mock refuses (`The orders summary is computed by the till`).
