import { RedeemRefund, RedeemRefundParams, RedeemRefundResponse } from './types';
import { MOCK_ORDERS, mockPublishEvent } from '../../demo/database';

// Payment states in which an order is refundable
const REFUNDABLE_PAYMENT_STATES = ['paid', 'partially_refunded'];

// Track refunded amounts per order to enforce remaining capacity gate
const mockRefundedAmounts: Record<string, number> = {};

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

  // Track refunded amounts and check remaining capacity
  const refundedSoFar = mockRefundedAmounts[orderId] || 0;
  const remainingCapacity = order.summary.total - refundedSoFar;

  if (params.amount > remainingCapacity) {
    throw new Error(
      `REFUND_AMOUNT_EXCEEDS_CAPACITY: Refund amount ${params.amount} exceeds remaining refundable capacity ${remainingCapacity}`,
    );
  }

  // Update refunded amount tracking
  const refundedAfter = refundedSoFar + params.amount;
  mockRefundedAmounts[orderId] = refundedAfter;

  // Update order state based on remaining capacity after this refund
  const remainingAfterRefund = order.summary.total - refundedAfter;
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
