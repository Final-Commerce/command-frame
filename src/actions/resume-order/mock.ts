import type { ResumeOrder, ResumeOrderParams, ResumeOrderResponse } from './types';
import { MOCK_ORDERS, MOCK_PARKED_ORDERS, mockPublishEvent } from '../../demo/database';
import { restoreMockCartFromOrder } from '../resume-parked-order/mock';

// Mirrors the host's eligibility rule (see README): open money, open fulfillment, not already the cart.
const RESUMABLE_PAYMENT = new Set(['unpaid', 'partially_paid', 'paid']);
const RESUMABLE_FULFILLMENT = new Set(['pending', 'on_hold', 'in_progress', 'partially_fulfilled']);

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
  if (!RESUMABLE_PAYMENT.has(from.payment) || !RESUMABLE_FULFILLMENT.has(from.fulfillment)) {
    throw new Error(`Order ${orderId} cannot be resumed from ${from.payment} × ${from.fulfillment}`);
  }

  const to = {
    payment: from.payment,
    fulfillment:
      from.payment === 'unpaid'
        ? 'draft'
        : from.fulfillment === 'in_progress' || from.fulfillment === 'partially_fulfilled'
          ? from.fulfillment
          : 'in_progress',
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
    order: { ...order, paymentState: to.payment, fulfillmentState: to.fulfillment } as typeof order,
    from,
    to,
    timestamp: new Date().toISOString(),
  };
};
