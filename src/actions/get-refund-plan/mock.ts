import { GetRefundPlan, GetRefundPlanParams, GetRefundPlanResponse, RefundPlanSource } from './types';
import { MOCK_ORDERS } from '../../demo/database';

/**
 * Demo derivation of the runtime `getRefundPlan`. Builds the per-source rows
 * from the mock order's `paymentMethods`, mirroring the runtime's capacity
 * definition (principal + captured tip).
 *
 * HONEST INERTNESS: the demo DB records no prior-refund ledger and no `emv`
 * blocks on its mock captures, so this mock reports `refundedAmount: 0` /
 * `totalRefunded: 0` and `cardNumber: undefined` for every source, and treats
 * `maxRefundable` as the full captured amount. Against real kaching those
 * numbers come from `order.refund[]` and the capture's `emv` JSON. Use this
 * only to shape UI in local/standalone mode — never to assert real capacity.
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
      // Demo DB has no refund ledger — nothing has been refunded yet here.
      refundedAmount: 0,
      maxRefundable: captured,
      refundableToSource: pm.paymentType !== 'redeem',
      cardNumber,
    };
  });

  const totalCaptured = sources.reduce((sum, s) => sum + s.capturedAmount, 0);
  const nonRefundableLiability = order.summary?.nonRevenueTotal ?? 0;

  return {
    success: true,
    orderId: order._id,
    sources,
    // Demo: no prior refunds, so remaining = captured minus the non-revenue load.
    remainingRefundable: Math.max(0, totalCaptured - nonRefundableLiability),
    nonRefundableLiability,
    totalCaptured,
    totalRefunded: 0,
    timestamp: new Date().toISOString(),
  };
};
