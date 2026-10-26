import { describe, it, expect, vi } from 'vitest';
import { assignOrderUser } from './action';
import { mockAssignOrderUser } from './mock';
import { mockGetOrders } from '../get-orders/mock';

vi.mock('../../client', () => ({
  commandFrameClient: {
    call: vi.fn(),
  },
}));

import { commandFrameClient } from '../../client';

const mockCall = vi.mocked(commandFrameClient).call;

describe('assignOrderUser action', () => {
  it('calls commandFrameClient with assignOrderUser and params', async () => {
    mockCall.mockResolvedValue({ success: true });

    await assignOrderUser({ orderId: 'o1', userId: 'u1' });

    expect(mockCall).toHaveBeenCalledWith('assignOrderUser', { orderId: 'o1', userId: 'u1' });
  });
});

describe('assignOrderUser mock', () => {
  it('assigns, keeps assignedAt on a repeat, filters, then unassigns', async () => {
    const first = await mockAssignOrderUser({ orderId: 'order_1004', userId: 'user_mario' });
    expect(first.assignedUser?.userId).toBe('user_mario');
    expect(Number.isNaN(Date.parse(first.assignedUser!.assignedAt))).toBe(false);

    const repeat = await mockAssignOrderUser({ orderId: 'order_1004', userId: 'user_mario' });
    expect(repeat.assignedUser).toEqual(first.assignedUser);

    const mine = await mockGetOrders({ assignedUserId: 'user_mario' });
    expect(mine.orders.map((o) => o._id)).toEqual(['order_1004']);

    const cleared = await mockAssignOrderUser({ orderId: 'order_1004', userId: null });
    expect(cleared.assignedUser).toBeNull();
    expect((await mockGetOrders({ assignedUserId: 'user_mario' })).orders).toEqual([]);
  });

  it('rejects an unknown user and an unknown order', async () => {
    await expect(mockAssignOrderUser({ orderId: 'order_1004', userId: 'nobody' })).rejects.toThrow(
      'User with ID nobody not found',
    );
    await expect(mockAssignOrderUser({ orderId: 'nope', userId: 'user_mario' })).rejects.toThrow(
      'Order with ID nope not found',
    );
  });
});
