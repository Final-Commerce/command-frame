import type { SetOrderType, SetOrderTypeParams, SetOrderTypeResponse } from './types';
import { MOCK_ORDERS, MOCK_PARKED_ORDERS, mockPublishEvent } from '../../demo/database';

/** Type for the demo's live cart, which has no order until it is paid or parked. */
let mockCartOrderType: string | null = null;

export const normalizeOrderType = (value: unknown): string | null => {
  if (value === null) return null;
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error('setOrderType: orderType must be a non-empty string or null');
  }
  return value.trim();
};

export const mockSetOrderType: SetOrderType = async (params: SetOrderTypeParams): Promise<SetOrderTypeResponse> => {
  console.log('[Mock] setOrderType called', params);

  const orderType = normalizeOrderType(params?.orderType);
  const timestamp = new Date().toISOString();

  if (!params.orderId) {
    mockCartOrderType = orderType;
    return { success: true, orderId: null, orderType: mockCartOrderType, timestamp };
  }

  const order = [...MOCK_ORDERS, ...MOCK_PARKED_ORDERS].find((o) => o._id === params.orderId);
  if (!order) {
    throw new Error(`Order with ID ${params.orderId} not found`);
  }

  order.orderType = orderType;
  mockPublishEvent('orders', 'order-updated', { order });

  return { success: true, orderId: order._id!, orderType, timestamp };
};
