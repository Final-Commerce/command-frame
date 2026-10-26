import type { ResumeOrder, ResumeOrderParams, ResumeOrderResponse } from './types';
import { MOCK_ORDERS, MOCK_PARKED_ORDERS, mockPublishEvent } from '../../demo/database';
import { restoreMockCartFromOrder } from '../resume-parked-order/mock';

// Mirrors the host's rule (see README): anything not already in a cart and not finished.
const BLOCKED_PAYMENT = new Set(['refunded', 'partially_refunded', 'voided', 'payment_pending']);
const FINISHED_FULFILLMENT = new Set(['cancelled', 'returned', 'partially_returned']);

export const mockResumeOrder: ResumeOrder = async (params?: ResumeOrderParams): Promise<ResumeOrderResponse> => {
  console.log('[Mock] resumeOrder called', params);

  const orderId = params?.orderId;
  if (!orderId) {
    throw new Error('Order ID is required');
  }

  const order = [...MOCK_PARKED_ORDERS, ...MOCK_ORDERS].find((o) => o._id === orderId);
  if (!order) {
    throw new Error(`Order with ID ${orderId} not found`);
  }

  const from = { payment: order.paymentState ?? 'unpaid', fulfillment: order.fulfillmentState ?? 'draft' };
  const inCart = order.inCart != null ? order.inCart.active : from.fulfillment === 'draft';
  if (inCart) {
    throw new Error(`Order ${orderId} is already in a cart`);
  }
  if (
    BLOCKED_PAYMENT.has(from.payment) ||
    FINISHED_FULFILLMENT.has(from.fulfillment) ||
    (from.payment === 'paid' && from.fulfillment === 'fulfilled')
  ) {
    throw new Error(`Order ${orderId} cannot be resumed from ${from.payment} × ${from.fulfillment}`);
  }

  // Keeps the state; only parked (on_hold) / draft move.
  const leavesParked = from.fulfillment === 'on_hold' || from.fulfillment === 'draft';
  const to = {
    payment: from.payment,
    fulfillment: !leavesParked ? from.fulfillment : from.payment === 'unpaid' ? 'draft' : 'in_progress',
  };

  restoreMockCartFromOrder(order);

  const parkedIndex = MOCK_PARKED_ORDERS.findIndex((o) => o._id === orderId);
  if (parkedIndex !== -1) MOCK_PARKED_ORDERS.splice(parkedIndex, 1);

  mockPublishEvent('cart', 'cart-created', { orderId });
  mockPublishEvent('order-state', 'state-transition-completed', {
    orderId,
    from,
    to,
    timestamp: new Date().toISOString(),
  });

  return {
    success: true,
    order: {
      ...order,
      paymentState: to.payment,
      fulfillmentState: to.fulfillment,
      inCart: { active: true, stationId: null, since: new Date().toISOString() },
    } as typeof order,
    from,
    to,
    timestamp: new Date().toISOString(),
  };
};
