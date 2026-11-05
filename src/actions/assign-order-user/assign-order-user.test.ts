import { describe, it, expect, vi } from 'vitest';
import { assignOrderUser } from './action';
import { mockAssignOrderUser } from './mock';
import { mockGetOrders } from '../get-orders/mock';
import { MOCK_USERS } from '../../demo/database';

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
    const [entry] = first.assignedUser;
    expect(entry.userId).toBe('user_mario');
    expect(Number.isNaN(Date.parse(entry.assignedAt))).toBe(false);

    const repeat = await mockAssignOrderUser({ orderId: 'order_1004', userId: 'user_mario' });
    expect(repeat.assignedUser).toEqual(first.assignedUser);

    const mine = await mockGetOrders({ assignedUserId: 'user_mario' });
    expect(mine.orders.map((o) => o._id)).toEqual(['order_1004']);

    const cleared = await mockAssignOrderUser({ orderId: 'order_1004', userId: null });
    expect(cleared.assignedUser).toHaveLength(1);
    expect(cleared.assignedUser[0].unassignedAt).toBeTruthy();
    expect((await mockGetOrders({ assignedUserId: 'user_mario' })).orders).toEqual([]);
  });

  it('keeps everyone who had the order, one current assignee per label', async () => {
    const [mario, luigi] = MOCK_USERS.map((u) => u.id);
    const [driverA, driverB, cook] = [luigi, mario, mario];
    await mockAssignOrderUser({ orderId: 'order_1003', userId: driverA, label: 'delivery' });
    await mockAssignOrderUser({ orderId: 'order_1003', userId: cook, label: 'kitchen' });
    const handedOver = await mockAssignOrderUser({ orderId: 'order_1003', userId: driverB, label: 'delivery' });

    expect(handedOver.assignedUser.map((a) => [a.userId, a.label, Boolean(a.unassignedAt)])).toEqual([
      [driverA, 'delivery', true],
      [cook, 'kitchen', false],
      [driverB, 'delivery', false],
    ]);

    const ids = async (params: Parameters<typeof mockGetOrders>[0]) =>
      (await mockGetOrders(params)).orders.map((o) => o._id).filter((id) => id === 'order_1003');
    expect(await ids({ assignedUserId: driverA })).toEqual([]);
    expect(await ids({ assignedUserId: driverB, assignedUserLabel: 'delivery' })).toEqual(['order_1003']);
    expect(await ids({ assignedUserId: driverA, assignedUserLabel: 'kitchen' })).toEqual([]);

    await mockAssignOrderUser({ orderId: 'order_1003', userId: null, label: 'delivery' });
    expect(await ids({ assignedUserId: null, assignedUserLabel: 'delivery' })).toEqual(['order_1003']);
    expect(await ids({ assignedUserId: null })).toEqual([]);
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
