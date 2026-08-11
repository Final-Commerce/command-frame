import { RedeemRefund, RedeemRefundParams, RedeemRefundResponse } from './types';
import { MOCK_ORDERS, mockPublishEvent } from '../../demo/database';

// Payment states in which an order is refundable
const REFUNDABLE_PAYMENT_STATES = ['paid', 'partially_refunded'];

export const mockRedeemRefund: RedeemRefund = async (params: RedeemRefundParams): Promise<RedeemRefundResponse> => {
  console.log('[Mock] redeemRefund called', params);

  // Validate required params
  if (!params.amount || params.amount <= 0) {
    throw new Error('Amount must be greater than 0');
  }
  if (!params.referenceId) {
    throw new Error('referenceId is required');
  }

  // Find order
  const order = params.orderId ? MOCK_ORDERS.find((o) => o._id === params.orderId) : MOCK_ORDERS[0];
  if (!order) {
    throw new Error(`Order with ID ${params.orderId} not found`);
  }
  const orderId = order._id;

  // Check if order is in a refundable state
  if (!REFUNDABLE_PAYMENT_STATES.includes(order.paymentState as string)) {
    throw new Error(
      `ORDER_NOT_REFUNDABLE: order ${orderId} is '${order.paymentState}' — only 'paid' or 'partially_refunded' orders can be refunded`,
    );
  }

  // Check if amount is within refundable capacity
  if (params.amount > order.summary.total) {
    throw new Error(`Refund amount ${params.amount} exceeds order total ${order.summary.total}`);
  }

  // Update order state based on refund amount
  const remainingAfterRefund = order.summary.total - params.amount;
  if (remainingAfterRefund > 0) {
    order.paymentState = 'partially_refunded';
  } else {
    order.paymentState = 'refunded';
  }

  // Publish refund event
  mockPublishEvent('refunds', 'refund-created', {
    orderId,
    amount: params.amount,
    referenceId: params.referenceId,
    processor: params.processor || 'giftCard',
    label: params.label,
    reason: params.reason,
  });

  return {
    success: true,
    orderId,
    amount: params.amount,
    referenceId: params.referenceId,
    legCount: 1,
    timestamp: new Date().toISOString(),
  };
};
