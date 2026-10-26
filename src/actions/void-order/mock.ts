import { VoidOrder, VoidOrderParams, VoidOrderResponse } from './types';
import { MOCK_ORDERS, mockPublishEvent } from '../../demo/database';

// Mirrors the runtime gate (kaching's void-order/handler.ts): an order is
// voidable while it is still OPEN, or when it is PAID but was never fulfilled
// (still in the kitchen). Anything else (a handed-over paid order,
// partially_refunded, refunded, voided, or unknown) is ORDER_NOT_VOIDABLE.
const OPEN_PAYMENT_STATES = ['unpaid', 'payment_pending', 'partially_paid'];
const UNFULFILLED_STATES = ['draft', 'pending', 'on_hold'];

type MockOrder = (typeof MOCK_ORDERS)[number];

// No orderId means the order in the cart, never just any order: the runtime refuses an
// id-less void unless the order is the live cart's (a finished sale kept for receipts is
// not), and a legacy order with no cart flag counts only while it is still open. The demo
// has no stations, so the flag alone decides.
const isCartOrder = (o: MockOrder): boolean =>
  o.inCart != null
    ? o.inCart.active
    : OPEN_PAYMENT_STATES.includes(o.paymentState as string) &&
      (o.fulfillmentState ? o.fulfillmentState === 'draft' : o.status === 'in-cart');

export const mockVoidOrder: VoidOrder = async (params?: VoidOrderParams): Promise<VoidOrderResponse> => {
  console.log('[Mock] voidOrder called', params);

  const order = params?.orderId ? MOCK_ORDERS.find((o) => o._id === params.orderId) : MOCK_ORDERS.find(isCartOrder);
  if (!order) {
    throw new Error(
      params?.orderId ? `Order with ID ${params.orderId} not found` : 'No order selected. Please provide orderId.',
    );
  }
  const orderId = order._id;

  const paidUnfulfilled =
    order.paymentState === 'paid' && UNFULFILLED_STATES.includes(order.fulfillmentState as string);
  if (!OPEN_PAYMENT_STATES.includes(order.paymentState as string) && !paidUnfulfilled) {
    throw new Error(
      `ORDER_NOT_VOIDABLE: order ${orderId} is '${order.paymentState}' — use the refund flow for completed orders`,
    );
  }

  const hasCapturedLegs = (order.paymentMethods?.length ?? 0) > 0;
  const outcome = hasCapturedLegs ? 'refunded' : 'voided';

  order.paymentState = outcome;
  order.fulfillmentState = 'cancelled';
  mockPublishEvent('orders', 'order-voided', { orderId, outcome, reason: params?.reason });

  return { success: true, orderId, outcome, timestamp: new Date().toISOString() };
};
