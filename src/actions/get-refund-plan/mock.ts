import { GetRefundPlan, GetRefundPlanParams, GetRefundPlanResponse, RefundPlanLeg, RefundPlanSource } from './types';
import { MOCK_ORDERS } from '../../demo/database';
import { mockRefundBreakdown, mockRefundRows, mockRemainingOnSource } from './mockRows';

/**
 * Demo derivation of the runtime `getRefundPlan`. Builds the per-source rows
 * from the mock order's `paymentMethods`, mirroring the runtime's capacity
 * definition (principal + captured tip).
 *
 * Refunded amounts come from the order's `refund[]` legs, as on the host. The
 * mock captures carry no `emv`, so `cardNumber` is always undefined.
 *
 * `allocation` is shape-only: it always describes a FULL refund of what is
 * left, with `rounding: 0` and no cash `payout`. Against real kaching the
 * allocation tracks the live selection and carries the drawer snap.
 *
 * `rows` / `allocation.breakdown` follow the engine's reading of the order
 * (`line.total` includes the line's tax) but prorate by plain quantity share;
 * the engine's remainder carry across earlier partial refunds is not modelled.
 */
export const mockGetRefundPlan: GetRefundPlan = async (
  params?: GetRefundPlanParams,
): Promise<GetRefundPlanResponse> => {
  console.log('[Mock] getRefundPlan called', params);

  const order = params?.orderId ? MOCK_ORDERS.find((o) => o._id === params.orderId) : MOCK_ORDERS[0];
  if (!order) {
    throw new Error(`Order with ID ${params?.orderId} not found`);
  }

  const capturedOf = (pm: { amount?: number | null; tip?: { amount?: number | null } | null }): number =>
    Math.round(pm.amount ?? 0) + Math.round(pm.tip?.amount ?? 0);

  const sources: RefundPlanSource[] = (order.paymentMethods ?? []).map((pm) => {
    const captured = capturedOf(pm);
    let cardNumber: string | undefined;
    // Demo captures carry no emv, so this is always undefined here; kept to
    // document the runtime's redeem-source card-number extraction.
    if (pm.paymentType === 'redeem' && pm.emv) {
      try {
        cardNumber = JSON.parse(pm.emv)['Card Number'];
      } catch {
        cardNumber = undefined;
      }
    }
    return {
      transactionId: pm.transactionId,
      paymentType: pm.paymentType,
      processor: pm.processor ?? undefined,
      capturedAmount: captured,
      refundedAmount: captured - mockRemainingOnSource(order, pm.transactionId),
      maxRefundable: mockRemainingOnSource(order, pm.transactionId),
      refundableToSource: pm.paymentType !== 'redeem',
      cardNumber,
    };
  });

  const totalCaptured = sources.reduce((sum, s) => sum + s.capturedAmount, 0);
  const totalRefunded = sources.reduce((sum, s) => sum + s.refundedAmount, 0);
  const nonRefundableLiability = order.summary?.nonRevenueTotal ?? 0;

  // Full-refund legs: every source returns its whole capture (the demo's
  // `maxRefundable`), which is exactly the shape a full selection produces.
  const legs: RefundPlanLeg[] = sources
    .filter((s) => s.maxRefundable > 0)
    .map((s) => ({
      transactionId: s.transactionId,
      amount: s.maxRefundable,
      paymentType: s.paymentType,
      requiresDestination: s.paymentType === 'redeem',
      requiresGiftCardDestination: s.paymentType === 'redeem',
    }));
  const budget = legs.reduce((sum, l) => sum + l.amount, 0);
  const rows = mockRefundRows(order);

  return {
    success: true,
    orderId: order._id,
    sources,
    rows,
    allocation: {
      budget,
      // No cash rounding in the demo, so the goods value and the budget agree.
      itemTotal: budget,
      rounding: 0,
      legs,
      breakdown: mockRefundBreakdown(rows, params?.items),
    },
    remainingRefundable: Math.max(0, totalCaptured - totalRefunded - nonRefundableLiability),
    nonRefundableLiability,
    totalCaptured,
    totalRefunded,
    timestamp: new Date().toISOString(),
  };
};
