import type { SetOrderStatus, SetOrderStatusParams, SetOrderStatusResponse } from './types';
import { MOCK_ORDERS, MOCK_ORDER_STATUSES, MOCK_PARKED_ORDERS, mockPublishEvent } from '../../demo/database';

/** Best-effort mock: no state-machine guards beyond the status's payment requirement. */
export const mockSetOrderStatus: SetOrderStatus = async (
  params: SetOrderStatusParams,
): Promise<SetOrderStatusResponse> => {
  console.log('[Mock] setOrderStatus called', params);

  if (!params?.orderId) {
    throw new Error('setOrderStatus: the demo has no live-cart order — pass an orderId');
  }
  const order = [...MOCK_ORDERS, ...MOCK_PARKED_ORDERS].find((o) => o._id === params.orderId);
  if (!order) {
    throw new Error(`Order with ID ${params.orderId} not found`);
  }

  const from = { payment: order.paymentState ?? 'unpaid', fulfillment: order.fulfillmentState ?? 'draft' };

  if (params.statusId === null) {
    order.customStatus = null;
  } else {
    const def = MOCK_ORDER_STATUSES.find((s) => s.id === params.statusId);
    if (!def) {
      throw new Error(`setOrderStatus: unknown status "${params.statusId}"`);
    }
    if (def.requiresPaymentState && !def.requiresPaymentState.includes(from.payment)) {
      throw new Error(
        `setOrderStatus: "${def.label}" requires payment state ${def.requiresPaymentState.join(' or ')} (order is ${from.payment})`,
      );
    }
    if (def.fulfillmentState) order.fulfillmentState = def.fulfillmentState as typeof order.fulfillmentState;
    order.customStatus = { id: def.id, label: def.label, setAt: new Date().toISOString(), setBy: null };
  }

  mockPublishEvent('orders', 'order-updated', { order });
  const to = { payment: order.paymentState ?? 'unpaid', fulfillment: order.fulfillmentState ?? 'draft' };

  return {
    success: true,
    orderId: order._id!,
    customStatus: order.customStatus ?? null,
    from,
    to,
    order,
    timestamp: new Date().toISOString(),
  };
};
