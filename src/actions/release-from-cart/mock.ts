import type { ReleaseFromCart, ReleaseFromCartResponse } from './types';
import type { CFActiveOrder } from '../../CommonTypes';
import { MOCK_CART, MOCK_ORDERS, resetMockCart, mockPublishEvent } from '../../demo/database';

export const mockReleaseFromCart: ReleaseFromCart = async (): Promise<ReleaseFromCartResponse> => {
  console.log('[Mock] releaseFromCart called');

  if (!MOCK_CART.products.length) {
    throw new Error('releaseFromCart: the cart is empty');
  }

  const now = new Date().toISOString();
  // Best-effort: the demo has no live-cart order, so the cart becomes a new unpaid draft.
  const order = {
    _id: `order_released_${Date.now()}`,
    receiptId: `REL-${MOCK_ORDERS.length + 1}`,
    status: 'in-cart',
    paymentState: 'unpaid',
    fulfillmentState: 'draft',
    inCart: { active: false, stationId: null, since: now },
    lineItems: [],
    customSales: [],
    paymentMethods: [],
    summary: { total: MOCK_CART.total },
    createdAt: now,
  } as unknown as CFActiveOrder;

  MOCK_ORDERS.push(order);
  resetMockCart();
  mockPublishEvent('orders', 'order-updated', { order });

  return { success: true, order, timestamp: now };
};
