import { VoidOrder, VoidOrderParams, VoidOrderResponse } from './types';
import { MOCK_ORDERS, mockPublishEvent } from '../../demo/database';

export const mockVoidOrder: VoidOrder = async (params?: VoidOrderParams): Promise<VoidOrderResponse> => {
  console.log('[Mock] voidOrder called', params);

  const order = params?.orderId ? MOCK_ORDERS.find((o) => o._id === params.orderId) : MOCK_ORDERS[0];
  const orderId = order?._id ?? params?.orderId ?? '';

  // Completed orders are not voidable — mirror the runtime gate.
  if (order && order.paymentState === 'paid') {
    throw new Error(`ORDER_NOT_VOIDABLE: order ${orderId} is paid — use the refund flow`);
  }

  const hasCapturedLegs = (order?.paymentMethods?.length ?? 0) > 0;
  const outcome = hasCapturedLegs ? 'refunded' : 'voided';

  if (order) {
    order.paymentState = outcome;
    order.fulfillmentState = 'cancelled';
  }
  mockPublishEvent('orders', 'order-voided', { orderId, outcome, reason: params?.reason });

  return { success: true, orderId, outcome, timestamp: new Date().toISOString() };
};
