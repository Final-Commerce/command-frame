import type { AssignOrderUser, AssignOrderUserParams, AssignOrderUserResponse } from './types';
import { MOCK_ORDERS, MOCK_PARKED_ORDERS, MOCK_USERS, mockPublishEvent } from '../../demo/database';

export const mockAssignOrderUser: AssignOrderUser = async (
  params: AssignOrderUserParams,
): Promise<AssignOrderUserResponse> => {
  console.log('[Mock] assignOrderUser called', params);

  if (!params?.orderId) {
    throw new Error('assignOrderUser: the demo has no live-cart order — pass an orderId');
  }
  if (params.userId !== null && typeof params.userId !== 'string') {
    throw new Error('assignOrderUser: userId must be a user id or null');
  }

  const order = [...MOCK_ORDERS, ...MOCK_PARKED_ORDERS].find((o) => o._id === params.orderId);
  if (!order) {
    throw new Error(`Order with ID ${params.orderId} not found`);
  }

  if (params.userId === null) {
    order.assignedUser = null;
  } else if (order.assignedUser?.userId !== params.userId) {
    if (!MOCK_USERS.some((u) => u.id === params.userId)) {
      throw new Error(`User with ID ${params.userId} not found`);
    }
    order.assignedUser = { userId: params.userId, assignedAt: new Date().toISOString() };
  }

  mockPublishEvent('orders', 'order-updated', { order });

  return {
    success: true,
    orderId: order._id!,
    assignedUser: order.assignedUser ?? null,
    timestamp: new Date().toISOString(),
  };
};
