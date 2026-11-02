import {
  GetRemainingRefundableQuantities,
  GetRemainingRefundableQuantitiesParams,
  GetRemainingRefundableQuantitiesResponse,
} from './types';
import type { RefundPlanRowType } from '../get-refund-plan/types';
import { MOCK_ORDERS } from '../../demo/database';
import { mockRefundRows } from '../get-refund-plan/mockRows';

/** Same rows as `mockGetRefundPlan`, less what the order's earlier refunds took. The demo has no active order, so
 * `orderId` is required. */
export const mockGetRemainingRefundableQuantities: GetRemainingRefundableQuantities = async (
  params?: GetRemainingRefundableQuantitiesParams,
): Promise<GetRemainingRefundableQuantitiesResponse> => {
  console.log('[Mock] getRemainingRefundableQuantities called', params);

  const order = params?.orderId ? MOCK_ORDERS.find((o) => o._id === params.orderId) : undefined;
  if (!order) {
    throw new Error(
      params?.orderId ? `Order with ID ${params.orderId} not found` : 'No order selected. Please provide orderId.',
    );
  }

  const remaining: Record<RefundPlanRowType, Record<string, number>> = {
    product: {},
    customSale: {},
    fee: {},
    tip: {},
  };
  for (const row of mockRefundRows(order)) remaining[row.type][row.itemKey] = row.refundableQuantity;
  const reservations: Record<string, number> = {};
  for (const r of order.reservations ?? []) {
    const refunded = (order.refund ?? [])
      .flatMap((refund) => refund.reservations ?? [])
      .filter((x) => x.internalId === r.internalId);
    reservations[r.internalId] = Math.max(
      0,
      (r.quantity ?? 1) - refunded.reduce((sum, x) => sum + (x.quantity ?? 1), 0),
    );
  }

  return {
    success: true,
    lineItems: remaining.product,
    customSales: remaining.customSale,
    cartFees: remaining.fee,
    tips: remaining.tip,
    reservations,
    timestamp: new Date().toISOString(),
  };
};
